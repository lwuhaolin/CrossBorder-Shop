package com.crossborder.shop.service;

import com.crossborder.shop.common.PageResult;
import com.crossborder.shop.dto.ExchangeRateDTO;
import com.crossborder.shop.vo.CurrencyVO;
import com.crossborder.shop.vo.ExchangeRateVO;

import java.math.BigDecimal;
import java.util.List;

/**
 * 汇率服务接口
 *
 * @author CrossBorder Team
 * @since 2026-02-08
 */
public interface ExchangeRateService {

    /**
     * 获取所有启用的货币
     *
     * @return 货币列表
     */
    List<CurrencyVO> getAllCurrencies();

    /**
     * 分页查询汇率
     *
     * @param pageNum      页码
     * @param pageSize     每页数量
     * @param fromCurrency 源货币代码（可选搜索条件）
     * @param toCurrency   目标货币代码（可选搜索条件）
     * @return 分页结果
     */
    PageResult<ExchangeRateVO> listExchangeRates(Integer pageNum, Integer pageSize, String fromCurrency,
            String toCurrency);

    /**
     * 根据ID查询汇率
     *
     * @param id 汇率ID
     * @return 汇率信息
     */
    ExchangeRateVO getById(Long id);

    /**
     * 创建汇率
     *
     * @param dto 汇率数据
     */
    void createExchangeRate(ExchangeRateDTO dto);

    /**
     * 更新汇率
     *
     * @param id  汇率ID
     * @param dto 汇率数据
     */
    void updateExchangeRate(Long id, ExchangeRateDTO dto);

    /**
     * 删除汇率
     *
     * @param id 汇率ID
     */
    void deleteExchangeRate(Long id);

    /**
     * 根据币种对获取汇率
     *
     * @param fromCurrency 源货币代码
     * @param toCurrency   目标货币代码
     * @return 汇率
     */
    BigDecimal getExchangeRate(String fromCurrency, String toCurrency);
}
