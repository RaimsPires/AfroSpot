import { apiClient } from "./apiClient";
import { PaginatedResponse } from "./eventService";

export interface PromoTargetItem {
    id: string;
    name: string;
    image: string | null;
    type: 'product' | 'service';
}

export interface Promotion {
    id: string;
    title: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    target: string;
    start_date: string;
    end_date: string;
    status: 'active' | 'paused' | 'expired';
    usage_count: number;
    products?: string[];  // UUIDs
    services?: string[];  // UUIDs
    items_details?: PromoTargetItem[];
}

export const promoService = {
    getPromos: async (page: number = 1): Promise<PaginatedResponse<Promotion>> => {
        const response = await apiClient.get<PaginatedResponse<Promotion>>(`/promotions/?page=${page}`);
        return response.data;
    },

    createPromo: async (payload: Omit<Promotion, 'id' | 'status' | 'usage_count'>): Promise<Promotion> => {
        const response = await apiClient.post<Promotion>('/promotions/', payload);
        return response.data;
    },

    updatePromo: async (id: string, payload: any) => {
        const response = await apiClient.patch(`/promotions/${id}/`, payload);
        return response.data;
    },

    searchItems: async (searchQuery: string): Promise<PromoTargetItem[]> => {
        const response = await apiClient.get<PromoTargetItem[]>('promotions/search_items', {
            params: {
                q: searchQuery
            }
        });

        // 3. Return response.data to satisfy the Promise<PromoTargetItem[]> type
        return response.data;
    },

    getPromotion: async (id: string): Promise<Promotion> => {
        // 1. Specify the generic type <Promotion> for the get request
        // 2. Access .data to return the actual Promotion object
        const response = await apiClient.get<Promotion>(`promotions/${id}/`);
        return response.data;
    },

    updatePromoStatus: async (id: string, payload: { status: string }): Promise<Promotion> => {
        const response = await apiClient.patch<Promotion>(`promotions/${id}/`, payload);
        return response.data;
    },

    deletePromo: async (id: string): Promise<void> => {
        await apiClient.delete(`promotions/${id}/`);
    },
};