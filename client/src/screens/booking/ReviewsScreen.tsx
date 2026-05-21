import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


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

const FILTERS = ['All', 'With Photos', '5 Stars', '4 Stars', '3 Stars'];

const REVIEWS = [
    {
        id: '1',
        author: 'Amara Okoro',
        isVerified: true,
        avatar: 'https://i.pravatar.cc/150?img=47',
        date: '2 DAYS AGO',
        rating: 5,
        title: 'Best Jollof in the city!',
        content: 'The Jollof rice here is unmatched. It has that perfect smoky flavor that reminds me of home. The service was also very friendly and the atmosphere is quite vibrant.',
        photos: [
            'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=200',
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200',
        ],
        helpfulCount: 24,
    },
    {
        id: '2',
        author: 'Kwame Mensah',
        isVerified: true,
        avatar: 'https://i.pravatar.cc/150?img=11',
        date: '1 WEEK AGO',
        rating: 4,
        title: 'Great food, slightly long wait',
        content: 'Absolutely loved the Egusi soup and fufu. The portion sizes are generous. Only giving 4 stars because we had to wait 20 minutes for our table even with a reservation.',
        photos: [],
        helpfulCount: 12,
    },
    {
        id: '3',
        author: 'Sarah Jenkins',
        isVerified: false,
        avatar: 'https://i.pravatar.cc/150?img=5',
        date: '2 WEEKS AGO',
        rating: 5,
        title: 'A cultural gem',
        content: "I'm so glad I found this spot through AfroSpot! The decor is stunning and the music sets such a great mood. Highly recommend the Suya platter.",
        photos: [
            'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=200',
        ],
        helpfulCount: 45,
    },
];

const ReviewsScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'Reviews'>>();
    const { colors, isDark } = useTheme();
    const [activeFilter, setActiveFilter] = useState('All');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Reviews & Ratings</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="search" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="bell" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 2. Rating Summary Card */}
                <View style={[styles.summaryCard, { backgroundColor: colors.primary + '10' }]}>
                    <View style={styles.summaryLeft}>
                        <Text style={[styles.averageScore, { color: colors.text }]}>{RATING_STATS.average}</Text>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <AppIcon key={star} library="AntDesign" name="star" size={14} color="#F59E0B" />
                            ))}
                        </View>
                        <Text style={[styles.totalReviews, { color: colors.textSecondary }]}>{RATING_STATS.total} REVIEWS</Text>
                    </View>

                    <View style={styles.summaryRight}>
                        {RATING_STATS.breakdown.map((item) => {
                            const widthPercent = (item.count / RATING_STATS.total) * 100;
                            return (
                                <View key={item.stars} style={styles.barRow}>
                                    <Text style={[styles.barStarText, { color: colors.textSecondary }]}>{item.stars}</Text>
                                    <AppIcon library="AntDesign" name="star-o" size={10} color={colors.textSecondary} />
                                    <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                                        <View style={[styles.barFill, { width: `${widthPercent}%`, backgroundColor: colors.primary }]} />
                                    </View>
                                    <Text style={[styles.barCountText, { color: colors.textSecondary }]}>{item.count}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* 3. Filters */}
                <View style={styles.filtersWrapper}>
                    <TouchableOpacity style={[styles.filterIconBtn, { borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="filter" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                        {FILTERS.map((filter) => {
                            const isActive = activeFilter === filter;
                            return (
                                <TouchableOpacity
                                    key={filter}
                                    onPress={() => setActiveFilter(filter)}
                                    style={[
                                        styles.filterPill,
                                        {
                                            backgroundColor: isActive ? colors.primary : colors.background,
                                            borderColor: isActive ? colors.primary : colors.border,
                                        },
                                    ]}
                                >
                                    <Text style={[styles.filterPillText, { color: isActive ? '#FFF' : colors.text }]}>
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* 4. Section Header */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>All Reviews</Text>
                    <TouchableOpacity style={styles.sortRow}>
                        <Text style={[styles.sortText, { color: colors.primary }]}>Most Relevant</Text>
                        <AppIcon library="Feather" name="chevron-right" size={16} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* 5. Reviews List */}
                <View style={styles.reviewsList}>
                    {REVIEWS.map((review, index) => (
                        <ReviewCard key={review.id} review={review} isLast={index === REVIEWS.length - 1} colors={colors} />
                    ))}
                </View>

                {/* 6. Load More Button */}
                <TouchableOpacity style={[styles.loadMoreBtn, { borderColor: colors.primary }]}>
                    <Text style={[styles.loadMoreText, { color: colors.primary }]}>Load More Reviews</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* 7. Bottom Floating Actions */}
            <View style={[styles.bottomContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <AppButton
                    title="Write a Review"
                    leftIcon='edit-3'
                    // leftIcon={<AppIcon library="Feather" name="edit-3" size={18} color="#FFF" />}
                    onPress={() => { }}
                />
            </View>

            {/* Optional: Gallery Floating Action Button */}
            <TouchableOpacity style={[styles.galleryFab, { backgroundColor: colors.surface, shadowColor: colors.text }]}>
                <AppIcon library="Feather" name="image" size={20} color={colors.text} />
            </TouchableOpacity>

        </SafeAreaView>
    );
};

// --- Sub Components ---

const ReviewCard = ({ review, isLast, colors }: any) => {
    return (
        <View style={[styles.reviewCard, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>

            {/* Reviewer Header */}
            <View style={styles.reviewerHeader}>
                <Image source={{ uri: review.avatar }} style={styles.avatar} />
                <View style={styles.reviewerInfo}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.reviewerName, { color: colors.text }]}>{review.author}</Text>
                        {review.isVerified && (
                            <View style={styles.verifiedBadge}>
                                <AppIcon library="Feather" name="check" size={10} color="#22C55E" />
                            </View>
                        )}
                    </View>
                    <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>{review.date}</Text>
                </View>
                <View style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <AppIcon
                            key={star}
                            library="AntDesign"
                            name="star"
                            size={12}
                            color={star <= review.rating ? "#F59E0B" : colors.border}
                        />
                    ))}
                </View>
            </View>

            {/* Content */}
            <Text style={[styles.reviewTitle, { color: colors.text }]}>{review.title}</Text>
            <Text style={[styles.reviewContent, { color: colors.textSecondary }]}>{review.content}</Text>

            {/* Photos */}
            {review.photos && review.photos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosScroll}>
                    {review.photos.map((photo: string, index: number) => (
                        <Image key={index} source={{ uri: photo }} style={styles.reviewPhoto} />
                    ))}
                </ScrollView>
            )}

            {/* Actions */}
            <View style={styles.reviewActions}>
                <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.border }]}>
                    <AppIcon library="Feather" name="thumbs-up" size={14} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>{review.helpfulCount} Helpful</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.border }]}>
                    <AppIcon library="Feather" name="message-square" size={14} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>Reply</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.shareBtn}>
                    <AppIcon library="Feather" name="share-2" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

        </View>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerRight: { flexDirection: 'row', gap: 8 },
    iconBtn: { padding: 4 },

    scrollContent: { paddingBottom: 100, paddingTop: 16 },

    // Summary Card
    summaryCard: { flexDirection: 'row', marginHorizontal: 20, padding: 20, borderRadius: 16, marginBottom: 24 },
    summaryLeft: { flex: 0.35, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: 'rgba(0,0,0,0.05)', paddingRight: 16 },
    averageScore: { fontSize: 42, fontWeight: '900', marginBottom: 4 },
    starsRow: { flexDirection: 'row', gap: 2, marginBottom: 8 },
    totalReviews: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

    summaryRight: { flex: 0.65, paddingLeft: 16, justifyContent: 'center' },
    barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    barStarText: { fontSize: 12, fontWeight: '700', width: 12 },
    barTrack: { flex: 1, height: 6, borderRadius: 3, marginHorizontal: 8, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 3 },
    barCountText: { fontSize: 12, width: 20, textAlign: 'right' },

    // Filters
    filtersWrapper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 32 },
    filterIconBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    filtersScroll: { gap: 10, paddingRight: 20 },
    filterPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
    filterPillText: { fontSize: 13, fontWeight: '600' },

    // Section Header
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '900' },
    sortRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    sortText: { fontSize: 13, fontWeight: '700' },

    // Reviews List
    reviewsList: { paddingHorizontal: 20 },
    reviewCard: { paddingVertical: 24 },

    reviewerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    reviewerInfo: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
    reviewerName: { fontSize: 15, fontWeight: '800', marginRight: 6 },
    verifiedBadge: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#22C55E', alignItems: 'center', justifyContent: 'center' },
    reviewDate: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
    reviewStars: { flexDirection: 'row', gap: 2 },

    reviewTitle: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
    reviewContent: { fontSize: 14, lineHeight: 22, marginBottom: 16 },

    photosScroll: { gap: 12, marginBottom: 16 },
    reviewPhoto: { width: 100, height: 100, borderRadius: 12 },

    reviewActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, gap: 6 },
    actionText: { fontSize: 13, fontWeight: '600' },
    shareBtn: { padding: 8 },

    // Load More Button
    loadMoreBtn: { marginHorizontal: 20, marginTop: 16, marginBottom: 32, paddingVertical: 14, borderRadius: 24, borderWidth: 1, alignItems: 'center' },
    loadMoreText: { fontSize: 14, fontWeight: '800' },

    // Bottom Fixed Container
    bottomContainer: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 34, borderTopWidth: 1 },

    // Gallery FAB
    galleryFab: { position: 'absolute', bottom: 100, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
});

export default ReviewsScreen;