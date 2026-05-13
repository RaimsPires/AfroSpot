import ChatScreen from "@/screens/app/ChatScreen";
import { StyleSheet, View } from "react-native";
import { ThemeProvider } from "./src/contexts/ThemeContext";

function AppContent() {

    return (
        <View style={styles.container}>
            <ThemeProvider>
                <ChatScreen />
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
