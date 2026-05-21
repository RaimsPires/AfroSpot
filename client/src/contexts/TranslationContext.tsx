import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import i18n, {
    FALLBACK_LANGUAGE,
    resolveSupportedLanguage,
    SUPPORTED_LANGUAGES,
    type SupportedLanguage,
} from '@i18n/index';

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

    const setLanguage = async (nextLanguage: string) => {
        const resolvedLanguage = resolveSupportedLanguage(nextLanguage);
        await i18n.changeLanguage(resolvedLanguage || FALLBACK_LANGUAGE);
    };

    const value = useMemo(
        () => ({
            language,
            supportedLanguages: SUPPORTED_LANGUAGES,
            setLanguage,
        }),
        [language],
    );

    return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

export const useTranslationContext = () => {
    const context = useContext(TranslationContext);

    if (!context) {
        throw new Error('useTranslationContext must be used within a TranslationProvider');
    }

    return context;
};
