import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

// --- Mock Data ---
const RATING_STATS = {
    average: 4.8,
    total: 128,
    breakdown: [
        { stars: 5, count: 92 },
        { stars: 4, count: 18 },
        { stars: 3, count: 6 },
        { stars: 2, count: 2 },
        { stars: 1, count: 10 },
    ],
};

const FILTER_TABS = ['All', 'Unreplied', '5 Stars', 'Critical'];

const INITIAL_REVIEWS = [
    {
        id: '1',
        customerName: 'Amara Okoro',
        avatar: 'https://i.pravatar.cc/150?img=47',
        date: '2 days ago',
        rating: 5,
        content: 'Best service I have received in a while. The staff was incredibly welcoming and the environment was pristine.',
        businessReply: null,
        repliedAt: null,
    },
    {
        id: '2',
        customerName: 'Kwame Mensah',
        avatar: 'https://i.pravatar.cc/150?img=11',
        date: '1 week ago',
        rating: 3,
        content: 'The haircut was decent, but I had to wait 20 minutes past my appointment time. Hope the scheduling improves.',
        businessReply: null,
        repliedAt: null,
    },
    {
        id: '3',
        customerName: 'Sarah Jenkins',
        avatar: 'https://i.pravatar.cc/150?img=5',
        date: '2 weeks ago',
        rating: 5,
        content: 'Absolutely love this place! Will definitely be coming back for my next styling.',
        businessReply: 'Thank you so much, Sarah! We look forward to having you back in the chair soon.',
        repliedAt: '1 week ago',
    },
];

const ManageReviewsScreen = () => {
    const { colors, isDark } = useTheme();

    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [activeTab, setActiveTab] = useState('All');

    // Reply State
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    // Filtering Logic
    const filteredReviews = reviews.filter((review) => {
        if (activeTab === 'Unreplied') return review.businessReply === null;
        if (activeTab === '5 Stars') return review.rating === 5;
        if (activeTab === 'Critical') return review.rating <= 3;
        return true; // 'All'
    });

    const handleOpenReply = (id: string) => {
        setReplyingTo(id);
        setReplyText('');
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    const handleSubmitReply = (id: string) => {
        if (!replyText.trim()) return;

        setReviews(
            reviews.map((r) =>
                r.id === id
                    ? { ...r, businessReply: replyText, repliedAt: 'Just now' }
                    : r
            )
        );
        setReplyingTo(null);
        setReplyText('');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Reviews & Ratings</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* 2. Analytics Overview Card */}
                    <View style={[styles.analyticsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>Overall Rating</Text>

                        <View style={styles.analyticsContent}>
                            <View style={[styles.analyticsLeft, { borderRightColor: colors.divider }]}>
                                <Text style={[styles.averageScore, { color: colors.text }]}>{RATING_STATS.average}</Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <AppIcon key={star} library="AntDesign" name="star" size={16} color={colors.warning} />
                                    ))}
                                </View>
                                <Text style={[styles.totalReviews, { color: colors.textSecondary }]}>
                                    Based on {RATING_STATS.total} reviews
                                </Text>
                            </View>

                            <View style={styles.analyticsRight}>
                                {RATING_STATS.breakdown.map((item) => {
                                    const widthPercent = (item.count / RATING_STATS.total) * 100;
                                    return (
                                        <View key={item.stars} style={styles.barRow}>
                                            <Text style={[styles.barStarText, { color: colors.textSecondary }]}>{item.stars}</Text>
                                            <AppIcon library="AntDesign" name="star" size={10} color={colors.warning} />
                                            <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                                                <View style={[styles.barFill, { width: `${widthPercent}%`, backgroundColor: colors.primary }]} />
                                            </View>
                                            <Text style={[styles.barCountText, { color: colors.textSecondary }]}>{item.count}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </View>

                    {/* 3. Filter Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                        {FILTER_TABS.map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    style={[
                                        styles.tabPill,
                                        {
                                            backgroundColor: isActive ? colors.primary : colors.surface,
                                            borderColor: isActive ? colors.primary : colors.border,
                                        },
                                    ]}
                                >
                                    <Text style={[styles.tabPillText, { color: isActive ? colors.textInverse : colors.textSecondary }]}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* 4. Reviews List */}
                    <View style={styles.reviewsList}>
                        {filteredReviews.length === 0 ? (
                            <View style={styles.emptyState}>
                                <AppIcon library="Feather" name="message-square" size={40} color={colors.textSecondary} style={{ marginBottom: 16 }} />
                                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Reviews Found</Text>
                                <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>You don't have any reviews matching this filter.</Text>
                            </View>
                        ) : (
                            filteredReviews.map((review) => (
                                <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>

                                    {/* Customer Header */}
                                    <View style={styles.reviewHeader}>
                                        <Image source={{ uri: review.avatar }} style={styles.avatar} />
                                        <View style={styles.reviewerInfo}>
                                            <Text style={[styles.reviewerName, { color: colors.text }]}>{review.customerName}</Text>
                                            <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>{review.date}</Text>
                                        </View>
                                        <View style={styles.starsRowSmall}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <AppIcon
                                                    key={star}
                                                    library="AntDesign"
                                                    name="star"
                                                    size={12}
                                                    color={star <= review.rating ? colors.warning : colors.border}
                                                />
                                            ))}
                                        </View>
                                    </View>

                                    {/* Customer Content */}
                                    <Text style={[styles.reviewContent, { color: colors.text }]}>{review.content}</Text>

                                    {/* Business Reply Display */}
                                    {review.businessReply && (
                                        <View style={[styles.businessReplyBox, { backgroundColor: colors.primary + '10', borderLeftColor: colors.primary }]}>
                                            <View style={styles.replyHeaderRow}>
                                                <Text style={[styles.replyHeaderTitle, { color: colors.primary }]}>Your Response</Text>
                                                <Text style={[styles.replyDate, { color: colors.textSecondary }]}>{review.repliedAt}</Text>
                                            </View>
                                            <Text style={[styles.replyContent, { color: colors.text }]}>{review.businessReply}</Text>
                                        </View>
                                    )}

                                    {/* Actions / Inline Reply Input */}
                                    {!review.businessReply && (
                                        <View style={[styles.actionContainer, { borderTopColor: colors.divider }]}>
                                            {replyingTo === review.id ? (
                                                <View style={styles.replyInputArea}>
                                                    <TextInput
                                                        style={[styles.replyInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                                                        placeholder="Write a public response..."
                                                        placeholderTextColor={colors.textSecondary}
                                                        multiline
                                                        value={replyText}
                                                        onChangeText={setReplyText}
                                                        autoFocus
                                                    />
                                                    <View style={styles.replyActionsRow}>
                                                        <TouchableOpacity onPress={handleCancelReply} style={styles.cancelReplyBtn}>
                                                            <Text style={[styles.cancelReplyText, { color: colors.textSecondary }]}>Cancel</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => handleSubmitReply(review.id)}
                                                            style={[styles.submitReplyBtn, { backgroundColor: colors.primary }]}
                                                        >
                                                            <Text style={[styles.submitReplyText, { color: colors.textInverse }]}>Post Reply</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    style={[styles.replyBtn, { borderColor: colors.border }]}
                                                    onPress={() => handleOpenReply(review.id)}
                                                >
                                                    <AppIcon library="Feather" name="corner-down-right" size={16} color={colors.text} />
                                                    <Text style={[styles.replyBtnText, { color: colors.text }]}>Reply to Customer</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}

                                </View>
                            ))
                        )}
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    scrollContent: { paddingBottom: 40 },

    // Analytics Card
    analyticsCard: { margin: 20, padding: 20, borderRadius: 16, borderWidth: 1 },
    sectionTitle: { fontSize: 16, fontWeight: '800' },
    analyticsContent: { flexDirection: 'row' },
    analyticsLeft: { flex: 0.4, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, paddingRight: 16 },
    averageScore: { fontSize: 40, fontWeight: '900', marginBottom: 4 },
    starsRow: { flexDirection: 'row', gap: 2, marginBottom: 8 },
    totalReviews: { fontSize: 11, textAlign: 'center' },

    analyticsRight: { flex: 0.6, paddingLeft: 16, justifyContent: 'center' },
    barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    barStarText: { fontSize: 12, fontWeight: '700', width: 12 },
    barTrack: { flex: 1, height: 6, borderRadius: 3, marginHorizontal: 8, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 3 },
    barCountText: { fontSize: 12, width: 24, textAlign: 'right' },

    // Tabs
    tabsScroll: { paddingHorizontal: 20, gap: 10, paddingBottom: 16 },
    tabPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    tabPillText: { fontSize: 13, fontWeight: '700' },

    // Reviews List
    reviewsList: { paddingHorizontal: 20 },
    reviewCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },

    reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    reviewerInfo: { flex: 1 },
    reviewerName: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
    reviewDate: { fontSize: 12 },
    starsRowSmall: { flexDirection: 'row', gap: 2 },

    reviewContent: { fontSize: 14, lineHeight: 22, marginBottom: 16 },

    // Business Reply Display
    businessReplyBox: { padding: 12, borderRadius: 8, borderLeftWidth: 4, marginTop: 4 },
    replyHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    replyHeaderTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
    replyDate: { fontSize: 11 },
    replyContent: { fontSize: 14, lineHeight: 20 },

    // Action / Reply Input
    actionContainer: { marginTop: 8, paddingTop: 16, borderTopWidth: 1 },
    replyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1, gap: 8 },
    replyBtnText: { fontSize: 14, fontWeight: '700' },

    replyInputArea: { width: '100%' },
    replyInput: { minHeight: 80, borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, textAlignVertical: 'top', marginBottom: 12 },
    replyActionsRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 16 },
    cancelReplyBtn: { paddingVertical: 8, paddingHorizontal: 12 },
    cancelReplyText: { fontSize: 14, fontWeight: '600' },
    submitReplyBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
    submitReplyText: { fontSize: 14, fontWeight: '700' },

    // Empty State
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
    emptyTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center' },
});

export default ManageReviewsScreen;