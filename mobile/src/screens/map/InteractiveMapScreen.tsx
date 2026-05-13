import React, { useState } from 'react';
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
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // Leaves a small margin on the sides for snapping

// Mock Data
const CATEGORIES = ['All', 'Restaurants', 'Salons', 'Groceries', 'Fashion'];

const MOCK_LOCATIONS = [
    {
        id: '1', title: 'Jollof House Kitchen', type: 'active', lat: 40.8116, lng: -73.9465,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200',
        rating: '4.8', reviews: '124', category: 'Restaurant', distance: '0.4 miles away', isOpen: true
    },
    {
        id: '2', title: 'Lagos Cuts Barber', type: 'inactive', lat: 40.8186, lng: -73.9505,
        image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=200',
        rating: '4.9', reviews: '89', category: 'Salon', distance: '0.9 miles away', isOpen: true
    },
    {
        id: '3', title: 'Amani Market', type: 'inactive', lat: 40.8156, lng: -73.9385,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200',
        rating: '4.5', reviews: '56', category: 'Groceries', distance: '1.2 miles away', isOpen: false
    },
];

const InteractiveMapScreen = () => {
    const { colors, isDark } = useTheme();
    const [activeCategory, setActiveCategory] = useState('All');

    // Render individual business card
    const renderBusinessCard = ({ item }: { item: typeof MOCK_LOCATIONS[0] }) => (
        <View style={[styles.bottomCard, { backgroundColor: colors.background }]}>
            <View style={styles.dragHandle} />

            <View style={styles.cardContentRow}>
                <View style={styles.cardImageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.cardImage}
                    />
                    {item.isOpen && (
                        <View style={styles.openBadge}>
                            <Text style={styles.openBadgeText}>OPEN</Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardDetails}>
                    <View style={styles.cardTitleRow}>
                        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <TouchableOpacity>
                            <AppIcon library="Feather" name="heart" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ratingRow}>
                        <AppIcon library="AntDesign" name="star" size={12} color="#F59E0B" />
                        <Text style={[styles.ratingScore, { color: colors.text }]}>{item.rating} <Text style={{ color: colors.textSecondary, fontWeight: 'normal' }}>({item.reviews})</Text></Text>
                        <Text style={[styles.dotSeparator, { color: colors.textSecondary }]}>•</Text>
                        <Text style={[styles.categoryText, { color: colors.primary }]}>{item.category}</Text>
                    </View>

                    <View style={styles.distanceRow}>
                        <AppIcon library="Feather" name="map-pin" size={12} color={colors.textSecondary} />
                        <Text style={[styles.distanceText, { color: colors.textSecondary }]}>{item.distance}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity style={[styles.outlineBtn, { borderColor: colors.border }]}>
                    <AppIcon library="Feather" name="phone" size={16} color={colors.text} />
                    <Text style={[styles.outlineBtnText, { color: colors.text }]}>Call</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <AppButton
                        title="Directions"
                        leftIcon='navigation'
                        // leftIcon={<AppIcon library="Feather" name="navigation" size={16} color="#FFF" />}
                        onPress={() => { }}
                    />
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background, zIndex: 10 }]}>
                {/* Header content remains the same */}
                <View style={styles.headerLeft}>
                    <View style={[styles.logoBox, { backgroundColor: colors.text }]}>
                        <AppIcon library="AntDesign" name="lightning-bolt" size={18} color={colors.background} />
                    </View>
                    <View>
                        <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>CURRENT LOCATION</Text>
                        <View style={styles.locationRow}>
                            <AppIcon library="Feather" name="map-pin" size={12} color={colors.primary} />
                            <Text style={[styles.locationText, { color: colors.primary }]}> Harlem, NY</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="search" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="layers" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.mapContainer}>
                {/* 2. Map View */}
                <MapView
                    provider={PROVIDER_DEFAULT}
                    style={styles.map}
                    initialRegion={{
                        latitude: 40.8146,
                        longitude: -73.9425,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }}
                    customMapStyle={mapStyle}
                >
                    {/* Custom Markers */}
                    {MOCK_LOCATIONS.map((marker) => (
                        <Marker
                            key={marker.id}
                            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
                        >
                            <View style={styles.customMarkerContainer}>
                                <View style={[
                                    styles.markerCircle,
                                    marker.type === 'active' ? { backgroundColor: colors.primary, borderColor: colors.primary } : { backgroundColor: '#FFF', borderColor: colors.primary }
                                ]}>
                                    <AppIcon
                                        library="Feather"
                                        name="map-pin"
                                        size={14}
                                        color={marker.type === 'active' ? '#FFF' : colors.primary}
                                    />
                                </View>
                                <View style={[
                                    styles.markerLabel,
                                    marker.type === 'active' ? { borderColor: colors.primary } : { borderColor: '#DDD' }
                                ]}>
                                    <Text style={[
                                        styles.markerLabelText,
                                        marker.type === 'active' ? { color: colors.primary } : { color: colors.textSecondary }
                                    ]}>
                                        {marker.title}
                                    </Text>
                                </View>
                            </View>
                        </Marker>
                    ))}

                    {/* Current User Location Dot */}
                    <Marker coordinate={{ latitude: 40.8100, longitude: -73.9425 }}>
                        <View style={styles.userLocationHalo}>
                            <View style={styles.userLocationDot} />
                        </View>
                    </Marker>
                </MapView>

                {/* 3. Floating Categories Overlay */}
                <View style={styles.categoriesOverlay}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                style={[
                                    styles.categoryPill,
                                    {
                                        backgroundColor: activeCategory === cat ? colors.primary : '#FFF',
                                        shadowColor: colors.text,
                                    },
                                ]}
                            >
                                <Text style={[
                                    styles.categoryPillText,
                                    { color: activeCategory === cat ? '#FFF' : colors.text }
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* 4. Floating Map Controls */}
                <View style={styles.mapControls}>
                    <TouchableOpacity style={[styles.controlBtn, { shadowColor: colors.text }]}>
                        <AppIcon library="Feather" name="navigation" size={18} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.controlBtn, { shadowColor: colors.text, marginTop: 12 }]}>
                        <AppIcon library="Feather" name="map-pin" size={18} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* 5. Scrollable Bottom Cards */}
                <View style={styles.cardsListContainer}>
                    <FlatList
                        data={MOCK_LOCATIONS}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width - 24} // Width of card + margin
                        snapToAlignment="center"
                        decelerationRate="fast"
                        disableIntervalMomentum={true}
                        keyExtractor={(item) => item.id}
                        renderItem={renderBusinessCard}
                        contentContainerStyle={styles.cardsListPadding}
                    />
                </View>

            </View>

            {/* 6. Bottom Navigation */}
            <View style={[styles.bottomNav, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <NavTab icon="home" label="Home" colors={colors} />
                <NavTab icon="compass" label="Explore" colors={colors} />
                <NavTab icon="map" label="Map" active colors={colors} />
                <NavTab icon="heart" label="Favorites" colors={colors} />
                <NavTab icon="bell" label="Alerts" badge={9} colors={colors} />
            </View>
        </SafeAreaView>
    );
};

// --- Sub Components ---

const NavTab = ({ icon, label, active, badge, colors }: any) => (
    <TouchableOpacity style={styles.navTab}>
        <View>
            <AppIcon library="Feather" name={icon} size={24} color={active ? colors.primary : colors.textSecondary} />
            {badge && (
                <View style={styles.navBadge}>
                    <Text style={styles.navBadgeText}>{badge}</Text>
                </View>
            )}
        </View>
        <Text style={[styles.navLabel, { color: active ? colors.primary : colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
);

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logoBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    locationLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    locationText: { fontSize: 14, fontWeight: '800' },
    headerRight: { flexDirection: 'row', gap: 8 },
    iconBtn: { padding: 8 },

    // Map
    mapContainer: { flex: 1, position: 'relative' },
    map: { ...StyleSheet.absoluteFill },

    // Custom Markers
    customMarkerContainer: { alignItems: 'center' },
    markerCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    markerLabel: { marginTop: 4, backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    markerLabelText: { fontSize: 11, fontWeight: '700' },

    // User Location Dot
    userLocationHalo: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(59, 130, 246, 0.2)', alignItems: 'center', justifyContent: 'center' },
    userLocationDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#3B82F6', borderWidth: 2, borderColor: '#FFF' },

    // Categories Overlay
    categoriesOverlay: { position: 'absolute', top: 16, width: '100%', zIndex: 5 },
    categoriesContent: { paddingHorizontal: 16, gap: 10 },
    categoryPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    categoryPillText: { fontSize: 13, fontWeight: '700' },

    // Floating Controls
    mapControls: { position: 'absolute', right: 16, top: 160, zIndex: 5 },
    controlBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },

    // Bottom Floating Card
    cardsListContainer: {
        position: 'absolute',
        bottom: 100, // Positions it right above the bottom nav
        width: '100%',
    },
    cardsListPadding: {
        paddingHorizontal: 12, // Provides padding at the start and end of the list
    },
    bottomCard: {
        width: CARD_WIDTH,
        marginHorizontal: 8, // Spacing between cards
        borderRadius: 24,
        padding: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 15
    },
    dragHandle: { width: 40, height: 4, backgroundColor: '#E5E5E5', borderRadius: 2, alignSelf: 'center', marginBottom: 16, marginTop: -4 },
    cardContentRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
    cardImageContainer: { position: 'relative' },
    cardImage: { width: 80, height: 80, borderRadius: 16 },
    openBadge: { position: 'absolute', top: 6, left: 6, backgroundColor: '#22C55E', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    openBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
    cardDetails: { flex: 1, justifyContent: 'center' },
    cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardTitle: { fontSize: 18, fontWeight: '800', flex: 1, marginRight: 8 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 6 },
    ratingScore: { fontSize: 13, fontWeight: '700', marginLeft: 4 },
    dotSeparator: { marginHorizontal: 6 },
    categoryText: { fontSize: 13, fontWeight: '700' },
    distanceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    distanceText: { fontSize: 13 },
    cardActions: { flexDirection: 'row' },
    outlineBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 12, borderWidth: 1, gap: 8 },
    outlineBtnText: { fontSize: 15, fontWeight: '700' },

    // Bottom Navigation
    bottomNav: { flexDirection: 'row', borderTopWidth: 1, paddingBottom: 30, paddingTop: 12, paddingHorizontal: 10 },
    navTab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
    navLabel: { fontSize: 11, fontWeight: '600' },
    navBadge: { position: 'absolute', top: -4, right: -6, backgroundColor: '#EF4444', minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFF' },
    navBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' }
});

// Very subtle light map style to match the clean aesthetic
const mapStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#dadada" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] }
];

export default InteractiveMapScreen;