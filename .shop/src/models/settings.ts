// System Configuration and Settings types

export interface SystemSetting {
  id?: number;
  settingKey: string;
  settingValue: string;
  settingGroup?: string;  // Basic, Payment, Email, etc.
  description?: string;
  createTime?: string;
  updateTime?: string;
}

export interface SystemSettingDTO {
  settingKey: string;
  settingValue: string;
  settingGroup?: string;
  description?: string;
}

export interface AppConfig {
  appName?: string;
  appVersion?: string;
  appDescription?: string;
  supportEmail?: string;
  supportPhone?: string;
  defaultCurrency?: string;
  freeshippingThreshold?: number;
  shippingFee?: number;
  maxUploadSize?: number;
  enableUserRegistration?: boolean;
  enableSellerRegistration?: boolean;
  carouselImages?: string[];
  carouselImageCount?: number;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  revenueToday: number;
  lastUpdateTime?: string;
}

export interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  revenueToday: number;
  revenueThisMonth: number;
  totalSales: number;
}
