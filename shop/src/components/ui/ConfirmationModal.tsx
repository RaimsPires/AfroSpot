import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export type ConfirmationModalVariant = 'danger' | 'warning' | 'neutral';

type ConfirmationModalProps = {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmationModalVariant;
    isLoading?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
};

const VARIANT_COLOR: Record<ConfirmationModalVariant, string> = {
    danger: '#EF4444',
    warning: '#F59E0B',
    neutral: '#6366F1',
};

const ConfirmationModal = ({
    visible,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'neutral',
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmationModalProps) => {
    const accentColor = VARIANT_COLOR[variant];
    const { colors } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            <Pressable style={styles.overlay} onPress={isLoading ? undefined : onCancel}>
                <Pressable
                    style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={(e) => e.stopPropagation()}
                >
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.cancelBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                            onPress={onCancel}
                            disabled={isLoading}
                        >
                            <Text style={[styles.cancelLabel, { color: colors.text }]}>{cancelLabel}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.confirmBtn, { backgroundColor: accentColor }]}
                            onPress={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={styles.confirmLabel}>{confirmLabel}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    container: {
        width: '100%',
        borderRadius: 18,
        borderWidth: 1,
        padding: 20,
    },
    title: {
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelLabel: {
        fontSize: 14,
        fontWeight: '700',
    },
    confirmBtn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmLabel: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default ConfirmationModal;
