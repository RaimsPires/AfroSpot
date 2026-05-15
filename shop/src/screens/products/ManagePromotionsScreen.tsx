import React, { useState } from 'react';
import {
    Alert,
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
const INITIAL_PROMOS = [
    {
        id: '1',
        title: 'Weekend Flash Sale',
        discountType: 'percentage',
        discountValue: 20,
        code: 'WEEKEND20',
        target: 'All Services',
        startDate: 'Oct 24, 2023',
        endDate: 'Oct 31, 2023',
        status: 'Active',
        usageCount: 14,
    },
    {
        id: '2',
        title: 'New Customer Welcome',
        discountType: 'fixed',
        discountValue: 10,
        code: 'WELCOME10',
        target: 'All Products',
        startDate: 'Sep 01, 2023',
        endDate: 'Dec 31, 2023',
        status: 'Active',
        usageCount: 89,
    },
    {
        id: '3',
        title: 'Summer Clearance',
        discountType: 'percentage',
        discountValue: 50,
        code: 'SUMMER50',
        target: 'Specific Items',
        startDate: 'Jul 01, 2023',
        endDate: 'Aug 31, 2023',
        status: 'Expired',
        usageCount: 124,
    },
    {
        id: '4',
        title: 'Holiday Special',
        discountType: 'percentage',
        discountValue: 15,
        code: 'HOLIDAY15',
        target: 'All Services',
        startDate: 'Dec 20, 2023',
        endDate: 'Jan 05, 2024',
        status: 'Paused',
        usageCount: 0,
    },
];

const FILTER_TABS = ['Active', 'Paused', 'Expired'];

const ManagePromotionsScreen = () => {
    const { colors, isDark } = useTheme();

    const [promos, setPromos] = useState(INITIAL_PROMOS);
    const [activeTab, setActiveTab] = useState('Active');

    // Filtering Logic
    const filteredPromos = promos.filter((promo) => promo.status === activeTab);

    // Handlers
    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Promotion',
            'Are you sure you want to permanently delete this promotion? Customers will no longer be able to use this code.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setPromos(promos.filter(p => p.id !== id))
                },
            ]
        );
    };

    const handleToggleStatus = (id: string, currentStatus: string) => {
        if (currentStatus === 'Expired') return; // Cannot toggle expired promos

        const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
        const actionText = currentStatus === 'Active' ? 'Pause' : 'Activate';

        Alert.alert(
            `${actionText} Promotion`,
            `Are you sure you want to ${actionText.toLowerCase()} this promotion?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: actionText,
                    onPress: () => {
                        setPromos(promos.map(p => p.id === id ? { ...p, status: newStatus } : p));
                    }
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Promotions</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* 2. Filter Tabs */}
            <View style={styles.tabsWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    {FILTER_TABS.map((tab) => {
                        const isActive = activeTab === tab;
                        const count = promos.filter(p => p.status === tab).length;

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
                                <Text style={[styles.tabPillText, { color: isActive ? '#FFF' : colors.textSecondary }]}>
                                    {tab} ({count})
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* 3. Promos List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {filteredPromos.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconBg, { backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="tag" size={32} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No {activeTab} Promos</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                            You don't have any {activeTab.toLowerCase()} promotions at the moment.
                        </Text>
                    </View>
                ) : (
                    filteredPromos.map((promo) => (
                        <View key={promo.id} style={[styles.promoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>

                            {/* Card Top: Coupon Details */}
                            <View style={styles.cardTopRow}>
                                {/* Left: Discount Value */}
                                <View style={[styles.discountCol, { borderRightColor: colors.border }]}>
                                    <Text style={[styles.discountValue, { color: colors.primary }]}>
                                        {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                                    </Text>
                                    <Text style={[styles.discountLabel, { color: colors.textSecondary }]}>OFF</Text>
                                </View>

                                {/* Right: Info */}
                                <View style={styles.infoCol}>
                                    <View style={styles.titleRow}>
                                        <Text style={[styles.promoTitle, { color: colors.text }]} numberOfLines={1}>{promo.title}</Text>
                                        {promo.code ? (
                                            <View style={[styles.codeBadge, { backgroundColor: colors.primary + '15' }]}>
                                                <Text style={[styles.codeText, { color: colors.primary }]}>{promo.code}</Text>
                                            </View>
                                        ) : null}
                                    </View>

                                    <Text style={[styles.promoTarget, { color: colors.textSecondary }]}>Applies to: {promo.target}</Text>

                                    <View style={styles.dateRow}>
                                        <AppIcon library="Feather" name="calendar" size={12} color={colors.textSecondary} />
                                        <Text style={[styles.dateText, { color: colors.textSecondary }]}>{promo.startDate} - {promo.endDate}</Text>
                                    </View>
                                </View>

                                {/* Scallop decorations for coupon effect */}
                                <View style={[styles.scallopTop, { backgroundColor: colors.background, borderColor: colors.border }]} />
                                <View style={[styles.scallopBottom, { backgroundColor: colors.background, borderColor: colors.border }]} />
                            </View>

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            {/* Card Bottom: Metrics & Actions */}
                            <View style={styles.cardBottomRow}>
                                <View style={styles.metricsCol}>
                                    <AppIcon library="Feather" name="users" size={14} color={colors.textSecondary} />
                                    <Text style={[styles.metricsText, { color: colors.textSecondary }]}>Used {promo.usageCount} times</Text>
                                </View>

                                <View style={styles.actionsCol}>
                                    {promo.status !== 'Expired' && (
                                        <TouchableOpacity
                                            style={[styles.actionBtn, { borderColor: colors.border }]}
                                            onPress={() => handleToggleStatus(promo.id, promo.status)}
                                        >
                                            <AppIcon
                                                library="Feather"
                                                name={promo.status === 'Active' ? 'pause' : 'play'}
                                                size={14}
                                                color={colors.text}
                                            />
                                            <Text style={[styles.actionBtnText, { color: colors.text }]}>
                                                {promo.status === 'Active' ? 'Pause' : 'Activate'}
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        style={[styles.deleteBtn, { backgroundColor: '#FEE2E2' }]}
                                        onPress={() => handleDelete(promo.id)}
                                    >
                                        <AppIcon library="Feather" name="trash-2" size={16} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    ))
                )}
            </ScrollView>

            {/* 4. Floating Action Button to Create New Promo */}
            <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
                <AppIcon library="Feather" name="plus" size={24} color="#FFF" />
            </TouchableOpacity>

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

    // Tabs
    tabsWrapper: { paddingTop: 16, paddingBottom: 8 },
    tabsScroll: { paddingHorizontal: 20, gap: 10 },
    tabPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    tabPillText: { fontSize: 13, fontWeight: '700' },

    // List
    listContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 },

    // Promo Card (Coupon Style)
    promoCard: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
    cardTopRow: { flexDirection: 'row', position: 'relative' },

    discountCol: { flex: 0.3, alignItems: 'center', justifyContent: 'center', padding: 16, borderRightWidth: 1, borderStyle: 'dashed' },
    discountValue: { fontSize: 24, fontWeight: '900', marginBottom: -4 },
    discountLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },

    infoCol: { flex: 0.7, padding: 16, justifyContent: 'center' },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    promoTitle: { fontSize: 15, fontWeight: '800', flex: 1, marginRight: 8 },
    codeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    codeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    promoTarget: { fontSize: 13, marginBottom: 8 },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dateText: { fontSize: 12, fontWeight: '500' },

    // Scallops for coupon visual
    scallopTop: { position: 'absolute', top: -10, left: '30%', width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderBottomWidth: 0 },
    scallopBottom: { position: 'absolute', bottom: -10, left: '30%', width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderTopWidth: 0 },

    divider: { height: 1, width: '100%' },

    cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    metricsCol: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metricsText: { fontSize: 13, fontWeight: '600' },

    actionsCol: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
    actionBtnText: { fontSize: 12, fontWeight: '700' },
    deleteBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

    // Empty State
    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },

    // FAB
    fab: { position: 'absolute', bottom: 30, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
});

export default ManagePromotionsScreen;