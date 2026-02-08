package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 应用配置VO
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Data
@Schema(description = "应用配置VO")
public class AppConfigVO {

    @Schema(description = "应用名称")
    private String appName;

    @Schema(description = "应用版本")
    private String appVersion;

    @Schema(description = "应用描述")
    private String appDescription;

    @Schema(description = "客服邮箱")
    private String supportEmail;

    @Schema(description = "客服电话")
    private String supportPhone;

    @Schema(description = "默认币种")
    private String defaultCurrency;

    @Schema(description = "满额免运费金额")
    private BigDecimal freeshippingThreshold;

    @Schema(description = "默认运费")
    private BigDecimal shippingFee;

    @Schema(description = "最大上传文件大小(MB)")
    private Integer maxUploadSize;

    @Schema(description = "启用用户注册")
    private Boolean enableUserRegistration;

    @Schema(description = "启用卖家注册")
    private Boolean enableSellerRegistration;
}
