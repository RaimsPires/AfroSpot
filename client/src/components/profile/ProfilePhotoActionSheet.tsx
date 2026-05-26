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

type ProfilePhotoActionSheetProps = {
    visible: boolean;
    onClose: () => void;
    onCameraPress: () => void;
    onGalleryPress: () => void;
    isBusy?: boolean;
    colors: {
        surface: string;
        text: string;
        textSecondary: string;
        primary: string;
        border: string;
        background: string;
    };
};

const ProfilePhotoActionSheet = ({
    visible,
    onClose,
    onCameraPress,
    onGalleryPress,
    isBusy = false,
    colors,
}: ProfilePhotoActionSheetProps) => (
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

                <Text style={[styles.title, { color: colors.text }]}>Update profile photo</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Choose how you want to pick your new photo.</Text>

                <TouchableOpacity
                    style={[styles.optionButton, { borderColor: colors.border, backgroundColor: colors.background }]}
                    onPress={onCameraPress}
                    disabled={isBusy}
                >
                    <AppIcon library="Feather" name="camera" size={18} color={colors.primary} />
                    <Text style={[styles.optionLabel, { color: colors.text }]}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionButton, { borderColor: colors.border, backgroundColor: colors.background }]}
                    onPress={onGalleryPress}
                    disabled={isBusy}
                >
                    <AppIcon library="Feather" name="image" size={18} color={colors.primary} />
                    <Text style={[styles.optionLabel, { color: colors.text }]}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.cancelButton, { borderColor: colors.border }]}
                    onPress={onClose}
                    disabled={isBusy}
                >
                    <Text style={[styles.cancelText, { color: colors.textSecondary }]}>{isBusy ? 'Working...' : 'Cancel'}</Text>
                </TouchableOpacity>
            </Pressable>
        </Pressable>
    </Modal>
);

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
        marginBottom: 18,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 12,
    },
    optionLabel: {
        fontSize: 15,
        fontWeight: '700',
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 14,
        marginTop: 4,
    },
    cancelText: {
        fontSize: 14,
        fontWeight: '700',
    },
});

export default ProfilePhotoActionSheet;