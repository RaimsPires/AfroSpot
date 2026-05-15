import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const INVOICES = [
    { id: 'INV-2023-104', date: 'Oct 24, 2023', customer: 'Marcus Johnson', amount: '$35.00', status: 'Paid' },
    { id: 'INV-2023-103', date: 'Oct 24, 2023', customer: 'Sarah Jenkins', amount: '$85.00', status: 'Pending' },
    { id: 'INV-2023-102', date: 'Oct 23, 2023', customer: 'Platform Fees (Oct)', amount: '$124.00', status: 'Deducted' },
];

export const TaxInvoiceScreen = () => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('Invoices');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}><AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Taxes & Invoices</Text>
                <TouchableOpacity style={styles.iconBtn}><AppIcon library="Feather" name="download" size={20} color={colors.text} /></TouchableOpacity>
            </View>

            <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
                <TouchableOpacity style={[styles.tab, activeTab === 'Invoices' && [styles.activeTab, { backgroundColor: colors.background }]]} onPress={() => setActiveTab('Invoices')}>
                    <Text style={[styles.tabText, { color: activeTab === 'Invoices' ? colors.text : colors.textSecondary }]}>Invoices</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, activeTab === 'Taxes' && [styles.activeTab, { backgroundColor: colors.background }]]} onPress={() => setActiveTab('Taxes')}>
                    <Text style={[styles.tabText, { color: activeTab === 'Taxes' ? colors.text : colors.textSecondary }]}>Tax Reports</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {activeTab === 'Invoices' ? (
                    INVOICES.map((inv) => (
                        <View key={inv.id} style={[styles.invoiceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={styles.invLeft}>
                                <Text style={[styles.invId, { color: colors.text }]}>{inv.id}</Text>
                                <Text style={[styles.invCustomer, { color: colors.textSecondary }]}>{inv.customer}</Text>
                                <Text style={[styles.invDate, { color: colors.textSecondary }]}>{inv.date}</Text>
                            </View>
                            <View style={styles.invRight}>
                                <Text style={[styles.invAmount, { color: colors.primary }]}>{inv.amount}</Text>
                                <Text style={[styles.invStatus, { color: inv.status === 'Paid' ? colors.success : colors.textSecondary }]}>{inv.status}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <AppIcon library="Feather" name="file-text" size={48} color={colors.textSecondary} style={{ marginBottom: 16 }} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Tax Reports Generated</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Your annual and quarterly tax summaries will appear here.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 4 },
    tabs: { flexDirection: 'row', margin: 20, borderRadius: 24, padding: 4 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
    activeTab: { elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    tabText: { fontSize: 13, fontWeight: '700' },
    content: { paddingHorizontal: 20 },
    invoiceCard: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
    invLeft: { flex: 1 },
    invId: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
    invCustomer: { fontSize: 13, marginBottom: 4 },
    invDate: { fontSize: 12 },
    invRight: { alignItems: 'flex-end', justifyContent: 'center' },
    invAmount: { fontSize: 16, fontWeight: '900', marginBottom: 6 },
    invStatus: { fontSize: 12, fontWeight: '700' },
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { textAlign: 'center', fontSize: 14, paddingHorizontal: 20 },
});