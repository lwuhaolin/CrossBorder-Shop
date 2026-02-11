// Category related types

export interface Category {
  id: number
  categoryName: string
  categoryCode?: string
  parentId?: number
  level?: number
  sort?: number
  icon?: string
  status?: number
  description?: string
  children?: Category[]
  createTime?: string
  updateTime?: string
}

export interface CategoryCreateDTO {
  categoryName: string
  categoryCode?: string
  parentId?: number
  level?: number
  sort?: number
  icon?: string
  status?: number
  description?: string
}

export interface CategoryUpdateDTO extends CategoryCreateDTO {
  id: number
}

export interface CategoryTreeNode extends Category {
  title: string
  value: number
  key: number
}
