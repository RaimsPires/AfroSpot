import React from 'react';
import {
    Modal,
    Pressable,
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
// 1. Define the placement options
export type AlertPlacement = 'top' | 'center' | 'bottom'; 

type AppAlertProps = {
    visible: boolean;
    title: string;
    message?: string;
    variant?: AlertVariant;
    placement?: AlertPlacement; // 2. Add to props
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
        accent: '#00E676', // Electric Spring Green
        bgLight: '#E8F5E9', // Solid crisp light green
        bgDark: '#0A2E1C', // Solid deep forest green
        borderLight: '#81C784',
        borderDark: '#00E676', // Glowing border for dark mode
        defaultIcon: 'check-circle',
    },
    warning: {
        accent: '#FFB300', // Vibrant Amber/Gold
        bgLight: '#FFF8E1', // Solid warm cream
        bgDark: '#3E2700', // Solid rich dark brown
        borderLight: '#FFD54F',
        borderDark: '#FFB300', 
        defaultIcon: 'alert-circle',
    },
    info: {
        accent: '#2979FF', // Bright Electric Blue
        bgLight: '#E3F2FD', // Solid crisp light blue
        bgDark: '#0A192F', // Solid deep navy blue
        borderLight: '#90CAF9',
        borderDark: '#2979FF',
        defaultIcon: 'info',
    },
    error: {
        accent: '#FF1744', // Neon Crimson Red
        bgLight: '#FFEBEE', // Solid soft pink/red
        bgDark: '#3B0A0A', // Solid deep blood red
        borderLight: '#E57373',
        borderDark: '#FF1744',
        defaultIcon: 'x-circle',
    },
};

const AppAlert: React.FC<AppAlertProps> = ({
    visible,
    title,
    message,
    variant = 'info',
    placement = 'center', // Default to center
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

    // 3. Calculate dynamic styles based on placement
    const placementStyle: StyleProp<ViewStyle> = {
        justifyContent: 
            placement === 'top' ? 'flex-start' : 
            placement === 'bottom' ? 'flex-end' : 'center',
        paddingTop: placement === 'top' ? 60 : 0,       // Safe area buffer for top
        paddingBottom: placement === 'bottom' ? 40 : 0, // Safe area buffer for bottom
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType={placement === 'bottom' ? 'slide' : 'fade'} // Slides up if at the bottom!
            onRequestClose={dismissible ? onClose : undefined}
        >
            {/* Apply the placementStyle here */}
            <View style={[styles.overlay, placementStyle]}>
                <Pressable 
                    style={styles.backdrop} 
                    onPress={dismissible ? onClose : undefined} 
                />

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
                            <Text style={[{ color: colors.text }, styles.title]}>{title}</Text>
                            {!!message && (
                                <Text style={[{ color: colors.textSecondary }, styles.message]}>
                                    {message}
                                </Text>
                            )}

                            {!!actionLabel && !!onAction && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.actionButton, actionButtonStyle]}
                                    onPress={onAction}
                                >
                                    <Text style={[{ color: visual.accent }, styles.actionText]}>
                                        {actionLabel}
                                    </Text>
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
                                <AppIcon library="Feather" name="x" size={16} color={colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    root: {
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
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