package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 货币视图对象
 *
 * @author CrossBorder Team
 * @since 2026-02-08
 */
@Data
public class CurrencyVO {

    @Schema(description = "货币ID")
    private Long id;

    @Schema(description = "货币代码")
    private String currencyCode;

    @Schema(description = "货币名称")
    private String currencyName;

    @Schema(description = "货币符号")
    private String symbol;

    @Schema(description = "是否基准货币")
    private Integer isBase;

    @Schema(description = "状态")
    private Integer status;

    @Schema(description = "排序号")
    private Integer sort;
}
