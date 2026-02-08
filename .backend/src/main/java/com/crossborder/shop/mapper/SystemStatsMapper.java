package com.crossborder.shop.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.math.BigDecimal;

/**
 * 系统统计Mapper
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Mapper
public interface SystemStatsMapper {

    long countTotalUsers();

    long countActiveUsers();

    long countNewUsersToday();

    long countTotalProducts();

    long countActiveProducts();

    long countTotalOrders();

    long countPendingOrders();

    BigDecimal sumTotalRevenue();

    BigDecimal sumRevenueToday();
}
