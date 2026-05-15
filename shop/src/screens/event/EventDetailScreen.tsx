import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const { width } = Dimensions.get('window');

export const EventDetailScreen = () => {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" translucent />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* 1. Hero Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000' }}
                        style={styles.heroImage}
                    />
                    <SafeAreaView style={styles.headerButtons}>
                        <TouchableOpacity style={styles.circleBtn}><AppIcon library="Feather" name="chevron-left" size={24} color="#FFF" /></TouchableOpacity>
                        <TouchableOpacity style={styles.circleBtn}><AppIcon library="Feather" name="share-2" size={20} color="#FFF" /></TouchableOpacity>
                    </SafeAreaView>
                </View>

                <View style={styles.content}>
                    <View style={[styles.tag, { backgroundColor: colors.primary + '15' }]}>
                        <Text style={[styles.tagText, { color: colors.primary }]}>CULTURAL FESTIVAL</Text>
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>Harlem Afro-Market & Food Fest 2024</Text>

                    <View style={styles.infoRow}>
                        <View style={[styles.iconBox, { backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="calendar" size={18} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={[styles.infoMain, { color: colors.text }]}>Sat, June 15 • 10:00 AM - 8:00 PM</Text>
                            <Text style={[styles.infoSub, { color: colors.textSecondary }]}>Add to Google Calendar</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={[styles.iconBox, { backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="map-pin" size={18} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={[styles.infoMain, { color: colors.text }]}>Marcus Garvey Park, NY</Text>
                            <Text style={[styles.infoSub, { color: colors.textSecondary }]}>0.5 miles from you</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>About Event</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        Join us for the largest celebration of Afro-Caribbean culture in Harlem.
                        Over 50 local vendors, live music, and authentic cuisine.
                    </Text>

                    {/* 2. Vendor Opportunity Banner (For Shop Owners) */}
                    <TouchableOpacity style={[styles.vendorBanner, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                        <View style={styles.vendorIconBg}>
                            <AppIcon library="Feather" name="shopping-bag" size={20} color="#FFF" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.vendorTitle, { color: colors.text }]}>Own a Shop or Restaurant?</Text>
                            <Text style={[styles.vendorSub, { color: colors.textSecondary }]}>Book a vendor stand to showcase your products.</Text>
                        </View>
                        <AppIcon library="Feather" name="chevron-right" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* 3. Bottom Action Bar */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <View>
                    <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Tickets from</Text>
                    <Text style={[styles.priceValue, { color: colors.text }]}>$15.00</Text>
                </View>
                <TouchableOpacity style={[styles.bookBtn, { backgroundColor: colors.primary }]}>
                    <Text style={styles.bookBtnText}>Book Ticket</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    imageContainer: { width: width, height: 300, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    headerButtons: { position: 'absolute', top: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
    circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
    content: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: 'inherit' },
    tag: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 12 },
    tagText: { fontSize: 11, fontWeight: '800' },
    title: { fontSize: 24, fontWeight: '900', marginBottom: 20 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
    iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    infoMain: { fontSize: 15, fontWeight: '700' },
    infoSub: { fontSize: 13 },
    divider: { height: 1, marginVertical: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
    description: { fontSize: 15, lineHeight: 24, marginBottom: 24 },

    vendorBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', gap: 12, marginBottom: 100 },
    vendorIconBg: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center' },
    vendorTitle: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
    vendorSub: { fontSize: 12 },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    priceLabel: { fontSize: 12, fontWeight: '600' },
    priceValue: { fontSize: 22, fontWeight: '900' },
    bookBtn: { paddingHorizontal: 40, paddingVertical: 16, borderRadius: 16 },
    bookBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});