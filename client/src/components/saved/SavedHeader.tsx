import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

type SavedHeaderProps = {
    colors: {
        background: string;
        text: string;
        border: string;
    };
};

const SavedHeader = ({ colors }: SavedHeaderProps) => (
    <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Saved</Text>
        <TouchableOpacity style={styles.iconBtn}>
            <AppIcon library="Feather" name="search" size={22} color={colors.text} />
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
        borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 24, fontWeight: '900' },
    iconBtn: { padding: 4 },
});

export default SavedHeader;
