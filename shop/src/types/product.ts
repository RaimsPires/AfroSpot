export interface ProductData {
    id: number;
    name: string;       // Mapped from 'title' in UI
    description: string;
    price: string;
    stock_quantity: number; // Mapped from 'stock' in UI
    image: string | null;
}