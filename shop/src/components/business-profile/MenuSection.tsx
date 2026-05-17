import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './styles';
import { MenuSectionProps } from './types';

export const MenuSection = ({ title, colors, children }: MenuSectionProps) => (
    <View style={styles.section}>
        {title ? <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text> : null}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>{children}</View>
    </View>
);
