import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AppIcon from './AppIcon';

export type AlertVariant = 'success' | 'warning' | 'info' | 'error';

type Props = {
    visible: boolean;
    title: string;
    message?: string;
    variant?: AlertVariant;
    dismissible?: boolean;
    onClose?: () => void;
    // Primary Action
    actionLabel: string;
    onAction: () => void;
    // Secondary Action (Optional)
    secondaryLabel?: string;
    onSecondaryAction?: () => void;
};

const VARIANT_COLORS: Record<AlertVariant, { primary: string; bg: string }> = {
    success: { primary: '#10B981', bg: '#10B98115' },
    warning: { primary: '#F59E0B', bg: '#F59E0B15' },
    info: { primary: '#3B82F6', bg: '#3B82F615' },
    error: { primary: '#EF4444', bg: '#EF444415' },
};

const AppAlert: React.FC<Props> = ({
    visible,
    title,
    message,
    variant = 'info',
    dismissible = true,
    onClose,
    actionLabel,
    onAction,
    secondaryLabel,
    onSecondaryAction,
}) => {
    const { colors } = useTheme();
    const { primary, bg } = VARIANT_COLORS[variant];

    const iconName = variant === 'success' ? 'check' : variant === 'error' ? 'x' : variant === 'warning' ? 'alert-triangle' : 'info';

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <Pressable style={styles.backdrop} onPress={dismissible ? onClose : undefined} />
            
            <View style={styles.container}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: primary }]}>
                    
                    {/* Icon Header */}
                    <View style={[styles.iconContainer, { backgroundColor: bg }]}>
                        <AppIcon library="Feather" name={iconName} size={28} color={primary} />
                    </View>

                    {/* Content */}
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    {message && <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>}

                    {/* Actions */}
                    <View style={styles.buttonRow}>
                        {secondaryLabel && (
                            <TouchableOpacity 
                                style={[styles.secondaryBtn, { borderColor: colors.border }]} 
                                onPress={onSecondaryAction}
                            >
                                <Text style={[styles.secondaryLabel, { color: colors.textSecondary }]}>{secondaryLabel}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            style={[styles.primaryBtn, { backgroundColor: primary }]} 
                            onPress={onAction}
                        >
                            <Text style={styles.primaryLabel}>{actionLabel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: { 
        ...StyleSheet.absoluteFill, 
        backgroundColor: 'rgba(0,0,0,0.5)' 
    },
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20 
    },
    card: { 
        width: '100%', 
        maxWidth: 350, 
        borderRadius: 28, 
        padding: 24, 
        borderWidth: 2,
        alignItems: 'center'
    },
    iconContainer: { 
        width: 64, 
        height: 64, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 20 
    },
    title: { 
        fontSize: 20, 
        fontWeight: '800', 
        textAlign: 'center', 
        marginBottom: 8 
    },
    message: { 
        fontSize: 15, 
        lineHeight: 22, 
        textAlign: 'center', 
        marginBottom: 28 
    },
    buttonRow: { 
        flexDirection: 'row', 
        gap: 12, 
        width: '100%' 
    },
    primaryBtn: { 
        flex: 1, 
        height: 52, 
        borderRadius: 16, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    secondaryBtn: { 
        flex: 1, 
        height: 52, 
        borderRadius: 16, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1.5 
    },
    primaryLabel: { 
        color: '#FFF', 
        fontWeight: '700', 
        fontSize: 15 
    },
    secondaryLabel: { 
        fontWeight: '600', 
        fontSize: 15 
    }
});

export default AppAlert;