/**
 * Permission Service Index
 * Centralized exports for all permission-related utilities
 */

// Service exports
export {
    areAllPermissionsGranted, checkPermission, checkPermissions, getPermissionStatus, getPermissionStatusMessage, PermissionType, requestPermission,
    requestPermissions, requestPermissionsIfNeeded, RESULTS
} from '../services/permissionService';

// Store exports
export { usePermissionStore, type PermissionState } from '../store/permissionStore';

// Hook exports
export { usePermission } from '../hooks/usePermission';

/**
 * Usage Example:
 *
 * import { usePermission, PermissionType } from '@permissions';
 *
 * export const MyComponent = () => {
 *   const { isGranted, requestPermission } = usePermission();
 *
 *   const handleCamera = async () => {
 *     if (!isGranted(PermissionType.CAMERA)) {
 *       await requestPermission(PermissionType.CAMERA);
 *     }
 *   };
 *
 *   return <Button onPress={handleCamera} title="Use Camera" />;
 * };
 */
