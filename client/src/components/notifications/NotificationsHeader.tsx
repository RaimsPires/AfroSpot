import { AppIcon } from '@/components/ui';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type NotificationsHeaderProps = {
    colors: any;
    onSettingsPress?: () => void;
    onProfilePress?: () => void;
};

export const NotificationsHeader = ({
    colors,
    onSettingsPress,
    onProfilePress,
}: NotificationsHeaderProps) => {
    return (
        <View style={[styles.header, { backgroundColor: colors.background }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
            <View style={styles.headerRight}>
                <TouchableOpacity onPress={onSettingsPress} style={styles.iconBtn}>
                    <AppIcon library="Feather" name="settings" size={22} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onProfilePress} style={styles.avatarContainer}>
                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=47' }} style={styles.avatar} />
                    <View style={styles.onlineDot} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
    headerTitle: { fontSize: 22, fontWeight: '900' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    iconBtn: { padding: 4 },
    avatarContainer: { position: 'relative' },
    avatar: { width: 36, height: 36, borderRadius: 18 },
    onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFF' },
});
