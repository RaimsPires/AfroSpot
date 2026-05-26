export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppTheme {
    isDark: boolean;
    colors: {
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        primary: string;
        secondary: string;
        error: string;
        buttonDisabled: string;
        buttonDisabledText: string;
    };
    spacing: (factor: number) => number;
}
