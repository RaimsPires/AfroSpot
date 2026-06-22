import { FeedCommentData, FeedData, FeedLikeData } from '@type/feed';
import { PaginatedResponse } from '@type/util';
import { apiClient } from './apiClient';


export const feedService = {

    getFeeds: async (page: number, tab: string): Promise<PaginatedResponse<FeedData>> => {
        const response = await apiClient.get<PaginatedResponse<FeedData>>('/feeds/', {
            params: { page, tab }
        });

        if (Array.isArray(response.data)) {
            return {
                count: response.data.length,
                next: null, // Force null to prevent infinite loop
                previous: null,
                results: response.data
            };
        }

        return response.data;
    },


    getSpotStats: async () => {
        const response = await apiClient.get<{
            total_views: number,
            total_likes: number,
            total_reach: number
        }>('/feeds/spot_stats/');
        return response.data;
    },
    createFeed: async (formData: FormData): Promise<FeedData> => {
        const response = await apiClient.post<FeedData>('/feeds/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    // The "Flush" endpoint for our analytics engine
    logViewBatch: async (logs: { feed_id: string; duration: number }[]) => {
        if (logs.length === 0) return;
        await apiClient.post<FeedData>('/feeds/log_views/', { logs });
    },

    // 🚀 NEW: Fetch a single feed's details
    getFeed: async (id: string): Promise<FeedData> => {
        const response = await apiClient.get<FeedData>(`/feeds/${id}/`);
        return response.data;
    },

    // 🚀 NEW: Update caption and hashtags
    updateFeed: async (id: string, data: { caption: string; hashtags: string }): Promise<FeedData> => {
        const response = await apiClient.patch<FeedData>(`/feeds/${id}/`, data);
        return response.data;
    },

    // 🚀 NEW: Delete the feed
    deleteFeed: async (id: string): Promise<void> => {
        await apiClient.delete(`/feeds/${id}/`);
    },

    // 🚀 NEW: Fetch actual comments
    getFeedComments: async (id: string): Promise<FeedCommentData[]> => {
        // Assumes you added a comments/ endpoint to your viewset, or standard filtering
        const response = await apiClient.get<FeedCommentData[]>(`/feeds/${id}/comments/`);
        return response.data;
    },

    addFeedComment: async (feedId: string, text: string, parentId?: string): Promise<FeedCommentData> => {
        const payload = parentId ? { text, parent_id: parentId } : { text };
        const response = await apiClient.post<FeedCommentData>(`/feeds/${feedId}/add_comment/`, payload);
        return response.data;
    },
    // 🚀 NEW: Fetch actual likes
    getFeedLikes: async (id: string): Promise<FeedLikeData[]> => {
        const response = await apiClient.get<FeedLikeData[]>(`/feeds/${id}/likes/`);
        return response.data;
    }
};