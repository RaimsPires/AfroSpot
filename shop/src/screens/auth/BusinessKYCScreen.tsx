import { Button } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { AuthStackParamList } from '@navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectCanProceedToStep2, selectCanSubmitFinal, useBusinessRegistrationStore } from '@store/useBusinessRegistrationStore';
import { pickAndCropFromLibrary, SHOP_CROP_PRESETS } from '@utils/hybridImagePicker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BusinessKycDetails from './business-kyc/business-kyc-details';
import BusinessKYCHeader from './business-kyc/business-kyc-header';
import BusinessKycImagesUpload from './business-kyc/business-kyc-imagesUpload';

type Props = NativeStackScreenProps<AuthStackParamList, 'BusinessKYC'>;




export const BusinessKYCScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    const { setIsCropping, setUpload, isCropping, uploads, isSubmitting, getFormData, reset } = useBusinessRegistrationStore();

    // --- STEP TRACKING ---
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);


    const pickBannerImage = async () => {
        setIsCropping(true);
        try {
            const image = await pickAndCropFromLibrary(
                SHOP_CROP_PRESETS.banner,
                'Upload failed',
                'Could not select banner.'
            );
            console.log('Selected banner image:');
            if (image) setUpload('banner', image);
        } finally {
            // Small delay ensures the image state is set before hiding overlay
            setTimeout(() => setIsCropping(false), 100);
        }
    };

    const pickProfileImage = async () => {
        setIsCropping(true);
        try {
            const image = await pickAndCropFromLibrary(
                SHOP_CROP_PRESETS.profile,
                'Upload failed',
                'Could not select logo.'
            );
            if (image) setUpload('profile', image);
        } finally {
            setTimeout(() => setIsCropping(false), 100);
        }
    };

    const pickDocumentImage = async () => {
        setIsCropping(true);
        try {
            const image = await pickAndCropFromLibrary(
                null,
                'Upload failed',
                'Could not select document.'
            );
            if (image) setUpload('document', image);
        } finally {
            setTimeout(() => setIsCropping(false), 100);
        }
    };


    // --- SUBMISSION ---
    const handleSubmit = async () => {

        try {
            const data = getFormData();
            console.log(data);
            reset(); // Clear form immediately to prevent duplicate submissions

            // Simulate API call
            await new Promise<void>((resolve) => setTimeout(resolve, 2000));


        } catch (error) {
            console.error('Submission error:', error);
        }
    };
    // --- UI COMPONENTS ---




    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {isCropping && (
                <View style={{ ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} pointerEvents="box-none">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 12, color: '#fff', fontWeight: '700' }}>Preparing image...</Text>
                </View>
            )}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.container}>

                        {/* DYNAMIC HEADER */}
                        <BusinessKYCHeader currentStep={currentStep} setCurrentStep={setCurrentStep} />

                        {/* CONTENT */}

                        <ScrollView contentContainerStyle={styles.content} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">

                            {/* --- STEP 1: TEXT DETAILS --- */}
                            {currentStep === 1 && (
                                <BusinessKycDetails />
                            )}

                            {/* --- STEP 2: FILE UPLOADS --- */}
                            {currentStep === 2 && (
                                <BusinessKycImagesUpload uploads={uploads} pickBannerImage={pickBannerImage} pickProfileImage={pickProfileImage} pickDocumentImage={pickDocumentImage} />
                            )}
                        </ScrollView>

                        {/* DYNAMIC FOOTER */}
                        <View style={[styles.footer, { borderTopColor: colors.border }]}>
                            {currentStep === 1 ? (
                                <Button
                                    title="Next: Upload Documents"
                                    onPress={() => setCurrentStep(2)}
                                    disabled={!selectCanProceedToStep2 || isSubmitting}
                                />
                            ) : (
                                <Button
                                    title="Submit Registration"
                                    onPress={handleSubmit}
                                    loading={isSubmitting}
                                    disabled={!selectCanSubmitFinal || isSubmitting}
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

    backButton: { marginRight: 16, marginTop: 4, padding: 4 },
    stepText: { fontSize: 13, fontWeight: '800', marginBottom: 8 },
    title: { fontSize: 28, fontWeight: '900', marginBottom: 8 },
    subtitle: { fontSize: 14, lineHeight: 20 },
    content: { padding: 24 },

    // label: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
    // phoneRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
    // categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
    // categoryChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
    // countryPickerButton: { width: '100%' },
    footer: { padding: 24, borderTopWidth: 1 },
});