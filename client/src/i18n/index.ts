import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './resources/en.json';
import fr from './resources/fr.json';

export const resources = {
    en: { translation: en },
    fr: { translation: fr },
} as const;

export type SupportedLanguage = keyof typeof resources;

export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';
export const SUPPORTED_LANGUAGES = Object.keys(resources) as SupportedLanguage[];

export const resolveSupportedLanguage = (locale?: string | null): SupportedLanguage => {
    if (!locale) {
        return FALLBACK_LANGUAGE;
    }

    const baseLocale = locale.split(/[-_]/)[0]?.toLowerCase();

    if (!baseLocale) {
        return FALLBACK_LANGUAGE;
    }

    return SUPPORTED_LANGUAGES.includes(baseLocale as SupportedLanguage)
        ? (baseLocale as SupportedLanguage)
        : FALLBACK_LANGUAGE;
};

export const DEFAULT_LANGUAGE: SupportedLanguage = resolveSupportedLanguage(
    Intl.DateTimeFormat().resolvedOptions().locale,
);

if (!i18n.isInitialized) {
    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: DEFAULT_LANGUAGE,
            fallbackLng: FALLBACK_LANGUAGE,
            compatibilityJSON: 'v4',
            interpolation: {
                escapeValue: false,
            },
            react: {
                useSuspense: false,
            },
        });
}

export default i18n;
