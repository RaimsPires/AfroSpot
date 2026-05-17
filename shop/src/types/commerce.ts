export type ProductCategory = 'Fashion' | 'Beauty' | 'Food' | 'Home';

export type OrderLifecycleStatus =
    | 'Pending'
    | 'Confirmed'
    | 'Shipped'
    | 'Completed'
    | 'Cancelled';

export type BuyerOrderTab = 'Active' | 'Completed' | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';

export interface Product {
    id: string;
    title: string;
    brand: string;
    category: ProductCategory;
    description: string;
    price: number;
    image: string;
    rating: number;
    reviewCount: number;
    stockLabel: string;
    sellerId: string;
    sellerName: string;
}

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: Product;
}

export interface OrderAddress {
    recipient: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    region: string;
    country: string;
}

export interface PaymentSummary {
    methodLabel: string;
    subtotal: number;
    shipping: number;
    total: number;
    status: PaymentStatus;
}

export interface TrackingEvent {
    id: string;
    title: string;
    detail: string;
    timestamp: string;
    complete: boolean;
}

export interface Order {
    id: string;
    buyerId: string;
    buyerName: string;
    sellerId: string;
    sellerName: string;
    createdAt: string;
    status: OrderLifecycleStatus;
    items: CartItem[];
    payment: PaymentSummary;
    address: OrderAddress;
    trackingNumber?: string;
    trackingEvents: TrackingEvent[];
    note?: string;
}

export const BUYER_ORDER_TABS: BuyerOrderTab[] = ['Active', 'Completed', 'Cancelled'];

export const SELLER_ORDER_STATUSES: OrderLifecycleStatus[] = [
    'Pending',
    'Confirmed',
    'Shipped',
    'Completed',
    'Cancelled',
];
