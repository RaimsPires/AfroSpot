import CountryPicker, { CountryCode } from '@avaiyakapil/react-native-country-picker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

// Using your specific imports
import { AppIcon, Input } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = () => {
    const { colors, spacing, isDark } = useTheme();

    // State for Image and Country
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [countryCode, setCountryCode] = useState<CountryCode>('NG');
    const [callingCode, setCallingCode] = useState('234');


    useEffect(() => {
        const handleSubmit = () => {
            console.log(callingCode);
            console.log(countryCode);
        };
        handleSubmit();
    }, [callingCode, countryCode]);

    const handlePickImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            cropperCircleOverlay: true,
            compressImageQuality: 0.8,
        }).then(image => {
            setProfileImage(image.path);
        }).catch(err => {
            if (err.code !== 'E_PICKER_CANCELLED') {
                Alert.alert('Error', 'Could not select image');
            }
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Create Account</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="search" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="bell" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.welcomeSection}>
                    <Text style={[styles.title, { color: colors.text }]}>Join the Community</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Start discovering African-owned businesses today.
                    </Text>
                </View>

                {/* 2. Profile Photo Picker with Crop Picker */}
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
                        Help businesses recognize you for bookings and reviews.
                    </Text>
                </View>

                {/* 3. Form Section */}
                <View style={styles.form}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Input label="First Name" placeholder="Amina" />
                        </View>
                        <View style={{ width: spacing(2) }} />
                        <View style={{ flex: 1 }}>
                            <Input label="Last Name" placeholder="Okoro" />
                        </View>
                    </View>

                    <Input
                        label="Email Address"
                        placeholder="amina@example.com"
                        leftIcon={{ library: 'Feather', name: 'mail' }}
                    />

                    {/* 4. Phone Row with Country Picker */}
                    <View style={styles.phoneRow}>
                        <View style={{ width: 110 }}>
                            <Text style={[styles.labelFix, { color: colors.text }]}>Phone</Text>
                            <View style={[styles.countryPickerWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <CountryPicker
                                    countryCode={countryCode}
                                    // withFilter
                                    // withFlag
                                    // withCallingCode
                                    onSelect={(countryCode, country) => {
                                        setCountryCode(countryCode);
                                        setCallingCode(country.callingCode[0] || '');
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ width: spacing(1.5) }} />
                        <View style={{ flex: 1 }}>
                            <Input label=" " placeholder="812 345 6789" keyboardType="phone-pad" />
                        </View>
                    </View>

                    <Input
                        label="Password"
                        placeholder="••••••••••••"
                        secureTextEntry
                        leftIcon={{ library: 'Feather', name: 'lock' }}
                    />

                    <Input
                        label="Confirm Password"
                        placeholder="••••••••••••"
                        secureTextEntry
                        leftIcon={{ library: 'Feather', name: 'shield' }}
                    />

                    <AppButton
                        title="Create Account"
                        rightIcon='arrow-right'
                        // rightIcon={<AppIcon library="Feather" name="arrow-right" size={20} color="#FFF" />}
                        style={{ marginTop: spacing(1) }}
                    />

                    <TouchableOpacity style={styles.footerLink}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            Already have an account? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerRight: { flexDirection: 'row', gap: 12 },
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
    phoneRow: { flexDirection: 'row', alignItems: 'flex-end' },
    labelFix: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    countryPickerWrap: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        justifyContent: 'center'
    },
    callingCode: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
    footerLink: { marginTop: 20, alignItems: 'center' },
    footerText: { fontSize: 15 },
});

export default RegisterScreen;