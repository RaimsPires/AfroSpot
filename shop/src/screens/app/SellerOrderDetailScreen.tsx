import OrderStatusBadge from '@components/orders/OrderStatusBadge';
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { cancelOrder, canSellerConfirmOrder, canSellerShipOrder, completeOrder, confirmOrder, getOrderById, markOrderShipped } from '@services/orderService';
import type { Order } from '@type/commerce';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const SellerOrderDetailScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const isFocused = useIsFocused();
    const [order, setOrder] = useState<Order | undefined>();

    useEffect(() => {
        if (!isFocused) {
            return;
        }

        setOrder(getOrderById(route.params.orderId));
    }, [isFocused, route.params.orderId]);

    const syncOrder = () => {
        setOrder(getOrderById(route.params.orderId));
    };

    if (!order) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <View style={styles.emptyState}><Text style={[styles.emptyTitle, { color: colors.text }]}>Order not found</Text></View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Seller Order</Text>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}>
                    <AppIcon library="Feather" name="truck" size={18} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                            <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{order.createdAt}</Text>
                        </View>
                        <OrderStatusBadge status={order.status} />
                    </View>
                    <Text style={[styles.secondaryText, { color: colors.textSecondary, marginTop: 14 }]}>Buyer: {order.buyerName}</Text>
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Buyer & delivery</Text>
                    <Text style={[styles.primaryText, { color: colors.text }]}>{order.address.recipient}</Text>
                    <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{order.address.line1}, {order.address.line2}</Text>
                    <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{order.address.city}, {order.address.region}</Text>
                    <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{order.address.phone}</Text>
                    {order.note ? <Text style={[styles.noteText, { color: colors.textSecondary }]}>Note: {order.note}</Text> : null}
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Items</Text>
                    {order.items.map(item => (
                        <View key={item.id} style={styles.itemRow}>
                            <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.primaryText, { color: colors.text }]}>{item.product.title}</Text>
                                <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{item.quantity} x {formatCurrency(item.product.price)}</Text>
                            </View>
                            <Text style={[styles.primaryText, { color: colors.primary }]}>{formatCurrency(item.quantity * item.product.price)}</Text>
                        </View>
                    ))}
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment summary</Text>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Method</Text>
                        <Text style={[styles.primaryText, { color: colors.text }]}>{order.payment.methodLabel}</Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Total</Text>
                        <Text style={[styles.totalValue, { color: colors.primary }]}>{formatCurrency(order.payment.total)}</Text>
                    </View>
                    {order.trackingNumber ? (
                        <View style={[styles.trackingBox, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                            <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Tracking number</Text>
                            <Text style={[styles.primaryText, { color: colors.text }]}>{order.trackingNumber}</Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}> 
                {canSellerConfirmOrder(order) ? (
                    <TouchableOpacity onPress={() => { confirmOrder(order.id); syncOrder(); }} style={[styles.primaryButton, { backgroundColor: colors.primary }]}> 
                        <Text style={[styles.primaryButtonText, { color: colors.textInverse }]}>Validate Order</Text>
                    </TouchableOpacity>
                ) : null}
                {canSellerShipOrder(order) ? (
                    <TouchableOpacity onPress={() => { markOrderShipped(order.id, `TRK-${Date.now().toString().slice(-6)}`); syncOrder(); }} style={[styles.primaryButton, { backgroundColor: colors.primary }]}> 
                        <Text style={[styles.primaryButtonText, { color: colors.textInverse }]}>Add Tracking & Ship</Text>
                    </TouchableOpacity>
                ) : null}
                {order.status === 'Shipped' ? (
                    <TouchableOpacity onPress={() => { completeOrder(order.id); syncOrder(); }} style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
                        <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Mark Delivered</Text>
                    </TouchableOpacity>
                ) : null}
                {(order.status === 'Pending' || order.status === 'Confirmed') ? (
                    <TouchableOpacity onPress={() => { cancelOrder(order.id, 'seller'); syncOrder(); }} style={[styles.secondaryButton, { borderColor: colors.destructive, backgroundColor: colors.surface }]}> 
                        <Text style={[styles.secondaryButtonText, { color: colors.destructive }]}>Cancel Order</Text>
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })} style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Open Tracking</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconButton: { padding: 8 },
    content: { paddingHorizontal: 20, paddingBottom: 150 },
    card: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 16 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 },
    orderId: { fontSize: 18, fontWeight: '900' },
    sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
    primaryText: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    secondaryText: { fontSize: 14, lineHeight: 21 },
    noteText: { fontSize: 13, marginTop: 12 },
    itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    itemImage: { width: 54, height: 54, borderRadius: 10 },
    totalValue: { fontSize: 20, fontWeight: '900' },
    trackingBox: { borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 14 },
    footer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30, gap: 12, borderTopWidth: 1 },
    primaryButton: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    primaryButtonText: { fontSize: 15, fontWeight: '800' },
    secondaryButton: { height: 52, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    secondaryButtonText: { fontSize: 14, fontWeight: '800' },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 20, fontWeight: '900' },
});

export default SellerOrderDetailScreen;
