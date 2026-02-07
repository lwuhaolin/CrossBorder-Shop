package com.crossborder.shop.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.crossborder.shop.common.ResultCode;
import com.crossborder.shop.dto.UserLoginDTO;
import com.crossborder.shop.dto.UserRegisterDTO;
import com.crossborder.shop.dto.UserUpdateDTO;
import com.crossborder.shop.entity.Role;
import com.crossborder.shop.entity.User;
import com.crossborder.shop.exception.BusinessException;
import com.crossborder.shop.mapper.UserMapper;
import com.crossborder.shop.security.UserPrincipal;
import com.crossborder.shop.service.UserService;
import com.crossborder.shop.util.JwtUtil;
import com.crossborder.shop.vo.LoginVO;
import com.crossborder.shop.vo.RoleVO;
import com.crossborder.shop.vo.UserVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户服务实现
 * 
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void register(UserRegisterDTO dto) {
        // 校验两次密码是否一致
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "两次输入的密码不一致");
        }

        // 检查用户名是否已存在
        User existUser = userMapper.selectByUsername(dto.getUsername());
        if (existUser != null) {
            throw new BusinessException(ResultCode.USER_ALREADY_EXISTS);
        }

        // 创建用户
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getNickname() != null ? dto.getNickname() : dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setStatus(1); // 启用
        user.setGender(0); // 未知

        int result = userMapper.insert(user);
        if (result <= 0) {
            throw new BusinessException("用户注册失败");
        }

        // 绑定角色
        userMapper.insertUserRole(user.getId(), dto.getRoleId());

        log.info("用户注册成功: {}", dto.getUsername());
    }

    @Override
    public LoginVO login(UserLoginDTO dto) {
        // 查询用户
        User user = userMapper.selectByUsername(dto.getUsername());
        if (user == null) {
            throw new BusinessException(ResultCode.USERNAME_OR_PASSWORD_ERROR);
        }

        // 校验密码
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BusinessException(ResultCode.USERNAME_OR_PASSWORD_ERROR);
        }

        // 校验账号状态
        if (user.getStatus() == 0) {
            throw new BusinessException(ResultCode.ACCOUNT_DISABLED);
        } else if (user.getStatus() == 2) {
            throw new BusinessException(ResultCode.ACCOUNT_LOCKED);
        }

        // 更新登录信息
        user.setLastLoginTime(LocalDateTime.now());
        user.setLastLoginIp("127.0.0.1"); // TODO: 获取真实IP
        userMapper.updateById(user);

        // 生成Token
        List<Role> roles = userMapper.selectRolesByUserId(user.getId());
        List<String> roleCodes = roles.stream()
                .map(Role::getRoleCode)
                .collect(Collectors.toList());
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getUsername(), roleCodes);
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getUsername());

        // 封装用户信息
        UserVO userVO = convertToUserVO(user);

        log.info("用户登录成功: {}", dto.getUsername());

        return LoginVO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .accessTokenExpiresIn(jwtUtil.getAccessTokenExpiration())
                .refreshTokenExpiresIn(jwtUtil.getRefreshTokenExpiration())
                .userInfo(userVO)
                .build();
    }

    @Override
    public LoginVO refreshToken(String refreshToken) {
        // 校验RefreshToken是否过期
        if (jwtUtil.isTokenExpired(refreshToken)) {
            throw new BusinessException(ResultCode.TOKEN_EXPIRED);
        }

        // 校验RefreshToken是否有效
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new BusinessException(ResultCode.TOKEN_INVALID);
        }

        // 校验Token类型
        String tokenType = jwtUtil.getTokenTypeFromToken(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new BusinessException(ResultCode.TOKEN_INVALID.getCode(), "Token类型错误");
        }

        // 获取用户信息
        Long userId = jwtUtil.getUserIdFromToken(refreshToken);
        String username = jwtUtil.getUsernameFromToken(refreshToken);

        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }

        // 校验账号状态
        if (user.getStatus() != 1) {
            throw new BusinessException(ResultCode.ACCOUNT_DISABLED);
        }

        // 生成新Token
        List<Role> roles = userMapper.selectRolesByUserId(userId);
        List<String> roleCodes = roles.stream()
                .map(Role::getRoleCode)
                .collect(Collectors.toList());
        String newAccessToken = jwtUtil.generateAccessToken(userId, username, roleCodes);
        String newRefreshToken = jwtUtil.generateRefreshToken(userId, username);

        UserVO userVO = convertToUserVO(user);

        log.info("Token刷新成功: {}", username);

        return LoginVO.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .accessTokenExpiresIn(jwtUtil.getAccessTokenExpiration())
                .refreshTokenExpiresIn(jwtUtil.getRefreshTokenExpiration())
                .userInfo(userVO)
                .build();
    }

    @Override
    public void logout() {
        // TODO: Token登出时需要从Redis中删除
        log.info("用户登出");
    }

    @Override
    public UserVO getCurrentUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userMapper.selectById(principal.getUserId());
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }
        return convertToUserVO(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateUser(Long userId, UserUpdateDTO dto) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }

        // 更新用户信息
        User updateUser = new User();
        updateUser.setId(userId);
        BeanUtil.copyProperties(dto, updateUser);

        int result = userMapper.updateById(updateUser);
        if (result <= 0) {
            throw new BusinessException("用户信息更新失败");
        }

        log.info("用户信息更新: {}", userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }

        // 校验旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BusinessException(ResultCode.PASSWORD_ERROR);
        }

        // 更新密码
        User updateUser = new User();
        updateUser.setId(userId);
        updateUser.setPassword(passwordEncoder.encode(newPassword));

        int result = userMapper.updateById(updateUser);
        if (result <= 0) {
            throw new BusinessException("密码修改失败");
        }

        log.info("用户修改密码: {}", userId);
    }

    @Override
    public UserVO getById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }
        return convertToUserVO(user);
    }

    @Override
    public UserVO getByUsername(String username) {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }
        return convertToUserVO(user);
    }

    /**
     * User转UserVO
     */
    private UserVO convertToUserVO(User user) {
        UserVO vo = new UserVO();
        BeanUtil.copyProperties(user, vo);

        // 查询角色
        List<Role> roles = userMapper.selectRolesByUserId(user.getId());
        List<RoleVO> roleVOs = roles.stream()
                .map(role -> {
                    RoleVO roleVO = new RoleVO();
                    BeanUtil.copyProperties(role, roleVO);
                    return roleVO;
                })
                .collect(Collectors.toList());
        vo.setRoles(roleVOs);

        return vo;
    }
}
