import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTheme } from '@contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';


// --- Mock Data ---
const INITIAL_CART = [
    {
        id: '1',
        title: 'Handwoven Kente Cloth',
        brand: 'HERITAGE WEAVES',
        price: 85.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=300',
    },
    {
        id: '2',
        title: 'Berbere Spice Blend',
        brand: 'ADDIS FLAVORS',
        price: 18.50,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=300',
    },
    {
        id: '3',
        title: 'Shea Butter Luxe',
        brand: 'TAMALE ORGANICS',
        price: 24.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=300',
    },
];

const CartScreen = () => {
    const { colors, isDark } = useTheme();
    const [cartItems, setCartItems] = useState(INITIAL_CART);

    // Helper to update quantity
    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    // Helper to remove item
    const removeItem = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + shipping;

    const renderCartItem = ({ item }: any) => (
        <View style={[styles.cartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />

            <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.brandText, { color: colors.textSecondary }]}>{item.brand}</Text>
                        <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                        <AppIcon library="Feather" name="x" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.itemFooter}>
                    <Text style={[styles.itemPrice, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>

                    <View style={[styles.quantityControl, { backgroundColor: colors.background, borderColor: colors.border }]}>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>
                            <AppIcon library="Feather" name="minus" size={14} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>
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

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Shopping Cart</Text>
                <Text style={[styles.itemCount, { color: colors.textSecondary }]}>{cartItems.length} Items</Text>
            </View>

            <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    cartItems.length > 0 ? (
                        <View style={styles.summarySection}>
                            <View style={[styles.promoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <AppIcon library="Feather" name="tag" size={18} color={colors.primary} />
                                <Text style={[styles.promoText, { color: colors.textSecondary }]}>Add promo code</Text>
                                <TouchableOpacity><Text style={{ color: colors.primary, fontWeight: '800' }}>Apply</Text></TouchableOpacity>
                            </View>

                            <View style={styles.billingRow}>
                                <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                                <Text style={[styles.billingValue, { color: colors.text }]}>${subtotal.toFixed(2)}</Text>
                            </View>
                            <View style={styles.billingRow}>
                                <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Shipping</Text>
                                <Text style={[styles.billingValue, { color: colors.text }]}>${shipping.toFixed(2)}</Text>
                            </View>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                            <View style={styles.billingRow}>
                                <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                                <Text style={[styles.totalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
                            </View>
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <AppIcon library="Feather" name="shopping-cart" size={60} color={colors.border} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
                        <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Looks like you haven't added anything to your cart yet.</Text>
                        <AppButton title="Start Shopping" onPress={() => { }} style={{ width: 200, marginTop: 20 }} />
                    </View>
                }
            />

            {cartItems.length > 0 && (
                <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                    <AppButton
                        title="Proceed to Checkout"
                        onPress={() => { }}
                        rightIcon='arrow-right'
                    // rightIcon={<AppIcon library="Feather" name="arrow-right" size={18} color="#FFF" />}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 4 },
    itemCount: { fontSize: 13, fontWeight: '600' },

    listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },

    // Cart Card
    cartCard: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 12, marginBottom: 16 },
    itemImage: { width: 80, height: 80, borderRadius: 12 },
    itemDetails: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    brandText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
    itemTitle: { fontSize: 15, fontWeight: '800' },

    itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemPrice: { fontSize: 16, fontWeight: '900' },

    quantityControl: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingHorizontal: 4 },
    qtyBtn: { padding: 8 },
    qtyText: { fontSize: 14, fontWeight: '800', paddingHorizontal: 4 },

    // Summary
    summarySection: { marginTop: 10 },
    promoBox: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 24, gap: 12 },
    promoText: { flex: 1, fontSize: 14, fontWeight: '600' },

    billingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    billingLabel: { fontSize: 14, fontWeight: '500' },
    billingValue: { fontSize: 14, fontWeight: '700' },
    divider: { height: 1, width: '100%', marginVertical: 12 },
    totalLabel: { fontSize: 18, fontWeight: '800' },
    totalValue: { fontSize: 20, fontWeight: '900' },

    // Empty State
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
    emptyTitle: { fontSize: 20, fontWeight: '800', marginTop: 20, marginBottom: 8 },
    emptySub: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, lineHeight: 20 },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1 },
});

export default CartScreen;