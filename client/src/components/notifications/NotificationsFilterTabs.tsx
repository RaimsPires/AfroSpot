import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type NotificationsFilterTabsProps = {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    colors: any;
};

export const NotificationsFilterTabs = ({ tabs, activeTab, onTabChange, colors }: NotificationsFilterTabsProps) => {
    return (
        <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => onTabChange(tab)}
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
};

const styles = StyleSheet.create({
    tabsContainer: { marginBottom: 8 },
    tabsScroll: { paddingHorizontal: 20, gap: 10, paddingBottom: 12 },
    tabPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    tabPillText: { fontSize: 13, fontWeight: '700' },
});
