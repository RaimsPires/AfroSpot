import React from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

export const BusinessProfileScreen = () => {
    const { colors, isDark, toggleTheme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Menu</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Business Header Info */}
                <View style={styles.profileHeader}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200' }} style={styles.businessAvatar} />
                    <View style={styles.businessInfo}>
                        <Text style={[styles.businessName, { color: colors.text }]}>Kushite Cutz & Styles</Text>
                        <Text style={[styles.businessEmail, { color: colors.textSecondary }]}>admin@kushitecutz.com</Text>
                        <View style={styles.ratingRow}>
                            <AppIcon library="FontAwesome" name="star" size={14} color="#F59E0B" />
                            <Text style={[styles.ratingText, { color: colors.text }]}>4.8 (128 Reviews)</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.viewProfileBtn, { backgroundColor: colors.primary + '15' }]}>
                        <AppIcon library="Feather" name="external-link" size={18} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Section 1: Store Management */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>STORE MANAGEMENT</Text>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MenuItem icon="layout" label="Manage Profile & Hours" colors={colors} />
                        <MenuItem icon="scissors" label="Manage Services" colors={colors} />
                        <MenuItem icon="package" label="Manage Products" colors={colors} />
                        <MenuItem icon="users" label="Manage Staff" colors={colors} isLast />
                    </View>
                </View>

                {/* Section 2: Marketing & Sales */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>MARKETING & SALES</Text>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MenuItem icon="tag" label="Promotions & Discounts" colors={colors} />
                        <MenuItem icon="star" label="Customer Reviews" colors={colors} isLast />
                    </View>
                </View>

                {/* Section 3: Finance */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>FINANCE</Text>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MenuItem icon="dollar-sign" label="Payouts & Earnings" value="$1,240 Pending" colors={colors} />
                        <MenuItem icon="file-text" label="Taxes & Invoices" colors={colors} isLast />
                    </View>
                </View>

                {/* Section 4: App Preferences */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APP PREFERENCES</Text>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MenuItem icon="bell" label="Notification Settings" colors={colors} />
                        <MenuItem
                            icon={isDark ? "moon" : "sun"}
                            label="Dark Theme"
                            colors={colors}
                            isLast
                            rightElement={
                                <Switch
                                    value={isDark}
                                    onValueChange={toggleTheme}
                                    trackColor={{ false: '#D1D5DB', true: colors.primary + '80' }}
                                    thumbColor={isDark ? colors.primary : '#FFF'}
                                />
                            }
                        />
                    </View>
                </View>

                {/* Support & Logout */}
                <View style={styles.section}>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MenuItem icon="help-circle" label="Merchant Support" colors={colors} />
                        <MenuItem icon="log-out" label="Log Out" colorOverride="#EF4444" colors={colors} isLast />
                    </View>
                </View>

                <Text style={[styles.appVersion, { color: colors.textSecondary }]}>AfroSpot Business v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- Reusable Menu Item ---
const MenuItem = ({ icon, label, value, isLast, rightElement, colorOverride, colors }: any) => (
    <TouchableOpacity
        style={[styles.itemContainer, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
        disabled={!!rightElement}
    >
        <View style={styles.itemLeft}>
            <View style={[styles.iconBg, { backgroundColor: colorOverride ? colorOverride + '15' : colors.primary + '15' }]}>
                <AppIcon library="Feather" name={icon} size={18} color={colorOverride || colors.primary} />
            </View>
            <Text style={[styles.itemLabel, { color: colorOverride || colors.text }]}>{label}</Text>
        </View>
        <View style={styles.itemRight}>
            {value && <Text style={[styles.itemValue, { color: colors.textSecondary }]}>{value}</Text>}
            {rightElement ? rightElement : <AppIcon library="Feather" name="chevron-right" size={20} color={colors.textSecondary} />}
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingVertical: 16 },
    headerTitle: { fontSize: 24, fontWeight: '900' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },

    // Profile Header
    profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, marginTop: 8 },
    businessAvatar: { width: 72, height: 72, borderRadius: 16, marginRight: 16 },
    businessInfo: { flex: 1 },
    businessName: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
    businessEmail: { fontSize: 13, marginBottom: 8 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    ratingText: { fontSize: 13, fontWeight: '600' },
    viewProfileBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

    // Sections
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, marginLeft: 16, marginBottom: 8 },
    card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },

    // Menu Items
    itemContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 },
    itemLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBg: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    itemLabel: { fontSize: 15, fontWeight: '600' },
    itemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    itemValue: { fontSize: 13, fontWeight: '600' },

    appVersion: { textAlign: 'center', marginTop: 16, marginBottom: 32, fontSize: 12, fontWeight: '500' },
});