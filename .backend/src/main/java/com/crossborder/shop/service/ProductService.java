package com.crossborder.shop.service;

import com.crossborder.shop.common.PageResult;
import com.crossborder.shop.dto.ProductDTO;
import com.crossborder.shop.vo.ProductVO;

/**
 * 商品服务接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
public interface ProductService {

    /**
     * 发布商品
     *
     * @param productDTO 商品信息
     * @param sellerId   卖家ID
     * @return 商品ID
     */
    Long publishProduct(ProductDTO productDTO, Long sellerId);

    /**
     * 更新商品
     *
     * @param productDTO 商品信息
     * @param sellerId   卖家ID
     */
    void updateProduct(ProductDTO productDTO, Long sellerId);

    /**
     * 删除商品
     *
     * @param id       商品ID
     * @param sellerId 卖家ID
     */
    void deleteProduct(Long id, Long sellerId);

    /**
     * 上架商品
     *
     * @param id       商品ID
     * @param sellerId 卖家ID
     */
    void onShelf(Long id, Long sellerId);

    /**
     * 下架商品
     *
     * @param id       商品ID
     * @param sellerId 卖家ID
     */
    void offShelf(Long id, Long sellerId);

    /**
     * 获取商品详情
     *
     * @param id 商品ID
     * @return 商品详情
     */
    ProductVO getProductDetail(Long id);

    /**
     * 分页查询商品列表
     *
     * @param categoryId 分类ID
     * @param status     状�?
     * @param sellerId   卖家ID
     * @param keyword    关键�?
     * @param pageNum    页码
     * @param pageSize   每页数量
     * @return 商品分页结果
     */
    PageResult<ProductVO> getProductPage(Long categoryId, Integer status, Long sellerId,
            String keyword, int pageNum, int pageSize);

    /**
     * 扣减库存（乐观锁+重试�?
     *
     * @param productId 商品ID
     * @param quantity  扣减数量
     * @return 是否成功
     */
    boolean decreaseStock(Long productId, Integer quantity);

    /**
     * 释放库存（取消订单时�?
     *
     * @param productId 商品ID
     * @param quantity  释放数量
     */
    void releaseStock(Long productId, Integer quantity);

    /**
     * 删除商品缓存（延迟双删）
     *
     * @param productId 商品ID
     */
    void deleteProductCache(Long productId);

    /**
     * 获取最新商品列表
     *
     * @param limit 限制数量
     * @return 最新商品列表
     */
    java.util.List<ProductVO> getLatestProducts(Integer limit);
}
