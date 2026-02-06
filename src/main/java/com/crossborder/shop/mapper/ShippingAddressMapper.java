package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.ShippingAddress;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 收货地址Mapper接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Mapper
public interface ShippingAddressMapper {

    /**
     * 根据ID查询
     */
    ShippingAddress selectById(@Param("id") Long id);

    /**
     * 根据用户ID查询地址列表
     */
    List<ShippingAddress> selectByUserId(@Param("userId") Long userId);

    /**
     * 根据用户ID查询默认地址
     */
    ShippingAddress selectDefaultByUserId(@Param("userId") Long userId);

    /**
     * 插入地址
     */
    int insert(ShippingAddress address);

    /**
     * 更新地址
     */
    int updateById(ShippingAddress address);

    /**
     * 删除地址
     */
    int deleteById(@Param("id") Long id);

    /**
     * 取消用户所有默认地址
     */
    int cancelDefaultByUserId(@Param("userId") Long userId);

    /**
     * 设置默认地址
     */
    int setDefault(@Param("id") Long id);
}
