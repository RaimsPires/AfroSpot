import CountryPicker, { CountryCode, type Country } from '@avaiyakapil/react-native-country-picker';
import { AppIcon, Button, Input } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import ImagePicker, { type Image as PickerImage } from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'BusinessKYC'>;

const BUSINESS_CATEGORIES = ['Beauty', 'Food', 'Fashion', 'Events', 'Services'];

type UploadState = {
    banner?: { fileName: string; path: string };
    profile?: { fileName: string; path: string };
    document?: { fileName: string; path: string };
};

export const BusinessKYCScreen = ({ navigation }: Props) => {
    const { colors, spacing } = useTheme();
    const [businessName, setBusinessName] = useState('');
    const [businessCountryCode, setBusinessCountryCode] = useState<CountryCode>('NG');
    const [businessPhoneCountryCode, setBusinessPhoneCountryCode] = useState<CountryCode>('NG');
    const [businessCategories, setBusinessCategories] = useState<string[]>([]);
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [taxRegistrationNumber, setTaxRegistrationNumber] = useState('');
    const [uploads, setUploads] = useState<UploadState>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canSubmit = useMemo(
        () =>
            Boolean(
                businessName.trim() &&
                    businessCountryCode &&
                    businessCategories.length > 0 &&
                    contactPhone.trim() &&
                    contactEmail.trim() &&
                    businessAddress.trim() &&
                    taxRegistrationNumber.trim() &&
                    uploads.banner &&
                    uploads.profile &&
                    uploads.document,
            ),
        [
            businessAddress,
            businessCategories,
            businessName,
            businessCountryCode,
            contactEmail,
            contactPhone,
            taxRegistrationNumber,
            uploads.banner,
            uploads.document,
            uploads.profile,
        ],
    );

    const setUpload = (slot: keyof UploadState, image: PickerImage) => {
        setUploads((prev) => ({
            ...prev,
            [slot]: {
                fileName: image.filename || `${slot}.jpg`,
                path: image.path,
            },
        }));
    };

    const pickBannerImage = () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            width: 1200,
            height: 400,
            cropping: true,
            compressImageQuality: 0.8,
        })
            .then((image) => setUpload('banner', image))
            .catch((err: unknown) => {
                const code = (err as { code?: string })?.code;
                if (code !== 'E_PICKER_CANCELLED') {
                    Alert.alert('Upload failed', 'Could not select banner image.');
                }
            });
    };

    const pickProfileImage = () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            width: 300,
            height: 300,
            cropping: true,
            cropperCircleOverlay: true,
            compressImageQuality: 0.8,
        })
            .then((image) => setUpload('profile', image))
            .catch((err: unknown) => {
                const code = (err as { code?: string })?.code;
                if (code !== 'E_PICKER_CANCELLED') {
                    Alert.alert('Upload failed', 'Could not select profile image.');
                }
            });
    };

    const pickDocumentImage = () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            cropping: false,
            compressImageQuality: 0.8,
        })
            .then((image) => setUpload('document', image))
            .catch((err: unknown) => {
                const code = (err as { code?: string })?.code;
                if (code !== 'E_PICKER_CANCELLED') {
                    Alert.alert('Upload failed', 'Could not select document image.');
                }
            });
    };

    const handleSubmit = async () => {
        if (!canSubmit) {
            Alert.alert('Missing details', 'Please complete all fields and uploads to continue.');
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            navigation.replace('BusinessKYCSuccess');
        }, 700);
    };

    const renderCountryButton = (country: Country) => (
        <View style={styles.selectedCountryRow}>
            <Image source={{ uri: country.flag }} style={styles.selectedCountryFlag} />
            <Text style={[styles.selectedCountryName, { color: colors.text }]} numberOfLines={1}>
                {country.name?.common}
            </Text>
        </View>
    );

    const UploadCard = ({
        title,
        helper,
        file,
        onPress,
        icon,
    }: {
        title: string;
        helper: string;
        file?: { fileName: string; path: string };
        onPress: () => void;
        icon: string;
    }) => (
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
                        <View style={[styles.header, { borderBottomColor: colors.divider }]}> 
                            <Text style={[styles.stepText, { color: colors.primary }]}>Step 2 of 3</Text>
                            <Text style={[styles.title, { color: colors.text }]}>Register your business</Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>A few details to complete your business KYC.</Text>
                        </View>

                        <ScrollView
                            contentContainerStyle={styles.content}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                        >
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Business details</Text>
                    <Input
                        label="Business name"
                        inputWrapperStyle={[styles.input, { borderColor: colors.border }]}
                        inputStyle={{ color: colors.text }}
                        value={businessName}
                        onChangeText={setBusinessName}
                        placeholder="Enter legal business name"
                    />

                    <Text style={[styles.label, { color: colors.text }]}>Business country</Text>
                    <View style={[styles.countryPickerWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                        <CountryPicker
                            countryCode={businessCountryCode}
                            showCallingCode={false}
                            showCountryName
                            showFlag
                            containerStyle={styles.countryPickerButton}
                            renderSelectedCountry={renderCountryButton}
                            onSelect={(code) => {
                                setBusinessCountryCode(code);
                            }}
                        />
                    </View>

                    <Text style={[styles.label, { color: colors.text }]}>Business category</Text>
                    <View style={styles.categoryRow}>
                        {BUSINESS_CATEGORIES.map((category) => {
                            const active = businessCategories.includes(category);
                            return (
                                <TouchableOpacity
                                    key={category}
                                    onPress={() => {
                                        setBusinessCategories((prev) =>
                                            prev.includes(category)
                                                ? prev.filter((item) => item !== category)
                                                : [...prev, category],
                                        );
                                    }}
                                    style={[
                                        styles.categoryChip,
                                        {
                                            backgroundColor: active ? colors.primary : colors.surface,
                                            borderColor: active ? colors.primary : colors.border,
                                        },
                                    ]}
                                >
                                    <Text style={{ color: active ? colors.textInverse : colors.text, fontWeight: '700' }}>{category}</Text>
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
                                    onSelect={(code) => {
                                        setBusinessPhoneCountryCode(code);
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ width: spacing(1.5) }} />
                        <View style={{ flex: 1 }}>
                            <Input
                                label=" "
                                keyboardType="phone-pad"
                                inputWrapperStyle={[styles.input, { borderColor: colors.border }]}
                                inputStyle={{ color: colors.text }}
                                value={contactPhone}
                                onChangeText={setContactPhone}
                                placeholder="Enter business phone"
                            />
                        </View>
                    </View>
                    <Input
                        label="Business email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        inputWrapperStyle={[styles.input, { borderColor: colors.border }]}
                        inputStyle={{ color: colors.text }}
                        value={contactEmail}
                        onChangeText={setContactEmail}
                        placeholder="Enter business email"
                    />
                    <Input
                        label="Business address"
                        inputWrapperStyle={[styles.input, { borderColor: colors.border }]}
                        inputStyle={{ color: colors.text }}
                        value={businessAddress}
                        onChangeText={setBusinessAddress}
                        placeholder="Enter business address"
                    />
                    <Input
                        label="Tax or registration number"
                        inputWrapperStyle={[styles.input, { borderColor: colors.border }]}
                        inputStyle={{ color: colors.text }}
                        value={taxRegistrationNumber}
                        onChangeText={setTaxRegistrationNumber}
                        placeholder="Enter tax or registration number"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Uploads</Text>
                    <UploadCard
                        title="Business banner image"
                        helper="Tap to upload banner"
                        file={uploads.banner}
                        onPress={pickBannerImage}
                        icon="image"
                    />
                    <UploadCard
                        title="Business profile image"
                        helper="Tap to upload logo"
                        file={uploads.profile}
                        onPress={pickProfileImage}
                        icon="user"
                    />
                    <UploadCard
                        title="ID or business document"
                        helper="Tap to upload document"
                        file={uploads.document}
                        onPress={pickDocumentImage}
                        icon="file-text"
                    />
                </View>
                        </ScrollView>

                        <View style={[styles.footer, { borderTopColor: colors.border }]}> 
                            <Button title="Submit and continue" onPress={handleSubmit} loading={isSubmitting} disabled={!canSubmit || isSubmitting} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 24, borderBottomWidth: 1 },
    stepText: { fontSize: 13, fontWeight: '800', marginBottom: 8 },
    title: { fontSize: 28, fontWeight: '900', marginBottom: 8 },
    subtitle: { fontSize: 14, lineHeight: 20 },
    content: { padding: 24 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 14 },
    label: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
    phoneRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
    categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
    categoryChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
    countryPickerWrap: {
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    phoneCountryPickerWrap: {
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
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
    input: { height: 56, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, marginBottom: 0 },
    uploadBox: {
        height: 130,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        marginBottom: 12,
        overflow: 'hidden',
    },
    uploadPlaceholder: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    uploadFilledState: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        gap: 12,
    },
    uploadPreview: { width: 72, height: 72, borderRadius: 10 },
    uploadInfo: { flex: 1 },
    uploadTitle: { marginTop: 10, fontWeight: '700', fontSize: 14 },
    uploadHelper: { marginTop: 4, fontSize: 12 },
    footer: { padding: 24, borderTopWidth: 1 },
});