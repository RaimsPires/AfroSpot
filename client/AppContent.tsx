import { AuthProvider } from "@contexts/AuthContext";
import { ThemeProvider } from "@contexts/ThemeContext";
import { TranslationProvider } from "@contexts/TranslationContext";
import AppNavigator from "@navigation/AppNavigator";
import React from "react";
import { StyleSheet, View } from "react-native";

function AppContent() {
    return (
        <View style={styles.container}>
            <TranslationProvider>
                <AuthProvider>
                    <ThemeProvider>
                        <AppNavigator />
                    </ThemeProvider>
                </AuthProvider>
            </TranslationProvider>
        </View>
    );
}

export default AppContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
