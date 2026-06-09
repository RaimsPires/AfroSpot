import { apiClient } from './apiClient';

// 1. Interfaces mapping to your Django Models
export interface EventData {
    id: string; // Assuming UUID
    title: string;
    description: string;
    banner_image: string | null;
    start_datetime: string;
    end_datetime: string;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    event_type: 'physical' | 'virtual' | 'hybrid';
    custom_address: string;

    // Virtual fields you might compute in your Django Serializer for the Organizer view
    revenue?: string;
    category: string;
    ticket_sales?: number;
    spot_name?: string;

    icket_sales?: number;
    ticket_tiers?: { price: string | number; name: string }[];
    vendor_tiers?: { price: string | number; name: string }[];
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface EventQueryParams {
    page?: number;
    search?: string;
    time?: 'upcoming' | 'past';
    my_events?: 'true' | 'false';
}


export interface TicketTierInput {
    name: string;
    price: string;
    capacity: string;
}

export interface VendorTierInput {
    name: string;
    price: string;
    capacity: string;
}
// 2. The Service Object
export const eventService = {
    createEvent: async (formData: FormData): Promise<any> => {
        const response = await apiClient.post('/events/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    getEvents: async (params: EventQueryParams): Promise<PaginatedResponse<EventData>> => {
        const response = await apiClient.get<PaginatedResponse<EventData>>('/events/', {
            params: params,
        });
        return response.data;
    },
    getEvent: async (id: string): Promise<EventData> => {
        const response = await apiClient.get<EventData>(`/events/${id}/`);
        return response.data;
    },
    updateEvent: async (id: string, formData: FormData): Promise<EventData> => {
        const response = await apiClient.patch<EventData>(`/events/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // 🚀 Helper to delete the event
    deleteEvent: async (id: string): Promise<void> => {
        await apiClient.delete(`/events/${id}/`);
    }
};