import request from '@/utils/request';
import type { SystemSetting, SystemSettingDTO, AppConfig, SystemStats, SellerStats } from '@/models/settings';
import type { Result } from '@/models/common';

// Get all settings
export async function getAllSettings(): Promise<Result<SystemSetting[]>> {
  return request({
    url: '/settings',
    method: 'GET',
  });
}

// Get setting by key
export async function getSettingByKey(key: string): Promise<Result<SystemSetting>> {
  return request({
    url: `/settings/${key}`,
    method: 'GET',
  });
}

// Update setting
export async function updateSetting(key: string, data: SystemSettingDTO): Promise<Result<void>> {
  return request({
    url: `/settings/${key}`,
    method: 'PUT',
    data,
  });
}

// Get app configuration
export async function getAppConfig(): Promise<Result<AppConfig>> {
  return request({
    url: '/settings/config',
    method: 'GET',
  });
}

// Update app configuration
export async function updateAppConfig(data: AppConfig): Promise<Result<void>> {
  return request({
    url: '/settings/config',
    method: 'PUT',
    data,
  });
}

// Get system statistics
export async function getSystemStats(): Promise<Result<SystemStats>> {
  return request({
    url: '/statistics',
    method: 'GET',
  });
}

// Get seller statistics
export async function getSellerStats(): Promise<Result<SellerStats>> {
  return request({
    url: '/statistics/seller',
    method: 'GET',
  });
}

// Test email
export async function testEmailSettings(email: string): Promise<Result<void>> {
  return request({
    url: '/settings/test-email',
    method: 'POST',
    data: { email },
  });
}
