import React, { useState } from 'react';
import {
    Dimensions,
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

const { width } = Dimensions.get('window');

// --- Mock Data ---
const TIMEFRAMES = ['Today', 'This Week', 'This Month', 'This Year'];

const METRICS = {
    revenue: '$4,250.00',
    revenueGrowth: '+12.5%',
    bookings: 42,
    productSales: 89,
    avgOrderValue: '$48.50',
};

// Simulated chart data (percentages for bar heights)
const CHART_DATA = [
    { label: 'Mon', value: 40 },
    { label: 'Tue', value: 65 },
    { label: 'Wed', value: 30 },
    { label: 'Thu', value: 85 },
    { label: 'Fri', value: 100 },
    { label: 'Sat', value: 120 }, // >100 goes over the visual baseline, simulated max
    { label: 'Sun', value: 90 },
];

const TOP_PRODUCTS = [
    { id: '1', title: 'Adire Silk Scarf', sales: 45, revenue: '$2,025', image: 'https://images.unsplash.com/photo-1583391733958-d25e07fac0ec?q=80&w=200', progress: 100 },
    { id: '2', title: 'Berbere Spice Blend', sales: 28, revenue: '$518', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=200', progress: 60 },
    { id: '3', title: 'Shea Butter Luxe', sales: 16, revenue: '$384', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=200', progress: 35 },
];

const TOP_SERVICES = [
    { id: 's1', title: 'Fresh Fade & Lineup', bookings: 24, revenue: '$840', progress: 100 },
    { id: 's2', title: 'Beard Grooming & Shape', bookings: 12, revenue: '$300', progress: 50 },
    { id: 's3', title: 'Full Grooming Experience', bookings: 6, revenue: '$390', progress: 25 },
];

export const StoreAnalyticsScreen = ({ navigation }) => {
    const { colors, isDark } = useTheme();
    const [activeTimeframe, setActiveTimeframe] = useState('This Week');

    // Find max value in chart data to scale bars
    const maxChartValue = Math.max(...CHART_DATA.map(d => d.value));

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Analytics & Reports</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="download" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* 2. Timeframe Filter */}
            <View style={styles.tabsWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    {TIMEFRAMES.map((tf) => {
                        const isActive = activeTimeframe === tf;
                        return (
                            <TouchableOpacity
                                key={tf}
                                onPress={() => setActiveTimeframe(tf)}
                                style={[
                                    styles.tabPill,
                                    {
                                        backgroundColor: isActive ? colors.primary : colors.surface,
                                        borderColor: isActive ? colors.primary : colors.border,
                                    },
                                ]}
                            >
                                <Text style={[styles.tabPillText, { color: isActive ? '#FFF' : colors.textSecondary }]}>
                                    {tf}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 3. Main Revenue Metric */}
                <View style={[styles.mainMetricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.metricHeaderRow}>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>TOTAL REVENUE</Text>
                    <View style={[styles.growthBadge, { backgroundColor: colors.successSurface }]}>
                        <AppIcon library="Feather" name="trending-up" size={12} color={colors.success} />
                        <Text style={[styles.growthText, { color: colors.success }]}>{METRICS.revenueGrowth}</Text>
                        </View>
                    </View>
                    <Text style={[styles.metricValue, { color: colors.text }]}>{METRICS.revenue}</Text>
                    <Text style={[styles.metricSub, { color: colors.textSecondary }]}>vs previous {activeTimeframe.toLowerCase().replace('this ', '')}</Text>
                </View>

                {/* 4. Secondary Metrics Grid */}
                <View style={styles.metricsGrid}>
                    <View style={[styles.gridBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="shopping-bag" size={20} color={colors.primary} style={{ marginBottom: 8 }} />
                        <Text style={[styles.gridValue, { color: colors.text }]}>{METRICS.productSales}</Text>
                        <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Products Sold</Text>
                    </View>
                    <View style={[styles.gridBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="calendar" size={20} color={colors.primary} style={{ marginBottom: 8 }} />
                        <Text style={[styles.gridValue, { color: colors.text }]}>{METRICS.bookings}</Text>
                        <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Services Booked</Text>
                    </View>
                    <View style={[styles.gridBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="pie-chart" size={20} color={colors.primary} style={{ marginBottom: 8 }} />
                        <Text style={[styles.gridValue, { color: colors.text }]}>{METRICS.avgOrderValue}</Text>
                        <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Avg. Order Value</Text>
                    </View>
                </View>

                {/* 5. Revenue Chart (Simulated) */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue Trend</Text>
                    <View style={[styles.chartContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.chartBars}>
                            {CHART_DATA.map((data, index) => {
                                // Calculate height relative to max value (leaving some padding at top)
                                const barHeight = Number.parseFloat(`${(data.value / maxChartValue) * 85}%`);
                                return (
                                    <View key={index} style={styles.barCol}>
                                        <View style={[styles.barBg, { backgroundColor: colors.border }]}>
                                            <View style={[styles.barFill, { height: barHeight, backgroundColor: colors.primary }]} />
                                        </View>
                                        <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{data.label}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* 6. Top Performing Products */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Top Products</Text>
                        <TouchableOpacity>
                            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        {TOP_PRODUCTS.map((item, index) => (
                            <View key={item.id} style={[styles.listItem, index !== TOP_PRODUCTS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                                <Image source={{ uri: item.image }} style={styles.itemThumbnail} />
                                <View style={styles.itemInfo}>
                                    <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                                    <Text style={[styles.itemStats, { color: colors.textSecondary }]}>{item.sales} sales • {item.revenue}</Text>
                                    <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                                        <View style={[styles.progressBarFill, { width: `${item.progress}%`, backgroundColor: colors.primary }]} />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 7. Top Performing Services */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Top Services</Text>
                        <TouchableOpacity>
                            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.listContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        {TOP_SERVICES.map((item, index) => (
                            <View key={item.id} style={[styles.listItem, index !== TOP_SERVICES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                                <View style={[styles.serviceIconBg, { backgroundColor: colors.primary + '15' }]}>
                                    <AppIcon library="Feather" name="scissors" size={18} color={colors.primary} />
                                </View>
                                <View style={styles.itemInfo}>
                                    <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                                    <Text style={[styles.itemStats, { color: colors.textSecondary }]}>{item.bookings} bookings • {item.revenue}</Text>
                                    <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                                        <View style={[styles.progressBarFill, { width: `${item.progress}%`, backgroundColor: colors.primary }]} />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    // Timeframe Tabs
    tabsWrapper: { paddingTop: 16, paddingBottom: 8 },
    tabsScroll: { paddingHorizontal: 20, gap: 10 },
    tabPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    tabPillText: { fontSize: 13, fontWeight: '700' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 12 },

    // Main Metric Card
    mainMetricCard: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
    metricHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    metricLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    growthBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
    growthText: { fontSize: 11, fontWeight: '800' },
    metricValue: { fontSize: 36, fontWeight: '900', marginBottom: 4, letterSpacing: -1 },
    metricSub: { fontSize: 13, fontWeight: '500' },

    // Secondary Metrics Grid
    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    gridBox: { width: (width - 40 - 24) / 3, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
    gridValue: { fontSize: 18, fontWeight: '900', marginBottom: 4 },
    gridLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },

    section: { marginBottom: 32 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
    viewAllText: { fontSize: 13, fontWeight: '700' },

    // Chart Simulation
    chartContainer: { height: 200, borderRadius: 16, borderWidth: 1, padding: 16, justifyContent: 'flex-end' },
    chartBars: { flexDirection: 'row', justifyContent: 'space-between', height: '100%', alignItems: 'flex-end' },
    barCol: { alignItems: 'center', width: 30, height: '100%', justifyContent: 'flex-end' },
    barBg: { width: 12, height: '80%', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden', marginBottom: 8 },
    barFill: { width: '100%', borderRadius: 6 },
    barLabel: { fontSize: 10, fontWeight: '600' },

    // Lists (Top Products/Services)
    listContainer: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    listItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    itemThumbnail: { width: 48, height: 48, borderRadius: 8, marginRight: 16 },
    serviceIconBg: { width: 48, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    itemInfo: { flex: 1 },
    itemTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
    itemStats: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
    progressBarBg: { width: '100%', height: 4, borderRadius: 2, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 2 },
});