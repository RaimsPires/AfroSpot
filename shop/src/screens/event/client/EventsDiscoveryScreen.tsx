import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { EventData, eventService } from '@services/eventService';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// To prevent spamming the API on every keystroke
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export const EventsDiscoveryScreen = () => {
    const { colors } = useTheme();
    
    // State
    const [events, setEvents] = useState<EventData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500); // Wait 500ms after user stops typing
    
    // Pagination State
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Fetch Function
    const fetchEvents = async (pageNum: number, isRefresh = false) => {
        try {
            if (isRefresh) setIsLoading(true);
            else setIsFetchingMore(true);

            const response = await eventService.getEvents({
                page: pageNum,
                search: debouncedSearch,
                time: 'upcoming', // Discovery shows upcoming by default
                my_events: 'false' // We want all public events
            });

            if (isRefresh) {
                setEvents(response.results);
            } else {
                setEvents(prev => [...prev, ...response.results]);
            }
            
            setHasNextPage(response.next !== null);
        } catch (error) {
            console.error("Error fetching discovery events:", error);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    };

    // Effect: Trigger fetch when Screen focuses OR Search query changes
    useFocusEffect(
        useCallback(() => {
            setPage(1);
            fetchEvents(1, true);
        }, [debouncedSearch])
    );

    const loadMore = () => {
        if (hasNextPage && !isFetchingMore && !isLoading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchEvents(nextPage);
        }
    };

    // Render Helpers
    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Discover Events</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>In the Afro-Community</Text>
                </View>
                <TouchableOpacity style={[styles.profileBtn, { backgroundColor: colors.surface }]}>
                    <AppIcon library="Feather" name="map-pin" size={18} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
                    <AppIcon library="Feather" name="search" size={18} color={colors.textSecondary} />
                    <TextInput 
                        placeholder="Search events, cities..." 
                        placeholderTextColor={colors.textSecondary} 
                        style={[styles.searchInput, { color: colors.text }]} 
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Near You</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5} // Trigger load more when halfway down
                    ListFooterComponent={
                        isFetchingMore ? <ActivityIndicator style={{ margin: 20 }} color={colors.primary} /> : null
                    }
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textSecondary }}>
                            No events found matching your search.
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.eventRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {/* Fallback image if none provided */}
                            <Image 
                                source={{ uri: item.banner_image || 'https://via.placeholder.com/150' }} 
                                style={styles.rowImage} 
                            />
                            <View style={styles.rowInfo}>
                                <Text style={[styles.rowDate, { color: colors.primary }]}>
                                    {formatDate(item.start_datetime)}
                                </Text>
                                <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.rowLoc, { color: colors.textSecondary }]} numberOfLines={1}>
                                    {item.custom_address || item.spot_name || 'Location TBA'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: '900' },
    headerSub: { fontSize: 14, fontWeight: '600' },
    profileBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
    searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 50, borderRadius: 15 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '900', marginHorizontal: 20, marginBottom: 15 },
    eventRow: { flexDirection: 'row', padding: 12, borderRadius: 16, borderWidth: 1, marginHorizontal: 20, marginBottom: 15 },
    rowImage: { width: 80, height: 80, borderRadius: 12 },
    rowInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    rowDate: { fontSize: 12, fontWeight: '800', marginBottom: 4, textTransform: 'uppercase' },
    rowTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    rowLoc: { fontSize: 13 },
});