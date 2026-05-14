import { Platform } from 'react-native';
import {
    PERMISSIONS,
    Permission,
    PermissionStatus,
    RESULTS,
    check,
    checkMultiple,
    checkNotifications,
    request,
    requestMultiple,
    requestNotifications,
} from 'react-native-permissions';

/**
 * Permission types supported by the app
 */
export enum PermissionType {
    CAMERA = 'CAMERA',
    LOCATION = 'LOCATION',
    PHOTO_LIBRARY = 'PHOTO_LIBRARY',
    CALENDAR = 'CALENDAR',
    NOTIFICATIONS = 'NOTIFICATIONS',
    MEDIA_LIBRARY = 'MEDIA_LIBRARY',
    CONTACTS = 'CONTACTS',
    MICROPHONE = 'MICROPHONE',
}

/**
 * Map permission types to platform-specific permissions
 */
const permissionMap: Record<Exclude<PermissionType, PermissionType.NOTIFICATIONS>, Permission> = {
    [PermissionType.CAMERA]: Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
    })!,
    [PermissionType.LOCATION]: Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    })!,
    [PermissionType.PHOTO_LIBRARY]: Platform.select({
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
    })!,
    [PermissionType.CALENDAR]: Platform.select({
        ios: PERMISSIONS.IOS.CALENDARS,
        android: PERMISSIONS.ANDROID.READ_CALENDAR,
    })!,
    [PermissionType.MEDIA_LIBRARY]: Platform.select({
        ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
        android: PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
    })!,
    [PermissionType.CONTACTS]: Platform.select({
        ios: PERMISSIONS.IOS.CONTACTS,
        android: PERMISSIONS.ANDROID.READ_CONTACTS,
    })!,
    [PermissionType.MICROPHONE]: Platform.select({
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    })!,
};

const createDeniedStatuses = (
    permissionTypes: PermissionType[]
): Record<PermissionType, PermissionStatus> =>
    permissionTypes.reduce(
        (acc, type) => ({ ...acc, [type]: RESULTS.DENIED }),
        {} as Record<PermissionType, PermissionStatus>
    );

/**
 * Check if a permission is granted
 */
export const checkPermission = async (
    permissionType: PermissionType
): Promise<boolean> => {
    try {
        const status =
            permissionType === PermissionType.NOTIFICATIONS
                ? (await checkNotifications()).status
                : await check(permissionMap[permissionType]);
        return status === RESULTS.GRANTED;
    } catch (error) {
        console.error(`Error checking ${permissionType} permission:`, error);
        return false;
    }
};

/**
 * Get the current status of a permission
 */
export const getPermissionStatus = async (
    permissionType: PermissionType
): Promise<PermissionStatus> => {
    try {
        if (permissionType === PermissionType.NOTIFICATIONS) {
            return (await checkNotifications()).status;
        }

        return check(permissionMap[permissionType]);
    } catch (error) {
        console.error(`Error getting ${permissionType} status:`, error);
        return RESULTS.DENIED;
    }
};

/**
 * Request a single permission
 */
export const requestPermission = async (
    permissionType: PermissionType
): Promise<PermissionStatus> => {
    try {
        if (permissionType === PermissionType.NOTIFICATIONS) {
            return (await requestNotifications(['alert', 'sound', 'badge'])).status;
        }

        return request(permissionMap[permissionType]);
    } catch (error) {
        console.error(`Error requesting ${permissionType} permission:`, error);
        return RESULTS.DENIED;
    }
};

/**
 * Request multiple permissions
 */
export const requestPermissions = async (
    permissionTypes: PermissionType[]
): Promise<Record<PermissionType, PermissionStatus>> => {
    try {
        const result = createDeniedStatuses(permissionTypes);
        const regularTypes = permissionTypes.filter(
            (type) => type !== PermissionType.NOTIFICATIONS
        );

        if (permissionTypes.includes(PermissionType.NOTIFICATIONS)) {
            result[PermissionType.NOTIFICATIONS] = (
                await requestNotifications(['alert', 'sound', 'badge'])
            ).status;
        }

        if (regularTypes.length > 0) {
            const permissions = regularTypes.map((type) => permissionMap[type]);
            const statuses = await requestMultiple(permissions);

            regularTypes.forEach((type, index) => {
                result[type] = statuses[permissions[index]];
            });
        }

        return result;
    } catch (error) {
        console.error('Error requesting multiple permissions:', error);
        return createDeniedStatuses(permissionTypes);
    }
};

/**
 * Check multiple permissions at once
 */
export const checkPermissions = async (
    permissionTypes: PermissionType[]
): Promise<Record<PermissionType, PermissionStatus>> => {
    try {
        const result = createDeniedStatuses(permissionTypes);
        const regularTypes = permissionTypes.filter(
            (type) => type !== PermissionType.NOTIFICATIONS
        );

        if (permissionTypes.includes(PermissionType.NOTIFICATIONS)) {
            result[PermissionType.NOTIFICATIONS] = (await checkNotifications()).status;
        }

        if (regularTypes.length > 0) {
            const permissions = regularTypes.map((type) => permissionMap[type]);
            const statuses = await checkMultiple(permissions);

            regularTypes.forEach((type, index) => {
                result[type] = statuses[permissions[index]];
            });
        }

        return result;
    } catch (error) {
        console.error('Error checking multiple permissions:', error);
        return createDeniedStatuses(permissionTypes);
    }
};

/**
 * Check if all permissions are granted
 */
export const areAllPermissionsGranted = async (
    permissionTypes: PermissionType[]
): Promise<boolean> => {
    try {
        const statuses = await checkPermissions(permissionTypes);
        return Object.values(statuses).every(
            (status) => status === RESULTS.GRANTED
        );
    } catch (error) {
        console.error('Error checking if all permissions are granted:', error);
        return false;
    }
};

/**
 * Request permissions if not already granted
 */
export const requestPermissionsIfNeeded = async (
    permissionTypes: PermissionType[]
): Promise<Record<PermissionType, PermissionStatus>> => {
    try {
        const statuses = await checkPermissions(permissionTypes);
        const neededPermissions = permissionTypes.filter(
            (type) => statuses[type] !== RESULTS.GRANTED
        );

        if (neededPermissions.length === 0) {
            return statuses;
        }

        return await requestPermissions(neededPermissions);
    } catch (error) {
        console.error('Error requesting permissions if needed:', error);
        return createDeniedStatuses(permissionTypes);
    }
};

/**
 * Get user-friendly status message
 */
export const getPermissionStatusMessage = (
    status: PermissionStatus,
    permissionName: string
): string => {
    switch (status) {
        case RESULTS.GRANTED:
            return `${permissionName} permission granted`;
        case RESULTS.DENIED:
            return `${permissionName} permission denied`;
        case RESULTS.BLOCKED:
            return `${permissionName} permission blocked. Please enable it in settings`;
        case RESULTS.UNAVAILABLE:
            return `${permissionName} permission unavailable on this device`;
        case RESULTS.LIMITED:
            return `${permissionName} permission limited`;
        default:
            return `Unknown status for ${permissionName} permission`;
    }
};

/**
 * Export permission status constants for easier checking
 */
export { RESULTS };
