import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import BasicInfoForm from '@screens/promo_code/BasicInfoForm';
import DiscountConfiguration from '@screens/promo_code/DiscountConfiguration';
import LivePreviewCard from '@screens/promo_code/LivePreviewCard';
import TargetAndScheduling from '@screens/promo_code/TargetAndScheduling';



const CreatePromoScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();

    const editingPromo = route?.params?.promo;
    const isEditing = !!editingPromo;

    // Form States
    const [title, setTitle] = useState(editingPromo?.title ?? '');
    const [promoCode, setPromoCode] = useState(editingPromo?.code ?? '');
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(editingPromo?.discountType ?? 'percentage');
    const [discountValue, setDiscountValue] = useState(editingPromo?.discountValue?.toString() ?? '');
    const [appliesTo, setAppliesTo] = useState(editingPromo?.target ?? 'All Services');
    const [startDate, setStartDate] = useState(editingPromo?.startDate ?? 'Oct 24, 2023');
    const [endDate, setEndDate] = useState(editingPromo?.endDate ?? 'Oct 31, 2023');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

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
                        setDiscountType={(discountType)=>{
                            setDiscountType(discountType)
                        }}
                        discountValue={discountType}
                        setDiscountValue={(dicountValue)=>{
                            setDiscountValue(dicountValue)
                        }}
                    />

                    {/* 5. Target & Scheduling */}
                    <TargetAndScheduling
                        appliesTo={appliesTo}
                        setAppliesTo={setAppliesTo}
                    />



                </ScrollView>
            </KeyboardAvoidingView>

            {/* 6. Bottom Sticky Publish Button */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.publishBtn, { backgroundColor: colors.primary }]}>
                    <AppIcon library="Feather" name="check" size={20} color={colors.textInverse} />
                    <Text style={[styles.publishBtnText, { color: colors.textInverse }]}>
                        {isEditing ? 'Save Changes' : 'Publish Promotion'}
                    </Text>
                </TouchableOpacity>
            </View>
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


    // Date Scheduling


    // Footer
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1 },
    publishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16, gap: 10 },
    publishBtnText: { fontSize: 16, fontWeight: '800' },
});

export default CreatePromoScreen;