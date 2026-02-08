package com.crossborder.shop.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 汇率数据传输对象
 *
 * @author CrossBorder Team
 * @since 2026-02-08
 */
@Data
public class ExchangeRateDTO {

    @Schema(description = "源货币代码")
    @NotBlank(message = "源货币代码不能为空")
    private String fromCurrency;

    @Schema(description = "目标货币代码")
    @NotBlank(message = "目标货币代码不能为空")
    private String toCurrency;

    @Schema(description = "汇率值")
    @NotNull(message = "汇率不能为空")
    @DecimalMin(value = "0", message = "汇率必须大于等于0")
    private BigDecimal rate;
}
