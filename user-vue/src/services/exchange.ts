import request from '@/utils/request'
import type { Result } from '@/models/common'
import type { Currency } from '@/models/exchange'

// Get available currencies
export async function getCurrencyList(): Promise<Result<Currency[]>> {
  return request({
    url: '/exchange-rate/currencies',
    method: 'GET',
  })
}

// Get exchange rate
export async function getExchangeRate(from: string, to: string): Promise<Result<number>> {
  return request({
    url: '/exchange-rate/rate',
    method: 'GET',
    params: { from, to },
  })
}
