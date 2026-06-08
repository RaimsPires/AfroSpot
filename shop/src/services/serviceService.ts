import { apiClient } from './apiClient';

export interface ServiceImageData {
    id: number;
    image: string;
    is_primary: boolean;
    display_order: number;
}

export interface ServiceData {
    id: number;
    name: string;
    description: string;
    price: string;
    duration_minutes: number;
    buffer_minutes: number;
    images: ServiceImageData[];
}

export const serviceService = {
    getServices: async (): Promise<ServiceData[]> => {
        const response = await apiClient.get<ServiceData[]>('/services/');
        return response.data;
    },
    createService: async (formData: FormData): Promise<ServiceData> => {
        const response = await apiClient.post<ServiceData>('/services/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    updateService: async (id: number, formData: FormData): Promise<ServiceData> => {
        const response = await apiClient.patch<ServiceData>(`/services/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    deleteService: async (id: number): Promise<void> => {
        await apiClient.delete(`/services/${id}/`);
    },
    updateServiceImage: async (imageId: number, data: { is_primary: boolean }): Promise<void> => {
        await apiClient.patch(`/services/images/${imageId}/`, data);
    },
    deleteServiceImage: async (imageId: number): Promise<void> => {
        await apiClient.delete(`/services/images/${imageId}/`);
    }
};