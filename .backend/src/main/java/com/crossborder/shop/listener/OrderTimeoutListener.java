package com.crossborder.shop.listener;

import com.crossborder.shop.entity.Order;
import com.crossborder.shop.mapper.OrderMapper;
import com.crossborder.shop.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单超时定时任务
 * 定期扫描数据库中超时未支付的订单并自动取消
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderTimeoutListener {

    private final OrderMapper orderMapper;
    private final OrderService orderService;

    @Value("${order.timeout-minutes:15}")
    private int orderTimeoutMinutes;

    /**
     * 每分钟扫描一次超时未支付订单
     */
    @Scheduled(fixedRate = 60000)
    public void checkTimeoutOrders() {
        LocalDateTime deadline = LocalDateTime.now().minusMinutes(orderTimeoutMinutes);
        List<Order> expiredOrders = orderMapper.selectExpiredPendingOrders(deadline);

        if (expiredOrders == null || expiredOrders.isEmpty()) {
            return;
        }

        log.info("发现{}个超时未支付订单，开始处理", expiredOrders.size());

        for (Order order : expiredOrders) {
            try {
                orderService.cancelTimeoutOrder(order.getId());
                log.info("超时订单已取消: orderId={}, orderNumber={}", order.getId(), order.getOrderNumber());
            } catch (Exception e) {
                log.error("取消超时订单失败: orderId={}, orderNumber={}",
                        order.getId(), order.getOrderNumber(), e);
            }
        }
    }
}
