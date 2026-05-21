import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

type ProfileMenuItemProps = {
    icon: string;
    label: string;
    value?: string;
    isLast?: boolean;
    rightElement?: React.ReactNode;
    colors: {
        text: string;
        textSecondary: string;
        primary: string;
        border: string;
    };
    onPress?: () => void;
};

const ProfileMenuItem = ({
    icon,
    label,
    value,
    isLast,
    rightElement,
    colors,
    onPress,
}: ProfileMenuItemProps) => (
    <TouchableOpacity
        style={[styles.menuItem, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
        onPress={onPress}
        disabled={!!rightElement}
    >
        <View style={[styles.menuIconBg, { backgroundColor: colors.primary + '15' }]}>
            <AppIcon library="Feather" name={icon} size={18} color={colors.primary} />
        </View>
        <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>

        <View style={styles.menuRight}>
            {value && <Text style={[styles.menuValue, { color: colors.textSecondary }]}>{value}</Text>}
            {rightElement ? (
                rightElement
            ) : (
                <AppIcon library="Feather" name="chevron-right" size={20} color={colors.textSecondary} />
            )}
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    menuIconBg: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
    menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    menuValue: { fontSize: 14, fontWeight: '500' },
});

export default ProfileMenuItem;
