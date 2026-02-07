package com.crossborder.shop.controller;

import com.crossborder.shop.common.Result;
import com.crossborder.shop.dto.ShippingAddressDTO;
import com.crossborder.shop.security.UserPrincipal;
import com.crossborder.shop.service.ShippingAddressService;
import com.crossborder.shop.vo.ShippingAddressVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 收货地址控制器
 *
 * @author CrossBorder Shop Team
 * @since 2026-02-04
 */
@Slf4j
@RestController
@RequestMapping("/address")
@RequiredArgsConstructor
@Tag(name = "收货地址管理", description = "收货地址相关接口")
public class ShippingAddressController {

    private final ShippingAddressService shippingAddressService;

    @PostMapping
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER')")
    @Operation(summary = "创建收货地址", description = "创建新的收货地址")
    public Result<Void> createAddress(@AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ShippingAddressDTO dto) {
        shippingAddressService.createAddress(principal.getUserId(), dto);
        return Result.success();
    }

    @PutMapping("/{addressId}")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER')")
    @Operation(summary = "更新收货地址", description = "更新指定的收货地址")
    public Result<Void> updateAddress(@AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long addressId,
            @Valid @RequestBody ShippingAddressDTO dto) {
        shippingAddressService.updateAddress(principal.getUserId(), addressId, dto);
        return Result.success();
    }

    @DeleteMapping("/{addressId}")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER')")
    @Operation(summary = "删除收货地址", description = "删除指定的收货地址")
    public Result<Void> deleteAddress(@AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long addressId) {
        shippingAddressService.deleteAddress(principal.getUserId(), addressId);
        return Result.success();
    }

    @PutMapping("/{addressId}/default")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER')")
    @Operation(summary = "设置默认地址", description = "将指定地址设为默认收货地址")
    public Result<Void> setDefaultAddress(@AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long addressId) {
        shippingAddressService.setDefaultAddress(principal.getUserId(), addressId);
        return Result.success();
    }

    @GetMapping("/{addressId}")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER')")
    @Operation(summary = "查询地址详情", description = "根据ID查询收货地址")
    public Result<ShippingAddressVO> getAddressById(@PathVariable Long addressId) {
        ShippingAddressVO address = shippingAddressService.getAddressById(addressId);
        return Result.success(address);
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER')")
    @Operation(summary = "查询地址列表", description = "查询当前用户所有收货地址")
    public Result<List<ShippingAddressVO>> getAddressList(@AuthenticationPrincipal UserPrincipal principal) {
        List<ShippingAddressVO> addresses = shippingAddressService.getAddressList(principal.getUserId());
        return Result.success(addresses);
    }

    @GetMapping("/default")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER')")
    @Operation(summary = "获取默认地址", description = "查询当前用户默认收货地址")
    public Result<ShippingAddressVO> getDefaultAddress(@AuthenticationPrincipal UserPrincipal principal) {
        ShippingAddressVO address = shippingAddressService.getDefaultAddress(principal.getUserId());
        return Result.success(address);
    }
}
