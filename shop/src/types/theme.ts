export interface AppTheme {
    isDark: boolean;
    colors: {
        // Base surfaces
        background: string;
        surface: string;
        surfaceElevated: string;
        // Text
        text: string;
        textSecondary: string;
        textInverse: string;
        // Borders / dividers
        border: string;
        divider: string;
        // Brand
        primary: string;
        secondary: string;
        // Semantic states
        error: string;
        success: string;
        successSurface: string;
        warning: string;
        warningSurface: string;
        info: string;
        infoSurface: string;
        destructive: string;
        destructiveSurface: string;
        // Buttons
        buttonDisabled: string;
        buttonDisabledText: string;
        // Overlays
        overlay: string;
        overlayLight: string;
    };
    spacing: (factor: number) => number;
}
