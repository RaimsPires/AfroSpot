import { ProductData } from '@type/product';
import { apiClient } from './apiClient';

export const productService = {
    getProducts: async (): Promise<ProductData[]> => {
        const response = await apiClient.get<ProductData[]>('/products/');
        return response.data;
    },

    createProduct: async (data: Partial<ProductData>): Promise<ProductData> => {
        const response = await apiClient.post<ProductData>('/products/', data);
        return response.data;
    },

    updateProduct: async (id: number, data: Partial<ProductData>): Promise<ProductData> => {
        const response = await apiClient.patch<ProductData>(`/products/${id}/`, data, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await apiClient.delete(`/products/${id}/`);
    }
};