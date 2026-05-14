import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';

// --- Mock Data ---
const ORDER_DETAILS = {
    type: 'Service', 
    title: 'Fresh Fade & Lineup',
    provider: 'Kushite Cutz & Styles',
    date: 'Oct 24, 2023 at 10:30 AM',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200',
    subtotal: 35.00,
    tax: 2.50,
    total: 37.50,
    orderId: 'ORD-98237482',
};

const PAYMENT_METHODS = [
    { id: 'card', title: 'Credit / Debit Card', icon: 'credit-card' },
    { id: 'mobile_money', title: 'Mobile Money (M-Pesa, MTN, Airtel)', icon: 'smartphone' },
    { id: 'apple_pay', title: 'Apple Pay / Google Pay', icon: 'cast' }, 
];

const CheckoutPaymentScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'CheckoutPayment'>>();
    const { colors, isDark } = useTheme();
    
    // UI Flow State: 'checkout' | 'processing' | 'success' | 'failure'
    const [viewState, setViewState] = useState<'checkout' | 'processing' | 'success' | 'failure'>('checkout');
    const [selectedMethod, setSelectedMethod] = useState('card');

    // Form States - Card
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // Form States - Mobile Money
    const [momoNumber, setMomoNumber] = useState('');

    // Simulated Payment Function
    const handlePayment = () => {
        setViewState('processing');
        
        // Simulate a network request (2 seconds)
        setTimeout(() => {
            // 80% chance of success for demonstration
            if (Math.random() > 0.2) {
                setViewState('success');
            } else {
                setViewState('failure');
            }
        }, 2000);
    };

    // --- RENDER: Processing State ---
    if (viewState === 'processing') {
        return (
            <SafeAreaView style={[styles.statusContainer, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 20 }} />
                <Text style={[styles.statusTitle, { color: colors.text }]}>Processing Payment...</Text>
                <Text style={[styles.statusSub, { color: colors.textSecondary }]}>Please do not close this screen.</Text>
            </SafeAreaView>
        );
    }

    // --- RENDER: Success State ---
    if (viewState === 'success') {
        return (
            <SafeAreaView style={[styles.statusContainer, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <View style={styles.successCircle}>
                    <AppIcon library="Feather" name="check" size={40} color="#FFF" />
                </View>
                <Text style={[styles.statusTitle, { color: colors.text }]}>Payment Successful!</Text>
                <Text style={[styles.statusSub, { color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 40 }]}>
                    Your payment of ${ORDER_DETAILS.total.toFixed(2)} was received. Your booking is confirmed.
                </Text>
                
                <View style={[styles.receiptBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Order ID</Text>
                    <Text style={[styles.receiptValue, { color: colors.text }]}>{ORDER_DETAILS.orderId}</Text>
                </View>

                <View style={styles.statusActions}>
                    <AppButton title="View Receipt" onPress={() => {}} />
                    <TouchableOpacity style={styles.textBtn} onPress={() => setViewState('checkout')}>
                        <Text style={[styles.textBtnLabel, { color: colors.primary }]}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // --- RENDER: Failure State ---
    if (viewState === 'failure') {
        return (
            <SafeAreaView style={[styles.statusContainer, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <View style={styles.failureCircle}>
                    <AppIcon library="Feather" name="x" size={40} color="#FFF" />
                </View>
                <Text style={[styles.statusTitle, { color: colors.text }]}>Payment Failed</Text>
                <Text style={[styles.statusSub, { color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 40 }]}>
                    We couldn't process your payment. Please check your details or try a different payment method.
                </Text>

                <View style={styles.statusActions}>
                    <AppButton title="Try Again" onPress={() => setViewState('checkout')} />
                </View>
            </SafeAreaView>
        );
    }

    // --- RENDER: Checkout Form (Default) ---
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Checkout</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Order Summary Card */}
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
                    <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.summaryItemRow}>
                            <Image source={{ uri: ORDER_DETAILS.image }} style={styles.summaryImage} />
                            <View style={styles.summaryItemInfo}>
                                <Text style={[styles.itemType, { color: colors.primary }]}>{ORDER_DETAILS.type}</Text>
                                <Text style={[styles.itemTitle, { color: colors.text }]}>{ORDER_DETAILS.title}</Text>
                                <Text style={[styles.itemProvider, { color: colors.textSecondary }]}>{ORDER_DETAILS.provider}</Text>
                                <Text style={[styles.itemDate, { color: colors.textSecondary }]}>{ORDER_DETAILS.date}</Text>
                            </View>
                            <Text style={[styles.itemPrice, { color: colors.text }]}>${ORDER_DETAILS.subtotal.toFixed(2)}</Text>
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <View style={styles.costRow}>
                            <Text style={[styles.costLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                            <Text style={[styles.costValue, { color: colors.text }]}>${ORDER_DETAILS.subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.costRow}>
                            <Text style={[styles.costLabel, { color: colors.textSecondary }]}>Taxes & Fees</Text>
                            <Text style={[styles.costValue, { color: colors.text }]}>${ORDER_DETAILS.tax.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.costRow, { marginTop: 8 }]}>
                            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Due</Text>
                            <Text style={[styles.totalValue, { color: colors.primary }]}>${ORDER_DETAILS.total.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Payment Methods Selection */}
                    <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Payment Method</Text>
                    <View style={styles.methodsContainer}>
                        {PAYMENT_METHODS.map((method) => {
                            const isActive = selectedMethod === method.id;
                            return (
                                <TouchableOpacity
                                    key={method.id}
                                    onPress={() => setSelectedMethod(method.id)}
                                    style={[
                                        styles.methodCard,
                                        {
                                            backgroundColor: isActive ? colors.primary + '10' : colors.surface,
                                            borderColor: isActive ? colors.primary : colors.border
                                        }
                                    ]}
                                >
                                    <View style={styles.methodLeft}>
                                        <AppIcon library="Feather" name={method.icon} size={20} color={isActive ? colors.primary : colors.textSecondary} />
                                        <Text style={[styles.methodTitle, { color: isActive ? colors.primary : colors.text }]}>{method.title}</Text>
                                    </View>
                                    <View style={[
                                        styles.radioCircle,
                                        { borderColor: isActive ? colors.primary : colors.border }
                                    ]}>
                                        {isActive && <View style={[styles.radioFill, { backgroundColor: colors.primary }]} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* DYNAMIC FORMS BASED ON SELECTION */}
                    
                    {/* 1. Credit Card Form */}
                    {selectedMethod === 'card' && (
                        <View style={styles.dynamicForm}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.text }]}>CARDHOLDER NAME</Text>
                                <TextInput
                                    placeholder="John Doe"
                                    placeholderTextColor={colors.textSecondary}
                                    style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                    value={cardName}
                                    onChangeText={setCardName}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.text }]}>CARD NUMBER</Text>
                                <View style={[styles.iconInputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <AppIcon library="Feather" name="credit-card" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="0000 0000 0000 0000"
                                        placeholderTextColor={colors.textSecondary}
                                        keyboardType="number-pad"
                                        style={[styles.iconInputField, { color: colors.text }]}
                                        value={cardNumber}
                                        onChangeText={setCardNumber}
                                        maxLength={19}
                                    />
                                </View>
                            </View>

                            <View style={styles.rowInputs}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                    <Text style={[styles.inputLabel, { color: colors.text }]}>EXPIRY DATE</Text>
                                    <TextInput
                                        placeholder="MM/YY"
                                        placeholderTextColor={colors.textSecondary}
                                        keyboardType="number-pad"
                                        style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                        value={expiry}
                                        onChangeText={setExpiry}
                                        maxLength={5}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={[styles.inputLabel, { color: colors.text }]}>CVV</Text>
                                    <TextInput
                                        placeholder="123"
                                        placeholderTextColor={colors.textSecondary}
                                        keyboardType="number-pad"
                                        secureTextEntry
                                        style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                        value={cvv}
                                        onChangeText={setCvv}
                                        maxLength={4}
                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {/* 2. Mobile Money Form */}
                    {selectedMethod === 'mobile_money' && (
                        <View style={styles.dynamicForm}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.text }]}>MOBILE MONEY NUMBER</Text>
                                <View style={[styles.iconInputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <AppIcon library="Feather" name="phone" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="+234 / +254 / +233"
                                        placeholderTextColor={colors.textSecondary}
                                        keyboardType="phone-pad"
                                        style={[styles.iconInputField, { color: colors.text }]}
                                        value={momoNumber}
                                        onChangeText={setMomoNumber}
                                    />
                                </View>
                            </View>
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                You will receive a prompt on your phone to enter your PIN and authorize this transaction.
                            </Text>
                        </View>
                    )}

                    {/* 3. Apple Pay / Google Pay Form */}
                    {selectedMethod === 'apple_pay' && (
                        <View style={[styles.applePayBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <AppIcon library="Feather" name="smartphone" size={32} color={colors.text} style={{ marginBottom: 12 }} />
                            <Text style={[styles.applePayText, { color: colors.text }]}>
                                You will be redirected to your device's native payment sheet to complete this purchase securely.
                            </Text>
                        </View>
                    )}

                    {/* Security Badge */}
                    <View style={styles.securityBadge}>
                        <AppIcon library="Feather" name="lock" size={14} color={colors.textSecondary} />
                        <Text style={[styles.securityText, { color: colors.textSecondary }]}>Payments are secure and encrypted</Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Sticky Bottom Action */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <AppButton
                    title={
                        selectedMethod === 'apple_pay' 
                        ? `Pay with Device Wallet` 
                        : `Pay $${ORDER_DETAILS.total.toFixed(2)}`
                    }
                    leftIcon='lock'
                    onPress={handlePayment}
                />
            </View>
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },

    // Summary Card
    summaryCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 8 },
    summaryItemRow: { flexDirection: 'row', marginBottom: 16 },
    summaryImage: { width: 64, height: 64, borderRadius: 12, marginRight: 12 },
    summaryItemInfo: { flex: 1, justifyContent: 'center' },
    itemType: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
    itemTitle: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
    itemProvider: { fontSize: 12, marginBottom: 4 },
    itemDate: { fontSize: 12, fontStyle: 'italic' },
    itemPrice: { fontSize: 16, fontWeight: '800' },

    divider: { height: 1, width: '100%', marginBottom: 16 },
    costRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    costLabel: { fontSize: 14 },
    costValue: { fontSize: 14, fontWeight: '600' },
    totalLabel: { fontSize: 16, fontWeight: '800' },
    totalValue: { fontSize: 18, fontWeight: '900' },

    // Payment Methods
    methodsContainer: { gap: 12, marginBottom: 24 },
    methodCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, borderWidth: 1 },
    methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    methodTitle: { fontSize: 15, fontWeight: '700' },
    radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    radioFill: { width: 10, height: 10, borderRadius: 5 },

    // Dynamic Forms
    dynamicForm: { marginTop: 8 },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
    inputField: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    iconInputWrap: { flexDirection: 'row', alignItems: 'center', height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16 },
    inputIcon: { marginRight: 10 },
    iconInputField: { flex: 1, fontSize: 15 },
    rowInputs: { flexDirection: 'row' },
    infoText: { fontSize: 13, lineHeight: 20, marginTop: 4, fontStyle: 'italic' },
    
    applePayBox: { alignItems: 'center', justifyContent: 'center', padding: 24, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed' },
    applePayText: { fontSize: 14, textAlign: 'center', lineHeight: 22, fontWeight: '500' },

    // Security
    securityBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, marginBottom: 32, gap: 6 },
    securityText: { fontSize: 12, fontWeight: '500' },

    // Footer
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1 },

    // --- Status Screens (Processing, Success, Failure) ---
    statusContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    statusTitle: { fontSize: 24, fontWeight: '900', marginBottom: 12 },
    statusSub: { fontSize: 15, lineHeight: 22, marginBottom: 32 },
    
    successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center', marginBottom: 24, elevation: 5, shadowColor: '#22C55E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
    failureCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', marginBottom: 24, elevation: 5, shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
    
    receiptBox: { width: '100%', padding: 20, borderRadius: 16, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    receiptLabel: { fontSize: 14, fontWeight: '600' },
    receiptValue: { fontSize: 14, fontWeight: '800' },

    statusActions: { width: '100%', gap: 16 },
    textBtn: { paddingVertical: 12, alignItems: 'center' },
    textBtnLabel: { fontSize: 16, fontWeight: '700' }
});

export default CheckoutPaymentScreen;