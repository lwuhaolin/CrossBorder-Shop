package com.crossborder.shop.entity;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 商品图片实体
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
public class ProductImage {

    /**
     * 图片ID
     */
    private Long id;

    /**
     * 商品ID
     */
    private Long productId;

    /**
     * 图片URL
     */
    private String imageUrl;

    /**
     * 排序号
     */
    private Integer sort;

    /**
     * 是否主图（0-否，1-是）
     */
    private Integer isMain;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 删除标记（0-未删除，1-已删除）
     */
    private Integer deleted;
}
