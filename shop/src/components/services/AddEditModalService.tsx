import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { ServiceData } from '@services/serviceService';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { ImageLibraryOptions, ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';

interface SelectedFile { uri: string; type?: string; fileName?: string; }

interface AddEditModalServiceProps {
    modalVisible: boolean;
    closeModal: () => void;
    editingService: ServiceData | null;
    handleSave: (data: FormData) => Promise<void>;
    showAlert: (config: any) => void;
}

const AddEditModalService: React.FC<AddEditModalServiceProps> = ({ modalVisible, closeModal, editingService, handleSave, showAlert }) => {
    const { colors } = useTheme()
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [buffer, setBuffer] = useState('');
    
    const [primaryImage, setPrimaryImage] = useState<SelectedFile | null>(null);
    const [galleryImages, setGalleryImages] = useState<SelectedFile[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editingService && modalVisible) {
            setName(editingService.name);
            setDescription(editingService.description || '');
            setPrice(editingService.price);
            setDuration(editingService.duration_minutes.toString());
            setBuffer(editingService.buffer_minutes.toString());
            
            const existingPrimary = editingService.images?.find(img => img.is_primary);
            setPrimaryImage(existingPrimary ? { uri: existingPrimary.image } : null);
            setGalleryImages([]); 
        } else if (modalVisible) {
            setName(''); setDescription(''); setPrice(''); setDuration(''); setBuffer('0');
            setPrimaryImage(null); setGalleryImages([]);
        }
    }, [editingService, modalVisible]);

 const pickImage = async (type: 'primary' | 'gallery') => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo' as const,
            quality: 1,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                Alert.alert("Error", response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                const formattedFile = {
                    uri: asset.uri!,
                    type: asset.type || 'image/jpeg',
                    fileName: asset.fileName || 'upload.jpg'
                };

                if (type === 'primary') {
                    setPrimaryImage(formattedFile);
                } else {
                    if (galleryImages.length >= 10) {
                        Alert.alert("Limit Reached", "You can only add up to 10 gallery images.");
                        return;
                    }
                    setGalleryImages(prev => [...prev, formattedFile]);
                }
            }
        });
    };

    const removeGalleryItem = (index: number) => setGalleryImages(prev => prev.filter((_, i) => i !== index));

    const onSavePress = async () => {
        if (!name || !price || !duration) return;
        
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('duration_minutes', duration);
            formData.append('buffer_minutes', buffer || '0');

            if (primaryImage && !primaryImage.uri.startsWith('http')) {
                formData.append('primary_image', { uri: primaryImage.uri, type: primaryImage.type || 'image/jpeg', name: primaryImage.fileName || 'primary.jpg' } as any);
            }

            if (!editingService && galleryImages.length > 0) {
                galleryImages.forEach((img, index) => {
                    formData.append('gallery_images', { uri: img.uri, type: img.type || 'image/jpeg', name: `gallery_${index}.jpg` } as any);
                });
            }

            await handleSave(formData);
            closeModal();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{editingService ? 'Edit Service' : 'Add New Service'}</Text>
                        <TouchableOpacity onPress={closeModal} style={styles.closeBtn} disabled={isSaving}>
                            <AppIcon library="Feather" name="x" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
                        {/* Primary Image */}
                        <View style={styles.imageUploadSection}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRIMARY COVER IMAGE</Text>
                            {primaryImage ? (
                                <View style={styles.previewContainer}>
                                    <Image source={{ uri: primaryImage.uri }} style={styles.imagePreview} />
                                    <TouchableOpacity style={[styles.changeImageBtn, { backgroundColor: colors.destructive }]} onPress={() => setPrimaryImage(null)}>
                                        <AppIcon library="Feather" name="x" size={16} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => pickImage('primary')}>
                                    <AppIcon library="Feather" name="image" size={28} color={colors.textSecondary} />
                                    <Text style={[styles.uploadText, { color: colors.textSecondary }]}>Add Cover Image</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Gallery Images (Create Only) */}
                        {!editingService && (
                            <View style={styles.gallerySection}>
                                <View style={styles.galleryHeader}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>GALLERY ({galleryImages.length}/10)</Text>
                                    <Text style={[styles.helperText, { color: colors.textMuted }]}>Long press to drag & reorder</Text>
                                </View>
                                <View style={styles.galleryTrack}>
                                    <TouchableOpacity style={[styles.addGalleryBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => pickImage('gallery')}>
                                        <AppIcon library="Feather" name="plus" size={24} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                    <View style={{ flex: 1 }}>
                                        <DraggableFlatList
                                            horizontal
                                            data={galleryImages}
                                            onDragEnd={({ data }) => setGalleryImages(data)}
                                            keyExtractor={(item, index) => `gallery-${index}`}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ paddingLeft: 12 }}
                                            renderItem={({ item, drag, isActive, getIndex }) => (
                                                <ScaleDecorator>
                                                    <TouchableOpacity onLongPress={drag} disabled={isActive} style={[styles.galleryItemContainer, { borderColor: colors.border }, isActive && { transform: [{ scale: 1.05 }] }]}>
                                                        <Image source={{ uri: item.uri }} style={styles.galleryImage} />
                                                        <TouchableOpacity style={[styles.removeGalleryBtn, { backgroundColor: colors.destructive }]} onPress={() => removeGalleryItem(getIndex()!)}>
                                                            <AppIcon library="Feather" name="x" size={12} color="#FFF" />
                                                        </TouchableOpacity>
                                                    </TouchableOpacity>
                                                </ScaleDecorator>
                                            )}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>SERVICE NAME</Text>
                            <TextInput style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={name} onChangeText={setName} />
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRICE</Text>
                                <TextInput style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DURATION (MINS)</Text>
                                <TextInput style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={duration} onChangeText={setDuration} keyboardType="number-pad" />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>BUFFER TIME (MINS)</Text>
                            <TextInput style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={buffer} onChangeText={setBuffer} keyboardType="number-pad" placeholder="Time needed between clients" placeholderTextColor={colors.textSecondary} />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DESCRIPTION</Text>
                            <TextInput style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={description} onChangeText={setDescription} multiline textAlignVertical="top" />
                        </View>

                    </ScrollView>

                    <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                        <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={closeModal} disabled={isSaving}>
                            <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.saveActionBtn, { backgroundColor: colors.primary, opacity: isSaving ? 0.7 : 1 }]} onPress={onSavePress} disabled={isSaving || !name || !price || !duration}>
                            {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.saveActionBtnText, { color: colors.textInverse }]}>Save Service</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default AddEditModalService;

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '95%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    closeBtn: { padding: 4 },
    modalScroll: { paddingHorizontal: 20, paddingBottom: 20 },
    inputGroup: { marginBottom: 20 },
    rowInputs: { flexDirection: 'row' },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
    helperText: { fontSize: 10, fontWeight: '500', marginBottom: 8 },
    inputField: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    textArea: { height: 100, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15 },
    imageUploadSection: { marginBottom: 24 },
    uploadBox: { height: 120, borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    uploadText: { marginTop: 8, fontSize: 13, fontWeight: '600' },
    previewContainer: { position: 'relative', height: 120, width: '100%' },
    imagePreview: { width: '100%', height: '100%', borderRadius: 12 },
    changeImageBtn: { position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
    gallerySection: { marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    galleryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    galleryTrack: { flexDirection: 'row', alignItems: 'center', height: 80 },
    addGalleryBtn: { width: 80, height: 80, borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    galleryItemContainer: { width: 80, height: 80, marginRight: 10, borderRadius: 12, borderWidth: 1, position: 'relative' },
    galleryImage: { width: '100%', height: '100%', borderRadius: 11 },
    removeGalleryBtn: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFF' },
    modalFooter: { flexDirection: 'row', padding: 20, paddingBottom: 34, borderTopWidth: 1, gap: 12 },
    cancelBtn: { flex: 1, height: 52, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    cancelBtnText: { fontSize: 15, fontWeight: '700' },
    saveActionBtn: { flex: 1.5, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    saveActionBtnText: { fontSize: 15, fontWeight: '700' },
});