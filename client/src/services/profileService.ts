import { apiClient } from '@services/apiClient';
import { AuthUser, UpdateUserProfilePayload, UploadableImage } from '@type/auth';

const USER_PROFILE_ENDPOINT = '/auth/user/';

function isUploadableImage(value: UpdateUserProfilePayload['profile_picture']): value is UploadableImage {
    return Boolean(value && typeof value === 'object' && 'uri' in value && 'name' in value && 'type' in value);
}

function buildProfileFormData(payload: UpdateUserProfilePayload): FormData {
    const formData = new FormData();

    if (payload.first_name !== undefined) {
        formData.append('first_name', payload.first_name);
    }

    if (payload.last_name !== undefined) {
        formData.append('last_name', payload.last_name);
    }

    if (payload.phone_number !== undefined) {
        formData.append('phone_number', payload.phone_number);
    }

    if (payload.dob !== undefined) {
        formData.append('dob', payload.dob);
    }

    if (payload.language !== undefined) {
        formData.append('language', payload.language);
    }

    if (payload.is_store_owner !== undefined) {
        formData.append('is_store_owner', String(payload.is_store_owner));
    }

    if (payload.settings) {
        formData.append('settings', JSON.stringify(payload.settings));
    }

    if (isUploadableImage(payload.profile_picture)) {
        formData.append('profile_picture', payload.profile_picture as unknown as Blob);
    }

    return formData;
}

export async function patchUserProfile(payload: UpdateUserProfilePayload): Promise<AuthUser> {
    const response = isUploadableImage(payload.profile_picture)
        ? await apiClient.patch<AuthUser>(USER_PROFILE_ENDPOINT, buildProfileFormData(payload), {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        })
        : await apiClient.patch<AuthUser>(USER_PROFILE_ENDPOINT, payload);

    return response.data;
}

export async function putUserProfile(payload: UpdateUserProfilePayload): Promise<AuthUser> {
    const response = isUploadableImage(payload.profile_picture)
        ? await apiClient.put<AuthUser>(USER_PROFILE_ENDPOINT, buildProfileFormData(payload), {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        })
        : await apiClient.put<AuthUser>(USER_PROFILE_ENDPOINT, payload);

    return response.data;
}