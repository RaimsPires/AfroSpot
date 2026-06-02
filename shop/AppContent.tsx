import { AuthProvider } from '@contexts/AuthContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { TranslationProvider } from '@contexts/TranslationContext';
import AppNavigator from '@navigation/AppNavigator';
import { StatusBar, StyleSheet, useColorScheme, View } from "react-native";

function AppContent() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <TranslationProvider>
            <View style={styles.container}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <AuthProvider>
                    <ThemeProvider>
                        <AppNavigator />
                    </ThemeProvider>
                </AuthProvider>
            </View>
        </TranslationProvider>
    );
}


export default AppContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
