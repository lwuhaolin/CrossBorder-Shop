package com.crossborder.shop.controller;

import com.crossborder.shop.common.PageResult;
import com.crossborder.shop.common.Result;
import com.crossborder.shop.dto.ExchangeRateDTO;
import com.crossborder.shop.service.ExchangeRateService;
import com.crossborder.shop.vo.CurrencyVO;
import com.crossborder.shop.vo.ExchangeRateVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 汇率控制器
 *
 * @author CrossBorder Team
 * @since 2026-02-08
 */
@Slf4j
@RestController
@RequestMapping("/exchange-rate")
@RequiredArgsConstructor
@Tag(name = "汇率管理", description = "汇率相关接口")
public class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    @Operation(summary = "获取所有货币", description = "获取所有启用的货币列表")
    @GetMapping("/currencies")
    public Result<List<CurrencyVO>> getCurrencies() {
        List<CurrencyVO> currencies = exchangeRateService.getAllCurrencies();
        return Result.success(currencies);
    }

    @Operation(summary = "分页查询汇率", description = "管理员分页查询汇率列表，支持按源货币和目标货币搜索")
    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<PageResult<ExchangeRateVO>> listExchangeRates(
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页数量", example = "20") @RequestParam(defaultValue = "20") Integer pageSize,
            @Parameter(description = "源货币代码（可选）") @RequestParam(required = false) String fromCurrency,
            @Parameter(description = "目标货币代码（可选）") @RequestParam(required = false) String toCurrency) {
        PageResult<ExchangeRateVO> result = exchangeRateService.listExchangeRates(pageNum, pageSize, fromCurrency, toCurrency);
        return Result.success(result);
    }

    @Operation(summary = "根据ID查询汇率", description = "管理员根据ID查询汇率信息")
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<ExchangeRateVO> getById(
            @Parameter(description = "汇率ID") @PathVariable Long id) {
        ExchangeRateVO exchangeRateVO = exchangeRateService.getById(id);
        return Result.success(exchangeRateVO);
    }

    @Operation(summary = "创建汇率", description = "管理员创建新的汇率")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> createExchangeRate(
            @Valid @RequestBody ExchangeRateDTO dto) {
        exchangeRateService.createExchangeRate(dto);
        return Result.success();
    }

    @Operation(summary = "更新汇率", description = "管理员更新指定汇率的信息")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateExchangeRate(
            @Parameter(description = "汇率ID") @PathVariable Long id,
            @Valid @RequestBody ExchangeRateDTO dto) {
        exchangeRateService.updateExchangeRate(id, dto);
        return Result.success();
    }

    @Operation(summary = "删除汇率", description = "管理员删除指定汇率（逻辑删除）")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> deleteExchangeRate(
            @Parameter(description = "汇率ID") @PathVariable Long id) {
        exchangeRateService.deleteExchangeRate(id);
        return Result.success();
    }
}
