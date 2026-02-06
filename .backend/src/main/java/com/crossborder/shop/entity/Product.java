package com.crossborder.shop.entity;

import com.crossborder.shop.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 商品实体
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Product extends BaseEntity {

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 商品编码
     */
    private String productCode;

    /**
     * 分类ID
     */
    private Long categoryId;

    /**
     * 卖家用户ID
     */
    private Long sellerId;

    /**
     * 品牌
     */
    private String brand;

    /**
     * 销售价格
     */
    private BigDecimal price;

    /**
     * 原价
     */
    private BigDecimal originalPrice;

    /**
     * 成本价
     */
    private BigDecimal costPrice;

    /**
     * 币种：CNY-人民币，USD-美元，EUR-欧元
     */
    private String currency;

    /**
     * 库存数量
     */
    private Integer stock;

    /**
     * 销量
     */
    private Integer sales;

    /**
     * 单位
     */
    private String unit;

    /**
     * 重量（克）
     */
    private BigDecimal weight;

    /**
     * 体积（立方厘米）
     */
    private BigDecimal volume;

    /**
     * 商品描述
     */
    private String description;

    /**
     * 商品详情
     */
    private String detail;

    /**
     * 状态：0-草稿，1-上架，2-下架，3-售罄
     */
    private Integer status;

    /**
     * 是否推荐：0-否，1-是
     */
    private Integer isRecommend;

    /**
     * 是否新品：0-否，1-是
     */
    private Integer isNew;

    /**
     * 是否热销：0-否，1-是
     */
    private Integer isHot;

    /**
     * 版本号（乐观锁）
     */
    private Integer version;

    /**
     * 是否上架
     */
    private Boolean onShelf;

    /**
     * 主图
     */
    private String image;

    // 便捷方法
    public String getName() {
        return this.productName;
    }

    public void setName(String name) {
        this.productName = name;
    }

    public Boolean getOnShelf() {
        if (this.onShelf != null) {
            return this.onShelf;
        }
        // 根据 status 判断，1 表示上架
        return this.status != null && this.status == 1;
    }
}
