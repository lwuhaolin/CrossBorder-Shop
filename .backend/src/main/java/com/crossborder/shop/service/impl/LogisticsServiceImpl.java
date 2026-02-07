package com.crossborder.shop.service.impl;

import com.crossborder.shop.common.ResultCode;
import com.crossborder.shop.entity.LogisticsCompany;
import com.crossborder.shop.exception.BusinessException;
import com.crossborder.shop.mapper.LogisticsCompanyMapper;
import com.crossborder.shop.service.LogisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

/**
 * 物流服务实现
 *
 * @author CrossBorder Shop
 * @since 2026-02-07
 */
@Service
@RequiredArgsConstructor
public class LogisticsServiceImpl implements LogisticsService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final LogisticsCompanyMapper logisticsCompanyMapper;

    @Override
    public List<LogisticsCompany> listActiveCompanies() {
        return logisticsCompanyMapper.selectActiveList();
    }

    @Override
    public String generateTrackingNo(String companyCode) {
        LogisticsCompany company = logisticsCompanyMapper.selectByCode(companyCode);
        if (company == null || company.getStatus() == null || company.getStatus() != 1) {
            throw new BusinessException(ResultCode.LOGISTICS_NOT_FOUND);
        }

        String timestamp = String.valueOf(System.currentTimeMillis());
        int suffix = 100000 + RANDOM.nextInt(900000);
        return company.getCompanyCode() + timestamp + suffix;
    }
}