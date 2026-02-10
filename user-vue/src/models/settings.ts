// Settings related types

export interface AppConfig {
  appName?: string
  appVersion?: string
  appDescription?: string
  supportEmail?: string
  supportPhone?: string
  defaultCurrency?: string
  freeshippingThreshold?: number
  shippingFee?: number
  maxUploadSize?: number
  enableUserRegistration?: boolean
  enableSellerRegistration?: boolean
  carouselImages?: string[]
  carouselImageCount?: number
}

export interface SystemSetting {
  id?: number
  key: string
  value: string
  description?: string
}
