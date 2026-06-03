import type { CountryCode } from '@avaiyakapil/react-native-country-picker';
import { BusinessCategory, RegistrationStep, UploadState } from '@type/business-kyc';
import { create } from 'zustand';



// ─── State shape ──────────────────────────────────────────────────────────────

type FormFields = {
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
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Actions = {
    // Field setters
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
    setUpload: (slot: keyof UploadState, file: { path: string; fileName?: string }) => void;
    clearUpload: (slot: keyof UploadState) => void;

    // UI flags
    setIsCropping: (value: boolean) => void;
    setIsSubmitting: (value: boolean) => void;

    // Derived helpers
    getFormattedPhone: () => string;
    getFormData: () => FormData;

    // Reset
    reset: () => void;
};

// ─── Initial state ────────────────────────────────────────────────────────────

const initialForm: FormFields = {
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
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBusinessRegistrationStore = create<FormFields & UiState & Actions>()((set, get) => ({
    // ── Initial state ──
    ...initialForm,
    ...initialUi,

    // ── Field setters ──

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
        // Normalise path — always exactly one file:// prefix
        const rawPath = file.path.replace(/^file:\/\//, '');
        const normalizedPath = `file://${rawPath}`;

        set((state) => ({
            uploads: {
                ...state.uploads,
                [slot]: {
                    path: normalizedPath,
                    fileName: file.fileName || `${slot}.jpg`,
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

    // ── UI flags ──

    setIsCropping: (value) => set({ isCropping: value }),

    setIsSubmitting: (value) => set({ isSubmitting: value }),

    // ── Derived helpers ──

    getFormattedPhone: () => {
        const { phoneCallingCode, contactPhone } = get();
        return `+${phoneCallingCode}${contactPhone.replace(/^0+/, '')}`;
    },

    getFormData: () => {
        const state = get();
        const formData = new FormData();

        formData.append('name', state.businessName.trim());
        formData.append('address', state.businessAddress.trim());
        formData.append('email', state.contactEmail.toLowerCase().trim());
        formData.append('tax_number', state.taxRegistrationNumber.trim());
        formData.append('phone_number', state.getFormattedPhone());
        formData.append('category', state.businessCategory.toLowerCase());
        formData.append('country', state.businessCountryCode);

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

    // ── Reset ──

    reset: () => set({ ...initialForm, ...initialUi }),
}));

// ─── Derived selectors (use outside the store to avoid re-render churn) ───────

export const selectCanProceedToStep2 = (s: ReturnType<typeof useBusinessRegistrationStore.getState>) =>
    Boolean(
        s.businessName.trim() &&
        s.businessCountryCode &&
        s.businessCategory &&
        s.contactPhone.trim() &&
        s.contactEmail.trim() &&
        s.businessAddress.trim() &&
        s.taxRegistrationNumber.trim()
    );

export const selectCanSubmitFinal = (s: ReturnType<typeof useBusinessRegistrationStore.getState>) =>
    Boolean(s.uploads.banner && s.uploads.profile && s.uploads.document);