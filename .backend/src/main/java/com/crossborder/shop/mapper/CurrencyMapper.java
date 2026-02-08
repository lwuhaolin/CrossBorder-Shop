package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.Currency;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 货币数据映射接口
 *
 * @author CrossBorder Team
 * @since 2026-02-08
 */
@Mapper
public interface CurrencyMapper {

    /**
     * 根据ID查询货币
     *
     * @param id 货币ID
     * @return 货币对象
     */
    Currency selectById(@Param("id") Long id);

    /**
     * 根据货币代码查询货币
     *
     * @param currencyCode 货币代码
     * @return 货币对象
     */
    Currency selectByCode(@Param("currencyCode") String currencyCode);

    /**
     * 查询所有启用的货币
     *
     * @return 货币列表
     */
    List<Currency> selectAll();

    /**
     * 插入货币
     *
     * @param currency 货币对象
     * @return 影响行数
     */
    int insert(Currency currency);

    /**
     * 更新货币
     *
     * @param currency 货币对象
     * @return 影响行数
     */
    int updateById(Currency currency);

    /**
     * 删除货币
     *
     * @param id 货币ID
     * @return 影响行数
     */
    int deleteById(@Param("id") Long id);
}
