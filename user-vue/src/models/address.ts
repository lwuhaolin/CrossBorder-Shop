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
  postalCode?: string  // 新增：邮编字段
  isDefault?: boolean
  // label 字段已移除（后端不支持）
  createdAt?: string
  updatedAt?: string
}

export interface AddressCreateDTO {
  receiverName: string
  receiverPhone: string
  country: string
  province: string
  city: string
  district: string
  detailAddress: string
  postalCode?: string  // 新增：邮编字段
  isDefault?: boolean
  // label 字段已移除（后端不支持）
}

export interface AddressUpdateDTO extends AddressCreateDTO {
  id?: number
}
