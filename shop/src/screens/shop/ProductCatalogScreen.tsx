import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { addToCart, getCartItems, getProducts } from '@services/orderService';
import type { Product } from '@type/commerce';
import React, { useMemo, useState } from 'react';
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

const ProductCatalogScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const [products] = useState<Product[]>(getProducts());
    const [cartCount, setCartCount] = useState(getCartItems().length);

    const headerTitle = useMemo(() => `Marketplace`, []);

    const handleAddToCart = (productId: string) => {
        const items = addToCart(productId);
        setCartCount(items.length);
    };

    const renderProductCard = ({ item }: { item: Product }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.cardBody}>
                <View style={styles.rowBetween}>
                    <Text style={[styles.brandText, { color: colors.textSecondary }]}>{item.brand}</Text>
                    <View style={styles.ratingRow}>
                        <AppIcon library="Feather" name="star" size={13} color="#F59E0B" />
                        <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{item.rating.toFixed(1)} ({item.reviewCount})</Text>
                    </View>
                </View>

                <Text style={[styles.titleText, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.descriptionText, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text>

                <View style={styles.footerRow}>
                    <View>
                        <Text style={[styles.priceText, { color: colors.primary }]}>{formatCurrency(item.price)}</Text>
                        <Text style={[styles.stockText, { color: colors.textSecondary }]}>{item.stockLabel}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => handleAddToCart(item.id)}
                        style={[styles.addButton, { backgroundColor: colors.primary }]}
                    >
                        <AppIcon library="Feather" name="plus" size={16} color={colors.textInverse} />
                        <Text style={[styles.addButtonText, { color: colors.textInverse }]}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{headerTitle}</Text>
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

            <FlatList
                data={products}
                renderItem={renderProductCard}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={styles.heroSection}>
                        <Text style={[styles.heroTitle, { color: colors.text }]}>Preview the full order lifecycle</Text>
                        <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>Browse mock products, place an order, then validate, cancel, and track it from the merchant flow.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    iconButton: { padding: 8 },
    countBubble: {
        position: 'absolute',
        top: 2,
        right: 2,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    countBubbleText: { fontSize: 10, fontWeight: '800' },
    listContent: { paddingHorizontal: 20, paddingBottom: 32 },
    heroSection: { marginBottom: 18 },
    heroTitle: { fontSize: 24, fontWeight: '900', marginBottom: 8 },
    heroDescription: { fontSize: 14, lineHeight: 22 },
    card: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
    productImage: { width: '100%', height: 220 },
    cardBody: { padding: 16 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
    brandText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    ratingText: { fontSize: 12, fontWeight: '600' },
    titleText: { fontSize: 18, fontWeight: '800', marginTop: 10, marginBottom: 8 },
    descriptionText: { fontSize: 14, lineHeight: 21 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 },
    priceText: { fontSize: 20, fontWeight: '900', marginBottom: 4 },
    stockText: { fontSize: 12, fontWeight: '600' },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    addButtonText: { fontSize: 14, fontWeight: '800' },
});

export default ProductCatalogScreen;
