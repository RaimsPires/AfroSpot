import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@contexts/ThemeContext';

type SectionHeaderProps = {
    title: string;
    rightText?: string;
    onRightPress?: () => void;
};

const SectionHeader = ({ title, rightText, onRightPress }: SectionHeaderProps) => {
    const { colors } = useTheme();

    return (
        <View style={styles.sectionHeader}>
            <View style={styles.titleWithBar}>
                <View style={[styles.orangeBar, { backgroundColor: colors.primary }]} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            </View>
            {rightText ? (
                <TouchableOpacity onPress={onRightPress}>
                    <Text style={[styles.rightText, { color: colors.primary }]}>{rightText}</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    titleWithBar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    orangeBar: { width: 4, height: 20, borderRadius: 2 },
    sectionTitle: { fontSize: 18, fontWeight: '800' },
    rightText: { fontWeight: '700' },
});

export default SectionHeader;
