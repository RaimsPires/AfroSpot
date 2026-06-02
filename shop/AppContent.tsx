import { AuthProvider } from '@contexts/AuthContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import AppNavigator from '@navigation/AppNavigator';
import { StatusBar, StyleSheet, useColorScheme, View } from "react-native";

function AppContent() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <AuthProvider>
                <ThemeProvider>
                    <AppNavigator />
                </ThemeProvider>
            </AuthProvider>
        </View>
    );
}


export default AppContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
