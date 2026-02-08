package com.crossborder.shop.controller;

import com.crossborder.shop.common.Result;
import com.crossborder.shop.service.SettingsService;
import com.crossborder.shop.vo.SystemStatsVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 系统统计控制器
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Slf4j
@RestController
@RequestMapping("/statistics")
@RequiredArgsConstructor
@Tag(name = "系统统计", description = "系统统计相关接口")
public class StatisticsController {

    private final SettingsService settingsService;

    @Operation(summary = "获取系统统计信息", description = "管理员获取系统统计数据")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Result<SystemStatsVO> getSystemStats() {
        return Result.success(settingsService.getSystemStats());
    }
}
