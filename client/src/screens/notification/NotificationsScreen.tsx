import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    NotificationCard,
    NotificationGroup,
    NotificationsFAB,
    NotificationsFilterTabs,
    NotificationsHeader,
    NotificationsSafetyBox,
} from '@components/notifications';
import { FILTER_TABS } from '@components/notifications/mockData';
import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';

const NotificationsScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'Notifications'>>();
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('All Activity');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <NotificationsHeader
                colors={colors}
                onSettingsPress={() => navigation.navigate('Profile')}
                onProfilePress={() => navigation.navigate('Profile')}
            />

            <NotificationsFilterTabs
                tabs={FILTER_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                colors={colors}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Bookings Section */}
                <NotificationGroup title="BOOKINGS" colors={colors}>
                    <NotificationCard
                        icon="calendar"
                        iconColor="#374151"
                        iconBg="#F3F4F6"
                        title="Appointment Confirmed"
                        time="2h ago"
                        description="Your session with Master Barber Kojo at 'The Fade Shop' is confirmed for tomorrow."
                        colors={colors}
                        onPress={() => navigation.navigate('BookingHistory')}
                        actions={
                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('BookingHistory')}
                                    style={[styles.outlineBtn, { borderColor: colors.border }]}
                                > 
                                    <Text style={[styles.outlineBtnText, { color: colors.text }]}>View Details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.outlineBtn, { borderColor: colors.border }]}>
                                    <Text style={[styles.outlineBtnText, { color: colors.text }]}>Add to Calendar</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </NotificationGroup>

                {/* Promotions & Offers Section */}
                <NotificationGroup title="PROMOTIONS & OFFERS" colors={colors}>
                    <NotificationCard
                        icon="tag"
                        iconColor={colors.primary}
                        iconBg={colors.primary + '15'}
                        title="Weekend Jollof Special!"
                        time="5h ago"
                        description="20% off all family platters at 'Mama Africa Kitchen'. Valid this Saturday and Sunday."
                        image="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=600"
                        colors={colors}
                        onPress={() =>
                            navigation.navigate('BusinessDetail', {
                                businessId: 'mama-africa-kitchen',
                                businessName: 'Mama Africa Kitchen',
                                source: 'notification-offer',
                            })
                        }
                        actions={
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ProductMarketplace', { businessId: 'mama-africa-kitchen' })}
                                style={[styles.solidBtn, { backgroundColor: colors.primary }]}
                            > 
                                <Text style={styles.solidBtnText}>Claim Offer</Text>
                            </TouchableOpacity>
                        }
                    />
                    <NotificationCard
                        icon="gift"
                        iconColor="#10B981"
                        iconBg="#D1FAE5"
                        title="New Customer Reward"
                        time="1d ago"
                        description="You've earned a $5 voucher for your next order at any participating restaurant."
                        showChevron
                        onPress={() => navigation.navigate('Saved')}
                        colors={colors}
                    />
                </NotificationGroup>

                {/* New Businesses Section */}
                <NotificationGroup title="NEW BUSINESSES" colors={colors}>
                    <NotificationCard
                        icon="home"
                        iconColor="#F59E0B"
                        iconBg="#FEF3C7"
                        title="Artisans of Accra Now Open"
                        time="2d ago"
                        description="A new authentic handicraft shop just opened 2 miles away from your current location."
                        colors={colors}
                        onPress={() =>
                            navigation.navigate('BusinessDetail', {
                                businessId: 'artisans-of-accra',
                                businessName: 'Artisans of Accra',
                                source: 'notification-new-business',
                            })
                        }
                        actions={
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate('BusinessDetail', {
                                        businessId: 'artisans-of-accra',
                                        businessName: 'Artisans of Accra',
                                        source: 'notification-new-business',
                                    })
                                }
                                style={[styles.outlineBtn, { borderColor: colors.border }]}
                            > 
                                <Text style={[styles.outlineBtnText, { color: colors.text }]}>See Shop</Text>
                            </TouchableOpacity>
                        }
                    />
                </NotificationGroup>

                <NotificationsSafetyBox />
            </ScrollView>

            <NotificationsFAB colors={colors} onPress={() => navigation.navigate('BookingHistory')} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 120 },
    actionRow: { flexDirection: 'row', gap: 12 },
    outlineBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    outlineBtnText: { fontSize: 13, fontWeight: '700' },
    solidBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    solidBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
});

export default NotificationsScreen;