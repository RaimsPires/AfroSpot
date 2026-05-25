import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import i18n, {
    FALLBACK_LANGUAGE,
    resolveSupportedLanguage,
    SUPPORTED_LANGUAGES,
    type SupportedLanguage,
} from '@i18n/index';
import { apiClient } from '@services/apiClient';
import { localeStorage } from '@services/localeStorage';
import { STORAGE_KEYS } from '@utils/storage_constances';

type TranslationContextValue = {
    language: SupportedLanguage;
    supportedLanguages: SupportedLanguage[];
    setLanguage: (language: string) => Promise<void>;
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<SupportedLanguage>(
        resolveSupportedLanguage(i18n.language),
    );

    useEffect(() => {
        const handleLanguageChange = (nextLanguage: string) => {
            setLanguageState(resolveSupportedLanguage(nextLanguage));
        };

        i18n.on('languageChanged', handleLanguageChange);
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    useEffect(() => {
        const hydrateStoredLocale = async () => {
            const encryptedLocale = await localeStorage.getEncryptedItem(STORAGE_KEYS.APP_LOCALE);
            const asyncLocale = encryptedLocale
                ? null
                : await localeStorage.getItem(STORAGE_KEYS.APP_LOCALE);
            const storedLocale = encryptedLocale || asyncLocale;

            if (asyncLocale) {
                await localeStorage.setEncryptedItem(STORAGE_KEYS.APP_LOCALE, asyncLocale);
            }

            const resolvedStoredLocale = resolveSupportedLanguage(storedLocale);
            apiClient.setLocale(resolvedStoredLocale);

            if (resolvedStoredLocale !== resolveSupportedLanguage(i18n.language)) {
                await i18n.changeLanguage(resolvedStoredLocale);
            }
        };

        hydrateStoredLocale().catch((error) => {
            console.error('[TranslationContext] Failed to hydrate locale:', error);
        });
    }, []);

    const setLanguage = async (nextLanguage: string) => {
        const resolvedLanguage = resolveSupportedLanguage(nextLanguage);
        apiClient.setLocale(resolvedLanguage);
        await i18n.changeLanguage(resolvedLanguage || FALLBACK_LANGUAGE);
        await Promise.all([
            localeStorage.setEncryptedItem(STORAGE_KEYS.APP_LOCALE, resolvedLanguage),
            localeStorage.setItem(STORAGE_KEYS.APP_LOCALE, resolvedLanguage),
        ]);
    };

    const value = useMemo(
        () => ({
            language,
            supportedLanguages: SUPPORTED_LANGUAGES,
            setLanguage,
            t: i18n.t.bind(i18n),
        }),
        [language],
    );

    return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

export const useTranslation = () => {
    const context = useContext(TranslationContext);

    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }

    return context;
};

export const useTranslationContext = useTranslation;
