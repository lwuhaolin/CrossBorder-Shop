package com.crossborder.shop.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 订单发货DTO
 *
 * @author CrossBorder Shop
 * @since 2026-02-07
 */
@Data
@Schema(description = "订单发货请求")
public class OrderShipDTO {

    @Schema(description = "物流单号")
    private String trackingNo;

    @Schema(description = "物流公司")
    private String shippingCompany;

    @Schema(description = "物流公司编码")
    private String shippingCompanyCode;

    @Schema(description = "备注")
    private String remark;
}