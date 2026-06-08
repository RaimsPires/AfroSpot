import { AppTheme } from '@type/theme';
import { IconLibrary } from '@type/ui';
import { ReactNode } from 'react';



export type ThemeColors = AppTheme['colors'];

export type MenuItemProps = {
    icon: string;
    label: string;
    colors: ThemeColors;
    value?: string;
    isLast?: boolean;
    rightElement?: ReactNode;
    colorOverride?: string;
    iconLibrary?: IconLibrary ,
    handlePress?: () => void;
};

export type MenuSectionProps = {
    title?: string;
    colors: ThemeColors;
    children: ReactNode;
};

export type ScreenHeaderProps = {
    colors: ThemeColors;
};

export type ProfileHeaderProps = {
    colors: ThemeColors;
};
