import { AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
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

// Palette de couleurs extraite de la maquette
const theme = {
    primary: '#ED8936', // Couleur orange
    black: '#1A202C',
    gray: '#718096',
    lightGray: '#E2E8F0',
    background: '#FFFFFF',
};

type OnboardingDiscoverProps = {
    onNext?: () => void;
    onSkip?: () => void;
};

const OnboardingDiscover = ({
    onNext,
    onSkip,
}: OnboardingDiscoverProps) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            
            {/* 1. Image Hero avec bords arrondis */}
            <View style={styles.imageWrapper}>
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
                <View style={styles.iconContainer}>
                    <AppIcon 
                        library="Ionicons" 
                        name="flash" 
                        size={22} 
                        color="#FFFFFF" 
                    />
                </View>

                {/* Titres */}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleBlack}>Discover African</Text>
                    <Text style={styles.titleOrange}>Businesses Nearby</Text>
                </View>

                {/* Sous-titre */}
                <Text style={styles.subtitle}>
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
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    imageWrapper: {
        height: height * 0.48, // Prend environ la moitié de l'écran
        width: '100%',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
        backgroundColor: '#F7FAFC', // Fond de secours pendant le chargement
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
        backgroundColor: theme.black,
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
        color: theme.black,
        fontFamily: 'System', // À remplacer par votre police (ex: 'Inter-Black')
    },
    titleOrange: {
        fontSize: 28,
        fontWeight: '800',
        color: theme.primary,
        textDecorationLine: 'underline',
        fontFamily: 'System',
    },
    subtitle: {
        fontSize: 15,
        color: theme.gray,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    footer: {
        width: '100%',
        paddingVertical: 40, // Espace pour l'indicateur d'accueil iOS
    },
    nextButton: {
        backgroundColor: theme.primary,
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
        color: '#4A5568',
        fontWeight: '600',
    },
});

export default OnboardingDiscover;