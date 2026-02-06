package com.crossborder.shop.controller;

import com.crossborder.shop.common.Result;
import com.crossborder.shop.dto.UserLoginDTO;
import com.crossborder.shop.dto.UserRegisterDTO;
import com.crossborder.shop.dto.UserUpdateDTO;
import com.crossborder.shop.security.UserPrincipal;
import com.crossborder.shop.service.UserService;
import com.crossborder.shop.vo.LoginVO;
import com.crossborder.shop.vo.UserVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 * 
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Tag(name = "用户管理", description = "用户相关接口")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "用户注册", description = "新用户注册，注册成功后需要登录")
    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody UserRegisterDTO dto) {
        userService.register(dto);
        return Result.success();
    }

    @Operation(summary = "用户登录", description = "用户登录，返回AccessToken和RefreshToken")
    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody UserLoginDTO dto) {
        LoginVO loginVO = userService.login(dto);
        return Result.success(loginVO);
    }

    @Operation(summary = "刷新Token", description = "使用RefreshToken刷新AccessToken和RefreshToken")
    @PostMapping("/refresh")
    public Result<LoginVO> refreshToken(
            @Parameter(description = "刷新令牌") @RequestParam String refreshToken) {
        LoginVO loginVO = userService.refreshToken(refreshToken);
        return Result.success(loginVO);
    }

    @Operation(summary = "用户登出", description = "用户登出，清除Token信息")
    @PostMapping("/logout")
    public Result<Void> logout() {
        userService.logout();
        return Result.success();
    }

    @Operation(summary = "获取当前用户信息", description = "根据Token获取当前登录用户信息")
    @GetMapping("/current")
    public Result<UserVO> getCurrentUser() {
        UserVO userVO = userService.getCurrentUser();
        return Result.success(userVO);
    }

    @Operation(summary = "更新用户信息", description = "更新当前用户个人信息")
    @PutMapping("/update")
    public Result<Void> updateUser(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UserUpdateDTO dto) {
        userService.updateUser(principal.getUserId(), dto);
        return Result.success();
    }

    @Operation(summary = "修改密码", description = "修改当前用户密码")
    @PutMapping("/password")
    public Result<Void> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Parameter(description = "旧密码") @RequestParam String oldPassword,
            @Parameter(description = "新密码") @RequestParam String newPassword) {
        userService.changePassword(principal.getUserId(), oldPassword, newPassword);
        return Result.success();
    }

    @Operation(summary = "根据ID查询用户", description = "管理员根据ID查询用户信息")
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<UserVO> getById(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        UserVO userVO = userService.getById(id);
        return Result.success(userVO);
    }

    @Operation(summary = "根据用户名查询用户", description = "管理员根据用户名查询用户信息")
    @GetMapping("/username/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<UserVO> getByUsername(
            @Parameter(description = "用户名") @PathVariable String username) {
        UserVO userVO = userService.getByUsername(username);
        return Result.success(userVO);
    }
}
