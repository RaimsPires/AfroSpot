import { useTheme } from '@contexts/ThemeContext';
import { IconLibrary } from '@type/ui';
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
import AppIcon from './AppIcon';

export type AlertVariant = 'success' | 'warning' | 'info' | 'error';
export type AlertPlacement = 'top' | 'center' | 'bottom'; 

type AppAlertProps = {
    visible: boolean;
    title: string;
    message?: string;
    variant?: AlertVariant;
    placement?: AlertPlacement;
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
        accent: '#00E676',
        bgLight: '#E8F5E9',
        bgDark: '#0A2E1C',
        borderLight: '#81C784',
        borderDark: '#00E676',
        defaultIcon: 'check-circle',
    },
    warning: {
        accent: '#FFB300',
        bgLight: '#FFF8E1',
        bgDark: '#3E2700',
        borderLight: '#FFD54F',
        borderDark: '#FFB300', 
        defaultIcon: 'alert-circle',
    },
    info: {
        accent: '#2979FF',
        bgLight: '#E3F2FD',
        bgDark: '#0A192F',
        borderLight: '#90CAF9',
        borderDark: '#2979FF',
        defaultIcon: 'info',
    },
    error: {
        accent: '#FF1744',
        bgLight: '#FFEBEE',
        bgDark: '#3B0A0A',
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
    placement = 'center',
    iconLibrary = 'Feather',
    iconName,
    dismissible = false,
    onClose,
    actionLabel,
    onAction,
    containerStyle,
}) => {
    const { colors, isDark } = useTheme();
    const visual = VARIANT_THEME[variant];

    const rootStyle = {
        backgroundColor: isDark ? visual.bgDark : visual.bgLight,
        borderColor: isDark ? visual.borderDark : visual.borderLight,
    };

    const iconWrapStyle = {
        backgroundColor: isDark ? `${colors.surface}E6` : `${colors.background}F0`,
    };

    const placementStyle: StyleProp<ViewStyle> = {
        justifyContent: 
            placement === 'top' ? 'flex-start' : 
            placement === 'bottom' ? 'flex-end' : 'center',
        paddingTop: placement === 'top' ? 60 : 0,       
        paddingBottom: placement === 'bottom' ? 40 : 0, 
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType={placement === 'bottom' ? 'slide' : 'fade'} 
            onRequestClose={dismissible ? onClose : undefined}
            statusBarTranslucent
        >
            <View style={[styles.overlay, placementStyle]}>
                <Pressable 
                    style={styles.backdrop} 
                    onPress={dismissible ? onClose : undefined} 
                />

                <View style={[styles.root, rootStyle, containerStyle]}>
                    <View style={styles.topRow}>
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
                        </View>

                        {dismissible && (
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityLabel="Dismiss alert"
                                activeOpacity={0.75}
                                onPress={onClose}
                                style={styles.closeButton}
                            >
                                <AppIcon library="Feather" name="x" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Action Button moved below the text to match the ConfirmationModal layout */}
                    {!!actionLabel && !!onAction && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.actionButton, { backgroundColor: visual.accent }]}
                            onPress={onAction}
                        >
                            <Text style={styles.actionText}>
                                {actionLabel}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24, // Matched ConfirmationModal
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Matched ConfirmationModal
    },
    root: {
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderRadius: 18, // Matched ConfirmationModal
        padding: 20,      // Matched ConfirmationModal
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    content: {
        flex: 1,
        paddingTop: 2,
    },
    title: {
        fontSize: 17,       // Matched ConfirmationModal
        fontWeight: '800',  // Matched ConfirmationModal
        lineHeight: 22,
        marginBottom: 4,
    },
    message: {
        fontSize: 14,       // Matched ConfirmationModal
        lineHeight: 20,     // Matched ConfirmationModal
    },
    actionButton: {
        marginTop: 20,
        height: 44,         // Matched ConfirmationModal
        borderRadius: 12,   // Matched ConfirmationModal
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    actionText: {
        color: '#FFF',      // Matched ConfirmationModal
        fontSize: 14,
        fontWeight: '700',
    },
    closeButton: {
        width: 32,
        height: 32,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginLeft: 10,
    },
});

export default AppAlert;