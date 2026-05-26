import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@components/ui';
import type { ThemeMode } from '@type/theme';

type ThemeSelectionModalProps = {
    visible: boolean;
    onClose: () => void;
    onSelectTheme: (mode: ThemeMode) => Promise<void>;
    currentThemeMode: ThemeMode;
    isBusy?: boolean;
    colors: {
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        primary: string;
        border: string;
    };
};

const THEME_OPTIONS: Array<{ mode: ThemeMode; label: string; icon: string; helper: string }> = [
    {
        mode: 'system',
        label: 'System',
        icon: 'smartphone',
        helper: 'Match your device appearance',
    },
    {
        mode: 'light',
        label: 'Light',
        icon: 'sun',
        helper: 'Always use light mode',
    },
    {
        mode: 'dark',
        label: 'Dark',
        icon: 'moon',
        helper: 'Always use dark mode',
    },
];

const ThemeSelectionModal = ({
    visible,
    onClose,
    onSelectTheme,
    currentThemeMode,
    isBusy = false,
    colors,
}: ThemeSelectionModalProps) => {
    const handleSelectTheme = (mode: ThemeMode) => {
        if (isBusy) {
            return;
        }

        onSelectTheme(mode).catch(() => undefined);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={[styles.bottomSheet, { backgroundColor: colors.surface }]}
                    onPress={(event) => event.stopPropagation()}
                >
                    <View style={[styles.handle, { backgroundColor: colors.border }]} />

                    <Text style={[styles.title, { color: colors.text }]}>Theme</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Choose how AfroSpot looks</Text>

                    {THEME_OPTIONS.map((option) => {
                        const isSelected = currentThemeMode === option.mode;

                        return (
                            <TouchableOpacity
                                key={option.mode}
                                style={[
                                    styles.optionButton,
                                    {
                                        backgroundColor: isSelected ? colors.primary + '15' : colors.background,
                                        borderColor: colors.border,
                                    },
                                ]}
                                onPress={() => handleSelectTheme(option.mode)}
                                disabled={isBusy}
                            >
                                <View style={styles.optionLeft}>
                                    <View style={[styles.optionIconWrap, { backgroundColor: colors.primary + '15' }]}>
                                        <AppIcon library="Feather" name={option.icon} size={18} color={colors.primary} />
                                    </View>
                                    <View>
                                        <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
                                        <Text style={[styles.optionHelper, { color: colors.textSecondary }]}>{option.helper}</Text>
                                    </View>
                                </View>

                                {isSelected ? (
                                    <AppIcon library="AntDesign" name="check" size={18} color={colors.primary} />
                                ) : null}
                            </TouchableOpacity>
                        );
                    })}

                    <TouchableOpacity
                        style={[styles.closeButton, { borderColor: colors.border }]}
                        onPress={onClose}
                        disabled={isBusy}
                    >
                        <Text style={[styles.closeText, { color: colors.textSecondary }]}>{isBusy ? 'Updating...' : 'Close'}</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 28,
    },
    handle: {
        width: 48,
        height: 4,
        borderRadius: 999,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    optionButton: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    optionIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionLabel: {
        fontSize: 15,
        fontWeight: '700',
    },
    optionHelper: {
        fontSize: 12,
        marginTop: 2,
    },
    closeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 14,
        marginTop: 4,
    },
    closeText: {
        fontSize: 14,
        fontWeight: '700',
    },
});

export default ThemeSelectionModal;
