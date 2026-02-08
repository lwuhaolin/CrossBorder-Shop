package com.crossborder.shop.entity;

import com.crossborder.shop.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 系统配置实体
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SystemConfig extends BaseEntity {

    @Schema(description = "配置键")
    private String configKey;

    @Schema(description = "配置值")
    private String configValue;

    @Schema(description = "配置类型：string-字符串，number-数字，boolean-布尔，json-JSON")
    private String configType;

    @Schema(description = "配置描述")
    private String description;

    @Schema(description = "配置分组")
    private String groupName;

    @Schema(description = "状态：0-禁用，1-启用")
    private Integer status;
}
