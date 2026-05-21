import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { getCartItems, getCartSummary, removeCartItem, updateCartQuantity } from '@services/orderService';
import type { CartItem } from '@type/commerce';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const CartScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const isFocused = useIsFocused();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [summary, setSummary] = useState(getCartSummary());

    useEffect(() => {
        if (!isFocused) {
            return;
        }

        setCartItems(getCartItems());
        setSummary(getCartSummary());
    }, [isFocused]);

    const syncCart = () => {
        setCartItems(getCartItems());
        setSummary(getCartSummary());
    };

    const handleQuantityChange = (item: CartItem, delta: number) => {
        updateCartQuantity(item.id, item.quantity + delta);
        syncCart();
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={[styles.cartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <Image source={{ uri: item.product.image }} style={styles.image} />
            <View style={styles.itemBody}>
                <View style={styles.rowBetween}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.brandText, { color: colors.textSecondary }]}>{item.product.brand}</Text>
                        <Text style={[styles.itemTitle, { color: colors.text }]}>{item.product.title}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { removeCartItem(item.id); syncCart(); }}>
                        <AppIcon library="Feather" name="x" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.rowBetween}>
                    <Text style={[styles.priceText, { color: colors.primary }]}>{formatCurrency(item.product.price)}</Text>
                    <View style={[styles.stepper, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                        <TouchableOpacity onPress={() => handleQuantityChange(item, -1)} style={styles.stepButton}>
                            <AppIcon library="Feather" name="minus" size={14} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => handleQuantityChange(item, 1)} style={styles.stepButton}>
                            <AppIcon library="Feather" name="plus" size={14} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Shopping Cart</Text>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('BuyerOrders')}>
                    <AppIcon library="Feather" name="package" size={18} color={colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconWrap, { backgroundColor: colors.surface }]}> 
                            <AppIcon library="Feather" name="shopping-cart" size={42} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Add products from the marketplace to start the buyer order flow.</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('MarketplaceProducts')} style={[styles.primaryButton, { backgroundColor: colors.primary }]}> 
                            <Text style={[styles.primaryButtonText, { color: colors.textInverse }]}>Start shopping</Text>
                        </TouchableOpacity>
                    </View>
                }
                ListFooterComponent={
                    cartItems.length > 0 ? (
                        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                            <View style={styles.billingRow}>
                                <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                                <Text style={[styles.billingValue, { color: colors.text }]}>{formatCurrency(summary.subtotal)}</Text>
                            </View>
                            <View style={styles.billingRow}>
                                <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Shipping</Text>
                                <Text style={[styles.billingValue, { color: colors.text }]}>{formatCurrency(summary.shipping)}</Text>
                            </View>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                            <View style={styles.billingRow}>
                                <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                                <Text style={[styles.totalValue, { color: colors.primary }]}>{formatCurrency(summary.total)}</Text>
                            </View>
                        </View>
                    ) : null
                }
            />

            {cartItems.length > 0 ? (
                <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}> 
                    <TouchableOpacity onPress={() => navigation.navigate('Checkout')} style={[styles.primaryButton, { backgroundColor: colors.primary }]}> 
                        <Text style={[styles.primaryButtonText, { color: colors.textInverse }]}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconButton: { padding: 8 },
    listContent: { paddingHorizontal: 20, paddingBottom: 120 },
    cartCard: { flexDirection: 'row', borderWidth: 1, borderRadius: 18, padding: 12, marginBottom: 16 },
    image: { width: 88, height: 88, borderRadius: 12 },
    itemBody: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
    brandText: { fontSize: 11, fontWeight: '800', marginBottom: 4 },
    itemTitle: { fontSize: 15, fontWeight: '800' },
    priceText: { fontSize: 18, fontWeight: '900' },
    stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 4 },
    stepButton: { padding: 10 },
    qtyText: { fontSize: 14, fontWeight: '800', paddingHorizontal: 6 },
    summaryCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginTop: 8 },
    billingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    billingLabel: { fontSize: 14, fontWeight: '600' },
    billingValue: { fontSize: 14, fontWeight: '700' },
    divider: { height: 1, marginVertical: 12 },
    totalLabel: { fontSize: 16, fontWeight: '800' },
    totalValue: { fontSize: 20, fontWeight: '900' },
    footer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30, borderTopWidth: 1 },
    primaryButton: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    primaryButtonText: { fontSize: 15, fontWeight: '800' },
    emptyState: { alignItems: 'center', paddingTop: 100, paddingHorizontal: 32 },
    emptyIconWrap: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 22, fontWeight: '900', marginBottom: 8 },
    emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
});

export default CartScreen;
