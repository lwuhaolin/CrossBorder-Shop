package com.crossborder.shop.entity;

import com.crossborder.shop.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;


@Data
@EqualsAndHashCode(callSuper = true)
public class Role extends BaseEntity {

    /**
     * 角色ID
     */
    private Long id;

    /**
     * 角色名称
     */
    private String roleName;

    /**
     * 角色编码
     */
    private String roleCode;

    /**
     * 角色描述
     */
    private String description;

    /**
     * 显示排序
     */
    private Integer sort;

    /**
     * 状态（0:禁用 1:正常）
     */
    private Integer status;
}
