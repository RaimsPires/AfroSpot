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

type OnboardingDiscoverProps = {
    onNext?: () => void;
    onSkip?: () => void;
};

const OnboardingDiscoverScreen = ({
    onNext,
    onSkip,
}: OnboardingDiscoverProps) => {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }] }>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            
            {/* 1. Image Hero avec bords arrondis */}
            <View style={[styles.imageWrapper, { backgroundColor: colors.surface }] }>
                <Image 
                    // Remplacez par votre image locale ex: require('../../assets/images/discover-hero.png')
                    source={{ uri: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1000&auto=format&fit=crop' }} 
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            {/* 2. Contenu Textuel et Actions */}
            <View style={styles.contentContainer}>
                
                {/* Icône Éclair */}
                <View style={[styles.iconContainer, { backgroundColor: colors.text }] }>
                    <AppIcon 
                        library="Ionicons" 
                        name="flash" 
                        size={22} 
                        color={colors.background}
                    />
                </View>

                {/* Titres */}
                <View style={styles.titleContainer}>
                    <Text style={[styles.titleBlack, { color: colors.text }]}>Discover African</Text>
                    <Text style={[styles.titleOrange, { color: colors.primary }]}>Businesses Nearby</Text>
                </View>

                {/* Sous-titre */}
                <Text style={[styles.subtitle, { color: colors.textSecondary }] }>
                    Support local Afro-owned restaurants, salons, and shops in your city with ease.
                </Text>

                {/* Boutons d'action */}
                <View style={styles.footer}>
                    {/* Utilisation de votre composant AppButton */}
                    <AppButton 
                        title="Next" 
                        rightIcon="arrow-right" 
                        iconLibrary="Feather"
                        onPress={onNext ?? (() => console.log('Next pressed'))}
                        style={styles.nextButton}
                    />
                    
                    <TouchableOpacity 
                        style={styles.skipButton}
                        activeOpacity={0.7}
                        onPress={onSkip }
                    >
                        <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
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
    imageWrapper: {
        height: height * 0.48, // Prend environ la moitié de l'écran
        width: '100%',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 30,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    titleBlack: {
        fontSize: 28,
        fontWeight: '800',
        fontFamily: 'System', // À remplacer par votre police (ex: 'Inter-Black')
    },
    titleOrange: {
        fontSize: 28,
        fontWeight: '800',
        textDecorationLine: 'underline',
        fontFamily: 'System',
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    footer: {
        width: '100%',
        paddingVertical: 40, // Espace pour l'indicateur d'accueil iOS
    },
    nextButton: {
        borderRadius: 12,
        height: 56, // Légèrement plus grand pour correspondre à la maquette
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

export default OnboardingDiscoverScreen;