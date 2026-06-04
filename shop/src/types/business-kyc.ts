
export type UploadSlot = {
    fileName: string;
    path: string;
    mimeType?: string;
};

export type UploadState = {
    banner?: UploadSlot;
    profile?: UploadSlot;
    document?: UploadSlot;
};

export type BusinessCategory = 'Beauty' | 'Food' | 'Fashion' | 'Events' | 'Services' | 'Other';

export type RegistrationStep = 1 | 2;