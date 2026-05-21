import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Keyboard,
    StatusBar,
    StyleSheet,
    View
} from 'react-native';

import FeedHeaderOverlay from '@components/feeds/FeedHeaderOverlay';
import FeedPostCard from '@components/feeds/FeedPostCard';
import { FEED_POSTS, TRENDING_TAGS } from '@components/feeds/mockData';
import { FeedComment, FeedPostItem } from '@components/feeds/types';
import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import CommentsBottomSheet from './CommentsBottomSheet';

const { height } = Dimensions.get('window');

const INITIAL_COMMENTS: Record<string, FeedComment[]> = {
    '1': [
        {
            id: 'c1',
            username: 'naija_bites',
            avatar: 'https://i.pravatar.cc/100?img=19',
            content: 'This looks sooo good. I need the location right now.',
            createdAt: '2h',
        },
        {
            id: 'c2',
            username: 'tasteoflagos',
            avatar: 'https://i.pravatar.cc/100?img=32',
            content: 'Best jollof spot in Brooklyn for real.',
            createdAt: '1h',
        },
    ],
    '2': [
        {
            id: 'c3',
            username: 'fadecheck',
            avatar: 'https://i.pravatar.cc/100?img=25',
            content: 'Clean fade. Which clipper guard did they use?',
            createdAt: '3h',
        },
    ],
    '3': [],
};

const CommunityFeedScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'CommunityFeed'>>();
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState<'Following' | 'Explore'>('Explore');
    const [selectedPost, setSelectedPost] = useState<FeedPostItem | null>(null);
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [commentsByPost, setCommentsByPost] = useState<Record<string, FeedComment[]>>(INITIAL_COMMENTS);

    const selectedComments = useMemo(() => {
        if (!selectedPost) {
            return [];
        }
        return commentsByPost[selectedPost.id] ?? [];
    }, [selectedPost, commentsByPost]);

    const openComments = (post: FeedPostItem) => {
        setSelectedPost(post);
        setIsCommentsVisible(true);
    };

    const closeComments = () => {
        Keyboard.dismiss();
        setIsCommentsVisible(false);
    };

    const addComment = (content: string) => {
        if (!selectedPost || !content.trim()) {
            return;
        }

        const newComment: FeedComment = {
            id: `${selectedPost.id}-${Date.now()}`,
            username: 'you',
            avatar: 'https://i.pravatar.cc/100?img=14',
            content: content.trim(),
            createdAt: 'now',
        };

        setCommentsByPost((prev) => ({
            ...prev,
            [selectedPost.id]: [...(prev[selectedPost.id] ?? []), newComment],
        }));
    };

    const openBusinessFromPost = (post: FeedPostItem) => {
        const [nameRaw, typeRaw] = post.businessName.split('•').map((value) => value.trim());
        const businessName = nameRaw || post.businessName;
        const businessType = typeRaw?.toLowerCase() ?? '';

        if (businessType.includes('restaurant') || businessType.includes('food')) {
            navigation.navigate('RestaurantDetail', {
                restaurantId: post.id,
                restaurantName: businessName,
            });
            return;
        }

        navigation.navigate('BusinessDetail', {
            businessId: post.id,
            businessName,
            source: 'community-feed',
        });
    };

    const openBusinessFromComment = () => {
        if (!selectedPost) {
            return;
        }
        closeComments();
        openBusinessFromPost(selectedPost);
    };

    const renderItem = ({ item }: { item: FeedPostItem }) => {
        return (
            <FeedPostCard
                item={item}
                onCommentPress={openComments}
                onProfilePress={openBusinessFromPost}
            />
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <FlatList
                data={FEED_POSTS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={height}
                snapToAlignment="start"
            />

            <FeedHeaderOverlay activeTab={activeTab} onTabChange={setActiveTab} tags={TRENDING_TAGS} />

            <CommentsBottomSheet
                visible={isCommentsVisible}
                post={selectedPost}
                comments={selectedComments}
                onAddComment={addComment}
                onClose={closeComments}
                onOpenBusiness={openBusinessFromComment}
                colors={colors}
            />
        </View>
    );
};





const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    sheetBackdrop: {
        flex: 1,
        // backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sheetKeyboardWrap: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        height: '62%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
    },
    sheetHandle: {
        alignSelf: 'center',
        width: 48,
        height: 4,
        borderRadius: 4,
        marginBottom: 12,
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    sheetSubtitle: {
        fontSize: 12,
        marginBottom: 12,
    },
    commentsContent: {
        paddingBottom: 12,
    },
    commentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    commentAvatarButton: {
        marginRight: 10,
        borderRadius: 17,
    },
    commentAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
    },
    commentBody: {
        flex: 1,
    },
    commentMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    commentUser: {
        fontSize: 13,
        fontWeight: '700',
        marginRight: 8,
    },
    commentTime: {
        fontSize: 11,
    },
    commentContent: {
        fontSize: 14,
        lineHeight: 20,
    },
    emptyCommentsWrap: {
        paddingVertical: 26,
        alignItems: 'center',
    },
    emptyCommentsText: {
        fontSize: 13,
    },
    composerRow: {
        borderTopWidth: 1,
        marginHorizontal: -16,
        paddingHorizontal: 16,
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    composerInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
});

export default CommunityFeedScreen;
