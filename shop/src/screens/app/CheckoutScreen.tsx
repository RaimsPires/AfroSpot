import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { getCartItems, getCartSummary, getDefaultAddress, getDefaultPaymentMethodLabel, placeOrder } from '@services/orderService';
import type { CartItem } from '@type/commerce';
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

const CheckoutScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const isFocused = useIsFocused();
    const [items, setItems] = useState<CartItem[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [summary, setSummary] = useState(getCartSummary());

    useEffect(() => {
        if (!isFocused) {
            return;
        }

        setItems(getCartItems());
        setSummary(getCartSummary());
    }, [isFocused]);

    const address = getDefaultAddress();

    const handlePlaceOrder = () => {
        setSubmitting(true);
        const order = placeOrder();
        setSubmitting(false);

        if (!order) {
            navigation.navigate('MarketplaceProducts');
            return;
        }

        navigation.replace('OrderSuccess', { orderId: order.id });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Checkout</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery address</Text>
                    <Text style={[styles.primaryText, { color: colors.text }]}>{address.recipient}</Text>
                    <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{address.line1}, {address.line2}</Text>
                    <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{address.city}, {address.region}</Text>
                    <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>{address.phone}</Text>
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment</Text>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Method</Text>
                        <Text style={[styles.primaryText, { color: colors.text }]}>{getDefaultPaymentMethodLabel()}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.rowBetween}>
                        <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Status</Text>
                        <Text style={[styles.primaryText, { color: colors.primary }]}>Paid on confirmation</Text>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Items</Text>
                    {items.map(item => (
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
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Order summary</Text>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Subtotal</Text>
                        <Text style={[styles.primaryText, { color: colors.text }]}>{formatCurrency(summary.subtotal)}</Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>Shipping</Text>
                        <Text style={[styles.primaryText, { color: colors.text }]}>{formatCurrency(summary.shipping)}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.rowBetween}>
                        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                        <Text style={[styles.totalValue, { color: colors.primary }]}>{formatCurrency(summary.total)}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}> 
                <TouchableOpacity
                    disabled={submitting || items.length === 0}
                    onPress={handlePlaceOrder}
                    style={[styles.primaryButton, { backgroundColor: items.length === 0 ? colors.buttonDisabled : colors.primary }]}
                >
                    <Text style={[styles.primaryButtonText, { color: colors.textInverse }]}>{submitting ? 'Placing order...' : 'Place Order'}</Text>
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
    card: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
    primaryText: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    secondaryText: { fontSize: 14, lineHeight: 21 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 },
    divider: { height: 1, marginVertical: 12 },
    itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    itemImage: { width: 52, height: 52, borderRadius: 10 },
    totalLabel: { fontSize: 16, fontWeight: '800' },
    totalValue: { fontSize: 20, fontWeight: '900' },
    footer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30, borderTopWidth: 1 },
    primaryButton: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    primaryButtonText: { fontSize: 15, fontWeight: '800' },
});

export default CheckoutScreen;
