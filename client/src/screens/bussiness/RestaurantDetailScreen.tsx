import React, { useState } from 'react';
import {
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackNavigationProp, AppStackRouteProp } from '@/navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Mock Data ---
const CATEGORIES = ['Featured', 'Starters', 'Mains', 'Platters', 'Drinks'];

const MENU_ITEMS = {
    popular: [
        {
            id: 'p1', title: "Mama's Jollof Supreme", desc: 'Authentic smoky Jollof rice served with grilled chicken, fried plantain...', price: '$18.50', kcal: '850 KCAL', iconType: 'flame', isBestseller: true, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=300',
        },
        {
            id: 'p2', title: 'Grilled Tilapia', desc: 'Whole charcoal-grilled tilapia seasoned with West African spices...', price: '$24.00', kcal: '620 KCAL', iconType: 'flame', isBestseller: true, image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=300',
        },
    ],
    starters: [
        {
            id: 's1', title: 'Suya Beef Sticks', desc: 'Tender beef strips coated in spicy peanut Yaji rub, grilled to...', price: '$12.00', kcal: '450 KCAL', iconType: 'flame', isBestseller: false, image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=300',
        },
        {
            id: 's2', title: 'Kelewele (Spicy)', desc: 'Fried plantain cubes seasoned with ginger, cayenne pepper, and cloves.', price: '$8.50', kcal: '320 KCAL', iconType: 'leaf', isBestseller: false, image: 'https://images.unsplash.com/photo-1628102431500-244e4566c5e7?q=80&w=300',
        },
    ],
};

const RestaurantDetailScreen = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation<AppStackNavigationProp<'RestaurantDetail'>>();
    const route = useRoute<AppStackRouteProp<'RestaurantDetail'>>();
    const restaurantName = route.params?.restaurantName ?? "Mama Ashanti's Kitchen";
    const restaurantId = route.params?.restaurantId ?? 'mama-ashantis-kitchen';
    const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
    const [activeCategory, setActiveCategory] = useState('Featured');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{restaurantName}</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="info" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="star" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 2. Hero Image */}
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800' }}
                    style={styles.heroImage}
                >
                    <View style={styles.heroOverlay}>
                        <View style={styles.heroMetaTop}>
                            <View style={styles.openBadge}>
                                <Text style={styles.openBadgeText}>OPEN NOW</Text>
                            </View>
                            <View style={styles.ratingRow}>
                                <AppIcon library="AntDesign" name="star" size={12} color="#F59E0B" />
                                <Text style={styles.ratingText}> 4.8 (500+)</Text>
                            </View>
                        </View>

                        <Text style={styles.heroTitleLarge}>{restaurantName}</Text>

                        <View style={styles.heroMetaBottom}>
                            <View style={styles.metaItem}>
                                <AppIcon library="Feather" name="clock" size={12} color="#E5E5E5" />
                                <Text style={styles.metaText}> {orderType === 'delivery' ? '25-35 min' : '15-20 min'}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <AppIcon library="Feather" name="map-pin" size={12} color="#E5E5E5" />
                                <Text style={styles.metaText}> 1.2 miles away</Text>
                            </View>
                        </View>
                    </View>
                </ImageBackground>

                <View style={styles.bodyContainer}>

                    {/* 3. Delivery / Pickup Toggle */}
                    <View style={[styles.toggleContainer, { backgroundColor: colors.surface }]}>
                        <TouchableOpacity
                            style={[styles.toggleBtn, orderType === 'delivery' && [styles.toggleActive, { shadowColor: colors.text }]]}
                            onPress={() => setOrderType('delivery')}
                        >
                            <Text style={[styles.toggleText, { color: orderType === 'delivery' ? colors.text : colors.textSecondary }]}>
                                Delivery
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleBtn, orderType === 'pickup' && [styles.toggleActive, { shadowColor: colors.text }]]}
                            onPress={() => setOrderType('pickup')}
                        >
                            <Text style={[styles.toggleText, { color: orderType === 'pickup' ? colors.text : colors.textSecondary }]}>
                                Pickup
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* 4. DYNAMIC ORDER INFO CARD */}
                    <View style={[styles.orderInfoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        {orderType === 'delivery' ? (
                            <TouchableOpacity style={styles.orderInfoRow}>
                                <View style={[styles.orderIconBg, { backgroundColor: colors.primary + '15' }]}>
                                    <AppIcon library="Feather" name="truck" size={18} color={colors.primary} />
                                </View>
                                <View style={styles.orderInfoText}>
                                    <Text style={[styles.orderInfoTitle, { color: colors.text }]}>Delivery to Home</Text>
                                    <Text style={[styles.orderInfoSub, { color: colors.textSecondary }]}>124 Harlem Ave • $3.99 Fee</Text>
                                </View>
                                <AppIcon library="Feather" name="chevron-right" size={18} color={colors.textSecondary} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.orderInfoRow}>
                                <View style={[styles.orderIconBg, { backgroundColor: colors.primary + '15' }]}>
                                    <AppIcon library="Feather" name="shopping-bag" size={18} color={colors.primary} />
                                </View>
                                <View style={styles.orderInfoText}>
                                    <Text style={[styles.orderInfoTitle, { color: colors.text }]}>Pickup at Restaurant</Text>
                                    <Text style={[styles.orderInfoSub, { color: colors.textSecondary }]}>Ready in 15-20 min • 1.2 miles</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('InteractiveMap', { businessId: restaurantId })}>
                                    <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>Map</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* 5. Menu Categories */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                style={[
                                    styles.categoryPill,
                                    {
                                        backgroundColor: activeCategory === cat ? colors.primary : colors.surface,
                                        borderColor: colors.border,
                                        borderWidth: activeCategory === cat ? 0 : 1,
                                    },
                                ]}
                            >
                                <Text style={[
                                    styles.categoryPillText,
                                    { color: activeCategory === cat ? '#FFF' : colors.textSecondary }
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* 6. Menu Sections */}
                    <MenuSection title="Most Popular" items={MENU_ITEMS.popular} colors={colors} />
                    <MenuSection title="Starters & Appetizers" items={MENU_ITEMS.starters} colors={colors} />

                </View>
            </ScrollView>

            {/* 7. Floating Cart Button */}
            <View style={styles.floatingCartContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CheckoutPayment', { businessId: restaurantId })}
                    style={[styles.cartBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                >
                    <View style={styles.cartLeft}>
                        <View style={styles.cartIconWrapper}>
                            <AppIcon library="Feather" name="shopping-bag" size={20} color="#FFF" />
                            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>3</Text></View>
                        </View>
                        <View>
                            <Text style={styles.cartItemsText}>3 Items Added</Text>
                            <Text style={styles.cartPriceText}>$42.50</Text>
                        </View>
                    </View>
                    <View style={styles.cartRight}>
                        <Text style={styles.viewCartText}>{orderType === 'pickup' ? 'CHECKOUT (PICKUP)' : 'VIEW CART'}</Text>
                        <AppIcon library="Feather" name="chevron-right" size={18} color="#FFF" />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// --- Sub Components ---
const MenuSection = ({ title, items, colors }: any) => (
    <View style={styles.menuSection}>
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
        </View>
        {items.map((item: any, index: number) => (
            <MenuItemCard key={item.id} item={item} isLast={index === items.length - 1} colors={colors} />
        ))}
    </View>
);

const MenuItemCard = ({ item, isLast, colors }: any) => {
    return (
        <TouchableOpacity style={[styles.menuCard, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={styles.menuInfo}>
                <View style={styles.kcalRow}>
                    <AppIcon library={item.iconType === 'flame' ? 'AntDesign' : 'Feather'} name={item.iconType === 'flame' ? 'fire' : 'leaf'} size={14} color={item.iconType === 'flame' ? '#EF4444' : '#22C55E'} />
                    <Text style={[styles.kcalText, { color: colors.textSecondary }]}> {item.kcal}</Text>
                </View>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.menuItemDesc, { color: colors.textSecondary }]} numberOfLines={2}>{item.desc}</Text>
                <Text style={[styles.menuItemPrice, { color: colors.primary }]}>{item.price}</Text>
            </View>

            <View style={styles.menuImageContainer}>
                <Image source={{ uri: item.image }} style={styles.menuImage} />
                {item.isBestseller && (
                    <View style={styles.bestsellerBadge}>
                        <Text style={styles.bestsellerText}>BESTSELLER</Text>
                    </View>
                )}
                <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                    <AppIcon library="Feather" name="plus" size={18} color="#FFF" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 120 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', zIndex: 10 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerRight: { flexDirection: 'row', gap: 8 },
    iconBtn: { padding: 4 },

    // Hero Image
    heroImage: { width: '100%', height: 220, justifyContent: 'flex-end' },
    heroOverlay: { padding: 20, backgroundColor: 'rgba(0,0,0,0.5)', paddingTop: 40 },
    heroMetaTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    openBadge: { backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    openBadgeText: { color: '#000', fontSize: 10, fontWeight: '900' },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
    heroTitleLarge: { color: '#FFF', fontSize: 26, fontWeight: '800', marginBottom: 8 },
    heroMetaBottom: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    metaItem: { flexDirection: 'row', alignItems: 'center' },
    metaText: { color: '#E5E5E5', fontSize: 13, fontWeight: '500' },

    bodyContainer: { padding: 20 },

    // Toggle
    toggleContainer: { flexDirection: 'row', borderRadius: 30, padding: 4, marginBottom: 16 },
    toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 26 },
    toggleActive: { backgroundColor: '#FFF', elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    toggleText: { fontSize: 14, fontWeight: '700' },

    // NEW: Order Info Card
    orderInfoCard: { borderRadius: 16, borderWidth: 1, padding: 12, marginBottom: 24 },
    orderInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    orderIconBg: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    orderInfoText: { flex: 1 },
    orderInfoTitle: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
    orderInfoSub: { fontSize: 13 },

    // Categories
    categoriesScroll: { marginHorizontal: -20, paddingHorizontal: 20, marginBottom: 32 },
    categoryPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
    categoryPillText: { fontSize: 14, fontWeight: '600' },

    // Menu Sections
    menuSection: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '900' },
    viewAllText: { fontSize: 13, fontWeight: '700', marginBottom: 2 },

    // Menu Card
    menuCard: { flexDirection: 'row', paddingVertical: 20, gap: 16 },
    menuInfo: { flex: 1, justifyContent: 'center' },
    kcalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    kcalText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
    menuItemTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
    menuItemDesc: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
    menuItemPrice: { fontSize: 16, fontWeight: '800' },

    menuImageContainer: { position: 'relative', width: 110, height: 110 },
    menuImage: { width: '100%', height: '100%', borderRadius: 16 },
    bestsellerBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 4, borderTopRightRadius: 16, borderBottomLeftRadius: 8 },
    bestsellerText: { color: '#000', fontSize: 9, fontWeight: '900' },
    addBtn: { position: 'absolute', bottom: -10, right: -10, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFF' },

    // Floating Cart
    floatingCartContainer: { position: 'absolute', bottom: 30, width: '100%', paddingHorizontal: 20 },
    cartBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 20, elevation: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
    cartLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    cartIconWrapper: { position: 'relative', width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    cartBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: '#FFF', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
    cartBadgeText: { color: '#F97316', fontSize: 10, fontWeight: '900' },
    cartItemsText: { color: '#FFF', fontSize: 14, fontWeight: '800', marginBottom: 2 },
    cartPriceText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
    cartRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    viewCartText: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
});

export default RestaurantDetailScreen;