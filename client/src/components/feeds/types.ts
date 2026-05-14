export type FeedPostItem = {
    id: string;
    videoCover: string;
    username: string;
    userAvatar: string;
    isVerified: boolean;
    caption: string;
    tags: string[];
    businessName: string;
    likes: string;
    comments: string;
    shares: string;
    audio: string;
};

export type FeedComment = {
    id: string;
    username: string;
    avatar: string;
    content: string;
    createdAt: string;
};
