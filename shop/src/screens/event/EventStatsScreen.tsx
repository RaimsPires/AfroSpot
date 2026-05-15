import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export const EventStatsScreen = () => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                <Text style={[styles.headerTitle, { color: colors.text }]}>Event Insights</Text>
                <AppIcon library="Feather" name="download" size={20} color={colors.text} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Total Revenue Card */}
                <View style={[styles.mainCard, { backgroundColor: colors.primary }]}>
                    <Text style={styles.cardLabel}>TOTAL REVENUE</Text>
                    <Text style={styles.cardValue}>$12,350.00</Text>
                    <View style={styles.cardDivider} />
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardSub}>Ticket Sales: $4,200</Text>
                        <Text style={styles.cardSub}>Stall Sales: $8,150</Text>
                    </View>
                </View>

                {/* Tickets Breakdown */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Attendee Booking</Text>
                <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.statLabel, { color: colors.text }]}>General Admission</Text>
                        <Text style={[styles.statQty, { color: colors.text }]}>120 / 200</Text>
                    </View>
                    <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressFill, { width: '60%', backgroundColor: colors.primary }]} />
                    </View>
                    <Text style={styles.metaText}>60% capacity filled</Text>
                </View>

                {/* Vendor Spot Breakdown */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Vendor Stands</Text>
                <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.statLabel, { color: colors.text }]}>Food Truck Spots</Text>
                        <Text style={[styles.statQty, { color: colors.text }]}>4 / 5</Text>
                    </View>
                    <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressFill, { width: '80%', backgroundColor: '#F97316' }]} />
                    </View>
                    <Text style={styles.metaText}>1 spot remaining</Text>
                </View>

                {/* Free Event Interest (Notify me/RSVP) */}
                <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 10 }]}>
                    <View style={styles.row}>
                        <AppIcon library="Feather" name="bell" size={20} color={colors.primary} />
                        <Text style={[styles.statLabel, { color: colors.text, marginLeft: 10 }]}>Waitlist / Interested</Text>
                    </View>
                    <Text style={[styles.largeVal, { color: colors.text }]}>842 people</Text>
                    <Text style={styles.metaText}>Users who set a calendar reminder</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    content: { padding: 20 },
    mainCard: { padding: 24, borderRadius: 24, marginBottom: 24 },
    cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
    cardValue: { color: '#FFF', fontSize: 36, fontWeight: '900', marginVertical: 8 },
    cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 16 },
    cardSub: { color: '#FFF', fontSize: 13, fontWeight: '600' },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12, marginTop: 16 },
    statBox: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 12 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    row: { flexDirection: 'row', alignItems: 'center' },
    statLabel: { fontSize: 15, fontWeight: '700' },
    statQty: { fontSize: 15, fontWeight: '800' },
    progressBg: { height: 8, borderRadius: 4, width: '100%', marginBottom: 8 },
    progressFill: { height: '100%', borderRadius: 4 },
    metaText: { fontSize: 12, color: '#999', fontWeight: '600' },
    largeVal: { fontSize: 28, fontWeight: '900', marginVertical: 4 },
});