import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CommunityOnboarding from '@screens/onboarding/CommunityOnboardingScreen';
import OnboardingBookService from '@screens/onboarding/OnboardingBookServicesScreen';
import OnboardingDiscoverScreen from '@screens/onboarding/OnboardingDiscoverScreen';
import SplashScreen from '@screens/onboarding/SplashScreen';

type OnboardingStackParamList = {
    OnboardingSplash: undefined;
    OnboardingDiscover: undefined;
    OnboardingBookServices: undefined;
    CommunityOnboarding: undefined;
};

type OnboardingNavigatorProps = {
    onComplete: () => void;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator = ({ onComplete }: OnboardingNavigatorProps) => {
    return (
        <Stack.Navigator initialRouteName="OnboardingSplash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OnboardingSplash">
                {({ navigation }) => (
                    <SplashScreen onNext={() => navigation.navigate('OnboardingDiscover')} />
                )}
            </Stack.Screen>

            <Stack.Screen name="OnboardingDiscover">
                {({ navigation }) => (
                    <OnboardingDiscoverScreen
                        onNext={() => navigation.navigate('OnboardingBookServices')}
                        onSkip={onComplete}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen name="OnboardingBookServices">
                {({ navigation }) => (
                    <OnboardingBookService
                        onNext={() => navigation.navigate('CommunityOnboarding')}
                        onSkip={onComplete}
                    />
                )}
            </Stack.Screen>

            <Stack.Screen name="CommunityOnboarding">
                {() => (
                    <CommunityOnboarding
                        onFinish={onComplete}
                        onSkip={onComplete}
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default OnboardingNavigator;