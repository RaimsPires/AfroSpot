import { Alert, Linking } from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

import { getPermissionStatus, PermissionType, requestPermission, RESULTS } from '@services/permissionService';
import { UploadableImage } from '@type/auth';

export type ProfileImageSource = 'camera' | 'gallery';

type PickerAsset = {
    path: string;
    mime?: string;
    filename?: string;
};

const PROFILE_IMAGE_OPTIONS = {
    width: 800,
    height: 800,
    cropping: true,
    cropperCircleOverlay: true,
    mediaType: 'photo' as const,
    compressImageQuality: 0.8,
    forceJpg: true,
};

function isPickerCancelled(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const maybeError = error as { code?: string; message?: string };
    return maybeError.code === 'E_PICKER_CANCELLED' || maybeError.message?.toLowerCase().includes('cancel') === true;
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
                    void Linking.openSettings();
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

function normalizeImage(asset: PickerAsset): UploadableImage {
    const extension = asset.mime?.split('/')[1] || 'jpg';

    return {
        uri: asset.path,
        type: asset.mime || 'image/jpeg',
        name: asset.filename || `profile-photo.${extension}`,
    };
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

        const asset = source === 'camera'
            ? await ImagePicker.openCamera(PROFILE_IMAGE_OPTIONS)
            : await ImagePicker.openPicker(PROFILE_IMAGE_OPTIONS);

        return normalizeImage(asset as PickerAsset);
    } catch (error) {
        if (isPickerCancelled(error)) {
            return null;
        }

        console.error('Error while picking profile image:', error);
        Alert.alert('Image unavailable', 'Could not open the image picker right now. Please try again.');
        return null;
    }
}