package com.crossborder.shop.service.impl;

import com.crossborder.shop.common.ResultCode;
import com.crossborder.shop.dto.AppConfigDTO;
import com.crossborder.shop.dto.SystemSettingDTO;
import com.crossborder.shop.entity.SystemConfig;
import com.crossborder.shop.exception.BusinessException;
import com.crossborder.shop.mapper.SystemConfigMapper;
import com.crossborder.shop.mapper.SystemStatsMapper;
import com.crossborder.shop.mapper.SellerStatsMapper;
import com.crossborder.shop.service.SettingsService;
import com.crossborder.shop.vo.AppConfigVO;
import com.crossborder.shop.vo.SystemSettingVO;
import com.crossborder.shop.vo.SystemStatsVO;
import com.crossborder.shop.vo.SellerStatsVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 系统设置服务实现
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SettingsServiceImpl implements SettingsService {

    private static final String KEY_APP_NAME = "app.name";
    private static final String KEY_APP_VERSION = "app.version";
    private static final String KEY_APP_DESCRIPTION = "app.description";
    private static final String KEY_SUPPORT_EMAIL = "support.email";
    private static final String KEY_SUPPORT_PHONE = "support.phone";
    private static final String KEY_DEFAULT_CURRENCY = "default.currency";
    private static final String KEY_FREE_SHIPPING_THRESHOLD = "shipping.free.threshold";
    private static final String KEY_SHIPPING_FEE = "shipping.fee";
    private static final String KEY_MAX_UPLOAD_SIZE = "file.upload.max.size";
    private static final String KEY_ENABLE_USER_REGISTRATION = "user.registration.enable";
    private static final String KEY_ENABLE_SELLER_REGISTRATION = "seller.registration.enable";
    private static final String KEY_HOME_CAROUSEL_IMAGES = "home.carousel.images";

    private static final String APP_CONFIG_CACHE_KEY = "app:config";
    private static final long APP_CONFIG_CACHE_TTL_DAYS = 7;

    private final SystemConfigMapper systemConfigMapper;
    private final SystemStatsMapper systemStatsMapper;
    private final SellerStatsMapper sellerStatsMapper;
    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public List<SystemSettingVO> getAllSettings() {
        List<SystemConfig> configs = systemConfigMapper.selectAll();
        return configs.stream()
                .map(this::convertToSettingVO)
                .collect(Collectors.toList());
    }

    @Override
    public SystemSettingVO getSettingByKey(String key) {
        SystemConfig config = systemConfigMapper.selectByKey(key);
        if (config == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "配置不存在");
        }
        return convertToSettingVO(config);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateSetting(String key, SystemSettingDTO dto) {
        if (dto == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "参数不能为空");
        }
        String configKey = key != null ? key : dto.getSettingKey();
        if (configKey == null || configKey.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "配置键不能为空");
        }

        upsertConfig(configKey, dto.getSettingValue(), "string", dto.getSettingGroup(), dto.getDescription());
    }

    @Override
    public AppConfigVO getAppConfig() {
        Object cached = redisTemplate.opsForValue().get(APP_CONFIG_CACHE_KEY);
        if (cached instanceof AppConfigVO) {
            return (AppConfigVO) cached;
        }

        AppConfigVO vo = buildAppConfig();
        redisTemplate.opsForValue().set(APP_CONFIG_CACHE_KEY, vo, APP_CONFIG_CACHE_TTL_DAYS, TimeUnit.DAYS);
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateAppConfig(AppConfigDTO dto) {
        if (dto == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "参数不能为空");
        }

        if (dto.getAppName() != null) {
            upsertConfig(KEY_APP_NAME, dto.getAppName(), "string", "basic", "应用名称");
        }
        if (dto.getAppVersion() != null) {
            upsertConfig(KEY_APP_VERSION, dto.getAppVersion(), "string", "basic", "应用版本");
        }
        if (dto.getAppDescription() != null) {
            upsertConfig(KEY_APP_DESCRIPTION, dto.getAppDescription(), "string", "basic", "应用描述");
        }
        if (dto.getSupportEmail() != null) {
            upsertConfig(KEY_SUPPORT_EMAIL, dto.getSupportEmail(), "string", "contact", "客服邮箱");
        }
        if (dto.getSupportPhone() != null) {
            upsertConfig(KEY_SUPPORT_PHONE, dto.getSupportPhone(), "string", "contact", "客服电话");
        }
        if (dto.getDefaultCurrency() != null) {
            upsertConfig(KEY_DEFAULT_CURRENCY, dto.getDefaultCurrency(), "string", "transaction", "默认币种");
        }
        if (dto.getFreeshippingThreshold() != null) {
            upsertConfig(KEY_FREE_SHIPPING_THRESHOLD, dto.getFreeshippingThreshold().toPlainString(), "number",
                    "transaction", "满额免运费金额");
        }
        if (dto.getShippingFee() != null) {
            upsertConfig(KEY_SHIPPING_FEE, dto.getShippingFee().toPlainString(), "number", "transaction", "默认运费");
        }
        if (dto.getMaxUploadSize() != null) {
            upsertConfig(KEY_MAX_UPLOAD_SIZE, dto.getMaxUploadSize().toString(), "number", "file", "最大上传文件大小(MB)");
        }
        if (dto.getEnableUserRegistration() != null) {
            upsertConfig(KEY_ENABLE_USER_REGISTRATION, dto.getEnableUserRegistration().toString(), "boolean", "feature",
                    "启用用户注册");
        }
        if (dto.getEnableSellerRegistration() != null) {
            upsertConfig(KEY_ENABLE_SELLER_REGISTRATION, dto.getEnableSellerRegistration().toString(), "boolean",
                    "feature", "启用卖家注册");
        }
        if (dto.getCarouselImages() != null) {
            String joined = String.join(";", dto.getCarouselImages());
            upsertConfig(KEY_HOME_CAROUSEL_IMAGES, joined, "string", "homepage", "主页轮播图图片路径，分号分隔");
        }

        AppConfigVO refreshed = buildAppConfig();
        redisTemplate.opsForValue().set(APP_CONFIG_CACHE_KEY, refreshed, APP_CONFIG_CACHE_TTL_DAYS, TimeUnit.DAYS);
    }

    @Override
    public SystemStatsVO getSystemStats() {
        SystemStatsVO stats = new SystemStatsVO();
        stats.setTotalUsers(systemStatsMapper.countTotalUsers());
        stats.setActiveUsers(systemStatsMapper.countActiveUsers());
        stats.setNewUsersToday(systemStatsMapper.countNewUsersToday());
        stats.setTotalProducts(systemStatsMapper.countTotalProducts());
        stats.setActiveProducts(systemStatsMapper.countActiveProducts());
        stats.setTotalOrders(systemStatsMapper.countTotalOrders());
        stats.setPendingOrders(systemStatsMapper.countPendingOrders());
        stats.setTotalRevenue(systemStatsMapper.sumTotalRevenue());
        stats.setRevenueToday(systemStatsMapper.sumRevenueToday());
        stats.setLastUpdateTime(LocalDateTime.now());
        return stats;
    }

    @Override
    public SellerStatsVO getSellerStats(Long sellerId) {
        SellerStatsVO stats = new SellerStatsVO();
        stats.setTotalProducts(sellerStatsMapper.countTotalProducts(sellerId));
        stats.setActiveProducts(sellerStatsMapper.countActiveProducts(sellerId));
        stats.setTotalOrders(sellerStatsMapper.countTotalOrders(sellerId));
        stats.setPendingOrders(sellerStatsMapper.countPendingOrders(sellerId));
        stats.setCompletedOrders(sellerStatsMapper.countCompletedOrders(sellerId));
        stats.setTotalRevenue(sellerStatsMapper.sumTotalRevenue(sellerId));
        stats.setRevenueToday(sellerStatsMapper.sumRevenueToday(sellerId));
        stats.setRevenueThisMonth(sellerStatsMapper.sumRevenueThisMonth(sellerId));
        stats.setTotalSales(sellerStatsMapper.countTotalSales(sellerId));
        return stats;
    }

    private AppConfigVO buildAppConfig() {
        List<String> keys = Arrays.asList(
                KEY_APP_NAME,
                KEY_APP_VERSION,
                KEY_APP_DESCRIPTION,
                KEY_SUPPORT_EMAIL,
                KEY_SUPPORT_PHONE,
                KEY_DEFAULT_CURRENCY,
                KEY_FREE_SHIPPING_THRESHOLD,
                KEY_SHIPPING_FEE,
                KEY_MAX_UPLOAD_SIZE,
                KEY_ENABLE_USER_REGISTRATION,
                KEY_ENABLE_SELLER_REGISTRATION,
                KEY_HOME_CAROUSEL_IMAGES);

        List<SystemConfig> configs = systemConfigMapper.selectByKeys(keys);
        Map<String, SystemConfig> map = configs.stream()
                .collect(Collectors.toMap(SystemConfig::getConfigKey, c -> c, (a, b) -> a));

        AppConfigVO vo = new AppConfigVO();
        vo.setAppName(getStringValue(map, KEY_APP_NAME));
        vo.setAppVersion(getStringValue(map, KEY_APP_VERSION));
        vo.setAppDescription(getStringValue(map, KEY_APP_DESCRIPTION));
        vo.setSupportEmail(getStringValue(map, KEY_SUPPORT_EMAIL));
        vo.setSupportPhone(getStringValue(map, KEY_SUPPORT_PHONE));
        vo.setDefaultCurrency(getStringValue(map, KEY_DEFAULT_CURRENCY));
        vo.setFreeshippingThreshold(getBigDecimalValue(map, KEY_FREE_SHIPPING_THRESHOLD));
        vo.setShippingFee(getBigDecimalValue(map, KEY_SHIPPING_FEE));
        vo.setMaxUploadSize(getIntegerValue(map, KEY_MAX_UPLOAD_SIZE));
        vo.setEnableUserRegistration(getBooleanValue(map, KEY_ENABLE_USER_REGISTRATION));
        vo.setEnableSellerRegistration(getBooleanValue(map, KEY_ENABLE_SELLER_REGISTRATION));

        String carouselValue = getStringValue(map, KEY_HOME_CAROUSEL_IMAGES);
        List<String> carouselImages = parseCarouselImages(carouselValue);
        vo.setCarouselImages(carouselImages);
        vo.setCarouselImageCount(carouselImages.size());

        return vo;
    }

    private List<String> parseCarouselImages(String value) {
        if (value == null || value.trim().isEmpty()) {
            return new ArrayList<>();
        }
        String[] parts = value.split(";");
        List<String> result = new ArrayList<>();
        for (String part : parts) {
            String trimmed = part.trim();
            if (!trimmed.isEmpty()) {
                result.add(trimmed);
            }
        }
        return result;
    }

    @Override
    public boolean getBooleanConfig(String key, boolean defaultValue) {
        SystemConfig config = systemConfigMapper.selectByKey(key);
        if (config == null || config.getConfigValue() == null) {
            return defaultValue;
        }
        String value = config.getConfigValue().trim();
        return "1".equals(value) || "true".equalsIgnoreCase(value);
    }

    @Override
    public void testEmailSettings(String email) {
        if (email == null || email.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "邮箱不能为空");
        }
        log.info("测试邮箱设置：{}", email);
    }

    private SystemSettingVO convertToSettingVO(SystemConfig config) {
        SystemSettingVO vo = new SystemSettingVO();
        vo.setId(config.getId());
        vo.setSettingKey(config.getConfigKey());
        vo.setSettingValue(config.getConfigValue());
        vo.setSettingGroup(config.getGroupName());
        vo.setDescription(config.getDescription());
        vo.setCreateTime(config.getCreateTime());
        vo.setUpdateTime(config.getUpdateTime());
        return vo;
    }

    private String getStringValue(Map<String, SystemConfig> map, String key) {
        SystemConfig config = map.get(key);
        return config != null ? config.getConfigValue() : null;
    }

    private BigDecimal getBigDecimalValue(Map<String, SystemConfig> map, String key) {
        SystemConfig config = map.get(key);
        if (config == null || config.getConfigValue() == null) {
            return null;
        }
        try {
            return new BigDecimal(config.getConfigValue());
        } catch (Exception e) {
            log.warn("配置值不是合法数字: key={}, value={}", key, config.getConfigValue());
            return null;
        }
    }

    private Integer getIntegerValue(Map<String, SystemConfig> map, String key) {
        SystemConfig config = map.get(key);
        if (config == null || config.getConfigValue() == null) {
            return null;
        }
        try {
            return Integer.parseInt(config.getConfigValue());
        } catch (Exception e) {
            log.warn("配置值不是合法整数: key={}, value={}", key, config.getConfigValue());
            return null;
        }
    }

    private Boolean getBooleanValue(Map<String, SystemConfig> map, String key) {
        SystemConfig config = map.get(key);
        if (config == null || config.getConfigValue() == null) {
            return null;
        }
        String value = config.getConfigValue().trim();
        return "1".equals(value) || "true".equalsIgnoreCase(value);
    }

    private void upsertConfig(String key, String value, String type, String group, String description) {
        SystemConfig existing = systemConfigMapper.selectByKey(key);
        if (existing == null) {
            SystemConfig config = new SystemConfig();
            config.setConfigKey(key);
            config.setConfigValue(value);
            config.setConfigType(type);
            config.setGroupName(group);
            config.setDescription(description);
            config.setStatus(1);
            systemConfigMapper.insert(config);
            return;
        }

        SystemConfig update = new SystemConfig();
        update.setConfigKey(key);
        update.setConfigValue(value);
        update.setConfigType(type);
        update.setGroupName(group);
        update.setDescription(description);
        systemConfigMapper.updateByKey(update);
    }
}
