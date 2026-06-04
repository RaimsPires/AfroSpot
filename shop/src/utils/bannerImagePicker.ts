import { CROP_PRESETS, pickAndCropImage, ShopImageFile } from './shopImagePicker';

/**
 * Pick and crop a banner image
 * @param source - 'camera' or 'gallery' (defaults to 'gallery')
 * @returns ShopImageFile or null if cancelled
 */
export async function pickBannerImage(
    source: 'camera' | 'gallery' = 'gallery'
): Promise<ShopImageFile | null> {
    return pickAndCropImage(
        source,
        CROP_PRESETS.banner,
        'Banner upload failed',
        'Could not select banner image.'
    );
}
