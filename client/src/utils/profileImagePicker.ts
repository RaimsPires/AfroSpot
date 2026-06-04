import { Alert, Linking } from 'react-native';

import CropPicker from 'react-native-image-crop-picker';
import {
    launchCamera,
    launchImageLibrary,
    type CameraOptions,
    type ImageLibraryOptions,
    type Asset as ImagePickerAsset,
} from 'react-native-image-picker';

import { getPermissionStatus, PermissionType, requestPermission, RESULTS } from '@services/permissionService';
import { UploadableImage } from '@type/auth';
import { PROFILE_IMAGE_CROP_OPTIONS, PROFILE_IMAGE_OPTIONS } from './imageOption';

export type ProfileImageSource = 'camera' | 'gallery';



const PICKER_OPEN_DELAY_MS = 180;

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function isPickerCancelled(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const maybeError = error as { code?: string; message?: string };
    return maybeError.code === 'E_PICKER_CANCELLED' || maybeError.message?.toLowerCase().includes('cancel') === true;
}

function getPickerErrorMessage(errorCode?: string): string {
    if (errorCode === 'camera_unavailable') {
        return 'Camera is not available on this device.';
    }

    if (errorCode === 'permission') {
        return 'Required permission was not granted.';
    }

    return 'Could not open the image picker right now. Please try again.';
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

export function normalizeCroppedImage(asset: { path: string; mime?: string; filename?: string }): UploadableImage {
    const mimeType = asset.mime || 'image/jpeg';
    const extension = mimeType.split('/')[1] || 'jpg';

    return {
        uri: asset.path,
        type: mimeType,
        name: asset.filename || `profile-photo.${extension}`,
    };
}

function resolveAssetPath(asset: ImagePickerAsset): string | null {
    if (asset.originalPath) {
        return asset.originalPath;
    }

    const { uri } = asset;
    if (!uri) {
        return null;
    }

    return uri.startsWith('file://') ? uri.replace('file://', '') : uri;
}

export async function pickProfileImage(source: ProfileImageSource): Promise<UploadableImage | null> {
    try {
        const hasPermission = await ensurePermission(
            source === 'camera' ? PermissionType.CAMERA : PermissionType.PHOTO_LIBRARY,
            source === 'camera' ? 'Camera' : 'Photo library',
        );

        if (!hasPermission) {
            return null;
        }

        // Give native modal/sheet transitions time to finish before presenting picker.
        await delay(PICKER_OPEN_DELAY_MS);

        const pickerResult = source === 'camera'
            ? await launchCamera(PROFILE_IMAGE_OPTIONS as CameraOptions)
            : await launchImageLibrary(PROFILE_IMAGE_OPTIONS as ImageLibraryOptions);

        if (pickerResult.didCancel) {
            return null;
        }

        if (pickerResult.errorCode) {
            Alert.alert('Image unavailable', getPickerErrorMessage(pickerResult.errorCode));
            return null;
        }

        const selectedAsset = pickerResult.assets?.[0];

        if (!selectedAsset?.uri) {
            Alert.alert('Image unavailable', 'No image was selected. Please try again.');
            return null;
        }

        const cropPath = resolveAssetPath(selectedAsset);
        if (!cropPath) {
            Alert.alert('Image unavailable', 'Selected image could not be prepared for cropping.');
            return null;
        }

        const croppedImage = await CropPicker.openCropper({
            path: cropPath,
            mediaType: 'photo',
            ...PROFILE_IMAGE_CROP_OPTIONS,
        });

        return normalizeCroppedImage(croppedImage);
    } catch (error) {
        if (isPickerCancelled(error)) {
            return null;
        }

        const pickerError = error as { code?: string; message?: string };
        console.error('Error while picking profile image:', {
            source,
            code: pickerError?.code,
            message: pickerError?.message,
            raw: error,
        });
        Alert.alert('Image unavailable', 'Could not open the image picker right now. Please try again.');
        return null;
    }
}