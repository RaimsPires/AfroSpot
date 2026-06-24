import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { promoService, PromoTargetItem } from '@services/promotionService';

type Props = {
    initialSelected: PromoTargetItem[];
    onClose: () => void;
    onConfirm: (selected: PromoTargetItem[]) => void;
};

const ItemsSelectionBottomSheet: React.FC<Props> = ({ initialSelected, onClose, onConfirm }) => {
    const { colors } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<PromoTargetItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Track selected items internally until user presses "Confirm"
    const [selectedItems, setSelectedItems] = useState<PromoTargetItem[]>(initialSelected);

    // Fetch items when search query changes
    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const data = await promoService.searchItems(searchQuery);
                setResults(data);
            } catch (error) {
                console.error("Failed to fetch items", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Simple debounce: wait 300ms after user stops typing
        const timeoutId = setTimeout(() => {
            fetchItems();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const toggleSelection = (item: PromoTargetItem) => {
        const isSelected = selectedItems.some(i => i.id === item.id && i.type === item.type);
        if (isSelected) {
            setSelectedItems(prev => prev.filter(i => !(i.id === item.id && i.type === item.type)));
        } else {
            setSelectedItems(prev => [...prev, item]);
        }
    };

    const renderItem = ({ item }: { item: PromoTargetItem }) => {
        const isSelected = selectedItems.some(i => i.id === item.id && i.type === item.type);

        return (
            <TouchableOpacity 
                style={[styles.itemRow, { borderBottomColor: colors.border }]} 
                onPress={() => toggleSelection(item)}
            >
                <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} style={styles.itemImage} />
                
                <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                
                {/* 🚀 Updated Section with AppIcon */}
                <View style={styles.typeRow}>
                    <AppIcon 
                        library="Feather" 
                        name={item.type === 'product' ? 'box' : 'scissors'} 
                        size={14} 
                        color={colors.textSecondary} 
                    />
                    <Text style={[styles.itemType, { color: colors.textSecondary }]}>
                        {item.type === 'product' ? ' Product' : ' Service'}
                    </Text>
                </View>
            </View>

                {/* Checkbox indicator */}
                <View style={[
                    styles.checkbox, 
                    { borderColor: isSelected ? colors.primary : colors.border, backgroundColor: isSelected ? colors.primary : 'transparent' }
                ]}>
                    {isSelected && <AppIcon library="Feather" name="check" size={14} color="#FFF" />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.sheet, { backgroundColor: colors.background }]}>
                
                <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                    <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                        <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Select Items</Text>
                    <TouchableOpacity onPress={() => onConfirm(selectedItems)} style={styles.iconBtn}>
                        <Text style={[styles.confirmText, { color: colors.primary }]}>Done</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
                    <AppIcon library="Feather" name="search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search products or services..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {isLoading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
                ) : (
                    <FlatList
                        data={results}
                        keyExtractor={item => `${item.type}-${item.id}`}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textSecondary }]}>No items found.</Text>}
                    />
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default ItemsSelectionBottomSheet;

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    sheet: { height: '80%', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 16, fontWeight: '800' },
    iconBtn: { padding: 4 },
    confirmText: { fontSize: 16, fontWeight: '800' },
    
    searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 16, paddingHorizontal: 12, height: 44, borderRadius: 12, gap: 8 },
    searchInput: { flex: 1, fontSize: 15 },
    
    listContent: { paddingHorizontal: 16, paddingBottom: 40 },
    itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
    itemImage: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    typeRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4 // This adds a small space between the icon and the text
    },
    itemType: { 
        fontSize: 12, 
        fontWeight: '600' 
    },
    
    checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14 }
});