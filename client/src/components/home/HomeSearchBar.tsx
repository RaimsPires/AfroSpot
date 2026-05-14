import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';

const HomeSearchBar = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<AppStackNavigationProp<'Home'>>();

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Search')}
            style={[styles.searchBar, { backgroundColor: colors.surface }]}
        >
            <AppIcon library="Feather" name="search" size={18} color={colors.textSecondary} />
            <TextInput
                editable={false}
                placeholder="Search African food, salons..."
                placeholderTextColor={colors.textSecondary}
                pointerEvents="none"
                style={[styles.searchInput, { color: colors.text }]}
            />
            <AppIcon library="Feather" name="mic" size={18} color={colors.primary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    searchBar: { flexDirection: 'row', margin: 16, padding: 12, borderRadius: 12, alignItems: 'center', gap: 10 },
    searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
});

export default HomeSearchBar;
