package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.OrderItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 订单明细Mapper接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Mapper
public interface OrderItemMapper {

    /**
     * 根据订单ID查询明细列表
     */
    List<OrderItem> selectByOrderId(@Param("orderId") Long orderId);

    /**
     * 插入订单明细
     */
    int insert(OrderItem orderItem);

    /**
     * 批量插入订单明细
     */
    int batchInsert(@Param("items") List<OrderItem> items);
}
