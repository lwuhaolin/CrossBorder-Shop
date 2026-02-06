package com.crossborder.shop.service;

import com.crossborder.shop.entity.Category;
import com.crossborder.shop.vo.CategoryVO;

import java.util.List;

/**
 * 分类服务接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
public interface CategoryService {

    /**
     * 创建分类
     *
     * @param category 分类信息
     * @return 分类ID
     */
    Long create(Category category);

    /**
     * 更新分类
     *
     * @param category 分类信息
     */
    void update(Category category);

    /**
     * 删除分类
     *
     * @param id 分类ID
     */
    void delete(Long id);

    /**
     * 根据ID查询分类
     *
     * @param id 分类ID
     * @return 分类信息
     */
    Category getById(Long id);

    /**
     * 获取分类树
     *
     * @return 分类树列表
     */
    List<CategoryVO> getCategoryTree();

    /**
     * 根据父ID获取子分类
     *
     * @param parentId 父分类ID
     * @return 子分类列表
     */
    List<CategoryVO> getChildrenByParentId(Long parentId);

    /**
     * 获取所有分类列表
     *
     * @return 分类列表
     */
    List<Category> list();
}
