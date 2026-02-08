package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 系统统计信息VO
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Data
@Schema(description = "系统统计信息")
public class SystemStatsVO {

    @Schema(description = "总用户数")
    private Long totalUsers;

    @Schema(description = "活跃用户数")
    private Long activeUsers;

    @Schema(description = "今日新用户")
    private Long newUsersToday;

    @Schema(description = "商品总数")
    private Long totalProducts;

    @Schema(description = "活跃商品")
    private Long activeProducts;

    @Schema(description = "订单总数")
    private Long totalOrders;

    @Schema(description = "待处理订单")
    private Long pendingOrders;

    @Schema(description = "总营收")
    private BigDecimal totalRevenue;

    @Schema(description = "今日营收")
    private BigDecimal revenueToday;

    @Schema(description = "最后更新时间")
    private LocalDateTime lastUpdateTime;
}
