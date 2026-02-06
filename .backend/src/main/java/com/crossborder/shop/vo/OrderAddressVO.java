package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 订单地址VO
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "订单收货地址信息")
public class OrderAddressVO {

    @Schema(description = "订单地址ID")
    private Long id;

    @Schema(description = "收货人姓名")
    private String receiverName;

    @Schema(description = "收货人电话")
    private String receiverPhone;

    @Schema(description = "国家")
    private String country;

    @Schema(description = "省份")
    private String province;

    @Schema(description = "城市")
    private String city;

    @Schema(description = "区县")
    private String district;

    @Schema(description = "详细地址")
    private String detailAddress;

    @Schema(description = "邮编")
    private String postalCode;
}
