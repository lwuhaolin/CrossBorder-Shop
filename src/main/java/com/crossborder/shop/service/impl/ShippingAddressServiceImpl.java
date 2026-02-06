package com.crossborder.shop.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.crossborder.shop.common.ResultCode;
import com.crossborder.shop.dto.ShippingAddressDTO;
import com.crossborder.shop.entity.ShippingAddress;
import com.crossborder.shop.exception.BusinessException;
import com.crossborder.shop.mapper.ShippingAddressMapper;
import com.crossborder.shop.service.ShippingAddressService;
import com.crossborder.shop.vo.ShippingAddressVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 收货地址服务实现类
 *
 * @author CrossBorder Shop
 * @since 2026-02-04
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ShippingAddressServiceImpl implements ShippingAddressService {

    private final ShippingAddressMapper shippingAddressMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createAddress(Long userId, ShippingAddressDTO dto) {
        // 如果设置为默认地址，先取消其他默认地址
        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            shippingAddressMapper.cancelDefaultByUserId(userId);
        }

        ShippingAddress address = BeanUtil.copyProperties(dto, ShippingAddress.class);
        address.setUserId(userId);
        address.setCreateBy(userId);
        address.setUpdateBy(userId);

        // 如果未指定默认地址且这是第一个地址，则设为默认
        if (dto.getIsDefault() == null) {
            List<ShippingAddress> existingAddresses = shippingAddressMapper.selectByUserId(userId);
            address.setIsDefault(existingAddresses.isEmpty());
        }

        shippingAddressMapper.insert(address);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateAddress(Long userId, Long addressId, ShippingAddressDTO dto) {
        ShippingAddress address = shippingAddressMapper.selectById(addressId);
        if (address == null) {
            throw new BusinessException(ResultCode.SHIPPING_ADDRESS_NOT_FOUND);
        }

        // 校验权限
        if (!address.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权操作该地址");
        }

        // 如果设置为默认地址，先取消其他默认地址
        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            shippingAddressMapper.cancelDefaultByUserId(userId);
        }

        BeanUtil.copyProperties(dto, address, "id", "userId");
        address.setUpdateBy(userId);

        shippingAddressMapper.updateById(address);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteAddress(Long userId, Long addressId) {
        ShippingAddress address = shippingAddressMapper.selectById(addressId);
        if (address == null) {
            throw new BusinessException(ResultCode.SHIPPING_ADDRESS_NOT_FOUND);
        }

        // 校验权限
        if (!address.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权操作该地址");
        }

        shippingAddressMapper.deleteById(addressId);

        // 如果删除的是默认地址，自动设置第一个地址为默认
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            List<ShippingAddress> addresses = shippingAddressMapper.selectByUserId(userId);
            if (!addresses.isEmpty()) {
                shippingAddressMapper.setDefault(addresses.get(0).getId());
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void setDefaultAddress(Long userId, Long addressId) {
        ShippingAddress address = shippingAddressMapper.selectById(addressId);
        if (address == null) {
            throw new BusinessException(ResultCode.SHIPPING_ADDRESS_NOT_FOUND);
        }

        // 校验权限
        if (!address.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "无权操作该地址");
        }

        // 取消其他默认地址
        shippingAddressMapper.cancelDefaultByUserId(userId);

        // 设置新的默认地址
        shippingAddressMapper.setDefault(addressId);
    }

    @Override
    public ShippingAddressVO getAddressById(Long addressId) {
        ShippingAddress address = shippingAddressMapper.selectById(addressId);
        if (address == null) {
            throw new BusinessException(ResultCode.SHIPPING_ADDRESS_NOT_FOUND);
        }
        return BeanUtil.copyProperties(address, ShippingAddressVO.class);
    }

    @Override
    public List<ShippingAddressVO> getAddressList(Long userId) {
        List<ShippingAddress> addresses = shippingAddressMapper.selectByUserId(userId);
        return addresses.stream()
                .map(address -> BeanUtil.copyProperties(address, ShippingAddressVO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ShippingAddressVO getDefaultAddress(Long userId) {
        ShippingAddress address = shippingAddressMapper.selectDefaultByUserId(userId);
        if (address == null) {
            return null;
        }
        return BeanUtil.copyProperties(address, ShippingAddressVO.class);
    }
}
