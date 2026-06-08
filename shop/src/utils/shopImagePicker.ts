import { Alert, Linking } from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

import { getPermissionStatus, PermissionType, requestPermission, RESULTS } from '@services/permissionService';

/**
 * Image file type returned by pickers
 */
export type ShopImageFile = {
    path: string;          // Preferably file:// prefixed; content:// URIs are preserved when necessary
    fileName: string;      // Inferred from path if missing
    mimeType: string;      // MIME type (defaults to 'image/jpeg')
};

/**
 * Image source options
 */
export type ImageSource = 'camera' | 'gallery';

/**
 * Crop configuration
 */
export type CropOptions = {
    width: number;
    height: number;
    circleOverlay?: boolean;
} | null;

function isPickerCancelled(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const maybeError = error as { code?: string; message?: string };
    return (
        maybeError.code === 'E_PICKER_CANCELLED' ||
        maybeError.code === 'E_OPERATION_CANCELLED' ||
        maybeError.message?.toLowerCase().includes('cancel') === true ||
        maybeError.message?.toLowerCase().includes('user cancelled') === true
    );
}

async function promptOpenSettings(permissionName: string) {
    Alert.alert(
        `${permissionName} permission needed`,
        `Please enable ${permissionName.toLowerCase()} access in your device settings to continue.`,
        [
            { text: 'Not now', style: 'cancel' },
            {
                text: 'Open settings',
                onPress: () => {
                    Linking.openSettings().catch(() => undefined);
                },
            },
        ],
    );
}

async function ensurePermission(permissionType: PermissionType, permissionName: string): Promise<boolean> {
    const currentStatus = await getPermissionStatus(permissionType);

    if (currentStatus === RESULTS.GRANTED || currentStatus === RESULTS.LIMITED) {
        return true;
    }

    if (currentStatus === RESULTS.BLOCKED) {
        await promptOpenSettings(permissionName);
        return false;
    }

    const requestedStatus = await requestPermission(permissionType);

    if (requestedStatus === RESULTS.GRANTED || requestedStatus === RESULTS.LIMITED) {
        return true;
    }

    if (requestedStatus === RESULTS.BLOCKED) {
        await promptOpenSettings(permissionName);
        return false;
    }

    Alert.alert('Permission denied', `${permissionName} access is required to continue.`);
    return false;
}

function inferFileName(path: string): string {
    const segments = path.split('/');
    const last = segments[segments.length - 1];
    return last || 'upload.jpg';
}

function normalizeFile(input: { path: string; filename?: string; mime?: string }): ShopImageFile {
    if (input.path.startsWith('content://')) {
        return {
            path: input.path,
            fileName: input.filename || inferFileName(input.path),
            mimeType: input.mime || 'application/octet-stream',
        };
    }

    const rawPath = input.path.replace(/^file:\/\//, '');
    return {
        path: `file://${rawPath}`,
        fileName: input.filename || inferFileName(rawPath),
        mimeType: input.mime || 'image/jpeg',
    };
}

/**
 * Core image picker with optional cropping using react-native-image-crop-picker
 * @param source - 'camera' or 'gallery'
 * @param cropOptions - Crop configuration or null to skip cropping
 * @param errorTitle - Title for error alerts
 * @param errorMessage - Default error message
 * @returns ShopImageFile or null if cancelled
 */
export async function pickAndCropImage(
    source: ImageSource,
    cropOptions: CropOptions,
    errorTitle = 'Upload failed',
    errorMessage = 'Could not select image.',
): Promise<ShopImageFile | null> {
    try {
        // Ensure required permission
        const hasPermission = await ensurePermission(
            source === 'camera' ? PermissionType.CAMERA : PermissionType.PHOTO_LIBRARY,
            source === 'camera' ? 'Camera' : 'Photo library',
        );

        if (!hasPermission) {
            return null;
        }

        // Step 1: Select image using react-native-image-crop-picker
        console.log('ShopImagePicker: opening picker for source ->', source);
        let selectedImage: any;

        try {
            if (source === 'camera') {
                selectedImage = await ImagePicker.openCamera({
                    mediaType: 'photo',
                    cropping: false,
                    compressImageQuality: 0.8,
                });
            } else {
                selectedImage = await ImagePicker.openPicker({
                    mediaType: 'photo',
                    cropping: false,
                    compressImageQuality: 0.8,
                });
            }
        } catch (err) {
            if (isPickerCancelled(err)) {
                return null;
            }
            throw err;
        }

        if (!selectedImage?.path) {
            Alert.alert(errorTitle, errorMessage);
            return null;
        }

        // Step 2: Skip cropping if not requested
        if (!cropOptions) {
            console.log('ShopImagePicker: skipping crop, returning selected image ->', selectedImage.path);
            return normalizeFile({
                path: selectedImage.path,
                filename: selectedImage.filename,
                mime: selectedImage.mime || 'image/jpeg',
            });
        }

        // Step 3: Crop the image
        console.log('ShopImagePicker: opening cropper with path ->', selectedImage.path);
        try {
            const cropped = await ImagePicker.openCropper({
                path: selectedImage.path,
                mediaType: 'photo',
                width: cropOptions.width,
                height: cropOptions.height,
                cropperCircleOverlay: Boolean(cropOptions.circleOverlay),
                compressImageQuality: 0.8,
                forceJpg: true,
            });

            console.log('ShopImagePicker: cropper returned ->', cropped?.path);
            return normalizeFile({
                path: cropped.path,
                filename: cropped.filename,
                mime: cropped.mime || 'image/jpeg',
            });
        } catch (cropErr) {
            if (isPickerCancelled(cropErr)) {
                return null;
            }
            console.error('ShopImagePicker: cropper failed', cropErr);
            Alert.alert(errorTitle, 'Image cropping failed.');
            return null;
        }
    } catch (error) {
        if (isPickerCancelled(error)) {
            return null;
        }

        const pickerError = error as { code?: string; message?: string };
        console.error('ShopImagePicker: pick/crop failed:', {
            source,
            code: pickerError?.code,
            message: pickerError?.message,
            raw: error,
        });
        Alert.alert(errorTitle, errorMessage);
        return null;
    }
}

/**
 * Preset crop dimensions
 */
export const CROP_PRESETS = {
    banner: { width: 1200, height: 400 } as const,
    profile: { width: 300, height: 300, circleOverlay: true } as const,
    sqaure: { width: 300, height: 300, circleOverlay: false }
} as const;
