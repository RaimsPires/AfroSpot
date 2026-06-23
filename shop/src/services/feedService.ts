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

    getFeedComments: async (id: string, page: number = 1): Promise<PaginatedResponse<FeedCommentData>> => {
        // Assumes you added a comments/ endpoint to your viewset, or standard filtering
        const response = await apiClient.get<PaginatedResponse<FeedCommentData>>(`/feeds/${id}/comments/`, { params: { page } });
        
        return Array.isArray(response.data) ? { results: response.data, next: null, count: response.data.length, previous: null } : response.data;
    },

    // Add this right below it
    getCommentReplies: async (feedId: string, commentId: string, offset: number, limit: number = 10): Promise<PaginatedResponse<FeedCommentData>> => {
        const response = await apiClient.get<PaginatedResponse<FeedCommentData>>(
            `/feeds/${feedId}/comments/${commentId}/replies/`, 
            { params: { offset, limit } }
        );
        // Using the same array fallback just in case your backend ever returns a flat list
        return Array.isArray(response.data) ? { results: response.data, next: null, count: response.data.length, previous: null } : response.data;
    },

    getFeedLikes: async (id: string, page: number = 1): Promise<PaginatedResponse<FeedLikeData>> => {
        const response = await apiClient.post<PaginatedResponse<FeedLikeData>>(`/feeds/${id}/likes/`, { params: { page } });
        return Array.isArray(response.data) ? { results: response.data, next: null, count: response.data.length, previous: null } : response.data;
    },
    addFeedComment: async (feedId: string, text: string, parentId?: string): Promise<FeedCommentData> => {
        const payload = parentId ? { text, parent_id: parentId } : { text };
        const response = await apiClient.post<FeedCommentData>(`/feeds/${feedId}/likes/`, payload);
        return response.data;
    },
};