import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
} from 'react-native';

import { AppAlert, AppIcon } from '@components/ui';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import { useTranslationContext } from '@contexts/TranslationContext';
import type { AppStackNavigationProp } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LanguageBottomSheet from '@components/profile/LanguageBottomSheet';
import ProfilePhotoActionSheet from '@components/profile/ProfilePhotoActionSheet';
import { LANGUAGES } from '@components/profile/mockData';
import ProfileHeader from '@components/profile/ProfileHeader';
import ProfileMenuGroup from '@components/profile/ProfileMenuGroup';
import ProfileMenuItem from '@components/profile/ProfileMenuItem';
import ProfileUserInfo from '@components/profile/ProfileUserInfo';
import { pickProfileImage, type ProfileImageSource } from '@utils/profileImagePicker';

const ProfileScreen = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    const { signOut, user, updateProfile } = useAuth();
    const { language, setLanguage, supportedLanguages } = useTranslationContext();
    const navigation = useNavigation<AppStackNavigationProp<'Profile'>>();
    const [showLanguageSheet, setShowLanguageSheet] = useState(false);
    const [showPhotoSheet, setShowPhotoSheet] = useState(false);
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
    const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);
    const [profileError, setProfileError] = useState<{ title: string; message: string } | null>(null);

    const availableLanguages = LANGUAGES.filter((item) =>
        supportedLanguages.includes(item.id as (typeof supportedLanguages)[number]),
    );

    const selectedLanguageName =
        availableLanguages.find((item) => item.id === (user?.language || language))?.name ?? 'English';

    const handleSelectLanguage = async (languageId: string) => {
        try {
            setIsUpdatingLanguage(true);
            await Promise.all([
                setLanguage(languageId),
                updateProfile({ language: languageId }),
            ]);
        } catch {
            setProfileError({
                title: 'Language update failed',
                message: 'Could not update your language right now. Please try again.',
            });
        } finally {
            setIsUpdatingLanguage(false);
        }
    };

    const handlePickProfilePhoto = async (source: ProfileImageSource) => {
        setShowPhotoSheet(false);

        const image = await pickProfileImage(source);

        if (!image) {
            return;
        }

        try {
            setProfileError(null);
            setIsUpdatingAvatar(true);
            await updateProfile({ profile_picture: image });
        } catch {
            setProfileError({
                title: 'Photo update failed',
                message: 'Could not update your profile photo right now. Please try again.',
            });
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <ProfileHeader colors={colors} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {profileError ? (
                    <AppAlert
                        title={profileError.title}
                        message={profileError.message}
                        variant="error"
                        dismissible
                        onClose={() => setProfileError(null)}
                        containerStyle={styles.avatarErrorAlert}
                    />
                ) : null}

                <ProfileUserInfo
                    colors={colors}
                    user={user}
                    onEditAvatarPress={() => setShowPhotoSheet(true)}
                    isUploadingAvatar={isUpdatingAvatar}
                />

                {/* Account Menu Group */}
                <ProfileMenuGroup label="ACCOUNT" colors={colors}>
                    <ProfileMenuItem
                        icon="user"
                        label="Edit Profile"
                        colors={colors}
                        onPress={() => navigation.navigate('EditProfile')}
                    />
                    <ProfileMenuItem
                        icon="heart"
                        label="Saved Places & Products"
                        onPress={() => navigation.navigate('Saved')}
                        colors={colors}
                        isLast
                    />
                </ProfileMenuGroup>

                {/* History Menu Group */}
                <ProfileMenuGroup label="HISTORY" colors={colors}>
                    <ProfileMenuItem
                        icon="calendar"
                        label="Booking History"
                        colors={colors}
                        onPress={() => navigation.navigate('BookingHistory')}
                    />
                    <ProfileMenuItem
                        icon="shopping-bag"
                        label="Orders History"
                        colors={colors}
                        onPress={() => navigation.navigate('OrdersHistory')}
                    />
                    <ProfileMenuItem
                        icon="star"
                        label="Reviews Submitted"
                        colors={colors}
                        onPress={() => navigation.navigate('Reviews', { source: 'profile' })}
                        isLast
                    />
                </ProfileMenuGroup>

                {/* Preferences Menu Group */}
                <ProfileMenuGroup label="PREFERENCES" colors={colors}>
                    <ProfileMenuItem
                        icon="globe"
                        label="Language"
                        value={isUpdatingLanguage ? 'Updating...' : selectedLanguageName}
                        colors={colors}
                        onPress={() => setShowLanguageSheet(true)}
                    />
                    <ProfileMenuItem
                        icon={isDark ? 'moon' : 'sun'}
                        label="Dark Mode"
                        colors={colors}
                        isLast
                        rightElement={
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: '#D1D5DB', true: colors.primary + '80' }}
                                thumbColor={isDark ? colors.primary : '#FFF'}
                            />
                        }
                    />
                </ProfileMenuGroup>

                {/* Logout Button */}
                <TouchableOpacity
                    style={[styles.logoutBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={signOut}
                >
                    <AppIcon library="Feather" name="log-out" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={[styles.appVersion, { color: colors.textSecondary }]}>AfroSpot v1.0.0</Text>

            </ScrollView>

            <LanguageBottomSheet
                visible={showLanguageSheet}
                onClose={() => setShowLanguageSheet(false)}
                onSelectLanguage={handleSelectLanguage}
                currentLanguage={user?.language || language}
                languages={availableLanguages}
                colors={colors}
            />

            <ProfilePhotoActionSheet
                visible={showPhotoSheet}
                onClose={() => setShowPhotoSheet(false)}
                onCameraPress={() => {
                    handlePickProfilePhoto('camera').catch(() => undefined);
                }}
                onGalleryPress={() => {
                    handlePickProfilePhoto('gallery').catch(() => undefined);
                }}
                isBusy={isUpdatingAvatar}
                colors={colors}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 60 },
    avatarErrorAlert: { marginHorizontal: 20, marginTop: 14, marginBottom: -4 },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 16,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 10,
    },
    logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '800' },
    appVersion: { textAlign: 'center', marginTop: 32, fontSize: 12, fontWeight: '500' },
});

export default ProfileScreen;