package com.crossborder.shop.service;

import com.crossborder.shop.dto.CreateOrderDTO;
import com.crossborder.shop.dto.OrderShipDTO;
import com.crossborder.shop.vo.OrderVO;

import java.util.List;

/**
 * 订单服务接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
public interface OrderService {

    /**
     * 创建订单
     * 
     * @param userId 用户ID
     * @param dto    创建订单DTO
     * @return 订单ID
     */
    Long createOrder(Long userId, CreateOrderDTO dto);

    /**
     * 取消超时订单
     * 
     * @param orderId 订单ID
     */
    void cancelTimeoutOrder(Long orderId);

    /**
     * 买家取消订单
     * 
     * @param userId  用户ID
     * @param orderId 订单ID
     * @param reason  取消原因
     */
    void cancelOrder(Long userId, Long orderId, String reason);

    /**
     * 买家支付订单
     * 
     * @param userId  用户ID
     * @param orderId 订单ID
     */
    void payOrder(Long userId, Long orderId);

    /**
     * 卖家发货
     * 
     * @param sellerId 卖家ID
     * @param orderId  订单ID
     */
    void shipOrder(Long sellerId, Long orderId, OrderShipDTO dto);

    /**
     * 买家确认收货
     * 
     * @param userId  用户ID
     * @param orderId 订单ID
     */
    void confirmOrder(Long userId, Long orderId);

    /**
     * 根据ID查询订单详情
     * 
     * @param orderId 订单ID
     * @return 订单详情
     */
    OrderVO getOrderById(Long orderId);

    /**
     * 根据订单号查询订单详�?
     * 
     * @param orderNumber 订单�?
     * @return 订单详情
     */
    OrderVO getOrderByNumber(String orderNumber);

    /**
     * 查询买家订单列表
     * 
     * @param buyerId     买家ID
     * @param orderStatus 订单状态（可选）
     * @return 订单列表
     */
    List<OrderVO> getBuyerOrders(Long buyerId, Integer orderStatus);

    /**
     * 查询卖家订单列表
     * 
     * @param sellerId    卖家ID
     * @param orderStatus 订单状态（可选）
     * @return 订单列表
     */
    List<OrderVO> getSellerOrders(Long sellerId, Integer orderStatus);
}
