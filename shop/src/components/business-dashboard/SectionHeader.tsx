import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';
import { DashboardColors } from './types';

type SectionHeaderProps = {
    title: string;
    actionLabel: string;
    colors: DashboardColors;
    onActionPress?: () => void;
};

export const SectionHeader = ({ title, actionLabel, colors, onActionPress }: SectionHeaderProps) => (
    <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>{actionLabel}</Text>
        </TouchableOpacity>
    </View>
);
