import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SavedFilterTabsProps = {
    tabs: readonly string[];
    activeTab: string;
    onChangeTab: (tab: string) => void;
    colors: {
        primary: string;
        background: string;
        border: string;
        textSecondary: string;
    };
};

const SavedFilterTabs = ({ tabs, activeTab, onChangeTab, colors }: SavedFilterTabsProps) => (
    <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => onChangeTab(tab)}
                        style={[
                            styles.tabPill,
                            {
                                backgroundColor: isActive ? colors.primary : colors.background,
                                borderColor: isActive ? colors.primary : colors.border,
                            },
                        ]}
                    >
                        <Text style={[styles.tabPillText, { color: isActive ? '#FFF' : colors.textSecondary }]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    tabsWrapper: { paddingTop: 16, paddingBottom: 8 },
    tabsScroll: { paddingHorizontal: 20, gap: 10 },
    tabPill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    tabPillText: { fontSize: 13, fontWeight: '700' },
});

export default SavedFilterTabs;
