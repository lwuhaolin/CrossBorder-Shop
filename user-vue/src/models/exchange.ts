// Currency and Exchange related types

export interface Currency {
  id?: number
  currencyCode: string
  currencyName?: string
  symbol: string
  isBase?: number
  status?: number
  sort?: number
}

export interface ExchangeRate {
  id?: number
  fromCurrency: string
  toCurrency: string
  rate: number
  updateTime?: string
}
