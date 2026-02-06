package com.crossborder.shop.entity;

import com.crossborder.shop.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单实体
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Order extends BaseEntity {

    /**
     * 订单号
     */
    private String orderNumber;

    /**
     * 买家ID
     */
    private Long buyerId;

    /**
     * 卖家ID
     */
    private Long sellerId;

    /**
     * 订单状态：0-待支付，1-待发货，2-已发货，3-已完成，4-已取消，5-已退款
     */
    private Integer orderStatus;

    /**
     * 订单总金额
     */
    private BigDecimal totalAmount;

    /**
     * 商品总金额
     */
    private BigDecimal productAmount;

    /**
     * 运费
     */
    private BigDecimal freightAmount;

    /**
     * 优惠金额
     */
    private BigDecimal discountAmount;

    /**
     * 原币种
     */
    private String currency;

    /**
     * 汇率
     */
    private BigDecimal exchangeRate;

    /**
     * 换算后金额（目标币种）
     */
    private BigDecimal convertedAmount;

    /**
     * 目标币种
     */
    private String targetCurrency;

    /**
     * 支付状态：0-未支付，1-已支付，2-已退款
     */
    private Integer paymentStatus;

    /**
     * 支付方式
     */
    private String paymentMethod;

    /**
     * 支付时间
     */
    private LocalDateTime paymentTime;

    /**
     * 支付流水号
     */
    private String paymentTransactionId;

    /**
     * 发货时间
     */
    private LocalDateTime shipTime;

    /**
     * 完成时间
     */
    private LocalDateTime completeTime;

    /**
     * 取消时间
     */
    private LocalDateTime cancelTime;

    /**
     * 取消原因
     */
    private String cancelReason;

    /**
     * 备注
     */
    private String remark;

    /**
     * 买家留言
     */
    private String buyerMessage;

    /**
     * 版本号
     */
    private Integer version;
}
