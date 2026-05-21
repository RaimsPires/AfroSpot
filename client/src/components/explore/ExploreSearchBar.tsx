import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

type ExploreSearchBarProps = {
    searchQuery: string;
    onChangeSearch: (text: string) => void;
    onFilterPress?: () => void;
    colors: {
        surface: string;
        textSecondary: string;
        text: string;
        primary: string;
    };
};

const ExploreSearchBar = ({
    searchQuery,
    onChangeSearch,
    onFilterPress,
    colors,
}: ExploreSearchBarProps) => (
    <View style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { backgroundColor: colors.surface }]}>
            <AppIcon
                library="Feather"
                name="search"
                size={18}
                color={colors.textSecondary}
                style={styles.searchIcon}
            />
            <TextInput
                placeholder="Search places, food, or services..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.searchInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={onChangeSearch}
            />
        </View>
        <TouchableOpacity onPress={onFilterPress} style={[styles.filterBtn, { backgroundColor: colors.primary }]}> 
            <AppIcon library="Feather" name="sliders" size={18} color="#FFF" />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    searchContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
    searchInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 15 },
    filterBtn: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
});

export default ExploreSearchBar;
