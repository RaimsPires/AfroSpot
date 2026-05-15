import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const INTERESTS = [
    { id: 'hair', label: 'Haircare & Salons', icon: 'scissors' },
    { id: 'food', label: 'Food & Restaurants', icon: 'coffee' },
    { id: 'fashion', label: 'Fashion & Apparel', icon: 'shopping-bag' },
    { id: 'events', label: 'Events & Nightlife', icon: 'calendar' },
    { id: 'art', label: 'Art & Culture', icon: 'image' },
    { id: 'wellness', label: 'Health & Wellness', icon: 'heart' },
];

export const UserOnboardingScreen = () => {
    const { colors } = useTheme();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleInterest = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>What are you looking for?</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Select your interests to personalize your feed and recommendations.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.grid}>
                {INTERESTS.map(item => {
                    const isActive = selected.includes(item.id);
                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => toggleInterest(item.id)}
                            style={[styles.card, { backgroundColor: isActive ? colors.primary : colors.surface, borderColor: isActive ? colors.primary : colors.border }]}
                        >
                            <AppIcon library="Feather" name={item.icon} size={28} color={isActive ? '#FFF' : colors.text} style={{ marginBottom: 12 }} />
                            <Text style={[styles.cardLabel, { color: isActive ? '#FFF' : colors.text }]}>{item.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.continueBtn, { backgroundColor: selected.length > 0 ? colors.primary : colors.surface }]}>
                    <Text style={[styles.continueText, { color: selected.length > 0 ? '#FFF' : colors.textSecondary }]}>Continue to App</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 24, paddingTop: 40 },
    title: { fontSize: 28, fontWeight: '900', marginBottom: 8 },
    subtitle: { fontSize: 15, lineHeight: 22 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 16 },
    card: { width: '47%', padding: 20, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center', aspectRatio: 1 },
    cardLabel: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
    footer: { padding: 24, borderTopWidth: 1 },
    continueBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    continueText: { fontSize: 16, fontWeight: '800' },
});