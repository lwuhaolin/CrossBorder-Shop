package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.SystemConfig;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 系统配置Mapper接口
 *
 * @author CrossBorder Team
 * @since 2026-02-09
 */
@Mapper
public interface SystemConfigMapper {

    /**
     * 查询所有配置
     */
    List<SystemConfig> selectAll();

    /**
     * 根据配置键查询
     */
    SystemConfig selectByKey(@Param("configKey") String configKey);

    /**
     * 批量查询配置
     */
    List<SystemConfig> selectByKeys(@Param("keys") List<String> keys);

    /**
     * 插入配置
     */
    int insert(SystemConfig config);

    /**
     * 根据配置键更新
     */
    int updateByKey(SystemConfig config);
}
