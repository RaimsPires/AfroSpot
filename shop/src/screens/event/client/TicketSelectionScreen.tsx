import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const TicketSelectionScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [qty, setQty] = useState(1);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Select Tickets</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={[styles.eventTitle, { color: colors.text }]}>Harlem Afro-Market 2024</Text>

                <View style={[styles.tierCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={[styles.tierName, { color: colors.text }]}>General Admission</Text>
                            <Text style={[styles.tierPrice, { color: colors.primary }]}>$15.00</Text>
                        </View>
                        <View style={styles.stepper}>
                            <TouchableOpacity onPress={() => qty > 0 && setQty(qty - 1)} style={[styles.stepBtn, { borderColor: colors.border }]}>
                                <AppIcon library="Feather" name="minus" size={18} color={colors.text} />
                            </TouchableOpacity>
                            <Text style={[styles.qtyText, { color: colors.text }]}>{qty}</Text>
                            <TouchableOpacity onPress={() => setQty(qty + 1)} style={[styles.stepBtn, { borderColor: colors.border }]}>
                                <AppIcon library="Feather" name="plus" size={18} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <AppIcon library="Feather" name="info" size={16} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>Tickets are non-refundable 24 hours before the event.</Text>
                </View>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <View style={styles.rowBetween}>
                    <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total ({qty} tickets)</Text>
                    <Text style={[styles.totalPrice, { color: colors.text }]}>${(qty * 15).toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={[styles.payBtn, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.payText, { color: colors.textInverse }]}>Continue to Payment</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    eventTitle: { fontSize: 22, fontWeight: '900', marginBottom: 25 },
    tierCard: { padding: 20, borderRadius: 20, borderWidth: 2 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    tierName: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    tierPrice: { fontSize: 20, fontWeight: '900' },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    stepBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    qtyText: { fontSize: 18, fontWeight: '800' },
    infoBox: { flexDirection: 'row', gap: 10, marginTop: 20 },
    infoText: { fontSize: 13, flex: 1 },
    footer: { padding: 20, borderTopWidth: 1, paddingBottom: 34 },
    totalLabel: { fontSize: 14, fontWeight: '600' },
    totalPrice: { fontSize: 22, fontWeight: '900', marginBottom: 15 },
    payBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    payText: { fontSize: 16, fontWeight: '800' },
});