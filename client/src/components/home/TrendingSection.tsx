import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';

type TrendingCardProps = {
    businessId: string;
    title: string;
    sub: string;
    onPress: () => void;
};

const TrendingCard = ({ title, sub, onPress }: TrendingCardProps) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[styles.trendCard, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
            <Image source={{ uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8' }} style={styles.trendImg} />
            <View style={styles.trendBody}>
                <View style={styles.popBadge}>
                    <Text style={styles.popText}>MOST POPULAR</Text>
                </View>
                <Text style={[styles.trendTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.trendSub, { color: colors.textSecondary }]}>{sub}</Text>
                <Text style={[styles.trendMeta, { color: colors.textSecondary }]}>30+ booked recently</Text>
            </View>
        </TouchableOpacity>
    );
};

const TrendingSection = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<AppStackNavigationProp<'Home'>>();

    return (
        <>
            <View style={styles.trendingHeader}>
                <AppIcon library="Feather" name="trending-up" size={18} color="#22C55E" />
                <Text style={[styles.trendingTitle, { color: colors.text }]}> Trending in London</Text>
            </View>
            <TrendingCard
                businessId="afro-chic-designs"
                title="Afro-Chic Designs"
                sub="Bespoke Fashion"
                onPress={() =>
                    navigation.navigate('BusinessDetail', {
                        businessId: 'afro-chic-designs',
                        businessName: 'Afro-Chic Designs',
                        source: 'trending-section',
                    })
                }
            />
            <TrendingCard
                businessId="village-pot"
                title="Village Pot"
                sub="Traditional Dining"
                onPress={() =>
                    navigation.navigate('BusinessDetail', {
                        businessId: 'village-pot',
                        businessName: 'Village Pot',
                        source: 'trending-section',
                    })
                }
            />
        </>
    );
};

const styles = StyleSheet.create({
    trendingHeader: { flexDirection: 'row', alignItems: 'center', margin: 16, marginTop: 32 },
    trendingTitle: { fontSize: 18, fontWeight: '800' },
    trendCard: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 12,
        borderRadius: 20,
        borderWidth: 1,
        gap: 12,
    },
    trendImg: { width: 80, height: 80, borderRadius: 16 },
    trendBody: { flex: 1 },
    popBadge: {
        backgroundColor: '#F5F5F5',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 4,
    },
    popText: { fontSize: 8, fontWeight: '800', color: '#666' },
    trendTitle: { fontSize: 15, fontWeight: '700' },
    trendSub: { fontSize: 12 },
    trendMeta: { fontSize: 11, marginTop: 4 },
});

export default TrendingSection;
