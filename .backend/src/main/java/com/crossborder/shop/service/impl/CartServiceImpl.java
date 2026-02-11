package com.crossborder.shop.service.impl;

import com.crossborder.shop.common.ResultCode;
import com.crossborder.shop.dto.AddCartDTO;
import com.crossborder.shop.dto.UpdateCartItemDTO;
import com.crossborder.shop.entity.Cart;
import com.crossborder.shop.entity.CartItem;
import com.crossborder.shop.entity.Product;
import com.crossborder.shop.entity.ProductImage;
import com.crossborder.shop.exception.BusinessException;
import com.crossborder.shop.mapper.CartItemMapper;
import com.crossborder.shop.mapper.CartMapper;
import com.crossborder.shop.mapper.ProductImageMapper;
import com.crossborder.shop.mapper.ProductMapper;
import com.crossborder.shop.service.CartService;
import com.crossborder.shop.vo.CartItemVO;
import com.crossborder.shop.vo.CartVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartMapper cartMapper;
    private final CartItemMapper cartItemMapper;
    private final ProductMapper productMapper;
    private final ProductImageMapper productImageMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addToCart(Long userId, AddCartDTO dto) {
        // 查询商品信息
        Product product = productMapper.selectById(dto.getProductId());
        if (product == null) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_EXISTS);
        }

        // 检查商品是否上架
        if (!product.getOnShelf()) {
            throw new BusinessException(ResultCode.PRODUCT_OFF_SHELF);
        }

        // 检查库存
        if (product.getStock() < dto.getQuantity()) {
            throw new BusinessException(ResultCode.PRODUCT_STOCK_NOT_ENOUGH);
        }

        // 查询或创建购物车
        Cart cart = cartMapper.selectByUserId(userId);
        if (cart == null) {
            cart = new Cart();
            cart.setUserId(userId);
            cartMapper.insert(cart);
        }

        // 查询是否已存在该商品
        CartItem existingItem = cartItemMapper.selectByCartIdAndProductId(
                cart.getId(), dto.getProductId(), dto.getSkuId());
        if (existingItem != null) {
            // 更新数量
            int newQuantity = existingItem.getQuantity() + dto.getQuantity();
            if (product.getStock() < newQuantity) {
                throw new BusinessException(ResultCode.PRODUCT_STOCK_NOT_ENOUGH);
            }
            existingItem.setQuantity(newQuantity);
            cartItemMapper.updateById(existingItem);
        } else {
            // 新增购物车明细
            CartItem cartItem = new CartItem();
            cartItem.setCartId(cart.getId());
            cartItem.setUserId(userId);
            cartItem.setProductId(dto.getProductId());
            cartItem.setSkuId(dto.getSkuId());
            cartItem.setQuantity(dto.getQuantity());
            cartItem.setSelected(true);
            cartItemMapper.insert(cartItem);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateCartItem(Long userId, UpdateCartItemDTO dto) {
        // 查询购物车明细
        CartItem cartItem = cartItemMapper.selectById(dto.getId());
        if (cartItem == null) {
            throw new BusinessException(ResultCode.NOT_FOUND, "购物车明细不存在");
        }

        // 查询商品信息，检查库存
        Product product = productMapper.selectById(cartItem.getProductId());
        if (product != null && dto.getQuantity() > product.getStock()) {
            throw new BusinessException(ResultCode.PRODUCT_STOCK_NOT_ENOUGH);
        }

        // 更新数量
        if (dto.getQuantity() != null) {
            cartItem.setQuantity(dto.getQuantity());
        }

        // 更新选中状态
        if (dto.getSelected() != null) {
            cartItem.setSelected(dto.getSelected());
        }

        cartItemMapper.updateById(cartItem);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeCartItem(Long userId, Long itemId) {
        CartItem cartItem = cartItemMapper.selectById(itemId);
        if (cartItem != null) {
            cartItemMapper.deleteById(itemId);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void clearCart(Long userId) {
        Cart cart = cartMapper.selectByUserId(userId);
        if (cart != null) {
            cartItemMapper.deleteByCartId(cart.getId());
        }
    }

    @Override
    public CartVO getCart(Long userId) {
        return buildCartVO(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateAllSelected(Long userId, Boolean selected) {
        Cart cart = cartMapper.selectByUserId(userId);
        if (cart != null) {
            cartItemMapper.updateSelectedByCartId(cart.getId(), selected);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeSelectedItems(Long userId) {
        Cart cart = cartMapper.selectByUserId(userId);
        if (cart != null) {
            List<CartItem> selectedItems = cartItemMapper.selectSelectedByCartId(cart.getId());
            for (CartItem item : selectedItems) {
                cartItemMapper.deleteById(item.getId());
            }
        }
    }

    /**
     * 构建购物车VO（直接查询数据库）
     */
    private CartVO buildCartVO(Long userId) {
        Cart cart = cartMapper.selectByUserId(userId);
        if (cart == null) {
            return null;
        }

        List<CartItem> items = cartItemMapper.selectByCartId(cart.getId());
        List<CartItemVO> itemVOList = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;
        int totalQuantity = 0;

        for (CartItem item : items) {
            Product product = productMapper.selectById(item.getProductId());
            if (product == null) {
                continue;
            }

            // 查询商品的主图
            ProductImage mainImage = productImageMapper.selectMainImage(item.getProductId());
            String imageUrl = mainImage != null ? mainImage.getImageUrl() : product.getImage();

            CartItemVO itemVO = new CartItemVO();
            itemVO.setId(item.getId());
            itemVO.setProductId(item.getProductId());
            itemVO.setProductName(product.getName());
            itemVO.setProductImage(imageUrl);
            itemVO.setSkuId(item.getSkuId());
            itemVO.setQuantity(item.getQuantity());
            itemVO.setPrice(product.getPrice());
            itemVO.setSubtotal(product.getPrice().multiply(new BigDecimal(item.getQuantity())));
            itemVO.setSelected(item.getSelected());
            itemVO.setStock(product.getStock());
            itemVO.setOnShelf(product.getOnShelf());

            itemVOList.add(itemVO);
            totalPrice = totalPrice.add(itemVO.getSubtotal());
            totalQuantity += item.getQuantity();
        }

        CartVO cartVO = new CartVO();
        cartVO.setId(cart.getId());
        cartVO.setUserId(cart.getUserId());
        cartVO.setTotalPrice(totalPrice);
        cartVO.setTotalQuantity(totalQuantity);
        cartVO.setItems(itemVOList);

        return cartVO;
    }
}
