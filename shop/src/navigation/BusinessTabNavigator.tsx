import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ManageBookingsScreen from '@screens/shop/BookingManagementScreen';
import BusinessDashboardScreen from '@screens/shop/BusinessDashboardScreen';

import React from 'react';

import SettingsScreen from '@screens/app/SettingsScreen';
import MessagesStack from './stack/MessagesStack';
import type { BusinessTabParamList } from './types';

const Tabs = createBottomTabNavigator<BusinessTabParamList>();

const iconByRoute: Record<keyof BusinessTabParamList, string> = {
    DashboardTab: 'grid',
    CalendarTab: 'calendar',
    MessagesTab: 'message-square',
    Settings: 'settings',
};

const TabBarIcon = ({ routeName, color }: { routeName: keyof BusinessTabParamList; color: string }) => {
    return <AppIcon library="Feather" name={iconByRoute[routeName]} size={20} color={color} />;
};


const BusinessTabNavigator = () => {
    const { colors } = useTheme();

    return (
        <Tabs.Navigator
            initialRouteName="DashboardTab"
            screenOptions={({ route }) => ({
                headerShown: false,
                // tabBarShowLabel: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 72,
                    // paddingTop: 8,
                    // paddingBottom: 10,
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
                // eslint-disable-next-line react/no-unstable-nested-components
                tabBarIcon: ({ color }) => <TabBarIcon routeName={route.name as keyof BusinessTabParamList} color={color} />,
            })}
        >
            <Tabs.Screen name="DashboardTab" component={BusinessDashboardScreen} options={{ title: 'Dashboard' }} />
            <Tabs.Screen name="CalendarTab" component={ManageBookingsScreen} options={{ title: 'Calendar' }} />
            <Tabs.Screen name="MessagesTab" component={MessagesStack} options={{ title: 'Messages' }} />
            <Tabs.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Tabs.Navigator>
    );
};

export default BusinessTabNavigator;
