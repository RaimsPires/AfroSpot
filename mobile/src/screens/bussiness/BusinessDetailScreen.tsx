import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock Data for the Image Carousel
const BUSINESS_IMAGES = [
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1000',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000'
];

const BusinessDetailScreen = () => {
    const { colors } = useTheme();

    // Carousel State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Tracks which image is currently fully visible on screen
    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentImageIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 1. Hero Image Carousel Section */}
                <View style={styles.heroContainer}>
                    <FlatList
                        data={BUSINESS_IMAGES}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                        keyExtractor={(_, index) => index.toString()}
                        // --- ADD THESE 4 PROPS FOR STRICT SNAPPING ---
                        snapToInterval={width} // Forces it to snap exactly to screen width
                        snapToAlignment="center"
                        decelerationRate="fast"
                        disableIntervalMomentum={true} // Prevents swiping past multiple images at once
                        // ---------------------------------------------
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={styles.heroImage} />
                        )}
                    />

                    {/* Static Overlay (Sits on top of the scrolling images) */}
                    <View style={styles.heroOverlay}>
                        <SafeAreaView style={styles.headerTop}>
                            <TouchableOpacity style={styles.iconBtnBlur}>
                                <AppIcon library="Feather" name="chevron-left" size={24} color="#FFF" />
                            </TouchableOpacity>
                            <View style={styles.headerTopRight}>
                                <TouchableOpacity style={styles.iconBtnBlur}>
                                    <AppIcon library="Feather" name="heart" size={20} color="#FFF" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.iconBtnBlur, { marginLeft: 12 }]}>
                                    <AppIcon library="Feather" name="share-2" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>

                        <View style={styles.heroBottom}>
                            <View style={styles.heroTextContent}>
                                <View style={styles.verifiedBadge}>
                                    <AppIcon library="Feather" name="check-circle" size={12} color="#FFF" />
                                    <Text style={styles.verifiedText}>VERIFIED AFROSPOT</Text>
                                </View>
                                <Text style={styles.heroTitle}>Kushite Cutz & Styles</Text>
                                <View style={styles.locationRow}>
                                    <AppIcon library="Feather" name="map-pin" size={14} color="#FFF" />
                                    <Text style={styles.locationText}>124 Harlem Ave, New York</Text>
                                </View>
                            </View>

                            {/* Dynamic Photo Counter */}
                            <View style={styles.photoCountBadge}>
                                <AppIcon library="Feather" name="image" size={12} color="#FFF" />
                                <Text style={styles.photoCountText}>
                                    {currentImageIndex + 1}/{BUSINESS_IMAGES.length} Photos
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.mainContent}>

                    {/* 2. Floating Info Card */}
                    <View style={[styles.floatingCard, { backgroundColor: colors.background, shadowColor: colors.text }]}>
                        <View style={styles.floatingTop}>
                            <View style={styles.ratingRow}>
                                <AppIcon library="AntDesign" name="star" size={16} color="#F59E0B" />
                                <Text style={[styles.ratingScore, { color: colors.primary }]}>4.9</Text>
                                <Text style={[styles.reviewCount, { color: colors.textSecondary }]}> (128 Reviews)</Text>
                            </View>
                            <View style={[styles.openBadge, { borderColor: colors.border }]}>
                                <Text style={[styles.openText, { color: colors.text }]}>Open Now</Text>
                            </View>
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <View style={styles.actionRow}>
                            <ActionItem icon="phone" label="Call" colors={colors} />
                            <ActionItem icon="message-circle" label="WhatsApp" colors={colors} />
                            <ActionItem icon="navigation" label="Directions" colors={colors} />
                            <ActionItem icon="globe" label="Website" colors={colors} />
                        </View>
                    </View>

                    {/* 3. About Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
                            <TouchableOpacity>
                                <Text style={[styles.linkText, { color: colors.primary }]}>Read More <AppIcon library="Feather" name="chevron-right" size={14} /></Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            Founded by Kofi Mensah in 2018, Kushite Cutz is more than just a barbershop. It's a sanctuary for Afro-grooming excellence. We specialize in textured hair, traditional styles, and contemporary fades...
                        </Text>
                    </View>

                    {/* 4. Popular Services */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Services</Text>

                        <ServiceCard
                            title="Premium Fade & Style"
                            price="$45.00"
                            duration="45 min"
                            desc="Detailed fade with signature line-up and organic hair oil treatment."
                            colors={colors}
                        />
                        <ServiceCard
                            title="Beard Grooming & Shape"
                            price="$25.00"
                            duration="30 min"
                            desc="Hot towel treatment followed by precision trimming and shaping."
                            colors={colors}
                        />
                        <ServiceCard
                            title="Full Grooming Experience"
                            price="$65.00"
                            duration="75 min"
                            desc="The ultimate package: Haircut, beard, facial, and scalp massage."
                            colors={colors}
                        />

                        <TouchableOpacity style={styles.viewAllBtn}>
                            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All 15 Services</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 5. Working Hours */}
                    <View style={[styles.hoursCard, { backgroundColor: colors.primary + '10' }]}>
                        <View style={styles.hoursHeaderRow}>
                            <AppIcon library="Feather" name="clock" size={18} color={colors.text} />
                            <Text style={[styles.hoursTitle, { color: colors.text }]}>Working Hours</Text>
                        </View>
                        <HoursRow day="Monday - Friday" time="9:00 AM - 8:00 PM" colors={colors} />
                        <HoursRow day="Saturday" time="10:00 AM - 6:00 PM" colors={colors} />
                        <HoursRow day="Sunday" time="Closed" isClosed colors={colors} />
                    </View>

                    {/* 6. Reviews */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews</Text>
                            <TouchableOpacity style={[styles.outlineBtnSmall, { borderColor: colors.border }]}>
                                <Text style={[styles.outlineBtnText, { color: colors.text }]}>Write a Review</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.reviewItem}>
                            <View style={styles.reviewHeader}>
                                <Image source={{ uri: 'https://i.pravatar.cc/150?u=marcus' }} style={styles.reviewAvatar} />
                                <View style={{ flex: 1 }}>
                                    <View style={styles.reviewNameRow}>
                                        <Text style={[styles.reviewerName, { color: colors.text }]}>Marcus J.</Text>
                                        <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>2 days ago</Text>
                                    </View>
                                    <View style={styles.starsRow}>
                                        {[1, 2, 3, 4, 5].map((i) => <AppIcon key={i} library="AntDesign" name="star" size={12} color="#F59E0B" />)}
                                    </View>
                                </View>
                            </View>
                            <Text style={[styles.reviewText, { color: colors.textSecondary }]}>
                                "Best barber in the city. The attention to detail is unmatched and the atmosphere is pure Afro-culture vibes."
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.viewAllBtn}>
                            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All Reviews</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 7. Similar Businesses */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Similar Businesses</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarScroll}>
                            <SimilarCard
                                image="https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=500"
                                title="Heritage Braids"
                                type="SALON"
                                rating="4.8"
                                dist="0.8 miles away"
                                colors={colors}
                            />
                            <SimilarCard
                                image="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=500"
                                title="Lagos Cuts"
                                type="BARBER"
                                rating="4.5"
                                dist="1.2 miles away"
                                colors={colors}
                            />
                        </ScrollView>
                    </View>

                </View>
            </ScrollView>

            {/* 8. Sticky Footer Actions */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.footerOutlineBtn, { borderColor: colors.primary }]}>
                    <Text style={[styles.footerOutlineText, { color: colors.primary }]}>Message</Text>
                </TouchableOpacity>
                <View style={{ flex: 1.5 }}>
                    <AppButton title="Book Appointment" onPress={() => { }} />
                </View>
            </View>
        </View>
    );
};

// --- Sub Components ---

const ActionItem = ({ icon, label, colors }: any) => (
    <TouchableOpacity style={styles.actionItem}>
        <View style={[styles.actionIconBg, { borderColor: colors.border }]}>
            <AppIcon library="Feather" name={icon} size={20} color={colors.text} />
        </View>
        <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
);

const ServiceCard = ({ title, price, duration, desc, colors }: any) => (
    <View style={[styles.serviceCard, { borderColor: colors.border }]}>
        <View style={styles.serviceHeader}>
            <View style={{ flex: 1 }}>
                <Text style={[styles.serviceTitle, { color: colors.text }]}>{title}</Text>
                <View style={styles.serviceMetaRow}>
                    <Text style={[styles.servicePrice, { color: colors.primary }]}>{price}</Text>
                    <AppIcon library="Feather" name="clock" size={12} color={colors.textSecondary} />
                    <Text style={[styles.serviceDuration, { color: colors.textSecondary }]}>{duration}</Text>
                </View>
            </View>
            <TouchableOpacity style={[styles.addBtn, { borderColor: colors.primary }]}>
                <Text style={[styles.addBtnText, { color: colors.primary }]}>Add</Text>
            </TouchableOpacity>
        </View>
        <Text style={[styles.serviceDesc, { color: colors.textSecondary }]}>{desc}</Text>
    </View>
);

const HoursRow = ({ day, time, isClosed, colors }: any) => (
    <View style={styles.hoursRow}>
        <Text style={[styles.hoursDay, { color: colors.textSecondary }]}>{day}</Text>
        <Text style={[styles.hoursTime, { color: isClosed ? colors.error : colors.text }]}>{time}</Text>
    </View>
);

const SimilarCard = ({ image, title, type, rating, dist, colors }: any) => (
    <TouchableOpacity style={[styles.similarCard, { borderColor: colors.border }]}>
        <Image source={{ uri: image }} style={styles.similarImg} />
        <View style={styles.similarInfo}>
            <Text style={[styles.similarTitle, { color: colors.text }]}>{title}</Text>
            <View style={styles.similarMeta}>
                <Text style={[styles.similarType, { color: colors.textSecondary }]}>{type}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AppIcon library="AntDesign" name="star" size={10} color="#F59E0B" />
                    <Text style={[styles.similarRating, { color: colors.text }]}> {rating}</Text>
                </View>
            </View>
            <View style={styles.similarDistRow}>
                <AppIcon library="Feather" name="map-pin" size={10} color={colors.primary} />
                <Text style={[styles.similarDist, { color: colors.primary }]}> {dist}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 100 },

    // Hero Image Carousel
    heroContainer: { width: '100%', height: 320, position: 'relative' },
    heroImage: { width: width, height: 320, resizeMode: 'cover' },

    heroOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'space-between'
    },

    headerTop: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
    headerTopRight: { flexDirection: 'row' },
    iconBtnBlur: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

    heroBottom: { paddingHorizontal: 20, paddingBottom: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    heroTextContent: { flex: 1, paddingRight: 16 },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#22C55E', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8, gap: 4 },
    verifiedText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
    heroTitle: { color: '#FFF', fontSize: 26, fontWeight: '800', marginBottom: 6 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    locationText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
    photoCountBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 4 },
    photoCountText: { color: '#FFF', fontSize: 11, fontWeight: '700' },

    mainContent: { paddingHorizontal: 20 },

    // Floating Card
    floatingCard: { marginTop: -30, borderRadius: 20, padding: 20, elevation: 5, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 32 },
    floatingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    ratingScore: { fontSize: 18, fontWeight: '800', marginLeft: 6 },
    reviewCount: { fontSize: 14, fontWeight: '500' },
    openBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    openText: { fontSize: 12, fontWeight: '700' },
    divider: { height: 1, width: '100%', marginBottom: 16 },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
    actionItem: { alignItems: 'center', gap: 8 },
    actionIconBg: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    actionLabel: { fontSize: 12, fontWeight: '600' },

    // Sections
    section: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '800' },
    linkText: { fontSize: 14, fontWeight: '700' },
    description: { fontSize: 15, lineHeight: 24 },

    // Service Cards
    serviceCard: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 16 },
    serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    serviceTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    serviceMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    servicePrice: { fontSize: 16, fontWeight: '800', marginRight: 8 },
    serviceDuration: { fontSize: 13 },
    addBtn: { borderWidth: 1, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
    addBtnText: { fontSize: 13, fontWeight: '700' },
    serviceDesc: { fontSize: 14, lineHeight: 20 },
    viewAllBtn: { alignItems: 'center', marginTop: 8 },
    viewAllText: { fontSize: 14, fontWeight: '800' },

    // Working Hours
    hoursCard: { borderRadius: 16, padding: 20, marginBottom: 32 },
    hoursHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    hoursTitle: { fontSize: 16, fontWeight: '800' },
    hoursRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    hoursDay: { fontSize: 14 },
    hoursTime: { fontSize: 14, fontWeight: '600' },

    // Reviews
    outlineBtnSmall: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    outlineBtnText: { fontSize: 12, fontWeight: '700' },
    reviewItem: { marginBottom: 16 },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    reviewAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    reviewNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    reviewerName: { fontSize: 15, fontWeight: '700' },
    reviewDate: { fontSize: 12 },
    starsRow: { flexDirection: 'row', gap: 2 },
    reviewText: { fontSize: 14, lineHeight: 20, fontStyle: 'italic' },

    // Similar Businesses
    similarScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
    similarCard: { width: 220, borderWidth: 1, borderRadius: 16, marginRight: 16, overflow: 'hidden' },
    similarImg: { width: '100%', height: 110 },
    similarInfo: { padding: 12 },
    similarTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
    similarMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    similarType: { fontSize: 11, fontWeight: '700' },
    similarRating: { fontSize: 12, fontWeight: '700' },
    similarDistRow: { flexDirection: 'row', alignItems: 'center' },
    similarDist: { fontSize: 11, fontWeight: '600' },

    // Footer
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1, flexDirection: 'row', gap: 16 },
    footerOutlineBtn: { flex: 1, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', height: 52 },
    footerOutlineText: { fontSize: 16, fontWeight: '700' },
});

export default BusinessDetailScreen;