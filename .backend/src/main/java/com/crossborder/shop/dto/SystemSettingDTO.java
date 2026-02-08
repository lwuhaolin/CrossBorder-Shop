package com.crossborder.shop.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 系统设置DTO
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Data
@Schema(description = "系统设置DTO")
public class SystemSettingDTO {

    @Schema(description = "设置键")
    private String settingKey;

    @Schema(description = "设置值")
    private String settingValue;

    @Schema(description = "设置分组")
    private String settingGroup;

    @Schema(description = "设置描述")
    private String description;
}
