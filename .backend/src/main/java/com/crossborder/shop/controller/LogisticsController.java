package com.crossborder.shop.controller;

import com.crossborder.shop.common.Result;
import com.crossborder.shop.entity.LogisticsCompany;
import com.crossborder.shop.service.LogisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 物流相关接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-07
 */
@RestController
@RequestMapping("/logistics")
@RequiredArgsConstructor
@Tag(name = "物流管理", description = "物流公司与物流单号")
public class LogisticsController {

    private final LogisticsService logisticsService;

    @GetMapping("/companies")
    @Operation(summary = "物流公司列表", description = "查询启用的物流公司列表")
    public Result<List<LogisticsCompany>> listCompanies() {
        return Result.success(logisticsService.listActiveCompanies());
    }

    @GetMapping("/tracking-no")
    @Operation(summary = "生成物流单号", description = "根据物流公司编码生成模拟物流单号")
    public Result<String> generateTrackingNo(@RequestParam String companyCode) {
        return Result.success(logisticsService.generateTrackingNo(companyCode));
    }
}