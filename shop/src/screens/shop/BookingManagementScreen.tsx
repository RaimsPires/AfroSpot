import React, { useState } from 'react';
import {
    Alert,
    Image,
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
const MOCK_BOOKINGS = [
    {
        id: 'b1',
        customerName: 'Marcus Johnson',
        avatar: 'https://i.pravatar.cc/150?img=11',
        service: 'Fresh Fade & Lineup',
        date: 'Oct 24, 2023',
        time: '10:30 AM',
        price: '$35.00',
        status: 'Pending',
    },
    {
        id: 'b2',
        customerName: 'Sarah Jenkins',
        avatar: 'https://i.pravatar.cc/150?img=5',
        service: 'Braiding & Styling',
        date: 'Oct 24, 2023',
        time: '01:15 PM',
        price: '$85.00',
        status: 'Pending',
    },
    {
        id: 'b3',
        customerName: 'David Osei',
        avatar: 'https://i.pravatar.cc/150?img=8',
        service: 'Beard Grooming',
        date: 'Oct 24, 2023',
        time: '03:00 PM',
        price: '$25.00',
        status: 'Confirmed',
    },
    {
        id: 'b4',
        customerName: 'Nia Adeleke',
        avatar: 'https://i.pravatar.cc/150?img=9',
        service: 'Silk Press',
        date: 'Oct 25, 2023',
        time: '11:00 AM',
        price: '$60.00',
        status: 'Confirmed',
    },
];

const CALENDAR_DAYS = [
    { day: 'Mon', date: '23' },
    { day: 'Tue', date: '24' },
    { day: 'Wed', date: '25' },
    { day: 'Thu', date: '26' },
    { day: 'Fri', date: '27' },
    { day: 'Sat', date: '28' },
    { day: 'Sun', date: '29' },
];

const ManageBookingsScreen = () => {
    const { colors, isDark } = useTheme();

    const [bookings, setBookings] = useState(MOCK_BOOKINGS);
    const [activeTab, setActiveTab] = useState<'Pending' | 'Confirmed'>('Pending');
    const [viewMode, setViewMode] = useState<'List' | 'Calendar'>('List');
    const [selectedDate, setSelectedDate] = useState('24'); // Default selected day

    // Handlers
    const handleAccept = (id: string) => {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Confirmed' } : b));
    };

    const handleReject = (id: string) => {
        Alert.alert(
            'Reject Booking',
            'Are you sure you want to decline this appointment request?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: () => setBookings(bookings.filter(b => b.id !== id))
                },
            ]
        );
    };

    // Filtering Logic
    const pendingCount = bookings.filter(b => b.status === 'Pending').length;

    let displayedBookings = bookings;
    if (viewMode === 'List') {
        displayedBookings = bookings.filter(b => b.status === activeTab);
    } else {
        // In calendar mode, filter by date (mock logic uses the "date" string matching the day number)
        displayedBookings = bookings.filter(b => b.date.includes(selectedDate));
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Bookings</Text>
                <TouchableOpacity
                    style={[styles.viewToggleBtn, { backgroundColor: colors.surface }]}
                    onPress={() => setViewMode(viewMode === 'List' ? 'Calendar' : 'List')}
                >
                    <AppIcon
                        library="Feather"
                        name={viewMode === 'List' ? 'calendar' : 'list'}
                        size={20}
                        color={colors.text}
                    />
                </TouchableOpacity>
            </View>

            {/* 2. Controls Area (Tabs or Calendar Strip) */}
            <View style={styles.controlsContainer}>
                {viewMode === 'List' ? (
                    <View style={[styles.tabsContainer, { backgroundColor: colors.surface }]}>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === 'Pending' && [styles.activeTabBtn, { backgroundColor: colors.background, shadowColor: colors.text }]]}
                            onPress={() => setActiveTab('Pending')}
                        >
                            <Text style={[styles.tabText, { color: activeTab === 'Pending' ? colors.text : colors.textSecondary }]}>
                                Pending Requests
                            </Text>
                            {pendingCount > 0 && (
                                <View style={[styles.badge, { backgroundColor: colors.destructive }]}>
                                    <Text style={[styles.badgeText, { color: colors.textInverse }]}>{pendingCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === 'Confirmed' && [styles.activeTabBtn, { backgroundColor: colors.background, shadowColor: colors.text }]]}
                            onPress={() => setActiveTab('Confirmed')}
                        >
                            <Text style={[styles.tabText, { color: activeTab === 'Confirmed' ? colors.text : colors.textSecondary }]}>
                                Confirmed
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.calendarContainer}>
                        <View style={styles.calendarHeader}>
                            <Text style={[styles.monthText, { color: colors.text }]}>October 2023</Text>
                            <View style={styles.calendarNav}>
                                <TouchableOpacity style={styles.calNavBtn}><AppIcon library="Feather" name="chevron-left" size={18} color={colors.text} /></TouchableOpacity>
                                <TouchableOpacity style={styles.calNavBtn}><AppIcon library="Feather" name="chevron-right" size={18} color={colors.text} /></TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
                            {CALENDAR_DAYS.map((d) => {
                                const isActive = selectedDate === d.date;
                                return (
                                    <TouchableOpacity
                                        key={d.date}
                                        onPress={() => setSelectedDate(d.date)}
                                        style={[
                                            styles.datePill,
                                            {
                                                backgroundColor: isActive ? colors.primary : colors.surface,
                                                borderColor: isActive ? colors.primary : colors.border
                                            }
                                        ]}
                                    >
                                        <Text style={[styles.dateDay, { color: isActive ? colors.textInverse : colors.textSecondary }]}>{d.day}</Text>
                                        <Text style={[styles.dateNum, { color: isActive ? colors.textInverse : colors.text }]}>{d.date}</Text>
                                        {/* Tiny dot indicator for days with bookings */}
                                        <View style={[styles.bookingIndicator, { backgroundColor: isActive ? colors.textInverse : colors.primary, opacity: d.date === '24' || d.date === '25' ? 1 : 0 }]} />
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* 3. Bookings List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {displayedBookings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconBg, { backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="calendar" size={32} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Bookings</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                            You don't have any {activeTab.toLowerCase()} bookings for this selection.
                        </Text>
                    </View>
                ) : (
                    displayedBookings.map((booking) => (
                        <View key={booking.id} style={[styles.bookingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>

                            <View style={styles.cardHeader}>
                                <View style={styles.customerInfo}>
                                    <Image source={{ uri: booking.avatar }} style={styles.avatar} />
                                    <View>
                                        <Text style={[styles.customerName, { color: colors.text }]}>{booking.customerName}</Text>
                                        <Text style={[styles.serviceName, { color: colors.textSecondary }]}>{booking.service}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.priceText, { color: colors.primary }]}>{booking.price}</Text>
                            </View>

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            <View style={styles.scheduleRow}>
                                <View style={styles.scheduleItem}>
                                    <AppIcon library="Feather" name="calendar" size={14} color={colors.textSecondary} />
                                    <Text style={[styles.scheduleText, { color: colors.textSecondary }]}>{booking.date}</Text>
                                </View>
                                <View style={styles.scheduleItem}>
                                    <AppIcon library="Feather" name="clock" size={14} color={colors.textSecondary} />
                                    <Text style={[styles.scheduleText, { color: colors.textSecondary }]}>{booking.time}</Text>
                                </View>
                            </View>

                            {/* Actions depending on status */}
                            {booking.status === 'Pending' ? (
                                <View style={styles.actionsRow}>
                                    <TouchableOpacity
                                        style={[styles.rejectBtn, { borderColor: colors.destructive }]}
                                        onPress={() => handleReject(booking.id)}
                                    >
                                        <Text style={[styles.rejectText, { color: colors.destructive }]}>Decline</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.acceptBtn, { backgroundColor: colors.success }]}
                                        onPress={() => handleAccept(booking.id)}
                                    >
                                        <Text style={[styles.acceptText, { color: colors.textInverse }]}>Accept Booking</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.actionsRow}>
                                    <TouchableOpacity style={[styles.actionOutlineBtn, { borderColor: colors.border }]}>
                                        <AppIcon library="Feather" name="message-circle" size={16} color={colors.text} />
                                        <Text style={[styles.actionOutlineText, { color: colors.text }]}>Message</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionSolidBtn, { backgroundColor: colors.primary }]}>
                                        <Text style={[styles.actionSolidText, { color: colors.textInverse }]}>Mark Completed</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </View>
                    ))
                )}
            </ScrollView>
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
    viewToggleBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

    // Controls
    controlsContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },

    // Tabs (List View)
    tabsContainer: { flexDirection: 'row', borderRadius: 24, padding: 4 },
    tabBtn: { flex: 1, flexDirection: 'row', paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
    activeTabBtn: { elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    tabText: { fontSize: 13, fontWeight: '700' },
    badge: { borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
    badgeText: { fontSize: 10, fontWeight: '800' },

    // Calendar Strip (Calendar View)
    calendarContainer: { paddingBottom: 8 },
    calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    monthText: { fontSize: 16, fontWeight: '800' },
    calendarNav: { flexDirection: 'row', gap: 12 },
    calNavBtn: { padding: 4 },
    calendarScroll: { gap: 10, paddingRight: 20 },
    datePill: { width: 56, height: 72, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    dateDay: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
    dateNum: { fontSize: 18, fontWeight: '800' },
    bookingIndicator: { width: 4, height: 4, borderRadius: 2, position: 'absolute', bottom: 8 },

    // List
    listContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },

    bookingCard: { borderRadius: 16, borderWidth: 1, marginBottom: 16, padding: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    customerInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
    customerName: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
    serviceName: { fontSize: 13, fontWeight: '500' },
    priceText: { fontSize: 16, fontWeight: '900' },

    divider: { height: 1, width: '100%', marginVertical: 12 },

    scheduleRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
    scheduleItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    scheduleText: { fontSize: 13, fontWeight: '600' },

    // Actions
    actionsRow: { flexDirection: 'row', gap: 12 },

    rejectBtn: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    rejectText: { fontSize: 14, fontWeight: '700' },
    acceptBtn: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    acceptText: { fontSize: 14, fontWeight: '700' },

    actionOutlineBtn: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
    actionOutlineText: { fontSize: 14, fontWeight: '700' },
    actionSolidBtn: { flex: 1.5, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    actionSolidText: { fontSize: 14, fontWeight: '700' },

    // Empty State
    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    emptyIconBg: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

export default ManageBookingsScreen;