import React from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@components/ui';

import SectionHeader from './SectionHeader';

const FeedItem = () => {
    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1555126634-323283e090fa' }}
            style={styles.feedCard}
            imageStyle={styles.feedImage}
        >
            <View style={styles.playIcon}>
                <AppIcon library="Feather" name="play" size={16} color="#FFF" />
            </View>
            <View style={styles.feedBottom}>
                <View style={styles.feedUser}>
                    <View style={styles.userDot} />
                    <Text style={styles.userName}>Abebi.Vlogs</Text>
                </View>
                <Text style={styles.feedPlace}>Suya Spot</Text>
                <Text style={styles.feedRate}>★ 4.9</Text>
            </View>
        </ImageBackground>
    );
};

const DiscoveryFeedSection = () => {
    return (
        <View style={styles.feedSection}>
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
    feedSection: { paddingVertical: 20, marginTop: 20, backgroundColor: '#FDF7F2' },
    feedCard: { width: 160, height: 220, marginLeft: 16, padding: 12, justifyContent: 'space-between' },
    feedImage: { borderRadius: 20 },
    playIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    feedBottom: { gap: 2 },
    feedUser: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    userDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
    userName: { color: '#FFF', fontSize: 10, fontWeight: '700' },
    feedPlace: { color: '#FFF', fontSize: 14, fontWeight: '800' },
    feedRate: { color: '#FFF', fontSize: 10 },
});

export default DiscoveryFeedSection;
