// Shipping Address related types

export interface Address {
  id: number
  userId?: number
  receiverName: string
  receiverPhone: string
  country: string
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode?: string
  isDefault?: boolean
  label?: string
  createTime?: string
  updateTime?: string
}

export interface AddressCreateDTO {
  receiverName: string
  receiverPhone: string
  country: string
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode?: string
  isDefault?: boolean
  label?: string
}

export interface AddressUpdateDTO extends AddressCreateDTO {
  id: number
}
