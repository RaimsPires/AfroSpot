import { AuthProvider } from '@contexts/AuthContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import AppNavigator from '@navigation/AppNavigator';
import { StyleSheet, View } from "react-native";

function AppContent() {

    return (
        <View style={styles.container}>
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
