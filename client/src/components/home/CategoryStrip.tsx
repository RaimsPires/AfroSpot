import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import type { AppStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { AllCategoriesBottomSheet } from './AllCategoriesBottomSheet';
import { CategoryItem } from './CategoryItem';
import { ALL_CATEGORIES, FEATURED_CATEGORIES } from './categoryMockData';
import SectionHeader from './SectionHeader';

const CategoryStrip = () => {
    const [showAllCategories, setShowAllCategories] = useState(false);
    const navigation = useNavigation<AppStackNavigationProp<'Home'>>();

    const handleCategoryPress = (label: string) => {
        navigation.navigate('Search', { initialCategory: label, initialQuery: label });
    };

    return (
        <>
            <SectionHeader
                title="Categories"
                rightText="See All"
                onRightPress={() => setShowAllCategories(true)}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {FEATURED_CATEGORIES.map((category, index) => (
                    <CategoryItem
                        key={index}
                        {...category}
                        onPress={() => handleCategoryPress(category.label)}
                    />
                ))}
            </ScrollView>

            <AllCategoriesBottomSheet
                visible={showAllCategories}
                onClose={() => setShowAllCategories(false)}
                categories={ALL_CATEGORIES}
                onCategoryPress={(category) => handleCategoryPress(category.label)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    categoryScroll: { paddingLeft: 16, marginRight: 20 },
});

export default CategoryStrip;
