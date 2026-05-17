import OrderStatusBadge from '@components/orders/OrderStatusBadge';
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { useIsFocused } from '@react-navigation/native';
import { cancelOrder, canSellerConfirmOrder, confirmOrder, getSellerOrders, markOrderShipped } from '@services/orderService';
import type { Order, OrderLifecycleStatus } from '@type/commerce';
import { SELLER_ORDER_STATUSES } from '@type/commerce';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

export const OrderFulfillmentScreen = ({ navigation, route }: any) => {
    const { colors } = useTheme();
    const isFocused = useIsFocused();
    const [tab, setTab] = useState<OrderLifecycleStatus>(route.params?.initialStatus ?? 'Pending');
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (route.params?.initialStatus) {
            setTab(route.params.initialStatus);
        }
    }, [route.params?.initialStatus]);

    useEffect(() => {
        if (!isFocused) {
            return;
        }

        setOrders(getSellerOrders(tab));
    }, [isFocused, tab]);

    const syncOrders = () => {
        setOrders(getSellerOrders(tab));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View style={styles.headerTextWrap}>
                    <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>Orders & Fulfillment</Text>
                    <Text numberOfLines={2} style={[styles.subtitle, { color: colors.textSecondary }]}>Validate, cancel, ship, and track incoming orders.</Text>
                </View>
                <TouchableOpacity 
                onPress={() => navigation.navigate('MarketplaceProducts')} 
                style={[styles.catalogButton, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
                    <AppIcon library="Feather" name="shopping-bag" size={16} color={colors.text} />
                    <Text style={[styles.catalogButtonText, { color: colors.text }]}>Buyer Flow</Text>
                </TouchableOpacity>
            </View>

            {/* Redesigned Pill Tabs */}
            <View style={[styles.tabsWrapper, { borderBottomColor: colors.border }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}> 
                    {SELLER_ORDER_STATUSES.map(status => {
                        const isActive = tab === status;
                        return (
                            <TouchableOpacity 
                                key={status} 
                                onPress={() => setTab(status)} 
                                style={[
                                    styles.tabPill, 
                                    { 
                                        backgroundColor: isActive ? colors.primary : colors.surface,
                                        borderColor: isActive ? colors.primary : colors.border
                                    }
                                ]}
                            > 
                                <Text style={[
                                    styles.tabPillText, 
                                    { color: isActive ? '#FFF' : colors.textSecondary }
                                ]}>
                                    {status}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {orders.map(order => (
                    <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.rowBetween}>
                            <View>
                                <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{order.createdAt}</Text>
                            </View>
                            <OrderStatusBadge status={order.status} />
                        </View>
                        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                        <Text style={[styles.buyerText, { color: colors.text }]}>Buyer: {order.buyerName}</Text>
                        <Text style={[styles.itemText, { color: colors.textSecondary }]}>{order.items[0].quantity}x {order.items[0].product.title}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}</Text>
                        <Text style={[styles.totalText, { color: colors.primary }]}>{formatCurrency(order.payment.total)}</Text>

                        <View style={styles.cardActions}>
                            <TouchableOpacity onPress={() => navigation.navigate('SellerOrderDetail', { orderId: order.id })} style={[styles.secondaryBtn, { borderColor: colors.border }]}> 
                                <Text style={[styles.secondaryBtnText, { color: colors.text }]}>View</Text>
                            </TouchableOpacity>
                            {canSellerConfirmOrder(order) ? (
                                <TouchableOpacity onPress={() => { confirmOrder(order.id); syncOrders(); }} style={[styles.actionBtn, { backgroundColor: colors.primary }]}> 
                                    <Text style={styles.actionBtnText}>Validate</Text>
                                </TouchableOpacity>
                            ) : null}
                            {order.status === 'Confirmed' ? (
                                <TouchableOpacity onPress={() => { markOrderShipped(order.id, `TRK-${Date.now().toString().slice(-6)}`); syncOrders(); }} style={[styles.actionBtn, { backgroundColor: colors.primary }]}> 
                                    <Text style={styles.actionBtnText}>Ship</Text>
                                </TouchableOpacity>
                            ) : null}
                            {(order.status === 'Pending' || order.status === 'Confirmed') ? (
                                <TouchableOpacity onPress={() => { cancelOrder(order.id, 'seller'); syncOrders(); }} style={[styles.secondaryBtn, { borderColor: colors.destructive }]}> 
                                    <Text style={[styles.secondaryBtnText, { color: colors.destructive }]}>Cancel</Text>
                                </TouchableOpacity>
                            ) : null}
                            {(order.status === 'Shipped' || order.status === 'Completed') ? (
                                <TouchableOpacity onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })} style={[styles.secondaryBtn, { borderColor: colors.border }]}> 
                                    <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Track</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                ))}

                {orders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconWrap, { backgroundColor: colors.surface }]}> 
                            <AppIcon library="Feather" name="package" size={34} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No {tab.toLowerCase()} orders</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Place an order from the buyer flow to test this status, or switch tabs to inspect the seeded mock data.</Text>
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
    headerTextWrap: { flex: 1, minWidth: 0, paddingRight: 8 },
    title: { fontSize: 20, fontWeight: '900' },
    subtitle: { fontSize: 14, marginTop: 4, lineHeight: 20 },
    catalogButton: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, flexShrink: 0 },
    catalogButtonText: { fontSize: 13, fontWeight: '700' },
    
    // Updated Tab Styles
    tabsWrapper: { paddingBottom: 16, borderBottomWidth: 1 },
    tabsScroll: { paddingHorizontal: 20, gap: 10 },
    tabPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    tabPillText: { fontSize: 13, fontWeight: '700' },
    
    orderCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    orderId: { fontWeight: '800', fontSize: 14, marginBottom: 2 },
    dividerLine: { height: 1, marginVertical: 12 },
    buyerText: { fontWeight: '700', fontSize: 15, marginBottom: 4 },
    itemText: { fontSize: 14, marginBottom: 8 },
    totalText: { fontWeight: '900', fontSize: 16, marginBottom: 16 },
    cardActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    actionBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center' },
    actionBtnText: { color: '#FFF', fontWeight: '800' },
    secondaryBtn: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
    secondaryBtnText: { fontWeight: '800', fontSize: 13 },
    emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 24 },
    emptyIconWrap: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
    emptyTitle: { fontSize: 22, fontWeight: '900', marginBottom: 8 },
    emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 22 }
});