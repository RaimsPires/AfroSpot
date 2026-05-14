import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CategoryChipsProps = {
    categories: string[];
    activeCategory: string;
    onChangeCategory: (category: string) => void;
    colors: {
        primary: string;
        text: string;
    };
};

const CategoryChips = ({ categories, activeCategory, onChangeCategory, colors }: CategoryChipsProps) => {
    return (
        <View style={styles.categoriesOverlay}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => onChangeCategory(category)}
                        style={[
                            styles.categoryPill,
                            {
                                backgroundColor: activeCategory === category ? colors.primary : '#FFF',
                                shadowColor: colors.text,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.categoryPillText,
                                { color: activeCategory === category ? '#FFF' : colors.text },
                            ]}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    categoriesOverlay: { position: 'absolute', top: 16, width: '100%', zIndex: 5 },
    categoriesContent: { paddingHorizontal: 16, gap: 10 },
    categoryPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    categoryPillText: { fontSize: 13, fontWeight: '700' },
});

export default CategoryChips;
