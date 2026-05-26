import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import i18n from '@i18n/index';

type ProfileUserInfoProps = {
    onEditAvatarPress: () => void;
    isUploadingAvatar?: boolean;
};

const FALLBACK_AVATAR = 'https://i.pravatar.cc/150?img=47';

function formatMemberSince(dateJoined?: string | null): string {
    if (!dateJoined) {
        return 'Member profile';
    }

    const parsedDate = new Date(dateJoined);

    if (Number.isNaN(parsedDate.getTime())) {
        return 'Member profile';
    }

    const formattedDate = parsedDate.toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });

    return `Member since ${formattedDate}`;
}

const ProfileUserInfo = ({ onEditAvatarPress, isUploadingAvatar = false }: ProfileUserInfoProps) => {
    const { colors } = useTheme();
        const { user,  } = useAuth();
    const displayName = user?.full_name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Your profile';

    return (
        <View style={styles.userInfoContainer}>
            <View style={styles.avatarWrapper}>
                <Image source={{ uri: user?.profile_picture || FALLBACK_AVATAR }} style={[styles.avatar , { borderColor: colors.border , borderWidth: 1 }]} />
                <TouchableOpacity
                    style={[styles.editAvatarBtn, { backgroundColor: colors.primary, borderColor: colors.background }]}
                    onPress={onEditAvatarPress}
                    disabled={isUploadingAvatar}
                >
                    {isUploadingAvatar ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <AppIcon library="Feather" name="camera" size={14} color="#FFF" />
                    )}
                </TouchableOpacity>
            </View>
            <Text style={[styles.userName, { color: colors.text }]}>{displayName}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || 'No email available'}</Text>
            <View style={[styles.memberBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.memberText, { color: colors.textSecondary }]}>
                    {isUploadingAvatar ? 'Uploading photo...' : formatMemberSince(user?.date_joined)}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    userInfoContainer: { alignItems: 'center', paddingVertical: 10 },
    avatarWrapper: { position: 'relative', marginBottom: 10 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
    userName: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
    userEmail: { fontSize: 14, marginBottom: 12 },
    memberBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    memberText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});

export default ProfileUserInfo;
