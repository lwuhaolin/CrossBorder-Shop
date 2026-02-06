package com.crossborder.shop.controller;

import com.crossborder.shop.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 健康检查控制器
 * 用于系统健康检查和测试接口连通�?
 * 
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@RestController
@RequestMapping("/health")
@Tag(name = "系统健康检查", description = "系统健康检查相关接口")
public class HealthController {

    @GetMapping("/check")
    @Operation(summary = "健康检查", description = "检查系统是否正常运行")
    public Result<String> healthCheck() {
        return Result.success("系统运行正常", "OK");
    }

    @GetMapping("/info")
    @Operation(summary = "系统信息", description = "获取系统基本信息")
    public Result<SystemInfo> getSystemInfo() {
        SystemInfo info = new SystemInfo();
        info.setApplicationName("跨境日用小商品订货系统");
        info.setVersion("1.0.0");
        info.setDescription("Cross-Border Daily Goods Ordering System");
        return Result.success(info);
    }

    /**
     * 系统信息内部�?
     */
    private static class SystemInfo {
        private String applicationName;
        private String version;
        private String description;

        public String getApplicationName() {
            return applicationName;
        }

        public void setApplicationName(String applicationName) {
            this.applicationName = applicationName;
        }

        public String getVersion() {
            return version;
        }

        public void setVersion(String version) {
            this.version = version;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }
}
