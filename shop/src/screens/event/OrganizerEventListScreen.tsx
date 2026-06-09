import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl // 🚀 1. Import RefreshControl
    ,



    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { img_landscape } from "@assets/index";
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { EventData, eventService } from '@services/eventService';

type FilterType = 'upcoming' | 'past';
// 🚀 2. Define exactly what kind of loading is happening
type LoadType = 'initial' | 'paginate' | 'refresh'; 

export const OrganizerEventListScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    
    const [filter, setFilter] = useState<FilterType>('upcoming');
    const [events, setEvents] = useState<EventData[]>([]);
    
    // Pagination & Loading States
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false); // 🚀 3. Add refresh state

    const fetchMyEvents = async (pageNum: number, currentFilter: FilterType, loadType: LoadType = 'initial') => {
        try {
            // Set the correct loading indicator based on the action
            if (loadType === 'initial') setIsLoading(true);
            if (loadType === 'paginate') setIsFetchingMore(true);
            if (loadType === 'refresh') setIsRefreshing(true);

            const response = await eventService.getEvents({
                page: pageNum,
                time: currentFilter,
                my_events: 'true' // Restricts to manager's spot
            });

            // If it's a fresh load or refresh, overwrite the array. If pagination, append to it.
            if (loadType === 'initial' || loadType === 'refresh') {
                setEvents(response.results);
            } else {
                setEvents(prev => [...prev, ...response.results]);
            }
            
            setHasNextPage(response.next !== null);
        } catch (error) {
            console.error("Error fetching my events:", error);
        } finally {
            // Turn off all loaders when done
            setIsLoading(false);
            setIsFetchingMore(false);
            setIsRefreshing(false);
        }
    };

    // Refresh when screen focuses or tab changes (Initial Load)
    useFocusEffect(
        useCallback(() => {
            setPage(1);
            fetchMyEvents(1, filter, 'initial');
        }, [filter])
    );

    // 🚀 4. The Pull-to-Refresh handler
    const handleRefresh = () => {
        setPage(1);
        fetchMyEvents(1, filter, 'refresh');
    };

    // 5. The infinite scroll handler
    const loadMore = () => {
        if (hasNextPage && !isFetchingMore && !isLoading && !isRefreshing) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMyEvents(nextPage, filter, 'paginate');
        }
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStartingPrice = (tiers?: { price: string | number }[]) => {
        if (!tiers || tiers.length === 0) return null;
        const prices = tiers.map(t => Number(t.price || 0));
        const minPrice = Math.min(...prices);
        return minPrice === 0 ? 'Free' : `$${minPrice}`;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>My Events</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CreateEvent')}
                    style={[styles.addCircle, { backgroundColor: colors.primary }]}>
                    <AppIcon library="Feather" name="plus" size={20} color={colors.textInverse} />
                </TouchableOpacity>
            </View>

            {/* Custom Tab Switcher */}
            <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
                {(['upcoming', 'past'] as FilterType[]).map((t) => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => setFilter(t)}
                        style={[styles.tab, filter === t && [styles.activeTab, { backgroundColor: colors.background }]]}
                    >
                        <Text style={[styles.tabText, { color: filter === t ? colors.text : colors.textSecondary }]}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* List */}
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 20 }}
                    
                    // 🚀 6. Implement the RefreshControl
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor={colors.primary} // iOS Spinner Color
                            colors={[colors.primary]} // Android Spinner Color
                        />
                    }

                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isFetchingMore ? <ActivityIndicator style={{ margin: 20 }} color={colors.primary} /> : null
                    }
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textSecondary }}>
                            No {filter} events found for your business.
                        </Text>
                    }
                    renderItem={({ item }) => {
                        const ticketsSold = item.ticket_sales || 0;
                        const revenue = item.revenue && item.revenue !== "$0.00" ? item.revenue : "$0";
                        const hasVendors = item.vendor_tiers && item.vendor_tiers.length > 0;
                        const startingTicketPrice = getStartingPrice(item.ticket_tiers);
                        const startingVendorPrice = getStartingPrice(item.vendor_tiers);

                        return (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
                                style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            >
                                <View style={styles.cardTop}>
                                    {item.banner_image ?
                                    <Image 
                                    source={{ uri: item.banner_image }} 
                                    style={styles.bannerImage} 
                                    /> : <Image
                                    source={img_landscape}
                                    style={styles.bannerImage} 
                                    />
                                }
                                    <View style={styles.eventInfo}>
                                        <Text style={[styles.eventDate, { color: colors.primary }]}>
                                            {formatDate(item.start_datetime)}
                                        </Text>
                                        <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
                                            {item.title}
                                        </Text>
                                    </View>
                                </View>

                                <View style={[styles.statsRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                                    <View style={styles.statItem}>
                                        <Text style={[styles.statVal, { color: colors.text }]}>{ticketsSold}</Text>
                                        <Text style={[styles.statLab, { color: colors.textSecondary }]}>Tickets Sold</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <Text style={[styles.statVal, { color: colors.text }]}>{revenue}</Text>
                                        <Text style={[styles.statLab, { color: colors.textSecondary }]}>Revenue</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        {hasVendors ? (
                                            <AppIcon library="Feather" name="check-circle" size={16} color={colors.success || '#4ADE80'} />
                                        ) : (
                                            <AppIcon library="Feather" name="minus" size={16} color={colors.textSecondary} />
                                        )}
                                        <Text style={[styles.statLab, { color: colors.textSecondary }]}>Vendors</Text>
                                    </View>
                                </View>

                                <View style={styles.pricingRow}>
                                    <View style={styles.pricePill}>
                                        <AppIcon library="Feather" name="ticket" size={12} color={colors.textSecondary} />
                                        <Text style={[styles.priceText, { color: colors.textSecondary }]}>
                                            Tickets from: <Text style={{ color: colors.text, fontWeight: '700' }}>{startingTicketPrice || 'N/A'}</Text>
                                        </Text>
                                    </View>
                                    
                                    {hasVendors && (
                                        <View style={styles.pricePill}>
                                            <AppIcon library="Feather" name="shopping-bag" size={12} color={colors.textSecondary} />
                                            <Text style={[styles.priceText, { color: colors.textSecondary }]}>
                                                Stalls from: <Text style={{ color: colors.text, fontWeight: '700' }}>{startingVendorPrice}</Text>
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: '900' },
    addCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    tabs: { flexDirection: 'row', marginHorizontal: 20, padding: 4, borderRadius: 25, marginBottom: 10 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 22 },
    activeTab: { elevation: 2 },
    tabText: { fontSize: 14, fontWeight: '700' },
    
    // Card Styles
    eventCard: { borderRadius: 20, borderWidth: 1, marginBottom: 20, overflow: 'hidden' },
    cardTop: { flexDirection: 'row', padding: 16, alignItems: 'center' },
    bannerImage: { width: 60, height: 60, borderRadius: 12, marginRight: 16 },
    eventInfo: { flex: 1 },
    eventDate: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 },
    eventTitle: { fontSize: 16, fontWeight: '800' },
    
    // Stats Styles
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderBottomWidth: 1, backgroundColor: 'rgba(0,0,0,0.02)' },
    statItem: { alignItems: 'center', flex: 1 },
    statVal: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
    statLab: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },

    // Pricing Bottom Row
    pricingRow: { flexDirection: 'row', padding: 12, paddingHorizontal: 16, gap: 12, flexWrap: 'wrap' },
    pricePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.04)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    priceText: { fontSize: 12, fontWeight: '500' }
});