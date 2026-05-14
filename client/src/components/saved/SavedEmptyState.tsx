import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@/components/ui';

type SavedEmptyStateProps = {
    colors: {
        surface: string;
        text: string;
        textSecondary: string;
        primary: string;
    };
};

const SavedEmptyState = ({ colors }: SavedEmptyStateProps) => (
    <View style={styles.emptyContainer}>
        <View style={[styles.emptyIconBg, { backgroundColor: colors.surface }]}>
            <AppIcon library="Feather" name="heart" size={40} color={colors.textSecondary} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No saved items yet</Text>
        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
            Explore AfroSpot and tap the heart icon to save your favorite spots and products here.
        </Text>
        <TouchableOpacity style={[styles.exploreBtn, { backgroundColor: colors.primary }]}>
            <Text style={styles.exploreBtnText}>Explore Now</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 20 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    exploreBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 },
    exploreBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});

export default SavedEmptyState;
