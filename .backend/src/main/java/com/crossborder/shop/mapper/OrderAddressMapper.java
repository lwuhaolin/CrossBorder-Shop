package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.OrderAddress;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 订单地址Mapper接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Mapper
public interface OrderAddressMapper {

    /**
     * 根据订单ID查询地址
     */
    OrderAddress selectByOrderId(@Param("orderId") Long orderId);

    /**
     * 插入订单地址
     */
    int insert(OrderAddress orderAddress);
}
