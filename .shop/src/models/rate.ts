// Exchange Rate and Currency types

export interface Currency {
  id?: number;
  currencyCode: string;  // CNY, USD, EUR, etc.
  currencyName: string;  // Chinese Yuan, US Dollar, etc.
  symbol?: string;       // ¥, $, €, etc.
  isBase?: number;       // 1 for CNY, 0 for others
  status?: number;       // 0=disabled, 1=active
  sort?: number;
  createTime?: string;
  updateTime?: string;
}

export interface ExchangeRate {
  id?: number;
  fromCurrency: string;  // Source currency code
  toCurrency: string;    // Target currency code
  rate: number;          // Conversion rate
  createTime?: string;
  updateTime?: string;
}

export interface ExchangeRateDTO {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
}

export interface ExchangeRateListParams {
  page?: number;
  pageSize?: number;
  fromCurrency?: string;
  toCurrency?: string;
}

export interface ExchangeRateListResponse {
  list: ExchangeRate[];
  total: number;
  page: number;
  pageSize: number;
}
