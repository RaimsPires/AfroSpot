import { ProductData } from '@type/product';
import { apiClient } from './apiClient';


export const productService = {
    getProducts: async (): Promise<ProductData[]> => {
        const response = await apiClient.get<ProductData[]>('/products/');
        return response.data;
    },

    // 🚀 Change parameter to FormData and add the multipart header
    createProduct: async (formData: FormData): Promise<ProductData> => {
        const response = await apiClient.post<ProductData>('/products/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // 🚀 Change parameter to FormData and add the multipart header
    updateProduct: async (id: number, formData: FormData): Promise<ProductData> => {
        const response = await apiClient.patch<ProductData>(`/products/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await apiClient.delete(`/products/${id}/`);
    },

    // DELETE an image by its ID
    deleteProductImage: async (imageId: number) => {
        return await apiClient.delete(`/products/images/${imageId}/`);
    },

    // UPDATE an image (e.g., to set is_primary = true)
    updateProductImage: async (imageId: number, data: { is_primary: boolean }) => {
        return await apiClient.patch(`/products/images/${imageId}/`, data);
    }
};