package com.crossborder.shop.service;

import com.crossborder.shop.dto.AddCartDTO;
import com.crossborder.shop.dto.UpdateCartItemDTO;
import com.crossborder.shop.vo.CartVO;

/**
 * 购物车服务接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
public interface CartService {

    /**
     * 添加商品到购物车
     */
    void addToCart(Long userId, AddCartDTO dto);

    /**
     * 更新购物车明细
     */
    void updateCartItem(Long userId, UpdateCartItemDTO dto);

    /**
     * 删除购物车明细
     */
    void removeCartItem(Long userId, Long itemId);

    /**
     * 清空购物车
     */
    void clearCart(Long userId);

    /**
     * 获取购物车详情
     */
    CartVO getCart(Long userId);

    /**
     * 更新全选/取消全选
     */
    void updateAllSelected(Long userId, Boolean selected);

    /**
     * 删除选中商品
     */
    void removeSelectedItems(Long userId);
}
