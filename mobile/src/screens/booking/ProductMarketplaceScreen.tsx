
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const CATEGORIES = ['All', 'Fashion', 'Spices', 'Home Decor', 'Art'];

const PRODUCTS = [
    {
        id: '1',
        brand: 'HERITAGE WEAVES',
        title: 'Handwoven Kente',
        price: '$85.00',
        rating: '4.9',
        isNew: true,
        isAfro: true,
        image: 'https://images.unsplash.com/photo-1605497788044-5a32c707d2c6?q=80&w=300',
    },
    {
        id: '2',
        brand: 'ADDIS FLAVORS',
        title: 'Berbere Spice Blend',
        price: '$18.50',
        rating: '4.8',
        isNew: false,
        isAfro: true,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=300',
    },
    {
        id: '3',
        brand: 'TAMALE ORGANICS',
        title: 'Shea Butter Luxe',
        price: '$24.00',
        rating: '5',
        isNew: false,
        isAfro: true,
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=300',
    },
    {
        id: '4',
        brand: 'LAGOS LUXURY',
        title: 'Adire Silk Scarf',
        price: '$45.00',
        rating: '4.7',
        isNew: true,
        isAfro: false,
        image: 'https://images.unsplash.com/photo-1583391733958-d25e07fac0ec?q=80&w=300',
    },
    {
        id: '5',
        brand: 'BENIN ARTS',
        title: 'Bronze Ife Head',
        price: '$120.00',
        rating: '4.9',
        isNew: false,
        isAfro: true,
        image: 'https://images.unsplash.com/photo-1544413165-388a109a250b?q=80&w=300',
    },
    {
        id: '6',
        brand: 'SPICE ISLAND',
        title: 'Zanzibar Pepper Mix',
        price: '$12.00',
        rating: '4.5',
        isNew: false,
        isAfro: false,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=300', // Reused for mock
    },
];

const ProductMarketplaceScreen = () => {
    const { colors, isDark } = useTheme();
    const [activeCategory, setActiveCategory] = useState('All');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Marketplace</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="shopping-bag" size={22} color={colors.text} />
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 2. Search & Filter */}
                <View style={styles.searchRow}>
                    <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
                        <AppIcon library="Feather" name="search" size={18} color={colors.textSecondary} />
                        <TextInput
                            placeholder="Search African products..."
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.searchInput, { color: colors.text }]}
                        />
                    </View>
                    <TouchableOpacity style={[styles.filterBtn, { borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="filter" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* 3. Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
                    <TouchableOpacity>
                        <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
                    {CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat;
                        return (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                style={[
                                    styles.categoryPill,
                                    {
                                        backgroundColor: isActive ? colors.primary : colors.background,
                                        borderColor: isActive ? colors.primary : colors.border,
                                    },
                                ]}
                            >
                                <Text style={[
                                    styles.categoryPillText,
                                    { color: isActive ? '#FFF' : colors.textSecondary }
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* 4. Hero Banner */}
                <View style={styles.bannerContainer}>
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1544413165-388a109a250b?q=80&w=800' }} // Mock artisan image
                        style={styles.bannerImage}
                        imageStyle={{ borderRadius: 16 }}
                    >
                        <View style={styles.bannerOverlay}>
                            <Text style={styles.bannerSubtitle}>LIMITED EDITION</Text>
                            <Text style={styles.bannerTitle}>Artisan Summer{'\n'}Collection</Text>
                            <Text style={styles.bannerDesc}>Up to 30% off traditional wear</Text>
                            <TouchableOpacity style={styles.shopNowBtn}>
                                <Text style={[styles.shopNowText, { color: colors.primary }]}>Shop Now</Text>
                                <AppIcon library="Feather" name="arrow-right" size={16} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>

                {/* 5. Featured Products */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>6 items found</Text>
                </View>

                <View style={styles.productGrid}>
                    {PRODUCTS.map((product) => (
                        <ProductCard key={product.id} item={product} colors={colors} />
                    ))}
                </View>

            </ScrollView>

            {/* 6. Sticky Bottom Content (Vendor + Checkout) */}
            <View style={styles.stickyBottomContainer}>
                {/* Vendor of the Month Card */}
                <TouchableOpacity style={[styles.vendorCard, { backgroundColor: colors.background, shadowColor: colors.text }]}>
                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=47' }} style={styles.vendorAvatar} />
                    <View style={styles.vendorInfo}>
                        <Text style={[styles.vendorLabel, { color: colors.primary }]}>VENDOR OF THE MONTH</Text>
                        <Text style={[styles.vendorName, { color: colors.text }]}>Amara's Heritage Art</Text>
                        <Text style={[styles.vendorDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                            Contemporary art with a traditional twist
                        </Text>
                    </View>
                    <AppIcon library="Feather" name="arrow-right" size={20} color={colors.primary} />
                </TouchableOpacity>

                {/* Checkout Button */}
                <TouchableOpacity style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}>
                    <View style={styles.checkoutLeft}>
                        <View style={styles.checkoutIconBg}>
                            <AppIcon library="Feather" name="shopping-bag" size={18} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.checkoutTitle}>CHECKOUT</Text>
                            <Text style={styles.checkoutSub}>3 items in bag</Text>
                        </View>
                    </View>
                    <View style={styles.checkoutRight}>
                        <Text style={styles.checkoutPrice}>$127.50</Text>
                        <AppIcon library="Feather" name="arrow-right" size={18} color="#FFF" />
                    </View>
                </TouchableOpacity>
            </View>

            {/* 7. Bottom Navigation */}
            <View style={[styles.bottomNav, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <NavTab icon="home" label="Home" active colors={colors} />
                <NavTab icon="compass" label="Discover" colors={colors} />
                <NavTab icon="map" label="Map" colors={colors} />
                <NavTab icon="heart" label="Favorites" colors={colors} />
                <NavTab icon="user" label="Profile" colors={colors} />
            </View>
        </SafeAreaView>
    );
};

// --- Sub Components ---

const ProductCard = ({ item, colors }: any) => {
    return (
        <View style={[styles.productCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.productImageContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage} />

                {/* Badges */}
                <View style={styles.badgesContainer}>
                    {item.isNew && (
                        <View style={[styles.badge, { backgroundColor: '#22C55E' }]}>
                            <Text style={styles.badgeText}>NEW</Text>
                        </View>
                    )}
                    {item.isAfro && (
                        <View style={[styles.badgeOutline, { borderColor: colors.primary }]}>
                            <AppIcon library="Feather" name="check-circle" size={8} color={colors.primary} />
                            <Text style={[styles.badgeOutlineText, { color: colors.primary }]}> AFRO</Text>
                        </View>
                    )}
                </View>

                {/* Add Button */}
                <TouchableOpacity style={styles.addBtn}>
                    <AppIcon library="Feather" name="plus" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.productInfo}>
                <Text style={[styles.productBrand, { color: colors.textSecondary }]}>{item.brand}</Text>
                <Text style={[styles.productTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                <View style={styles.productFooter}>
                    <Text style={[styles.productPrice, { color: colors.primary }]}>{item.price}</Text>
                    <View style={styles.ratingRow}>
                        <AppIcon library="Feather" name="star" size={10} color="#F59E0B" />
                        <Text style={[styles.ratingText, { color: colors.textSecondary }]}> {item.rating}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const NavTab = ({ icon, label, active, colors }: any) => (
    <TouchableOpacity style={styles.navTab}>
        <AppIcon library="Feather" name={icon} size={24} color={active ? colors.primary : colors.textSecondary} />
        <Text style={[styles.navLabel, { color: active ? colors.primary : colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
);

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8, position: 'relative' },
    cartBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#EF4444', minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFF' },
    cartBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },

    scrollContent: { paddingBottom: 240, paddingTop: 8 }, // Large padding for floating bottom section

    // Search Row
    searchRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 24 },
    searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderRadius: 24 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
    filterBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

    // Headers
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '800' },
    viewAllText: { fontSize: 13, fontWeight: '700' },

    // Categories
    categoriesScroll: { paddingHorizontal: 20, gap: 10, marginBottom: 24 },
    categoryPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    categoryPillText: { fontSize: 13, fontWeight: '600' },

    // Hero Banner
    bannerContainer: { paddingHorizontal: 20, marginBottom: 32 },
    bannerImage: { width: '100%', height: 160, borderRadius: 16, overflow: 'hidden' },
    bannerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', padding: 20, justifyContent: 'center' },
    bannerSubtitle: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
    bannerTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', marginBottom: 6 },
    bannerDesc: { color: '#FFF', fontSize: 13, opacity: 0.9, marginBottom: 12 },
    shopNowBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 6 },
    shopNowText: { fontSize: 13, fontWeight: '800' },

    // Product Grid
    productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between' },
    productCard: { width: (width - 44) / 2, borderRadius: 16, borderWidth: 1, marginBottom: 16, padding: 8 },
    productImageContainer: { width: '100%', height: 140, borderRadius: 12, backgroundColor: '#F5F5F5', marginBottom: 24, position: 'relative' },
    productImage: { width: '100%', height: '100%', borderRadius: 12 },

    badgesContainer: { position: 'absolute', top: 8, left: 8, gap: 4 },
    badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    badgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
    badgeOutline: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    badgeOutlineText: { fontSize: 9, fontWeight: '800' },

    addBtn: { position: 'absolute', bottom: -16, right: 8, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },

    productInfo: { paddingHorizontal: 4 },
    productBrand: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' },
    productTitle: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
    productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    productPrice: { fontSize: 15, fontWeight: '900' },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { fontSize: 12, fontWeight: '600' },

    // Sticky Bottom (Vendor + Checkout)
    stickyBottomContainer: { position: 'absolute', bottom: 85, width: '100%', paddingHorizontal: 20, gap: 12 },

    // Vendor Card
    vendorCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, elevation: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    vendorAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
    vendorInfo: { flex: 1 },
    vendorLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
    vendorName: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
    vendorDesc: { fontSize: 12 },

    // Checkout Button
    checkoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, elevation: 6, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
    checkoutLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    checkoutIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
    checkoutTitle: { color: '#FFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
    checkoutSub: { color: '#FFF', fontSize: 13, fontWeight: '500', opacity: 0.9 },
    checkoutRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    checkoutPrice: { color: '#FFF', fontSize: 16, fontWeight: '900' },

    // Bottom Navigation
    bottomNav: { flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%', borderTopWidth: 1, paddingBottom: 30, paddingTop: 12, paddingHorizontal: 10 },
    navTab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
    navLabel: { fontSize: 10, fontWeight: '700' },
});

export default ProductMarketplaceScreen;