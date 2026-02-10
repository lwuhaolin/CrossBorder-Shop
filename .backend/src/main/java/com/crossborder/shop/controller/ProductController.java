package com.crossborder.shop.controller;

import com.crossborder.shop.common.PageResult;
import com.crossborder.shop.common.Result;
import com.crossborder.shop.dto.ProductDTO;
import com.crossborder.shop.security.UserPrincipal;
import com.crossborder.shop.service.ProductService;
import com.crossborder.shop.vo.ProductVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 商品控制器
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@Tag(name = "商品管理", description = "商品发布、上下架、查询等功能")
public class ProductController {

    private final ProductService productService;

    @PostMapping("/publish")
    @PreAuthorize("hasRole('SELLER')")
    @Operation(summary = "发布商品", description = "卖家发布新商品")
    public Result<Long> publishProduct(@Valid @RequestBody ProductDTO productDTO,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long productId = productService.publishProduct(productDTO, userPrincipal.getUserId());
        return Result.success(productId);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('SELLER')")
    @Operation(summary = "更新商品", description = "卖家更新商品信息")
    public Result<Void> updateProduct(@Valid @RequestBody ProductDTO productDTO,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        productService.updateProduct(productDTO, userPrincipal.getUserId());
        return Result.success();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    @Operation(summary = "删除商品", description = "卖家删除商品")
    public Result<Void> deleteProduct(@PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        productService.deleteProduct(id, userPrincipal.getUserId());
        return Result.success();
    }

    @PutMapping("/{id}/on-shelf")
    @PreAuthorize("hasRole('SELLER')")
    @Operation(summary = "商品上架", description = "上架商品")
    public Result<Void> onShelf(@PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        productService.onShelf(id, userPrincipal.getUserId());
        return Result.success();
    }

    @PutMapping("/{id}/off-shelf")
    @PreAuthorize("hasRole('SELLER')")
    @Operation(summary = "商品下架", description = "下架商品")
    public Result<Void> offShelf(@PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        productService.offShelf(id, userPrincipal.getUserId());
        return Result.success();
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询商品", description = "查询商品详情")
    public Result<ProductVO> getProductDetail(@PathVariable Long id) {
        ProductVO productVO = productService.getProductDetail(id);
        return Result.success(productVO);
    }

    @GetMapping("/page")
    @Operation(summary = "商品分页查询", description = "根据条件分页查询商品列表")
    public Result<PageResult<ProductVO>> getProductPage(
            @Parameter(description = "分类ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "状态：0-下架，1-上架，2-删除") @RequestParam(required = false) Integer status,
            @Parameter(description = "卖家ID") @RequestParam(required = false) Long sellerId,
            @Parameter(description = "关键字搜索") @RequestParam(required = false) String keyword,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int pageNum,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "排序字段：price, name") @RequestParam(required = false) String sortBy,
            @Parameter(description = "排序顺序：asc, desc") @RequestParam(required = false) String sortOrder) {

        PageResult<ProductVO> pageResult = productService.getProductPage(
                categoryId, status, sellerId, keyword, pageNum, pageSize, sortBy, sortOrder);
        return Result.success(pageResult);
    }

    @GetMapping("/seller/my-products")
    @PreAuthorize("hasRole('SELLER')")
    @Operation(summary = "我的商品", description = "卖家查询自己的商品列表")
    public Result<PageResult<ProductVO>> getMyProducts(
            @Parameter(description = "分类ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status,
            @Parameter(description = "关键字") @RequestParam(required = false) String keyword,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int pageNum,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        PageResult<ProductVO> pageResult = productService.getProductPage(
                categoryId, status, userPrincipal.getUserId(), keyword, pageNum, pageSize, null, null);
        return Result.success(pageResult);
    }

    @GetMapping("/latest")
    @Operation(summary = "获取最新商品", description = "获取最新添加的商品列表")
    public Result<List<ProductVO>> getLatestProducts(
            @Parameter(description = "限制数量，默认4") @RequestParam(defaultValue = "4") Integer limit) {
        List<ProductVO> products = productService.getLatestProducts(limit);
        return Result.success(products);
    }
}
