import { ThemeProvider } from '@contexts/ThemeContext';
import AppNavigator from '@navigation/AppNavigator';
import { StyleSheet, View } from "react-native";

function AppContent() {

    return (
        <View style={styles.container}>
            <ThemeProvider>
                <AppNavigator />
            </ThemeProvider>
        </View>
    );
}


export default AppContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
