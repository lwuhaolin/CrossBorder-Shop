package com.crossborder.shop.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * 收货地址DTO
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@Schema(description = "收货地址请求")
public class ShippingAddressDTO {

    @NotBlank(message = "收货人姓名不能为空")
    @Schema(description = "收货人姓名", example = "张三")
    private String receiverName;

    @NotBlank(message = "收货人电话不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    @Schema(description = "收货人电话", example = "13800138000")
    private String receiverPhone;

    @NotBlank(message = "国家不能为空")
    @Schema(description = "国家", example = "中国")
    private String country;

    @NotBlank(message = "省州不能为空")
    @Schema(description = "省州", example = "广东")
    private String province;

    @NotBlank(message = "城市不能为空")
    @Schema(description = "城市", example = "深圳")
    private String city;

    @Schema(description = "区县", example = "南山")
    private String district;

    @NotBlank(message = "详细地址不能为空")
    @Schema(description = "详细地址", example = "科技园南区XX路XX号")
    private String detailAddress;

    @Schema(description = "邮编", example = "518000")
    private String postalCode;

    @Schema(description = "是否设为默认地址", example = "true")
    private Boolean isDefault;
}
