import React, { useState } from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';

import { FeedPostItem } from './types';

const { width, height } = Dimensions.get('window');

type FeedPostCardProps = {
    item: FeedPostItem;
    onCommentPress: (item: FeedPostItem) => void;
    onProfilePress: (item: FeedPostItem) => void;
};

const FeedPostCard = ({ item, onCommentPress, onProfilePress }: FeedPostCardProps) => {
    const { colors } = useTheme();
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <View style={[styles.postContainer, { height }]}> 
            <ImageBackground source={{ uri: item.videoCover }} style={styles.videoBackground}>

                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.avatarAction} onPress={() => onProfilePress(item)}>
                        <Image source={{ uri: item.userAvatar }} style={styles.actionAvatar} />
                        {!isFollowing && (
                            <View style={styles.followPlusBtn}>
                                <AppIcon library="Feather" name="plus" size={12} color="#FFF" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={() => setIsLiked(!isLiked)}>
                        <AppIcon library="Ionicons" name={isLiked ? 'heart' : 'heart-outline'} size={28} color={isLiked ? '#EF4444' : '#FFF'} />
                        <Text style={styles.actionText}>{item.likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={() => onCommentPress(item)}>
                        <AppIcon library="Feather" name="message-circle" size={28} color="#FFF" />
                        <Text style={styles.actionText}>{item.comments}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={() => setIsSaved(!isSaved)}>
                        <AppIcon library="Ionicons" name={isSaved ? 'bookmark' : 'bookmark-outline'} size={26} color={isSaved ? colors.primary : '#FFF'} />
                        <Text style={styles.actionText}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn}>
                        <AppIcon library="Feather" name="share-2" size={26} color="#FFF" />
                        <Text style={styles.actionText}>{item.shares}</Text>
                    </TouchableOpacity>

                    <View style={styles.audioDiscContainer}>
                        <AppIcon library="Feather" name="music" size={16} color="#FFF" />
                    </View>
                </View>

                <View style={styles.bottomContent}>
                    <TouchableOpacity style={styles.visitBusinessPill} onPress={() => onProfilePress(item)}>
                        <View style={styles.visitIconBg}>
                            <AppIcon library="Feather" name="home" size={12} color="#FFF" />
                        </View>
                        <View>
                            <Text style={styles.visitLabel}>VISIT BUSINESS</Text>
                            <Text style={styles.visitName}>{item.businessName}</Text>
                        </View>
                        <AppIcon library="Feather" name="chevron-right" size={16} color="#FFF" style={styles.visitChevron} />
                    </TouchableOpacity>

                    <View style={styles.userInfoRow}>
                        <TouchableOpacity onPress={() => onProfilePress(item)}>
                            <Text style={styles.username}>@{item.username}</Text>
                        </TouchableOpacity>
                        {item.isVerified && (
                            <AppIcon library="MaterialIcons" name="verified" size={14} color="#3B82F6" style={styles.verifiedIcon} />
                        )}
                        <TouchableOpacity
                            style={[styles.followOutlineBtn, isFollowing && styles.followOutlineBtnActive]}
                            onPress={() => setIsFollowing(!isFollowing)}
                        >
                            <Text style={styles.followOutlineText}>{isFollowing ? 'Following' : 'Follow'}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>

                    <View style={styles.tagsRow}>
                        {item.tags.map((tag) => (
                            <Text key={tag} style={styles.tagText}>{tag} </Text>
                        ))}
                    </View>

                    <View style={styles.audioRow}>
                        <AppIcon library="Feather" name="music" size={12} color="#FFF" />
                        <Text style={styles.audioText} numberOfLines={1}>{item.audio}</Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: { width },
    videoBackground: { width: '100%', height: '100%', justifyContent: 'flex-end' },
    rightActions: { position: 'absolute', right: 12, bottom: 100, alignItems: 'center', gap: 20, zIndex: 10 },
    avatarAction: { position: 'relative', marginBottom: 8 },
    actionAvatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#FFF' },
    followPlusBtn: {
        position: 'absolute',
        bottom: -8,
        alignSelf: 'center',
        backgroundColor: '#F97316',
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    actionBtn: { alignItems: 'center' },
    actionText: { color: '#FFF', fontSize: 12, fontWeight: '700', marginTop: 4 },
    audioDiscContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#333',
        borderWidth: 8,
        borderColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    bottomContent: { paddingHorizontal: 16, paddingBottom: 100, width: '80%', zIndex: 5 },
    visitBusinessPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(249, 115, 22, 0.9)',
        alignSelf: 'flex-start',
        paddingRight: 12,
        borderRadius: 24,
        marginBottom: 12,
    },
    visitIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
        marginRight: 8,
    },
    visitLabel: { color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    visitName: { color: '#FFF', fontSize: 13, fontWeight: '800' },
    visitChevron: { marginLeft: 8 },
    userInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    username: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    verifiedIcon: { marginHorizontal: 4 },
    followOutlineBtn: { borderWidth: 1, borderColor: '#FFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
    followOutlineBtnActive: { borderColor: 'transparent' },
    followOutlineText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
    caption: { color: '#FFF', fontSize: 14, lineHeight: 20, marginBottom: 8 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    tagText: { color: '#F59E0B', fontSize: 14, fontWeight: '700' },
    audioRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    audioText: { color: '#FFF', fontSize: 13 },
});

export default FeedPostCard;
