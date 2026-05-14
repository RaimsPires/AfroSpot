import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const TABS = ['Upcoming', 'Completed', 'Cancelled'];

const MOCK_BOOKINGS = [
    {
        id: 'b1',
        status: 'Upcoming',
        businessName: 'Kushite Cutz & Styles',
        service: 'Fresh Fade & Lineup',
        professional: 'Kwame O.',
        date: 'Oct 26, 2023',
        time: '04:00 PM',
        price: '$35.00',
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200',
    },
    {
        id: 'b2',
        status: 'Upcoming',
        businessName: 'Mama Africa Kitchen',
        service: 'Table Reservation (4 People)',
        professional: null,
        date: 'Oct 28, 2023',
        time: '07:30 PM',
        price: 'Free',
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=200',
    },
    {
        id: 'b3',
        status: 'Completed',
        businessName: 'Heritage Braids',
        service: 'Knotless Box Braids',
        professional: 'Amara J.',
        date: 'Sep 12, 2023',
        time: '10:00 AM',
        price: '$120.00',
        image: 'https://images.unsplash.com/photo-1605497788044-5a32c707d2c6?q=80&w=200',
        hasReviewed: false,
    },
    {
        id: 'b4',
        status: 'Completed',
        businessName: 'Lagos Cuts',
        service: 'Beard Grooming',
        professional: 'Tobi M.',
        date: 'Aug 05, 2023',
        time: '02:00 PM',
        price: '$25.00',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=200',
        hasReviewed: true,
    },
    {
        id: 'b5',
        status: 'Cancelled',
        businessName: 'Kushite Cutz & Styles',
        service: 'Full Grooming Experience',
        professional: 'Malik T.',
        date: 'Jul 20, 2023',
        time: '11:00 AM',
        price: '$65.00',
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200',
    },
];

const BookingHistoryScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'BookingHistory'>>();
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('Upcoming');

    const filteredBookings = MOCK_BOOKINGS.filter((booking) => booking.status === activeTab);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Upcoming': return colors.primary; // Orange
            case 'Completed': return '#22C55E'; // Green
            case 'Cancelled': return '#EF4444'; // Red
            default: return colors.textSecondary;
        }
    };

    const renderBookingCard = ({ item }: any) => {
        const statusColor = getStatusColor(item.status);

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id, bookingStatus: item.status })}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
                <View style={styles.cardHeader}>
                    <Text style={[styles.businessName, { color: colors.textSecondary }]}>{item.businessName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <Image source={{ uri: item.image }} style={styles.serviceImage} />
                    <View style={styles.serviceDetails}>
                        <Text style={[styles.serviceTitle, { color: colors.text }]} numberOfLines={1}>{item.service}</Text>
                        {item.professional && (
                            <Text style={[styles.professionalText, { color: colors.textSecondary }]}>With {item.professional}</Text>
                        )}

                        <View style={styles.dateTimeRow}>
                            <AppIcon library="Feather" name="calendar" size={12} color={colors.textSecondary} />
                            <Text style={[styles.dateTimeText, { color: colors.text }]}>{item.date}  •  {item.time}</Text>
                        </View>

                        <Text style={[styles.priceText, { color: colors.text }]}>{item.price}</Text>
                    </View>
                </View>

                {/* Dynamic Actions based on Status */}
                <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                    {item.status === 'Upcoming' && (
                        <>
                            <TouchableOpacity style={[styles.actionBtnOutline, { borderColor: colors.border, flex: 1 }]}>
                                <Text style={[styles.actionBtnOutlineText, { color: colors.text }]}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={{ width: 12 }} />
                            <TouchableOpacity
                                onPress={(e) => { e.stopPropagation?.(); navigation.navigate('Booking', { businessId: item.id, businessName: item.businessName, serviceType: item.service }); }}
                                style={[styles.actionBtnSolid, { backgroundColor: colors.primary, flex: 1 }]}
                            >
                                <Text style={styles.actionBtnSolidText}>Reschedule</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {item.status === 'Completed' && (
                        <>
                            {!item.hasReviewed ? (
                                <TouchableOpacity
                                    onPress={(e) => { e.stopPropagation?.(); navigation.navigate('Reviews', { businessId: item.id, source: 'leave-review' }); }}
                                    style={[styles.actionBtnOutline, { borderColor: colors.primary, flex: 1 }]}
                                >
                                    <Text style={[styles.actionBtnOutlineText, { color: colors.primary }]}>Leave Review</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
                                    <AppIcon library="Feather" name="check-circle" size={14} color="#22C55E" />
                                    <Text style={{ fontSize: 13, color: '#22C55E', fontWeight: '600' }}>Reviewed</Text>
                                </View>
                            )}
                            <View style={{ width: 12 }} />
                            <TouchableOpacity
                                onPress={(e) => { e.stopPropagation?.(); navigation.navigate('Booking', { businessId: item.id, businessName: item.businessName, serviceType: item.service }); }}
                                style={[styles.actionBtnSolid, { backgroundColor: colors.primary, flex: 1 }]}
                            >
                                <Text style={styles.actionBtnSolidText}>Rebook</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {item.status === 'Cancelled' && (
                        <TouchableOpacity
                            onPress={(e) => { e.stopPropagation?.(); navigation.navigate('Booking', { businessId: item.id, businessName: item.businessName, serviceType: item.service }); }}
                            style={[styles.actionBtnSolid, { backgroundColor: colors.primary, flex: 1 }]}
                        >
                            <Text style={styles.actionBtnSolidText}>Book Again</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Booking History</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="search" size={22} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* 2. Top Tabs */}
            <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
                {TABS.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[styles.tabItem, isActive && { borderBottomColor: colors.primary }]}
                        >
                            <Text style={[styles.tabText, { color: isActive ? colors.primary : colors.textSecondary, fontWeight: isActive ? '800' : '600' }]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* 3. Bookings List */}
            <FlatList
                data={filteredBookings}
                keyExtractor={(item) => item.id}
                renderItem={renderBookingCard}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={[styles.emptyIconBg, { backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="calendar" size={40} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No {activeTab.toLowerCase()} bookings</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                            You don't have any {activeTab.toLowerCase()} appointments at the moment.
                        </Text>
                        {activeTab !== 'Completed' && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Search')}
                                style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
                            >
                                <Text style={styles.exploreBtnText}>Book a Service</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    // Tabs
    tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1 },
    tabItem: { flex: 1, alignItems: 'center', paddingVertical: 14, borderBottomWidth: 3, borderBottomColor: 'transparent' },
    tabText: { fontSize: 14 },

    // List
    listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },

    // Card Design
    card: { borderRadius: 16, borderWidth: 1, marginBottom: 16, elevation: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },

    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 12 },
    businessName: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 11, fontWeight: '800' },

    cardBody: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16 },
    serviceImage: { width: 70, height: 70, borderRadius: 12, marginRight: 16 },
    serviceDetails: { flex: 1, justifyContent: 'center' },
    serviceTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    professionalText: { fontSize: 13, marginBottom: 8 },
    dateTimeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
    dateTimeText: { fontSize: 13, fontWeight: '600' },
    priceText: { fontSize: 15, fontWeight: '900' },

    cardFooter: { flexDirection: 'row', padding: 16, borderTopWidth: 1, paddingTop: 16 },
    actionBtnOutline: { paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    actionBtnOutlineText: { fontSize: 14, fontWeight: '700' },
    actionBtnSolid: { paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    actionBtnSolidText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

    // Empty State
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24, paddingHorizontal: 20 },
    exploreBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 },
    exploreBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});

export default BookingHistoryScreen;