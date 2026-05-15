import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAYOUT_HISTORY = [
    { id: '1', date: 'Oct 21, 2023', amount: '$1,240.00', status: 'Completed', method: 'Bank Transfer ending in 4432' },
    { id: '2', date: 'Oct 14, 2023', amount: '$980.50', status: 'Completed', method: 'Bank Transfer ending in 4432' },
    { id: '3', date: 'Oct 07, 2023', amount: '$1,105.00', status: 'Completed', method: 'Mobile Money (+234***)' },
];

export const PayoutsEarningsScreen = () => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}><AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Earnings & Payouts</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Balances */}
                <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
                    <Text style={styles.balanceLabel}>AVAILABLE FOR PAYOUT</Text>
                    <Text style={styles.balanceAmount}>$450.00</Text>
                    <TouchableOpacity style={styles.withdrawBtn}>
                        <Text style={[styles.withdrawText, { color: colors.primary }]}>Withdraw Funds</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending Clearance</Text>
                        <Text style={[styles.statValue, { color: colors.text }]}>$120.00</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Lifetime Earnings</Text>
                        <Text style={[styles.statValue, { color: colors.text }]}>$24,500</Text>
                    </View>
                </View>

                {/* History */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Payouts</Text>
                <View style={[styles.historyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {PAYOUT_HISTORY.map((item, index) => (
                        <View key={item.id} style={[styles.historyRow, index !== PAYOUT_HISTORY.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                            <View style={[styles.iconBg, { backgroundColor: colors.primary + '15' }]}>
                                <AppIcon library="Feather" name="arrow-down-left" size={18} color={colors.primary} />
                            </View>
                            <View style={styles.historyInfo}>
                                <Text style={[styles.historyAmount, { color: colors.text }]}>{item.amount}</Text>
                                <Text style={[styles.historyMethod, { color: colors.textSecondary }]}>{item.method}</Text>
                            </View>
                            <View style={styles.historyStatus}>
                                <Text style={[styles.historyDate, { color: colors.textSecondary }]}>{item.date}</Text>
                                <Text style={[styles.statusBadge, { color: '#10B981', backgroundColor: '#D1FAE5' }]}>{item.status}</Text>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 4 },
    content: { padding: 20 },
    balanceCard: { padding: 24, borderRadius: 20, alignItems: 'center', marginBottom: 16 },
    balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
    balanceAmount: { color: '#FFF', fontSize: 40, fontWeight: '900', marginBottom: 20 },
    withdrawBtn: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
    withdrawText: { fontSize: 15, fontWeight: '800' },
    statsRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
    statBox: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1 },
    statLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
    statValue: { fontSize: 20, fontWeight: '800' },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
    historyContainer: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    historyRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    iconBg: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    historyInfo: { flex: 1 },
    historyAmount: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    historyMethod: { fontSize: 12 },
    historyStatus: { alignItems: 'flex-end' },
    historyDate: { fontSize: 12, marginBottom: 6 },
    statusBadge: { fontSize: 10, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, overflow: 'hidden' },
});