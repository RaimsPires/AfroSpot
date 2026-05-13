import { StyleSheet, View } from "react-native";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import MainScreen from "./src/screens/MainScreen";

function AppContent() {

    return (
        <View style={styles.container}>
            <ThemeProvider>
                <MainScreen />
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
