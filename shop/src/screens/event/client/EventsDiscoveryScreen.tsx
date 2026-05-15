import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = ['All', 'Festivals', 'Pop-ups', 'Workshops', 'Music'];
const UPCOMING = [
    { id: '1', title: 'Afro-Beats Summer', date: 'June 20', location: 'Brooklyn, NY', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400' },
    { id: '2', title: 'Yoruba Art Expo', date: 'July 05', location: 'Harlem, NY', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400' },
];

export const EventsDiscoveryScreen = () => {
    const { colors, isDark } = useTheme();
    const [activeCat, setActiveCat] = useState('All');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Discover Events</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>In the Afro-Community</Text>
                </View>
                <TouchableOpacity style={[styles.profileBtn, { backgroundColor: colors.surface }]}><AppIcon library="Feather" name="map-pin" size={18} color={colors.primary} /></TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
                    <AppIcon library="Feather" name="search" size={18} color={colors.textSecondary} />
                    <TextInput placeholder="Search events..." placeholderTextColor={colors.textSecondary} style={[styles.searchInput, { color: colors.text }]} />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setActiveCat(cat)}
                            style={[styles.catBtn, activeCat === cat && { backgroundColor: colors.primary }]}
                        >
                            <Text style={[styles.catText, { color: activeCat === cat ? colors.textInverse : colors.textSecondary }]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Featured Card */}
                <View style={styles.featuredSection}>
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600' }}
                        style={styles.featuredCard}
                        imageStyle={{ borderRadius: 20 }}
                    >
                        <View style={styles.featuredOverlay}>
                            <View style={[styles.featuredTag, { backgroundColor: colors.warning }]}><Text style={[styles.tagText, { color: colors.textInverse }]}>FEATURED</Text></View>
                            <Text style={[styles.featuredTitle, { color: colors.textInverse }]}>Harlem Afro-Market 2024</Text>
                            <Text style={[styles.featuredDate, { color: colors.textInverse }]}>June 15 • Marcus Garvey Park</Text>
                        </View>
                    </ImageBackground>
                </View>

            {/* Vertical List */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Near You</Text>
            <View style={styles.listContainer}>
                {UPCOMING.map(item => (
                    <TouchableOpacity key={item.id} style={[styles.eventRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Image source={{ uri: item.image }} style={styles.rowImage} />
                        <View style={styles.rowInfo}>
                            <Text style={[styles.rowDate, { color: colors.primary }]}>{item.date}</Text>
                            <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
                            <Text style={[styles.rowLoc, { color: colors.textSecondary }]}>{item.location}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: '900' },
    headerSub: { fontSize: 14, fontWeight: '600' },
    profileBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
    searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 50, borderRadius: 15 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    catScroll: { paddingHorizontal: 20, gap: 10, marginBottom: 20 },
    catBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
    catText: { fontWeight: '700', fontSize: 14 },
    featuredSection: { paddingHorizontal: 20, marginBottom: 30 },
    featuredCard: { height: 200, width: '100%', justifyContent: 'flex-end' },
    featuredOverlay: { padding: 20, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
    featuredTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
    tagText: { fontSize: 10, fontWeight: '900' },
    featuredTitle: { fontSize: 22, fontWeight: '900' },
    featuredDate: { fontSize: 14, fontWeight: '600' },
    sectionTitle: { fontSize: 18, fontWeight: '900', marginHorizontal: 20, marginBottom: 15 },
    listContainer: { paddingHorizontal: 20, gap: 15 },
    eventRow: { flexDirection: 'row', padding: 12, borderRadius: 16, borderWidth: 1 },
    rowImage: { width: 80, height: 80, borderRadius: 12 },
    rowInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    rowDate: { fontSize: 12, fontWeight: '800', marginBottom: 4 },
    rowTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    rowLoc: { fontSize: 13 },
});