import { apiClient } from "./apiClient";

export type PromoTargetItem = {
    id: string;
    name: string;
    image: string | null;
    type: 'product' | 'service';
};

export const promoService = {
    createPromo: (data: any) => apiClient.post('/promotions/', data),
    searchItems: async (query: string = ''): Promise<PromoTargetItem[]> => {
        const response = await apiClient.get<PromoTargetItem[]>('/promotions/search_items/', {
            params: { q: query }
        });
        return response.data;
    }
};