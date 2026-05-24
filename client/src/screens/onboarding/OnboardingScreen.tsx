import type { AppStackNavigationProp } from '@navigation/types';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CommunityOnboarding from './CommunityOnboarding';
import OnboardingBookServices from './OnboardingBookServices';
import OnboardingDiscover from './OnboardingDiscoverScreen';
import SplashScreen from './SplashScreen';

type OnboardingScreenProps = {
    onComplete?: () => void;
    navigation?: AppStackNavigationProp<'Onboarding'>;
};

const OnboardingScreen = ({ onComplete, navigation }: OnboardingScreenProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = 4;

    const handleSkipOrFinish = useCallback(() => {
        onComplete?.();
        navigation?.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    }, [navigation, onComplete]);

    const goToNext = useCallback(() => {
        setCurrentStep((prev) => {
            const next = prev + 1;
            if (next >= totalSteps) {
                handleSkipOrFinish();
                return prev;
            }
            return next;
        });
    }, [handleSkipOrFinish]);

    const screen = useMemo(() => {
        switch (currentStep) {
            case 0:
                return <SplashScreen onNext={goToNext} />;
            case 1:
                return (
                    <OnboardingDiscover
                        onNext={goToNext}
                        onSkip={handleSkipOrFinish}
                    />
                );
            case 2:
                return (
                    <OnboardingBookServices
                        onNext={goToNext}
                        onSkip={handleSkipOrFinish}
                    />
                );
            case 3:
                return (
                    <CommunityOnboarding
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        onFinish={handleSkipOrFinish}
                        onSkip={handleSkipOrFinish}
                    />
                );
            default:
                return <SplashScreen onNext={goToNext} />;
        }
    }, [currentStep, goToNext, handleSkipOrFinish]);

    return (
        <View style={styles.container}>{screen}</View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});

export default OnboardingScreen;