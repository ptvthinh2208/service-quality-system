export interface Category {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateCategoryDto {
    name: string;
    description?: string;
    icon?: string;
    displayOrder: number;
    isActive: boolean;
}

export interface UpdateCategoryDto {
    name?: string;
    description?: string;
    icon?: string;
    displayOrder?: number;
    isActive?: boolean;
}

export interface ReorderCategoriesDto {
    categoryOrders: { id: number; displayOrder: number }[];
}
