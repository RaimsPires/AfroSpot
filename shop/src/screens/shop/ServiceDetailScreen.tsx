import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppAlert, AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { ServiceData, ServiceImageData, serviceService } from '@services/serviceService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ServiceDetailScreen = ({ route, navigation }: any) => {
    const { colors } = useTheme();

    const [service, setService] = useState<ServiceData>(route.params?.service);
    const [heroImage, setHeroImage] = useState<ServiceImageData | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', variant: 'info' as any, placement: 'top' as any, dismissible: true, actionLabel: undefined, onAction: undefined as any });

    const showAlert = (config: any) => setAlertConfig({ visible: true, dismissible: true, placement: 'top', variant: 'info', ...config });
    const closeAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

    useEffect(() => {
        if (service?.images?.length > 0) {
            const primary = service.images.find(img => img.is_primary);
            setHeroImage(primary || service.images[0]);
        }
    }, [service]);

    const handleSetPrimary = async () => {
        if (!heroImage || heroImage.is_primary) return;
        setIsUpdating(true);
        try {
            await serviceService.updateServiceImage(heroImage.id, { is_primary: true });
            const updatedImages = service.images.map(img => ({ ...img, is_primary: img.id === heroImage.id }));
            setService(prev => ({ ...prev, images: updatedImages }));
            setHeroImage(prev => prev ? { ...prev, is_primary: true } : null);
            showAlert({ title: 'Success', message: 'Cover image updated.', variant: 'success' });
        } catch {
            showAlert({ title: 'Error', message: 'Could not set primary image.', variant: 'error' });
        } finally {
            setIsUpdating(false);
        }
    };

    const executeDeleteImage = async (imgId: number) => {
        setIsUpdating(true);
        try {
            await serviceService.deleteServiceImage(imgId);
            const updatedImages = service.images.filter(img => img.id !== imgId);
            if (heroImage?.id === imgId) setHeroImage(updatedImages.find(img => img.is_primary) || updatedImages[0]);
            setService(prev => ({ ...prev, images: updatedImages }));
            showAlert({ title: 'Deleted', message: 'Image removed permanently.', variant: 'success' });
        } catch {
            showAlert({ title: 'Error', message: 'Could not delete image.', variant: 'error' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteImage = (imgId: number) => {
        if (service.images.length <= 1) {
            showAlert({ title: 'Cannot Delete', message: 'A service must have at least one image.', variant: 'warning' });
            return;
        }
        showAlert({
            title: 'Delete Image', message: 'Are you sure you want to remove this image permanently?', variant: 'error', placement: 'center', actionLabel: 'Delete',
            onAction: () => { closeAlert(); executeDeleteImage(imgId); }
        });
    };

    if (!service || !heroImage) return null;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />
            <AppAlert {...alertConfig} onClose={closeAlert} />

            <View style={styles.heroContainer}>
                <Image source={{ uri: heroImage.image }} style={styles.heroImage} resizeMode="cover" />
                <View style={styles.heroHeader}>
                    <TouchableOpacity style={styles.iconBtnBtn} onPress={() => navigation.goBack()}>
                        <AppIcon library="Feather" name="arrow-left" size={22} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.heroActions}>
                        {isUpdating ? <ActivityIndicator color="#FFF" style={{ marginRight: 16 }} /> : (
                            <>
                                {!heroImage.is_primary && (
                                    <TouchableOpacity style={[styles.actionBadge, { backgroundColor: colors.primary, marginRight: 8 }]} onPress={handleSetPrimary}>
                                        <AppIcon library="Feather" name="star" size={14} color="#FFF" />
                                        <Text style={styles.actionBadgeText}>Set Cover</Text>
                                    </TouchableOpacity>
                                )}
                                {heroImage.is_primary && (
                                    <View style={[styles.actionBadge, { backgroundColor: 'rgba(0,0,0,0.5)', marginRight: 8 }]}>
                                        <AppIcon library="Feather" name="check-circle" size={14} color="#4ADE80" />
                                        <Text style={styles.actionBadgeText}>Cover</Text>
                                    </View>
                                )}
                                <TouchableOpacity style={[styles.iconBtnBtn, { backgroundColor: colors.destructive }]} onPress={() => handleDeleteImage(heroImage.id)}>
                                    <AppIcon library="Feather" name="trash-2" size={18} color="#FFF" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </View>

            <View style={[styles.thumbStrip, { backgroundColor: colors.background }]}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={service.images}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}
                    renderItem={({ item }) => {
                        const isActive = item.id === heroImage.id;
                        return (
                            <TouchableOpacity onPress={() => setHeroImage(item)} style={[styles.thumbWrapper, isActive && { borderColor: colors.primary, borderWidth: 2 }]}>
                                <Image source={{ uri: item.image }} style={styles.thumbImage} />
                                {item.is_primary && <View style={styles.thumbPrimaryBadge}><AppIcon library="Feather" name="star" size={10} color="#FFF" /></View>}
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            <View style={[styles.infoSection, { backgroundColor: colors.background }]}>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: colors.text }]}>{service.name}</Text>
                    <Text style={[styles.price, { color: colors.primary }]}>${service.price}</Text>
                </View>

                <Text style={[styles.label, { color: colors.textSecondary }]}>ABOUT SERVICE</Text>
                <Text style={[styles.description, { color: colors.text }]}>{service.description}</Text>

                <View style={styles.statsRow}>
                    <StatItem label="DURATION" value={`${service.duration_minutes} min`} colors={colors} />
                    <StatItem label="BUFFER TIME" value={`${service.buffer_minutes} min`} colors={colors} />
                </View>
            </View>
        </View>
    );
};

const StatItem = ({ label, value, colors }: any) => (
    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    </View>
);

export default ServiceDetailScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    heroContainer: { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.9, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    heroHeader: { position: 'absolute', top: 50, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    heroActions: { flexDirection: 'row', alignItems: 'center' },
    iconBtnBtn: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 14 },
    actionBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, gap: 6 },
    actionBadgeText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
    thumbStrip: { height: 90, justifyContent: 'center' },
    thumbWrapper: { width: 64, height: 64, marginRight: 12, borderRadius: 14, overflow: 'hidden', backgroundColor: '#E5E5E5' },
    thumbImage: { width: '100%', height: '100%' },
    thumbPrimaryBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: 4 },
    infoSection: { flex: 1, padding: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    title: { fontSize: 26, fontWeight: '900', flex: 1, letterSpacing: -0.5 },
    price: { fontSize: 22, fontWeight: '800', marginLeft: 16 },
    label: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 10 },
    description: { fontSize: 15, lineHeight: 24, marginBottom: 28, opacity: 0.8 },
    statsRow: { flexDirection: 'row', gap: 16 },
    statBox: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1 },
    statLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1, marginBottom: 6 },
    statValue: { fontSize: 18, fontWeight: '800' },
});