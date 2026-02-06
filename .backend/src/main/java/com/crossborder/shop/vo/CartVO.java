package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * 购物车VO
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "购物车信息")
public class CartVO {

    @Schema(description = "购物车ID")
    private Long id;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "购物车总价")
    private BigDecimal totalPrice;

    @Schema(description = "商品总数")
    private Integer totalQuantity;

    @Schema(description = "购物车明细列表")
    private List<CartItemVO> items;
}
