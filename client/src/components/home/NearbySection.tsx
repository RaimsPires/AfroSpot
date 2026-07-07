import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';

// Import your hook and types here (adjust paths as needed)
import { img_landscape } from '@assets/index';
import { useNearbyBusinesses } from '@hooks/useNearbyBusinesses';
import SectionHeader from './SectionHeader';

type NearbyItemProps = {
    id: number; // Changed string to number to match backend DB ID
    title: string;
    subtitle: string;
    image: string | null;
    distance: string;
    onPress: () => void;
};

const NearbyItem = ({ title, subtitle, image, distance, onPress }: NearbyItemProps) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[styles.nearbyCard, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
            <Image 
                source={image ? { uri: image } : img_landscape} 
                style={styles.nearbyImg} 
            />
            <View style={styles.favBtn}>
                <AppIcon library="Feather" name="heart" size={14} color="#FF5252" />
            </View>
            <View style={styles.nearbyContent}>
                <Text numberOfLines={1} style={[styles.nearbyTitle, { color: colors.text }]}>{title}</Text>
                <Text numberOfLines={1} style={[styles.nearbySub, { color: colors.textSecondary }]}>{subtitle}</Text>
                <View style={styles.distRow}>
                    <Text style={[styles.distText, { color: colors.textSecondary }]}>{distance}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const NearbySection = () => {
    const navigation = useNavigation<AppStackNavigationProp<'Home'>>();
    const { colors } = useTheme();

    // 1. Hook up the API data. Replace with real dynamic coords from Geolocation when ready!
    const mockUserLocation = { latitude: 6.5244, longitude: 3.3792 };
    const { spots, loading } = useNearbyBusinesses(mockUserLocation, 15);

    return (
        <>
            <SectionHeader
                title="Nearby Your Spot"
                rightText="Map View"
                onRightPress={() => navigation.navigate('InteractiveMap', { initialCategory: 'Restaurants' })}
            />
            
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                </View>
            ) : spots.count === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={{ color: colors.textSecondary }}>No business spots found nearby.</Text>
                </View>
            ) : (
                <FlatList
                    horizontal
                    data={spots.results}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <NearbyItem
                            id={item.id}
                            title={item.name}
                            subtitle={item.description || 'No description available'}
                            image={item.banner_image}
                            distance={"20 km away"}
                            // distance={`${item.distance_km.toFixed(1)} km away`}
                            onPress={() =>
                                navigation.navigate('BusinessDetail', {
                                    businessId: item.id.toString(), // Convert number back to string if navigation expects it
                                    businessName: item.name,
                                    source: 'nearby-section',
                                })
                            }
                        />
                    )}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    nearbyCard: { 
        width: 220, 
        marginLeft: 16, 
        borderRadius: 20, 
        borderWidth: 1, 
        padding: 8,
        // Overflow hidden ensures the image borderRadius isn't hidden by the card's border
        overflow: 'hidden' 
    },
    nearbyImg: { 
        width: '100%',      // Stretches to fill the card width
        height: 120,        // Fixed height for consistency
        borderRadius: 16, 
        marginBottom: 8, 
        backgroundColor: '#eee', // Placeholder color while loading
    },
    nearbyContent: { paddingHorizontal: 4 },
    nearbyTitle: { fontWeight: '800', fontSize: 15 },
    nearbySub: { fontSize: 12, marginVertical: 2 },
    distRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    distText: { fontSize: 12 },
    centerContainer: { height: 180, justifyContent: 'center', alignItems: 'center', width: '100%' },
    favBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#FFF',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
});

export default NearbySection;