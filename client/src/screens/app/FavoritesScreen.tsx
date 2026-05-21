import React, { useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';


// --- Mock Data ---
const TABS = ['All', 'Restaurants', 'Businesses', 'Products'];

const SAVED_ITEMS = [
    {
        id: '1',
        type: 'Restaurants',
        title: "Mama Ashanti's Kitchen",
        subtitle: 'West African • 1.2 miles away',
        rating: '4.8',
        reviews: '500+',
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=300',
        isOpen: true,
    },
    {
        id: '2',
        type: 'Products',
        title: 'Adire Silk Scarf',
        brand: 'LAGOS LUXURY',
        price: '$45.00',
        image: 'https://images.unsplash.com/photo-1583391733958-d25e07fac0ec?q=80&w=300',
        inStock: true,
    },
    {
        id: '3',
        type: 'Businesses',
        title: 'Kushite Cutz & Styles',
        subtitle: 'Barbershop • 0.8 miles away',
        rating: '4.9',
        reviews: '128',
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=300',
        isOpen: false,
    },
    {
        id: '4',
        type: 'Products',
        title: 'Berbere Spice Blend',
        brand: 'ADDIS FLAVORS',
        price: '$18.50',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=300',
        inStock: true,
    },
    {
        id: '5',
        type: 'Restaurants',
        title: 'Jollof Village',
        subtitle: 'Nigerian • 3.5 miles away',
        rating: '4.6',
        reviews: '342',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=300',
        isOpen: true,
    },
];

const FavoritesScreen = () => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('All');

    // Filter logic
    const filteredItems = SAVED_ITEMS.filter(
        (item) => activeTab === 'All' || item.type === activeTab
    );

    const renderItem = ({ item }: any) => {
        const isProduct = item.type === 'Products';

        return (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                    {/* Status Badge */}
                    {!isProduct && (
                        <View style={[styles.statusBadge, { backgroundColor: item.isOpen ? '#22C55E' : '#EF4444' }]}>
                            <Text style={styles.statusText}>{item.isOpen ? 'OPEN' : 'CLOSED'}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardInfo}>
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                            {isProduct && <Text style={[styles.brandText, { color: colors.textSecondary }]}>{item.brand}</Text>}
                            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                                {item.title}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.heartBtn}>
                            <AppIcon library="AntDesign" name="heart" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>

                    {!isProduct ? (
                        // Restaurant / Business Info
                        <View style={styles.metaContainer}>
                            <Text style={[styles.subtitleText, { color: colors.textSecondary }]} numberOfLines={1}>
                                {item.subtitle}
                            </Text>
                            <View style={styles.ratingRow}>
                                <AppIcon library="AntDesign" name="star" size={12} color="#F59E0B" />
                                <Text style={[styles.ratingText, { color: colors.text }]}>
                                    {item.rating} <Text style={{ color: colors.textSecondary, fontWeight: 'normal' }}>({item.reviews})</Text>
                                </Text>
                            </View>
                        </View>
                    ) : (
                        // Product Info
                        <View style={styles.metaContainer}>
                            <Text style={[styles.priceText, { color: colors.primary }]}>{item.price}</Text>
                            <Text style={[styles.stockText, { color: item.inStock ? '#22C55E' : '#EF4444' }]}>
                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </Text>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
                        {isProduct ? (
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                                <AppIcon library="Feather" name="shopping-bag" size={14} color="#FFF" />
                                <Text style={[styles.actionBtnText, { color: '#FFF' }]}>Add to Cart</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.actionBtnOutline, { borderColor: colors.border }]}>
                                <Text style={[styles.actionBtnOutlineText, { color: colors.text }]}>
                                    {item.type === 'Restaurants' ? 'Order Now' : 'Book Now'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Items</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="search" size={22} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* 2. Filter Tabs */}
            <View style={styles.tabsWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                style={[
                                    styles.tabPill,
                                    {
                                        backgroundColor: isActive ? colors.primary : colors.background,
                                        borderColor: isActive ? colors.primary : colors.border,
                                    },
                                ]}
                            >
                                <Text style={[styles.tabPillText, { color: isActive ? '#FFF' : colors.textSecondary }]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* 3. Saved Items List */}
            <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={[styles.emptyIconBg, { backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="heart" size={40} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No saved items yet</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                            Explore AfroSpot and tap the heart icon to save your favorite spots and products here.
                        </Text>
                        <TouchableOpacity style={[styles.exploreBtn, { backgroundColor: colors.primary }]}>
                            <Text style={styles.exploreBtnText}>Explore Now</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 22, fontWeight: '900' },
    iconBtn: { padding: 4 },

    // Tabs
    tabsWrapper: { paddingTop: 16, paddingBottom: 8 },
    tabsScroll: { paddingHorizontal: 20, gap: 10 },
    tabPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    tabPillText: { fontSize: 13, fontWeight: '700' },

    // List
    listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },

    // Unified Card
    card: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, marginBottom: 16, padding: 12, elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
    imageContainer: { position: 'relative' },
    cardImage: { width: 100, height: 100, borderRadius: 12 },
    statusBadge: { position: 'absolute', top: 6, left: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    statusText: { color: '#FFF', fontSize: 9, fontWeight: '900' },

    cardInfo: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    brandText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2, textTransform: 'uppercase' },
    cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    heartBtn: { padding: 4, marginRight: -4, marginTop: -4 },

    metaContainer: { marginBottom: 8 },
    subtitleText: { fontSize: 13, marginBottom: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { fontSize: 13, fontWeight: '700', marginLeft: 4 },

    priceText: { fontSize: 16, fontWeight: '900', marginBottom: 2 },
    stockText: { fontSize: 11, fontWeight: '700' },

    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, gap: 6 },
    actionBtnText: { fontSize: 13, fontWeight: '700' },
    actionBtnOutline: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
    actionBtnOutlineText: { fontSize: 13, fontWeight: '700' },

    // Empty State
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 20 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    exploreBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 },
    exploreBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});

export default FavoritesScreen;