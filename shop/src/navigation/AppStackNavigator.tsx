import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrderFulfillmentScreen } from '@screens/app/OrderFulfillmentScreen';
import { BusinessKYCScreen } from '@screens/auth/BusinessKYCScreen';
import { ChatRoomScreen } from '@screens/chat/ChatRoomScreen';
import { MessageTimelineScreen } from '@screens/chat/MessageTimelineScreen';
import { CreateEventScreen } from '@screens/event/CreateEventScreen';
import { EventDetailScreen } from '@screens/event/EventDetailScreen';
import { EventStatsScreen } from '@screens/event/EventStatsScreen';
import { OrganizerEventListScreen } from '@screens/event/OrganizerEventListScreen';
import { TicketScannerScreen } from '@screens/event/TicketScannerScreen';
import { VendorBookingScreen } from '@screens/event/VendorBookingScreen';
import { EventsDiscoveryScreen } from '@screens/event/client/EventsDiscoveryScreen';
import { MyTicketsScreen } from '@screens/event/client/MyTicketsScreen';
import { TicketSelectionScreen } from '@screens/event/client/TicketSelectionScreen';
import { CreateFeedScreen } from '@screens/feeds/CreateFeedScreen';
import { FeedViewerScreen } from '@screens/feeds/FeedViewerScreen';
import { StoreFeedsScreen } from '@screens/feeds/StoreFeedsScreen';
import { UserOnboardingScreen } from '@screens/onboarding/UserOnboardingScreen';
import CreatePromoScreen from '@screens/products/CreatePromoScreen';
import ManagePromotionsScreen from '@screens/products/ManagePromotionsScreen';
import ManageProductsScreen from '@screens/shop/ManageProductsScreen';
import ManageProfileScreen from '@screens/shop/ManageProfileScreen';
import ManageReviewsScreen from '@screens/shop/ManageReviewsScreen';
import ManageServicesScreen from '@screens/shop/ManageServicesScreen';
import React from 'react';

import { BusinessNotificationsScreen } from '@screens/app/BusinessNotificationsScreen';
import { ClientsListScreen } from '@screens/app/ClientsListScreen';
import { ManageStaffScreen } from '@screens/app/ManageStaffScreen';
import { MerchantSupportScreen } from '@screens/app/MerchantSupportScreen';
import { PayoutsEarningsScreen } from '@screens/app/PayoutsEarningsScreen';
import ReportScreen from '@screens/app/ReportScreen';
import { StoreAnalyticsScreen } from '@screens/app/StoreAnalyticsScreen';
import { TaxInvoiceScreen } from '@screens/app/TaxInvoiceScreen';
import BusinessTabNavigator from './BusinessTabNavigator';
import ProfileStack from './stack/ProfileStack';
import StoreStack from './stack/StoreStack';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainTabs">
            <Stack.Screen name="MainTabs" component={BusinessTabNavigator} />
            <Stack.Screen name="ProfileStack" component={ProfileStack} />

            <Stack.Screen name="BusinessNotifications" component={BusinessNotificationsScreen} />
            <Stack.Screen name="ManageStaff" component={ManageStaffScreen} />
            <Stack.Screen name="MerchantSupport" component={MerchantSupportScreen} />
            <Stack.Screen name="PayoutsEarnings" component={PayoutsEarningsScreen} />
            <Stack.Screen name="Report" component={ReportScreen} />
            <Stack.Screen name="StoreStack" component={StoreStack} />
            <Stack.Screen name="StoreAnalytics" component={StoreAnalyticsScreen} />
            <Stack.Screen name="TaxInvoice" component={TaxInvoiceScreen} />

            <Stack.Screen name="BusinessKYC" component={BusinessKYCScreen} />
            <Stack.Screen name="OrderFulfillment" component={OrderFulfillmentScreen} />
            <Stack.Screen name="UserOnboarding" component={UserOnboardingScreen} />

            <Stack.Screen name="MessageTimeline" component={MessageTimelineScreen} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />

            <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="EventStats" component={EventStatsScreen} />
            <Stack.Screen name="OrganizerEventList" component={OrganizerEventListScreen} />
            <Stack.Screen name="TicketScanner" component={TicketScannerScreen} />
            <Stack.Screen name="VendorBooking" component={VendorBookingScreen} />
            <Stack.Screen name="EventsDiscovery" component={EventsDiscoveryScreen} />
            <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
            <Stack.Screen name="TicketSelection" component={TicketSelectionScreen} />

            <Stack.Screen name="CreateFeed" component={CreateFeedScreen} />
            <Stack.Screen name="FeedViewer" component={FeedViewerScreen} />
            <Stack.Screen name="StoreFeeds" component={StoreFeedsScreen} />

            <Stack.Screen name="CreatePromo" component={CreatePromoScreen} />
            <Stack.Screen name="ManagePromotions" component={ManagePromotionsScreen} />

            <Stack.Screen name="ManageProducts" component={ManageProductsScreen} />
            <Stack.Screen name="ManageProfile" component={ManageProfileScreen} />
            <Stack.Screen name="ManageReviews" component={ManageReviewsScreen} />
            <Stack.Screen name="ManageServices" component={ManageServicesScreen} />

            <Stack.Screen name="ClientsList" component={ClientsListScreen} />
        </Stack.Navigator>
    );
};

export default AppStackNavigator;
