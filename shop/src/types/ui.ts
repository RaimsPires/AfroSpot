import { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";
import { Icon } from "../components/ui/AppIcon";

export type IconLibrary = keyof typeof Icon;

export type CustomIconProps = {
    library?: IconLibrary;
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
} & Record<string, unknown>;

export type IconWithBadgeProps = CustomIconProps & {
    badgeText?: string | number;
    showBadge?: boolean;
    maxBadgeCount?: number;
    containerStyle?: StyleProp<ViewStyle>;
    badgeContainerStyle?: StyleProp<ViewStyle>;
    badgeTextStyle?: StyleProp<TextStyle>;
    badgeColor?: string;
    badgeTextColor?: string;
    badgeTop?: number;
    badgeRight?: number;
};

export type GenericIconComponent = React.ComponentType<{
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
} & Record<string, unknown>>;


export type InputIconConfig = {
    library?: IconLibrary;
    name: string;
    size?: number;
    color?: string;
};


export type InputProps = TextInputProps & {
    label?: string;
    helperText?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputWrapperStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    helperStyle?: StyleProp<TextStyle>;
    leftIcon?: InputIconConfig;
    rightIcon?: InputIconConfig;
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
    secureToggleEnabled?: boolean;
    secureShowIconName?: string;
    secureHideIconName?: string;
    secureIconLibrary?: IconLibrary;
};