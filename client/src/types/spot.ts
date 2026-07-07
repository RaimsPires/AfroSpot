export interface NearbySpot {
    id: number;
    name: string;
    logo: string | null;
    banner_image: string | null;
    description: string | null;
    distance_km: number;
    latitude: number;   // New
    longitude: number; // New
}

export interface LocationCoords {
    latitude: number;
    longitude: number;
}

export type NearbyBusinessResponse = {
    results: NearbySpot[];
    strategy: string;
    count: number;
};