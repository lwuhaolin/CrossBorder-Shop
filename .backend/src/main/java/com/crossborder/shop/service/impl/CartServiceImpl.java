package com.crossborder.shop.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
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
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartMapper cartMapper;
    private final CartItemMapper cartItemMapper;
    private final ProductMapper productMapper;
    private final ProductImageMapper productImageMapper;
    private final RedissonClient redissonClient;

    @Value("${cache.delay-delete-millis:500}")
    private long delayDeleteMillis;

    /**
     * 缓存Key前缀
     */
    private static final String CART_KEY_PREFIX = "cart:";

    /**
     * 缓存过期时间（秒）
     */
    private static final long CART_CACHE_TTL = 7 * 24 * 60 * 60;

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

        // 延迟双删第一步：删除缓存
        deleteCartCache(userId);

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

        // 添加商品后刷新缓存
        refreshCartCache(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateCartItem(Long userId, UpdateCartItemDTO dto) {
        // 延迟双删第一步
        deleteCartCache(userId);

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

        // 延迟双删第二步
        asyncDeleteCartCache(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeCartItem(Long userId, Long itemId) {
        // 延迟双删第一步
        deleteCartCache(userId);

        CartItem cartItem = cartItemMapper.selectById(itemId);
        if (cartItem != null) {
            cartItemMapper.deleteById(itemId);
        }

        // 延迟双删第二步
        asyncDeleteCartCache(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void clearCart(Long userId) {
        // 延迟双删第一步
        deleteCartCache(userId);

        Cart cart = cartMapper.selectByUserId(userId);
        if (cart != null) {
            cartItemMapper.deleteByCartId(cart.getId());
        }

        // 延迟双删第二步
        asyncDeleteCartCache(userId);
    }

    @Override
    public CartVO getCart(Long userId) {
        // 先查Redis缓存
        String cacheKey = CART_KEY_PREFIX + userId;
        RBucket<String> bucket = redissonClient.getBucket(cacheKey);
        String cachedData = bucket.get();

        if (cachedData != null) {
            log.debug("购物车缓存命中: userId={}", userId);
            return JSONUtil.toBean(cachedData, CartVO.class);
        }

        // 缓存未命中，查询数据库并刷新缓存
        return refreshCartCache(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateAllSelected(Long userId, Boolean selected) {
        // 延迟双删第一步
        deleteCartCache(userId);

        Cart cart = cartMapper.selectByUserId(userId);
        if (cart != null) {
            cartItemMapper.updateSelectedByCartId(cart.getId(), selected);
        }

        // 延迟双删第二步
        asyncDeleteCartCache(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeSelectedItems(Long userId) {
        // 延迟双删第一步
        deleteCartCache(userId);

        Cart cart = cartMapper.selectByUserId(userId);
        if (cart != null) {
            List<CartItem> selectedItems = cartItemMapper.selectSelectedByCartId(cart.getId());
            for (CartItem item : selectedItems) {
                cartItemMapper.deleteById(item.getId());
            }
        }

        // 延迟双删第二步
        asyncDeleteCartCache(userId);
    }

    // 不再持久化总价/总数，统一在 getCart 中动态计算

    /**
     * 刷新购物车缓存
     */
    private CartVO refreshCartCache(Long userId) {
        log.debug("刷新购物车缓存: userId={}", userId);
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

        String cacheKey = CART_KEY_PREFIX + userId;
        redissonClient.getBucket(cacheKey).set(JSONUtil.toJsonStr(cartVO), CART_CACHE_TTL, TimeUnit.SECONDS);
        log.debug("购物车数据已缓存: userId={}", userId);
        return cartVO;
    }

    /**
     * 删除购物车缓存
     */
    private void deleteCartCache(Long userId) {
        String cacheKey = CART_KEY_PREFIX + userId;
        redissonClient.getBucket(cacheKey).delete();
        log.debug("删除购物车缓存: userId={}", userId);
    }

    /**
     * 异步延迟删除缓存（延迟双删第二步）
     */
    @Async
    public void asyncDeleteCartCache(Long userId) {
        try {
            Thread.sleep(delayDeleteMillis);
            deleteCartCache(userId);
            log.debug("异步延迟删除购物车缓存完成: userId={}, delay={}ms", userId, delayDeleteMillis);
        } catch (InterruptedException e) {
            log.error("异步延迟删除缓存失败", e);
            Thread.currentThread().interrupt();
        }
    }
}
