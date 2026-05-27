import CountryPicker, { CountryCode } from '@avaiyakapil/react-native-country-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    NativeModules,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import ProfilePhotoActionSheet from '@components/profile/ProfilePhotoActionSheet';
import { AppIcon, DatePickerField, Input } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiClient } from '@services/apiClient';
import type { EmailCheckResponse, RegisterPayload, UploadableImage } from '@type/auth';
import { pickProfileImage, type ProfileImageSource } from '@utils/profileImagePicker';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDeviceLocale(): string {
    try {
        const locale: string =
            NativeModules.SettingsManager?.settings?.AppleLocale ||
            NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
            NativeModules.I18nManager?.localeIdentifier ||
            'en';
        return locale.split('_')[0].split('-')[0];
    } catch {
        return 'en';
    }
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildInternationalPhoneNumber(localPhone: string, countryCallingCode: string): string | undefined {
    const localDigits = localPhone.replace(/\D/g, '');
    if (!localDigits) { return undefined; }

    const callingCodeDigits = countryCallingCode.replace(/\D/g, '');
    if (!callingCodeDigits) {
        return `+${localDigits}`;
    }

    // Avoid duplicating the calling code if user typed the full number.
    if (localDigits.startsWith(callingCodeDigits)) {
        return `+${localDigits}`;
    }

    return `+${callingCodeDigits}${localDigits}`;
}

function validateForm(fields: {
    firstName: string;
    lastName: string;
    email: string;
    password1: string;
    password2: string;
    dateOfBirth: Date | null;
}): Partial<Record<string, string>> {
    const errors: Partial<Record<string, string>> = {};

    if (!fields.firstName.trim()) { errors.firstName = 'First name is required.'; }
    if (!fields.lastName.trim()) { errors.lastName = 'Last name is required.'; }
    if (!fields.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!EMAIL_RE.test(fields.email.trim())) {
        errors.email = 'Enter a valid email address.';
    }
    if (!fields.password1) {
        errors.password1 = 'Password is required.';
    } else if (fields.password1.length < 8) {
        errors.password1 = 'Password must be at least 8 characters.';
    }
    if (!fields.password2) {
        errors.password2 = 'Please confirm your password.';
    } else if (fields.password1 !== fields.password2) {
        errors.password2 = 'Passwords do not match.';
    }
    if (!fields.dateOfBirth) { errors.dob = 'Date of birth is required.'; }

    return errors;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const RegisterScreen = () => {
    const { colors, spacing, isDark } = useTheme();
    const navigation = useNavigation<AuthNavigationProp>();
    const { signUp, loading } = useAuth();

    // --- Profile image ---
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showPhotoSheet, setShowPhotoSheet] = useState(false);
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

    // --- Form fields ---
    const [firstName, setFirstName] = useState('Raims');
    const [lastName, setLastName] = useState('Koka');
    const [email, setEmail] = useState('admin2@afrospot.com');
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(new Date(1990, 0, 1));
    const [residenceCountryCode, setResidenceCountryCode] = useState<CountryCode>('CM');
    const [phoneCountryCode, setPhoneCountryCode] = useState<CountryCode>('CM');
    const [phoneCallingCode, setPhoneCallingCode] = useState('237');
    const [phoneNumber, setPhoneNumber] = useState('695681690');
    const [password1, setPassword1] = useState('death123@');
    const [password2, setPassword2] = useState('death123@');

    // --- Email availability check ---
    type EmailStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error';
    const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');
    const emailDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- Inline validation errors ---
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    // --- Email debounce check ---
    useEffect(() => {
        if (emailDebounceRef.current) { clearTimeout(emailDebounceRef.current); }

        if (!email.trim() || !EMAIL_RE.test(email.trim())) {
            setEmailStatus('idle');
            return;
        }

        setEmailStatus('checking');
        emailDebounceRef.current = setTimeout(async () => {
            try {
                const response = await apiClient.get<EmailCheckResponse>(
                    `/auth/check-email/?email=${encodeURIComponent(email.trim().toLowerCase())}`,
                );
                setEmailStatus(response.data.available ? 'available' : 'taken');
            } catch {
                setEmailStatus('error');
            }
        }, 500);

        return () => {
            if (emailDebounceRef.current) { clearTimeout(emailDebounceRef.current); }
        };
    }, [email]);

    const handlePickProfilePhoto = async (source: ProfileImageSource) => {
        setShowPhotoSheet(false);
        try {
            setIsUpdatingAvatar(true);
            const selectedImage = await pickProfileImage(source);
            if (!selectedImage) { return; }
            setProfileImage(selectedImage.uri);
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitError(null);

        const errors = validateForm({ firstName, lastName, email, password1, password2, dateOfBirth });
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});

        if (emailStatus === 'taken') {
            setFieldErrors({ email: 'This email is already registered.' });
            return;
        }

        const dobString = dateOfBirth
            ? dateOfBirth.toISOString().split('T')[0]
            : undefined;

        const language = getDeviceLocale();
        const fullPhoneNumber = buildInternationalPhoneNumber(phoneNumber, phoneCallingCode);

        // Build payload — use FormData when a profile picture was selected
        let payload: RegisterPayload | FormData;

        if (profileImage) {
            const fileName = profileImage.split('/').pop() ?? 'photo.jpg';
            const ext = fileName.split('.').pop()?.toLowerCase() ?? 'jpg';
            const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
            const uploadable: UploadableImage = { uri: profileImage, name: fileName, type: mimeType };

            const fd = new FormData();
            fd.append('email', email.trim().toLowerCase());
            fd.append('password1', password1);
            fd.append('password2', password2);
            fd.append('first_name', firstName.trim());
            fd.append('last_name', lastName.trim());
            if (dobString) { fd.append('dob', dobString); }
            fd.append('country', residenceCountryCode);
            if (fullPhoneNumber) { fd.append('phone_number', fullPhoneNumber); }
            fd.append('language', language);
            fd.append('profile_picture', uploadable as unknown as Blob);
            payload = fd;
        } else {
            const jsonPayload: RegisterPayload = {
                email: email.trim().toLowerCase(),
                password1,
                password2,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                dob: dobString,
                country: residenceCountryCode,
                phone_number: fullPhoneNumber,
                language,
            };
            payload = jsonPayload;
        }

        try {
            await signUp(payload);
            navigation.navigate('EmailVerificationPending', {
                email: email.trim().toLowerCase(),
                password: password1,
            });
        } catch (error: any) {
            const data = error?.response?.data;
            if (data && typeof data === 'object') {
                // Map field-level errors from the API response
                const apiErrors: Partial<Record<string, string>> = {};
                for (const [key, value] of Object.entries(data)) {
                    const msg = Array.isArray(value) ? (value as string[])[0] : String(value);
                    apiErrors[key] = msg;
                }
                setFieldErrors(apiErrors);
                if (apiErrors.email) {
                    setEmailStatus('taken');
                }
            } else {
                setSubmitError('Registration failed. Please try again.');
            }
        }
    };

    // --- Email status indicator ---
    const renderEmailAdornment = () => {
        if (emailStatus === 'checking') {
            return <ActivityIndicator size="small" color={colors.primary} />;
        }
        if (emailStatus === 'available') {
            return <AppIcon library="Feather" name="check-circle" size={18} color="#22c55e" />;
        }
        if (emailStatus === 'taken') {
            return <AppIcon library="Feather" name="x-circle" size={18} color={colors.error ?? '#ef4444'} />;
        }
        return null;
    };

    const emailHelperText =
        emailStatus === 'available'
            ? 'Email is available.'
            : emailStatus === 'taken'
            ? 'This email is already registered.'
            : fieldErrors.email ?? undefined;

    const emailHelperColor =
        emailStatus === 'available'
            ? '#22c55e'
            : emailStatus === 'taken'
            ? colors.error ?? '#ef4444'
            : colors.error ?? '#ef4444';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Create Account</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.welcomeSection}>
                    <Text style={[styles.title, { color: colors.text }]}>Join the Community</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Start discovering African-owned businesses today.
                    </Text>
                </View>

                {/* Profile Photo */}
                <View style={styles.photoSection}>
                    <TouchableOpacity onPress={() => setShowPhotoSheet(true)} activeOpacity={0.8} style={styles.avatarContainer}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surface }]}>
                                <AppIcon library="Feather" name="user" size={40} color={colors.textSecondary} />
                            </View>
                        )}
                        <View style={[styles.cameraBtn, { backgroundColor: colors.primary }]}>
                            <AppIcon library="Feather" name="camera" size={16} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.photoLabel, { color: colors.text }]}>Add Profile Photo</Text>
                    <Text style={[styles.photoSub, { color: colors.textSecondary }]}>
                        Help businesses recognize you for bookings and reviews.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>

                    {/* Name row */}
                    <View style={styles.row}>
                        <View style={styles.flexOne}>
                            <Input
                                label="First Name"
                                placeholder="Amina"
                                value={firstName}
                                onChangeText={(v) => {
                                    setFirstName(v);
                                    if (fieldErrors.firstName) { setFieldErrors((e) => ({ ...e, firstName: undefined })); }
                                }}
                                error={fieldErrors.firstName}
                            />
                        </View>
                        <View style={{ width: spacing(2) }} />
                        <View style={styles.flexOne}>
                            <Input
                                label="Last Name"
                                placeholder="Okoro"
                                value={lastName}
                                onChangeText={(v) => {
                                    setLastName(v);
                                    if (fieldErrors.lastName) { setFieldErrors((e) => ({ ...e, lastName: undefined })); }
                                }}
                                error={fieldErrors.lastName}
                            />
                        </View>
                    </View>

                    {/* Email with debounce check */}
                    <View>
                        <Input
                            label="Email Address"
                            placeholder="amina@example.com"
                            leftIcon={{ library: 'Feather', name: 'mail' }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={(v) => {
                                setEmail(v);
                                if (fieldErrors.email) { setFieldErrors((e) => ({ ...e, email: undefined })); }
                            }}
                            error={emailStatus === 'taken' || emailStatus === 'error' || fieldErrors.email ? emailHelperText : undefined}
                        />
                        <View style={styles.emailAdornmentRow}>
                            {renderEmailAdornment()}
                            {emailStatus === 'available' && (
                                <Text style={[styles.emailHelperText, { color: emailHelperColor }]}>
                                    {emailHelperText}
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Date of birth */}
                    <View>
                        <DatePickerField
                            label="Date of Birth"
                            value={dateOfBirth}
                            onChange={(d) => {
                                setDateOfBirth(d);
                                if (fieldErrors.dob) { setFieldErrors((e) => ({ ...e, dob: undefined })); }
                            }}
                            placeholder="Select your date of birth"
                            maximumDate={new Date()}
                            minimumDate={new Date(1900, 0, 1)}
                            helperText="Used to personalize your profile and verify your age."
                        />
                        {fieldErrors.dob && (
                            <Text style={[styles.fieldError, { color: colors.error ?? '#ef4444' }]}>
                                {fieldErrors.dob}
                            </Text>
                        )}
                    </View>

                    {/* Country of residence */}
                    <View style={styles.fieldGroup}>
                        <Text style={[styles.labelFix, { color: colors.text }]}>Country of Residence</Text>
                        <View style={[styles.countryPickerField, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <CountryPicker
                                modalStyle={{ backgroundColor: colors.surface }}
                                modalAnimationType="fade"
                                colors={{
                                    grayLight: colors.border,
                                    grayBackground: colors.background,
                                    white: colors.border,
                                    gray: colors.textSecondary,
                                    dark: colors.text,
                                }}
                                iconColor={colors.text}
                                countryCode={residenceCountryCode}
                                showCallingCode={false}
                                containerWidth="100%"
                                onSelect={(countryCode) => setResidenceCountryCode(countryCode)}
                            />
                        </View>
                    </View>

                    {/* Phone row */}
                    <View style={styles.phoneRow}>
                        <View style={styles.phoneCountryColumn}>
                            <Text style={[styles.labelFix, { color: colors.text }]}>Phone</Text>
                            <View style={[styles.countryPickerWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <CountryPicker
                                    modalStyle={{ backgroundColor: colors.surface }}
                                    modalAnimationType="fade"
                                    colors={{
                                        grayLight: colors.border,
                                        grayBackground: colors.background,
                                        white: colors.border,
                                        gray: colors.textSecondary,
                                        dark: colors.text,
                                    }}
                                    iconColor={colors.text}
                                    countryCode={phoneCountryCode}
                                    onSelect={(countryCode, country: any) => {
                                        setPhoneCountryCode(countryCode);
                                        const nextCallingCode = Array.isArray(country?.callingCode)
                                            ? String(country.callingCode[0] ?? '')
                                            : String(country?.callingCode ?? '');
                                        setPhoneCallingCode(nextCallingCode);
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ width: spacing(1.5) }} />
                        <View style={styles.flexOne}>
                            <Input
                                label=" "
                                placeholder="812 345 6789"
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <Input
                        label="Password"
                        placeholder="••••••••••••"
                        secureTextEntry
                        leftIcon={{ library: 'Feather', name: 'lock' }}
                        value={password1}
                        onChangeText={(v) => {
                            setPassword1(v);
                            if (fieldErrors.password1) { setFieldErrors((e) => ({ ...e, password1: undefined })); }
                        }}
                        error={fieldErrors.password1}
                    />

                    {/* Confirm password */}
                    <Input
                        label="Confirm Password"
                        placeholder="••••••••••••"
                        secureTextEntry
                        leftIcon={{ library: 'Feather', name: 'shield' }}
                        value={password2}
                        onChangeText={(v) => {
                            setPassword2(v);
                            if (fieldErrors.password2) { setFieldErrors((e) => ({ ...e, password2: undefined })); }
                        }}
                        error={fieldErrors.password2}
                    />

                    {/* Global submit error */}
                    {submitError && (
                        <Text style={[styles.fieldError, styles.fieldErrorCenter, { color: colors.error ?? '#ef4444' }]}>
                            {submitError}
                        </Text>
                    )}

                    <AppButton
                        title="Create Account"
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={loading || emailStatus === 'taken'}
                        rightIcon="arrow-right"
                        style={{ marginTop: spacing(1) }}
                    />

                    <TouchableOpacity style={styles.footerLink} onPress={() => navigation.navigate('LogIn')}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            Already have an account?{' '}
                            <Text style={[{ color: colors.primary }, styles.signInStrong]}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ProfilePhotoActionSheet
                visible={showPhotoSheet}
                onClose={() => setShowPhotoSheet(false)}
                onCameraPress={() => {
                    handlePickProfilePhoto('camera').catch((e) => console.log('Camera error:', e));
                }}
                onGalleryPress={() => {
                    handlePickProfilePhoto('gallery').catch((e) => console.log('Gallery error:', e));
                }}
                isBusy={isUpdatingAvatar}
                colors={colors}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerRight: { width: 40 },
    iconBtn: { padding: 4 },
    scrollContent: { padding: 24 },
    welcomeSection: { marginBottom: 24 },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
    subtitle: { fontSize: 15 },
    photoSection: { alignItems: 'center', marginBottom: 32 },
    avatarContainer: { position: 'relative' },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
    cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
    photoLabel: { fontSize: 16, fontWeight: '700', marginTop: 12 },
    photoSub: { fontSize: 13, textAlign: 'center', marginTop: 4, paddingHorizontal: 40 },
    form: { gap: 16 },
    row: { flexDirection: 'row' },
    fieldGroup: { gap: 8 },
    flexOne: { flex: 1 },
    phoneRow: { flexDirection: 'row', alignItems: 'flex-end' },
    phoneCountryColumn: { width: 110 },
    labelFix: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    countryPickerWrap: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    countryPickerField: {
        minHeight: 48,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    emailAdornmentRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, paddingHorizontal: 4 },
    emailHelperText: { fontSize: 12 },
    fieldError: { fontSize: 12, marginTop: 4, paddingHorizontal: 4 },
    fieldErrorCenter: { textAlign: 'center' },
    signInStrong: { fontWeight: 'bold' },
    footerLink: { marginTop: 20, alignItems: 'center' },
    footerText: { fontSize: 15 },
});

export default RegisterScreen;
// import {
//     Image,
//     ScrollView,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from 'react-native';

// // Using your specific imports
// import { AppIcon, DatePickerField, Input } from '@components/ui';
// import AppButton from '@components/ui/Button';
// import ProfilePhotoActionSheet from '@components/profile/ProfilePhotoActionSheet';
// import { useTheme } from '@contexts/ThemeContext';
// import type { AuthStackParamList } from '@navigation/AuthStackNavigator';
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { pickProfileImage, type ProfileImageSource } from '@utils/profileImagePicker';
// import { SafeAreaView } from 'react-native-safe-area-context';

// type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

// const RegisterScreen = () => {
//     const { colors, spacing, isDark } = useTheme();
//     const navigation = useNavigation<AuthNavigationProp>();


//     // State for Image and Country
//     const [profileImage, setProfileImage] = useState<string | null>(null);
//     const [phoneCountryCode, setPhoneCountryCode] = useState<CountryCode>('NG');
//     const [residenceCountryCode, setResidenceCountryCode] = useState<CountryCode>('NG');
//     const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
//     const [showPhotoSheet, setShowPhotoSheet] = useState(false);
//     const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

//     const handlePickProfilePhoto = async (source: ProfileImageSource) => {
//         setShowPhotoSheet(false);
//         try {
//             setIsUpdatingAvatar(true);
//             const selectedImage = await pickProfileImage(source);

//             if (!selectedImage) {
//                 return;
//             }

//             setProfileImage(selectedImage.uri);
//         } finally {
//             setIsUpdatingAvatar(false);
//         }
//     };

//     return (
//         <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//             <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

//             {/* 1. Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
//                     <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
//                 </TouchableOpacity>
//                 <Text style={[styles.headerTitle, { color: colors.text }]}>Create Account</Text>
//                 <View style={styles.headerRight}>
//                     <TouchableOpacity style={styles.iconBtn}>
//                         <AppIcon library="Feather" name="search" size={20} color={colors.text} />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.iconBtn}>
//                         <AppIcon library="Feather" name="bell" size={20} color={colors.text} />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//                 <View style={styles.welcomeSection}>
//                     <Text style={[styles.title, { color: colors.text }]}>Join the Community</Text>
//                     <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
//                         Start discovering African-owned businesses today.
//                     </Text>
//                 </View>

//                 {/* 2. Profile Photo Picker with Crop Picker */}
//                 <View style={styles.photoSection}>
//                     <TouchableOpacity onPress={() => setShowPhotoSheet(true)} activeOpacity={0.8} style={styles.avatarContainer}>
//                         {profileImage ? (
//                             <Image source={{ uri: profileImage }} style={styles.avatar} />
//                         ) : (
//                             <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surface }]}>
//                                 <AppIcon library="Feather" name="user" size={40} color={colors.textSecondary} />
//                             </View>
//                         )}
//                         <View style={[styles.cameraBtn, { backgroundColor: colors.primary }]}>
//                             <AppIcon library="Feather" name="camera" size={16} color="#FFF" />
//                         </View>
//                     </TouchableOpacity>
//                     <Text style={[styles.photoLabel, { color: colors.text }]}>Add Profile Photo</Text>
//                     <Text style={[styles.photoSub, { color: colors.textSecondary }]}>
//                         Help businesses recognize you for bookings and reviews.
//                     </Text>
//                 </View>

//                 {/* 3. Form Section */}
//                 <View style={styles.form}>
//                     <View style={styles.row}>
//                         <View style={styles.flexOne}>
//                             <Input label="First Name" placeholder="Amina" />
//                         </View>
//                         <View style={{ width: spacing(2) }} />
//                         <View style={styles.flexOne}>
//                             <Input label="Last Name" placeholder="Okoro" />
//                         </View>
//                     </View>

//                     <Input
//                         label="Email Address"
//                         placeholder="amina@example.com"
//                         leftIcon={{ library: 'Feather', name: 'mail' }}
//                     />

//                     <DatePickerField
//                         label="Date of Birth"
//                         value={dateOfBirth}
//                         onChange={setDateOfBirth}
//                         placeholder="Select your date of birth"
//                         maximumDate={new Date()}
//                         minimumDate={new Date(1900, 0, 1)}
//                         helperText="Used to personalize your profile and verify your age."
//                     />

//                     <View style={styles.fieldGroup}>
//                         <Text style={[styles.labelFix, { color: colors.text }]}>Country of Residence</Text>
//                         <View style={[styles.countryPickerField, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
//                             <CountryPicker
//                                 modalStyle={{ backgroundColor: colors.surface }}
//                                 modalAnimationType='fade'
//                                 colors={{
//                                     grayLight: colors.border,
//                                     grayBackground: colors.background,
//                                     white: colors.border,
//                                     gray: colors.textSecondary,
//                                     dark: colors.text,
//                                 }}
//                                 iconColor={colors.text}
//                                 countryCode={residenceCountryCode}
//                                 showCallingCode={false}
//                                 containerWidth="100%"
//                                 onSelect={(countryCode) => {
//                                     setResidenceCountryCode(countryCode);
//                                 }}
//                             />
//                         </View>
//                     </View>

//                     {/* 4. Phone Row with Country Picker */}
//                     <View style={styles.phoneRow}>
//                         <View style={styles.phoneCountryColumn}>
//                             <Text style={[styles.labelFix, { color: colors.text }]}>Phone</Text>
//                             <View style={[styles.countryPickerWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
//                                 <CountryPicker
//                                     modalStyle={{ backgroundColor: colors.surface }}
//                                     modalAnimationType='fade'
//                                     colors={{
//                                         grayLight: colors.border,
//                                         grayBackground: colors.background,
//                                         white: colors.border,
//                                         gray: colors.textSecondary,
//                                         dark: colors.text,
//                                     }}
//                                     // callingCodeStyle={{ color: colors.text }}
//                                     iconColor={colors.text}
//                                     countryCode={phoneCountryCode}
//                                     onSelect={(countryCode, country) => {
//                                         console.log('Selected Country:', country);
//                                         setPhoneCountryCode(countryCode);
//                                     }}
//                                 />
//                             </View>
//                         </View>
//                         <View style={{ width: spacing(1.5) }} />
//                         <View style={styles.flexOne}>
//                             <Input label=" " placeholder="812 345 6789" keyboardType="phone-pad" />
//                         </View>
//                     </View>

//                     <Input
//                         label="Password"
//                         placeholder="••••••••••••"
//                         secureTextEntry
//                         leftIcon={{ library: 'Feather', name: 'lock' }}
//                     />

//                     <Input
//                         label="Confirm Password"
//                         placeholder="••••••••••••"
//                         secureTextEntry
//                         leftIcon={{ library: 'Feather', name: 'shield' }}
//                     />

//                     <AppButton
//                         title="Create Account"
//                         onPress={() => navigation.navigate('OTP')}
//                         rightIcon='arrow-right'
//                         // rightIcon={<AppIcon library="Feather" name="arrow-right" size={20} color="#FFF" />}
//                         style={{ marginTop: spacing(1) }}
//                     />

//                     <TouchableOpacity style={styles.footerLink} onPress={() => navigation.navigate('LogIn')}>
//                         <Text style={[styles.footerText, { color: colors.textSecondary }]}>
//                             Already have an account? <Text style={[{ color: colors.primary }, styles.signInStrong]}>Sign In</Text>
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>

//             <ProfilePhotoActionSheet
//                 visible={showPhotoSheet}
//                 onClose={() => setShowPhotoSheet(false)}
//                 onCameraPress={() => {
//                     handlePickProfilePhoto('camera').catch((e) => console.log('Camera error:', e));
//                 }}
//                 onGalleryPress={() => {
//                     handlePickProfilePhoto('gallery').catch((e) => console.log('Gallery error:', e));
//                 }}
//                 isBusy={isUpdatingAvatar}
//                 colors={colors}
//             />
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56 },
//     headerTitle: { fontSize: 18, fontWeight: '800' },
//     headerRight: { flexDirection: 'row', gap: 12 },
//     iconBtn: { padding: 4 },
//     scrollContent: { padding: 24 },
//     welcomeSection: { marginBottom: 24 },
//     title: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
//     subtitle: { fontSize: 15 },
//     photoSection: { alignItems: 'center', marginBottom: 32 },
//     avatarContainer: { position: 'relative' },
//     avatar: { width: 100, height: 100, borderRadius: 50 },
//     avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
//     cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
//     photoLabel: { fontSize: 16, fontWeight: '700', marginTop: 12 },
//     photoSub: { fontSize: 13, textAlign: 'center', marginTop: 4, paddingHorizontal: 40 },
//     form: { gap: 16 },
//     row: { flexDirection: 'row' },
//     fieldGroup: { gap: 8 },
//     flexOne: { flex: 1 },
//     phoneRow: { flexDirection: 'row', alignItems: 'flex-end' },
//     phoneCountryColumn: { width: 110 },
//     labelFix: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
//     countryPickerWrap: {
//         height: 48,
//         borderRadius: 12,
//         borderWidth: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 8,
//         justifyContent: 'center'
//     },
//     countryPickerField: {
//         minHeight: 48,
//         borderRadius: 12,
//         borderWidth: 1,
//         paddingHorizontal: 8,
//         justifyContent: 'center'
//     },
//     countryPickerStyle: { padding: 10, borderRadius: 8, borderWidth: 1 },
//     callingCode: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
//     signInStrong: { fontWeight: 'bold' },
//     footerLink: { marginTop: 20, alignItems: 'center' },
//     footerText: { fontSize: 15 },
// });

// export default RegisterScreen;