package com.crossborder.shop.entity;

import com.crossborder.shop.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 购物车明细实体
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CartItem extends BaseEntity {

    /**
     * 购物车ID
     */
    private Long cartId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 商品ID
     */
    private Long productId;

    /**
     * 商品SKU ID
     */
    private Long skuId;

    /**
     * 商品数量
     */
    private Integer quantity;

    /**
     * 是否选中（用于结算）
     */
    private Boolean selected;
}
