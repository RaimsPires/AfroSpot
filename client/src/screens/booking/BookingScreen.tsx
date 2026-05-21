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

import { AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp, AppStackRouteProp } from '@navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- Mock Data ---
const SERVICES = [
    { id: 's1', title: 'Fresh Fade & Lineup', price: 35, time: '45 min', image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400' },
    { id: 's2', title: 'Traditional Braiding', price: 85, time: '120 min', image: 'https://images.unsplash.com/photo-1605497788044-5a32c707d2c6?q=80&w=400' },
];

const PROFESSIONALS = [
    { id: 'p1', name: 'Kwame O.', role: 'Master Barber', rating: '4.9', isOnline: true, image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=200' },
    { id: 'p2', name: 'Amara J.', role: 'Braiding Expert', rating: '5', isOnline: false, image: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=200' },
    { id: 'p3', name: 'Malik T.', role: 'Senior Stylist', rating: '4.8', isOnline: false, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200' },
];

const DATES = [
    { day: 'MON', date: '22', fullDate: 'Oct 22, 2023' },
    { day: 'TUE', date: '23', fullDate: 'Oct 23, 2023' },
    { day: 'WED', date: '24', fullDate: 'Oct 24, 2023' },
    { day: 'THU', date: '25', fullDate: 'Oct 25, 2023' },
    { day: 'FRI', date: '26', fullDate: 'Oct 26, 2023' },
];

const SLOTS = ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];

const BookingScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'Booking'>>();
    const route = useRoute<AppStackRouteProp<'Booking'>>();
    const { colors, isDark } = useTheme();
    const businessId = route.params?.businessId ?? 'kushite-cutz-styles';
    const businessName = route.params?.businessName ?? 'AfroSpot Partner';

    // Selection States
    const [selectedService, setSelectedService] = useState(SERVICES[0]);
    const [selectedPro, setSelectedPro] = useState(PROFESSIONALS[0]);
    const [selectedDate, setSelectedDate] = useState(DATES[0]);
    const [selectedSlot, setSelectedSlot] = useState(SLOTS[1]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Book Service</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="search" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="bell" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.businessBanner}>
                    <Text style={[styles.businessBannerLabel, { color: colors.textSecondary }]}>BOOKING WITH</Text>
                    <Text style={[styles.businessBannerName, { color: colors.text }]}>{businessName}</Text>
                </View>

                {/* 2. Select Service */}
                <SectionHeader title="Select Service" colors={colors} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                    {SERVICES.map((service) => {
                        const isActive = selectedService.id === service.id;
                        return (
                            <TouchableOpacity
                                key={service.id}
                                onPress={() => setSelectedService(service)}
                                style={[
                                    styles.serviceCard,
                                    { borderColor: isActive ? colors.primary : colors.border }
                                ]}
                            >
                                <View style={styles.serviceImageContainer}>
                                    <Image source={{ uri: service.image }} style={styles.serviceImage} />
                                    {isActive && (
                                        <View style={styles.checkOverlay}>
                                            <AppIcon library="Feather" name="check-circle" size={24} color="#FFF" />
                                        </View>
                                    )}
                                </View>
                                <View style={styles.serviceInfo}>
                                    <Text style={[styles.serviceTitle, { color: colors.text }]} numberOfLines={1}>{service.title}</Text>
                                    <View style={styles.serviceMeta}>
                                        <Text style={[styles.servicePrice, { color: colors.primary }]}>${service.price}</Text>
                                        <View style={styles.serviceDuration}>
                                            <AppIcon library="Feather" name="clock" size={12} color={colors.textSecondary} />
                                            <Text style={[styles.serviceDurationText, { color: colors.textSecondary }]}> {service.time}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* 3. Choose Professional */}
                <SectionHeader title="Choose Professional" colors={colors} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                    {PROFESSIONALS.map((pro) => {
                        const isActive = selectedPro.id === pro.id;
                        return (
                            <TouchableOpacity
                                key={pro.id}
                                onPress={() => setSelectedPro(pro)}
                                style={[
                                    styles.proCard,
                                    { borderColor: isActive ? colors.primary : colors.border }
                                ]}
                            >
                                <View style={styles.avatarContainer}>
                                    <Image source={{ uri: pro.image }} style={styles.proAvatar} />
                                    {pro.isOnline && <View style={styles.onlineDot} />}
                                </View>
                                <Text style={[styles.proName, { color: colors.text }]} numberOfLines={1}>{pro.name}</Text>
                                <Text style={[styles.proRole, { color: colors.textSecondary }]} numberOfLines={1}>{pro.role}</Text>
                                <View style={styles.proRating}>
                                    <AppIcon library="AntDesign" name="star" size={10} color="#F59E0B" />
                                    <Text style={[styles.proRatingText, { color: colors.textSecondary }]}> {pro.rating}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* 4. Booking Date */}
                <SectionHeader title="Booking Date" colors={colors} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                    {DATES.map((d) => {
                        const isActive = selectedDate.date === d.date;
                        return (
                            <TouchableOpacity
                                key={d.date}
                                onPress={() => setSelectedDate(d)}
                                style={[
                                    styles.datePill,
                                    {
                                        backgroundColor: isActive ? colors.primary : colors.surface,
                                        borderColor: isActive ? colors.primary : colors.border
                                    }
                                ]}
                            >
                                <Text style={[styles.dateDay, { color: isActive ? '#FFF' : colors.textSecondary }]}>{d.day}</Text>
                                <Text style={[styles.dateNum, { color: isActive ? '#FFF' : colors.text }]}>{d.date}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* 5. Available Slots */}
                <SectionHeader title="Available Slots" colors={colors} />
                <View style={styles.slotsGrid}>
                    {SLOTS.map((slot) => {
                        const isActive = selectedSlot === slot;
                        return (
                            <TouchableOpacity
                                key={slot}
                                onPress={() => setSelectedSlot(slot)}
                                style={[
                                    styles.slotPill,
                                    {
                                        backgroundColor: isActive ? colors.primary : colors.surface,
                                        borderColor: isActive ? colors.primary : colors.border
                                    }
                                ]}
                            >
                                <Text style={[styles.slotText, { color: isActive ? '#FFF' : colors.text }]}>{slot}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* 6. Appointment Summary */}
                <View style={[styles.summaryCard, { backgroundColor: colors.primary + '10' }]}>
                    <View style={styles.summaryHeader}>
                        <Text style={[styles.summaryTitle, { color: colors.text }]}>Appointment Summary</Text>
                        <View style={[styles.summaryPriceBadge, { borderColor: colors.primary }]}>
                            <Text style={[styles.summaryPriceText, { color: colors.primary }]}>${selectedService.price}</Text>
                        </View>
                    </View>

                    <View style={styles.summaryList}>
                        <SummaryItem icon="scissors" label="SERVICE" value={selectedService.title} colors={colors} />
                        <SummaryItem icon="user" label="PROFESSIONAL" value={selectedPro.name} colors={colors} />
                        <SummaryItem icon="calendar" label="DATE & TIME" value={`${selectedDate.fullDate} at ${selectedSlot}`} colors={colors} />
                    </View>

                    <View style={[styles.summaryFooter, { borderTopColor: colors.primary + '20' }]}>
                        <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>* Booking fee may apply at checkout</Text>
                        <AppIcon library="Feather" name="chevron-right" size={14} color={colors.textSecondary} />
                    </View>
                </View>

            </ScrollView>

            {/* 7. Bottom Checkout Bar */}
            <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <View style={styles.totalInfo}>
                    <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>TOTAL PAY</Text>
                    <Text style={[styles.totalPrice, { color: colors.text }]}>${selectedService.price}</Text>
                </View>
                <View style={{ flex: 1.5 }}>
                    <AppButton
                        title="Confirm & Pay"
                        leftIcon='credit-card'
                        onPress={() => navigation.navigate('CheckoutPayment', { businessId })}
                    />
                </View>
            </View>

        </SafeAreaView>
    );
};

// --- Sub Components ---

const SectionHeader = ({ title, colors }: any) => (
    <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
        </TouchableOpacity>
    </View>
);

const SummaryItem = ({ icon, label, value, colors }: any) => (
    <View style={styles.summaryItem}>
        <View style={[styles.summaryIconBg, { backgroundColor: colors.background }]}>
            <AppIcon library="Feather" name={icon} size={16} color={colors.primary} />
        </View>
        <View style={styles.summaryItemTexts}>
            <Text style={[styles.summaryItemLabel, { color: colors.textSecondary }]}>{label}</Text>
            <Text style={[styles.summaryItemValue, { color: colors.text }]}>{value}</Text>
        </View>
    </View>
);

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', zIndex: 10 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerRight: { flexDirection: 'row', gap: 8 },
    iconBtn: { padding: 4 },

    scrollContent: { paddingBottom: 120, paddingTop: 16 },
    horizontalScroll: { paddingHorizontal: 20, gap: 16, paddingBottom: 8 },
    businessBanner: { paddingHorizontal: 20, marginBottom: 8 },
    businessBannerLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
    businessBannerName: { fontSize: 18, fontWeight: '800' },

    // Section Headers
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12, marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '800' },
    viewAllText: { fontSize: 13, fontWeight: '700' },

    // Service Card
    serviceCard: { width: 180, borderWidth: 2, borderRadius: 16, overflow: 'hidden' },
    serviceImageContainer: { height: 100, width: '100%', position: 'relative' },
    serviceImage: { width: '100%', height: '100%' },
    checkOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
    serviceInfo: { padding: 12 },
    serviceTitle: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
    serviceMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    servicePrice: { fontSize: 16, fontWeight: '800' },
    serviceDuration: { flexDirection: 'row', alignItems: 'center' },
    serviceDurationText: { fontSize: 12 },

    // Professional Card
    proCard: { width: 110, borderWidth: 2, borderRadius: 16, padding: 12, alignItems: 'center' },
    avatarContainer: { position: 'relative', marginBottom: 8 },
    proAvatar: { width: 60, height: 60, borderRadius: 30 },
    onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#FFF' },
    proName: { fontSize: 13, fontWeight: '800', marginBottom: 2 },
    proRole: { fontSize: 11, marginBottom: 6 },
    proRating: { flexDirection: 'row', alignItems: 'center' },
    proRatingText: { fontSize: 11, fontWeight: '600' },

    // Date Pills
    datePill: { width: 64, height: 80, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    dateDay: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
    dateNum: { fontSize: 22, fontWeight: '800' },

    // Time Slots
    slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12 },
    slotPill: { width: (width - 64) / 3, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
    slotText: { fontSize: 13, fontWeight: '700' },

    // Summary Card
    summaryCard: { marginHorizontal: 20, marginTop: 32, borderRadius: 16, padding: 20 },
    summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    summaryTitle: { fontSize: 16, fontWeight: '800' },
    summaryPriceBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: '#FFF' },
    summaryPriceText: { fontSize: 14, fontWeight: '800' },

    summaryList: { gap: 16 },
    summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    summaryIconBg: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    summaryItemTexts: { flex: 1 },
    summaryItemLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
    summaryItemValue: { fontSize: 14, fontWeight: '700' },

    summaryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTopWidth: 1 },
    disclaimerText: { fontSize: 12, fontStyle: 'italic' },

    // Bottom Checkout Bar
    bottomBar: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 34, borderTopWidth: 1, alignItems: 'center', gap: 20 },
    totalInfo: { flex: 1 },
    totalLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
    totalPrice: { fontSize: 24, fontWeight: '900' },
});

export default BookingScreen;