import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';

import ExploreCategories from '@components/explore/ExploreCategories';
import ExploreCollectionCard from '@components/explore/ExploreCollectionCard';
import ExploreHeader from '@components/explore/ExploreHeader';
import ExploreSearchBar from '@components/explore/ExploreSearchBar';
import ExploreSectionHeader from '@components/explore/ExploreSectionHeader';
import ExploreTrendingCard from '@components/explore/ExploreTrendingCard';
import { CATEGORIES, COLLECTIONS, TRENDING_PLACES } from '@components/explore/mockData';

const ExploreScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'Explore'>>();
    const { colors, isDark } = useTheme();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        navigation.navigate('Search', {
            initialCategory: category === 'All' ? undefined : category,
            initialQuery: category === 'All' ? searchQuery : category,
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <ExploreHeader
                colors={colors}
                onMapPress={() => navigation.navigate('InteractiveMap', { initialCategory: activeCategory })}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <ExploreSearchBar
                    searchQuery={searchQuery}
                    onChangeSearch={setSearchQuery}
                    onFilterPress={() =>
                        navigation.navigate('Search', {
                            initialCategory: activeCategory === 'All' ? undefined : activeCategory,
                            initialQuery: searchQuery,
                        })
                    }
                    colors={colors}
                />

                <ExploreCategories
                    categories={CATEGORIES}
                    activeCategory={activeCategory}
                    onChangeCategory={handleCategoryChange}
                    colors={colors}
                />

                {/* Curated Collections Section */}
                <ExploreSectionHeader
                    title="Curated Collections"
                    subtitle="Discover the best of AfroSpot"
                    colors={colors}
                />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.collectionsScroll}
                >
                    {COLLECTIONS.map((collection) => (
                        <ExploreCollectionCard
                            key={collection.id}
                            collection={collection}
                            onPress={() =>
                                navigation.navigate('BusinessListing', {
                                    collection: collection.title,
                                    title: collection.title,
                                })
                            }
                        />
                    ))}
                </ScrollView>

                {/* Trending Near You Section */}
                <ExploreSectionHeader
                    title="Trending Near You"
                    showViewAll
                    onViewAll={() => navigation.navigate('Search', { initialCategory: activeCategory })}
                    colors={colors}
                />

                <ScrollView
                    scrollEnabled={false}
                    contentContainerStyle={styles.trendingContainer}
                >
                    {TRENDING_PLACES.map((place) => (
                        <ExploreTrendingCard
                            key={place.id}
                            place={place}
                            colors={colors}
                            onPress={() =>
                                navigation.navigate('BusinessDetail', {
                                    businessId: place.id,
                                    businessName: place.name,
                                    source: 'explore-trending',
                                })
                            }
                        />
                    ))}
                </ScrollView>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 40 },
    collectionsScroll: { paddingHorizontal: 20, gap: 16 },
    trendingContainer: { paddingHorizontal: 20, gap: 16 },
});

export default ExploreScreen;