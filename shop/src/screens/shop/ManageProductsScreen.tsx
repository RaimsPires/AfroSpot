import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@contexts/ThemeContext';
import AddEditModalProduct from './products/AddEditModalProduct';
import ProductEmptyState from './products/ProductEmptyState';
import RenderProductItem from './products/RenderProductItem';
import ProductHeader from './products/productHeader';

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

const ManageProductsScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form States


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



    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <ProductHeader 
            openAddModal={openAddModal}
            />

            {/* Products List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {products.length === 0 ? (
                    <ProductEmptyState
                    openAddModal={openAddModal}
                    />
                ) : (
                    products.map((product) => (
                        <RenderProductItem
                            product={product}
                        />
                    ))
                )}
            </ScrollView>

            {/* Add / Edit Modal */}
            <AddEditModalProduct
                modalVisible={modalVisible}
                closeModal={() => {
                    setModalVisible(false)
                }}
            />

        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },




});

export default ManageProductsScreen;