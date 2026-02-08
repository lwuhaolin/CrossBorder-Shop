package com.crossborder.shop.entity;

import com.crossborder.shop.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 货币实体
 *
 * @author CrossBorder Team
 * @since 2026-02-08
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Currency extends BaseEntity {

    @Schema(description = "货币代码", example = "USD")
    private String currencyCode;

    @Schema(description = "货币名称", example = "美元")
    private String currencyName;

    @Schema(description = "货币符号", example = "$")
    private String symbol;

    @Schema(description = "是否基准货币：0-否，1-是", example = "0")
    private Integer isBase;

    @Schema(description = "状态：0-禁用，1-启用", example = "1")
    private Integer status;

    @Schema(description = "排序号", example = "1")
    private Integer sort;
}
