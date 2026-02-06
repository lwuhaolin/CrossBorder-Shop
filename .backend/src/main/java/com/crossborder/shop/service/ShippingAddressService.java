package com.crossborder.shop.service;

import com.crossborder.shop.dto.ShippingAddressDTO;
import com.crossborder.shop.vo.ShippingAddressVO;

import java.util.List;

/**
 * 收货地址服务接口
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
public interface ShippingAddressService {

    /**
     * 创建收货地址
     */
    void createAddress(Long userId, ShippingAddressDTO dto);

    /**
     * 更新收货地址
     */
    void updateAddress(Long userId, Long addressId, ShippingAddressDTO dto);

    /**
     * 删除收货地址
     */
    void deleteAddress(Long userId, Long addressId);

    /**
     * 设置默认地址
     */
    void setDefaultAddress(Long userId, Long addressId);

    /**
     * 根据ID查询地址
     */
    ShippingAddressVO getAddressById(Long addressId);

    /**
     * 查询用户地址列表
     */
    List<ShippingAddressVO> getAddressList(Long userId);

    /**
     * 获取默认地址
     */
    ShippingAddressVO getDefaultAddress(Long userId);
}
