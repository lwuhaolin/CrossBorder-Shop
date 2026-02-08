// Category related types
export interface Category {
  id: number;
  categoryName?: string;
  name?: string;
  categoryCode: string;
  parentId?: number;
  level: number;
  sort?: number;
  icon?: string;
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryCreateDTO {
  name: string;
  parentId?: number;
  sort?: number;
  icon?: string;
}

export interface CategoryUpdateDTO extends CategoryCreateDTO {
  id: number;
}

export interface CategoryTreeNode extends Category {
  title: string;
  value: number;
  key: number;
}
