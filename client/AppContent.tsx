import AppNavigator from "@navigation/AppNavigator";
import OnboardingScreen from "@screens/onboarding/OnboardingScreen";
import SplashScreen from "@screens/onboarding/SplashScreen";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";

const AppRoot = () => {
    const { isAuthenticated } = useAuth();

    return <AppNavigator isAuthenticated={isAuthenticated} />;
};

const AppBootstrap = () => {
    const [phase, setPhase] = useState<"splash" | "onboarding" | "app">("splash");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPhase("onboarding");
        }, 1800);

        return () => clearTimeout(timeout);
    }, []);

    if (phase === "splash") {
        return <SplashScreen />;
    }

    if (phase === "onboarding") {
        return <OnboardingScreen onComplete={() => setPhase("app")} />;
    }

    return <AppRoot />;
};

function AppContent() {
    return (
        <View style={styles.container}>
            <AuthProvider>
                <ThemeProvider>
                    <AppBootstrap />
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
