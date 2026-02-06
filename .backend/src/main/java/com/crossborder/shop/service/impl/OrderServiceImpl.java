package com.crossborder.shop.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.crossborder.shop.common.ResultCode;
import com.crossborder.shop.dto.CreateOrderDTO;
import com.crossborder.shop.dto.OrderTimeoutTask;
import com.crossborder.shop.entity.*;
import com.crossborder.shop.exception.BusinessException;
import com.crossborder.shop.mapper.*;
import com.crossborder.shop.service.DelayQueueService;
import com.crossborder.shop.service.OrderService;
import com.crossborder.shop.util.OrderNumberGenerator;
import com.crossborder.shop.vo.OrderAddressVO;
import com.crossborder.shop.vo.OrderItemVO;
import com.crossborder.shop.vo.OrderVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 订单服务实现类
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final int ORDER_STATUS_PENDING_PAYMENT = 0;
    private static final int ORDER_STATUS_PENDING_SHIPMENT = 1;
    private static final int ORDER_STATUS_SHIPPED = 2;
    private static final int ORDER_STATUS_COMPLETED = 3;
    private static final int ORDER_STATUS_CANCELLED = 4;
    private static final int ORDER_STATUS_REFUNDED = 5;

    private static final int PAYMENT_STATUS_UNPAID = 0;
    private static final int PAYMENT_STATUS_PAID = 1;
    private static final int PAYMENT_STATUS_REFUNDED = 2;

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final OrderAddressMapper orderAddressMapper;
    private final ShippingAddressMapper shippingAddressMapper;
    private final CartMapper cartMapper;
    private final CartItemMapper cartItemMapper;
    private final ProductMapper productMapper;
    private final OrderNumberGenerator orderNumberGenerator;
    private final DelayQueueService delayQueueService;

    @Value("${order.timeout-minutes:15}")
    private int orderTimeoutMinutes;

    @Value("${order.stock-retry-times:3}")
    private int stockRetryTimes;

    /**
     * 创建订单 - 11步核心流程
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createOrder(Long userId, CreateOrderDTO dto) {
        // 1. 校验收货地址
        ShippingAddress address = shippingAddressMapper.selectById(dto.getAddressId());
        if (address == null) {
            throw new BusinessException(ResultCode.SHIPPING_ADDRESS_NOT_FOUND);
        }
        if (!address.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权使用该地址");
        }

        // 2. 查询购物车选中商品
        Cart cart = cartMapper.selectByUserId(userId);
        if (cart == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "购物车为空");
        }

        List<CartItem> cartItems = cartItemMapper.selectSelectedByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "请选择要购买的商品");
        }

        // 3. 生成订单号
        String orderNumber = orderNumberGenerator.generateOrderNumber(userId);

        // 4. 循环扣减库存（乐观锁重试）
        List<OrderItem> orderItems = new ArrayList<>();
        Long sellerId = null;
        BigDecimal productAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Product product = productMapper.selectById(cartItem.getProductId());
            if (product == null) {
                throw new BusinessException(ResultCode.PRODUCT_NOT_EXISTS);
            }

            // 校验商品状态
            if (!product.getOnShelf()) {
                throw new BusinessException(ResultCode.PRODUCT_OFF_SHELF, "商品已下架: " + product.getName());
            }

            // 乐观锁扣减库存（带重试）
            boolean success = false;
            for (int i = 0; i < stockRetryTimes; i++) {
                int updated = productMapper.decreaseStock(
                        product.getId(),
                        cartItem.getQuantity(),
                        product.getVersion());

                if (updated > 0) {
                    success = true;
                    break;
                }

                // 重新查询最新版本
                product = productMapper.selectById(product.getId());
                if (product.getStock() < cartItem.getQuantity()) {
                    throw new BusinessException(ResultCode.PRODUCT_STOCK_NOT_ENOUGH, "商品库存不足: " + product.getName());
                }

                // 指数退避
                try {
                    Thread.sleep(50 * (1L << i)); // 50ms, 100ms, 200ms
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new BusinessException(ResultCode.INTERNAL_SERVER_ERROR, "库存扣减失败");
                }
            }

            if (!success) {
                throw new BusinessException(ResultCode.PRODUCT_STOCK_NOT_ENOUGH, "库存扣减失败，请重试");
            }

            // 记录卖家ID（简化处理：假设一个订单只有一个卖家）
            if (sellerId == null) {
                sellerId = product.getSellerId();
            }

            // 构建订单明细
            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setOrderNumber(orderNumber);
            orderItem.setProductCode(product.getProductCode());
            orderItem.setImageUrl(product.getImage());
            orderItem.setSkuId(cartItem.getSkuId());
            orderItem.setSkuName(null);
            orderItem.setPrice(product.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(product.getPrice().multiply(new BigDecimal(cartItem.getQuantity())));
            orderItem.setCreateBy(userId);
            orderItem.setUpdateBy(userId);

            orderItems.add(orderItem);
            productAmount = productAmount.add(orderItem.getTotalPrice());
        }

        // 5. 计算汇率转换（简化处理：使用固定汇率，实际应查询汇率表）
        BigDecimal exchangeRate = BigDecimal.ONE; // TODO: 从汇率表查询
        BigDecimal convertedAmount = productAmount.multiply(exchangeRate);

        // 6. 计算订单总金额（商品金额 + 运费 - 优惠）
        BigDecimal freightAmount = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal totalAmount = productAmount.add(freightAmount).subtract(discountAmount);

        // 6. 插入订单主表
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setBuyerId(userId);
        order.setSellerId(sellerId);
        order.setOrderStatus(ORDER_STATUS_PENDING_PAYMENT);
        order.setPaymentStatus(PAYMENT_STATUS_UNPAID);
        order.setTotalAmount(totalAmount);
        order.setProductAmount(productAmount);
        order.setFreightAmount(freightAmount);
        order.setDiscountAmount(discountAmount);
        order.setCurrency("CNY");
        order.setExchangeRate(exchangeRate);
        order.setConvertedAmount(convertedAmount);
        order.setTargetCurrency(dto.getTargetCurrency());
        order.setRemark(dto.getRemark());
        order.setBuyerMessage(null);
        order.setVersion(0);
        order.setDeleted(0);
        order.setCreateBy(userId);
        order.setUpdateBy(userId);

        orderMapper.insert(order);

        // 7. 批量插入订单明细
        for (OrderItem item : orderItems) {
            item.setOrderId(order.getId());

        }
        orderItemMapper.batchInsert(orderItems);

        // 8. 保存地址快照
        OrderAddress orderAddress = new OrderAddress();
        BeanUtil.copyProperties(address, orderAddress, "id");
        orderAddress.setOrderId(order.getId());
        orderAddress.setOrderNumber(orderNumber);
        orderAddress.setDeleted(0);
        orderAddress.setCreateBy(userId);
        orderAddress.setUpdateBy(userId);
        orderAddressMapper.insert(orderAddress);

        // 9. 加入延迟队列（15分钟超时）
        OrderTimeoutTask timeoutTask = new OrderTimeoutTask();
        timeoutTask.setOrderId(order.getId());
        timeoutTask.setOrderNumber(orderNumber);
        timeoutTask.setUserId(userId);
        timeoutTask.setCreateTime(LocalDateTime.now());

        delayQueueService.offer("order-timeout", timeoutTask, orderTimeoutMinutes, TimeUnit.MINUTES);

        // 10. TODO: 保存超时任务记录到数据库（可选，用于持久化）

        // 11. 清空购物车选中商品
        for (CartItem item : cartItems) {
            cartItemMapper.deleteById(item.getId());
        }

        // 购物车总价/总数改为查询时动态计算

        log.info("订单创建成功: orderId={}, orderNumber={}, userId={}, totalAmount={}",
                order.getId(), orderNumber, userId, totalAmount);

        return order.getId();
    }

    /**
     * 取消超时订单
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelTimeoutOrder(Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            log.warn("订单不存在，无法取消: orderId={}", orderId);
            return;
        }

        // 只有待支付状态才能超时取消
        if (order.getOrderStatus() == null || order.getOrderStatus() != ORDER_STATUS_PENDING_PAYMENT) {
            log.info("订单状态不是待支付，无需超时取消: orderId={}, status={}", orderId, order.getOrderStatus());
            return;
        }

        // 恢复库存
        List<OrderItem> items = orderItemMapper.selectByOrderId(orderId);
        for (OrderItem item : items) {
            Product product = productMapper.selectById(item.getProductId());
            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                productMapper.updateById(product);
            }
        }

        // 更新订单状态
        order.setOrderStatus(ORDER_STATUS_CANCELLED);
        order.setPaymentStatus(PAYMENT_STATUS_UNPAID);
        order.setCancelTime(LocalDateTime.now());
        order.setCancelReason("超时未支付，系统自动取消");
        orderMapper.updateById(order);

        log.info("订单超时取消成功: orderId={}, orderNumber={}", orderId, order.getOrderNumber());
    }

    /**
     * 买家取消订单
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelOrder(Long userId, Long orderId, String reason) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException(ResultCode.ORDER_NOT_FOUND);
        }

        // 校验权限
        if (!order.getBuyerId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权取消该订单");
        }

        // 只有待支付状态才能取消
        if (order.getOrderStatus() == null || order.getOrderStatus() != ORDER_STATUS_PENDING_PAYMENT) {
            throw new BusinessException(ResultCode.ORDER_CANNOT_CANCEL);
        }

        // 恢复库存
        List<OrderItem> items = orderItemMapper.selectByOrderId(orderId);
        for (OrderItem item : items) {
            Product product = productMapper.selectById(item.getProductId());
            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                productMapper.updateById(product);
            }
        }

        // 更新订单状态
        order.setOrderStatus(ORDER_STATUS_CANCELLED);
        order.setPaymentStatus(PAYMENT_STATUS_UNPAID);
        order.setCancelTime(LocalDateTime.now());
        order.setCancelReason(reason);
        orderMapper.updateById(order);

        log.info("买家取消订单成功: orderId={}, userId={}, reason={}", orderId, userId, reason);
    }

    /**
     * 买家支付订单
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void payOrder(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException(ResultCode.ORDER_NOT_FOUND);
        }

        // 校验权限
        if (!order.getBuyerId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权操作该订单");
        }

        // 校验状态
        if (order.getOrderStatus() == null || order.getOrderStatus() != ORDER_STATUS_PENDING_PAYMENT) {
            throw new BusinessException(ResultCode.ORDER_STATUS_ERROR, "订单状态不正确");
        }

        // 处理支付逻辑

        // 支付相关逻辑
        order.setOrderStatus(ORDER_STATUS_PENDING_SHIPMENT);
        order.setPaymentStatus(PAYMENT_STATUS_PAID);
        order.setPaymentTime(LocalDateTime.now());
        orderMapper.updateById(order);

        // 支付成功后可触发发货、通知等后续操作
        OrderTimeoutTask task = new OrderTimeoutTask();
        task.setOrderId(orderId);
        delayQueueService.remove("order-timeout", task);

        log.info("订单支付成功: orderId={}, userId={}", orderId, userId);
    }

    /**
     * 卖家发货
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void shipOrder(Long sellerId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException(ResultCode.ORDER_NOT_FOUND);
        }

        // 校验权限
        if (!order.getSellerId().equals(sellerId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权操作该订单");
        }

        // 校验状态
        if (order.getOrderStatus() == null || order.getOrderStatus() != ORDER_STATUS_PENDING_SHIPMENT) {
            throw new BusinessException(ResultCode.ORDER_STATUS_ERROR, "订单状态不正确");
        }

        // 更新订单状态
        order.setOrderStatus(ORDER_STATUS_SHIPPED);
        order.setShipTime(LocalDateTime.now());
        orderMapper.updateById(order);

        log.info("订单发货成功: orderId={}, sellerId={}", orderId, sellerId);
    }

    /**
     * 买家确认收货
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void confirmOrder(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException(ResultCode.ORDER_NOT_FOUND);
        }

        // 校验权限
        if (!order.getBuyerId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权操作该订单");
        }

        // 校验状态
        if (order.getOrderStatus() == null || order.getOrderStatus() != ORDER_STATUS_SHIPPED) {
            throw new BusinessException(ResultCode.ORDER_STATUS_ERROR, "订单状态不正确");
        }

        // 更新订单状态
        order.setOrderStatus(ORDER_STATUS_COMPLETED);
        order.setCompleteTime(LocalDateTime.now());
        orderMapper.updateById(order);

        log.info("订单确认收货成功: orderId={}, userId={}", orderId, userId);
    }

    /**
     * 查询订单详情
     */
    @Override
    public OrderVO getOrderById(Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException(ResultCode.ORDER_NOT_FOUND);
        }
        return buildOrderVO(order);
    }

    /**
     * 根据订单号查询
     */
    @Override
    public OrderVO getOrderByNumber(String orderNumber) {
        Order order = orderMapper.selectByOrderNumber(orderNumber);
        if (order == null) {
            throw new BusinessException(ResultCode.ORDER_NOT_FOUND);
        }
        return buildOrderVO(order);
    }

    /**
     * 查询买家订单列表
     */
    @Override
    public List<OrderVO> getBuyerOrders(Long buyerId, Integer orderStatus) {
        List<Order> orders = orderMapper.selectByBuyerId(buyerId, orderStatus);
        return orders.stream()
                .map(this::buildOrderVO)
                .collect(Collectors.toList());
    }

    /**
     * 查询卖家订单列表
     */
    @Override
    public List<OrderVO> getSellerOrders(Long sellerId, Integer orderStatus) {
        List<Order> orders = orderMapper.selectBySellerId(sellerId, orderStatus);
        return orders.stream()
                .map(this::buildOrderVO)
                .collect(Collectors.toList());
    }

    /**
     * 构建订单VO
     */
    private OrderVO buildOrderVO(Order order) {
        OrderVO vo = BeanUtil.copyProperties(order, OrderVO.class);

        // 查询订单明细
        List<OrderItem> items = orderItemMapper.selectByOrderId(order.getId());
        List<OrderItemVO> itemVOs = items.stream()
                .map(item -> BeanUtil.copyProperties(item, OrderItemVO.class))
                .collect(Collectors.toList());
        vo.setItems(itemVOs);

        // 查询收货地址
        OrderAddress address = orderAddressMapper.selectByOrderId(order.getId());
        if (address != null) {
            OrderAddressVO addressVO = BeanUtil.copyProperties(address, OrderAddressVO.class);
            vo.setAddress(addressVO);
        }

        return vo;
    }
}
