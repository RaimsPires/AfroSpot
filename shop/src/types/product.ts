export interface ProductImageData {
    id: number;
    image: string;
    is_primary: boolean;
    display_order: number;
}

export interface ProductData {
    id: number;
    name: string;
    description: string;
    price: string;
    stock_quantity: number;
    sku: string;
    images: ProductImageData[];
}