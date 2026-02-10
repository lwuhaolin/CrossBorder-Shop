import type { Address, AddressCreateDTO, AddressUpdateDTO } from '@/models/address'
import type { Result } from '@/models/common'
import request from '@/utils/request'
import { mapShippingAddressVOToAddress, mapAddressCreateDTOToBackend } from '@/utils/dataMapper'

// Get address list
export async function getAddressList(): Promise<Result<Address[]>> {
  const response: Result<any[]> = await request({
    url: '/address/list',
    method: 'GET',
  })

  // 后端返回 List<ShippingAddressVO>，需要映射字段
  if (response.data && Array.isArray(response.data)) {
    response.data = response.data.map(item => mapShippingAddressVOToAddress(item))
  }

  return response as Result<Address[]>
}

// Create address
export async function createAddress(data: AddressCreateDTO): Promise<Result<Address>> {
  // 将前端数据转换为后端期望的格式（ShippingAddressDTO）
  const backendData = mapAddressCreateDTOToBackend(data)

  const response: Result<any> = await request({
    url: '/address',
    method: 'POST',
    data: backendData,
  })

  // 后端返回 ShippingAddressVO，需要映射字段
  if (response.data) {
    response.data = mapShippingAddressVOToAddress(response.data)
  }

  return response as Result<Address>
}

// Update address
export async function updateAddress(id: number, data: AddressUpdateDTO): Promise<Result<void>> {
  // 将前端数据转换为后端期望的格式
  const backendData = mapAddressCreateDTOToBackend(data)

  return request({
    url: `/address/${id}`,
    method: 'PUT',
    data: backendData,
  })
}

// Delete address
export async function deleteAddress(id: number): Promise<Result<void>> {
  return request({
    url: `/address/${id}`,
    method: 'DELETE',
  })
}

// Set default address
export async function setDefaultAddress(id: number): Promise<Result<void>> {
  return request({
    url: `/address/${id}/default`,
    method: 'PUT',
  })
}
