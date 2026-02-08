package com.crossborder.shop.mapper;

import com.crossborder.shop.entity.ExchangeRate;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 汇率数据映射接口
 *
 * @author CrossBorder Team
 * @since 2026-02-08
 */
@Mapper
public interface ExchangeRateMapper {

    /**
     * 根据ID查询汇率
     *
     * @param id 汇率ID
     * @return 汇率对象
     */
    ExchangeRate selectById(@Param("id") Long id);

    /**
     * 根据货币对查询汇率
     *
     * @param fromCurrency 源货币代码
     * @param toCurrency 目标货币代码
     * @return 汇率对象
     */
    ExchangeRate selectByPair(@Param("fromCurrency") String fromCurrency, @Param("toCurrency") String toCurrency);

    /**
     * 分页查询汇率
     *
     * @param offset 分页偏移量
     * @param limit 分页大小
     * @param fromCurrency 源货币代码（可选）
     * @param toCurrency 目标货币代码（可选）
     * @return 汇率列表
     */
    List<ExchangeRate> selectPage(@Param("offset") long offset, @Param("limit") int limit,
                                   @Param("fromCurrency") String fromCurrency, @Param("toCurrency") String toCurrency);

    /**
     * 查询汇率总数
     *
     * @param fromCurrency 源货币代码（可选）
     * @param toCurrency 目标货币代码（可选）
     * @return 总数
     */
    long countExchangeRates(@Param("fromCurrency") String fromCurrency, @Param("toCurrency") String toCurrency);

    /**
     * 插入汇率
     *
     * @param exchangeRate 汇率对象
     * @return 影响行数
     */
    int insert(ExchangeRate exchangeRate);

    /**
     * 更新汇率
     *
     * @param exchangeRate 汇率对象
     * @return 影响行数
     */
    int updateById(ExchangeRate exchangeRate);

    /**
     * 删除汇率
     *
     * @param id 汇率ID
     * @return 影响行数
     */
    int deleteById(@Param("id") Long id);
}
