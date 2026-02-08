package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 汇率视图对象
 *
 * @author CrossBorder Team
 * @since 2026-02-08
 */
@Data
public class ExchangeRateVO {

    @Schema(description = "汇率ID")
    private Long id;

    @Schema(description = "源货币代码")
    private String fromCurrency;

    @Schema(description = "目标货币代码")
    private String toCurrency;

    @Schema(description = "汇率值")
    private BigDecimal rate;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}
