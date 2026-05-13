import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// --- Mock Data ---
const FEED_POSTS = [
    {
        id: '1',
        videoCover: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=800',
        username: 'adara_eats',
        userAvatar: 'https://i.pravatar.cc/150?img=47',
        isVerified: true,
        caption: 'The best Jollof rice in Brooklyn! You HAVE to try their spicy goat meat.',
        tags: ['#AfricanFood', '#NYCBestEats', '#AfroSpot'],
        businessName: 'Jollof Village • Restaurant',
        likes: '12.4K',
        comments: '842',
        shares: '3.1K',
        audio: 'Original audio - adara_eats',
    },
    {
        id: '2',
        videoCover: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=800',
        username: 'kofi_styles',
        userAvatar: 'https://i.pravatar.cc/150?img=11',
        isVerified: false,
        caption: 'Fresh fade for the weekend. Check out Kushite Cutz in Harlem! 💈🔥',
        tags: ['#BarberLife', '#Harlem', '#FreshCut'],
        businessName: 'Kushite Cutz & Styles • Barber',
        likes: '8.2K',
        comments: '124',
        shares: '890',
        audio: 'Afrobeats Mix 2023 - DJ Cuppy',
    },
    {
        id: '3',
        videoCover: 'https://images.unsplash.com/photo-1605497788044-5a32c707d2c6?q=80&w=800',
        username: 'heritage_art',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        isVerified: true,
        caption: 'New authentic Kente cloth just arrived at the shop. Handwoven perfection.',
        tags: ['#Kente', '#AfricanFashion', '#Artisan'],
        businessName: 'Heritage Weaves • Shop',
        likes: '15.1K',
        comments: '430',
        shares: '1.2K',
        audio: 'Original audio - heritage_art',
    },
];

const TRENDING_TAGS = ['#JollofBattle', '#AfrobeatsNights', '#NairaCuts', '#LagosToNYC'];

const CommunityFeedScreen = () => {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('Explore');

    // Renders individual full-screen posts
    const renderItem = ({ item }: { item: typeof FEED_POSTS[0] }) => {
        return <FeedPost item={item} colors={colors} />;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* 1. Main Feed List */}
            <FlatList
                data={FEED_POSTS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={height} // Snaps exactly to screen height
                snapToAlignment="start"
            />

            {/* 2. Absolute Top Header Overlay */}
            <SafeAreaView style={styles.headerOverlay}>
                <View style={styles.headerTop}>
                    <View style={styles.tabsRow}>
                        <TouchableOpacity onPress={() => setActiveTab('Following')}>
                            <Text style={[styles.tabText, activeTab === 'Following' && styles.tabTextActive]}>Following</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab('Explore')} style={styles.activeTabContainer}>
                            <Text style={[styles.tabText, activeTab === 'Explore' && styles.tabTextActive]}>Explore</Text>
                            {activeTab === 'Explore' && <View style={styles.activeDot} />}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.searchIconBg}>
                        <AppIcon library="Feather" name="search" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* 3. Horizontal Tags */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
                    {TRENDING_TAGS.map((tag) => (
                        <TouchableOpacity key={tag} style={styles.tagPill}>
                            <AppIcon library="AntDesign" name="fire" size={14} color="#F97316" />
                            <Text style={styles.tagPillText}>{tag}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>

            {/* 4. Bottom Navigation Overlay */}
            <View style={[styles.bottomNav, { backgroundColor: '#000', borderTopColor: '#333' }]}>
                <NavTab icon="home" label="Home" colors={colors} />
                <NavTab icon="play-circle" label="Feed" active colors={colors} />
                <NavTab icon="map" label="Map" colors={colors} />
                <NavTab icon="bookmark" label="Saved" colors={colors} />
                <NavTab icon="user" label="Profile" avatar="https://i.pravatar.cc/150?img=12" colors={colors} />
            </View>
        </View>
    );
};

// --- Isolated Post Component (Holds its own interaction state) ---
const FeedPost = ({ item, colors }: any) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <View style={[styles.postContainer, { height: height }]}>
            <ImageBackground source={{ uri: item.videoCover }} style={styles.videoBackground}>

                {/* Dark Gradient Overlay at the bottom for text readability */}
                <View style={styles.bottomGradient} />

                {/* Right Side Actions */}
                <View style={styles.rightActions}>
                    <View style={styles.avatarAction}>
                        <Image source={{ uri: item.userAvatar }} style={styles.actionAvatar} />
                        {!isFollowing && (
                            <TouchableOpacity style={styles.followPlusBtn} onPress={() => setIsFollowing(true)}>
                                <AppIcon library="Feather" name="plus" size={12} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity style={styles.actionBtn} onPress={() => setIsLiked(!isLiked)}>
                        <AppIcon library="AntDesign" name={isLiked ? "heart" : "hearto"} size={28} color={isLiked ? "#EF4444" : "#FFF"} />
                        <Text style={styles.actionText}>{item.likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn}>
                        <AppIcon library="Feather" name="message-circle" size={28} color="#FFF" />
                        <Text style={styles.actionText}>{item.comments}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={() => setIsSaved(!isSaved)}>
                        <AppIcon library="AntDesign" name={isSaved ? "bookmark" : "bookmark-o"} size={26} color={isSaved ? colors.primary : "#FFF"} />
                        <Text style={styles.actionText}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn}>
                        <AppIcon library="Feather" name="share-2" size={26} color="#FFF" />
                        <Text style={styles.actionText}>{item.shares}</Text>
                    </TouchableOpacity>

                    <View style={styles.audioDiscContainer}>
                        <AppIcon library="Feather" name="music" size={16} color="#FFF" />
                    </View>
                </View>

                {/* Bottom Left Content */}
                <View style={styles.bottomContent}>

                    <TouchableOpacity style={styles.visitBusinessPill}>
                        <View style={styles.visitIconBg}>
                            <AppIcon library="Feather" name="home" size={12} color="#FFF" />
                        </View>
                        <View>
                            <Text style={styles.visitLabel}>VISIT BUSINESS</Text>
                            <Text style={styles.visitName}>{item.businessName}</Text>
                        </View>
                        <AppIcon library="Feather" name="chevron-right" size={16} color="#FFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>

                    <View style={styles.userInfoRow}>
                        <Text style={styles.username}>@{item.username}</Text>
                        {item.isVerified && (
                            <AppIcon library="MaterialIcons" name="verified" size={14} color="#3B82F6" style={{ marginHorizontal: 4 }} />
                        )}
                        <TouchableOpacity
                            style={[styles.followOutlineBtn, isFollowing && { borderColor: 'transparent' }]}
                            onPress={() => setIsFollowing(!isFollowing)}
                        >
                            <Text style={styles.followOutlineText}>{isFollowing ? 'Following' : 'Follow'}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>

                    <View style={styles.tagsRow}>
                        {item.tags.map((tag: string) => (
                            <Text key={tag} style={styles.tagText}>{tag} </Text>
                        ))}
                    </View>

                    <View style={styles.audioRow}>
                        <AppIcon library="Feather" name="music" size={12} color="#FFF" />
                        <Text style={styles.audioText} numberOfLines={1}>{item.audio}</Text>
                    </View>
                </View>

            </ImageBackground>
        </View>
    );
};

// --- Sub Components ---
const NavTab = ({ icon, label, active, avatar, colors }: any) => (
    <TouchableOpacity style={styles.navTab}>
        {avatar ? (
            <View style={[styles.avatarTabBorder, active && { borderColor: colors.primary }]}>
                <Image source={{ uri: avatar }} style={styles.navAvatar} />
            </View>
        ) : (
            <AppIcon library="Feather" name={icon} size={24} color={active ? colors.primary : '#888'} />
        )}
        <Text style={[styles.navLabel, { color: active ? colors.primary : '#888' }]}>{label}</Text>
        {active && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
    </TouchableOpacity>
);

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    postContainer: { width: width },
    videoBackground: { width: '100%', height: '100%', justifyContent: 'flex-end' },

    // Dark overlay for bottom text readability
    bottomGradient: {
        position: 'absolute', bottom: 0, width: '100%', height: '50%',
        backgroundColor: 'rgba(0,0,0,0.5)', // Simulated gradient
    },

    // Absolute Top Header
    headerOverlay: { position: 'absolute', top: 0, width: '100%', zIndex: 10, paddingTop: 10 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    tabsRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    tabText: { color: 'rgba(255,255,255,0.6)', fontSize: 18, fontWeight: '700' },
    tabTextActive: { color: '#FFF', fontSize: 20, fontWeight: '900' },
    activeTabContainer: { alignItems: 'center' },
    activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B', marginTop: 4 },
    searchIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },

    tagsScroll: { paddingHorizontal: 20, gap: 10 },
    tagPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    tagPillText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

    // Bottom Left Content
    bottomContent: { paddingHorizontal: 16, paddingBottom: 100, width: '80%', zIndex: 5 },

    visitBusinessPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(249, 115, 22, 0.9)', alignSelf: 'flex-start', paddingRight: 12, borderRadius: 24, marginBottom: 12 },
    visitIconBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', margin: 2, marginRight: 8 },
    visitLabel: { color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    visitName: { color: '#FFF', fontSize: 13, fontWeight: '800' },

    userInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    username: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    followOutlineBtn: { borderWidth: 1, borderColor: '#FFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
    followOutlineText: { color: '#FFF', fontSize: 11, fontWeight: '700' },

    caption: { color: '#FFF', fontSize: 14, lineHeight: 20, marginBottom: 8 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    tagText: { color: '#F59E0B', fontSize: 14, fontWeight: '700' },

    audioRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    audioText: { color: '#FFF', fontSize: 13 },

    // Right Actions
    rightActions: { position: 'absolute', right: 12, bottom: 100, alignItems: 'center', gap: 20, zIndex: 10 },
    avatarAction: { position: 'relative', marginBottom: 8 },
    actionAvatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#FFF' },
    followPlusBtn: { position: 'absolute', bottom: -8, alignSelf: 'center', backgroundColor: '#F97316', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFF' },

    actionBtn: { alignItems: 'center' },
    actionText: { color: '#FFF', fontSize: 12, fontWeight: '700', marginTop: 4 },

    audioDiscContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#333', borderWidth: 8, borderColor: '#111', alignItems: 'center', justifyContent: 'center', marginTop: 8 },

    // Bottom Nav
    bottomNav: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', borderTopWidth: 1, paddingBottom: 30, paddingTop: 12, paddingHorizontal: 10, zIndex: 20 },
    navTab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, position: 'relative' },
    navLabel: { fontSize: 10, fontWeight: '700' },
    avatarTabBorder: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
    navAvatar: { width: 22, height: 22, borderRadius: 11 },
    activeIndicator: { position: 'absolute', top: -12, width: 24, height: 3, borderRadius: 1.5 },
});

export default CommunityFeedScreen;