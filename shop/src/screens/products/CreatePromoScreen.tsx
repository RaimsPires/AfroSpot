import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppAlert, AppIcon, Button } from '@components/ui';
import GlobalActivityOverlay from '@components/ui/GlobalActivityOverlay';
import { useTheme } from '@contexts/ThemeContext';
import BasicInfoForm from '@screens/promo_code/BasicInfoForm';
import DiscountConfiguration from '@screens/promo_code/DiscountConfiguration';
import ItemsSelectionBottomSheet from '@screens/promo_code/ItemsSelectionBottomSheet';
import LivePreviewCard from '@screens/promo_code/LivePreviewCard';
import TargetAndScheduling from '@screens/promo_code/TargetAndScheduling';
import { promoService, PromoTargetItem, Promotion } from '@services/promotionService';
import DateFormatter from '@utils/dateFormatter';



const CreatePromoScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();

    const promotionId = route?.params?.id;
    const isEditing = !!promotionId;
    const [editingPromo, setEditingPromo] = useState<null | Promotion>(null)


    // Form States
    const [title, setTitle] = useState(editingPromo?.title ?? '');
    const [promoCode, setPromoCode] = useState(editingPromo?.code ?? '');
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(editingPromo?.discount_type ?? 'percentage');
    const [discountValue, setDiscountValue] = useState(editingPromo?.discount_value?.toString() ?? '');
    const [appliesTo, setAppliesTo] = useState(editingPromo?.target ?? 'All Services');
    const [startDate, setStartDate] = useState(editingPromo?.start_date ? new Date(editingPromo?.start_date) : new Date());
    const [endDate, setEndDate] = useState(editingPromo?.end_date ? new Date(editingPromo?.end_date) : new Date());

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [selectedSpecificItems, setSelectedSpecificItems] = useState<PromoTargetItem[]>([]);
    const [isItemSheetVisible, setIsItemSheetVisible] = useState(false);
    const [isFetchingPromotion, setIsFetchingPromotion] = useState(false);



    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean;
        title: string;
        message: string;
        variant: 'success' | 'error' | 'info';
    }>({
        visible: false,
        title: '',
        message: '',
        variant: 'info'
    });

    const handlePublish = async () => {
        try {
            setIsSubmitting(true);

            // Frontend to Backend Mapping
            const targetMapping: Record<string, string> = {
                'All Services': 'all_services',
                'All Products': 'all_products',
                'Specific Items': 'specific_items'
            };

            const payload = {
                title,
                code: promoCode,
                discount_type: discountType,
                discount_value: parseFloat(discountValue),
                target: targetMapping[appliesTo] || appliesTo, // Handle if it's already a key
                start_date: DateFormatter.toBackend(startDate),
                end_date: DateFormatter.toBackend(endDate),
                products: appliesTo === 'Specific Items' ? selectedSpecificItems.filter(i => i.type === 'product').map(i => i.id) : [],
                services: appliesTo === 'Specific Items' ? selectedSpecificItems.filter(i => i.type === 'service').map(i => i.id) : [],
            };

            if (isEditing) {
                // EDIT MODE
                await promoService.updatePromo(promotionId, payload);
                setAlertConfig({
                    visible: true,
                    title: "Success",
                    message: "Promotion updated successfully!",
                    variant: 'success'
                });
            } else {
                // CREATE MODE
                await promoService.createPromo(payload);
                setAlertConfig({
                    visible: true,
                    title: "Success",
                    message: "Promotion created successfully!",
                    variant: 'success'
                });
            }
        } catch (error: any) {
            console.error("Submission Error:", error.response?.data);
            setAlertConfig({
                visible: true,
                title: "Error",
                message: error.response?.data?.message || "Operation failed. Please try again.",
                variant: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchPromotionDetails = async () => {
            try {

                if (promotionId) {
                    setIsFetchingPromotion(true)
                    const response = await promoService.getPromotion(promotionId);
                    console.log(response);

                    setEditingPromo(response)
                }
            } finally {
                setIsFetchingPromotion(false)
            }

        }
        fetchPromotionDetails()
    }, [promotionId])

    useEffect(() => {
        if (editingPromo) {
            setTitle(editingPromo.title);
            setPromoCode(editingPromo.code);
            setDiscountType(editingPromo.discount_type);
            setDiscountValue(editingPromo.discount_value.toString());
            setAppliesTo(editingPromo.target);
            setStartDate(new Date(editingPromo.start_date));
            setEndDate(new Date(editingPromo.end_date));
            if (editingPromo.items_details) {
                setSelectedSpecificItems(editingPromo.items_details);
            }
        }
    }, [editingPromo]);



    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <AppAlert
                visible={alertConfig.visible}
                variant={alertConfig.variant}
                title={alertConfig.title}
                message={alertConfig.message}

                // Primary Action
                actionLabel={alertConfig.variant === 'error' ? "Retry" : "OK"}
                onAction={() => {
                    if (alertConfig.variant === 'error') {
                        setAlertConfig(prev => ({ ...prev, visible: false }));
                        handlePublish(); // Retry the API call
                    } else {
                        setAlertConfig(prev => ({ ...prev, visible: false }));
                        navigation.goBack();
                    }
                }}

                // Secondary Action for errors
                secondaryLabel={alertConfig.variant === 'error' ? "Cancel" : undefined}
                onSecondaryAction={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
            />
            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{isEditing ? 'Edit Promotion' : 'Create Promotion'}</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* 2. Live Preview Card */}
                    <LivePreviewCard
                        discountType={discountType}
                        title={title}
                        appliesTo={appliesTo}
                        discountValue={discountValue}
                        setDiscountValue={(discound) => {
                            setDiscountValue(discound)
                        }}
                        promoCode={promoCode}
                    />

                    {/* 3. Basic Info Form */}
                    <BasicInfoForm
                        setEndDate={(date) => {
                            setEndDate(date)
                        }}
                        setStartDate={(date) => {
                            setStartDate(date)
                        }}
                        endDate={endDate}
                        startDate={startDate}
                        title={title}
                        setTitle={setTitle}
                        promoCode={promoCode}
                        setPromoCode={setPromoCode}
                    />

                    {/* 4. Discount Configuration */}
                    <DiscountConfiguration
                        discountType={discountType}
                        setDiscountType={(discountType) => {
                            setDiscountType(discountType)
                        }}
                        setDiscountValue={(dicountValue) => {
                            setDiscountValue(dicountValue)
                        }}
                        discountValue={discountValue}
                    />

                    {/* 5. Target & Scheduling */}
                    <TargetAndScheduling
                        appliesTo={appliesTo}
                        setAppliesTo={setAppliesTo}
                        onOpenSpecificItems={() => setIsItemSheetVisible(true)}
                        selectedCount={selectedSpecificItems.length}
                    />
                    <Modal visible={isItemSheetVisible} transparent animationType="slide">
                        <ItemsSelectionBottomSheet
                            initialSelected={selectedSpecificItems}
                            onClose={() => setIsItemSheetVisible(false)}
                            onConfirm={(items) => {
                                setSelectedSpecificItems(items);
                                setIsItemSheetVisible(false);
                            }}
                        />
                    </Modal>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* 6. Bottom Sticky Publish Button */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <Button
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    onPress={handlePublish}
                    leftIcon='check'
                    title={isEditing ? 'Save Changes' : 'Publish Promotion'}
                />
            </View>
            <GlobalActivityOverlay
                visible={isFetchingPromotion}
            />
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
    scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
    // Forms
    formSection: { marginBottom: 24 },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
    inputField: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    // Footer
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1 },
    publishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16, gap: 10 },
    publishBtnText: { fontSize: 16, fontWeight: '800' },
});

export default CreatePromoScreen;