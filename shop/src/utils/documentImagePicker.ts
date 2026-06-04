import type { DocumentPickerResponse } from '@react-native-documents/picker';
import { pickAndCropImage, ShopImageFile } from './shopImagePicker';
// import DocumentPicker from '@react-native-documents/picker';
import { pick } from '@react-native-documents/picker';

const DOCUMENT_PICKER_TYPES = [
    'image/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Pick a document for KYC upload.
 * Uses @react-native-documents/picker for file selection and preserves mime metadata.
 */
export async function pickDocumentImage(): Promise<ShopImageFile | null> {
    try {
        const result = await pick({
            type: DOCUMENT_PICKER_TYPES,
            allowMultiSelection: false,
            copyToCacheDirectory: true,
        }) as DocumentPickerResponse | DocumentPickerResponse[];

        const document = Array.isArray(result) ? result[0] : result;
        if (!document?.uri) {
            return null;
        }

        const normalizedPath = document.uri.startsWith('file://')
            ? document.uri
            : document.uri;

        return {
            path: normalizedPath,
            fileName: document.name ?? document.name ?? normalizedPath.split('/').pop() ?? 'document',
            mimeType: document.type ?? document.type ?? 'application/octet-stream',
        };
    } catch (error) {
        const maybeError = error as { code?: string; message?: string };
        if (maybeError?.code === 'DOCUMENT_PICKER_CANCELED' || maybeError?.message?.toLowerCase().includes('cancel')) {
            return null;
        }

        console.error('DocumentImagePicker: selection failed', error);
        return pickAndCropImage(
            'camera',
            null,
            'Document upload failed',
            'Could not select document image.',
        );
    }
}
