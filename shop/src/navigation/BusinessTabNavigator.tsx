import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { BusinessProfileScreen } from '@screens/app/BusinessProfileScreen';
import BusinessStoreScreen from '@screens/app/BusinessStoreScreen';
import { MerchantSupportScreen } from '@screens/app/MerchantSupportScreen';
import { ManageStaffScreen } from '@screens/app/ManageStaffScreen';
import { PayoutsEarningsScreen } from '@screens/app/PayoutsEarningsScreen';
import SettingsScreen from '@screens/app/SettingsScreen';
import { TaxInvoiceScreen } from '@screens/app/TaxInvoiceScreen';
import { ChatRoomScreen } from '@screens/chat/ChatRoomScreen';
import { MessageTimelineScreen } from '@screens/chat/MessageTimelineScreen';
import CreatePromoScreen from '@screens/products/CreatePromoScreen';
import ManagePromotionsScreen from '@screens/products/ManagePromotionsScreen';
import ManageBookingsScreen from '@screens/shop/BookingManagementScreen';
import BusinessDashboardScreen from '@screens/shop/BusinessDashboardScreen';
import ManageProductsScreen from '@screens/shop/ManageProductsScreen';
import ManageProfileScreen from '@screens/shop/ManageProfileScreen';
import ManageReviewsScreen from '@screens/shop/ManageReviewsScreen';
import ManageServicesScreen from '@screens/shop/ManageServicesScreen';
import React from 'react';

import type { BusinessTabParamList } from './types';

const Tabs = createBottomTabNavigator<BusinessTabParamList>();
const Stack = createNativeStackNavigator();

const iconByRoute: Record<keyof BusinessTabParamList, string> = {
    DashboardTab: 'grid',
    CalendarTab: 'calendar',
    MessagesTab: 'message-square',
    StoreTab: 'shopping-bag',
    ProfileTab: 'user',
};

const TabBarIcon = ({ routeName, color }: { routeName: keyof BusinessTabParamList; color: string }) => {
    return <AppIcon library="Feather" name={iconByRoute[routeName]} size={20} color={color} />;
};

const DashboardStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BusinessDashboardHome" component={BusinessDashboardScreen} />
    </Stack.Navigator>
);

const CalendarStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BookingManagementHome" component={ManageBookingsScreen} />
    </Stack.Navigator>
);

const MessagesStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MessageTimelineHome" component={MessageTimelineScreen} />
        <Stack.Screen name="ChatRoomInTab" component={ChatRoomScreen} />
    </Stack.Navigator>
);

const StoreStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BusinessStoreHome" component={BusinessStoreScreen} />
        <Stack.Screen name="ManageProductsInTab" component={ManageProductsScreen} />
        <Stack.Screen name="ManageServicesInTab" component={ManageServicesScreen} />
        <Stack.Screen name="ManagePromotionsInTab" component={ManagePromotionsScreen} />
        <Stack.Screen name="CreatePromoInTab" component={CreatePromoScreen} />
        <Stack.Screen name="ManageProfileInTab" component={ManageProfileScreen} />
        <Stack.Screen name="ManageReviewsInTab" component={ManageReviewsScreen} />
    </Stack.Navigator>
);

const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BusinessProfileHome" component={BusinessProfileScreen} />
        <Stack.Screen name="SettingsInTab" component={SettingsScreen} />
        <Stack.Screen name="MerchantSupportInTab" component={MerchantSupportScreen} />
        <Stack.Screen name="ManageStaffInTab" component={ManageStaffScreen} />
        <Stack.Screen name="PayoutsInTab" component={PayoutsEarningsScreen} />
        <Stack.Screen name="TaxInvoiceInTab" component={TaxInvoiceScreen} />
    </Stack.Navigator>
);

const BusinessTabNavigator = () => {
    const { colors } = useTheme();

    return (
        <Tabs.Navigator
            initialRouteName="DashboardTab"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 72,
                    paddingTop: 8,
                    paddingBottom: 10,
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
                // eslint-disable-next-line react/no-unstable-nested-components
                tabBarIcon: ({ color }) => <TabBarIcon routeName={route.name as keyof BusinessTabParamList} color={color} />,
            })}
        >
            <Tabs.Screen name="DashboardTab" component={DashboardStack} options={{ title: 'Dashboard' }} />
            <Tabs.Screen name="CalendarTab" component={CalendarStack} options={{ title: 'Calendar' }} />
            <Tabs.Screen name="MessagesTab" component={MessagesStack} options={{ title: 'Messages' }} />
            <Tabs.Screen name="StoreTab" component={StoreStack} options={{ title: 'Store' }} />
            <Tabs.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
        </Tabs.Navigator>
    );
};

export default BusinessTabNavigator;
