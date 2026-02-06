package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 订单Mapper接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Mapper
public interface OrderMapper {

    /**
     * 根据ID查询
     */
    Order selectById(@Param("id") Long id);

    /**
     * 根据订单号查�?
     */
    Order selectByOrderNumber(@Param("orderNumber") String orderNumber);

    /**
     * 根据买家ID查询订单列表
     */
    List<Order> selectByBuyerId(@Param("buyerId") Long buyerId, @Param("orderStatus") Integer orderStatus);

    /**
     * 根据卖家ID查询订单列表
     */
    List<Order> selectBySellerId(@Param("sellerId") Long sellerId, @Param("orderStatus") Integer orderStatus);

    /**
     * 插入订单
     */
    int insert(Order order);

    /**
     * 更新订单
     */
    int updateById(Order order);

    /**
     * 更新订单状�?
     */
    int updateStatus(@Param("id") Long id, @Param("orderStatus") Integer orderStatus);
}
