import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { IconLibrary } from '@types/ui';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type CategoryItemProps = {
    icon: string;
    label: string;
    active?: boolean;
    library?: IconLibrary;
    onPress?: () => void;
};

export const CategoryItem = ({
    icon,
    label,
    active = false,
    library = 'AntDesign',
    onPress,
}: CategoryItemProps) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity activeOpacity={0.85} disabled={!onPress} onPress={onPress} style={styles.catWrap}>
            <View style={[styles.catIcon, { backgroundColor: active ? colors.primary : colors.surface }]}>
                <AppIcon library={library} name={icon} size={24} color={active ? '#FFF' : colors.text} />
            </View>
            <Text style={[styles.catLabel, { color: colors.text }]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    catWrap: { alignItems: 'center', margin: 8, gap: 6 },
    catIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    catLabel: { fontSize: 11, fontWeight: '600' },
});
