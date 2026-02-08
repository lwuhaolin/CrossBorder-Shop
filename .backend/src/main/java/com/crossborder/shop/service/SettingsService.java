package com.crossborder.shop.service;

import com.crossborder.shop.dto.AppConfigDTO;
import com.crossborder.shop.dto.SystemSettingDTO;
import com.crossborder.shop.vo.AppConfigVO;
import com.crossborder.shop.vo.SystemSettingVO;
import com.crossborder.shop.vo.SystemStatsVO;

import java.util.List;

/**
 * 系统设置服务
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
public interface SettingsService {

    List<SystemSettingVO> getAllSettings();

    SystemSettingVO getSettingByKey(String key);

    void updateSetting(String key, SystemSettingDTO dto);

    AppConfigVO getAppConfig();

    void updateAppConfig(AppConfigDTO dto);

    SystemStatsVO getSystemStats();

    boolean getBooleanConfig(String key, boolean defaultValue);

    void testEmailSettings(String email);
}
