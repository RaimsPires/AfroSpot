import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommentsBottomSheet } from '@components/feed/CommentsBottomSheet';
import { LikesBottomSheet } from '@components/feed/LikesBottomSheet';
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { feedService } from '@services/feedService';
import { FeedCommentData, FeedData, FeedLikeData } from '@type/feed';
import Video, { ViewType } from 'react-native-video';

const METRIC_CARDS = [
    { key: 'total_views', icon: 'eye', label: 'Views', library: 'Feather' },
    { key: 'likes_count', icon: 'heart', label: 'Likes', library: 'AntDesign' },
    { key: 'comments_count', icon: 'message-circle', label: 'Comments', library: 'Feather' },
] as const;

export const FeedInsightsScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const { feedId } = route.params;

    // Data States
    const [feed, setFeed] = useState<FeedData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Edit States
    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Modals visibility
    const [isEditVisible, setIsEditVisible] = useState(false);
    const [isCommentsVisible, setCommentsVisible] = useState(false);
    const [isLikesVisible, setLikesVisible] = useState(false);

    // Relational Data
    const [comments, setComments] = useState<FeedCommentData[]>([]);
    const [likers, setLikers] = useState<FeedLikeData[]>([]);

    const videoRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        fetchFeedDetails();
    }, []);

    const fetchFeedDetails = async () => {
        try {
            const data = await feedService.getFeed(feedId);
            console.log(data);

            setFeed(data);
            setCaption(data.caption);
            setTags(data.hashtags);
        } catch {
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    };

    // --- Action Handlers ---

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            const updatedFeed = await feedService.updateFeed(feedId, { caption, hashtags: tags });
            setFeed(updatedFeed);
            setIsEditVisible(false);
            Alert.alert("Success", "Post updated successfully.");
        } catch {
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert("Delete Feed", "Are you sure? This action cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    setIsDeleting(true);
                    try {
                        await feedService.deleteFeed(feedId);
                        navigation.goBack();
                    } catch {
                        setIsDeleting(false);
                    }
                }
            }
        ]);
    };

    const handleMetricPress = async (metricKey: string) => {
        if (metricKey === 'likes_count') {
            setLikesVisible(true);
            try {
                const data = await feedService.getFeedLikes(feedId);
                setLikers(data);
            } catch (e) { console.error("Could not fetch likers", e); }
        }

        if (metricKey === 'comments_count') {
            setCommentsVisible(true);
            try {
                const data = await feedService.getFeedComments(feedId);
                setComments(data);
            } catch (e) { console.error("Could not fetch comments", e); }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (isLoading || !feed) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Feed Command</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={handleDelete} disabled={isDeleting}>
                    {isDeleting ? <ActivityIndicator color={colors.destructive} /> : <AppIcon library="Feather" name="trash-2" size={20} color={colors.destructive} />}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* 🚀 Updated Media Preview with Tap-to-Play/Pause */}
                <Pressable
                    style={[styles.previewImage, { overflow: 'hidden', backgroundColor: '#000' }]}
                    onPress={() => setIsPlaying(!isPlaying)}
                >
                    {/* 1. The Video Component (Always at the bottom layer) */}
                    <Video
                        ref={videoRef}
                        source={{ uri: feed.video_file }}
                        style={StyleSheet.absoluteFill}
                        resizeMode="cover"
                        viewType={ViewType.TEXTURE}
                        paused={!isPlaying}
                        onEnd={() => setIsPlaying(false)}
                        // 🚀 ADD THESE THREE LINES TO DEBUG:
                        onLoad={() => console.log("✅ Video Loaded Successfully!")}
                        onError={(err) => console.log("❌ Video Error:", err)}
                        onBuffer={(meta) => console.log("⏳ Buffering...", meta.isBuffering)}
                    />

                    {/* 2. The Cover Image (Sits on top of the video, but disappears when playing) */}
                    {!isPlaying && (
                        <ImageBackground
                            source={{ uri: feed.video_cover || 'https://via.placeholder.com/400' }}
                            style={StyleSheet.absoluteFill}
                            imageStyle={styles.previewImageRadius}
                        />
                    )}

                    {/* 3. The Play Badge (Top Layer, also disappears when playing) */}
                    {!isPlaying && (
                        <View style={styles.overlayCenter} pointerEvents="none">
                            <View style={styles.playBadge}>
                                <AppIcon library="Feather" name="play" size={24} color="#FFF" />
                            </View>
                        </View>
                    )}
                </Pressable>
                <Text style={[styles.date, { color: colors.textSecondary }]}>Posted on {formatDate(feed.created_at)}</Text>

                {/* Read-Only Info Card with Edit Button */}
                <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.infoHeaderRow}>
                        <Text style={[styles.infoTitle, { color: colors.textSecondary }]}>POST DETAILS</Text>
                        <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditVisible(true)}>
                            <Text style={[styles.editBtnText, { color: colors.primary }]}>Edit</Text>
                            <AppIcon library="Feather" name="edit-2" size={14} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.displayCaption, { color: colors.text }]}>{feed.caption || "No caption added."}</Text>
                    {feed.hashtags ? (
                        <Text style={styles.displayTags}>{feed.hashtags}</Text>
                    ) : null}
                </View>

                {/* Live Metrics Grid */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Performance</Text>
                <View style={styles.metricsGrid}>
                    {METRIC_CARDS.map((metric) => (
                        <TouchableOpacity
                            key={metric.key}
                            style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => handleMetricPress(metric.key)}
                            activeOpacity={0.85}
                            disabled={metric.key === 'total_views'} // Disable pressing views
                        >
                            <AppIcon library={metric.library as any} name={metric.icon as any} size={18} color={colors.primary} />
                            <Text style={[styles.metricValue, { color: colors.text }]}>
                                {feed[metric.key as keyof FeedData]}
                            </Text>
                            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{metric.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Boost Card */}
                {feed.is_boosted ? (
                    <View style={[styles.boostCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}>
                        <View style={styles.boostTitleRow}>
                            <AppIcon library="Feather" name="zap" size={16} color={colors.primary} />
                            <Text style={[styles.boostTitle, { color: colors.primary }]}>Active Boost Campaign</Text>
                        </View>
                        <Text style={[styles.boostReachText, { color: colors.text }]}>Additional Reach: {feed.boost_reach}</Text>
                        <TouchableOpacity
                            style={[styles.manageBoostBtn, { backgroundColor: colors.primary }]}
                            onPress={() => navigation.navigate('BoostFeed', { feedId: feed.id })}
                        >
                            <Text style={[styles.manageBoostBtnText, { color: colors.textInverse }]}>Manage Boost</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.startBoostBtn, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate('BoostFeed', { feedId: feed.id })}
                    >
                        <AppIcon library="Feather" name="zap" size={16} color={colors.textInverse} />
                        <Text style={[styles.startBoostBtnText, { color: colors.textInverse }]}>Boost This Feed</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* EDIT BOTTOM SHEET MODAL */}
            <Modal visible={isEditVisible} transparent animationType="slide" onRequestClose={() => setIsEditVisible(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
                    {/* Tap outside to close */}
                    <TouchableOpacity style={styles.modalDismissArea} onPress={() => setIsEditVisible(false)} />

                    {/* Bottom Sheet Content */}
                    <View style={[styles.bottomSheet, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                        <View style={styles.sheetHeader}>
                            <Text style={[styles.sheetTitle, { color: colors.text }]}>Edit Details</Text>
                            <TouchableOpacity onPress={() => setIsEditVisible(false)}>
                                <AppIcon library="Feather" name="x" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.label, { color: colors.textSecondary }]}>CAPTION</Text>
                        <TextInput
                            style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            value={caption}
                            onChangeText={setCaption}
                            multiline
                        />

                        <Text style={[styles.label, { color: colors.textSecondary }]}>HASHTAGS</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            value={tags}
                            onChangeText={setTags}
                        />

                        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleUpdate} disabled={isSaving}>
                            {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Save Updates</Text>}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal visible={isCommentsVisible} transparent animationType="slide" onRequestClose={() => setCommentsVisible(false)}>
                <CommentsBottomSheet
                    comments={comments}
                    commentCountLabel={feed.comments_count}
                    onClose={() => setCommentsVisible(false)}
                    onSubmitComment={async (text, parentId) => {
                        const response = await feedService.addFeedComment(feedId, text, parentId)
                        setComments([response , ...comments])
                    }}
                />
            </Modal>

            <Modal visible={isLikesVisible} transparent animationType="slide" onRequestClose={() => setLikesVisible(false)}>
                <LikesBottomSheet users={likers} likeCountLabel={feed.likes_count} onClose={() => setLikesVisible(false)} />
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800' },

    content: { padding: 20, paddingBottom: 60 },

    // 🚀 Updated Video Area Styles
    previewImage: { width: '100%', height: 220, borderRadius: 14, marginBottom: 12, position: 'relative' },
    previewImageRadius: { borderRadius: 14 },
    overlayCenter: { ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
    playBadge: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },

    date: { fontSize: 12, fontWeight: '500', marginBottom: 20, textAlign: 'justify' },

    infoCard: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 32 },
    infoHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    infoTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
    editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 8 },
    editBtnText: { fontSize: 13, fontWeight: '700' },
    displayCaption: { fontSize: 15, lineHeight: 22, fontWeight: '500', marginBottom: 8 },
    displayTags: { fontSize: 14, fontWeight: '700', color: '#00D1FF' },

    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },

    metricsGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    metricCard: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 16, alignItems: 'center', gap: 6 },
    metricValue: { fontSize: 18, fontWeight: '900' },
    metricLabel: { fontSize: 12, fontWeight: '600' },

    boostCard: { borderWidth: 1, borderRadius: 12, padding: 16 },
    boostTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
    boostTitle: { fontSize: 14, fontWeight: '800' },
    boostReachText: { fontSize: 13, fontWeight: '600', marginBottom: 16 },
    manageBoostBtn: { alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingVertical: 12 },
    manageBoostBtnText: { fontSize: 14, fontWeight: '800' },
    startBoostBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
    startBoostBtnText: { fontSize: 15, fontWeight: '800' },

    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalDismissArea: { flex: 1 },
    bottomSheet: { borderTopWidth: 1, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
    sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    sheetTitle: { fontSize: 18, fontWeight: '800' },

    label: { fontSize: 11, fontWeight: '800', marginBottom: 8, marginTop: 4 },
    textArea: { height: 100, borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 15, marginBottom: 16, textAlignVertical: 'top' },
    input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15, marginBottom: 24 },
    saveBtn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
});