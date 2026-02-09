import request from '@/utils/request';
import type { Currency, ExchangeRate, ExchangeRateDTO, ExchangeRateListParams, ExchangeRateListResponse } from '@/models/rate';
import type { Result, PageResult } from '@/models/common';

// Get all currencies
export async function getCurrencies(): Promise<Result<Currency[]>> {
  return request({
    url: '/exchange-rate/currencies',
    method: 'GET',
  });
}

// Get exchange rates list
export async function getExchangeRates(params?: ExchangeRateListParams): Promise<Result<PageResult<ExchangeRate>>> {
  return request({
    url: '/exchange-rate/list',
    method: 'GET',
    params: {
      pageNum: params?.page,
      pageSize: params?.pageSize,
      fromCurrency: params?.fromCurrency,
      toCurrency: params?.toCurrency,
    },
  });
}

// Get specific exchange rate
export async function getExchangeRate(id: number): Promise<Result<ExchangeRate>> {
  return request({
    url: `/exchange-rate/${id}`,
    method: 'GET',
  });
}

// Get exchange rate by currency pair
export async function getExchangeRateByPair(fromCurrency: string, toCurrency: string): Promise<Result<number>> {
  return request({
    url: '/exchange-rate/rate',
    method: 'GET',
    params: { from: fromCurrency, to: toCurrency },
  });
}

// Create exchange rate
export async function createExchangeRate(data: ExchangeRateDTO): Promise<Result<void>> {
  return request({
    url: '/exchange-rate',
    method: 'POST',
    data,
  });
}

// Update exchange rate
export async function updateExchangeRate(id: number, data: ExchangeRateDTO): Promise<Result<void>> {
  return request({
    url: `/exchange-rate/${id}`,
    method: 'PUT',
    data,
  });
}

// Delete exchange rate
export async function deleteExchangeRate(id: number): Promise<Result<void>> {
  return request({
    url: `/exchange-rate/${id}`,
    method: 'DELETE',
  });
}
