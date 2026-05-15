import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STAND_TYPES = [
    { id: '1', name: 'Standard Stall (10x10)', price: 150, available: 12, desc: 'Outdoor grass area, bring your own tent.' },
    { id: '2', name: 'Food/Truck Spot', price: 250, available: 4, desc: 'Electricity access included. Concrete level ground.' },
    { id: '3', name: 'Premium Indoor Booth', price: 400, available: 0, desc: 'Heated indoor area with table & chairs provided.' },
];

export const VendorBookingScreen = () => {
    const { colors, isDark } = useTheme();
    const [selectedStand, setSelectedStand] = useState<string | null>(null);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity><AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Book Vendor Spot</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Stand Type</Text>

                {STAND_TYPES.map((stand) => {
                    const isSelected = selectedStand === stand.id;
                    const isSoldOut = stand.available === 0;

                    return (
                        <TouchableOpacity
                            key={stand.id}
                            disabled={isSoldOut}
                            onPress={() => setSelectedStand(stand.id)}
                            style={[
                                styles.standCard,
                                { backgroundColor: colors.surface, borderColor: isSelected ? colors.primary : colors.border, opacity: isSoldOut ? 0.6 : 1 }
                            ]}
                        >
                            <View style={styles.standHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.standName, { color: colors.text }]}>{stand.name}</Text>
                                    <Text style={[styles.standPrice, { color: colors.primary }]}>${stand.price}</Text>
                                </View>
                                {isSelected && <AppIcon library="Feather" name="check-circle" size={24} color={colors.primary} />}
                                {isSoldOut && <View style={styles.soldOutBadge}><Text style={styles.soldOutText}>SOLD OUT</Text></View>}
                            </View>
                            <Text style={[styles.standDesc, { color: colors.textSecondary }]}>{stand.desc}</Text>
                            <View style={styles.availableRow}>
                                <Text style={[styles.availableText, { color: stand.available < 5 ? '#EF4444' : colors.textSecondary }]}>
                                    {isSoldOut ? 'No spots left' : `${stand.available} spots left`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.mainBtn, { backgroundColor: selectedStand ? colors.primary : colors.border }]}
                    disabled={!selectedStand}
                >
                    <Text style={styles.mainBtnText}>Reserve Stand</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    scrollContent: { padding: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '900', marginBottom: 20 },
    standCard: { padding: 20, borderRadius: 20, borderWidth: 2, marginBottom: 16 },
    standHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    standName: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    standPrice: { fontSize: 18, fontWeight: '900' },
    standDesc: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
    soldOutBadge: { backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    soldOutText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
    availableText: { fontSize: 12, fontWeight: '700' },
    footer: { padding: 20, borderTopWidth: 1, paddingBottom: 34 },
    mainBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    mainBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});