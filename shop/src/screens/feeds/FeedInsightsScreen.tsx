import React from 'react';
import {
    ImageBackground,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommentsBottomSheet } from '@components/feed/CommentsBottomSheet';
import { LikesBottomSheet } from '@components/feed/LikesBottomSheet';
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const METRIC_CARDS = [
    { key: 'views', icon: 'eye', label: 'Views' },
    { key: 'likes', icon: 'heart', label: 'Likes', library: 'AntDesign' },
    { key: 'comments', icon: 'message-circle', label: 'Comments' },
] as const;

export const FeedInsightsScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const feed = route?.params?.feed;
    const [isCommentsVisible, setCommentsVisible] = React.useState(false);
    const [isLikesVisible, setLikesVisible] = React.useState(false);

    const mockComments = React.useMemo(
        () => [
            {
                id: '1',
                user: 'jamal_99',
                text: 'Where is the shop located?',
                time: '2h',
                likes: 12,
                avatar: 'https://i.pravatar.cc/150?img=33',
            },
            {
                id: '2',
                user: 'samantha_b',
                text: 'Cleanest fade I have seen in a minute 🔥',
                time: '5h',
                likes: 45,
                avatar: 'https://i.pravatar.cc/150?img=5',
            },
            {
                id: '3',
                user: 'kayla_arts',
                text: 'Do you have weekend slots?',
                time: '9h',
                likes: 7,
                avatar: 'https://i.pravatar.cc/150?img=11',
            },
        ],
        [],
    );

    const mockLikers = React.useMemo(
        () => [
            { id: '1', name: 'Samuel K.', username: 'samuel_k', avatar: 'https://i.pravatar.cc/150?img=8' },
            { id: '2', name: 'Nadine M.', username: 'nadine_m', avatar: 'https://i.pravatar.cc/150?img=23' },
            { id: '3', name: 'Yusuf B.', username: 'yusuf_b', avatar: 'https://i.pravatar.cc/150?img=39' },
            { id: '4', name: 'Jalen R.', username: 'jalen_r', avatar: 'https://i.pravatar.cc/150?img=12' },
            { id: '5', name: 'Mia T.', username: 'mia_t', avatar: 'https://i.pravatar.cc/150?img=47' },
        ],
        [],
    );

    const handleMetricPress = (metricKey: string) => {
        if (metricKey === 'likes') {
            setLikesVisible(true);
        }

        if (metricKey === 'comments') {
            setCommentsVisible(true);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Feed Insights</Text>
                <View style={styles.iconBtn} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {feed ? (
                    <>
                        <ImageBackground
                            source={{ uri: feed.thumbnail }}
                            style={styles.previewImage}
                            imageStyle={styles.previewImageRadius}
                        >
                            <View style={styles.playBadge}>
                                <AppIcon library="Feather" name="play" size={14} color="#FFF" />
                            </View>
                        </ImageBackground>

                        <Text style={[styles.caption, { color: colors.text }]}>{feed.caption}</Text>
                        <Text style={[styles.date, { color: colors.textSecondary }]}>{feed.date}</Text>

                        <View style={styles.metricsGrid}>
                            {METRIC_CARDS.map((metric) => (
                                <TouchableOpacity
                                    key={metric.key}
                                    style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                    onPress={() => handleMetricPress(metric.key)}
                                    activeOpacity={0.85}
                                >
                                    <AppIcon
                                        library={(metric.library as any) || 'Feather'}
                                        name={metric.icon as any}
                                        size={18}
                                        color={colors.primary}
                                    />
                                    <Text style={[styles.metricValue, { color: colors.text }]}>
                                        {feed[metric.key]}
                                    </Text>
                                    <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{metric.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {feed.isBoosted ? (
                            <View style={[styles.boostCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}>
                                <View style={styles.boostTitleRow}>
                                    <AppIcon library="Feather" name="zap" size={16} color={colors.primary} />
                                    <Text style={[styles.boostTitle, { color: colors.primary }]}>Boost Performance</Text>
                                </View>
                                <Text style={[styles.boostReachText, { color: colors.text }]}>Reach: {feed.boostReach || '--'}</Text>
                                <TouchableOpacity
                                    style={[styles.manageBoostBtn, { backgroundColor: colors.primary }]}
                                    onPress={() => navigation.navigate('BoostFeed', { feed })}
                                >
                                    <Text style={[styles.manageBoostBtnText, { color: colors.textInverse }]}>Manage Boost</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.startBoostBtn, { backgroundColor: colors.primary }]}
                                onPress={() => navigation.navigate('BoostFeed', { feed })}
                            >
                                <AppIcon library="Feather" name="zap" size={16} color={colors.textInverse} />
                                <Text style={[styles.startBoostBtnText, { color: colors.textInverse }]}>Boost This Feed</Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No feed selected</Text>
                        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Go back and choose a feed to view insights.</Text>
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={isCommentsVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setCommentsVisible(false)}
            >
                <CommentsBottomSheet
                    comments={mockComments}
                    commentCountLabel={feed?.comments}
                    onClose={() => setCommentsVisible(false)}
                />
            </Modal>

            <Modal
                visible={isLikesVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setLikesVisible(false)}
            >
                <LikesBottomSheet
                    users={mockLikers}
                    likeCountLabel={feed?.likes}
                    onClose={() => setLikesVisible(false)}
                />
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    iconBtn: { width: 32, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800' },

    content: { padding: 20, paddingBottom: 40 },
    previewImage: {
        width: '100%',
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    previewImageRadius: { borderRadius: 14 },
    playBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    caption: { fontSize: 15, fontWeight: '700', lineHeight: 22, marginBottom: 6 },
    date: { fontSize: 12, fontWeight: '500', marginBottom: 16 },

    metricsGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    metricCard: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        gap: 6,
    },
    metricValue: { fontSize: 16, fontWeight: '900' },
    metricLabel: { fontSize: 12, fontWeight: '600' },

    boostCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
    },
    boostTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
    boostTitle: { fontSize: 14, fontWeight: '800' },
    boostReachText: { fontSize: 13, fontWeight: '600', marginBottom: 12 },
    manageBoostBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingVertical: 12,
    },
    manageBoostBtnText: { fontSize: 14, fontWeight: '800' },

    startBoostBtn: {
        marginTop: 8,
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    startBoostBtnText: { fontSize: 14, fontWeight: '800' },

    emptyCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
    },
    emptyTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
    emptySubtitle: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
});
