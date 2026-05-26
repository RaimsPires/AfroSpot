import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import ProfilePhotoActionSheet from '@components/profile/ProfilePhotoActionSheet';
import { AppAlert, AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
import DatePickerField from '@components/ui/DatePickerField';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { pickProfileImage, type ProfileImageSource } from '@utils/profileImagePicker';
import { SafeAreaView } from 'react-native-safe-area-context';

const FALLBACK_AVATAR = 'https://i.pravatar.cc/150?img=47';

const waitForIdle = () =>
    new Promise<void>((resolve) => {
        const requestIdle = (globalThis as typeof globalThis & {
            requestIdleCallback?: (callback: () => void) => number;
        }).requestIdleCallback;

        if (typeof requestIdle === 'function') {
            requestIdle(() => resolve());
            return;
        }

        setTimeout(resolve, 0);
    });

function parseApiDate(value?: string | null): Date | null {
    if (!value) {
        return null;
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatApiDate(value: Date | null): string | undefined {
    if (!value) {
        return undefined;
    }

    return value.toISOString().split('T')[0];
}

const EditProfileScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'EditProfile'>>();
    const { colors, isDark } = useTheme();
    const { user, updateProfile } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState<Date | null>(null);
    const [avatarPreviewUri, setAvatarPreviewUri] = useState<string | null>(null);
    const [showPhotoSheet, setShowPhotoSheet] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

    useEffect(() => {
        setFirstName(user?.first_name ?? '');
        setLastName(user?.last_name ?? '');
        setPhone(user?.phone_number ?? '');
        setDob(parseApiDate(user?.dob));
        setAvatarPreviewUri(user?.profile_picture ?? null);
    }, [user]);

    const email = useMemo(() => user?.email ?? '', [user?.email]);

    const handleSaveChanges = async () => {
        try {
            setIsSaving(true);
            await updateProfile({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phone_number: phone.trim(),
                ...(formatApiDate(dob) ? { dob: formatApiDate(dob) } : {}),
            });
            navigation.goBack();
        } catch {
            setPhotoUploadError('Could not save your profile right now. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePickProfilePhoto = async (source: ProfileImageSource) => {
        setShowPhotoSheet(false);
        await waitForIdle();

        const selectedImage = await pickProfileImage(source);

        if (!selectedImage) {
            return;
        }

        const previousAvatarUri = avatarPreviewUri;
        setAvatarPreviewUri(selectedImage.uri);

        try {
            setPhotoUploadError(null);
            setIsUploadingPhoto(true);
            await updateProfile({ profile_picture: selectedImage });
        } catch {
            setAvatarPreviewUri(previousAvatarUri);
            setPhotoUploadError('Could not update your profile photo right now. Please try again.');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
                <View style={styles.headerSpacer} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {photoUploadError ? (
                        <AppAlert
                            title="Update failed"
                            message={photoUploadError}
                            variant="error"
                            dismissible
                            onClose={() => setPhotoUploadError(null)}
                            containerStyle={styles.errorAlert}
                        />
                    ) : null}

                    {/* 2. Avatar Edit Section */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: avatarPreviewUri || FALLBACK_AVATAR }} style={styles.avatar} />
                            <TouchableOpacity style={styles.avatarOverlay} onPress={() => setShowPhotoSheet(true)}>
                                {isUploadingPhoto ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <AppIcon library="Feather" name="camera" size={24} color="#FFF" />
                                )}
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.changePhotoBtn} onPress={() => setShowPhotoSheet(true)} disabled={isUploadingPhoto}>
                            <Text style={[styles.changePhotoText, { color: colors.primary }]}>
                                {isUploadingPhoto ? 'Uploading Photo...' : 'Change Profile Photo'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* 3. Form Inputs */}
                    <View style={styles.formContainer}>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>FIRST NAME</Text>
                            <TextInput
                                style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="Enter your first name"
                                autoCapitalize="words"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>LAST NAME</Text>
                            <TextInput
                                style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Enter your last name"
                                autoCapitalize="words"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>EMAIL ADDRESS</Text>
                            <TextInput
                                style={[styles.inputField, styles.disabledField, { backgroundColor: colors.surface, color: colors.textSecondary, borderColor: colors.border }]}
                                value={email}
                                editable={false}
                                placeholder="Email address"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PHONE NUMBER</Text>
                            <View style={[styles.iconInputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <AppIcon library="Feather" name="phone" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.iconInputField, { color: colors.text }]}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    placeholder="Enter your phone number"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DATE OF BIRTH</Text>
                            <DatePickerField
                                label=""
                                value={dob}
                                onChange={setDob}
                                maximumDate={new Date()}
                                placeholder="Select your date of birth"
                            />
                        </View>

                    </View>

                    {/* Optional: Change Password Link */}
                    <TouchableOpacity style={styles.passwordBtn}>
                        <AppIcon library="Feather" name="lock" size={18} color={colors.primary} />
                        <Text style={[styles.passwordText, { color: colors.primary }]}>Change Password</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* 4. Sticky Bottom Action */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <AppButton
                    title={isSaving ? 'Saving Changes...' : 'Save Changes'}
                    onPress={handleSaveChanges}
                    disabled={isSaving || isUploadingPhoto}
                />
            </View>

            <ProfilePhotoActionSheet
                visible={showPhotoSheet}
                onClose={() => setShowPhotoSheet(false)}
                onCameraPress={() => {
                    handlePickProfilePhoto('camera').catch(() => undefined);
                }}
                onGalleryPress={() => {
                    handlePickProfilePhoto('gallery').catch(() => undefined);
                }}
                isBusy={isUploadingPhoto}
                colors={colors}
            />
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    headerSpacer: { width: 40 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 24 },

    // Avatar Section
    avatarContainer: { alignItems: 'center', marginBottom: 32 },
    errorAlert: { marginBottom: 18 },
    avatarWrapper: { position: 'relative', width: 110, height: 110, borderRadius: 55, overflow: 'hidden', marginBottom: 16 },
    avatar: { width: '100%', height: '100%' },
    avatarOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
    changePhotoBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.05)' },
    changePhotoText: { fontSize: 13, fontWeight: '700' },

    // Form Inputs
    formContainer: { marginBottom: 24 },
    inputGroup: { marginBottom: 20 },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },

    inputField: { height: 52, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, fontSize: 15, fontWeight: '500' },
    disabledField: { opacity: 0.8 },

    iconInputWrap: { flexDirection: 'row', alignItems: 'center', height: 52, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16 },
    inputIcon: { marginRight: 10 },
    iconInputField: { flex: 1, fontSize: 15, fontWeight: '500' },

    // Password Button
    passwordBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, gap: 8, alignSelf: 'flex-start' },
    passwordText: { fontSize: 15, fontWeight: '700' },

    // Footer
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1 },
});

export default EditProfileScreen;