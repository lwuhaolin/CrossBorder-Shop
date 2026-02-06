package com.crossborder.shop.entity;

import com.crossborder.shop.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 购物车实体
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Cart extends BaseEntity {

    /**
     * 用户ID
     */
    private Long userId;

    // 便捷方法
    public Long getId() {
        return super.getId();
    }
}
