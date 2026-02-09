package com.crossborder.shop.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;

/**
 * 卖家统计Mapper
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Mapper
public interface SellerStatsMapper {

    /**
     * 统计卖家商品总数
     */
    long countTotalProducts(@Param("sellerId") Long sellerId);

    /**
     * 统计卖家在售商品数
     */
    long countActiveProducts(@Param("sellerId") Long sellerId);

    /**
     * 统计卖家订单总数
     */
    long countTotalOrders(@Param("sellerId") Long sellerId);

    /**
     * 统计卖家待发货订单数
     */
    long countPendingOrders(@Param("sellerId") Long sellerId);

    /**
     * 统计卖家已完成订单数
     */
    long countCompletedOrders(@Param("sellerId") Long sellerId);

    /**
     * 统计卖家总销售额
     */
    BigDecimal sumTotalRevenue(@Param("sellerId") Long sellerId);

    /**
     * 统计卖家今日销售额
     */
    BigDecimal sumRevenueToday(@Param("sellerId") Long sellerId);

    /**
     * 统计卖家本月销售额
     */
    BigDecimal sumRevenueThisMonth(@Param("sellerId") Long sellerId);

    /**
     * 统计卖家销售总数
     */
    long countTotalSales(@Param("sellerId") Long sellerId);
}
