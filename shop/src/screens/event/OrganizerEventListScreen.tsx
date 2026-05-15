import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_EVENTS = [
    { id: '1', title: 'Harlem Afro-Market', date: 'June 15, 2024', revenue: '$4,250', ticketSales: 120, stallSales: 15, status: 'Upcoming' },
    { id: '2', title: 'Summer Food Fest', date: 'May 02, 2024', revenue: '$8,100', ticketSales: 450, stallSales: 30, status: 'Past' },
];

export const OrganizerEventListScreen = () => {
    const { colors, isDark } = useTheme();
    const [filter, setFilter] = useState<'Upcoming' | 'Past'>('Upcoming');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>My Events</Text>
                <TouchableOpacity style={[styles.addCircle, { backgroundColor: colors.primary }]}>
                    <AppIcon library="Feather" name="plus" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
                {['Upcoming', 'Past'].map((t) => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => setFilter(t as any)}
                        style={[styles.tab, filter === t && [styles.activeTab, { backgroundColor: colors.background }]]}
                    >
                        <Text style={[styles.tabText, { color: filter === t ? colors.text : colors.textSecondary }]}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {MOCK_EVENTS.filter(e => e.status === filter).map(event => (
                    <TouchableOpacity key={event.id} style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.eventInfo}>
                            <Text style={[styles.eventDate, { color: colors.primary }]}>{event.date}</Text>
                            <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statVal, { color: colors.text }]}>{event.ticketSales}</Text>
                                    <Text style={styles.statLab}>Tickets</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statVal, { color: colors.text }]}>{event.stallSales}</Text>
                                    <Text style={styles.statLab}>Stalls</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statVal, { color: colors.text }]}>{event.revenue}</Text>
                                    <Text style={styles.statLab}>Revenue</Text>
                                </View>
                            </View>
                        </View>
                        <AppIcon library="Feather" name="chevron-right" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: '900' },
    addCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    tabs: { flexDirection: 'row', marginHorizontal: 20, padding: 4, borderRadius: 25, marginBottom: 20 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 22 },
    activeTab: { elevation: 2 },
    tabText: { fontSize: 14, fontWeight: '700' },
    eventCard: { padding: 16, borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    eventInfo: { flex: 1 },
    eventDate: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 },
    eventTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
    statsRow: { flexDirection: 'row', gap: 20 },
    statItem: { alignItems: 'center' },
    statVal: { fontSize: 14, fontWeight: '800' },
    statLab: { fontSize: 10, color: '#999' },
});