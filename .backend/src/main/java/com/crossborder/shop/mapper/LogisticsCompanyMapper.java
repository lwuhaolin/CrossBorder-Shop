package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.LogisticsCompany;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface LogisticsCompanyMapper {

    /**
     * 查询启用的物流公司列表
     */
    List<LogisticsCompany> selectActiveList();

    /**
     * 根据公司编码查询
     */
    LogisticsCompany selectByCode(@Param("companyCode") String companyCode);
}