import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const MyTicketsScreen = () => {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.screenTitle, { color: colors.text }]}>My Tickets</Text>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* The Digital Ticket Card */}
                <View style={[styles.ticketCard, { backgroundColor: colors.surface }]}>
                    <View style={styles.topPart}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600' }} style={styles.ticketImg} />
                        <View style={styles.ticketDetails}>
                            <Text style={styles.ticketTitle}>Harlem Afro-Market</Text>
                            <Text style={styles.ticketInfo}>Sat, June 15 • 10:00 AM</Text>
                            <Text style={styles.ticketInfo}>Marcus Garvey Park, NY</Text>
                        </View>
                    </View>

                    {/* Dotted Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={[styles.sideHole, { backgroundColor: colors.border }]} />
                        <View style={[styles.dottedLine, { borderColor: colors.border }]} />
                        <View style={[styles.sideHole, { right: -10, backgroundColor: colors.border }]} />
                    </View>

                    <View style={styles.bottomPart}>
                        <Text style={styles.qrLabel}>SCAN AT ENTRANCE</Text>
                        <View style={[styles.qrContainer, { backgroundColor: colors.surfaceElevated }]}>
                            <AppIcon library="Feather" name="layers" size={100} color={colors.text} />
                            {/* Note: Use a real QR library in production */}
                        </View>
                        <Text style={styles.ticketId}>ID: AS-9923-4410</Text>
                    </View>
                </View>

                <TouchableOpacity style={[styles.calendarBtn, { borderColor: colors.primary }]}>
                    <AppIcon library="Feather" name="calendar" size={18} color={colors.primary} />
                    <Text style={[styles.calendarText, { color: colors.primary }]}>Add to Device Calendar</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    screenTitle: { fontSize: 24, fontWeight: '900', padding: 20 },
    ticketCard: { borderRadius: 24, overflow: 'hidden', elevation: 5 },
    topPart: { padding: 20, flexDirection: 'row', gap: 15 },
    ticketImg: { width: 70, height: 70, borderRadius: 12 },
    ticketDetails: { flex: 1 },
    ticketTitle: { fontSize: 18, fontWeight: '800', marginBottom: 5 },
    ticketInfo: { fontSize: 12, opacity: 0.7, marginBottom: 2 },
    dividerContainer: { height: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
    sideHole: { width: 20, height: 20, borderRadius: 10, position: 'absolute', left: -10 },
    dottedLine: { flex: 1, borderStyle: 'dashed', borderWidth: 1, marginHorizontal: 15 },
    bottomPart: { padding: 25, alignItems: 'center' },
    qrLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
    qrContainer: { padding: 15, borderRadius: 15 },
    ticketId: { marginTop: 15, fontSize: 12, fontWeight: '700', opacity: 0.5 },
    calendarBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 30, gap: 10 },
    calendarText: { fontWeight: '700' }
});