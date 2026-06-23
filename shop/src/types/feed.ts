export interface userComment {
    profile_picture: string,
    short_name: string,
    id: string
}

export interface FeedCommentData {
    id: string;
    user: userComment;
    text: string;
    created_at: string;
    replies: FeedCommentData[];
    reply_count:number;
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