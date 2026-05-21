import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';

type FeedHeaderOverlayProps = {
    activeTab: 'Following' | 'Explore';
    onTabChange: (tab: 'Following' | 'Explore') => void;
    tags: string[];
};

const FeedHeaderOverlay = ({ activeTab, onTabChange, tags }: FeedHeaderOverlayProps) => {
    return (
        <SafeAreaView style={styles.headerOverlay}>
            <View style={styles.headerTop}>
                <View style={styles.tabsRow}>
                    <TouchableOpacity onPress={() => onTabChange('Following')}>
                        <Text style={[styles.tabText, activeTab === 'Following' && styles.tabTextActive]}>Following</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onTabChange('Explore')} style={styles.activeTabContainer}>
                        <Text style={[styles.tabText, activeTab === 'Explore' && styles.tabTextActive]}>Explore</Text>
                        {activeTab === 'Explore' && <View style={styles.activeDot} />}
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.searchIconBg}>
                    <AppIcon library="Feather" name="search" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
                {tags.map((tag) => (
                    <TouchableOpacity key={tag} style={styles.tagPill}>
                        <AppIcon library="AntDesign" name="fire" size={14} color="#F97316" />
                        <Text style={styles.tagPillText}>{tag}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerOverlay: { position: 'absolute', top: 0, width: '100%', zIndex: 10, paddingTop: 10 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    tabsRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    tabText: { color: 'rgba(255,255,255,0.6)', fontSize: 18, fontWeight: '700' },
    tabTextActive: { color: '#FFF', fontSize: 20, fontWeight: '900' },
    activeTabContainer: { alignItems: 'center' },
    activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B', marginTop: 4 },
    searchIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
    tagsScroll: { paddingHorizontal: 20, gap: 10 },
    tagPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tagPillText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});

export default FeedHeaderOverlay;
