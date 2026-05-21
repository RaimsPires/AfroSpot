import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { addToCart, getCartItems, getProductById } from '@services/orderService';
import React, { useMemo, useState } from 'react';
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

const ProductDetailScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const product = useMemo(() => getProductById(route.params.productId), [route.params.productId]);
    const [quantity, setQuantity] = useState(1);
    const [cartCount, setCartCount] = useState(getCartItems().length);

    const handleAddToCart = () => {
        if (!product) {
            return;
        }

        for (let index = 0; index < quantity; index += 1) {
            addToCart(product.id);
        }

        setCartCount(getCartItems().length);
    };

    if (!product) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>Product not found</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.primaryButton, { backgroundColor: colors.primary }]}> 
                        <Text style={[styles.primaryButtonText, { color: colors.textInverse }]}>Back to marketplace</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                        <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('BuyerOrders')}>
                            <AppIcon library="Feather" name="package" size={18} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
                            <AppIcon library="Feather" name="shopping-cart" size={18} color={colors.text} />
                            {cartCount > 0 ? (
                                <View style={[styles.countBubble, { backgroundColor: colors.primary }]}> 
                                    <Text style={[styles.countBubbleText, { color: colors.textInverse }]}>{cartCount}</Text>
                                </View>
                            ) : null}
                        </TouchableOpacity>
                    </View>
                </View>

                <Image source={{ uri: product.image }} style={styles.heroImage} />

                <View style={styles.content}>
                    <Text style={[styles.brand, { color: colors.textSecondary }]}>{product.brand}</Text>
                    <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>
                    <Text style={[styles.price, { color: colors.primary }]}>{formatCurrency(product.price)}</Text>

                    <View style={styles.metaRow}>
                        <View style={[styles.metaPill, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                            <AppIcon library="Feather" name="star" size={14} color="#F59E0B" />
                            <Text style={[styles.metaText, { color: colors.text }]}>{product.rating.toFixed(1)} rating</Text>
                        </View>
                        <View style={[styles.metaPill, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                            <AppIcon library="Feather" name="package" size={14} color={colors.primary} />
                            <Text style={[styles.metaText, { color: colors.text }]}>{product.stockLabel}</Text>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>About this item</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>{product.description}</Text>

                    <View style={[styles.sellerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Seller</Text>
                        <Text style={[styles.sellerName, { color: colors.text }]}>{product.sellerName}</Text>
                        <Text style={[styles.sellerNote, { color: colors.textSecondary }]}>Orders from this listing flow into the merchant fulfillment queue for validation and tracking.</Text>
                    </View>

                    <View style={[styles.quantityCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quantity</Text>
                        <View style={styles.quantityRow}>
                            <TouchableOpacity onPress={() => setQuantity(current => Math.max(1, current - 1))} style={[styles.qtyButton, { borderColor: colors.border }]}> 
                                <AppIcon library="Feather" name="minus" size={16} color={colors.text} />
                            </TouchableOpacity>
                            <Text style={[styles.quantityValue, { color: colors.text }]}>{quantity}</Text>
                            <TouchableOpacity onPress={() => setQuantity(current => current + 1)} style={[styles.qtyButton, { borderColor: colors.border }]}> 
                                <AppIcon library="Feather" name="plus" size={16} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}> 
                <TouchableOpacity onPress={handleAddToCart} style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        handleAddToCart();
                        navigation.navigate('Cart');
                    }}
                    style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                >
                    <Text style={[styles.primaryButtonText, { color: colors.textInverse }]}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    iconButton: { padding: 8 },
    countBubble: { position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
    countBubbleText: { fontSize: 10, fontWeight: '800' },
    heroImage: { width: '100%', height: 320 },
    content: { padding: 20 },
    brand: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6, marginBottom: 8 },
    title: { fontSize: 28, fontWeight: '900', marginBottom: 8 },
    price: { fontSize: 24, fontWeight: '900', marginBottom: 16 },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    metaPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
    metaText: { fontSize: 13, fontWeight: '700' },
    sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
    description: { fontSize: 15, lineHeight: 24, marginBottom: 20 },
    sellerCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 16 },
    sellerName: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
    sellerNote: { fontSize: 14, lineHeight: 22 },
    quantityCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 20 },
    quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    qtyButton: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    quantityValue: { fontSize: 18, fontWeight: '800' },
    footer: { flexDirection: 'row', gap: 12, padding: 20, borderTopWidth: 1 },
    secondaryButton: { flex: 1, height: 54, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    secondaryButtonText: { fontSize: 15, fontWeight: '800' },
    primaryButton: { flex: 1, height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    primaryButtonText: { fontSize: 15, fontWeight: '800' },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    emptyTitle: { fontSize: 22, fontWeight: '900', marginBottom: 18 },
});

export default ProductDetailScreen;
