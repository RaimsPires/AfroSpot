import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

// Import your existing UI components and theme
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import ExploreScreen from '@screens/app/ExploreScreen';
import HomeScreen from '@screens/app/HomeScreen';
import CommunityFeedScreen from '@screens/feeds/CommunityFeedScreen';
import InteractiveMapScreen from '@screens/map/InteractiveMapScreen';
import NotificationsScreen from '@screens/notification/NotificationsScreen';


const Tab = createBottomTabNavigator();

// Tab Icon Component - memoized to prevent recreation
const TabIcon = React.memo(({ routeName, color }: { routeName: string; color: string }) => {
    let iconName = '';
    let hasBadge = false;
    let badgeCount = 0;

    switch (routeName) {
        case 'Home':
            iconName = 'home';
            break;
        case 'Explore':
            iconName = 'compass';
            break;
        case 'Feed':
            iconName = 'play-circle';
            break;
        case 'Map':
            iconName = 'map';
            break;
        case 'Alerts':
            iconName = 'bell';
            hasBadge = true;
            badgeCount = 9;
            break;
        default:
            iconName = 'circle';
    }

    return (
        <View style={styles.iconContainer}>
            <AppIcon library="Feather" name={iconName} size={24} color={color} />
            {hasBadge && badgeCount > 0 && (
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                        {badgeCount > 99 ? '99+' : badgeCount}
                    </Text>
                </View>
            )}
        </View>
    );
});

const MainTabNavigator = () => {
    const { colors } = useTheme();

    const screenOptions = useMemo(
        () => ({
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: {
                backgroundColor: colors.background,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                height: Platform.OS === 'ios' ? 85 : 70,
                paddingBottom: Platform.OS === 'ios' ? 25 : 10,
                paddingTop: 10,
                elevation: 0,
                shadowOpacity: 0,
            },
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600' as const,
                marginTop: 2,
            },
        }),
        [colors]
    );

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                ...screenOptions,
                // eslint-disable-next-line react/no-unstable-nested-components
                tabBarIcon: ({ color }) => <TabIcon routeName={route.name} color={color} />,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Explore" component={ExploreScreen} />
            <Tab.Screen name="Feed" component={CommunityFeedScreen} />
            <Tab.Screen name="Map" component={InteractiveMapScreen} />
            <Tab.Screen name="Alerts" component={NotificationsScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32, // Gives the icon a consistent hit box
    },
    badgeContainer: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#EF4444', // Red badge color
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF', // White border to separate it from the icon
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
        textAlign: 'center',
    },
});

export default MainTabNavigator;