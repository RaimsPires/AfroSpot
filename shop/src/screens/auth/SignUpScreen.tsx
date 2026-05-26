import CountryPicker, { CountryCode, type Country } from '@avaiyakapil/react-native-country-picker';
import { AppIcon, Button, Input } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
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
import { pickAndCropFromLibrary, SHOP_CROP_PRESETS } from '@utils/hybridImagePicker';
import { SafeAreaView } from 'react-native-safe-area-context';

type SignUpNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export const SignUpScreen = () => {
    const { colors, spacing, isDark } = useTheme();
    const navigation = useNavigation<SignUpNavigationProp>();

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [countryCode, setCountryCode] = useState<CountryCode>('NG');
    const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>('NG');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isDisabled =
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !password.trim() ||
        password !== confirmPassword;

    const handlePickImage = async () => {
        const selectedImage = await pickAndCropFromLibrary(
            SHOP_CROP_PRESETS.profile,
            'Error',
            'Could not select image',
        );

        if (!selectedImage) {
            return;
        }

        setProfileImage(selectedImage.path);
    };

    const renderCountryButton = (country: Country) => (
        <View style={styles.selectedCountryRow}>
            <Image source={{ uri: country.flag }} style={styles.selectedCountryFlag} />
            <Text style={[styles.selectedCountryName, { color: colors.text }]} numberOfLines={1}>
                {country.name?.common}
            </Text>
        </View>
    );

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
                        <Text style={[styles.labelFix, { color: colors.text }]}>Country</Text>
                        <View style={[styles.countryPickerWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                            <CountryPicker
                                countryCode={selectedCountryCode}
                                showCallingCode={false}
                                showCountryName
                                showFlag
                                containerStyle={styles.countryPickerButton}
                                renderSelectedCountry={renderCountryButton}
                                onSelect={(code) => {
                                    setSelectedCountryCode(code);
                                }}
                            />
                        </View>
                    </View>

                    <Input
                        label="Email Address"
                        placeholder="john@example.com"
                        leftIcon={{ library: 'Feather', name: 'mail' }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Phone row with country picker */}
                    <View style={styles.phoneRow}>
                        <View style={{ width: 110 }}>
                            <Text style={[styles.labelFix, { color: colors.text }]}>Phone</Text>
                            <View style={[styles.countryPickerWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <CountryPicker
                                    countryCode={countryCode}
                                    showCountryName={false}
                                    showCallingCode
                                    showFlag
                                    containerStyle={styles.countryPickerButton}
                                    onSelect={(code) => {
                                        setCountryCode(code);
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
                                value={phone}
                                onChangeText={setPhone}
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

                    <Button
                        title="Create Account"
                        disabled={isDisabled}
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
    footerLink: { marginTop: 20, alignItems: 'center' },
    footerText: { fontSize: 15 },
});

export default SignUpScreen;
