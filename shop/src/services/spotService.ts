import { apiClient } from './apiClient';

export interface SpotData {
    id?: number;
    name: string;
    description: string;
    email: string;
    shop_type: 'individual' | 'business';
    category: 'restaurant' | 'barbershop' | 'salon' | 'retail' | 'other';
    address: string;
    city: string;
    country: string;
    phone_number: string;
    whatsapp_number: string;
    instagram_handle: string;
    website: string;
    currency: string;
}

export const spotService = {
    /** Fetch the manager's active spot profile */
    getActiveSpot: async (): Promise<SpotData> => {
        const response = await apiClient.get<SpotData>('/spots/active/');
        return response.data;
    },

    /** Partially update the spot profile */
    updateActiveSpot: async (data: Partial<SpotData>): Promise<SpotData> => {
        const response = await apiClient.patch<SpotData>('/spots/active/', data);
        return response.data;
    }
};