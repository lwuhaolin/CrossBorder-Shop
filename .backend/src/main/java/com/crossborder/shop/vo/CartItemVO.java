package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 购物车明细VO
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "购物车明细信息")
public class CartItemVO {

    @Schema(description = "购物车明细ID")
    private Long id;

    @Schema(description = "商品ID")
    private Long productId;

    @Schema(description = "商品名称")
    private String productName;

    @Schema(description = "商品图片")
    private String productImage;

    @Schema(description = "商品SKU ID")
    private Long skuId;

    @Schema(description = "SKU规格")
    private String skuSpec;

    @Schema(description = "商品数量")
    private Integer quantity;

    @Schema(description = "商品单价")
    private BigDecimal price;

    @Schema(description = "小计金额")
    private BigDecimal subtotal;

    @Schema(description = "是否选中")
    private Boolean selected;

    @Schema(description = "库存")
    private Integer stock;

    @Schema(description = "是否上架")
    private Boolean onShelf;
}
