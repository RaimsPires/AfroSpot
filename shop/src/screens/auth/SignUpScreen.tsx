import CountryPicker from '@avaiyakapil/react-native-country-picker';
import RenderCountryButton from '@components/business-kyc/RenderCountryButton';
import { AppIcon, DatePickerField, Input } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiClient } from '@services/apiClient';
import { useRegistrationStore } from '@store/useRegistrationStore';
import { EmailCheckResponse } from '@type/auth';
import { pickProfileImage } from '@utils/profileImagePicker';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SignUpNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SignUpScreen = () => {
    const { colors, spacing, isDark } = useTheme();
    const navigation = useNavigation<SignUpNavigationProp>();

    const {fieldErrors , firstName, lastName ,setFirstName,setLastName , dateOfBirth , setDateOfBirth , userProfileImage , setUserProfileImage , userCountryCode , setUserCountryCode , userPhone , setUserPhone , userEmail , setUserEmail , password , setPassword , confirmPassword , setConfirmPassword } = useRegistrationStore();



    // --- Email availability check ---
    type EmailStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error';
    const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');
    const emailDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    const isDisabled =
        !firstName.trim() ||
        !lastName.trim() ||
        !userEmail.trim() ||
        !userPhone.trim() ||
        !password.trim() ||
        password !== confirmPassword;


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

    console.log(emailHelperText);
    // --- Email debounce check ---
    useEffect(() => {
        if (emailDebounceRef.current) { clearTimeout(emailDebounceRef.current); }

        if (!userEmail.trim() || !EMAIL_RE.test(userEmail.trim())) {
            setEmailStatus('idle');
            return;
        }

        setEmailStatus('checking');
        emailDebounceRef.current = setTimeout(async () => {
            try {
                const response = await apiClient.get<EmailCheckResponse>(
                    `/auth/check-email/?email=${encodeURIComponent(userEmail.trim().toLowerCase())}`,
                );
                setEmailStatus(response.data.available ? 'available' : 'taken');
            } catch {
                setEmailStatus('error');
            }
        }, 500);

        return () => {
            if (emailDebounceRef.current) { clearTimeout(emailDebounceRef.current); }
        };
    }, [userEmail]);

    const handlePickImage = async () => {
        const selectedImage = await pickProfileImage();

        if (!selectedImage) {
            return;
        }

        setUserProfileImage(selectedImage.path);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                                <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                            </TouchableOpacity>
                            <Text style={[styles.headerTitle, { color: colors.text }]}>Create Account</Text>
                            <View style={styles.headerRight} />
                        </View>

                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                        >

                            {/* Welcome */}
                            <View style={styles.welcomeSection}>
                                <Text style={[styles.stepText, { color: colors.primary }]}>Step 1 of 3</Text>
                                <Text style={[styles.title, { color: colors.text }]}>Join AfroSpot</Text>
                                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                    Create your AfroSpot account, then register your business.
                                </Text>
                            </View>

                            {/* Profile Photo Picker */}
                            <View style={styles.photoSection}>
                                <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} style={styles.avatarContainer}>
                                    {userProfileImage ? (
                                        <Image source={{ uri: userProfileImage }} style={styles.avatar} />
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
                                    Optional — helps businesses recognise you.
                                </Text>
                            </View>

                            {/* Form */}
                            <View style={styles.form}>
                                {/* First + Last name row */}
                                <View style={styles.row}>
                                    <View style={{ flex: 1 }}>
                                        <Input
                                            label="First Name"
                                            placeholder="John"
                                            value={firstName}
                                            onChangeText={setFirstName}
                                        />
                                    </View>
                                    <View style={{ width: spacing(2) }} />
                                    <View style={{ flex: 1 }}>
                                        <Input
                                            label="Last Name"
                                            placeholder="Doe"
                                            value={lastName}
                                            onChangeText={setLastName}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <DatePickerField
                                        label="Date of Birth"
                                        value={dateOfBirth}
                                        onChange={(d) => {
                                            setDateOfBirth(d);
                                            // if (fieldErrors.dob) { setFieldErrors((e) => ({ ...e, dob: undefined })); }
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

                                <View>

                                    <Input
                                        label="Email Address"
                                        placeholder="john@example.com"
                                        leftIcon={{ library: 'Feather', name: 'mail' }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={userEmail}
                                        onChangeText={setUserEmail}
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

                                <View>
                                    <Text style={[styles.labelFix, { color: colors.text }]}>Country</Text>
                                    <View style={[styles.countryPickerWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <CountryPicker
                                            theme={isDark ? 'dark' : 'light'}
                                            countryCode={userCountryCode}
                                            showCallingCode={false}
                                            showCountryName
                                            showFlag
                                            colors={{
                                                grayLight: colors.border,
                                                grayBackground: colors.background,
                                                white: colors.border,
                                                gray: colors.textSecondary,
                                                dark: colors.text,
                                            }}
                                            iconColor={colors.text}
                                            // containerStyle={styles.countryPickerButton}
                                            renderSelectedCountry={RenderCountryButton}
                                            onSelect={(code) => {
                                                setUserCountryCode(code);
                                            }}
                                        />
                                    </View>
                                </View>

                                {/* Phone row with country picker */}
                                <View style={styles.phoneRow}>
                                    <View style={{ width: 110 }}>
                                        <Text style={[styles.labelFix, { color: colors.text }]}>Phone</Text>
                                        <View style={[styles.countryPickerWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                            <CountryPicker
                                                theme={isDark ? 'dark' : 'light'}
                                                countryCode={userCountryCode}
                                                showCountryName={false}
                                                showCallingCode
                                                showFlag
                                                colors={{
                                                    grayLight: colors.border,
                                                    grayBackground: colors.background,
                                                    white: colors.border,
                                                    gray: colors.textSecondary,
                                                    dark: colors.text,
                                                }}
                                                iconColor={colors.text}
                                                // containerStyle={styles.countryPickerButton}
                                                onSelect={(code) => {
                                                    setUserCountryCode(code);
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: spacing(1.5) }} />
                                    <View style={{ flex: 1 }}>
                                        <Input
                                            label=" "
                                            placeholder="812 345 6789"
                                            keyboardType="phone-pad"
                                            value={userPhone}
                                            onChangeText={setUserPhone}
                                        />
                                    </View>
                                </View>

                                <Input
                                    label="Password"
                                    placeholder="••••••••••••"
                                    secureTextEntry
                                    leftIcon={{ library: 'Feather', name: 'lock' }}
                                    value={password}
                                    onChangeText={setPassword}
                                />

                                <Input
                                    label="Confirm Password"
                                    placeholder="••••••••••••"
                                    secureTextEntry
                                    leftIcon={{ library: 'Feather', name: 'shield' }}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />

                                <AppButton
                                    title="Create Account"
                                    disabled={isDisabled || emailStatus === 'checking' || emailStatus === 'taken'}
                                    onPress={() => navigation.navigate('BusinessKYC')}
                                    style={{ marginTop: spacing(1) }}
                                />

                                <TouchableOpacity style={styles.footerLink} onPress={() => navigation.navigate('Auth')}>
                                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                                        Already have an account?{' '}
                                        <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Sign In</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerRight: { width: 32 },
    iconBtn: { padding: 4 },
    scrollContent: { padding: 24 },
    welcomeSection: { marginBottom: 24 },
    stepText: { fontSize: 13, fontWeight: '800', marginBottom: 8 },
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
    phoneRow: { flexDirection: 'row', alignItems: 'flex-end' },
    labelFix: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    countryPickerWrap: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    countryPickerButton: {
        width: '100%',
    },
    selectedCountryRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedCountryFlag: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 10,
    },
    selectedCountryName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
    },
    emailAdornmentRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, paddingHorizontal: 4 },
    emailHelperText: { fontSize: 12 },
    fieldError: { fontSize: 12, marginTop: 4, paddingHorizontal: 4 },
    fieldErrorCenter: { textAlign: 'center' },
    footerLink: { marginTop: 20, alignItems: 'center' },
    footerText: { fontSize: 15 },
});

export default SignUpScreen;
