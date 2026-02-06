// Shipping Address related types
export interface Address {
  id: number;
  userId?: number;
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault?: boolean;
  label?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddressCreateDTO {
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault?: boolean;
  label?: string;
}

export interface AddressUpdateDTO extends AddressCreateDTO {
  id: number;
}
