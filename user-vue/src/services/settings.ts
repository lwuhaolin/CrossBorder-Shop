import request from '@/utils/request'
import type { Result } from '@/models/common'

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

export async function getAppConfig(): Promise<Result<AppConfig>> {
  return request({
    url: '/settings/config',
    method: 'GET',
  })
}
