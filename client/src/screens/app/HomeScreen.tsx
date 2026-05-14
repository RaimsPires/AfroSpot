import React from 'react';
import {
    ScrollView,
    StyleSheet,
} from 'react-native';

import CategoryStrip from '@/components/home/CategoryStrip';
import DiscoveryFeedSection from '@/components/home/DiscoveryFeedSection';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import HomeSearchBar from '@/components/home/HomeSearchBar';
import HomeTopHeader from '@/components/home/HomeTopHeader';
import NearbySection from '@/components/home/NearbySection';
import TrendingSection from '@/components/home/TrendingSection';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <HomeTopHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
                <HomeSearchBar />
                <CategoryStrip />
                <FeaturedCarousel />
                <DiscoveryFeedSection />
                <NearbySection />
                <TrendingSection />

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollPadding: { paddingBottom: 100 },
});

export default HomeScreen;