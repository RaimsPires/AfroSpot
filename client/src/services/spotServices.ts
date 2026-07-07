import { LocationCoords, NearbyBusinessResponse } from '@type/spot';
import { apiClient } from './apiClient';



export const spotService = {
    getNearbyBusinesses: async (
        coords: LocationCoords,
        radiusKm: number = 10
    ): Promise<NearbyBusinessResponse> => {
        try {
            const response = await apiClient.get<NearbyBusinessResponse>(`/nearby-business/`, {
                params: {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    radius: radiusKm,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching nearby businesses:', error);
            throw error;
        }
    },
};