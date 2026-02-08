package com.crossborder.shop.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 系统设置VO
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Data
@Schema(description = "系统设置VO")
public class SystemSettingVO {

    @Schema(description = "设置ID")
    private Long id;

    @Schema(description = "设置键")
    private String settingKey;

    @Schema(description = "设置值")
    private String settingValue;

    @Schema(description = "设置分组")
    private String settingGroup;

    @Schema(description = "设置描述")
    private String description;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}
