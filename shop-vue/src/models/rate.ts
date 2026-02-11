// Exchange Rate and Currency types

export interface Currency {
  id?: number
  currencyCode: string
  currencyName: string
  symbol?: string
  isBase?: number
  status?: number
  sort?: number
  createTime?: string
  updateTime?: string
}

export interface ExchangeRate {
  id?: number
  fromCurrency: string
  toCurrency: string
  rate: number
  createTime?: string
  updateTime?: string
}

export interface ExchangeRateDTO {
  fromCurrency: string
  toCurrency: string
  rate: number
}

export interface ExchangeRateListParams {
  page?: number
  pageSize?: number
  fromCurrency?: string
  toCurrency?: string
}
