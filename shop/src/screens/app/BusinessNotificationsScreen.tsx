import React, { useState } from 'react';
import {
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
const FILTER_TABS = ['All', 'Bookings', 'Reviews', 'System'];

export const BusinessNotificationsScreen = () => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('All');

    // Derive icon colors from theme at render time
    const NOTIFICATIONS_THEMED = [
        { id: '1', type: 'Bookings', title: 'New Booking Request', message: 'Marcus Johnson requested a Fresh Fade & Lineup for Tomorrow at 10:30 AM.', time: '10m ago', icon: 'calendar', isUnread: true, action: 'Review Request', iconColor: colors.info, iconBg: colors.infoSurface },
        { id: '2', type: 'System', title: 'Low Stock Alert', message: 'Shea Butter Luxe is out of stock. Update your inventory to keep selling.', time: '1h ago', icon: 'alert-triangle', isUnread: true, action: 'Update Inventory', iconColor: colors.destructive, iconBg: colors.destructiveSurface },
        { id: '3', type: 'Reviews', title: 'New 5-Star Review!', message: 'Sarah Jenkins left a positive review for your service. Take a moment to reply.', time: '2h ago', icon: 'star', isUnread: false, action: 'Reply to Review', iconColor: colors.warning, iconBg: colors.warningSurface },
        { id: '4', type: 'System', title: 'Payout Initiated', message: 'Your weekly payout of $1,240.00 has been processed and is on its way to your bank.', time: 'Yesterday', icon: 'dollar-sign', isUnread: false, iconColor: colors.success, iconBg: colors.successSurface },
    ];
    const filteredNotifications = NOTIFICATIONS_THEMED.filter(n => activeTab === 'All' || n.type === activeTab);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="check-square" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsWrapper}>
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
                </ScrollView>
            </View>

            {/* Notifications List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {filteredNotifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <AppIcon library="Feather" name="bell-off" size={48} color={colors.textSecondary} style={{ marginBottom: 16 }} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>All Caught Up!</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>You have no new {activeTab.toLowerCase()} notifications.</Text>
                    </View>
                ) : (
                    filteredNotifications.map((notif) => (
                        <TouchableOpacity
                            key={notif.id}
                            style={[
                                styles.notifCard,
                                { backgroundColor: notif.isUnread ? colors.primary + '0A' : colors.background, borderBottomColor: colors.border }
                            ]}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: notif.iconBg }]}>
                                <AppIcon library="Feather" name={notif.icon} size={20} color={notif.iconColor} />
                            </View>
                            <View style={styles.notifContent}>
                                <View style={styles.notifHeaderRow}>
                                    <Text style={[styles.notifTitle, { color: colors.text }]}>{notif.title}</Text>
                                    <Text style={[styles.notifTime, { color: colors.textSecondary }]}>{notif.time}</Text>
                                </View>
                                <Text style={[styles.notifMessage, { color: colors.textSecondary }]}>{notif.message}</Text>

                                {notif.action && (
                                    <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                                        <Text style={[styles.actionBtnText, { color: colors.primary }]}>{notif.action}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            {notif.isUnread && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 22, fontWeight: '900' },
    iconBtn: { padding: 8 },

    tabsWrapper: { paddingVertical: 12 },
    tabsScroll: { paddingHorizontal: 20, gap: 10 },
    tabPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    tabPillText: { fontSize: 13, fontWeight: '700' },

    listContent: { paddingBottom: 40 },
    notifCard: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, position: 'relative' },
    iconContainer: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 16, marginTop: 4 },
    notifContent: { flex: 1, paddingRight: 16 },
    notifHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    notifTitle: { fontSize: 15, fontWeight: '800', flex: 1 },
    notifTime: { fontSize: 12, fontWeight: '600' },
    notifMessage: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
    actionBtn: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
    actionBtnText: { fontSize: 13, fontWeight: '700' },
    unreadDot: { position: 'absolute', top: 24, right: 16, width: 8, height: 8, borderRadius: 4 },

    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
    emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center' },
});