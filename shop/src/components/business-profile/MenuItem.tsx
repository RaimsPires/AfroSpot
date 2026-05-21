import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

import { styles } from './styles';
import { MenuItemProps } from './types';

export const MenuItem = ({ icon, label, value, isLast, rightElement, colorOverride, colors, handlePress }: MenuItemProps) => (
    <TouchableOpacity
        style={[styles.itemContainer, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
        disabled={!!rightElement}
        onPress={handlePress}
    >
        <View style={styles.itemLeft}>
            <View style={[styles.iconBg, { backgroundColor: colorOverride ? colorOverride + '15' : colors.primary + '15' }]}>
                <AppIcon library="Feather" name={icon} size={18} color={colorOverride || colors.primary} />
            </View>
            <Text style={[styles.itemLabel, { color: colorOverride || colors.text }]}>{label}</Text>
        </View>
        <View style={styles.itemRight}>
            {value && <Text style={[styles.itemValue, { color: colors.textSecondary }]}>{value}</Text>}
            {rightElement ? rightElement : <AppIcon library="Feather" name="chevron-right" size={20} color={colors.textSecondary} />}
        </View>
    </TouchableOpacity>
);
