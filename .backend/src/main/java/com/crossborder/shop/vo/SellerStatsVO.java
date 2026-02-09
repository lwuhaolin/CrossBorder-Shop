package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 卖家统计信息VO
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Data
@Schema(description = "卖家统计信息")
public class SellerStatsVO {

    @Schema(description = "商品总数")
    private Long totalProducts;

    @Schema(description = "在售商品")
    private Long activeProducts;

    @Schema(description = "订单总数")
    private Long totalOrders;

    @Schema(description = "待发货订单")
    private Long pendingOrders;

    @Schema(description = "已完成订单")
    private Long completedOrders;

    @Schema(description = "总销售额")
    private BigDecimal totalRevenue;

    @Schema(description = "今日销售额")
    private BigDecimal revenueToday;

    @Schema(description = "本月销售额")
    private BigDecimal revenueThisMonth;

    @Schema(description = "销售总数")
    private Long totalSales;
}
