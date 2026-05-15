import { useTheme } from '@contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    BookingCard,
    DASHBOARD_STATS,
    DashboardHeader,
    QuickActionsRow,
    RECENT_CUSTOMERS,
    RecentCustomers,
    RevenueCard,
    SectionHeader,
    StatsRow,
    styles,
    TODAYS_BOOKINGS,
} from '../../components/business-dashboard';

const BusinessDashboardScreen = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <DashboardHeader
                colors={colors}
                onNotificationsPress={() => navigation.navigate('BusinessNotifications')}
                onProfilePress={() => navigation.navigate('ProfileStack')}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <RevenueCard colors={colors} stats={DASHBOARD_STATS} />
                <StatsRow colors={colors} stats={DASHBOARD_STATS} />
                <QuickActionsRow colors={colors} />

                <SectionHeader
                    title="Today's Bookings"
                    actionLabel="View Calendar"
                    colors={colors}
                    onActionPress={() => navigation.navigate('CalendarTab')}
                />

                <View style={styles.bookingsContainer}>
                    {TODAYS_BOOKINGS.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} colors={colors} />
                    ))}
                </View>

                <SectionHeader
                    title="Recent Customers"
                    actionLabel="View Directory"
                    colors={colors}
                    onActionPress={() => navigation.navigate('ClientsList')}
                />
                <RecentCustomers customers={RECENT_CUSTOMERS} colors={colors} />

            </ScrollView>
        </SafeAreaView>
    );
};

export default BusinessDashboardScreen;