package com.crossborder.shop.controller;

import com.crossborder.shop.common.Result;
import com.crossborder.shop.entity.Category;
import com.crossborder.shop.service.CategoryService;
import com.crossborder.shop.vo.CategoryVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 商品分类控制器
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
@Tag(name = "商品分类", description = "商品分类CRUD和树形查询")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "创建分类", description = "管理员创建新分类")
    public Result<Long> create(@Valid @RequestBody Category category) {
        Long categoryId = categoryService.create(category);
        return Result.success(categoryId);
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "更新分类", description = "更新分类信息")
    public Result<Void> update(@Valid @RequestBody Category category) {
        categoryService.update(category);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "删除分类", description = "删除指定分类")
    public Result<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return Result.success();
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询分类", description = "根据ID查询分类")
    public Result<Category> getById(@PathVariable Long id) {
        Category category = categoryService.getById(id);
        return Result.success(category);
    }

    @GetMapping("/tree")
    @Operation(summary = "分类树", description = "获取分类树形结构")
    public Result<List<CategoryVO>> getTree() {
        List<CategoryVO> tree = categoryService.getCategoryTree();
        return Result.success(tree);
    }

    @GetMapping("/children/{parentId}")
    @Operation(summary = "子分类列表", description = "根据ID查询子分类")
    public Result<List<CategoryVO>> getChildren(@PathVariable Long parentId) {
        List<CategoryVO> children = categoryService.getChildrenByParentId(parentId);
        return Result.success(children);
    }

    @GetMapping("/list")
    @Operation(summary = "分类列表", description = "获取所有分类")
    public Result<List<Category>> list() {
        List<Category> list = categoryService.list();
        return Result.success(list);
    }
}
