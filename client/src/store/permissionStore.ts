import { PermissionStatus, RESULTS } from 'react-native-permissions';
import { create } from 'zustand';
import {
    PermissionType,
    checkPermissions,
    requestPermissionsIfNeeded,
    requestPermissions as requestPermissionsService,
} from '../services/permissionService';

export interface PermissionState {
    permissions: Record<PermissionType, PermissionStatus>;
    isLoading: Record<PermissionType, boolean>;
    lastRequestTime: Record<PermissionType, number>;

    // Actions
    setPermissionStatus: (
        permissionType: PermissionType,
        status: PermissionStatus
    ) => void;
    setLoading: (permissionType: PermissionType, loading: boolean) => void;
    checkPermissions: (permissionTypes: PermissionType[]) => Promise<void>;
    requestPermissions: (permissionTypes: PermissionType[]) => Promise<void>;
    requestPermissionsIfNeeded: (
        permissionTypes: PermissionType[]
    ) => Promise<void>;
    reset: () => void;
}

const initialPermissionState: Record<PermissionType, PermissionStatus> = {
    [PermissionType.CAMERA]: RESULTS.DENIED,
    [PermissionType.LOCATION]: RESULTS.DENIED,
    [PermissionType.PHOTO_LIBRARY]: RESULTS.DENIED,
    [PermissionType.CALENDAR]: RESULTS.DENIED,
    [PermissionType.NOTIFICATIONS]: RESULTS.DENIED,
    [PermissionType.MEDIA_LIBRARY]: RESULTS.DENIED,
    [PermissionType.CONTACTS]: RESULTS.DENIED,
    [PermissionType.MICROPHONE]: RESULTS.DENIED,
};

const initialLoadingState: Record<PermissionType, boolean> = {
    [PermissionType.CAMERA]: false,
    [PermissionType.LOCATION]: false,
    [PermissionType.PHOTO_LIBRARY]: false,
    [PermissionType.CALENDAR]: false,
    [PermissionType.NOTIFICATIONS]: false,
    [PermissionType.MEDIA_LIBRARY]: false,
    [PermissionType.CONTACTS]: false,
    [PermissionType.MICROPHONE]: false,
};

const initialLastRequestTimeState: Record<PermissionType, number> = {
    [PermissionType.CAMERA]: 0,
    [PermissionType.LOCATION]: 0,
    [PermissionType.PHOTO_LIBRARY]: 0,
    [PermissionType.CALENDAR]: 0,
    [PermissionType.NOTIFICATIONS]: 0,
    [PermissionType.MEDIA_LIBRARY]: 0,
    [PermissionType.CONTACTS]: 0,
    [PermissionType.MICROPHONE]: 0,
};

export const usePermissionStore = create<PermissionState>((set) => ({
    permissions: initialPermissionState,
    isLoading: initialLoadingState,
    lastRequestTime: initialLastRequestTimeState,

    setPermissionStatus: (permissionType, status) =>
        set((state) => ({
            permissions: {
                ...state.permissions,
                [permissionType]: status,
            },
        })),

    setLoading: (permissionType, loading) =>
        set((state) => ({
            isLoading: {
                ...state.isLoading,
                [permissionType]: loading,
            },
        })),

    checkPermissions: async (permissionTypes) => {
        try {
            set((state) => ({
                isLoading: permissionTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: true }),
                    state.isLoading
                ),
            }));

            const statuses = await checkPermissions(permissionTypes);
            set((state) => ({
                permissions: {
                    ...state.permissions,
                    ...statuses,
                },
                isLoading: permissionTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: false }),
                    state.isLoading
                ),
            }));
        } catch (error) {
            console.error('Error checking permissions:', error);
            set((state) => ({
                isLoading: permissionTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: false }),
                    state.isLoading
                ),
            }));
        }
    },

    requestPermissions: async (permissionTypes) => {
        try {
            set((state) => ({
                isLoading: permissionTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: true }),
                    state.isLoading
                ),
            }));

            const statuses = await requestPermissionsService(permissionTypes);
            const now = Date.now();

            set((state) => ({
                permissions: {
                    ...state.permissions,
                    ...statuses,
                },
                isLoading: permissionTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: false }),
                    state.isLoading
                ),
                lastRequestTime: permissionTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: now }),
                    state.lastRequestTime
                ),
            }));
        } catch (error) {
            console.error('Error requesting permissions:', error);
            set((state) => ({
                isLoading: permissionTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: false }),
                    state.isLoading
                ),
            }));
        }
    },

    requestPermissionsIfNeeded: async (permissionTypes) => {
        try {
            set((state) => ({
                isLoading: permissionTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: true }),
                    state.isLoading
                ),
            }));

            const statuses = await requestPermissionsIfNeeded(permissionTypes);
            const now = Date.now();

            set((state) => ({
                permissions: {
                    ...state.permissions,
                    ...statuses,
                },
                isLoading: permissionTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: false }),
                    state.isLoading
                ),
                lastRequestTime: permissionTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: now }),
                    state.lastRequestTime
                ),
            }));
        } catch (error) {
            console.error('Error requesting permissions if needed:', error);
            set((state) => ({
                isLoading: permissionTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: false }),
                    state.isLoading
                ),
            }));
        }
    },

    reset: () =>
        set({
            permissions: initialPermissionState,
            isLoading: initialLoadingState,
            lastRequestTime: initialLastRequestTimeState,
        }),
}));
