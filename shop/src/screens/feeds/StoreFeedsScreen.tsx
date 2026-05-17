import React, { useState } from 'react';
import {
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

// --- Mock Data ---
export const STORE_FEEDS = [
    {
        id: '1',
        thumbnail: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400',
        views: '12.4K', likes: '1.2K', comments: '84',
        caption: 'Fresh fades all day! Drop by Kushite Cutz. 🔥',
        date: 'Oct 28, 2023',
        isBoosted: true,
        boostReach: '24.8K',
    },
    {
        id: '2',
        thumbnail: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=400',
        views: '8.2K', likes: '840', comments: '31',
        caption: 'Precision is our middle name. #BarberLife',
        date: 'Oct 22, 2023',
        isBoosted: false,
        boostReach: null,
    },
    {
        id: '3',
        thumbnail: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=400',
        views: '15.1K', likes: '2.3K', comments: '120',
        caption: 'Before and after transformation! 💈',
        date: 'Oct 15, 2023',
        isBoosted: true,
        boostReach: '38.2K',
    },
    {
        id: '4',
        thumbnail: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400',
        views: '3.4K', likes: '320', comments: '18',
        caption: 'New styles incoming. Stay tuned!',
        date: 'Oct 10, 2023',
        isBoosted: false,
        boostReach: null,
    },
];

const FILTER_TABS = ['All', 'Boosted', 'Organic'];

export const StoreFeedsScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('All');

    const filteredFeeds = STORE_FEEDS.filter((f) => {
        if (activeTab === 'Boosted') return f.isBoosted;
        if (activeTab === 'Organic') return !f.isBoosted;
        return true;
    });

    const totalViews = '39.1K';
    const totalLikes = '4.6K';
    const totalReach = '63.0K';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Store Feeds</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('CreateFeed')}>
                    <AppIcon library="Feather" name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Performance Summary */}
                <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.summaryItem}>
                        <AppIcon library="Feather" name="eye" size={16} color={colors.primary} />
                        <Text style={[styles.summaryValue, { color: colors.text }]}>{totalViews}</Text>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Views</Text>
                    </View>
                    <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
                    <View style={styles.summaryItem}>
                        <AppIcon library="AntDesign" name="heart" size={16} color={colors.primary} />
                        <Text style={[styles.summaryValue, { color: colors.text }]}>{totalLikes}</Text>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Likes</Text>
                    </View>
                    <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
                    <View style={styles.summaryItem}>
                        <AppIcon library="Feather" name="zap" size={16} color={colors.primary} />
                        <Text style={[styles.summaryValue, { color: colors.text }]}>{totalReach}</Text>
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

                {/* Feed Cards */}
                {filteredFeeds.map((feed) => (
                    <View key={feed.id} style={[styles.feedCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>

                        {/* Card Body: Thumbnail + Info */}
                        <TouchableOpacity
                            style={styles.cardBody}
                            onPress={() => navigation.navigate('FeedViewer', { feedId: feed.id })}
                            activeOpacity={0.85}
                        >
                            <ImageBackground
                                source={{ uri: feed.thumbnail }}
                                style={styles.cardThumbnail}
                                imageStyle={{ borderRadius: 10 }}
                            >
                                <View style={styles.playBadge}>
                                    <AppIcon library="Feather" name="play" size={14} color="#FFF" />
                                </View>
                                {feed.isBoosted && (
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
                                        <Text style={[styles.statText, { color: colors.textSecondary }]}>{feed.views}</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <AppIcon library="AntDesign" name="heart" size={12} color={colors.textSecondary} />
                                        <Text style={[styles.statText, { color: colors.textSecondary }]}>{feed.likes}</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <AppIcon library="Feather" name="message-circle" size={12} color={colors.textSecondary} />
                                        <Text style={[styles.statText, { color: colors.textSecondary }]}>{feed.comments}</Text>
                                    </View>
                                </View>

                                {feed.isBoosted && feed.boostReach ? (
                                    <View style={[styles.reachRow, { backgroundColor: colors.primary + '15' }]}>
                                        <AppIcon library="Feather" name="zap" size={11} color={colors.primary} />
                                        <Text style={[styles.reachText, { color: colors.primary }]}>
                                            {feed.boostReach} boosted reach
                                        </Text>
                                    </View>
                                ) : null}

                                <Text style={[styles.cardDate, { color: colors.textSecondary }]}>{feed.date}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Card Footer: Actions */}
                        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                            <TouchableOpacity
                                style={styles.footerBtn}
                                onPress={() => navigation.navigate('FeedInsights', { feed })}
                            >
                                <AppIcon library="Feather" name="bar-chart-2" size={15} color={colors.textSecondary} />
                                <Text style={[styles.footerBtnText, { color: colors.textSecondary }]}>Insights</Text>
                            </TouchableOpacity>

                            <View style={[styles.footerDivider, { backgroundColor: colors.border }]} />

                            <TouchableOpacity
                                style={styles.footerBtn}
                                onPress={() => navigation.navigate('BoostFeed', { feed })}
                            >
                                <AppIcon library="Feather" name="zap" size={15} color={feed.isBoosted ? colors.primary : colors.text} />
                                <Text style={[styles.footerBtnText, { color: feed.isBoosted ? colors.primary : colors.text, fontWeight: '800' }]}>
                                    {feed.isBoosted ? 'Manage Boost' : 'Boost'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                ))}

            </ScrollView>
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
    cardThumbnail: { width: 90, height: 120, borderRadius: 10, justifyContent: 'space-between', overflow: 'hidden' },
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