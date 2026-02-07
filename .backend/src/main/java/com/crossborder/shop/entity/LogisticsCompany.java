package com.crossborder.shop.entity;

import com.crossborder.shop.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 物流公司实体
 *
 * @author CrossBorder Shop
 * @since 2026-02-07
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LogisticsCompany extends BaseEntity {

    /**
     * 物流公司名称
     */
    private String companyName;

    /**
     * 物流公司编码
     */
    private String companyCode;

    /**
     * 联系方式
     */
    private String contact;

    /**
     * 官网地址
     */
    private String website;

    /**
     * Logo URL
     */
    private String logoUrl;

    /**
     * 状态：0-禁用，1-启用
     */
    private Integer status;

    /**
     * 排序号
     */
    private Integer sort;
}