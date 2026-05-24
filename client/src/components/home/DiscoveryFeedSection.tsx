import React from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

import SectionHeader from './SectionHeader';

const FeedItem = () => {
    const { colors, isDark } = useTheme();
    const playIconStyle = [styles.playIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.16)' : `${colors.background}55` }];

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1555126634-323283e090fa' }}
            style={styles.feedCard}
            imageStyle={[styles.feedImage, { borderColor: colors.border, borderWidth: 1 }]}
        >
            <View style={playIconStyle}>
                <AppIcon library="Feather" name="play" size={16} color={colors.text} />
            </View>
            <View style={styles.feedBottom}>
                <View style={styles.feedUser}>
                    <View style={[styles.userDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.userName, { color: colors.text }]}>Abebi.Vlogs</Text>
                </View>
                <Text style={[styles.feedPlace, { color: colors.text }]}>Suya Spot</Text>
                <Text style={[styles.feedRate, { color: colors.textSecondary }]}>★ 4.9</Text>
            </View>
        </ImageBackground>
    );
};

const DiscoveryFeedSection = () => {
    const { colors } = useTheme();
    const sectionStyle = [styles.feedSection, { backgroundColor: colors.background }];

    return (
        <View style={sectionStyle}>
            <SectionHeader title="Discovery Feed" />
            <FlatList
                horizontal
                data={[1, 2]}
                keyExtractor={(item) => item.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={() => <FeedItem />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    feedSection: { paddingVertical: 20, marginTop: 20 },
    feedCard: { width: 160, height: 220, marginLeft: 16, padding: 12, justifyContent: 'space-between' },
    feedImage: { borderRadius: 20 },
    playIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    feedBottom: { gap: 2 },
    feedUser: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    userDot: { width: 6, height: 6, borderRadius: 3 },
    userName: { fontSize: 10, fontWeight: '700' },
    feedPlace: { fontSize: 14, fontWeight: '800' },
    feedRate: { fontSize: 10 },
});

export default DiscoveryFeedSection;
