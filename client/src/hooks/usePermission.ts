import { checkPermission, getPermissionStatus, getPermissionStatusMessage, PermissionType, RESULTS } from '@/permissions';
import { usePermissionStore } from '@store/permissionStore';
import { useCallback } from 'react';

/**
 * Hook for managing permissions in components
 */
export const usePermission = () => {
    const {
        permissions,
        isLoading,
        setPermissionStatus,
        setLoading,
        checkPermissions,
        requestPermissions,
        requestPermissionsIfNeeded,
    } = usePermissionStore();

    const checkSinglePermission = useCallback(
        async (permissionType: PermissionType) => {
            try {
                setLoading(permissionType, true);
                const isGranted = await checkPermission(permissionType);
                const status = await getPermissionStatus(permissionType);
                setPermissionStatus(permissionType, status);
                return isGranted;
            } catch (error) {
                console.error(
                    `Error checking ${permissionType} permission:`,
                    error
                );
                return false;
            } finally {
                setLoading(permissionType, false);
            }
        },
        [setLoading, setPermissionStatus]
    );

    const requestSinglePermission = useCallback(
        async (permissionType: PermissionType) => {
            try {
                setLoading(permissionType, true);
                await requestPermissions([permissionType]);
                const status = permissions[permissionType];
                return status === RESULTS.GRANTED;
            } catch (error) {
                console.error(
                    `Error requesting ${permissionType} permission:`,
                    error
                );
                return false;
            } finally {
                setLoading(permissionType, false);
            }
        },
        [permissions, requestPermissions, setLoading]
    );

    const requestSinglePermissionIfNeeded = useCallback(
        async (permissionType: PermissionType) => {
            try {
                setLoading(permissionType, true);
                await requestPermissionsIfNeeded([permissionType]);
                const status = permissions[permissionType];
                return status === RESULTS.GRANTED;
            } catch (error) {
                console.error(
                    `Error requesting ${permissionType} permission if needed:`,
                    error
                );
                return false;
            } finally {
                setLoading(permissionType, false);
            }
        },
        [permissions, requestPermissionsIfNeeded, setLoading]
    );

    const getStatusMessage = useCallback(
        (permissionType: PermissionType): string => {
            const status = permissions[permissionType];
            return getPermissionStatusMessage(status, permissionType);
        },
        [permissions]
    );

    const isGranted = useCallback(
        (permissionType: PermissionType): boolean => {
            return permissions[permissionType] === RESULTS.GRANTED;
        },
        [permissions]
    );

    const isBlocked = useCallback(
        (permissionType: PermissionType): boolean => {
            return permissions[permissionType] === RESULTS.BLOCKED;
        },
        [permissions]
    );

    return {
        // State
        permissions,
        isLoading,

        // Single permission actions
        checkPermission: checkSinglePermission,
        requestPermission: requestSinglePermission,
        requestPermissionIfNeeded: requestSinglePermissionIfNeeded,

        // Multiple permissions actions
        checkPermissions,
        requestPermissions,
        requestPermissionsIfNeeded,

        // Permission checks
        isGranted,
        isBlocked,

        // Utilities
        getStatusMessage,
    };
};
