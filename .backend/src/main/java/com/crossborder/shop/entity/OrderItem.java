package com.crossborder.shop.entity;

import com.crossborder.shop.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 订单明细实体
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OrderItem extends BaseEntity {

    /**
     * 订单ID
     */
    private Long orderId;

    /**
     * 订单号
     */
    private String orderNumber;

    /**
     * 商品ID
     */
    private Long productId;

    /**
     * 商品名称（冗余）
     */
    private String productName;

    /**
     * 商品编码（冗余）
     */
    private String productCode;

    /**
     * 商品图片（冗余）
     */
    private String imageUrl;

    /**
     * SKU ID
     */
    private Long skuId;

    /**
     * SKU名称（冗余）
     */
    private String skuName;

    /**
     * 商品单价
     */
    private BigDecimal price;

    /**
     * 购买数量
     */
    private Integer quantity;

    /**
     * 小计金额
     */
    private BigDecimal totalPrice;
}
