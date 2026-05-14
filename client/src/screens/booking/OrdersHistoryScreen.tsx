import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const TABS = ['Active', 'Completed', 'Cancelled'];

const MOCK_ORDERS = [
  {
    id: 'ORD-5521',
    status: 'Active',
    subStatus: 'In Transit',
    businessName: 'Heritage Weaves',
    itemSummary: 'Handwoven Kente (+2 items)',
    itemCount: 3,
    date: 'May 12, 2026',
    total: '$127.50',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=200',
    type: 'Product',
  },
  {
    id: 'ORD-4410',
    status: 'Active',
    subStatus: 'Preparing',
    businessName: "Mama Ashanti's Kitchen",
    itemSummary: "Mama's Jollof Supreme, Kelewele",
    itemCount: 2,
    date: 'May 14, 2026',
    total: '$27.00',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=200',
    type: 'Food',
  },
  {
    id: 'ORD-3392',
    status: 'Completed',
    subStatus: 'Delivered',
    businessName: 'Addis Flavors',
    itemSummary: 'Berbere Spice Blend (Pack of 3)',
    itemCount: 3,
    date: 'Apr 28, 2026',
    total: '$55.50',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=200',
    type: 'Product',
  },
  {
    id: 'ORD-2104',
    status: 'Completed',
    subStatus: 'Delivered',
    businessName: 'Lagos Luxury',
    itemSummary: 'Adire Silk Scarf',
    itemCount: 1,
    date: 'Apr 15, 2026',
    total: '$45.00',
    image: 'https://images.unsplash.com/photo-1583391733958-d25e07fac0ec?q=80&w=200',
    type: 'Product',
  },
  {
    id: 'ORD-1102',
    status: 'Cancelled',
    subStatus: 'Refunded',
    businessName: 'Tamale Organics',
    itemSummary: 'Shea Butter Luxe',
    itemCount: 1,
    date: 'Mar 10, 2026',
    total: '$24.00',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=200',
    type: 'Product',
  },
];

const OrdersHistoryScreen = () => {
  const navigation = useNavigation<AppStackNavigationProp<'OrdersHistory'>>();
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('Active');

  const filteredOrders = MOCK_ORDERS.filter((order) => order.status === activeTab);

  const getStatusStyle = (subStatus: string) => {
    switch (subStatus) {
      case 'In Transit': case 'Preparing': return { color: colors.primary, bg: colors.primary + '15' };
      case 'Delivered': return { color: '#22C55E', bg: '#22C55E15' };
      case 'Refunded': return { color: '#6B7280', bg: '#F3F4F6' };
      default: return { color: '#EF4444', bg: '#EF444415' };
    }
  };

  const renderOrderCard = ({ item }: any) => {
    const statusStyle = getStatusStyle(item.subStatus);

    return (
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Card Header: Order ID & Status */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.orderId, { color: colors.text }]}>{item.id}</Text>
            <Text style={[styles.orderDate, { color: colors.textSecondary }]}>{item.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.subStatus}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Card Body: Image & Info */}
        <View style={styles.cardBody}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={[styles.businessName, { color: colors.text }]} numberOfLines={1}>{item.businessName}</Text>
            <Text style={[styles.itemSummary, { color: colors.textSecondary }]} numberOfLines={1}>{item.itemSummary}</Text>
            <View style={styles.priceRow}>
                <Text style={[styles.totalPrice, { color: colors.primary }]}>{item.total}</Text>
                <Text style={[styles.itemCount, { color: colors.textSecondary }]}>• {item.itemCount} items</Text>
            </View>
          </View>
        </View>

        {/* Card Footer: Actions */}
        <View style={styles.cardFooter}>
          {item.status === 'Active' ? (
            <>
              <TouchableOpacity style={[styles.btnSecondary, { borderColor: colors.border }]}>
                <Text style={[styles.btnSecondaryText, { color: colors.text }]}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.primary }]}>
                <AppIcon library="Feather" name="truck" size={14} color="#FFF" />
                <Text style={styles.btnPrimaryText}>Track Order</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.btnSecondary, { borderColor: colors.border }]}>
                <Text style={[styles.btnSecondaryText, { color: colors.text }]}>Get Help</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.primary }]}>
                <AppIcon library="Feather" name="refresh-cw" size={14} color="#FFF" />
                <Text style={styles.btnPrimaryText}>Buy Again</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order History</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <AppIcon library="Feather" name="download" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tab Filter */}
      <View style={styles.tabsWrapper}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabItem, isActive && { borderBottomColor: colors.primary }]}
            >
              <Text style={[styles.tabText, { color: isActive ? colors.primary : colors.textSecondary, fontWeight: isActive ? '800' : '600' }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBg, { backgroundColor: colors.surface }]}>
              <AppIcon library="Feather" name="shopping-bag" size={40} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No {activeTab.toLowerCase()} orders</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Items you purchase from the marketplace or restaurants will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  iconBtn: { padding: 8 },

  tabsWrapper: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 16, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabText: { fontSize: 14 },

  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },

  // Card
  card: { borderRadius: 16, borderWidth: 1, marginBottom: 16, padding: 16, elevation: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderId: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  orderDate: { fontSize: 12, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800' },
  
  divider: { height: 1, width: '100%', marginBottom: 16 },
  
  cardBody: { flexDirection: 'row', marginBottom: 20 },
  itemImage: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  itemDetails: { flex: 1, justifyContent: 'center' },
  businessName: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  itemSummary: { fontSize: 13, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  totalPrice: { fontSize: 15, fontWeight: '900', marginRight: 8 },
  itemCount: { fontSize: 12 },

  cardFooter: { flexDirection: 'row', gap: 12 },
  btnSecondary: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  btnSecondaryText: { fontSize: 13, fontWeight: '700' },
  btnPrimary: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  btnPrimaryText: { color: '#FFF', fontSize: 13, fontWeight: '800' },

  // Empty State
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

export default OrdersHistoryScreen;