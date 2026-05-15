import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

// --- Mock Data ---
const INITIAL_PRODUCTS = [
    {
        id: '1',
        title: 'Adire Silk Scarf',
        description: 'Hand-dyed premium silk scarf with traditional Yoruba Adire patterns.',
        price: '45.00',
        stock: 12,
        image: 'https://images.unsplash.com/photo-1583391733958-d25e07fac0ec?q=80&w=200',
    },
    {
        id: '2',
        title: 'Berbere Spice Blend',
        description: 'Authentic Ethiopian spice mix, perfect for stews and marinades.',
        price: '18.50',
        stock: 45,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=200',
    },
    {
        id: '3',
        title: 'Shea Butter Luxe',
        description: '100% unrefined raw organic shea butter from Ghana.',
        price: '24.00',
        stock: 0, // Out of stock example
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=200',
    },
];

const ManageProductsScreen = () => {
    const { colors, isDark } = useTheme();

    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [productImage, setProductImage] = useState<string | null>(null);

    const openAddModal = () => {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setPrice('');
        setStock('');
        setProductImage(null);
        setModalVisible(true);
    };

    const openEditModal = (product: any) => {
        setEditingId(product.id);
        setTitle(product.title);
        setDescription(product.description);
        setPrice(product.price);
        setStock(product.stock.toString());
        setProductImage(product.image);
        setModalVisible(true);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to remove this product from your store?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setProducts(products.filter(p => p.id !== id))
                },
            ]
        );
    };

    const handleSave = () => {
        if (!title || !price || !stock) {
            Alert.alert('Missing Fields', 'Please fill out the title, price, and stock count.');
            return;
        }

        const newStock = parseInt(stock, 10);
        const finalImage = productImage || 'https://images.unsplash.com/photo-1544413165-388a109a250b?q=80&w=200'; // Fallback image

        if (editingId) {
            setProducts(products.map(p =>
                p.id === editingId ? { id: editingId, title, description, price, stock: newStock, image: finalImage } : p
            ));
        } else {
            const newProduct = {
                id: Date.now().toString(),
                title,
                description,
                price,
                stock: newStock,
                image: finalImage,
            };
            setProducts([newProduct, ...products]);
        }
        setModalVisible(false);
    };

    const getStockColor = (count: number) => {
        if (count === 0) return '#EF4444'; // Red (Out of Stock)
        if (count < 5) return '#F59E0B'; // Orange (Low Stock)
        return '#10B981'; // Green (In Stock)
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Products</Text>
                <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                    <AppIcon library="Feather" name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Products List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {products.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconBg, { backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="package" size={32} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Products Yet</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Add physical or digital products to sell in the AfroSpot marketplace.</Text>
                        <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: colors.primary }]} onPress={openAddModal}>
                            <Text style={styles.emptyBtnText}>Add First Product</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    products.map((product) => (
                        <View key={product.id} style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={styles.cardContentRow}>
                                <Image source={{ uri: product.image }} style={styles.productImage} />
                                <View style={styles.productInfo}>
                                    <Text style={[styles.productTitle, { color: colors.text }]} numberOfLines={1}>{product.title}</Text>
                                    <Text style={[styles.productPrice, { color: colors.primary }]}>${product.price}</Text>

                                    <View style={styles.stockRow}>
                                        <View style={[styles.stockIndicator, { backgroundColor: getStockColor(product.stock) }]} />
                                        <Text style={[styles.stockText, { color: colors.textSecondary }]}>
                                            {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            <View style={styles.actionRow}>
                                <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(product)}>
                                    <AppIcon library="Feather" name="edit-2" size={16} color={colors.textSecondary} />
                                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(product.id)}>
                                    <AppIcon library="Feather" name="trash-2" size={16} color="#EF4444" />
                                    <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Add / Edit Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.background, borderTopColor: colors.border }]}>

                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {editingId ? 'Edit Product' : 'Add New Product'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                                <AppIcon library="Feather" name="x" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>

                            {/* Product Image Upload */}
                            <View style={styles.imageUploadSection}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRODUCT IMAGE</Text>
                                {productImage ? (
                                    <View style={styles.previewContainer}>
                                        <Image source={{ uri: productImage }} style={styles.imagePreview} />
                                        <TouchableOpacity
                                            style={styles.changeImageBtn}
                                            onPress={() => setProductImage(null)}
                                        >
                                            <AppIcon library="Feather" name="x" size={16} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <AppIcon library="Feather" name="upload-cloud" size={28} color={colors.textSecondary} />
                                        <Text style={[styles.uploadText, { color: colors.textSecondary }]}>Tap to upload photo</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRODUCT NAME</Text>
                                <TextInput
                                    style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="e.g. Handmade Woven Basket"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>

                            <View style={styles.rowInputs}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRICE ($)</Text>
                                    <TextInput
                                        style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                        value={price}
                                        onChangeText={setPrice}
                                        placeholder="0.00"
                                        keyboardType="decimal-pad"
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>INVENTORY</Text>
                                    <TextInput
                                        style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                        value={stock}
                                        onChangeText={setStock}
                                        placeholder="Stock count"
                                        keyboardType="number-pad"
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DESCRIPTION (OPTIONAL)</Text>
                                <TextInput
                                    style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Describe your product..."
                                    placeholderTextColor={colors.textSecondary}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>

                        </ScrollView>

                        <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                            <TouchableOpacity
                                style={[styles.cancelBtn, { borderColor: colors.border }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveActionBtn, { backgroundColor: colors.primary }]}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveActionBtnText}>Save Product</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </KeyboardAvoidingView>
            </Modal>

        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },
    addBtn: { padding: 8 },

    // List
    listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },

    productCard: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
    cardContentRow: { flexDirection: 'row', padding: 16 },
    productImage: { width: 80, height: 80, borderRadius: 12, marginRight: 16 },
    productInfo: { flex: 1, justifyContent: 'center' },
    productTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    productPrice: { fontSize: 18, fontWeight: '900', marginBottom: 8 },

    stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    stockIndicator: { width: 8, height: 8, borderRadius: 4 },
    stockText: { fontSize: 13, fontWeight: '600' },

    divider: { height: 1, width: '100%' },

    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingVertical: 12, gap: 20 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    actionText: { fontSize: 13, fontWeight: '700' },

    // Empty State
    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 20 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    emptyBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 },
    emptyBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '95%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    closeBtn: { padding: 4 },
    modalScroll: { paddingHorizontal: 20, paddingBottom: 20 },

    // Inputs
    inputGroup: { marginBottom: 20 },
    rowInputs: { flexDirection: 'row' },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
    inputField: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    textArea: { height: 100, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15 },

    // Image Upload
    imageUploadSection: { marginBottom: 24 },
    uploadBox: { height: 120, borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    uploadText: { marginTop: 8, fontSize: 13, fontWeight: '600' },
    previewContainer: { position: 'relative', height: 120, width: 120 },
    imagePreview: { width: '100%', height: '100%', borderRadius: 12 },
    changeImageBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: '#EF4444', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },

    // Modal Footer
    modalFooter: { flexDirection: 'row', padding: 20, paddingBottom: 34, borderTopWidth: 1, gap: 12 },
    cancelBtn: { flex: 1, height: 52, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    cancelBtnText: { fontSize: 15, fontWeight: '700' },
    saveActionBtn: { flex: 1.5, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    saveActionBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});

export default ManageProductsScreen;