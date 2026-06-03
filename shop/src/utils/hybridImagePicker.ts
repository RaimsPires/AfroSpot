import { Alert } from 'react-native';

import CropPicker from 'react-native-image-crop-picker';
import {
    launchImageLibrary,
    type ImageLibraryOptions,
    type Asset as ImagePickerAsset,
} from 'react-native-image-picker';

export type ShopImageFile = {
    path: string;
    fileName: string;
    mimeType: string;
};

type CropOptions = {
    width: number;
    height: number;
    circleOverlay?: boolean;
} | null;

const LIBRARY_OPTIONS: ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: false,
    selectionLimit: 1,
};

function resolveAssetPath(asset: ImagePickerAsset): string | null {
    // Prefer the originalPath when available (Android). Otherwise return
    // the uri but strip a leading `file://` scheme because the native
    // cropper expects a plain filesystem path on iOS.
    if (asset.originalPath) {
        return asset.originalPath;
    }

    if (!asset.uri) {
        return null;
    }

    return asset.uri.startsWith('file://') ? asset.uri.replace('file://', '') : asset.uri;
}

function inferFileName(path: string): string {
    const segments = path.split('/');
    const last = segments[segments.length - 1];
    return last || 'upload.jpg';
}

function normalizeFile(input: { path: string; filename?: string; mime?: string }): ShopImageFile {
    const rawPath = input.path.replace(/^file:\/\//, '');
    return {
        path: `file://${rawPath}`,   // always file:// prefixed
        fileName: input.filename || inferFileName(rawPath),
        mimeType: input.mime || 'image/jpeg',
    };
}

export async function pickAndCropFromLibrary(
    cropOptions: CropOptions,
    errorTitle = 'Upload failed',
    errorMessage = 'Could not select image.',
): Promise<ShopImageFile | null> {
    try {
        const result = await launchImageLibrary(LIBRARY_OPTIONS);

        if (result.didCancel) {
            return null;
        }

        if (result.errorCode) {
            Alert.alert(errorTitle, errorMessage);
            return null;
        }

        const selectedAsset = result.assets?.[0];
        if (!selectedAsset) {
            Alert.alert(errorTitle, errorMessage);
            return null;
        }

        if (!cropOptions) {
            const rawPath = resolveAssetPath(selectedAsset) || selectedAsset.uri;
            if (!rawPath) {
                Alert.alert(errorTitle, errorMessage);
                return null;
            }

            return normalizeFile({
                path: rawPath,
                filename: selectedAsset.fileName,
                mime: selectedAsset.type,
            });
        }

        const cropPath = resolveAssetPath(selectedAsset);
        if (!cropPath) {
            Alert.alert(errorTitle, 'Selected image could not be prepared for cropping.');
            return null;
        }

        console.log('HybridImagePicker: opening cropper with path ->', cropPath);
        try {
            const cropped = await CropPicker.openCropper({
                path: cropPath,
                mediaType: 'photo',
                width: cropOptions.width,
                height: cropOptions.height,
                cropperCircleOverlay: Boolean(cropOptions.circleOverlay),
                compressImageQuality: 0.8,
                forceJpg: true,
            });

            console.log('HybridImagePicker: cropper returned ->', cropped?.path);
            return normalizeFile(cropped as any);
        } catch (err) {
            console.error('HybridImagePicker: cropper failed', err);
            Alert.alert(errorTitle, 'Image cropping failed.');
            return null;
        }
    } catch (error) {
        const code = (error as { code?: string }).code;
        if (code === 'E_PICKER_CANCELLED') {
            return null;
        }

        console.error('Hybrid image pick/crop failed:', error);
        Alert.alert(errorTitle, errorMessage);
        return null;
    }
}

export const SHOP_CROP_PRESETS = {
    banner: { width: 1200, height: 400  } as const,
    profile: { width: 300, height: 300} as const,
};
