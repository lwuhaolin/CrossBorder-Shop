package com.crossborder.shop.service;

import com.crossborder.shop.dto.UserLoginDTO;
import com.crossborder.shop.dto.UserRegisterDTO;
import com.crossborder.shop.dto.UserUpdateDTO;
import com.crossborder.shop.vo.LoginVO;
import com.crossborder.shop.vo.UserVO;

/**
 * 用户服务接口
 * 
 * @author CrossBorder Team
 * @since 2026-02-04
 */
public interface UserService {

    /**
     * 用户注册
     *
     * @param dto 注册信息
     */
    void register(UserRegisterDTO dto);

    /**
     * 用户登录
     *
     * @param dto 登录信息
     * @return 登录响应（含双Token�?
     */
    LoginVO login(UserLoginDTO dto);

    /**
     * 刷新Token
     *
     * @param refreshToken 刷新令牌
     * @return 新的登录响应
     */
    LoginVO refreshToken(String refreshToken);

    /**
     * 退出登�?
     */
    void logout();

    /**
     * 获取当前用户信息
     *
     * @return 用户信息
     */
    UserVO getCurrentUser();

    /**
     * 更新用户信息
     *
     * @param userId 用户ID
     * @param dto    更新信息
     */
    void updateUser(Long userId, UserUpdateDTO dto);

    /**
     * 修改密码
     *
     * @param userId      用户ID
     * @param oldPassword 旧密�?
     * @param newPassword 新密�?
     */
    void changePassword(Long userId, String oldPassword, String newPassword);

    /**
     * 根据ID获取用户
     *
     * @param id 用户ID
     * @return 用户信息
     */
    UserVO getById(Long id);

    /**
     * 根据用户名获取用�?
     *
     * @param username 用户�?
     * @return 用户信息
     */
    UserVO getByUsername(String username);
}
