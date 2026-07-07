import { spotService } from '@services/spotServices';
import { LocationCoords, NearbyBusinessResponse } from '@type/spot';
import { useEffect, useState } from 'react';

export const useNearbyBusinesses = (coords: LocationCoords | null, radiusKm = 10) => {
    const [spots, setSpots] = useState<NearbyBusinessResponse>({ results: [], strategy: '', count: 0 });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSpots = async () => {
        if (!coords) return;

        setLoading(true);
        setError(null);
        try {
            const data = await spotService.getNearbyBusinesses(coords, radiusKm);
            console.log(data);
            
            setSpots(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch nearby spots');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpots();
    }, [coords?.latitude, coords?.longitude, radiusKm]);

    return { spots, loading, error, refetch: fetchSpots };
};