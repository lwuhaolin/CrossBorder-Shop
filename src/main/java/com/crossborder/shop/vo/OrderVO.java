package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单VO
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "订单信息")
public class OrderVO {

    @Schema(description = "订单ID")
    private Long id;

    @Schema(description = "订单号")
    private String orderNumber;

    @Schema(description = "买家ID")
    private Long buyerId;

    @Schema(description = "卖家ID")
    private Long sellerId;

    @Schema(description = "订单状态")
    private Integer orderStatus;

    @Schema(description = "支付状态")
    private Integer paymentStatus;

    @Schema(description = "订单总金额")
    private BigDecimal totalAmount;

    @Schema(description = "商品总金额")
    private BigDecimal productAmount;

    @Schema(description = "运费")
    private BigDecimal freightAmount;

    @Schema(description = "优惠金额")
    private BigDecimal discountAmount;

    @Schema(description = "原币种")
    private String currency;

    @Schema(description = "汇率")
    private BigDecimal exchangeRate;

    @Schema(description = "换算后金额")
    private BigDecimal convertedAmount;

    @Schema(description = "目标币种")
    private String targetCurrency;

    @Schema(description = "支付方式")
    private String paymentMethod;

    @Schema(description = "支付时间")
    private LocalDateTime paymentTime;

    @Schema(description = "支付流水号")
    private String paymentTransactionId;

    @Schema(description = "发货时间")
    private LocalDateTime shipTime;

    @Schema(description = "完成时间")
    private LocalDateTime completeTime;

    @Schema(description = "取消时间")
    private LocalDateTime cancelTime;

    @Schema(description = "取消原因")
    private String cancelReason;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "买家留言")
    private String buyerMessage;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "订单明细列表")
    private List<OrderItemVO> items;

    @Schema(description = "收货地址")
    private OrderAddressVO address;
}
