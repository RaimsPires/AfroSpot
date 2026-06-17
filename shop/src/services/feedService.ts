import { apiClient } from './apiClient';

export interface FeedData {
    id: string;
    video_file: string;
    video_cover: string | null;
    caption: string;
    hashtags: string;
    spot_name: string;
    total_views: number;
}

export const feedService = {
    getFeeds: async (): Promise<{ results: FeedData[] }> => {
        const response = await apiClient.get('/feeds/');
        return response.data;
    },
    createFeed: async (formData: FormData): Promise<FeedData> => {
        const response = await apiClient.post('/feeds/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    // The "Flush" endpoint for our analytics engine
    logViewBatch: async (logs: { feed_id: string; duration: number }[]) => {
        if (logs.length === 0) return;
        await apiClient.post('/feeds/log_views/', { logs });
    }
};