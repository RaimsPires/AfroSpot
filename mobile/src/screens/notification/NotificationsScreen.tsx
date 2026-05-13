import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';


const FILTER_TABS = ['All Activity', 'Unread', 'Bookings', 'Deals'];

const NotificationsScreen = () => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('All Activity');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="settings" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: 'https://i.pravatar.cc/150?img=47' }} style={styles.avatar} />
                        <View style={styles.onlineDot} />
                    </View>
                </View>
            </View>

            {/* 2. Filter Tabs */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    {FILTER_TABS.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                style={[
                                    styles.tabPill,
                                    {
                                        backgroundColor: isActive ? colors.primary : colors.background,
                                        borderColor: isActive ? colors.primary : colors.border,
                                    },
                                ]}
                            >
                                <Text style={[styles.tabPillText, { color: isActive ? '#FFF' : colors.textSecondary }]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 3. BOOKINGS Section */}
                <NotificationGroup title="BOOKINGS" colors={colors}>
                    <NotificationCard
                        icon="calendar"
                        iconColor="#374151"
                        iconBg="#F3F4F6"
                        title="Appointment Confirmed"
                        time="2h ago"
                        description="Your session with Master Barber Kojo at 'The Fade Shop' is confirmed for tomorrow."
                        colors={colors}
                        actions={
                            <View style={styles.actionRow}>
                                <TouchableOpacity style={[styles.outlineBtn, { borderColor: colors.border }]}>
                                    <Text style={[styles.outlineBtnText, { color: colors.text }]}>View Details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.outlineBtn, { borderColor: colors.border }]}>
                                    <Text style={[styles.outlineBtnText, { color: colors.text }]}>Add to Calendar</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </NotificationGroup>

                {/* 4. PROMOTIONS & OFFERS Section */}
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
                        actions={
                            <TouchableOpacity style={[styles.solidBtn, { backgroundColor: colors.primary }]}>
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
                        colors={colors}
                    />
                </NotificationGroup>

                {/* 5. NEW BUSINESSES Section */}
                <NotificationGroup title="NEW BUSINESSES" colors={colors}>
                    <NotificationCard
                        icon="home"
                        iconColor="#F59E0B"
                        iconBg="#FEF3C7"
                        title="Artisans of Accra Now Open"
                        time="2d ago"
                        description="A new authentic handicraft shop just opened 2 miles away from your current location."
                        colors={colors}
                        actions={
                            <TouchableOpacity style={[styles.outlineBtn, { borderColor: colors.border }]}>
                                <Text style={[styles.outlineBtnText, { color: colors.text }]}>See Shop</Text>
                            </TouchableOpacity>
                        }
                    />
                </NotificationGroup>

                {/* 6. Safety Alert Box */}
                <View style={styles.safetyBox}>
                    <View style={styles.safetyIconBg}>
                        <AppIcon library="Feather" name="check-circle" size={18} color="#FFF" />
                    </View>
                    <View style={styles.safetyContent}>
                        <Text style={styles.safetyTitle}>Safety First!</Text>
                        <Text style={styles.safetyDesc}>
                            Only pay through AfroSpot for secure bookings. We'll never ask for your password via notification.
                        </Text>
                    </View>
                </View>

            </ScrollView>

            {/* 7. Floating Action Button (Mark All Read) */}
            <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
                <AppIcon library="Feather" name="check-circle" size={24} color="#FFF" />
            </TouchableOpacity>

            {/* 8. Bottom Navigation */}
            <View style={[styles.bottomNav, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <NavTab icon="home" label="Home" colors={colors} />
                <NavTab icon="compass" label="Explore" colors={colors} />
                <NavTab icon="map" label="Map" colors={colors} />
                <NavTab icon="heart" label="Favorites" colors={colors} />
                <NavTab icon="bell" label="Alerts" active badge={9} colors={colors} />
            </View>
        </SafeAreaView>
    );
};

// --- Sub Components ---

const NotificationGroup = ({ title, children, colors }: any) => (
    <View style={styles.groupContainer}>
        <View style={styles.groupHeader}>
            <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>{title}</Text>
            <TouchableOpacity>
                <Text style={[styles.markReadText, { color: colors.primary }]}>Mark read</Text>
            </TouchableOpacity>
        </View>
        {children}
    </View>
);

const NotificationCard = ({ icon, iconColor, iconBg, title, time, description, image, actions, showChevron, colors }: any) => (
    <View style={[styles.cardContainer, { borderBottomColor: colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <AppIcon library="Feather" name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
                <View style={styles.timeRow}>
                    <AppIcon library="Feather" name="clock" size={10} color={colors.textSecondary} />
                    <Text style={[styles.cardTime, { color: colors.textSecondary }]}> {time}</Text>
                </View>
            </View>
            <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{description}</Text>

            {image && (
                <Image source={{ uri: image }} style={styles.cardImage} />
            )}

            {actions && (
                <View style={styles.actionsContainer}>
                    {actions}
                </View>
            )}
        </View>
        {showChevron && (
            <View style={styles.chevronContainer}>
                <AppIcon library="Feather" name="chevron-right" size={18} color={colors.textSecondary} />
            </View>
        )}
    </View>
);

const NavTab = ({ icon, label, active, badge, colors }: any) => (
    <TouchableOpacity style={styles.navTab}>
        <View>
            <AppIcon library="Feather" name={icon} size={24} color={active ? colors.primary : colors.textSecondary} />
            {badge && (
                <View style={styles.navBadge}>
                    <Text style={styles.navBadgeText}>{badge}</Text>
                </View>
            )}
        </View>
        <Text style={[styles.navLabel, { color: active ? colors.primary : colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
);

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
    headerTitle: { fontSize: 22, fontWeight: '900' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    iconBtn: { padding: 4 },
    avatarContainer: { position: 'relative' },
    avatar: { width: 36, height: 36, borderRadius: 18 },
    onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFF' },

    // Tabs
    tabsContainer: { marginBottom: 8 },
    tabsScroll: { paddingHorizontal: 20, gap: 10, paddingBottom: 12 },
    tabPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    tabPillText: { fontSize: 13, fontWeight: '700' },

    scrollContent: { paddingBottom: 120 },

    // Notification Group
    groupContainer: { marginBottom: 24 },
    groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
    groupTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    markReadText: { fontSize: 12, fontWeight: '700' },

    // Notification Card
    cardContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
    iconContainer: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    cardContent: { flex: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    cardTitle: { fontSize: 15, fontWeight: '800', flex: 1, paddingRight: 8 },
    timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    cardTime: { fontSize: 11, fontWeight: '600' },
    cardDesc: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
    cardImage: { width: '100%', height: 120, borderRadius: 12, marginTop: 8, marginBottom: 12 },
    actionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
    chevronContainer: { paddingLeft: 12, justifyContent: 'center' },

    // Action Buttons
    actionRow: { flexDirection: 'row', gap: 12 },
    outlineBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    outlineBtnText: { fontSize: 13, fontWeight: '700' },
    solidBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    solidBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

    // Safety Box
    safetyBox: { flexDirection: 'row', backgroundColor: '#D1FAE5', marginHorizontal: 20, padding: 16, borderRadius: 16, marginBottom: 24, alignItems: 'flex-start' },
    safetyIconBg: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    safetyContent: { flex: 1 },
    safetyTitle: { fontSize: 14, fontWeight: '800', color: '#065F46', marginBottom: 4 },
    safetyDesc: { fontSize: 13, color: '#065F46', lineHeight: 18 },

    // FAB
    fab: { position: 'absolute', bottom: 100, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },

    // Bottom Nav
    bottomNav: { flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%', borderTopWidth: 1, paddingBottom: 30, paddingTop: 12, paddingHorizontal: 10, zIndex: 20 },
    navTab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
    navLabel: { fontSize: 10, fontWeight: '700' },
    navBadge: { position: 'absolute', top: -4, right: -6, backgroundColor: '#EF4444', minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFF' },
    navBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
});

export default NotificationsScreen;