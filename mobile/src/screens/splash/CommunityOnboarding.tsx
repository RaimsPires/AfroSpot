import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import {
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for reviews
const REVIEWS = [
    {
        id: '1',
        name: 'Amara K.',
        role: 'Foodie & Curator',
        image: 'https://i.pravatar.cc/150?u=amara',
        text: '"The recommendations are spot on! Found the best jollof in London within minutes."',
    },
    {
        id: '2',
        name: 'David O.',
        role: 'New Resident',
        image: 'https://i.pravatar.cc/150?u=david',
        text: '"Found a great barber just around the corner. The reviews helped me trust the place immediately."',
    },
];

const CommunityOnboarding = () => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* 1. Hero Header Section */}
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000' }}
                    style={styles.heroImage}
                >
                    <SafeAreaView style={styles.headerSafeArea}>
                        <View style={styles.logoRow}>
                            <View style={styles.logoCircle}>
                                <AppIcon library="Feather" name="users" size={24} color={colors.text} />
                            </View>
                            <Text style={[styles.logoText, { color: colors.text }]}>AfroSpot</Text>
                        </View>

                        <View style={styles.heroTextContent}>
                            <View style={[styles.badge, { backgroundColor: '#22C55E' }]}>
                                <Text style={styles.badgeText}>Community Choice</Text>
                            </View>
                            <Text style={styles.heroTitle}>Your Community is{'\n'}Waiting for You</Text>
                            <Text style={styles.heroSub}>Join 50,000+ users discovering the best of African culture, food, and services nearby.</Text>
                        </View>
                    </SafeAreaView>
                </ImageBackground>

                {/* 2. Reviews Section */}
                <View style={styles.reviewContainer}>
                    {REVIEWS.map((item) => (
                        <View key={item.id} style={[styles.reviewCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <View style={styles.reviewHeader}>
                                <Image source={{ uri: item.image }} style={styles.avatar} />
                                <View style={styles.reviewerInfo}>
                                    <Text style={[styles.reviewerName, { color: colors.text }]}>{item.name}</Text>
                                    <Text style={[styles.reviewerRole, { color: colors.textSecondary }]}>{item.role}</Text>
                                </View>
                                <View style={styles.verifiedBadge}>
                                    <AppIcon library="Feather" name="check" size={10} color={colors.textSecondary} />
                                    <Text style={[styles.verifiedText, { color: colors.textSecondary }]}>Verified</Text>
                                </View>
                            </View>
                            <View style={styles.stars}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <AppIcon key={s} library="AntDesign" name="star" size={14} color="#F59E0B" />
                                ))}
                            </View>
                            <Text style={[styles.reviewBody, { color: colors.text }]}>{item.text}</Text>
                        </View>
                    ))}
                </View>

                {/* 3. Why Enable Location Section */}
                <View style={styles.locationInfoSection}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>WHY ENABLE LOCATION?</Text>

                    <LocationRow
                        icon="map-pin"
                        title="Discover Nearby Gems"
                        desc="Find authentic businesses within walking distance."
                        colors={colors}
                    />
                    <LocationRow
                        icon="navigation"
                        title="Smart Directions"
                        desc="Get real-time routes to shops, salons, and markets."
                        colors={colors}
                    />
                    <LocationRow
                        icon="shield"
                        title="Privacy First"
                        desc="Your data is encrypted and only used to improve your experience."
                        colors={colors}
                    />
                </View>
            </ScrollView>

            {/* 4. Sticky Footer with Overlay */}
            <View style={[styles.footer, { backgroundColor: colors.background + 'F2' }]}>
                <View style={styles.pagination}>
                    <View style={styles.dotInactive} />
                    <View style={styles.dotInactive} />
                    <View style={[styles.dotActive, { backgroundColor: colors.primary }]} />
                </View>
                <AppButton
                    title="Enable Location"
                    rightIcon='arrow-right'
                    // rightIcon={<AppIcon library="Feather" name="arrow-right" size={20} color="#FFF" />}
                    onPress={() => { }}
                />
                <TouchableOpacity style={styles.maybeLater}>
                    <Text style={[styles.maybeLaterText, { color: colors.textSecondary }]}>Maybe Later</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const LocationRow = ({ icon, title, desc, colors }: any) => (
    <View style={[styles.locRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.locIconContainer}>
            <AppIcon library="Feather" name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.locTextContainer}>
            <Text style={[styles.locTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.locDesc, { color: colors.textSecondary }]}>{desc}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 180 },
    heroImage: { height: 420, width: '100%' },
    headerSafeArea: { flex: 1, padding: 24, justifyContent: 'space-between' },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    logoCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    logoText: { fontSize: 24, fontWeight: '900' },
    heroTextContent: { marginBottom: 20 },
    badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
    badgeText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
    heroTitle: { color: '#FFF', fontSize: 32, fontWeight: '800', lineHeight: 38 },
    heroSub: { color: '#FFF', fontSize: 15, marginTop: 10, lineHeight: 22, opacity: 0.9 },

    reviewContainer: { paddingHorizontal: 24, marginTop: -40 },
    reviewCard: { borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
    reviewerInfo: { flex: 1 },
    reviewerName: { fontWeight: '700', fontSize: 16 },
    reviewerRole: { fontSize: 12 },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#DDD', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    verifiedText: { fontSize: 11, fontWeight: '600' },
    stars: { flexDirection: 'row', gap: 2, marginBottom: 8 },
    reviewBody: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },

    locationInfoSection: { padding: 24 },
    sectionLabel: { fontSize: 13, fontWeight: '800', marginBottom: 16, letterSpacing: 1 },
    locRow: { flexDirection: 'row', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, alignItems: 'center' },
    locIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FDF4EC', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    locTextContainer: { flex: 1 },
    locTitle: { fontWeight: '700', fontSize: 15, marginBottom: 2 },
    locDesc: { fontSize: 13, lineHeight: 18 },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 24, paddingBottom: 40, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    pagination: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
    dotInactive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDD' },
    dotActive: { width: 24, height: 8, borderRadius: 4 },
    maybeLater: { marginTop: 16, alignItems: 'center' },
    maybeLaterText: { fontSize: 16, fontWeight: '600' },
});

export default CommunityOnboarding;