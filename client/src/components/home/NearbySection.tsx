import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';

import SectionHeader from './SectionHeader';

const NEARBY_ITEMS = [
    {
        id: 'safari-lounge',
        title: 'Safari Lounge',
        subtitle: 'Restaurant • Bar',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        distance: '0.4 mi • 15 min',
        rating: '★ 4.8',
    },
    {
        id: 'mama-africa-kitchen',
        title: 'Mama Africa Kitchen',
        subtitle: 'Restaurant • Dining',
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=1000',
        distance: '0.8 mi • 20 min',
        rating: '★ 4.9',
    },
];

type NearbyItemProps = {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    distance: string;
    rating: string;
    onPress: () => void;
};

const NearbyItem = ({ title, subtitle, image, distance, rating, onPress }: NearbyItemProps) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[styles.nearbyCard, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
            <Image source={{ uri: image }} style={styles.nearbyImg} />
            <View style={styles.favBtn}>
                <AppIcon library="Feather" name="heart" size={14} color="#FF5252" />
            </View>
            <View style={styles.nearbyContent}>
                <Text style={[styles.nearbyTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.nearbySub, { color: colors.textSecondary }]}>{subtitle}</Text>
                <View style={styles.distRow}>
                    <Text style={[styles.distText, { color: colors.textSecondary }]}>{distance}</Text>
                    <Text style={[styles.ratingText, { color: colors.text }]}>{rating}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const NearbySection = () => {
    const navigation = useNavigation<AppStackNavigationProp<'Home'>>();

    return (
        <>
            <SectionHeader
                title="Nearby Your Spot"
                rightText="Map View"
                onRightPress={() => navigation.navigate('InteractiveMap', { initialCategory: 'Restaurants' })}
            />
            <FlatList
                horizontal
                data={NEARBY_ITEMS}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <NearbyItem
                        {...item}
                        onPress={() =>
                            navigation.navigate('BusinessDetail', {
                                businessId: item.id,
                                businessName: item.title,
                                source: 'nearby-section',
                            })
                        }
                    />
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({
    nearbyCard: { width: 220, marginLeft: 16, borderRadius: 20, borderWidth: 1, padding: 8 },
    nearbyImg: { height: 120, borderRadius: 16, marginBottom: 8 },
    nearbyContent: { paddingHorizontal: 4 },
    nearbyTitle: { fontWeight: '800', fontSize: 15 },
    nearbySub: { fontSize: 12, marginVertical: 2 },
    distRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    distText: { fontSize: 12 },
    ratingText: { fontSize: 12, fontWeight: '700' },
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
    },
});

export default NearbySection;
