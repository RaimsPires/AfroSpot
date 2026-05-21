import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';

import CategoryChips from '@components/map/CategoryChips';
import MapBusinessCard from '@components/map/MapBusinessCard';
import MapControls from '@components/map/MapControls';
import MapHeader from '@components/map/MapHeader';
import MapMarkers from '@components/map/MapMarkers';
import { CATEGORIES, MOCK_LOCATIONS } from '@components/map/mockData';
import { MapLocationItem } from '@components/map/types';
import { useTheme } from '@contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // Leaves a small margin on the sides for snapping

const InteractiveMapScreen = () => {
    const { colors, isDark } = useTheme();
    const [activeCategory, setActiveCategory] = useState('All');

    const renderBusinessCard = ({ item }: { item: MapLocationItem }) => (
        <View style={styles.cardSlide}>
            <MapBusinessCard item={item} colors={colors} />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <MapHeader colors={colors} />

            <View style={styles.mapContainer}>
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
                        <MapMarkers locations={MOCK_LOCATIONS} colors={colors} />
                </MapView>

                    <CategoryChips
                        categories={CATEGORIES}
                        activeCategory={activeCategory}
                        onChangeCategory={setActiveCategory}
                        colors={{ primary: colors.primary, text: colors.text }}
                    />

                    <MapControls colors={{ text: colors.text }} />

                <View style={styles.cardsListContainer}>
                    <FlatList
                        data={MOCK_LOCATIONS}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                            snapToInterval={CARD_WIDTH + 16}
                        snapToAlignment="center"
                        decelerationRate="fast"
                        disableIntervalMomentum={true}
                        keyExtractor={(item) => item.id}
                        renderItem={renderBusinessCard}
                        contentContainerStyle={styles.cardsListPadding}
                    />
                </View>

            </View>

        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1 },

    // Map
    mapContainer: { flex: 1, position: 'relative' },
    map: { ...StyleSheet.absoluteFill },

    // Bottom Floating Card
    cardsListContainer: {
        position: 'absolute',
        bottom: 100, // Positions it right above the bottom nav
        width: '100%',
    },
    cardsListPadding: {
        paddingHorizontal: 12, // Provides padding at the start and end of the list
    },
    cardSlide: { width: CARD_WIDTH, marginHorizontal: 8 },
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