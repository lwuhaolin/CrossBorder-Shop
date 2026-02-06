package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.Cart;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 购物车Mapper接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Mapper
public interface CartMapper {

    /**
     * 根据用户ID查询购物�?
     */
    Cart selectByUserId(@Param("userId") Long userId);

    /**
     * 插入购物�?
     */
    int insert(Cart cart);

    /**
     * 更新购物�?
     */
    int updateById(Cart cart);

    /**
     * 根据用户ID删除购物�?
     */
    int deleteByUserId(@Param("userId") Long userId);
}
