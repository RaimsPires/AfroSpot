import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { flex: 1 },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
    greetingText: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
    businessName: { fontSize: 20, fontWeight: '900' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    notificationBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, borderWidth: 1 },
    shopAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },

    revenueCard: { borderRadius: 20, padding: 20, marginBottom: 16, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 },
    revenueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    revenueLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    revenueBody: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 24 },
    revenueAmount: { color: '#FFF', fontSize: 36, fontWeight: '900', letterSpacing: -1 },
    growthBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4, marginBottom: 6 },
    growthText: { fontSize: 11, fontWeight: '800' },
    revenueFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 16 },
    revenueFooterText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '500' },

    statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    statBox: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1 },
    statIconBg: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    statValue: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: '600' },

    quickActionsContainer: { marginBottom: 32 },
    quickActionsListContent: { paddingRight: 20 },
    quickActionsSeparator: { width: 5 },
    quickActionBtn: { alignItems: 'center', width: 84 },
    quickActionIconBg: { width: 56, height: 56, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    quickActionLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '900' },
    viewAllText: { fontSize: 13, fontWeight: '700', marginBottom: 2 },

    bookingsContainer: { gap: 12, marginBottom: 32 },
    bookingCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1 },
    bookingTimeCol: { alignItems: 'center', minWidth: 50 },
    bookingTimeText: { fontSize: 15, fontWeight: '800' },
    bookingAmPm: { fontSize: 11, fontWeight: '700' },
    bookingDivider: { width: 1, height: '100%', marginHorizontal: 12 },
    bookingDetails: { flex: 1 },
    bookingHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    bookingCustomer: { fontSize: 15, fontWeight: '800' },
    statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '800' },
    bookingService: { fontSize: 13 },
    bookingAvatar: { width: 44, height: 44, borderRadius: 22 },

    customersScroll: { gap: 16, paddingRight: 20 },
    customerItem: { alignItems: 'center', width: 64 },
    customerAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, marginBottom: 8 },
    customerName: { fontSize: 12, fontWeight: '600' },
});
