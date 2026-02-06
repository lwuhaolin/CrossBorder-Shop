package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.ProductImage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 商品图片Mapper接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Mapper
public interface ProductImageMapper {

    /**
     * 批量插入商品图片
     */
    int batchInsert(@Param("list") List<ProductImage> list);

    /**
     * 根据商品ID删除图片（逻辑删除�?
     */
    int deleteByProductId(@Param("productId") Long productId);

    /**
     * 根据商品ID查询图片列表
     */
    List<ProductImage> selectByProductId(@Param("productId") Long productId);

    /**
     * 查询主图
     */
    ProductImage selectMainImage(@Param("productId") Long productId);
}
