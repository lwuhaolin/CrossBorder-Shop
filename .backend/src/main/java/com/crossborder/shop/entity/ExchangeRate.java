package com.crossborder.shop.entity;

import com.crossborder.shop.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 汇率实体
 *
 * @author CrossBorder Team
 * @since 2026-02-08
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ExchangeRate extends BaseEntity {

    @Schema(description = "源货币代码", example = "CNY")
    private String fromCurrency;

    @Schema(description = "目标货币代码", example = "USD")
    private String toCurrency;

    @Schema(description = "汇率（1源货币=rate目标货币）", example = "0.1400")
    private BigDecimal rate;
}
