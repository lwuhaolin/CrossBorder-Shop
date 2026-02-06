package com.crossborder.shop.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.crossborder.shop.common.ResultCode;
import com.crossborder.shop.entity.Category;
import com.crossborder.shop.exception.BusinessException;
import com.crossborder.shop.mapper.CategoryMapper;
import com.crossborder.shop.service.CategoryService;
import com.crossborder.shop.vo.CategoryVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 分类服务实现类
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(Category category) {
        // 检查是否存在同编码的分类（包括已删除的）
        Category existing = categoryMapper.selectByCode(category.getCategoryCode());

        if (existing != null) {
            // 如果存在且未删除，抛出异常
            if (existing.getDeleted() == 0) {
                throw new BusinessException(ResultCode.CONFLICT, "分类编码已存在");
            }

            // 如果存在但已删除，则恢复该分类并更新信息
            log.info("发现已删除的同编码分类，将恢复并更新: id={}, code={}",
                    existing.getId(), category.getCategoryCode());

            // 更新分类信息
            category.setId(existing.getId());
            category.setDeleted(0); // 恢复为未删除状态
            categoryMapper.updateById(category);

            log.info("分类恢复成功: id={}, name={}", category.getId(), category.getCategoryName());
            return category.getId();
        }

        // 不存在同编码分类，正常插入
        categoryMapper.insert(category);
        log.info("分类创建成功: id={}, name={}", category.getId(), category.getCategoryName());
        return category.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Category category) {
        Category existing = categoryMapper.selectById(category.getId());
        if (existing == null) {
            throw new BusinessException(ResultCode.CATEGORY_NOT_FOUND);
        }

        categoryMapper.updateById(category);
        log.info("分类更新成功: id={}", category.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(ResultCode.CATEGORY_NOT_FOUND);
        }

        // 检查是否有子分类
        int childCount = categoryMapper.countByParentId(id);
        if (childCount > 0) {
            throw new BusinessException(ResultCode.CATEGORY_HAS_CHILDREN);
        }

        // TODO: 检查该分类下是否有商品（需要ProductMapper）
        // int productCount = productMapper.countByCategoryId(id);
        // if (productCount > 0) {
        // throw new BusinessException(ResultCode.CATEGORY_HAS_PRODUCTS);
        // }

        categoryMapper.deleteById(id);
        log.info("分类删除成功: id={}", id);
    }

    @Override
    public Category getById(Long id) {
        return categoryMapper.selectById(id);
    }

    @Override
    public List<CategoryVO> getCategoryTree() {
        List<Category> allCategories = categoryMapper.selectAll();

        // 筛选根分类（parentId = 0）
        List<CategoryVO> rootCategories = allCategories.stream()
                .filter(c -> c.getParentId() == 0)
                .map(this::convertToVO)
                .collect(Collectors.toList());

        // 递归构建分类树
        for (CategoryVO root : rootCategories) {
            buildCategoryTree(root, allCategories);
        }

        return rootCategories;
    }

    @Override
    public List<CategoryVO> getChildrenByParentId(Long parentId) {
        List<Category> children = categoryMapper.selectByParentId(parentId);
        return children.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }

    @Override
    public List<Category> list() {
        return categoryMapper.selectAll();
    }

    /**
     * 递归构建分类树
     */
    private void buildCategoryTree(CategoryVO parent, List<Category> allCategories) {
        List<CategoryVO> children = allCategories.stream()
                .filter(c -> c.getParentId().equals(parent.getId()))
                .map(this::convertToVO)
                .collect(Collectors.toList());

        parent.setChildren(children);

        // 递归构建子分类
        for (CategoryVO child : children) {
            buildCategoryTree(child, allCategories);
        }
    }

    /**
     * 转换为VO
     */
    private CategoryVO convertToVO(Category category) {
        CategoryVO vo = new CategoryVO();
        BeanUtil.copyProperties(category, vo);
        vo.setChildren(new ArrayList<>());
        return vo;
    }
}
