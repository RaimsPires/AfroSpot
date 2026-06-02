import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

class LocaleStorage {
    // Note: The hardcoded encryptionKey is no longer needed! 
    // react-native-encrypted-storage uses the native OS-level Keystore/Keychain automatically.

    // ==========================================
    // STANDARD STORAGE (Unencrypted / Fast)
    // ==========================================

    public async getItem(key: string): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.error('[LocaleStorage] Failed to read item:', error);
            return null;
        }
    }

    public async setItem(key: string, value: string): Promise<void> {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('[LocaleStorage] Failed to save item:', error);
        }
    }

    public async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('[LocaleStorage] Failed to remove item:', error);
        }
    }

    public async removeMany(keys: string[]): Promise<void> {
        try {
            await AsyncStorage.multiRemove(keys);
        } catch (error) {
            console.error('[LocaleStorage] Failed to remove many items:', error);
        }
    }

    // ==========================================
    // SECURE STORAGE (Encrypted natively by OS)
    // ==========================================

    public async getEncryptedItem(key: string): Promise<string | null> {
        try {
            const value = await EncryptedStorage.getItem(key);
            return value; // Returns string or null
        } catch (error) {
            console.error('[LocaleStorage] Failed to read encrypted item:', error);
            return null;
        }
    }

    public async setEncryptedItem(key: string, value: string): Promise<void> {
        try {
            await EncryptedStorage.setItem(key, value);
        } catch (error) {
            console.error('[LocaleStorage] Failed to save encrypted item:', error);
        }
    }

    public async removeEncryptedItem(key: string): Promise<void> {
        try {
            await EncryptedStorage.removeItem(key);
        } catch (error) {
            console.error('[LocaleStorage] Failed to remove encrypted item:', error);
        }
    }
    
    /**
     * Optional utility to clear all encrypted data (useful on Logout)
     */
    public async clearAllEncrypted(): Promise<void> {
        try {
            await EncryptedStorage.clear();
        } catch (error) {
            console.error('[LocaleStorage] Failed to clear encrypted storage:', error);
        }
    }
}

export const localeStorage = new LocaleStorage();
