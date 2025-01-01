export interface IProduct {
    productId?: number;
    productName: string;
    description: string;
    amount: number;
    categoryId: number;
    userId: number;
    images?: string[];
    condition: string | null;
    brand: string | null;
    size: string | null;
    color: string | null;
}

export interface IProductFilters {
    productUuid: string;
    categoryUuid: string;
    searchQuery: string;
    condition: string;
    page: number;
    size: number;
    isFilter: boolean;
}