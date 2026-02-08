package com.crossborder.shop.controller;

import com.crossborder.shop.common.Result;
import com.crossborder.shop.dto.AppConfigDTO;
import com.crossborder.shop.dto.SystemSettingDTO;
import com.crossborder.shop.service.SettingsService;
import com.crossborder.shop.vo.AppConfigVO;
import com.crossborder.shop.vo.SystemSettingVO;
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
 * 系统设置控制器
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Slf4j
@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
@Tag(name = "系统设置", description = "系统配置相关接口")
public class SettingsController {

    private final SettingsService settingsService;

    @Operation(summary = "获取全部配置", description = "管理员获取所有系统配置")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Result<List<SystemSettingVO>> getAllSettings() {
        return Result.success(settingsService.getAllSettings());
    }

    @Operation(summary = "根据键获取配置", description = "管理员根据配置键查询")
    @GetMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<SystemSettingVO> getSettingByKey(
            @Parameter(description = "配置键") @PathVariable String key) {
        return Result.success(settingsService.getSettingByKey(key));
    }

    @Operation(summary = "更新配置", description = "管理员更新指定配置")
    @PutMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateSetting(
            @Parameter(description = "配置键") @PathVariable String key,
            @Valid @RequestBody SystemSettingDTO dto) {
        settingsService.updateSetting(key, dto);
        return Result.success();
    }

    @Operation(summary = "获取应用配置", description = "获取应用配置")
    @GetMapping("/config")
    public Result<AppConfigVO> getAppConfig() {
        return Result.success(settingsService.getAppConfig());
    }

    @Operation(summary = "更新应用配置", description = "管理员更新应用配置")
    @PutMapping("/config")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> updateAppConfig(@Valid @RequestBody AppConfigDTO dto) {
        settingsService.updateAppConfig(dto);
        return Result.success();
    }

    @Operation(summary = "测试邮箱设置", description = "管理员测试邮箱配置")
    @PostMapping("/test-email")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> testEmailSettings(@RequestBody java.util.Map<String, String> payload) {
        String email = payload.get("email");
        settingsService.testEmailSettings(email);
        return Result.success();
    }
}
