package com.crossborder.shop.security;


import com.crossborder.shop.entity.Role;
import com.crossborder.shop.entity.User;
import com.crossborder.shop.mapper.UserMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Spring Security 用户详情服务
 *
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserMapper userMapper;
    
    public UserDetailsServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 根据用户名查询用户
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("用户不存在: " + username);
        }

        // 查询用户角色
        List<Role> roles = userMapper.selectRolesByUserId(user.getId());
        List<String> roleCodes = roles.stream()
                .map(Role::getRoleCode)
                .collect(Collectors.toList());

        // 构建 UserPrincipal
        return new UserPrincipal(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                roleCodes,
                user.getStatus() == 1, // enabled
                user.getStatus() == 2 // locked
        );
    }
}
