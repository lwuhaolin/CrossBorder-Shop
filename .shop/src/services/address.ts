import request from '@/utils/request';
import type { Address, AddressCreateDTO, AddressUpdateDTO } from '@/models/address';
import type { Result } from '@/models/common';

// Get address list
export async function getAddressList(): Promise<Result<Address[]>> {
  return request({
    url: '/address/list',
    method: 'GET',
  });
}

// Create address
export async function createAddress(data: AddressCreateDTO): Promise<Result<Address>> {
  return request({
    url: '/address/create',
    method: 'POST',
    data,
  });
}

// Update address
export async function updateAddress(id: number, data: AddressUpdateDTO): Promise<Result<void>> {
  return request({
    url: `/address/${id}`,
    method: 'PUT',
    data,
  });
}

// Delete address
export async function deleteAddress(id: number): Promise<Result<void>> {
  return request({
    url: `/address/${id}`,
    method: 'DELETE',
  });
}

// Set default address
export async function setDefaultAddress(id: number): Promise<Result<void>> {
  return request({
    url: `/address/${id}/default`,
    method: 'PUT',
  });
}
