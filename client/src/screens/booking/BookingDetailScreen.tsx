import React from 'react';
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

import { AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp, AppStackRouteProp } from '@navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const BOOKING_DATA = {
    id: 'BK-88294',
    status: 'Confirmed',
    title: 'Fresh Fade & Lineup',
    businessName: 'Kushite Cutz & Styles',
    professional: {
        name: 'Kwame O.',
        role: 'Master Barber',
        avatar: 'https://i.pravatar.cc/150?img=11',
    },
    datetime: 'Friday, Oct 26, 2023 • 04:00 PM',
    location: '124 Atlantic Ave, Brooklyn, NY 11201',
    duration: '45 mins',
    priceBreakdown: {
        service: 35.00,
        tax: 2.50,
        total: 37.50,
    },
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BK-88294',
};

const BookingDetailScreen = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation<AppStackNavigationProp<'BookingDetail'>>();
    const route = useRoute<AppStackRouteProp<'BookingDetail'>>();
    const bookingId = route.params?.bookingId ?? BOOKING_DATA.id;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Booking Details</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="share-2" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 2. Status Card */}
                <View style={[styles.statusCard, { backgroundColor: colors.primary + '10' }]}>
                    <View style={[styles.statusBadge, { backgroundColor: colors.primary }]}>
                        <AppIcon library="Feather" name="check" size={14} color="#FFF" />
                        <Text style={styles.statusText}>{BOOKING_DATA.status}</Text>
                    </View>
                    <Text style={[styles.orderId, { color: colors.textSecondary }]}>ID: {bookingId}</Text>
                </View>

                {/* 3. QR Check-in Section */}
                <View style={styles.qrSection}>
                    <View style={[styles.qrContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Image source={{ uri: BOOKING_DATA.qrCode }} style={styles.qrImage} />
                        <Text style={[styles.qrHint, { color: colors.textSecondary }]}>Show this code at the shop for check-in</Text>
                    </View>
                </View>

                {/* 4. Professional Info */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PROFESSIONAL</Text>
                    <View style={[styles.proRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Image source={{ uri: BOOKING_DATA.professional.avatar }} style={styles.proAvatar} />
                        <View style={styles.proInfo}>
                            <Text style={[styles.proName, { color: colors.text }]}>{BOOKING_DATA.professional.name}</Text>
                            <Text style={[styles.proRole, { color: colors.textSecondary }]}>{BOOKING_DATA.professional.role}</Text>
                        </View>
                        <View style={styles.proActions}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Chat', { businessId: 'kushite-cutz-styles', businessName: BOOKING_DATA.businessName })}
                                style={[styles.proActionBtn, { backgroundColor: colors.primary + '15' }]}
                            >
                                <AppIcon library="Feather" name="message-square" size={18} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.proActionBtn, { backgroundColor: colors.primary + '15' }]}>
                                <AppIcon library="Feather" name="phone" size={18} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 5. Appointment Details */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>APPOINTMENT INFO</Text>
                    <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <DetailItem icon="scissors" label="Service" value={BOOKING_DATA.title} colors={colors} />
                        <DetailItem icon="calendar" label="Date & Time" value={BOOKING_DATA.datetime} colors={colors} />
                        <DetailItem icon="clock" label="Duration" value={BOOKING_DATA.duration} colors={colors} />
                        <DetailItem icon="map-pin" label="Location" value={BOOKING_DATA.location} colors={colors} isLast />
                    </View>
                </View>

                {/* 6. Price Summary */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PAYMENT SUMMARY</Text>
                    <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.priceRow}>
                            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Service Fee</Text>
                            <Text style={[styles.priceValue, { color: colors.text }]}>${BOOKING_DATA.priceBreakdown.service.toFixed(2)}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Taxes</Text>
                            <Text style={[styles.priceValue, { color: colors.text }]}>${BOOKING_DATA.priceBreakdown.tax.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.priceRow, styles.totalRow, { borderTopColor: colors.border }]}>
                            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
                            <Text style={[styles.totalValue, { color: colors.primary }]}>${BOOKING_DATA.priceBreakdown.total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* 7. Cancellation Policy */}
                <View style={styles.policyBox}>
                    <AppIcon library="Feather" name="info" size={16} color={colors.textSecondary} />
                    <Text style={[styles.policyText, { color: colors.textSecondary }]}>
                        Cancel for free before Oct 25, 04:00 PM. After this, a 50% cancellation fee may apply.
                    </Text>
                </View>

            </ScrollView>

            {/* 8. Bottom Actions */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]}>
                    <Text style={[styles.cancelBtnText, { color: '#EF4444' }]}>Cancel Booking</Text>
                </TouchableOpacity>
                <View style={{ flex: 1.5 }}>
                    <AppButton title="Reschedule" onPress={() => navigation.navigate('Booking', { businessId: 'kushite-cutz-styles', businessName: BOOKING_DATA.businessName, serviceType: BOOKING_DATA.title })} />
                </View>
            </View>

        </SafeAreaView>
    );
};

// --- Helper Components ---

const DetailItem = ({ icon, label, value, colors, isLast }: any) => (
    <View style={[styles.detailItem, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <View style={[styles.detailIconBg, { backgroundColor: colors.background }]}>
            <AppIcon library="Feather" name={icon} size={14} color={colors.primary} />
        </View>
        <View style={styles.detailTexts}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
        </View>
    </View>
);

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    scrollContent: { paddingBottom: 120, paddingTop: 16 },

    // Status Card
    statusCard: { marginHorizontal: 20, padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
    statusText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
    orderId: { fontSize: 13, fontWeight: '700' },

    // QR Section
    qrSection: { alignItems: 'center', marginBottom: 32 },
    qrContainer: { padding: 24, borderRadius: 24, borderWidth: 1, alignItems: 'center', width: width * 0.7 },
    qrImage: { width: 140, height: 140, marginBottom: 16 },
    qrHint: { fontSize: 12, fontWeight: '600', textAlign: 'center' },

    // Sections
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },

    // Pro Row
    proRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1 },
    proAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
    proInfo: { flex: 1 },
    proName: { fontSize: 15, fontWeight: '800' },
    proRole: { fontSize: 13 },
    proActions: { flexDirection: 'row', gap: 8 },
    proActionBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

    // Info Card
    infoCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    detailItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
    detailIconBg: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    detailTexts: { flex: 1 },
    detailLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 },
    detailValue: { fontSize: 14, fontWeight: '700' },

    // Price Summary
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
    priceLabel: { fontSize: 14 },
    priceValue: { fontSize: 14, fontWeight: '700' },
    totalRow: { borderTopWidth: 1, marginTop: 8, paddingVertical: 16 },
    totalLabel: { fontSize: 16, fontWeight: '800' },
    totalValue: { fontSize: 18, fontWeight: '900' },

    // Policy Box
    policyBox: { flexDirection: 'row', paddingHorizontal: 24, gap: 10, marginBottom: 20 },
    policyText: { fontSize: 12, lineHeight: 18, flex: 1 },

    // Footer
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1, flexDirection: 'row', gap: 16 },
    cancelBtn: { flex: 1, height: 50, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    cancelBtnText: { fontSize: 14, fontWeight: '700' },
});

export default BookingDetailScreen;