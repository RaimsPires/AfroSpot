import OrderStatusBadge from '@components/orders/OrderStatusBadge';
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { BUYER_ORDER_TABS, type BuyerOrderTab, type Order } from '@type/commerce';
import { cancelOrder, canBuyerCancelOrder, getBuyerOrders } from '@services/orderService';
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

const BuyerOrdersScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const isFocused = useIsFocused();
    const [activeTab, setActiveTab] = useState<BuyerOrderTab>(route.params?.initialTab ?? 'Active');
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (route.params?.initialTab) {
            setActiveTab(route.params.initialTab);
        }
    }, [route.params?.initialTab]);

    useEffect(() => {
        if (!isFocused) {
            return;
        }

        setOrders(getBuyerOrders(activeTab));
    }, [activeTab, isFocused]);

    const syncOrders = () => {
        setOrders(getBuyerOrders(activeTab));
    };

    const renderOrder = ({ item }: { item: Order }) => (
        <View style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <View style={styles.cardHeader}>
                <View>
                    <Text style={[styles.orderId, { color: colors.text }]}>{item.id}</Text>
                    <Text style={[styles.orderDate, { color: colors.textSecondary }]}>{item.createdAt}</Text>
                </View>
                <OrderStatusBadge status={item.status} />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.orderBody}>
                <Image source={{ uri: item.items[0].product.image }} style={styles.itemImage} />
                <View style={{ flex: 1 }}>
                    <Text style={[styles.sellerName, { color: colors.text }]}>{item.sellerName}</Text>
                    <Text style={[styles.itemSummary, { color: colors.textSecondary }]} numberOfLines={1}>
                        {item.items[0].product.title}{item.items.length > 1 ? ` +${item.items.length - 1} more` : ''}
                    </Text>
                    <Text style={[styles.totalText, { color: colors.primary }]}>{formatCurrency(item.payment.total)}</Text>
                </View>
            </View>

            <View style={styles.actionsRow}>
                <TouchableOpacity onPress={() => navigation.navigate('BuyerOrderDetail', { orderId: item.id })} style={[styles.secondaryButton, { borderColor: colors.border }]}> 
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>View Details</Text>
                </TouchableOpacity>
                {canBuyerCancelOrder(item) ? (
                    <TouchableOpacity onPress={() => { cancelOrder(item.id, 'buyer'); syncOrders(); }} style={[styles.secondaryButton, { borderColor: colors.destructive }]}> 
                        <Text style={[styles.secondaryButtonText, { color: colors.destructive }]}>Cancel</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })} style={[styles.primaryButton, { backgroundColor: colors.primary }]}> 
                        <AppIcon library="Feather" name="truck" size={14} color={colors.textInverse} />
                        <Text style={[styles.primaryButtonText, { color: colors.textInverse }]}>Track</Text>
                    </TouchableOpacity>
                )}
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>My Orders</Text>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MarketplaceProducts')}>
                    <AppIcon library="Feather" name="shopping-bag" size={18} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={[styles.tabsRow, { borderBottomColor: colors.border }]}> 
                {BUYER_ORDER_TABS.map(tab => {
                    const active = tab === activeTab;
                    return (
                        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabButton, active && { borderBottomColor: colors.primary }]}> 
                            <Text style={[styles.tabText, { color: active ? colors.primary : colors.textSecondary }]}>{tab}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <FlatList
                data={orders}
                renderItem={renderOrder}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconWrap, { backgroundColor: colors.surface }]}> 
                            <AppIcon library="Feather" name="package" size={38} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No {activeTab.toLowerCase()} orders yet</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>New orders placed from the marketplace will appear here immediately.</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('MarketplaceProducts')} style={[styles.primaryCta, { backgroundColor: colors.primary }]}> 
                            <Text style={[styles.primaryCtaText, { color: colors.textInverse }]}>Browse Products</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconButton: { padding: 8 },
    tabsRow: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 20 },
    tabButton: { flex: 1, alignItems: 'center', paddingVertical: 16, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabText: { fontSize: 14, fontWeight: '800' },
    listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30 },
    orderCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
    orderId: { fontSize: 15, fontWeight: '900', marginBottom: 4 },
    orderDate: { fontSize: 12, fontWeight: '600' },
    divider: { height: 1, marginVertical: 16 },
    orderBody: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    itemImage: { width: 64, height: 64, borderRadius: 12 },
    sellerName: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
    itemSummary: { fontSize: 13, marginBottom: 6 },
    totalText: { fontSize: 16, fontWeight: '900' },
    actionsRow: { flexDirection: 'row', gap: 10 },
    secondaryButton: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    secondaryButtonText: { fontSize: 13, fontWeight: '800' },
    primaryButton: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
    primaryButtonText: { fontSize: 13, fontWeight: '800' },
    emptyState: { alignItems: 'center', paddingTop: 90, paddingHorizontal: 32 },
    emptyIconWrap: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
    emptyTitle: { fontSize: 22, fontWeight: '900', marginBottom: 8 },
    emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
    primaryCta: { height: 52, borderRadius: 14, paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center' },
    primaryCtaText: { fontSize: 14, fontWeight: '800' },
});

export default BuyerOrdersScreen;
