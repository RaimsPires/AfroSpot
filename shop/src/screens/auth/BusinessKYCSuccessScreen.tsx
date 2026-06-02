import { AppIcon, Button } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList, RootStackParamList } from '@navigation/types';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'BusinessKYCSuccess'>;

export const BusinessKYCSuccessScreen = ({ navigation }: Props) => {
    const { colors, isDark } = useTheme();

    const handleContinue = () => {
        const parent = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
        parent?.replace('AppFlow');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={styles.successContainer}>
                <Text style={[styles.stepText, { color: colors.primary }]}>Step 3 of 3</Text>
                <View style={[styles.successCircle, { backgroundColor: colors.success, shadowColor: colors.success }]}> 
                    <AppIcon library="Feather" name="check" size={48} color={colors.textInverse} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>Business registered</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your business profile was submitted successfully. You can now start managing your spot on AfroSpot.</Text>

                <Button title="Continue to Shop" onPress={handleContinue} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    stepText: { fontSize: 13, fontWeight: '800', marginBottom: 16 },
    successCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        elevation: 5,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    title: { fontSize: 32, fontWeight: '900', marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 15, lineHeight: 24, textAlign: 'center', marginBottom: 32 },
});

export default BusinessKYCSuccessScreen;
