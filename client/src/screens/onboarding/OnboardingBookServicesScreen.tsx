import { AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import {
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const {  height } = Dimensions.get('window');

type OnboardingBookServicesProps = {
    onNext?: () => void;
    onSkip?: () => void;
};

const OnboardingBookServicesScreen = ({
    onNext,
    onSkip,
}: OnboardingBookServicesProps) => {
    const { colors, isDark } = useTheme();
    const secondaryBadgeStyle = [styles.floatingBadge, { marginTop: 8, backgroundColor: colors.surface, borderColor: colors.border }];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }] }>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            
            {/* 1. Image Hero avec bords arrondis et badges superposés */}
            <View style={[styles.imageWrapper, { backgroundColor: colors.surface }] }>
                <Image 
                    // Remplacez par votre image locale ex: require('../../assets/images/braids-model.png')
                    source={{ uri: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop' }} 
                    style={styles.image}
                    resizeMode="cover"
                />
                
                {/* Badges flottants sur l'image */}
                <View style={styles.floatingBadgesContainer}>
                    <View style={[styles.floatingBadge, { backgroundColor: colors.surface, borderColor: colors.border }] }>
                        <AppIcon library="AntDesign" name="star" size={16} color="#ECC94B" />
                        <Text style={[styles.floatingBadgeText, { color: colors.text }]}>Top Rated Stylists</Text>
                    </View>
                    <View style={secondaryBadgeStyle}>
                        <AppIcon library="Feather" name="scissors" size={16} color={colors.primary} />
                        <Text style={[styles.floatingBadgeText, { color: colors.text }]}>Verified Barbers</Text>
                    </View>
                </View>
            </View>

            {/* 2. Contenu Textuel et Actions */}
            <View style={styles.contentContainer}>
                
                {/* Tag "Premium Services" */}
                <View style={[styles.premiumTag, { backgroundColor: `${colors.primary}22` }] }>
                    <AppIcon library="Ionicons" name="sparkles-outline" size={16} color={colors.primary} />
                    <Text style={[styles.premiumTagText, { color: colors.primary }]}>Premium Services</Text>
                </View>

                {/* Titre Principal */}
                <Text style={[styles.title, { color: colors.text }] }>
                    Perfect Braids &{'\n'}Sharp Fades.
                </Text>

                {/* Sous-titre */}
                <Text style={[styles.subtitle, { color: colors.textSecondary }] }>
                    Book expert stylists and barbers who specialize in Afro-textured hair. Your confidence starts here.
                </Text>

                {/* Boutons d'action */}
                <View style={styles.footer}>
                    <AppButton 
                        title="Continue" 
                        rightIcon="chevron-right" 
                        iconLibrary="Feather"
                        onPress={onNext ?? (() => console.log('Continue pressed'))}
                        style={styles.nextButton}
                    />
                    
                    <TouchableOpacity 
                        style={styles.skipButton}
                        activeOpacity={0.7}
                        onPress={onSkip ?? (() => console.log('Skip pressed'))}
                    >
                        <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip to explore</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // --- Section Image ---
    imageWrapper: {
        height: height * 0.50, // L'image descend un peu plus bas que le premier écran
        width: '100%',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    floatingBadgesContainer: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        alignItems: 'flex-start',
    },
    floatingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    floatingBadgeText: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 8,
    },
    
    // --- Section Contenu ---
    contentContainer: {
        flex: 1,
        alignItems: 'flex-start', // Aligné à gauche sur cet écran
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    premiumTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginBottom: 16,
    },
    premiumTagText: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 6,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        lineHeight: 40,
        marginBottom: 16,
        fontFamily: 'System', // À remplacer par votre police si nécessaire
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        paddingRight: 10,
    },
    
    footer: {
        width: '100%',
        paddingVertical: 40,
    },
    nextButton: {
        borderRadius: 12,
        height: 56,
    },
    skipButton: {
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 10,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OnboardingBookServicesScreen;