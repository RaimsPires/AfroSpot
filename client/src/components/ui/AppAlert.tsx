import React from 'react';
import {
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { IconLibrary } from '../../types/ui';
import AppIcon from './AppIcon';

export type AlertVariant = 'success' | 'warning' | 'info' | 'error';

type AppAlertProps = {
    title: string;
    message?: string;
    variant?: AlertVariant;
    iconLibrary?: IconLibrary;
    iconName?: string;
    dismissible?: boolean;
    onClose?: () => void;
    actionLabel?: string;
    onAction?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
};

type VariantTheme = {
    accent: string;
    bgLight: string;
    bgDark: string;
    borderLight: string;
    borderDark: string;
    defaultIcon: string;
};

const VARIANT_THEME: Record<AlertVariant, VariantTheme> = {
    success: {
        accent: '#22C55E',
        bgLight: 'rgba(34, 197, 94, 0.12)',
        bgDark: 'rgba(34, 197, 94, 0.2)',
        borderLight: 'rgba(34, 197, 94, 0.35)',
        borderDark: 'rgba(34, 197, 94, 0.5)',
        defaultIcon: 'check-circle',
    },
    warning: {
        accent: '#F59E0B',
        bgLight: 'rgba(245, 158, 11, 0.12)',
        bgDark: 'rgba(245, 158, 11, 0.2)',
        borderLight: 'rgba(245, 158, 11, 0.35)',
        borderDark: 'rgba(245, 158, 11, 0.5)',
        defaultIcon: 'alert-circle',
    },
    info: {
        accent: '#3B82F6',
        bgLight: 'rgba(59, 130, 246, 0.12)',
        bgDark: 'rgba(59, 130, 246, 0.2)',
        borderLight: 'rgba(59, 130, 246, 0.35)',
        borderDark: 'rgba(59, 130, 246, 0.5)',
        defaultIcon: 'info',
    },
    error: {
        accent: '#FF5252',
        bgLight: 'rgba(255, 82, 82, 0.12)',
        bgDark: 'rgba(255, 82, 82, 0.2)',
        borderLight: 'rgba(255, 82, 82, 0.35)',
        borderDark: 'rgba(255, 82, 82, 0.5)',
        defaultIcon: 'x-circle',
    },
};

const AppAlert: React.FC<AppAlertProps> = ({
    title,
    message,
    variant = 'info',
    iconLibrary = 'Feather',
    iconName,
    dismissible = false,
    onClose,
    actionLabel,
    onAction,
    containerStyle,
}) => {
    const { colors, isDark, spacing } = useTheme();
    const visual = VARIANT_THEME[variant];

    const rootStyle = {
        backgroundColor: isDark ? visual.bgDark : visual.bgLight,
        borderColor: isDark ? visual.borderDark : visual.borderLight,
        padding: spacing(2),
    };

    const iconWrapStyle = {
        backgroundColor: isDark ? `${colors.surface}E6` : `${colors.background}F0`,
    };

    const actionButtonStyle = {
        borderColor: visual.accent,
    };

    const titleStyle = {
        color: colors.text,
    };

    const messageStyle = {
        color: colors.textSecondary,
    };

    const actionTextStyle = {
        color: visual.accent,
    };

    const closeIconColor = colors.textSecondary;

    return (
        <View style={[styles.root, rootStyle, containerStyle]}>
            <View style={styles.row}>
                <View style={[styles.iconWrap, iconWrapStyle]}>
                    <AppIcon
                        library={iconLibrary}
                        name={iconName ?? visual.defaultIcon}
                        size={18}
                        color={visual.accent}
                    />
                </View>

                <View style={styles.content}>
                    <Text style={[styles.title, titleStyle]}>{title}</Text>
                    {!!message && <Text style={[styles.message, messageStyle]}>{message}</Text>}

                    {!!actionLabel && !!onAction && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.actionButton, actionButtonStyle]}
                            onPress={onAction}
                        >
                            <Text style={[styles.actionText, actionTextStyle]}>{actionLabel}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {dismissible && (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss alert"
                        activeOpacity={0.75}
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <AppIcon library="Feather" name="x" size={16} color={closeIconColor} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        width: '90%',
        borderWidth: 1,
        borderRadius: 14,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 21,
    },
    message: {
        marginTop: 4,
        fontSize: 14,
        lineHeight: 20,
    },
    actionButton: {
        alignSelf: 'flex-start',
        marginTop: 12,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    closeButton: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
});

export default AppAlert;