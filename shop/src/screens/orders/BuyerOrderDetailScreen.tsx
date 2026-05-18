import OrderStatusBadge from '@components/orders/OrderStatusBadge';
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { cancelOrder, canBuyerCancelOrder, getOrderById } from '@services/orderService';
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

const BuyerOrderDetailScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const isFocused = useIsFocused();
    const [order, setOrder] = useState<Order | undefined>();

    useEffect(() => {
        if (!isFocused) {
            return;
        }

        setOrder(getOrderById(route.params.orderId));
    }, [isFocused, route.params.orderId]);

    if (!order) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>Order not found</Text>
                </View>
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Order Details</Text>
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
                    <Text style={[styles.secondaryText, { color: colors.textSecondary, marginTop: 14 }]}>Sold by {order.sellerName}</Text>
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
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery</Text>
                    <Text style={[styles.primaryText, { color: colors.text }]}>{order.address.recipient}</Text>
                    <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{order.address.line1}, {order.address.line2}</Text>
                    <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{order.address.city}, {order.address.region}</Text>
                    <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{order.address.phone}</Text>
                    {order.trackingNumber ? (
                        <View style={[styles.trackingBox, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                            <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Tracking</Text>
                            <Text style={[styles.primaryText, { color: colors.text }]}>{order.trackingNumber}</Text>
                        </View>
                    ) : null}
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment</Text>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Method</Text>
                        <Text style={[styles.primaryText, { color: colors.text }]}>{order.payment.methodLabel}</Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Subtotal</Text>
                        <Text style={[styles.primaryText, { color: colors.text }]}>{formatCurrency(order.payment.subtotal)}</Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Shipping</Text>
                        <Text style={[styles.primaryText, { color: colors.text }]}>{formatCurrency(order.payment.shipping)}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.rowBetween}>
                        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                        <Text style={[styles.totalValue, { color: colors.primary }]}>{formatCurrency(order.payment.total)}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}> 
                {canBuyerCancelOrder(order) ? (
                    <TouchableOpacity
                        onPress={() => {
                            cancelOrder(order.id, 'buyer');
                            setOrder(getOrderById(order.id));
                        }}
                        style={[styles.secondaryButton, { borderColor: colors.destructive, backgroundColor: colors.surface }]}
                    >
                        <Text style={[styles.secondaryButtonText, { color: colors.destructive }]}>Cancel Order</Text>
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })} style={[styles.primaryButton, { backgroundColor: colors.primary }]}> 
                    <Text style={[styles.primaryButtonText, { color: colors.textInverse }]}>Track Order</Text>
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
    content: { paddingHorizontal: 20, paddingBottom: 120 },
    card: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 16 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 },
    orderId: { fontSize: 18, fontWeight: '900' },
    sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
    primaryText: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    secondaryText: { fontSize: 14, lineHeight: 21 },
    itemRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 14 },
    itemImage: { width: 54, height: 54, borderRadius: 10 },
    trackingBox: { borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 14 },
    divider: { height: 1, marginVertical: 12 },
    totalLabel: { fontSize: 16, fontWeight: '800' },
    totalValue: { fontSize: 20, fontWeight: '900' },
    footer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30, gap: 12, borderTopWidth: 1 },
    secondaryButton: { height: 52, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    secondaryButtonText: { fontSize: 14, fontWeight: '800' },
    primaryButton: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    primaryButtonText: { fontSize: 15, fontWeight: '800' },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 22, fontWeight: '900' },
});

export default BuyerOrderDetailScreen;
