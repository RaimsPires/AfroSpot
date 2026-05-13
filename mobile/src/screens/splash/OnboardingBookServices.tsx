import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
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
    primary: '#ED8936',       // Orange
    primaryLight: '#FFF5EB',  // Orange très clair pour le fond du badge
    black: '#1A202C',
    gray: '#4A5568',          // Gris légèrement plus foncé pour la lisibilité
    lightGray: '#E2E8F0',
    background: '#FFFFFF',
    white: '#FFFFFF',
};

const OnboardingBookServices = () => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            
            {/* 1. Image Hero avec bords arrondis et badges superposés */}
            <View style={styles.imageWrapper}>
                <Image 
                    // Remplacez par votre image locale ex: require('../../assets/images/braids-model.png')
                    source={{ uri: 'https://images.unsplash.com/photo-1615802525792-7f722e039f37?q=80&w=1000&auto=format&fit=crop' }} 
                    style={styles.image}
                    resizeMode="cover"
                />
                
                {/* Badges flottants sur l'image */}
                <View style={styles.floatingBadgesContainer}>
                    <View style={styles.floatingBadge}>
                        <AppIcon library="AntDesign" name="star" size={16} color="#ECC94B" />
                        <Text style={styles.floatingBadgeText}>Top Rated Stylists</Text>
                    </View>
                    <View style={[styles.floatingBadge, { marginTop: 8 }]}>
                        <AppIcon library="Feather" name="scissors" size={16} color={theme.primary} />
                        <Text style={styles.floatingBadgeText}>Verified Barbers</Text>
                    </View>
                </View>
            </View>

            {/* 2. Contenu Textuel et Actions */}
            <View style={styles.contentContainer}>
                
                {/* Tag "Premium Services" */}
                <View style={styles.premiumTag}>
                    <AppIcon library="Ionicons" name="sparkles-outline" size={16} color={theme.primary} />
                    <Text style={styles.premiumTagText}>Premium Services</Text>
                </View>

                {/* Titre Principal */}
                <Text style={styles.title}>
                    Perfect Braids &{'\n'}Sharp Fades.
                </Text>

                {/* Sous-titre */}
                <Text style={styles.subtitle}>
                    Book expert stylists and barbers who specialize in Afro-textured hair. Your confidence starts here.
                </Text>

                {/* Pagination (Point 2 actif) */}
                <View style={styles.paginationContainer}>
                    <View style={styles.dot} />
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>

                {/* Boutons d'action */}
                <View style={styles.footer}>
                    <AppButton 
                        title="Continue" 
                        rightIcon="chevron-right" 
                        iconLibrary="Feather"
                        onPress={() => console.log('Continue pressed')} 
                        style={styles.nextButton}
                    />
                    
                    <TouchableOpacity 
                        style={styles.skipButton}
                        activeOpacity={0.7}
                        onPress={() => console.log('Skip pressed')}
                    >
                        <Text style={styles.skipText}>Skip to explore</Text>
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
    // --- Section Image ---
    imageWrapper: {
        height: height * 0.50, // L'image descend un peu plus bas que le premier écran
        width: '100%',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
        backgroundColor: '#E2E8F0',
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
        backgroundColor: theme.white,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    floatingBadgeText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.black,
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
        backgroundColor: theme.primaryLight,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginBottom: 16,
    },
    premiumTagText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.primary,
        marginLeft: 6,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: theme.black,
        lineHeight: 40,
        marginBottom: 16,
        fontFamily: 'System', // À remplacer par votre police si nécessaire
    },
    subtitle: {
        fontSize: 16,
        color: theme.gray,
        lineHeight: 24,
        paddingRight: 10,
    },
    
    // --- Section Pagination et Footer ---
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 24,
        marginBottom: 'auto',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FEEBC8', // Orange très pâle
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        backgroundColor: theme.primary,
    },
    footer: {
        width: '100%',
        paddingBottom: 40,
    },
    nextButton: {
        backgroundColor: theme.primary,
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
        color: theme.gray,
        fontWeight: '600',
    },
});

export default OnboardingBookServices;