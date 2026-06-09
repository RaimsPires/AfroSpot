import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddEditModalService from '@components/services/AddEditModalService';
import { AppAlert, AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { ServiceData, serviceService } from '@services/serviceService';

const ManageServicesScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    const [services, setServices] = useState<ServiceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingService, setEditingService] = useState<ServiceData | null>(null);

    // Alert State
    const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', variant: 'info' as any, placement: 'top' as any, dismissible: true, actionLabel: undefined, onAction: undefined as any });

    const showAlert = (config: any) => setAlertConfig({ visible: true, dismissible: true, placement: 'top', variant: 'info', ...config });
    const closeAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

    const fetchServices = async () => {
        try {
            setIsLoading(true);
            const data = await serviceService.getServices();
            setServices(data);
        } catch {
            showAlert({ title: 'Error', message: 'Could not load services.', variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    const openAddModal = () => { setEditingService(null); setModalVisible(true); };
    const openEditModal = (service: ServiceData) => { setEditingService(service); setModalVisible(true); };

    const handleDelete = (id: number) => {
        showAlert({
            title: 'Delete Service',
            message: 'Are you sure you want to permanently delete this service?',
            variant: 'error',
            placement: 'center',
            actionLabel: 'Delete',
            onAction: async () => {
                closeAlert();
                try {
                    await serviceService.deleteService(id);
                    setServices(prev => prev.filter(s => s.id !== id));
                    showAlert({ title: 'Deleted', message: 'Service removed.', variant: 'success' });
                } catch {
                    showAlert({ title: 'Error', message: 'Could not delete service.', variant: 'error' });
                }
            }
        });
    };

    const handleSave = async (formData: FormData) => {
        try {
            if (editingService) {
                const updated = await serviceService.updateService(editingService.id, formData);
                setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
                showAlert({ title: 'Success', message: 'Service updated.', variant: 'success' });
            } else {
                const newService = await serviceService.createService(formData);
                setServices([newService, ...services]);
                showAlert({ title: 'Success', message: 'Service created.', variant: 'success' });
            }
        } catch (error) {
            showAlert({ title: 'Error', message: 'Save failed.', variant: 'error' });
            throw error; 
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            
            <AppAlert {...alertConfig} onClose={closeAlert} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Services</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={openAddModal}>
                    <AppIcon library="Feather" name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                    {services.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={[styles.emptyIconBg, { backgroundColor: colors.surface }]}>
                                <AppIcon library="Feather" name="scissors" size={32} color={colors.textSecondary} />
                            </View>
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Services Yet</Text>
                            <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: colors.primary }]} onPress={openAddModal}>
                                <Text style={[styles.emptyBtnText, { color: colors.textInverse }]}>Add First Service</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        services.map((service) => {
                            const primaryImage = service.images?.find(img => img.is_primary)?.image || service.images?.[0]?.image;
                            
                            return (
                                <TouchableOpacity 
                                    key={service.id} 
                                    style={[styles.serviceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                    onPress={() => navigation.navigate('ServiceDetail', { service })}
                                >
                                    {/* Thumbnail Image */}
                                    <View style={styles.thumbnailContainer}>
                                        {primaryImage ? (
                                            <Image source={{ uri: primaryImage }} style={styles.thumbnail} />
                                        ) : (
                                            <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.background }]}>
                                                <AppIcon library="Feather" name="image" size={20} color={colors.textSecondary} />
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.cardContent}>
                                        <View style={styles.cardHeader}>
                                            <Text style={[styles.serviceTitle, { color: colors.text }]} numberOfLines={1}>{service.name}</Text>
                                            <Text style={[styles.servicePrice, { color: colors.primary }]}>${service.price}</Text>
                                        </View>
                                        <Text style={[styles.serviceDesc, { color: colors.textSecondary }]} numberOfLines={2}>{service.description}</Text>
                                        <View style={styles.cardFooter}>
                                            <View style={styles.durationRow}>
                                                <AppIcon library="Feather" name="clock" size={12} color={colors.textSecondary} />
                                                <Text style={[styles.durationText, { color: colors.textSecondary }]}>{service.duration_minutes}m</Text>
                                            </View>
                                            <View style={styles.actionRow}>
                                                <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(service)}>
                                                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>Edit</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(service.id)}>
                                                    <Text style={[styles.actionText, { color: colors.destructive }]}>Delete</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    )}
                </ScrollView>
            )}

            <AddEditModalService
                modalVisible={modalVisible}
                editingService={editingService}
                closeModal={() => setModalVisible(false)}
                handleSave={handleSave}
                showAlert={showAlert}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },
    listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
    
    serviceCard: { flexDirection: 'row', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 16, gap: 12 },
    thumbnailContainer: { width: 80, height: 80, borderRadius: 10, overflow: 'hidden' },
    thumbnail: { width: '100%', height: '100%' },
    thumbnailPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    
    cardContent: { flex: 1, justifyContent: 'space-between' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    serviceTitle: { fontSize: 16, fontWeight: '800', flex: 1, paddingRight: 8 },
    servicePrice: { fontSize: 16, fontWeight: '900' },
    serviceDesc: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
    
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    durationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    durationText: { fontSize: 12, fontWeight: '600' },
    actionRow: { flexDirection: 'row', gap: 16 },
    actionBtn: { paddingVertical: 4 },
    actionText: { fontSize: 13, fontWeight: '700' },

    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
    emptyBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24, marginTop: 16 },
    emptyBtnText: { fontSize: 15, fontWeight: '800' },
});

export default ManageServicesScreen;