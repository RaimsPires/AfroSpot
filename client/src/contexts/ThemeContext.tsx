import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { palette } from '../theme/theme';
import { AppTheme } from '../types/theme';


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
    toggleTheme: () => void;
    setThemeMode: (mode: string) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
    ...lightTheme,
    toggleTheme: () => {},
    setThemeMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const colorScheme = useColorScheme();
    const [theme, setTheme] = useState<AppTheme>(colorScheme === 'dark' ? darkTheme : lightTheme);
    const [isOverridden, setIsOverridden] = useState(false);

    useEffect(() => {
        if (!isOverridden) {
            setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
        }
    }, [colorScheme, isOverridden]);

    const toggleTheme = () => {
        setIsOverridden(true);
        setTheme((prevTheme) => (prevTheme.isDark ? lightTheme : darkTheme));
    };

    const setThemeMode = (mode: string) => {
        if (mode !== 'light' && mode !== 'dark') {
            return;
        }

        setIsOverridden(true);
        setTheme((prevTheme) => {
            if (mode === 'dark' && !prevTheme.isDark) {
                return darkTheme;
            }

            if (mode === 'light' && prevTheme.isDark) {
                return lightTheme;
            }

            return prevTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ ...theme, toggleTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);