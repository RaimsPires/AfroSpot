import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ORDERS = [
    { id: 'ORD-901', buyer: 'David Osei', item: 'Adire Silk Scarf', qty: 2, total: '$90.00', status: 'Pending', date: 'Today' },
    { id: 'ORD-884', buyer: 'Nia Adeleke', item: 'Shea Butter Luxe', qty: 1, total: '$24.00', status: 'Shipped', tracking: 'TRK992831' },
];

export const OrderFulfillmentScreen = () => {
    const { colors } = useTheme();
    const [tab, setTab] = useState<'Pending' | 'Shipped'>('Pending');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Orders & Fulfillment</Text>
            </View>

            <View style={styles.tabs}>
                {['Pending', 'Shipped'].map(t => (
                    <TouchableOpacity key={t} onPress={() => setTab(t as any)} style={[styles.tabBtn, tab === t && { borderBottomWidth: 2, borderBottomColor: colors.primary }]}>
                        <Text style={{ color: tab === t ? colors.primary : colors.textSecondary, fontWeight: '700' }}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {ORDERS.filter(o => o.status === tab).map(order => (
                    <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.rowBetween}>
                            <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{order.date}</Text>
                        </View>
                        <View style={styles.divider} />
                        <Text style={[styles.buyerText, { color: colors.text }]}>Buyer: {order.buyer}</Text>
                        <Text style={[styles.itemText, { color: colors.textSecondary }]}>{order.qty}x {order.item}</Text>
                        <Text style={[styles.totalText, { color: colors.primary }]}>{order.total}</Text>

                        {order.status === 'Pending' ? (
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                                <Text style={styles.actionBtnText}>Generate Label & Ship</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={[styles.shippedBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <Text style={{ color: colors.text, fontSize: 12 }}>Tracking: <Text style={{ fontWeight: '700' }}>{order.tracking}</Text></Text>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20 },
    title: { fontSize: 24, fontWeight: '900' },
    tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#EEE' },
    tabBtn: { flex: 1, paddingVertical: 15, alignItems: 'center' },
    orderCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
    orderId: { fontWeight: '800', fontSize: 14 },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
    buyerText: { fontWeight: '700', fontSize: 15, marginBottom: 4 },
    itemText: { fontSize: 14, marginBottom: 8 },
    totalText: { fontWeight: '900', fontSize: 16, marginBottom: 16 },
    actionBtn: { padding: 12, borderRadius: 12, alignItems: 'center' },
    actionBtnText: { color: '#FFF', fontWeight: '800' },
    shippedBox: { padding: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center' }
});