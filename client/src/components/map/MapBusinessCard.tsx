import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';

import { MapLocationItem } from './types';

type MapBusinessCardProps = {
    item: MapLocationItem;
    colors: {
        background: string;
        text: string;
        textSecondary: string;
        primary: string;
        border: string;
    };
};

const MapBusinessCard = ({ item, colors }: MapBusinessCardProps) => {
    return (
        <View style={[styles.bottomCard, { backgroundColor: colors.background }]}> 
            <View style={styles.dragHandle} />

            <View style={styles.cardContentRow}>
                <View style={styles.cardImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
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
                        <Text style={[styles.ratingScore, { color: colors.text }]}>
                            {item.rating} <Text style={{ color: colors.textSecondary, fontWeight: 'normal' }}>({item.reviews})</Text>
                        </Text>
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
                <View style={styles.directionsWrap}>
                    <AppButton title="Directions" leftIcon="navigation" onPress={() => {}} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomCard: {
        width: '100%',
        borderRadius: 24,
        padding: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
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
    directionsWrap: { flex: 1, marginLeft: 12 },
});

export default MapBusinessCard;
