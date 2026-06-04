export const PROFILE_IMAGE_OPTIONS = {
    mediaType: 'photo' as const,
    includeBase64: false,
    selectionLimit: 1,
};

export const PROFILE_IMAGE_CROP_OPTIONS = {
    width: 800,
    height: 800,
    cropperCircleOverlay: true,
    compressImageQuality: 0.8,
    forceJpg: true,
};