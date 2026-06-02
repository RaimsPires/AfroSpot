import CountryPicker, { CountryCode, type Country } from '@avaiyakapil/react-native-country-picker';
import { AppIcon, Button, Input } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { pickAndCropFromLibrary, SHOP_CROP_PRESETS, type ShopImageFile } from '@utils/hybridImagePicker';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'BusinessKYC'>;

// 1. Updated categories to match your Django model exactly
const BUSINESS_CATEGORIES = ['Beauty', 'Food', 'Fashion', 'Events', 'Services', 'Other'];

type UploadState = {
    banner?: { fileName: string; path: string };
    profile?: { fileName: string; path: string };
    document?: { fileName: string; path: string };
};

export const BusinessKYCScreen = ({ navigation }: Props) => {
    const { colors, spacing } = useTheme();

    // --- STEP TRACKING ---
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);



    // --- FORM STATE ---
    const [businessName, setBusinessName] = useState('');
    // Keep your existing state
    const [businessCountryCode, setBusinessCountryCode] = useState<CountryCode>('NG');
    const [businessPhoneCountryCode, setBusinessPhoneCountryCode] = useState<CountryCode>('NG');

    // ADD THIS: Track the actual calling code for the phone number
    const [phoneCallingCode, setPhoneCallingCode] = useState<string>('234');

    // Changed to a single string to match Django's CharField
    const [businessCategory, setBusinessCategory] = useState<string>('');

    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [taxRegistrationNumber, setTaxRegistrationNumber] = useState('');
    const [uploads, setUploads] = useState<UploadState>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- VALIDATIONS ---
    const canProceedToStep2 = useMemo(
        () =>
            Boolean(
                businessName.trim() &&
                businessCountryCode &&
                businessCategory &&
                contactPhone.trim() &&
                contactEmail.trim() &&
                businessAddress.trim() &&
                taxRegistrationNumber.trim()
            ),
        [businessName, businessCountryCode, businessCategory, contactPhone, contactEmail, businessAddress, taxRegistrationNumber]
    );

    const canSubmitFinal = useMemo(
        () => Boolean(uploads.banner && uploads.profile && uploads.document),
        [uploads.banner, uploads.profile, uploads.document]
    );

    // --- UPLOAD HANDLERS ---
    const setUpload = (slot: keyof UploadState, image: ShopImageFile) => {
        setUploads((prev) => ({
            ...prev,
            [slot]: {
                fileName: image.fileName || `${slot}.jpg`,
                path: image.path,
            },
        }));
    };

    const pickBannerImage = async () => {
        const image = await pickAndCropFromLibrary(SHOP_CROP_PRESETS.banner, 'Upload failed', 'Could not select banner.');
        if (image) setUpload('banner', image);
    };

    const pickProfileImage = async () => {
        const image = await pickAndCropFromLibrary(SHOP_CROP_PRESETS.profile, 'Upload failed', 'Could not select logo.');
        if (image) setUpload('profile', image);
    };

    const pickDocumentImage = async () => {
        const image = await pickAndCropFromLibrary(null, 'Upload failed', 'Could not select document.');
        if (image) setUpload('document', image);
    };

    // --- SUBMISSION ---
    const handleSubmit = async () => {
        if (!canSubmitFinal) return;
        setIsSubmitting(true);

        try {
            // 1. Combine the calling code and phone number beautifully!
            // Removes any leading zero the user might have typed (e.g., 080123 -> +23480123)
            const formattedPhone = `+${phoneCallingCode}${contactPhone.replace(/^0+/, '')}`;

            const formData = new FormData();

            // 2. Append the text fields
            formData.append('name', businessName);
            formData.append('address', businessAddress);
            formData.append('email', contactEmail.toLowerCase().trim());
            formData.append('tax_number', taxRegistrationNumber);
            formData.append('phone_number', formattedPhone);
            formData.append('category', businessCategory.toLowerCase());

            // Note: businessCountryCode sends 'NG'. If your Django backend 
            // expects the full name ('Nigeria'), you can track the full 
            // country.name in state just like we did with the calling code!
            formData.append('country', businessCountryCode);

            // ... append your images as usual ...

            // await apiClient.post('/api/spots/', formData, {
            //     headers: { 'Content-Type': 'multipart/form-data' }
            // });

            navigation.replace('BusinessKYCSuccess');
        } catch (error) {
            console.error('Submission failed:', error);
            Alert.alert('Error', 'Could not submit your KYC. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    // --- UI COMPONENTS ---
    const renderCountryButton = (country: Country) => (
        <View style={styles.selectedCountryRow}>
            <Image source={{ uri: country.flag }} style={styles.selectedCountryFlag} />
            <Text style={[styles.selectedCountryName, { color: colors.text }]} numberOfLines={1}>
                {country.name?.common}
            </Text>
        </View>
    );

    const UploadCard = ({ title, helper, file, onPress, icon }: any) => (
        <TouchableOpacity onPress={onPress} style={[styles.uploadBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            {file ? (
                <View style={styles.uploadFilledState}>
                    <Image source={{ uri: file.path }} style={styles.uploadPreview} />
                    <View style={styles.uploadInfo}>
                        <Text style={[styles.uploadTitle, { color: colors.text }]}>{title}</Text>
                        <Text style={[styles.uploadHelper, { color: colors.textSecondary }]} numberOfLines={1}>{file.fileName}</Text>
                    </View>
                    <AppIcon library="Feather" name="check-circle" size={20} color={colors.success} />
                </View>
            ) : (
                <View style={styles.uploadPlaceholder}>
                    <AppIcon library="Feather" name={icon} size={22} color={colors.primary} />
                    <Text style={[styles.uploadTitle, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.uploadHelper, { color: colors.textSecondary }]}>{helper}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.container}>

                        {/* DYNAMIC HEADER */}
                        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                            {currentStep === 2 && (
                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={() => setCurrentStep(1)}
                                >
                                    <AppIcon library="Feather" name="arrow-left" size={24} color={colors.text} />
                                </TouchableOpacity>
                            )}
                            <View>
                                <Text style={[styles.stepText, { color: colors.primary }]}>
                                    Step 2 of 3 • {currentStep === 1 ? 'Details' : 'Uploads'}
                                </Text>
                                <Text style={[styles.title, { color: colors.text }]}>
                                    {currentStep === 1 ? 'Register your business' : 'Visual Identity'}
                                </Text>
                                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                    {currentStep === 1 ? 'A few details to complete your business KYC.' : 'Upload your brand visuals and legal document.'}
                                </Text>
                            </View>
                        </View>

                        <ScrollView contentContainerStyle={styles.content} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">

                            {/* --- STEP 1: TEXT DETAILS --- */}
                            {currentStep === 1 && (
                                <View style={styles.section}>
                                    <Input label="Business name" inputStyle={{ color: colors.text }} value={businessName} onChangeText={setBusinessName} placeholder="Enter legal business name" />

                                    <Text style={[styles.label, { color: colors.text }]}>Business country</Text>
                                    <View style={[styles.countryPickerWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <CountryPicker countryCode={businessCountryCode} showCallingCode={false} showCountryName showFlag containerStyle={styles.countryPickerButton} renderSelectedCountry={renderCountryButton} onSelect={setBusinessCountryCode} />
                                    </View>

                                    <Text style={[styles.label, { color: colors.text }]}>Business category</Text>
                                    <View style={styles.categoryRow}>
                                        {BUSINESS_CATEGORIES.map((category) => {
                                            const active = businessCategory === category;
                                            return (
                                                <TouchableOpacity
                                                    key={category}
                                                    onPress={() => setBusinessCategory(category)}
                                                    style={[
                                                        styles.categoryChip,
                                                        {
                                                            backgroundColor: active ? colors.primary : colors.surface,
                                                            borderColor: active ? colors.primary : colors.border,
                                                        },
                                                    ]}
                                                >
                                                    <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '700' }}>{category}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                    <View style={styles.phoneRow}>
                                        <View style={{ width: 110 }}>
                                            <Text style={[styles.label, { color: colors.text }]}>Business phone</Text>
                                            <View style={[styles.phoneCountryPickerWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                                <CountryPicker
                                                    countryCode={businessPhoneCountryCode}
                                                    showCountryName={false}
                                                    showCallingCode
                                                    showFlag
                                                    containerStyle={styles.countryPickerButton}
                                                    onSelect={(country: Country) => {
                                                        // country.cca2 is 'NG', 'US', etc.
                                                        setBusinessPhoneCountryCode(country.cca2);

                                                        // country.callingCode is an array, e.g., ['234']
                                                        if (country.callingCode && country.callingCode.length > 0) {
                                                            setPhoneCallingCode(country.callingCode[0]);
                                                        }
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ width: spacing(1.5) }} />
                                        <View style={{ flex: 1 }}>
                                            <Input label=" " keyboardType="phone-pad" inputStyle={{ color: colors.text }} value={contactPhone} onChangeText={setContactPhone} placeholder="Enter business phone" />
                                        </View>
                                    </View>
                                    <Input label="Business email" keyboardType="email-address" autoCapitalize="none" inputStyle={{ color: colors.text }} value={contactEmail} onChangeText={setContactEmail} placeholder="Enter business email" />
                                    <Input label="Business address" inputStyle={{ color: colors.text }} value={businessAddress} onChangeText={setBusinessAddress} placeholder="Enter business address" />
                                    <Input label="Tax or registration number" inputStyle={{ color: colors.text }} value={taxRegistrationNumber} onChangeText={setTaxRegistrationNumber} placeholder="Enter tax or registration number" />
                                </View>
                            )}

                            {/* --- STEP 2: FILE UPLOADS --- */}
                            {currentStep === 2 && (
                                <View style={styles.section}>
                                    <UploadCard title="Business banner image" helper="Tap to upload banner" file={uploads.banner} onPress={pickBannerImage} icon="image" />
                                    <UploadCard title="Business profile image" helper="Tap to upload logo" file={uploads.profile} onPress={pickProfileImage} icon="user" />
                                    <UploadCard title="ID or business document" helper="Tap to upload document" file={uploads.document} onPress={pickDocumentImage} icon="file-text" />
                                </View>
                            )}
                        </ScrollView>

                        {/* DYNAMIC FOOTER */}
                        <View style={[styles.footer, { borderTopColor: colors.border }]}>
                            {currentStep === 1 ? (
                                <Button
                                    title="Next: Upload Documents"
                                    onPress={() => setCurrentStep(2)}
                                    disabled={!canProceedToStep2}
                                />
                            ) : (
                                <Button
                                    title="Submit Registration"
                                    onPress={handleSubmit}
                                    loading={isSubmitting}
                                    disabled={!canSubmitFinal || isSubmitting}
                                />
                            )}
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 24, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'flex-start' },
    backButton: { marginRight: 16, marginTop: 4, padding: 4 },
    stepText: { fontSize: 13, fontWeight: '800', marginBottom: 8 },
    title: { fontSize: 28, fontWeight: '900', marginBottom: 8 },
    subtitle: { fontSize: 14, lineHeight: 20 },
    content: { padding: 24 },
    section: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
    phoneRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
    categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
    categoryChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
    countryPickerWrap: { height: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 16, justifyContent: 'center' },
    phoneCountryPickerWrap: { height: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, justifyContent: 'center' },
    countryPickerButton: { width: '100%' },
    selectedCountryRow: { width: '100%', flexDirection: 'row', alignItems: 'center' },
    selectedCountryFlag: { width: 24, height: 24, borderRadius: 12, marginRight: 10 },
    selectedCountryName: { flex: 1, fontSize: 14, fontWeight: '600' },
    uploadBox: { height: 130, borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, justifyContent: 'center', marginBottom: 12, overflow: 'hidden' },
    uploadPlaceholder: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    uploadFilledState: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 12 },
    uploadPreview: { width: 72, height: 72, borderRadius: 10 },
    uploadInfo: { flex: 1 },
    uploadTitle: { marginTop: 10, fontWeight: '700', fontSize: 14 },
    uploadHelper: { marginTop: 4, fontSize: 12 },
    footer: { padding: 24, borderTopWidth: 1 },
});