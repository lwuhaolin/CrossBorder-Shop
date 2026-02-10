package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.Product;
import com.crossborder.shop.vo.ProductVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 商品Mapper接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Mapper
public interface ProductMapper {

        /**
         * 插入商品
         */
        int insert(Product product);

        /**
         * 根据ID删除商品（逻辑删除）
         */
        int deleteById(@Param("id") Long id);

        /**
         * 更新商品
         */
        int updateById(Product product);

        /**
         * 根据ID查询商品
         */
        Product selectById(@Param("id") Long id);

        /**
         * 查询商品详情VO
         */
        ProductVO selectVOById(@Param("id") Long id);

        /**
         * 分页查询商品列表
         */
        List<ProductVO> selectPageList(@Param("categoryId") Long categoryId,
                        @Param("status") Integer status,
                        @Param("sellerId") Long sellerId,
                        @Param("keyword") String keyword,
                        @Param("sortBy") String sortBy,
                        @Param("sortOrder") String sortOrder);

        /**
         * 乐观锁扣减库存
         */
        int decreaseStock(@Param("id") Long id,
                        @Param("quantity") Integer quantity,
                        @Param("version") Integer version);

        /**
         * 增加库存（取消订单时）
         */
        int increaseStock(@Param("id") Long id, @Param("quantity") Integer quantity);

        /**
         * 增加销量
         */
        int increaseSales(@Param("id") Long id, @Param("quantity") Integer quantity);

        /**
         * 更新商品状态
         */
        int updateStatus(@Param("id") Long id,
                        @Param("status") Integer status,
                        @Param("sellerId") Long sellerId);

        /**
         * 根据商品编码查询
         */
        Product selectByCode(@Param("productCode") String productCode);

        /**
         * 查询最新商品列表
         */
        List<ProductVO> selectLatestProducts(@Param("limit") Integer limit);
}
