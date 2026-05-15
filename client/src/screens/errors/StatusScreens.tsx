import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Reusable Layout for all Empty/Error States ---

type StateLayoutProps = {
    icon: string;
    iconColor: string;
    iconBg: string;
    title: string;
    description: string;
    primaryActionLabel: string;
    onPrimaryAction: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
};

const StateLayout = ({
    icon,
    iconColor,
    iconBg,
    title,
    description,
    primaryActionLabel,
    onPrimaryAction,
    secondaryActionLabel,
    onSecondaryAction,
}: StateLayoutProps) => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={styles.content}>
                <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
                    <AppIcon library="Feather" name={icon} size={48} color={iconColor} />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>

                <View style={styles.actions}>
                    <AppButton title={primaryActionLabel} onPress={onPrimaryAction} />

                    {secondaryActionLabel && onSecondaryAction && (
                        <TouchableOpacity style={styles.secondaryBtn} onPress={onSecondaryAction}>
                            <Text style={[styles.secondaryBtnText, { color: colors.textSecondary }]}>
                                {secondaryActionLabel}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

// --- 1. No Businesses Nearby Screen ---

export const NoBusinessesScreen = ({ navigation }: any) => {
    const { colors } = useTheme();

    return (
        <StateLayout
            icon="map"
            iconColor={colors.primary}
            iconBg={colors.primary + '15'} // 15% opacity primary color
            title="No Businesses Nearby"
            description="We couldn't find any AfroSpot businesses in your immediate area. Try expanding your search radius or exploring other neighborhoods."
            primaryActionLabel="Expand Search Radius"
            onPrimaryAction={() => {
                // e.g., navigation.navigate('Map', { expandRadius: true })
            }}
            secondaryActionLabel="Change Location"
            onSecondaryAction={() => { }}
        />
    );
};

// --- 2. Network Error Screen ---

export const NetworkErrorScreen = ({ navigation }: any) => {
    const { colors } = useTheme();

    return (
        <StateLayout
            icon="wifi-off"
            iconColor="#EF4444" // Red color for error
            iconBg="#FEE2E2" // Light red background
            title="Connection Lost"
            description="It looks like you're offline. Please check your internet connection, Wi-Fi, or cellular data and try again."
            primaryActionLabel="Try Again"
            onPrimaryAction={() => {
                // Retry network request logic
            }}
        />
    );
};

// --- 3. Booking Failure Screen ---

export const BookingFailureScreen = ({ navigation }: any) => {
    return (
        <StateLayout
            icon="calendar"
            iconColor="#F59E0B" // Orange/Warning color
            iconBg="#FEF3C7" // Light orange background
            title="Booking Failed"
            description="Unfortunately, the time slot you selected just became unavailable. Please choose another time or professional."
            primaryActionLabel="Choose Another Time"
            onPrimaryAction={() => {
                // navigation.goBack() to booking screen
            }}
            secondaryActionLabel="Cancel"
            onSecondaryAction={() => {
                // navigation.navigate('Home')
            }}
        />
    );
};

// --- 4. Search Not Found Screen ---

export const SearchNotFoundScreen = ({ navigation }: any) => {
    const { colors } = useTheme();

    return (
        <StateLayout
            icon="search"
            iconColor={colors.textSecondary}
            iconBg={colors.surface} // Muted surface color
            title="No Results Found"
            description="We couldn't find anything matching your search terms. Try adjusting your filters or using different keywords."
            primaryActionLabel="Clear Filters"
            onPrimaryAction={() => {
                // Clear filters logic
            }}
            secondaryActionLabel="Browse Categories"
            onSecondaryAction={() => {
                // navigation.navigate('Categories')
            }}
        />
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 40,
    },
    actions: {
        width: '100%',
        gap: 16,
    },
    secondaryBtn: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryBtnText: {
        fontSize: 15,
        fontWeight: '700',
    },
});