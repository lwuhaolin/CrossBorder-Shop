package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.CartItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 购物车明细Mapper接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Mapper
public interface CartItemMapper {

    /**
     * 根据ID查询
     */
    CartItem selectById(@Param("id") Long id);

    /**
     * 根据购物车ID查询明细列表
     */
    List<CartItem> selectByCartId(@Param("cartId") Long cartId);

    /**
     * 根据购物车ID和商品ID查询明细
     */
    CartItem selectByCartIdAndProductId(@Param("cartId") Long cartId,
            @Param("productId") Long productId,
            @Param("skuId") Long skuId);

    /**
     * 查询选中的商品明�?
     */
    List<CartItem> selectSelectedByCartId(@Param("cartId") Long cartId);

    /**
     * 插入或更新购物车明细
     */
    int insertOrUpdate(CartItem cartItem);

    /**
     * 插入购物车明�?
     */
    int insert(CartItem cartItem);

    /**
     * 更新购物车明�?
     */
    int updateById(CartItem cartItem);

    /**
     * 根据ID删除
     */
    int deleteById(@Param("id") Long id);

    /**
     * 根据购物车ID和商品ID删除
     */
    int deleteByCartIdAndProductId(@Param("cartId") Long cartId, @Param("productId") Long productId);

    /**
     * 根据购物车ID删除所有明�?
     */
    int deleteByCartId(@Param("cartId") Long cartId);

    /**
     * 更新选中状�?
     */
    int updateSelected(@Param("id") Long id, @Param("selected") Boolean selected);

    /**
     * 批量更新选中状�?
     */
    int updateSelectedByCartId(@Param("cartId") Long cartId, @Param("selected") Boolean selected);
}
