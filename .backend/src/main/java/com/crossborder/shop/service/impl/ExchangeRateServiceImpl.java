package com.crossborder.shop.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.crossborder.shop.common.PageResult;
import com.crossborder.shop.common.ResultCode;
import com.crossborder.shop.dto.ExchangeRateDTO;
import com.crossborder.shop.entity.Currency;
import com.crossborder.shop.entity.ExchangeRate;
import com.crossborder.shop.exception.BusinessException;
import com.crossborder.shop.mapper.CurrencyMapper;
import com.crossborder.shop.mapper.ExchangeRateMapper;
import com.crossborder.shop.service.ExchangeRateService;
import com.crossborder.shop.vo.CurrencyVO;
import com.crossborder.shop.vo.ExchangeRateVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 汇率服务实现
 *
 * @author CrossBorder Team
 * @since 2026-02-08
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExchangeRateServiceImpl implements ExchangeRateService {

    private final ExchangeRateMapper exchangeRateMapper;
    private final CurrencyMapper currencyMapper;

    @Override
    public List<CurrencyVO> getAllCurrencies() {
        List<Currency> currencies = currencyMapper.selectAll();
        return currencies.stream()
                .map(currency -> {
                    CurrencyVO vo = new CurrencyVO();
                    BeanUtil.copyProperties(currency, vo);
                    return vo;
                })
                .collect(Collectors.toList());
    }

    @Override
    public PageResult<ExchangeRateVO> listExchangeRates(Integer pageNum, Integer pageSize, String fromCurrency, String toCurrency) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 20;
        }

        // 计算偏移量
        long offset = (long) (pageNum - 1) * pageSize;

        // 查询总数
        long total = exchangeRateMapper.countExchangeRates(fromCurrency, toCurrency);

        // 查询数据
        List<ExchangeRate> exchangeRates = exchangeRateMapper.selectPage(offset, pageSize, fromCurrency, toCurrency);
        List<ExchangeRateVO> exchangeRateVOs = exchangeRates.stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());

        log.info("分页查询汇率: pageNum={}, pageSize={}, fromCurrency={}, toCurrency={}", pageNum, pageSize, fromCurrency, toCurrency);

        return PageResult.build(pageNum, pageSize, total, exchangeRateVOs);
    }

    @Override
    public ExchangeRateVO getById(Long id) {
        ExchangeRate exchangeRate = exchangeRateMapper.selectById(id);
        if (exchangeRate == null) {
            throw new BusinessException("汇率不存在");
        }
        return convertToVO(exchangeRate);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createExchangeRate(ExchangeRateDTO dto) {
        // 验证源和目标货币是否相同
        if (dto.getFromCurrency().equals(dto.getToCurrency())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "源货币和目标货币不能相同");
        }

        // 检查该货币对是否已存在
        ExchangeRate existing = exchangeRateMapper.selectByPair(dto.getFromCurrency(), dto.getToCurrency());
        if (existing != null && existing.getDeleted() == 0) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "该货币对的汇率已存在");
        }

        // 创建汇率
        ExchangeRate exchangeRate = new ExchangeRate();
        BeanUtil.copyProperties(dto, exchangeRate);

        int result = exchangeRateMapper.insert(exchangeRate);
        if (result <= 0) {
            throw new BusinessException("汇率创建失败");
        }

        log.info("汇率创建成功: {}/{}", dto.getFromCurrency(), dto.getToCurrency());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateExchangeRate(Long id, ExchangeRateDTO dto) {
        ExchangeRate exchangeRate = exchangeRateMapper.selectById(id);
        if (exchangeRate == null) {
            throw new BusinessException("汇率不存在");
        }

        // 验证源和目标货币是否相同
        if (dto.getFromCurrency().equals(dto.getToCurrency())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "源货币和目标货币不能相同");
        }

        // 更新汇率
        ExchangeRate updateRate = new ExchangeRate();
        updateRate.setId(id);
        BeanUtil.copyProperties(dto, updateRate);

        int result = exchangeRateMapper.updateById(updateRate);
        if (result <= 0) {
            throw new BusinessException("汇率更新失败");
        }

        log.info("汇率更新成功: id={}, {}/{}", id, dto.getFromCurrency(), dto.getToCurrency());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteExchangeRate(Long id) {
        ExchangeRate exchangeRate = exchangeRateMapper.selectById(id);
        if (exchangeRate == null) {
            throw new BusinessException("汇率不存在");
        }

        int result = exchangeRateMapper.deleteById(id);
        if (result <= 0) {
            throw new BusinessException("汇率删除失败");
        }

        log.info("汇率删除成功: id={}", id);
    }

    /**
     * 将ExchangeRate转换为ExchangeRateVO
     */
    private ExchangeRateVO convertToVO(ExchangeRate exchangeRate) {
        ExchangeRateVO vo = new ExchangeRateVO();
        BeanUtil.copyProperties(exchangeRate, vo);
        return vo;
    }
}
