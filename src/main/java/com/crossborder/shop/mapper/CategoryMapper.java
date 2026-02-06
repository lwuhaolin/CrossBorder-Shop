package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 分类Mapper接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Mapper
public interface CategoryMapper {

    /**
     * 插入分类
     */
    int insert(Category category);

    /**
     * 根据ID删除分类（逻辑删除�?
     */
    int deleteById(@Param("id") Long id);

    /**
     * 更新分类
     */
    int updateById(Category category);

    /**
     * 根据ID查询分类
     */
    Category selectById(@Param("id") Long id);

    /**
     * 查询所有分�?
     */
    List<Category> selectAll();

    /**
     * 根据父ID查询子分�?
     */
    List<Category> selectByParentId(@Param("parentId") Long parentId);

    /**
     * 根据编码查询分类
     */
    Category selectByCode(@Param("categoryCode") String categoryCode);

    /**
     * 统计子分类数�?
     */
    int countByParentId(@Param("parentId") Long parentId);
}
