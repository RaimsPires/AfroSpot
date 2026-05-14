import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ProfileMenuGroupProps = {
    label: string;
    children: React.ReactNode;
    colors: {
        textSecondary: string;
        surface: string;
        border: string;
    };
};

const ProfileMenuGroup = ({ label, children, colors }: ProfileMenuGroupProps) => (
    <View style={styles.menuGroup}>
        <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>{label}</Text>
        <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {children}
        </View>
    </View>
);

const styles = StyleSheet.create({
    menuGroup: { paddingHorizontal: 20, marginBottom: 24 },
    groupLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 8, marginLeft: 8 },
    groupCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
});

export default ProfileMenuGroup;
