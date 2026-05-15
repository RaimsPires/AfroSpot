import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

export const CreateEventScreen = () => {
    const { colors, isDark } = useTheme();

    // Basic Info
    const [isPaidEvent, setIsPaidEvent] = useState(true);
    const [hasVendorSpots, setHasVendorSpots] = useState(true);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity><AppIcon library="Feather" name="x" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Create Event</Text>
                <TouchableOpacity><Text style={[styles.saveText, { color: colors.primary }]}>Publish</Text></TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Section: Poster */}
                    <TouchableOpacity style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="image" size={32} color={colors.textSecondary} />
                        <Text style={[styles.uploadText, { color: colors.textSecondary }]}>Upload Event Poster</Text>
                    </TouchableOpacity>

                    {/* Section: Basic Details */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Details</Text>
                        <TextInput
                            placeholder="Event Title"
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        />
                        <TextInput
                            placeholder="Description"
                            placeholderTextColor={colors.textSecondary}
                            multiline
                            style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        />
                    </View>

                    {/* Section: Tickets */}
                    <View style={styles.section}>
                        <View style={styles.rowBetween}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ticketing</Text>
                            <View style={styles.row}>
                                <Text style={{ color: colors.textSecondary, marginRight: 8 }}>{isPaidEvent ? 'Paid' : 'Free'}</Text>
                                <Switch value={isPaidEvent} onValueChange={setIsPaidEvent} />
                            </View>
                        </View>

                        {isPaidEvent && (
                            <View style={[styles.variantCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Text style={[styles.variantLabel, { color: colors.text }]}>General Admission</Text>
                                <View style={styles.row}>
                                    <TextInput placeholder="Price" style={[styles.smallInput, { borderColor: colors.border, color: colors.text }]} keyboardType="numeric" />
                                    <TextInput placeholder="Qty" style={[styles.smallInput, { borderColor: colors.border, color: colors.text }]} keyboardType="numeric" />
                                </View>
                                <TouchableOpacity style={styles.addVariantBtn}>
                                    <AppIcon library="Feather" name="plus" size={14} color={colors.primary} />
                                    <Text style={{ color: colors.primary, fontWeight: '700', marginLeft: 4 }}>Add Ticket Tier</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Section: Vendor Stalls */}
                    <View style={styles.section}>
                        <View style={styles.rowBetween}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Vendor Stalls</Text>
                            <Switch value={hasVendorSpots} onValueChange={setHasVendorSpots} />
                        </View>

                        {hasVendorSpots && (
                            <View style={[styles.variantCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <TextInput placeholder="Stall Type (e.g. Food Stall)" style={[styles.input, { borderColor: colors.border, color: colors.text }]} />
                                <View style={styles.row}>
                                    <TextInput placeholder="Price" style={[styles.smallInput, { borderColor: colors.border, color: colors.text }]} keyboardType="numeric" />
                                    <TextInput placeholder="Total Spots" style={[styles.smallInput, { borderColor: colors.border, color: colors.text }]} keyboardType="numeric" />
                                </View>
                                <TouchableOpacity style={styles.addVariantBtn}>
                                    <AppIcon library="Feather" name="plus" size={14} color={colors.primary} />
                                    <Text style={{ color: colors.primary, fontWeight: '700', marginLeft: 4 }}>Add Stall Type</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    saveText: { fontWeight: '800', fontSize: 16 },
    scrollContent: { padding: 20 },
    uploadBox: { height: 180, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    uploadText: { marginTop: 8, fontWeight: '600' },
    section: { marginBottom: 32 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
    input: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, marginBottom: 12 },
    textArea: { height: 100, borderRadius: 12, borderWidth: 1, padding: 16, textAlignVertical: 'top' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    row: { flexDirection: 'row', alignItems: 'center' },
    variantCard: { padding: 16, borderRadius: 16, borderWidth: 1 },
    variantLabel: { fontWeight: '700', marginBottom: 12 },
    smallInput: { flex: 1, height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginHorizontal: 4 },
    addVariantBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
});