package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.Role;
import com.crossborder.shop.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户Mapper接口
 * 
 * @author CrossBorder Team
 * @since 2026-02-04
 */
@Mapper
public interface UserMapper {

    /**
     * 根据ID查询用户
     *
     * @param id 用户ID
     * @return 用户信息
     */
    User selectById(@Param("id") Long id);

    /**
     * 根据用户名查询用�?
     *
     * @param username 用户�?
     * @return 用户信息
     */
    User selectByUsername(@Param("username") String username);

    /**
     * 插入用户
     *
     * @param user 用户信息
     * @return 影响行数
     */
    int insert(User user);

    /**
     * 更新用户
     *
     * @param user 用户信息
     * @return 影响行数
     */
    int updateById(User user);

    /**
     * 删除用户（逻辑删除�?
     *
     * @param id 用户ID
     * @return 影响行数
     */
    int deleteById(@Param("id") Long id);

    /**
     * 查询用户的角色列�?
     *
     * @param userId 用户ID
     * @return 角色列表
     */
    List<Role> selectRolesByUserId(@Param("userId") Long userId);

    /**
     * 插入用户角色关联
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 影响行数
     */
    int insertUserRole(@Param("userId") Long userId, @Param("roleId") Long roleId);

    /**
     * 分页查询用户列表
     *
     * @param offset 分页偏移量
     * @param limit 分页大小
     * @param username 搜索用户名（可选）
     * @param status 用户状态（可选）
     * @return 用户列表
     */
    List<User> selectPage(@Param("offset") long offset, @Param("limit") int limit,
                          @Param("username") String username, @Param("status") Integer status);

    /**
     * 查询用户总数
     *
     * @param username 搜索用户名（可选）
     * @param status 用户状态（可选）
     * @return 总数
     */
    long countUsers(@Param("username") String username, @Param("status") Integer status);
}
