import React from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* 1. Sticky Top Header */}
            <View style={styles.header}>
                <View style={styles.locationRow}>
                    <View style={[styles.logoIcon, { backgroundColor: colors.text }]}>
                        <AppIcon library="MaterialCommunityIcons" name="lightning-bolt" size={16} color={colors.background} />
                    </View>
                    <View>
                        <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>CURRENT LOCATION</Text>
                        <View style={styles.cityRow}>
                            <AppIcon library="Feather" name="map-pin" size={12} color={colors.primary} />
                            <Text style={[styles.cityName, { color: colors.text }]}> Brixton, London</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerBtn}><AppIcon library="Feather" name="search" size={20} color={colors.text} /></TouchableOpacity>
                    <TouchableOpacity style={styles.headerBtn}><AppIcon library="Feather" name="bell" size={20} color={colors.text} /></TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>

                {/* 2. Search Bar */}
                <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
                    <AppIcon library="Feather" name="search" size={18} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Search African food, salons..."
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.searchInput, { color: colors.text }]}
                    />
                    <AppIcon library="Feather" name="mic" size={18} color={colors.primary} />
                </View>

                {/* 3. Categories Section */}
                <SectionHeader title="Categories" rightText="See All" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    <CategoryItem icon="restaurant" label="Restaurants" active />
                    <CategoryItem icon="content-cut" label="Beauty" library="MaterialIcons" />
                    <CategoryItem icon="trending-up" label="Fashion" />
                    <CategoryItem icon="storefront" label="Markets" library="MaterialIcons" />
                    <CategoryItem icon="notifications-none" label="Events" library="MaterialIcons" />
                </ScrollView>

                {/* 4. Featured Card */}
                <FeaturedCarousel />


                {/* 5. Discovery Feed (Horizontal) */}
                <View style={[styles.feedSection, { backgroundColor: '#FDF7F2' }]}>
                    <SectionHeader title="Discovery Feed" />
                    <FlatList
                        horizontal
                        data={[1, 2]}
                        keyExtractor={(i) => i.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={() => <FeedItem />}
                    />
                </View>

                {/* 6. Nearby Section */}
                <SectionHeader title="Nearby Your Spot" rightText="Map View" />
                <FlatList
                    horizontal
                    data={[1, 2]}
                    showsHorizontalScrollIndicator={false}
                    renderItem={() => <NearbyItem colors={colors} />}
                />

                {/* 7. Trending List */}
                <View style={styles.trendingHeader}>
                    <AppIcon library="Feather" name="trending-up" size={18} color="#22C55E" />
                    <Text style={[styles.trendingTitle, { color: colors.text }]}> Trending in London</Text>
                </View>
                <TrendingCard title="Afro-Chic Designs" sub="Bespoke Fashion" />
                <TrendingCard title="Village Pot" sub="Traditional Dining" />

            </ScrollView>

            {/* 8. Bottom Navigation (Fixed) */}
            <View style={[styles.bottomNav, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <NavTab icon="home" label="Home" active />
                <NavTab icon="compass" label="Explore" />
                <NavTab icon="map" label="Map" />
                <NavTab icon="heart" label="Saved" />
                <NavTab icon="bell" label="Alerts" badge={9} />
            </View>
        </SafeAreaView>
    );
};

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title, rightText }: any) => {
    const { colors } = useTheme();
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.titleWithBar}>
                <View style={[styles.orangeBar, { backgroundColor: colors.primary }]} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            </View>
            {rightText && <Text style={{ color: colors.primary, fontWeight: '700' }}>{rightText}</Text>}
        </View>
    );
};

const CategoryItem = ({ icon, label, active, library = "MaterialIcons" }: any) => {
    const { colors } = useTheme();
    return (
        <View style={styles.catWrap}>
            <View style={[styles.catIcon, { backgroundColor: active ? colors.primary : colors.surface }]}>
                <AppIcon library={library} name={icon} size={24} color={active ? '#FFF' : colors.text} />
            </View>
            <Text style={[styles.catLabel, { color: colors.text }]}>{label}</Text>
        </View>
    );
};

const FeedItem = () => (
    <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1555126634-323283e090fa' }}
        style={styles.feedCard}
        imageStyle={{ borderRadius: 20 }}
    >
        <View style={styles.playIcon}><AppIcon library="Feather" name="play" size={16} color="#FFF" /></View>
        <View style={styles.feedBottom}>
            <View style={styles.feedUser}><View style={styles.userDot} /><Text style={styles.userName}>Abebi.Vlogs</Text></View>
            <Text style={styles.feedPlace}>Suya Spot</Text>
            <Text style={styles.feedRate}>★ 4.9</Text>
        </View>
    </ImageBackground>
);

const NearbyItem = ({ colors }: any) => (
    <View style={[styles.nearbyCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4' }} style={styles.nearbyImg} />
        <View style={styles.favBtn}><AppIcon library="Feather" name="heart" size={14} color="#FF5252" /></View>
        <View style={styles.nearbyContent}>
            <Text style={[styles.nearbyTitle, { color: colors.text }]}>Safari Lounge</Text>
            <Text style={[styles.nearbySub, { color: colors.textSecondary }]}>Restaurant • Bar</Text>
            <View style={styles.distRow}>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>0.4 mi • 15 min</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.text }}>★ 4.8</Text>
            </View>
        </View>
    </View>
);

const TrendingCard = ({ title, sub }: any) => {
    const { colors } = useTheme();
    return (
        <View style={[styles.trendCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8' }} style={styles.trendImg} />
            <View style={{ flex: 1 }}>
                <View style={styles.popBadge}><Text style={styles.popText}>MOST POPULAR</Text></View>
                <Text style={[styles.trendTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.trendSub, { color: colors.textSecondary }]}>{sub}</Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>30+ booked recently</Text>
            </View>
        </View>
    );
};

const NavTab = ({ icon, label, active, badge }: any) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={styles.navTab}>
            <View>
                <AppIcon library="Feather" name={icon} size={22} color={active ? colors.primary : colors.textSecondary} />
                {badge && <View style={styles.badge}><Text style={styles.badgeTxt}>{badge}</Text></View>}
            </View>
            <Text style={[styles.navLabel, { color: active ? colors.primary : colors.textSecondary }]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollPadding: { paddingBottom: 100 },
    header: { flexDirection: 'row', padding: 16, justifyContent: 'space-between', alignItems: 'center' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logoIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    locationLabel: { fontSize: 10, fontWeight: '800' },
    cityRow: { flexDirection: 'row', alignItems: 'center' },
    cityName: { fontWeight: '700', fontSize: 14 },
    headerActions: { flexDirection: 'row', gap: 12 },
    headerBtn: { padding: 4 },

    searchBar: { flexDirection: 'row', margin: 16, padding: 12, borderRadius: 12, alignItems: 'center', gap: 10 },
    searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
    titleWithBar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    orangeBar: { width: 4, height: 20, borderRadius: 2 },
    sectionTitle: { fontSize: 18, fontWeight: '800' },

    categoryScroll: { paddingLeft: 16 },
    catWrap: { alignItems: 'center', marginRight: 20, gap: 8 },
    catIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    catLabel: { fontSize: 12, fontWeight: '600' },


    feedSection: { paddingVertical: 20, marginTop: 20 },
    feedCard: { width: 160, height: 220, marginLeft: 16, padding: 12, justifyContent: 'space-between' },
    playIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
    feedBottom: { gap: 2 },
    feedUser: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    userDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors => '#FFF' },
    userName: { color: '#FFF', fontSize: 10, fontWeight: '700' },
    feedPlace: { color: '#FFF', fontSize: 14, fontWeight: '800' },
    feedRate: { color: '#FFF', fontSize: 10 },

    nearbyCard: { width: 220, marginLeft: 16, borderRadius: 20, borderWidth: 1, padding: 8 },
    nearbyImg: { height: 120, borderRadius: 16, marginBottom: 8 },
    nearbyContent: { paddingHorizontal: 4 },
    nearbyTitle: { fontWeight: '800', fontSize: 15 },
    nearbySub: { fontSize: 12, marginVertical: 2 },
    distRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    favBtn: { position: 'absolute', top: 16, right: 16, backgroundColor: '#FFF', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },

    trendingHeader: { flexDirection: 'row', alignItems: 'center', margin: 16, marginTop: 32 },
    trendingTitle: { fontSize: 18, fontWeight: '800' },
    trendCard: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 20, borderWidth: 1, gap: 12 },
    trendImg: { width: 80, height: 80, borderRadius: 16 },
    popBadge: { backgroundColor: '#F5F5F5', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
    popText: { fontSize: 8, fontWeight: '800', color: '#666' },
    trendSub: { fontSize: 12 },

    bottomNav: { position: 'absolute', bottom: 0, width: '100%', height: 85, flexDirection: 'row', borderTopWidth: 1, paddingHorizontal: 10, paddingVertical: 10 },
    navTab: { flex: 1, alignItems: 'center', gap: 4 },
    navLabel: { fontSize: 10, fontWeight: '600' },
    badge: { position: 'absolute', top: -4, right: -10, backgroundColor: '#FF5252', borderRadius: 10, paddingHorizontal: 4, height: 16, justifyContent: 'center' },
    badgeTxt: { color: '#FFF', fontSize: 9, fontWeight: 'bold' }
});

export default HomeScreen;