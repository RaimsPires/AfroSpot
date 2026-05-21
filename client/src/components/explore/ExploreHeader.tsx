import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

type ExploreHeaderProps = {
    colors: {
        background: string;
        text: string;
    };
    onMapPress?: () => void;
};

const ExploreHeader = ({ colors, onMapPress }: ExploreHeaderProps) => (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Explore</Text>
        <TouchableOpacity onPress={onMapPress} style={styles.iconBtn}>
            <AppIcon library="Feather" name="map" size={22} color={colors.text} />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: { fontSize: 28, fontWeight: '900' },
    iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' },
});

export default ExploreHeader;
