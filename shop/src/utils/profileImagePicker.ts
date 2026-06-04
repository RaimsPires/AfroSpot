import { CROP_PRESETS, pickAndCropImage, ShopImageFile } from './shopImagePicker';

/**
 * Pick and crop a profile/logo image
 * @param source - 'camera' or 'gallery' (defaults to 'gallery')
 * @returns ShopImageFile or null if cancelled
 */
export async function pickProfileImage(
    source: 'camera' | 'gallery' = 'gallery'
): Promise<ShopImageFile | null> {
    return pickAndCropImage(
        source,
        CROP_PRESETS.profile,
        'Profile upload failed',
        'Could not select profile image.'
    );
}
