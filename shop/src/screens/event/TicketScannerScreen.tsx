import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export const TicketScannerScreen = () => {
    const { colors } = useTheme();
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const showFallback = !hasPermission || !device;

    return (
        <View style={styles.container}>
            {!showFallback && (
                <Camera
                    style={styles.camera}
                    device={device}
                    isActive
                />
            )}

            {/* 1. Camera View Finder */}
            <View style={styles.cameraOverlay}>
                <View style={styles.scanFrame}>
                    <View style={[styles.corner, styles.tl]} />
                    <View style={[styles.corner, styles.tr]} />
                    <View style={[styles.corner, styles.bl]} />
                    <View style={[styles.corner, styles.br]} />
                </View>
                <Text style={styles.instructions}>
                    {hasPermission
                        ? 'Align QR Code inside the frame'
                        : 'Camera permission is required to scan tickets'}
                </Text>

                {!hasPermission && (
                    <TouchableOpacity
                        style={[styles.permissionBtn, { backgroundColor: colors.primary }]}
                        onPress={requestPermission}
                    >
                        <Text style={styles.permissionBtnText}>Allow Camera Access</Text>
                    </TouchableOpacity>
                )}

                {hasPermission && !device && (
                    <Text style={styles.deviceFallbackText}>No back camera device available.</Text>
                )}
            </View>

            {/* 2. Controls */}
            <SafeAreaView style={styles.overlay}>
                <View style={styles.topRow}>
                    <TouchableOpacity style={styles.closeBtn}><AppIcon library="Feather" name="x" size={24} color="#FFF" /></TouchableOpacity>
                    <Text style={styles.scanTitle}>Gate 1: Check-in</Text>
                    <TouchableOpacity style={styles.closeBtn}><AppIcon library="Feather" name="zap" size={24} color="#FFF" /></TouchableOpacity>
                </View>

                <View style={styles.bottomRow}>
                    <View style={[styles.statsBox, styles.statsBoxOverlay]}>
                        <Text style={styles.statsNum}>142 / 500</Text>
                        <Text style={styles.statsLabel}>Check-ins</Text>
                    </View>
                    <TouchableOpacity style={styles.manualBtn}>
                        <Text style={styles.manualText}>Enter Code Manually</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    camera: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    cameraOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    scanFrame: { width: 250, height: 250, position: 'relative' },
    corner: { position: 'absolute', width: 40, height: 40, borderColor: '#10B981', borderWidth: 5 },
    tl: { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5 },
    tr: { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5 },
    bl: { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5 },
    br: { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5 },
    instructions: { color: '#FFF', marginTop: 40, fontSize: 16, fontWeight: '600' },
    permissionBtn: {
        marginTop: 20,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 10,
    },
    permissionBtnText: {
        color: '#FFF',
        fontWeight: '700',
    },
    deviceFallbackText: {
        marginTop: 12,
        color: '#FFF',
        fontSize: 14,
        opacity: 0.8,
    },
    overlay: { position: 'absolute', top: 0, width: '100%', height: '100%', justifyContent: 'space-between' },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    scanTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
    closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
    bottomRow: { padding: 30, alignItems: 'center', gap: 20 },
    statsBox: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
    statsBoxOverlay: { backgroundColor: 'rgba(0,0,0,0.6)' },
    statsNum: { color: '#FFF', fontSize: 20, fontWeight: '900' },
    statsLabel: { color: '#FFF', fontSize: 12, opacity: 0.7 },
    manualBtn: { padding: 15 },
    manualText: { color: '#FFF', fontWeight: '700', textDecorationLine: 'underline' }
});