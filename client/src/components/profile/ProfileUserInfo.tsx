import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

import { USER_DATA } from './mockData';

type ProfileUserInfoProps = {
    colors: {
        primary: string;
        background: string;
        text: string;
        textSecondary: string;
        surface: string;
    };
};

const ProfileUserInfo = ({ colors }: ProfileUserInfoProps) => (
    <View style={styles.userInfoContainer}>
        <View style={styles.avatarWrapper}>
            <Image source={{ uri: USER_DATA.avatar }} style={styles.avatar} />
            <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: colors.primary, borderColor: colors.background }]}>
                <AppIcon library="Feather" name="camera" size={14} color="#FFF" />
            </TouchableOpacity>
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>{USER_DATA.name}</Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{USER_DATA.email}</Text>
        <View style={[styles.memberBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.memberText, { color: colors.textSecondary }]}>{USER_DATA.memberSince}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    userInfoContainer: { alignItems: 'center', paddingVertical: 32 },
    avatarWrapper: { position: 'relative', marginBottom: 16 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
    userName: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
    userEmail: { fontSize: 14, marginBottom: 12 },
    memberBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    memberText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});

export default ProfileUserInfo;
