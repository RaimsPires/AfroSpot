import OrderStatusBadge from '@components/orders/OrderStatusBadge';
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { getOrderById } from '@services/orderService';
import type { TrackingEvent } from '@type/commerce';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const TrackingRow = ({ event, isLast }: { event: TrackingEvent; isLast: boolean }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.timelineRow}>
            <View style={styles.timelineRail}>
                <View style={[styles.timelineDot, { backgroundColor: event.complete ? colors.primary : colors.border }]} />
                {!isLast ? <View style={[styles.timelineLine, { backgroundColor: colors.border }]} /> : null}
            </View>
            <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, { color: colors.text }]}>{event.title}</Text>
                <Text style={[styles.timelineDetail, { color: colors.textSecondary }]}>{event.detail}</Text>
                <Text style={[styles.timelineTime, { color: colors.textSecondary }]}>{event.timestamp}</Text>
            </View>
        </View>
    );
};

const OrderTrackingScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const isFocused = useIsFocused();
    const [order, setOrder] = useState(getOrderById(route.params.orderId));

    useEffect(() => {
        if (!isFocused) {
            return;
        }

        setOrder(getOrderById(route.params.orderId));
    }, [isFocused, route.params.orderId]);

    if (!order) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <View style={styles.emptyState}><Text style={[styles.emptyTitle, { color: colors.text }]}>Tracking unavailable</Text></View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Track Order</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                    <OrderStatusBadge status={order.status} />
                    <Text style={[styles.summaryText, { color: colors.textSecondary }]}>Tracking number: {order.trackingNumber ?? 'Generated when seller ships the order'}</Text>
                </View>

                <View style={[styles.timelineCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    {order.trackingEvents.map((event, index) => (
                        <TrackingRow key={event.id} event={event} isLast={index === order.trackingEvents.length - 1} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconButton: { padding: 8 },
    content: { paddingHorizontal: 20, paddingBottom: 30 },
    summaryCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 16, gap: 10 },
    orderId: { fontSize: 18, fontWeight: '900' },
    summaryText: { fontSize: 14, lineHeight: 21 },
    timelineCard: { borderWidth: 1, borderRadius: 18, padding: 16 },
    timelineRow: { flexDirection: 'row' },
    timelineRail: { width: 22, alignItems: 'center' },
    timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
    timelineLine: { width: 2, flex: 1, marginTop: 4 },
    timelineContent: { flex: 1, paddingBottom: 20, paddingLeft: 8 },
    timelineTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
    timelineDetail: { fontSize: 14, lineHeight: 21, marginBottom: 6 },
    timelineTime: { fontSize: 12, fontWeight: '600' },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 20, fontWeight: '900' },
});

export default OrderTrackingScreen;
