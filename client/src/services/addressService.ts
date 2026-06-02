import { apiClient } from '@services/apiClient';
import { CreateUserAddressPayload, UpdateUserAddressPayload, UserAddress } from '@type/auth';

export async function createUserAddress(payload: CreateUserAddressPayload): Promise<UserAddress> {
    const response = await apiClient.post<UserAddress>('/auth/addresses/', payload);
    return response.data;
}

export async function setPrimaryUserAddress(addressId: string): Promise<UserAddress> {
    const response = await apiClient.patch<UserAddress>(`/auth/addresses/${addressId}/set-primary/`, {});
    return response.data;
}

export async function updateUserAddress(addressId: string, payload: UpdateUserAddressPayload): Promise<UserAddress> {
    const response = await apiClient.patch<UserAddress>(`/auth/addresses/${addressId}/`, payload);
    return response.data;
}

export async function deleteUserAddress(addressId: string): Promise<void> {
    await apiClient.delete(`/auth/addresses/${addressId}/delete/`);
}
