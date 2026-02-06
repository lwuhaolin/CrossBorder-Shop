package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 订单明细VO
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "订单明细信息")
public class OrderItemVO {

    @Schema(description = "订单明细ID")
    private Long id;

    @Schema(description = "商品ID")
    private Long productId;

    @Schema(description = "商品名称")
    private String productName;

    @Schema(description = "商品编码")
    private String productCode;

    @Schema(description = "商品图片")
    private String imageUrl;

    @Schema(description = "SKU ID")
    private Long skuId;

    @Schema(description = "SKU名称")
    private String skuName;

    @Schema(description = "商品单价")
    private BigDecimal price;

    @Schema(description = "购买数量")
    private Integer quantity;

    @Schema(description = "小计金额")
    private BigDecimal totalPrice;
}
