import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

type TrendingPlace = {
    id: string;
    name: string;
    type: string;
    rating: string;
    reviews: string;
    distance: string;
    image: string;
    isOpen: boolean;
};

type ExploreTrendingCardProps = {
    place: TrendingPlace;
    onPress?: () => void;
    colors: {
        surface: string;
        border: string;
        text: string;
        textSecondary: string;
    };
};

const ExploreTrendingCard = ({ place, onPress, colors }: ExploreTrendingCardProps) => (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.trendingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <View style={styles.trendingImageContainer}>
            <Image source={{ uri: place.image }} style={styles.trendingImage} />
            <TouchableOpacity style={styles.heartBtn}>
                <AppIcon library="Feather" name="heart" size={18} color="#FFF" />
            </TouchableOpacity>
        </View>

        <View style={styles.trendingInfo}>
            <View style={styles.trendingHeaderRow}>
                <Text style={[styles.trendingName, { color: colors.text }]} numberOfLines={1}>
                    {place.name}
                </Text>
                <View style={styles.ratingBox}>
                    <AppIcon library="AntDesign" name="star" size={10} color="#F59E0B" />
                    <Text style={[styles.ratingText, { color: colors.text }]}>{place.rating}</Text>
                </View>
            </View>

            <Text style={[styles.trendingType, { color: colors.textSecondary }]}>
                {place.type} • {place.distance}
            </Text>

            <View style={styles.trendingFooter}>
                <Text style={[styles.statusText, { color: place.isOpen ? '#22C55E' : '#EF4444' }]}>
                    {place.isOpen ? 'Open Now' : 'Closed'}
                </Text>
                <Text style={[styles.reviewsText, { color: colors.textSecondary }]}>
                    ({place.reviews} reviews)
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    trendingCard: {
        flexDirection: 'row',
        borderRadius: 16,
        borderWidth: 1,
        padding: 12,
        elevation: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    trendingImageContainer: { position: 'relative' },
    trendingImage: { width: 90, height: 90, borderRadius: 12 },
    heartBtn: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    trendingInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
    trendingHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    trendingName: { flex: 1, fontSize: 16, fontWeight: '800', marginRight: 8 },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.04)',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    ratingText: { fontSize: 12, fontWeight: '700' },
    trendingType: { fontSize: 13, marginBottom: 8 },
    trendingFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusText: { fontSize: 12, fontWeight: '800' },
    reviewsText: { fontSize: 12 },
});

export default ExploreTrendingCard;
