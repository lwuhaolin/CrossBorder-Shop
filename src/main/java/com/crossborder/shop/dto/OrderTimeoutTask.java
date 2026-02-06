package com.crossborder.shop.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 订单超时任务消息
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "订单超时任务消息")
public class OrderTimeoutTask implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "订单ID", example = "1001")
    private Long orderId;

    @Schema(description = "订单号", example = "202602061234567890")
    private String orderNumber;

    @Schema(description = "用户ID", example = "2001")
    private Long userId;

    @Schema(description = "创建时间", example = "2026-02-06T12:00:00")
    private LocalDateTime createTime;
}
