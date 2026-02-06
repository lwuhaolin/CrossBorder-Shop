package com.crossborder.shop.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * 创建订单DTO
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@Schema(description = "创建订单请求")
public class CreateOrderDTO {

    @NotNull(message = "收货地址ID不能为空")
    @Schema(description = "收货地址ID", example = "1")
    private Long addressId;

    @NotNull(message = "目标币种不能为空")
    @Schema(description = "目标币种（用于汇率转换）", example = "USD")
    private String targetCurrency;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "商品ID列表（如不传则使用购物车选中商品）")
    private List<Long> productIds;
}
