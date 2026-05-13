import { StyleProp, TextStyle, ViewStyle } from "react-native";
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