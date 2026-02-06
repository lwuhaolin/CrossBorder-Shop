package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

/**
 * 商品图片视图对象
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@Schema(description = "商品图片视图对象")
public class ProductImageVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "图片ID", example = "1")
    private Long id;

    @Schema(description = "商品ID", example = "1001")
    private Long productId;

    @Schema(description = "图片URL", example = "https://example.com/1.jpg")
    private String imageUrl;

    @Schema(description = "排序号", example = "0")
    private Integer sort;

    @Schema(description = "是否主图：0-否，1-是", example = "1")
    private Integer isMain;
}
