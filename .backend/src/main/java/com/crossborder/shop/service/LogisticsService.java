package com.crossborder.shop.service;

import com.crossborder.shop.entity.LogisticsCompany;

import java.util.List;

/**
 * 物流服务
 *
 * @author CrossBorder Shop
 * @since 2026-02-07
 */
public interface LogisticsService {

    /**
     * 查询启用的物流公司列表
     */
    List<LogisticsCompany> listActiveCompanies();

    /**
     * 生成物流单号
     */
    String generateTrackingNo(String companyCode);
}