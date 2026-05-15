import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const MOCK_PRODUCTS = [
    { id: 'p1', title: 'Adire Silk Scarf', price: '$45.00', stock: 12, image: 'https://images.unsplash.com/photo-1583391733958-d25e07fac0ec?q=80&w=200' },
    { id: 'p2', title: 'Berbere Spice Blend', price: '$18.50', stock: 45, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=200' },
    { id: 'p3', title: 'Shea Butter Luxe', price: '$24.00', stock: 0, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=200' },
];

const MOCK_SERVICES = [
    { id: 's1', title: 'Fresh Fade & Lineup', price: '$35.00', duration: '45 mins' },
    { id: 's2', title: 'Beard Grooming & Shape', price: '$25.00', duration: '30 mins' },
];

const BusinessStoreScreen = () => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState<'Products' | 'Services'>('Products');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>My Store</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="search" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Store Overview Stats */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{MOCK_PRODUCTS.length}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Products</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{MOCK_SERVICES.length}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Listed Services</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={[styles.tabsWrapper, { backgroundColor: colors.surface }]}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'Products' && [styles.activeTab, { backgroundColor: colors.background }]]}
                    onPress={() => setActiveTab('Products')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'Products' ? colors.text : colors.textSecondary }]}>Products</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'Services' && [styles.activeTab, { backgroundColor: colors.background }]]}
                    onPress={() => setActiveTab('Services')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'Services' ? colors.text : colors.textSecondary }]}>Services</Text>
                </TouchableOpacity>
            </View>

            {/* Content List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {activeTab === 'Products' ? (
                    MOCK_PRODUCTS.map(product => (
                        <View key={product.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Image source={{ uri: product.image }} style={styles.productImg} />
                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{product.title}</Text>
                                <Text style={[styles.itemPrice, { color: colors.primary }]}>{product.price}</Text>
                                <Text style={[styles.stockText, { color: product.stock === 0 ? colors.destructive : colors.success }]}>
                                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.editBtn}>
                                <AppIcon library="Feather" name="edit-2" size={18} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    MOCK_SERVICES.map(service => (
                        <View key={service.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={[styles.serviceIconBg, { backgroundColor: colors.primary + '15' }]}>
                                <AppIcon library="Feather" name="scissors" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{service.title}</Text>
                                <Text style={[styles.itemPrice, { color: colors.primary }]}>{service.price}</Text>
                                <Text style={[styles.stockText, { color: colors.textSecondary }]}>{service.duration}</Text>
                            </View>
                            <TouchableOpacity style={styles.editBtn}>
                                <AppIcon library="Feather" name="edit-2" size={18} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]}>
                <AppIcon library="Feather" name="plus" size={24} color={colors.textInverse} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },
    statsContainer: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
    statCard: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
    statValue: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: '600' },
    tabsWrapper: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 24, padding: 4, marginBottom: 16 },
    tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
    activeTab: { elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    tabText: { fontSize: 13, fontWeight: '700' },
    listContent: { paddingHorizontal: 20, paddingBottom: 100 },
    itemCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
    productImg: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
    serviceIconBg: { width: 60, height: 60, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    itemInfo: { flex: 1, justifyContent: 'center' },
    itemTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
    itemPrice: { fontSize: 14, fontWeight: '900', marginBottom: 4 },
    stockText: { fontSize: 12, fontWeight: '600' },
    editBtn: { padding: 8 },
    fab: { position: 'absolute', bottom: 30, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6 },
});

export default BusinessStoreScreen