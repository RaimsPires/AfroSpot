import React from 'react';
import {
    Dimensions,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 40 - 12) / 3; // 3 columns with padding

// --- Mock Data ---
export const STORE_FEEDS = [
    { id: '1', thumbnail: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400', views: '12.4K', likes: '1.2K', caption: 'Fresh fades all day! Drop by Kushite Cutz. 🔥' },
    { id: '2', thumbnail: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=400', views: '8.2K', likes: '840', caption: 'Precision is our middle name. #BarberLife' },
    { id: '3', thumbnail: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=400', views: '15.1K', likes: '2.3K', caption: 'Before and after transformation! 💈' },
    { id: '4', thumbnail: 'https://images.unsplash.com/photo-1605497788044-5a32c707d2c6?q=80&w=400', views: '3.4K', likes: '320', caption: 'New styles incoming.' },
];

export const StoreFeedsScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => {/* navigation.goBack() */ }}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>My Feeds</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={() => {/* navigation.navigate('CreateFeed') */ }}>
                    <AppIcon library="Feather" name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Performance Summary */}
                <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: colors.text }]}>39.1K</Text>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Views</Text>
                    </View>
                    <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: colors.text }]}>4.6K</Text>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Likes</Text>
                    </View>
                </View>

                {/* Video Grid */}
                <View style={styles.gridContainer}>
                    {STORE_FEEDS.map((feed) => (
                        <TouchableOpacity
                            key={feed.id}
                            style={styles.gridItem}
                            onPress={() => {/* navigation.navigate('FeedViewer', { initialIndex: index }) */ }}
                        >
                            <ImageBackground source={{ uri: feed.thumbnail }} style={styles.thumbnail} imageStyle={{ borderRadius: 8 }}>
                                <View style={styles.playIconOverlay}>
                                    <AppIcon library="Feather" name="play" size={20} color="#FFF" />
                                </View>
                                <View style={styles.statsOverlay}>
                                    <AppIcon library="Feather" name="eye" size={12} color="#FFF" style={{ marginRight: 4 }} />
                                    <Text style={[styles.statsText, { color: '#FFF' }]}>{feed.views}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 4 },
    content: { padding: 20 },

    summaryCard: { flexDirection: 'row', padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
    summaryItem: { flex: 1, alignItems: 'center' },
    summaryValue: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
    summaryLabel: { fontSize: 12, fontWeight: '600' },
    summaryDivider: { width: 1, marginHorizontal: 16 },

    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    gridItem: { width: GRID_ITEM_SIZE, height: GRID_ITEM_SIZE * 1.5, borderRadius: 8 },
    thumbnail: { width: '100%', height: '100%', justifyContent: 'space-between' },
    playIconOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    statsOverlay: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: 'rgba(0,0,0,0.4)', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
    statsText: { fontSize: 10, fontWeight: '700' },
});