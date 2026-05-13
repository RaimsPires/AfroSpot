import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';

const MainScreen = () => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Theme-Aware Button</Text>

                <AppButton
                    title="Ajouter au panier"
                    leftIcon="shopping-cart"
                    onPress={() => { }}
                />

                <AppButton
                    title="Continuer"
                    rightIcon="arrowright"
                    iconLibrary="AntDesign"
                    variant="outline"
                    onPress={() => { }}
                />
                {/* Solid Primary */}
                <AppButton title="Primary Button" onPress={() => { }} />
                <AppButton
                    variant='ghost'
                    title="Primary Button" onPress={() => { }} />

                {/* Outline Secondary */}
                <AppButton
                    title="Secondary Outline"
                    variant="outline"
                    color="secondary"
                />

                {/* Loading State Pulse */}
                <AppButton
                    title="Delete Account"
                    color="danger"
                    loading={true}
                    loadingType="pulse"
                />
                <AppButton
                    title="Delete Account"
                    color="danger"
                    variant='outline'
                    loading={true}
                    loadingType="indicator"
                />

                {/* Loading State Indicator */}
                <AppButton
                    title="Processing"
                    loading={true}
                    loadingType="indicator"
                />
            </View>
        </SafeAreaView>
    );
};

export default MainScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20, flex: 1, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }
});