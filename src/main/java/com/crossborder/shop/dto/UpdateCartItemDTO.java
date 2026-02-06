package com.crossborder.shop.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 更新购物车明细DTO
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@Schema(description = "更新购物车明细请求")
public class UpdateCartItemDTO {

    @NotNull(message = "购物车明细ID不能为空")
    @Schema(description = "购物车明细ID", example = "1")
    private Long id;

    @NotNull(message = "数量不能为空")
    @Min(value = 1, message = "数量至少�?")
    @Schema(description = "数量", example = "2")
    private Integer quantity;

    @Schema(description = "是否选中", example = "true")
    private Boolean selected;
}
