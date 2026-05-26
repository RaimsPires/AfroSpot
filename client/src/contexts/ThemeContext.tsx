import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { palette } from '../theme/theme';
import { AppTheme, ThemeMode } from '../types/theme';


const lightTheme: AppTheme = {
    isDark: false,
    colors: {
        background: palette.white,
        surface: palette.gray[100],
        text: palette.black,
        textSecondary: palette.gray[500],
        border: palette.gray[200],
        primary: palette.primary,
        secondary: palette.secondary,
        error: palette.error,
        buttonDisabled: palette.gray[200],
        buttonDisabledText: palette.gray[500],
    },
    spacing: (n) => n * 8,
};

const darkTheme: AppTheme = {
    isDark: true,
    colors: {
        background: palette.black,
        surface: palette.gray[900],
        text: palette.white,
        textSecondary: palette.gray[500],
        border: palette.gray[800],
        primary: palette.primary,
        secondary: palette.secondary,
        error: palette.error,
        buttonDisabled: palette.gray[800],
        buttonDisabledText: palette.gray[500],
    },
    spacing: (n) => n * 8,
};

type ThemeContextValue = AppTheme & {
    themeMode: ThemeMode;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
    ...lightTheme,
    themeMode: 'system',
    toggleTheme: () => {},
    setThemeMode: () => {},
});

const resolveThemeByMode = (mode: ThemeMode, colorScheme: ReturnType<typeof useColorScheme>): AppTheme => {
    if (mode === 'dark') {
        return darkTheme;
    }

    if (mode === 'light') {
        return lightTheme;
    }

    return colorScheme === 'dark' ? darkTheme : lightTheme;
};

const normalizeThemeMode = (value: string | null | undefined): ThemeMode | null => {
    if (value === 'light' || value === 'dark' || value === 'system') {
        return value;
    }

    return null;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const colorScheme = useColorScheme();
    const userThemeSetting = useAuthStore((state) => state.user?.settings?.theme);
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
    const [theme, setTheme] = useState<AppTheme>(resolveThemeByMode('system', colorScheme));

    useEffect(() => {
        const nextMode = normalizeThemeMode(userThemeSetting) ?? 'system';
        setThemeModeState((prevMode) => (prevMode === nextMode ? prevMode : nextMode));
    }, [userThemeSetting]);

    useEffect(() => {
        setTheme(resolveThemeByMode(themeMode, colorScheme));
    }, [colorScheme, themeMode]);

    const toggleTheme = () => {
        setThemeModeState((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
    };

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
    };

    return (
        <ThemeContext.Provider value={{ ...theme, themeMode, toggleTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);