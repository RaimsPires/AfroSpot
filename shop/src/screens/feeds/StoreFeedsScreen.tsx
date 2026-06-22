import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ImageBackground,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { FeedData, feedService } from '@services/feedService';

const FILTER_TABS = ['All', 'Boosted', 'Organic'];

// Helper to format numbers like 12400 to '12.4K'
const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const StoreFeedsScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    const [activeTab, setActiveTab] = useState('All');
    const [feeds, setFeeds] = useState<FeedData[]>([]);

    // Pagination State
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Dynamic Summary Stats
    const [totalViews, setTotalViews] = useState(0);
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalReach, setTotalReach] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const stats = await feedService.getSpotStats();
                setTotalViews(stats.total_views);
                setTotalLikes(stats.total_likes);
                setTotalReach(stats.total_reach);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);


    const fetchFeeds = async (pageNum: number, currentTab: string, isRefresh = false) => {
        try {
            if (isRefresh) setIsRefreshing(true);
            else if (pageNum === 1) setIsLoading(true);
            else setIsFetchingMore(true);

            const response = await feedService.getFeeds(pageNum, currentTab);
            console.log(response);

            if (pageNum === 1) {
                setFeeds(response.results);
            } else {
                setFeeds(prev => [...prev, ...response.results]);
            }

            setHasNextPage(!!response.next);

        } catch (error) {
            console.error("Error fetching store feeds:", error);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
            setIsRefreshing(false);
        }
    };

    // Load initial data and refresh when tab changes
    useFocusEffect(
        useCallback(() => {
            setPage(1);
            fetchFeeds(1, activeTab);
        }, [activeTab])
    );

    const handleRefresh = () => {
        setPage(1);
        fetchFeeds(1, activeTab, true);
    };

    const loadMore = () => {
        if (hasNextPage && !isFetchingMore && !isLoading && !isRefreshing) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchFeeds(nextPage, activeTab);
        }
    };

    const renderHeader = () => (
        <View style={{ paddingBottom: 16 }}>
            {/* Performance Summary */}
            <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.summaryItem}>
                    <AppIcon library="Feather" name="eye" size={16} color={colors.primary} />
                    <Text style={[styles.summaryValue, { color: colors.text }]}>{formatNumber(totalViews)}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Views</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
                <View style={styles.summaryItem}>
                    <AppIcon library="AntDesign" name="heart" size={16} color={colors.primary} />
                    <Text style={[styles.summaryValue, { color: colors.text }]}>{formatNumber(totalLikes)}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Likes</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
                <View style={styles.summaryItem}>
                    <AppIcon library="Feather" name="zap" size={16} color={colors.primary} />
                    <Text style={[styles.summaryValue, { color: colors.text }]}>{formatNumber(totalReach)}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Reach</Text>
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabsRow}>
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
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Screen Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Store Feeds</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('CreateFeed')}>
                    <AppIcon library="Feather" name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Main List */}
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={feeds}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.content}
                    ListHeaderComponent={renderHeader}

                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
                    }

                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5} // Trigger load more when halfway down the list

                    ListFooterComponent={
                        isFetchingMore ? <ActivityIndicator style={{ margin: 20 }} color={colors.primary} /> : null
                    }

                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textSecondary }}>
                            No {activeTab.toLowerCase()} feeds found.
                        </Text>
                    }

                    renderItem={({ item: feed }) => (
                        <View style={[styles.feedCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {/* Card Body */}
                            <TouchableOpacity
                                style={styles.cardBody}
                                onPress={() => navigation.navigate('FeedInsights', { feedId: feed.id })}
                                activeOpacity={0.85}
                            >
                                <ImageBackground
                                    source={{ uri: feed.video_cover || 'https://via.placeholder.com/400' }}
                                    style={styles.cardThumbnail}
                                    imageStyle={{ borderRadius: 10 }}
                                >
                                    <View style={styles.playBadge}>
                                        <AppIcon library="Feather" name="play" size={14} color="#FFF" />
                                    </View>
                                    {feed.is_boosted && (
                                        <View style={[styles.boostedBadge, { backgroundColor: colors.primary }]}>
                                            <AppIcon library="Feather" name="zap" size={10} color="#FFF" />
                                            <Text style={styles.boostedBadgeText}>Boosted</Text>
                                        </View>
                                    )}
                                </ImageBackground>

                                <View style={styles.cardInfo}>
                                    <Text style={[styles.cardCaption, { color: colors.text }]} numberOfLines={2}>
                                        {feed.caption}
                                    </Text>

                                    <View style={styles.statsRow}>
                                        <View style={styles.statItem}>
                                            <AppIcon library="Feather" name="eye" size={12} color={colors.textSecondary} />
                                            <Text style={[styles.statText, { color: colors.textSecondary }]}>{formatNumber(feed.total_views)}</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <AppIcon library="AntDesign" name="heart" size={12} color={colors.textSecondary} />
                                            <Text style={[styles.statText, { color: colors.textSecondary }]}>{formatNumber(feed.likes_count)}</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <AppIcon library="Feather" name="message-circle" size={12} color={colors.textSecondary} />
                                            <Text style={[styles.statText, { color: colors.textSecondary }]}>{formatNumber(feed.comments_count)}</Text>
                                        </View>
                                    </View>

                                    {feed.is_boosted && feed.boost_reach > 0 && (
                                        <View style={[styles.reachRow, { backgroundColor: colors.primary + '15' }]}>
                                            <AppIcon library="Feather" name="zap" size={11} color={colors.primary} />
                                            <Text style={[styles.reachText, { color: colors.primary }]}>
                                                {formatNumber(feed.boost_reach)} boosted reach
                                            </Text>
                                        </View>
                                    )}

                                    <Text style={[styles.cardDate, { color: colors.textSecondary }]}>{formatDate(feed.created_at)}</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Card Footer */}
                            <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                                <TouchableOpacity style={styles.footerBtn} onPress={() => navigation.navigate('FeedInsights', { feed })}>
                                    <AppIcon library="Feather" name="bar-chart-2" size={15} color={colors.textSecondary} />
                                    <Text style={[styles.footerBtnText, { color: colors.textSecondary }]}>Insights</Text>
                                </TouchableOpacity>

                                <View style={[styles.footerDivider, { backgroundColor: colors.border }]} />

                                <TouchableOpacity style={styles.footerBtn} onPress={() => navigation.navigate('BoostFeed', { feed })}>
                                    <AppIcon library="Feather" name="zap" size={15} color={feed.is_boosted ? colors.primary : colors.text} />
                                    <Text style={[styles.footerBtnText, { color: feed.is_boosted ? colors.primary : colors.text, fontWeight: '800' }]}>
                                        {feed.is_boosted ? 'Manage Boost' : 'Boost'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 4 },
    content: { padding: 20, paddingBottom: 40 },

    // Summary
    summaryCard: { flexDirection: 'row', padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
    summaryItem: { flex: 1, alignItems: 'center', gap: 4 },
    summaryValue: { fontSize: 20, fontWeight: '900' },
    summaryLabel: { fontSize: 11, fontWeight: '600' },
    summaryDivider: { width: 1, marginHorizontal: 8 },

    // Tabs
    tabsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    tabPill: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
    tabPillText: { fontSize: 13, fontWeight: '700' },

    // Feed Card
    feedCard: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
    cardBody: { flexDirection: 'row', padding: 14, gap: 14 },
    cardThumbnail: { width: 90, height: 120, borderRadius: 10, justifyContent: 'space-between', overflow: 'hidden', backgroundColor: '#000' },
    playBadge: { alignSelf: 'center', marginTop: 44, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
    boostedBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', margin: 6, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, gap: 3 },
    boostedBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '900', letterSpacing: 0.3 },

    cardInfo: { flex: 1, justifyContent: 'space-between' },
    cardCaption: { fontSize: 14, fontWeight: '600', lineHeight: 20, marginBottom: 10 },
    statsRow: { flexDirection: 'row', gap: 14, marginBottom: 8 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statText: { fontSize: 12, fontWeight: '600' },
    reachRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
    reachText: { fontSize: 11, fontWeight: '700' },
    cardDate: { fontSize: 11, fontWeight: '500' },

    // Card Footer
    cardFooter: { flexDirection: 'row', borderTopWidth: 1 },
    footerBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
    footerBtnText: { fontSize: 13, fontWeight: '700' },
    footerDivider: { width: 1, marginVertical: 10 },
});