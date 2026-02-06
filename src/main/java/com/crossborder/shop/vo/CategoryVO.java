package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 分类视图对象（树形结构）
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@Schema(description = "分类视图对象")
public class CategoryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "分类ID", example = "1")
    private Long id;

    @Schema(description = "父分类ID", example = "0")
    private Long parentId;

    @Schema(description = "分类名称", example = "鲜花")
    private String categoryName;

    @Schema(description = "分类编码", example = "FLOWER")
    private String categoryCode;

    @Schema(description = "分类层级", example = "1")
    private Integer level;

    @Schema(description = "排序号", example = "1")
    private Integer sort;

    @Schema(description = "分类图标URL", example = "https://example.com/icon.png")
    private String icon;

    @Schema(description = "状态：0-禁用，1-启用", example = "1")
    private Integer status;

    @Schema(description = "分类描述", example = "用于展示鲜花类商品")
    private String description;

    @Schema(description = "创建时间", example = "2026-02-06T12:00:00")
    private LocalDateTime createTime;

    @Schema(description = "子分类列表")
    private List<CategoryVO> children = new ArrayList<>();
}
