import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { getOrderById } from '@services/orderService';
import React, { useMemo } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const OrderSuccessScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const order = useMemo(() => getOrderById(route.params.orderId), [route.params.orderId]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={styles.content}>
                <View style={[styles.iconWrap, { backgroundColor: colors.primary + '15' }]}> 
                    <AppIcon library="Feather" name="check" size={42} color={colors.primary} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>Order placed</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>The order is now visible in buyer history and seller fulfillment so you can validate, cancel, and track it.</Text>

                {order ? (
                    <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                        <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                        <Text style={[styles.summaryLine, { color: colors.textSecondary }]}>{order.items.length} items from {order.sellerName}</Text>
                        <Text style={[styles.total, { color: colors.primary }]}>{formatCurrency(order.payment.total)}</Text>
                    </View>
                ) : null}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.replace('BuyerOrderDetail', { orderId: route.params.orderId })} style={[styles.primaryButton, { backgroundColor: colors.primary }]}> 
                    <Text style={[styles.primaryButtonText, { color: colors.textInverse }]}>View Order</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('BuyerOrders', { initialTab: 'Active' })} style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Open Order History</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('MarketplaceProducts')} style={styles.linkButton}>
                    <Text style={[styles.linkText, { color: colors.primary }]}>Continue shopping</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
    iconWrap: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    title: { fontSize: 28, fontWeight: '900', marginBottom: 10 },
    description: { fontSize: 15, lineHeight: 24, textAlign: 'center', marginBottom: 28 },
    summaryCard: { width: '100%', borderWidth: 1, borderRadius: 18, padding: 18, alignItems: 'center' },
    orderId: { fontSize: 18, fontWeight: '900', marginBottom: 8 },
    summaryLine: { fontSize: 14, marginBottom: 10 },
    total: { fontSize: 24, fontWeight: '900' },
    footer: { paddingHorizontal: 20, paddingBottom: 34, gap: 12 },
    primaryButton: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    primaryButtonText: { fontSize: 15, fontWeight: '800' },
    secondaryButton: { height: 54, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    secondaryButtonText: { fontSize: 15, fontWeight: '800' },
    linkButton: { alignItems: 'center', paddingVertical: 12 },
    linkText: { fontSize: 14, fontWeight: '800' },
});

export default OrderSuccessScreen;
