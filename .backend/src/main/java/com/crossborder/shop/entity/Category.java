package com.crossborder.shop.entity;

import com.crossborder.shop.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 商品分类实体
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Category extends BaseEntity {

    @Schema(description = "父分类ID，0表示根分类", example = "0")
    private Long parentId;

    @Schema(description = "分类名称", example = "鲜花")
    private String categoryName;

    @Schema(description = "分类编码", example = "FLOWER")
    private String categoryCode;

    @Schema(description = "分类层级（1-一级分类，2-二级分类）", example = "1")
    private Integer level;

    @Schema(description = "排序号", example = "1")
    private Integer sort;

    @Schema(description = "分类图标URL", example = "https://example.com/icon.png")
    private String icon;

    @Schema(description = "状态：0-禁用，1-启用", example = "1")
    private Integer status;

    @Schema(description = "分类描述", example = "用于展示鲜花类商品")
    private String description;

    // 便捷方法
    public String getName() {
        return this.categoryName;
    }

    public void setName(String name) {
        this.categoryName = name;
    }
}
