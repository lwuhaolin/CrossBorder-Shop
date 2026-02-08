package com.crossborder.shop.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

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

    /**
     * 自定义equals方法，只基于orderId进行比较
     * 这样可以正确地从Redis延迟队列中移除任务
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderTimeoutTask that = (OrderTimeoutTask) o;
        return Objects.equals(orderId, that.orderId);
    }

    /**
     * 自定义hashCode方法，只基于orderId
     */
    @Override
    public int hashCode() {
        return Objects.hash(orderId);
    }
}
