import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


// --- Mock Data ---
const DASHBOARD_STATS = {
    revenue: '$4,250.00',
    revenueGrowth: '+12.5%',
    bookings: 24,
    profileViews: 1284,
};

const TODAYS_BOOKINGS = [
    {
        id: '1',
        customerName: 'Marcus Johnson',
        service: 'Fresh Fade & Lineup',
        time: '10:30 AM',
        status: 'Upcoming',
        avatar: 'https://i.pravatar.cc/150?img=11',
    },
    {
        id: '2',
        customerName: 'Sarah Jenkins',
        service: 'Braiding & Styling',
        time: '01:15 PM',
        status: 'In Progress',
        avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
        id: '3',
        customerName: 'David Osei',
        service: 'Beard Grooming',
        time: '03:00 PM',
        status: 'Pending',
        avatar: 'https://i.pravatar.cc/150?img=8',
    },
];

const RECENT_CUSTOMERS = [
    { id: 'c1', name: 'Amara', avatar: 'https://i.pravatar.cc/150?img=47' },
    { id: 'c2', name: 'Kwame', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 'c3', name: 'Nia', avatar: 'https://i.pravatar.cc/150?img=9' },
    { id: 'c4', name: 'Jamal', avatar: 'https://i.pravatar.cc/150?img=33' },
    { id: 'c5', name: 'Zuri', avatar: 'https://i.pravatar.cc/150?img=20' },
];

const BusinessDashboardScreen = () => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <View>
                    <Text style={[styles.greetingText, { color: colors.textSecondary }]}>Good Morning,</Text>
                    <Text style={[styles.businessName, { color: colors.text }]}>Kushite Cutz & Styles</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface }]}>
                        <AppIcon library="Feather" name="bell" size={20} color={colors.text} />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200' }} style={styles.shopAvatar} />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 2. Main Analytics Overview (Revenue) */}
                <View style={[styles.revenueCard, { backgroundColor: colors.primary }]}>
                    <View style={styles.revenueHeader}>
                        <Text style={styles.revenueLabel}>TOTAL REVENUE (THIS MONTH)</Text>
                        <TouchableOpacity>
                            <AppIcon library="Feather" name="more-horizontal" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.revenueBody}>
                        <Text style={styles.revenueAmount}>{DASHBOARD_STATS.revenue}</Text>
                        <View style={styles.growthBadge}>
                            <AppIcon library="Feather" name="trending-up" size={12} color="#10B981" />
                            <Text style={styles.growthText}>{DASHBOARD_STATS.revenueGrowth}</Text>
                        </View>
                    </View>
                    <View style={styles.revenueFooter}>
                        <Text style={styles.revenueFooterText}>Next payout: Oct 28 • $1,240.00</Text>
                    </View>
                </View>

                {/* 3. Secondary Stats (Bookings & Views) */}
                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={[styles.statIconBg, { backgroundColor: colors.primary + '15' }]}>
                            <AppIcon library="Feather" name="calendar" size={18} color={colors.primary} />
                        </View>
                        <Text style={[styles.statValue, { color: colors.text }]}>{DASHBOARD_STATS.bookings}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>New Bookings</Text>
                    </View>

                    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={[styles.statIconBg, { backgroundColor: '#10B98115' }]}>
                            <AppIcon library="Feather" name="eye" size={18} color="#10B981" />
                        </View>
                        <Text style={[styles.statValue, { color: colors.text }]}>{DASHBOARD_STATS.profileViews}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Profile Views</Text>
                    </View>
                </View>

                {/* 4. Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <QuickAction icon="plus-circle" label="Add Service" colors={colors} />
                    <QuickAction icon="tag" label="Create Promo" colors={colors} />
                    <QuickAction icon="bar-chart-2" label="Reports" colors={colors} />
                    <QuickAction icon="settings" label="Settings" colors={colors} />
                </View>

                {/* 5. Today's Bookings */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Bookings</Text>
                    <TouchableOpacity>
                        <Text style={[styles.viewAllText, { color: colors.primary }]}>View Calendar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bookingsContainer}>
                    {TODAYS_BOOKINGS.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} colors={colors} />
                    ))}
                </View>

                {/* 6. Recent Customers */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Customers</Text>
                    <TouchableOpacity>
                        <Text style={[styles.viewAllText, { color: colors.primary }]}>View Directory</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.customersScroll}>
                    {RECENT_CUSTOMERS.map((customer) => (
                        <View key={customer.id} style={styles.customerItem}>
                            <Image source={{ uri: customer.avatar }} style={[styles.customerAvatar, { borderColor: colors.border }]} />
                            <Text style={[styles.customerName, { color: colors.text }]} numberOfLines={1}>{customer.name}</Text>
                        </View>
                    ))}
                </ScrollView>

            </ScrollView>
        </SafeAreaView>
    );
};

// --- Sub Components ---

const QuickAction = ({ icon, label, colors }: any) => (
    <TouchableOpacity style={styles.quickActionBtn}>
        <View style={[styles.quickActionIconBg, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AppIcon library="Feather" name={icon} size={20} color={colors.text} />
        </View>
        <Text style={[styles.quickActionLabel, { color: colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
);

const BookingCard = ({ booking, colors }: any) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Upcoming': return colors.primary;
            case 'In Progress': return '#10B981';
            case 'Pending': return '#F59E0B';
            default: return colors.textSecondary;
        }
    };

    return (
        <TouchableOpacity style={[styles.bookingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.bookingTimeCol}>
                <Text style={[styles.bookingTimeText, { color: colors.text }]}>{booking.time.split(' ')[0]}</Text>
                <Text style={[styles.bookingAmPm, { color: colors.textSecondary }]}>{booking.time.split(' ')[1]}</Text>
            </View>

            <View style={[styles.bookingDivider, { backgroundColor: colors.border }]} />

            <View style={styles.bookingDetails}>
                <View style={styles.bookingHeaderRow}>
                    <Text style={[styles.bookingCustomer, { color: colors.text }]}>{booking.customerName}</Text>
                    <View style={[styles.statusPill, { backgroundColor: getStatusColor(booking.status) + '15' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>{booking.status}</Text>
                    </View>
                </View>
                <Text style={[styles.bookingService, { color: colors.textSecondary }]}>{booking.service}</Text>
            </View>

            <Image source={{ uri: booking.avatar }} style={styles.bookingAvatar} />
        </TouchableOpacity>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
    greetingText: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
    businessName: { fontSize: 20, fontWeight: '900' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    notificationBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1, borderColor: '#FFF' },
    shopAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },

    // Revenue Card
    revenueCard: { borderRadius: 20, padding: 20, marginBottom: 16, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 },
    revenueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    revenueLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    revenueBody: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 24 },
    revenueAmount: { color: '#FFF', fontSize: 36, fontWeight: '900', letterSpacing: -1 },
    growthBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4, marginBottom: 6 },
    growthText: { color: '#065F46', fontSize: 11, fontWeight: '800' },
    revenueFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 16 },
    revenueFooterText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '500' },

    // Stats Row
    statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    statBox: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1 },
    statIconBg: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    statValue: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: '600' },

    // Quick Actions
    quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
    quickActionBtn: { alignItems: 'center', width: '22%' },
    quickActionIconBg: { width: 56, height: 56, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    quickActionLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },

    // Sections
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '900' },
    viewAllText: { fontSize: 13, fontWeight: '700', marginBottom: 2 },

    // Bookings
    bookingsContainer: { gap: 12, marginBottom: 32 },
    bookingCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1 },
    bookingTimeCol: { alignItems: 'center', minWidth: 50 },
    bookingTimeText: { fontSize: 15, fontWeight: '800' },
    bookingAmPm: { fontSize: 11, fontWeight: '700' },
    bookingDivider: { width: 1, height: '100%', marginHorizontal: 12 },
    bookingDetails: { flex: 1 },
    bookingHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    bookingCustomer: { fontSize: 15, fontWeight: '800' },
    statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '800' },
    bookingService: { fontSize: 13 },
    bookingAvatar: { width: 44, height: 44, borderRadius: 22 },

    // Customers
    customersScroll: { gap: 16, paddingRight: 20 },
    customerItem: { alignItems: 'center', width: 64 },
    customerAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, marginBottom: 8 },
    customerName: { fontSize: 12, fontWeight: '600' },
});

export default BusinessDashboardScreen;