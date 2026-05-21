import React, { useState } from 'react';
import { FlatList, StatusBar, StyleSheet } from 'react-native';

import { useTheme } from '@contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

import SavedEmptyState from '@components/saved/SavedEmptyState';
import SavedFilterTabs from '@components/saved/SavedFilterTabs';
import SavedHeader from '@components/saved/SavedHeader';
import SavedItemCard from '@components/saved/SavedItemCard';
import { SAVED_ITEMS, TABS } from '@components/saved/mockData';
import { SavedItem } from '@components/saved/types';

const SavedScreen = () => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('All');

    const filteredItems = SAVED_ITEMS.filter(
        (item) => activeTab === 'All' || item.type === activeTab
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <SavedHeader colors={colors} />

            <SavedFilterTabs
                tabs={TABS}
                activeTab={activeTab}
                onChangeTab={setActiveTab}
                colors={colors}
            />

            <FlatList<SavedItem>
                data={filteredItems}
                renderItem={({ item }) => <SavedItemCard item={item} colors={colors} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<SavedEmptyState colors={colors} />}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
});

export default SavedScreen;