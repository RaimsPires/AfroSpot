import type { CountryCode } from '@avaiyakapil/react-native-country-picker';
import { apiClient } from '@services/apiClient';
import { BusinessCategory, RegistrationStep, UploadState } from '@type/business-kyc';
import { create } from 'zustand';

// ─── State shape ──────────────────────────────────────────────────────────────

type FormFields = {
    // --- User Information ---
    userId: string | null;
    firstName: string;
    lastName: string;
    userEmail: string;
    userPhone: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: Date | null;
    userProfileImage: string | null;
    userCountryCode: CountryCode;
    userPhoneCountryCode: CountryCode;
    userPhoneCallingCode: string;

    // --- Business Information ---
    businessName: string;
    businessCountryCode: CountryCode;
    businessPhoneCountryCode: CountryCode;
    phoneCallingCode: string;
    businessCategory: BusinessCategory;
    contactPhone: string;
    contactEmail: string;
    businessAddress: string;
    taxRegistrationNumber: string;
};

type UiState = {
    currentStep: RegistrationStep;
    isCropping: boolean;
    isSubmitting: boolean;
    uploads: UploadState;
    fieldErrors: Partial<Record<string, string>>;
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Actions = {
    // User Field Setters
    setUserId: (id: string | null) => void;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setUserEmail: (value: string) => void;
    setUserPhone: (value: string) => void;
    setPassword: (value: string) => void;
    setConfirmPassword: (value: string) => void;
    setDateOfBirth: (date: Date | null) => void;
    setUserProfileImage: (uri: string | null) => void;
    setUserCountryCode: (code: CountryCode) => void;
    setUserPhoneCountryCode: (code: CountryCode, callingCode?: string) => void;

    // Business Field Setters
    setBusinessName: (value: string) => void;
    setBusinessCountryCode: (code: CountryCode) => void;
    setBusinessPhoneCountryCode: (code: CountryCode, callingCode?: string) => void;
    setBusinessCategory: (category: BusinessCategory) => void;
    setContactPhone: (value: string) => void;
    setContactEmail: (value: string) => void;
    setBusinessAddress: (value: string) => void;
    setTaxRegistrationNumber: (value: string) => void;

    // Step navigation
    goToStep: (step: RegistrationStep) => void;
    nextStep: () => void;
    prevStep: () => void;

    // Upload management
    setUpload: (slot: keyof UploadState, file: { path: string; fileName?: string; mimeType?: string }) => void;
    clearUpload: (slot: keyof UploadState) => void;

    // UI & Validation
    setIsCropping: (value: boolean) => void;
    setIsSubmitting: (value: boolean) => void;
    setFieldErrors: (errors: Partial<Record<string, string>>) => void;
    clearFieldError: (fieldName: string) => void;

    // Derived helpers
    getFormattedUserPhone: () => string;
    getFormattedBusinessPhone: () => string;
    getBusinessFormData: () => FormData;
    getUserFormData: () => FormData;
    getFullRegistrationFormData: () => FormData;

    // 🚀 NEW: Full Registration Orchestrator
    submitFullRegistration: () => Promise<boolean>;

    // Reset
    reset: () => void;
};

// ─── Initial state ────────────────────────────────────────────────────────────

const initialForm: FormFields = {
    // User
    userId: null,
    firstName: 'Henry',
    lastName: 'Jenkins',
    userEmail: 'henry.jenkins@example.com',
    userPhone: '69665432',
    password: 'Afrospot123!',
    confirmPassword: 'Afrospot123!',
    dateOfBirth: new Date(1990, 0, 1),
    userProfileImage: null,
    userCountryCode: 'NG',
    userPhoneCountryCode: 'NG',
    userPhoneCallingCode: '234',

    // Business
    businessName: 'Kilogram Foods',
    businessCountryCode: 'NG',
    businessPhoneCountryCode: 'NG',
    phoneCallingCode: '234',
    businessCategory: 'Food',
    contactPhone: '6012345678',
    contactEmail: 'kilogramfoods@example.com',
    businessAddress: 'douala, cameroon',
    taxRegistrationNumber: '87654321',
};

const initialUi: UiState = {
    currentStep: 1,
    isCropping: false,
    isSubmitting: false,
    uploads: {},
    fieldErrors: {},
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useRegistrationStore = create<FormFields & UiState & Actions>()((set, get) => ({
    // ── Initial state ──
    ...initialForm,
    ...initialUi,

    // ── User Field Setters ──
    setUserId: (id) => set({ userId: id }),
    setFirstName: (value) => set({ firstName: value }),
    setLastName: (value) => set({ lastName: value }),
    setUserEmail: (value) => set({ userEmail: value }),
    setUserPhone: (value) => set({ userPhone: value }),
    setPassword: (value) => set({ password: value }),
    setConfirmPassword: (value) => set({ confirmPassword: value }),
    setDateOfBirth: (date) => set({ dateOfBirth: date }),
    setUserProfileImage: (uri) => set({ userProfileImage: uri }),
    setUserCountryCode: (code) => set({ userCountryCode: code }),
    setUserPhoneCountryCode: (code, callingCode) =>
        set({
            userPhoneCountryCode: code,
            ...(callingCode ? { userPhoneCallingCode: callingCode } : {}),
        }),

    // ── Business Field Setters ──
    setBusinessName: (value) => set({ businessName: value }),
    setBusinessCountryCode: (code) => set({ businessCountryCode: code }),
    setBusinessPhoneCountryCode: (code, callingCode) =>
        set({
            businessPhoneCountryCode: code,
            ...(callingCode ? { phoneCallingCode: callingCode } : {}),
        }),
    setBusinessCategory: (category) => set({ businessCategory: category }),
    setContactPhone: (value) => set({ contactPhone: value }),
    setContactEmail: (value) => set({ contactEmail: value }),
    setBusinessAddress: (value) => set({ businessAddress: value }),
    setTaxRegistrationNumber: (value) => set({ taxRegistrationNumber: value }),

    // ── Step navigation ──
    goToStep: (step) => set({ currentStep: step }),
    nextStep: () =>
        set((state) => ({
            currentStep: Math.min(state.currentStep + 1, 2) as RegistrationStep,
        })),
    prevStep: () =>
        set((state) => ({
            currentStep: Math.max(state.currentStep - 1, 1) as RegistrationStep,
        })),

    // ── Upload management ──
    setUpload: (slot, file) => {
        const normalizedPath = file.path.startsWith('file://')
            ? `file://${file.path.replace(/^file:\/\//, '')}`
            : file.path;

        set((state) => ({
            uploads: {
                ...state.uploads,
                [slot]: {
                    path: normalizedPath,
                    fileName: file.fileName || `${slot}.jpg`,
                    mimeType: file.mimeType,
                },
            },
        }));
    },
    clearUpload: (slot) =>
        set((state) => {
            const next = { ...state.uploads };
            delete next[slot];
            return { uploads: next };
        }),

    // ── UI Flags & Validation ──
    setIsCropping: (value) => set({ isCropping: value }),
    setIsSubmitting: (value) => set({ isSubmitting: value }),
    setFieldErrors: (errors) => set({ fieldErrors: errors }),
    clearFieldError: (fieldName) =>
        set((state) => {
            const nextErrors = { ...state.fieldErrors };
            delete nextErrors[fieldName];
            return { fieldErrors: nextErrors };
        }),

    // ── Derived helpers ──
    getFormattedUserPhone: () => {
        const { userPhoneCallingCode, userPhone } = get();
        return `+${userPhoneCallingCode}${userPhone.replace(/^0+/, '')}`;
    },

    getFormattedBusinessPhone: () => {
        const { phoneCallingCode, contactPhone } = get();
        return `+${phoneCallingCode}${contactPhone.replace(/^0+/, '')}`;
    },

    getUserFormData: () => {
        const state = get();
        const formData = new FormData();

        formData.append('first_name', state.firstName.trim());
        formData.append('last_name', state.lastName.trim());
        formData.append('email', state.userEmail.toLowerCase().trim());
        formData.append('phone_number', state.getFormattedUserPhone());
        formData.append('password', state.password);

        if (state.dateOfBirth) {
            const year = state.dateOfBirth.getFullYear();
            const month = String(state.dateOfBirth.getMonth() + 1).padStart(2, '0');
            const day = String(state.dateOfBirth.getDate()).padStart(2, '0');
            formData.append('date_of_birth', `${year}-${month}-${day}`);
        }

        if (state.userProfileImage) {
            const rawPath = state.userProfileImage.replace(/^file:\/\//, '');
            const normalizedPath = `file://${rawPath}`;
            const fileName = normalizedPath.split('/').pop() || 'user_profile.jpg';

            formData.append('avatar', {
                uri: normalizedPath,
                name: fileName,
                type: 'image/jpeg',
            } as any);
        }

        return formData;
    },

    getBusinessFormData: () => {
        const state = get();
        const formData = new FormData();

        // Dynamically grab the user ID that was set in the first API call
        if (state.userId) formData.append('user_id', state.userId);

        formData.append('name', state.businessName.trim());
        formData.append('address', state.businessAddress.trim());
        formData.append('email', state.contactEmail.toLowerCase().trim());
        formData.append('tax_number', state.taxRegistrationNumber.trim());
        formData.append('phone_number', state.getFormattedBusinessPhone());
        formData.append('category', state.businessCategory.toLowerCase());
        formData.append('country', state.businessCountryCode);

        const appendImage = (slot: keyof UploadState, fieldName: string) => {
            const file = state.uploads[slot];
            if (file) {
                formData.append(fieldName, {
                    uri: file.path,
                    name: file.fileName,
                    type: file.mimeType || 'image/jpeg',
                } as any);
            }
        };

        appendImage('banner', 'banner_image');
        appendImage('profile', 'profile_image');
        appendImage('document', 'kyc_document');

        return formData;
    },
    getFullRegistrationFormData: () => {
        const state = get();
        const formData = new FormData();

        // 1. Append User Information (if userId exists, we send it, otherwise we send user details)
        if (state.userId) {
            formData.append('user_id', state.userId);
        } else {
            formData.append('first_name', state.firstName.trim());
            formData.append('last_name', state.lastName.trim());
            formData.append('user_email', state.userEmail.toLowerCase().trim());
            formData.append('user_phone', state.getFormattedUserPhone());
            formData.append('password', state.password);

            if (state.dateOfBirth) {
                const year = state.dateOfBirth.getFullYear();
                const month = String(state.dateOfBirth.getMonth() + 1).padStart(2, '0');
                const day = String(state.dateOfBirth.getDate()).padStart(2, '0');
                formData.append('date_of_birth', `${year}-${month}-${day}`);
            }

            if (state.userProfileImage) {
                const rawPath = state.userProfileImage.replace(/^file:\/\//, '');
                const normalizedPath = `file://${rawPath}`;
                const fileName = normalizedPath.split('/').pop() || 'user_profile.jpg';
                formData.append('avatar', {
                    uri: normalizedPath,
                    name: fileName,
                    type: 'image/jpeg',
                } as any);
            }
        }

        // 2. Append Business/Spot Information
        formData.append('business_name', state.businessName.trim());
        formData.append('business_address', state.businessAddress.trim());
        formData.append('business_email', state.contactEmail.toLowerCase().trim());
        formData.append('tax_number', state.taxRegistrationNumber.trim());
        formData.append('business_phone', state.getFormattedBusinessPhone());
        formData.append('category', state.businessCategory.toLowerCase());
        formData.append('country', state.businessCountryCode);

        // 3. Append Business Uploads
        const appendImage = (slot: keyof UploadState, fieldName: string) => {
            const file = state.uploads[slot];
            if (file) {
                formData.append(fieldName, {
                    uri: file.path,
                    name: file.fileName,
                    type: 'image/jpeg',
                } as any);
            }
        };

        appendImage('banner', 'banner_image');
        appendImage('profile', 'profile_image');
        appendImage('document', 'kyc_document');

        return formData;
    },

    // 🚀 FULL REGISTRATION ORCHESTRATOR
    submitFullRegistration: async () => {
        const { getFullRegistrationFormData, setIsSubmitting, setFieldErrors, reset } = get();

        setIsSubmitting(true);
        setFieldErrors({}); // Clear old errors

        try {
            // Get the single, massive unified payload
            const combinedFormData = getFullRegistrationFormData();

            // Send everything to your new unified endpoint in one single network request
            await apiClient.post('/spots/register-all/', combinedFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsSubmitting(false);
            reset(); // Clear form immediately to prevent duplicate submissions
            return true; // Return true to navigate to your success screen

        } catch (error: any) {
            console.error('Full Registration Failed:');
            console.log(error.response.data); // Log the full error response for debugging

            // Capture field errors straight from the Django Serializer validation
            if (error.response && error.response.data) {
                setFieldErrors(error.response.data);
            }

            setIsSubmitting(false);
            return false;
        }
    },
    // ── Reset ──
    reset: () => set({ ...initialForm, ...initialUi }),
}));



// ─── Derived selectors (use outside the store to avoid re-render churn) ───────

export const selectCanProceedToBusinessStep2 = (s: ReturnType<typeof useRegistrationStore.getState>) =>
    Boolean(
        s.businessName.trim() &&
        s.businessCountryCode &&
        s.businessCategory &&
        s.contactPhone.trim() &&
        s.contactEmail.trim() &&
        s.businessAddress.trim() &&
        s.taxRegistrationNumber.trim()
    );

export const selectCanSubmitBusinessFinal = (s: ReturnType<typeof useRegistrationStore.getState>) =>
    Boolean(s.uploads.banner && s.uploads.profile && s.uploads.document);

export const selectCanSubmitUser = (s: ReturnType<typeof useRegistrationStore.getState>) =>
    Boolean(
        s.firstName.trim() &&
        s.lastName.trim() &&
        s.userEmail.trim() &&
        s.userPhone.trim() &&
        s.password.length >= 8 &&
        s.password === s.confirmPassword
    );

// ─── Derived selectors (use outside the store to avoid re-render churn) ───────

export const selectCanProceedToStep2 = (s: ReturnType<typeof useRegistrationStore.getState>) =>
    Boolean(
        s.businessName.trim() &&
        s.businessCountryCode &&
        s.businessCategory &&
        s.contactPhone.trim() &&
        s.contactEmail.trim() &&
        s.businessAddress.trim() &&
        s.taxRegistrationNumber.trim()
    );

export const selectCanSubmitFinal = (s: ReturnType<typeof useRegistrationStore.getState>) =>
    Boolean(s.uploads.banner && s.uploads.profile && s.uploads.document);