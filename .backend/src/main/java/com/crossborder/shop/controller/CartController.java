package com.crossborder.shop.controller;

import com.crossborder.shop.common.Result;
import com.crossborder.shop.dto.AddCartDTO;
import com.crossborder.shop.dto.UpdateCartItemDTO;
import com.crossborder.shop.security.UserPrincipal;
import com.crossborder.shop.service.CartService;
import com.crossborder.shop.vo.CartVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 购物车控制器
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@RestController
@RequestMapping("/cart")
@Tag(name = "购物车管理", description = "购物车相关接口")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "添加商品到购物车", description = "买家将商品添加到购物车")
    public Result<Void> addToCart(@AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddCartDTO dto) {
        cartService.addToCart(principal.getUserId(), dto);
        return Result.success();
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "更新购物车明细", description = "更新商品数量或选中状态")
    public Result<Void> updateCartItem(@AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateCartItemDTO dto) {
        cartService.updateCartItem(principal.getUserId(), dto);
        return Result.success();
    }

    @DeleteMapping("/item/{itemId}")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "删除购物车明细", description = "删除购物车中的商品")
    public Result<Void> removeCartItem(@AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long itemId) {
        cartService.removeCartItem(principal.getUserId(), itemId);
        return Result.success();
    }

    @DeleteMapping("/clear")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "清空购物车", description = "清空用户购物车所有商品")
    public Result<Void> clearCart(@AuthenticationPrincipal UserPrincipal principal) {
        cartService.clearCart(principal.getUserId());
        return Result.success();
    }

    @GetMapping
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "获取购物车详情", description = "查询当前用户购物车")
    public Result<CartVO> getCart(@AuthenticationPrincipal UserPrincipal principal) {
        CartVO cart = cartService.getCart(principal.getUserId());
        return Result.success(cart);
    }

    @PutMapping("/select/all")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "全选/取消全选", description = "设置购物车所有商品的选中状态")
    public Result<Void> updateAllSelected(@AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Boolean selected) {
        cartService.updateAllSelected(principal.getUserId(), selected);
        return Result.success();
    }

    @DeleteMapping("/selected")
    @PreAuthorize("hasRole('BUYER')")
    @Operation(summary = "删除选中商品", description = "删除购物车中所有选中的商品")
    public Result<Void> removeSelectedItems(@AuthenticationPrincipal UserPrincipal principal) {
        cartService.removeSelectedItems(principal.getUserId());
        return Result.success();
    }
}
