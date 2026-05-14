import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

type ExploreCategory = string;

type ExploreCategoriesProps = {
    categories: ExploreCategory[];
    activeCategory: string;
    onChangeCategory: (category: string) => void;
    colors: {
        primary: string;
        surface: string;
        border: string;
        textSecondary: string;
    };
};

const ExploreCategories = ({
    categories,
    activeCategory,
    onChangeCategory,
    colors,
}: ExploreCategoriesProps) => (
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
    >
        {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
                <TouchableOpacity
                    key={cat}
                    onPress={() => onChangeCategory(cat)}
                    style={[
                        styles.categoryPill,
                        {
                            backgroundColor: isActive ? colors.primary : colors.surface,
                            borderColor: isActive ? colors.primary : colors.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.categoryPillText,
                            { color: isActive ? '#FFF' : colors.textSecondary },
                        ]}
                    >
                        {cat}
                    </Text>
                </TouchableOpacity>
            );
        })}
    </ScrollView>
);

const styles = StyleSheet.create({
    categoriesScroll: { paddingHorizontal: 20, gap: 10, marginBottom: 32 },
    categoryPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
    categoryPillText: { fontSize: 13, fontWeight: '700' },
});

export default ExploreCategories;
