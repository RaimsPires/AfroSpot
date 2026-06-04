import BusinessKycDetails from '@components/business-kyc/business-kyc-details';
import BusinessKYCHeader from '@components/business-kyc/business-kyc-header';
import BusinessKycImagesUpload from '@components/business-kyc/business-kyc-imagesUpload';
import { Button } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { selectCanProceedToStep2, selectCanSubmitFinal, useRegistrationStore } from '@store/useRegistrationStore';
import { pickBannerImage } from '@utils/bannerImagePicker';
import { pickDocumentImage } from '@utils/documentImagePicker';
import { pickProfileImage } from '@utils/profileImagePicker';
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

// type Props = NativeStackScreenProps<AuthStackParamList, 'BusinessKYC'>;




export const BusinessKYCScreen = () => {
    const { colors } = useTheme();
    const { setIsCropping, setUpload, isCropping, uploads, isSubmitting, submitFullRegistration } = useRegistrationStore();

    // --- STEP TRACKING ---
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);


    const pickBannerImageHandler = async () => {
        setIsCropping(true);
        try {
            const image = await pickBannerImage();
            console.log('Selected banner image:');
            if (image) setUpload('banner', image);
        } finally {
            // Small delay ensures the image state is set before hiding overlay
            setTimeout(() => setIsCropping(false), 100);
        }
    };

    const pickProfileImageHandler = async () => {
        setIsCropping(true);
        try {
            const image = await pickProfileImage();
            if (image) setUpload('profile', image);
        } finally {
            setTimeout(() => setIsCropping(false), 100);
        }
    };

    const pickDocumentImageHandler = async () => {
        setIsCropping(true);
        try {
            const image = await pickDocumentImage();
            if (image) setUpload('document', image);
        } finally {
            setTimeout(() => setIsCropping(false), 100);
        }
    };


    // --- SUBMISSION ---
    const handleSubmit = async () => {

        try {
            await submitFullRegistration();

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
                                <BusinessKycImagesUpload uploads={uploads} pickBannerImage={pickBannerImageHandler} pickProfileImage={pickProfileImageHandler} pickDocumentImage={pickDocumentImageHandler} />
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
    footer: { padding: 24, borderTopWidth: 1 },
});