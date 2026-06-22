
export interface FeedCommentData {
    id: string;
    user_name: string;
    text: string;
    created_at: string;
    avatar?: string;
}

export interface FeedLikeData {
    id: string;
    name: string;
    username: string;
    avatar?: string;
}

export interface FeedData {
    id: string;
    video_file: string;
    video_cover: string | null;
    caption: string;
    hashtags: string;
    spot_name: string;
    total_views: number;
    likes_count: number;
    comments_count: number;
    is_boosted: boolean;
    boost_reach: number;
    created_at: string;
}