import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import ChatScreen from '@screens/app/ChatScreen';
import ProfileScreen from '@screens/app/ProfileScreen';
import SearchScreen from '@screens/app/SearchScreen';
import BookingScreen from '@screens/booking/BookingScreen';
import ProductMarketplaceScreen from '@screens/booking/ProductMarketplaceScreen';
import ReviewsScreen from '@screens/booking/ReviewsScreen';
import BusinessDetailScreen from '@screens/bussiness/BusinessDetailScreen';
import BusinessListingScreen from '@screens/bussiness/BusinessListingScreen';
import RestaurantDetailScreen from '@screens/bussiness/RestaurantDetailScreen';
import CommunityFeedScreen from '@screens/feeds/CommunityFeedScreen';
import MainScreen from '@screens/MainScreen';
import InteractiveMapScreen from '@screens/map/InteractiveMapScreen';
import NotificationsScreen from '@screens/notification/NotificationsScreen';
import CheckoutPaymentScreen from '@screens/payment/CheckoutPaymentScreen';

import CartScreen from '@screens/app/CartScreen';
import DeliveryAddressesScreen from '@screens/app/DeliveryAddressesScreen';
import EditProfileScreen from '@screens/app/EditProfileScreen';
import SavedScreen from '@screens/app/SavedScreen';
import BookingDetailScreen from '@screens/booking/BookingDetailScreen';
import BookingHistoryScreen from '@screens/booking/BookingHistoryScreen';
import OrdersHistoryScreen from '@screens/booking/OrdersHistoryScreen';
import MainTabNavigator from './MainTabNavigator';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="Saved" component={SavedScreen} />
            <Stack.Screen name="Main" component={MainScreen} />
            {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
            {/* <Stack.Screen name="Explore" component={ExploreScreen} /> */}
            {/* <Stack.Screen name="Favorites" component={FavoritesScreen} /> */}
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="InteractiveMap" component={InteractiveMapScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="OrdersHistory" component={OrdersHistoryScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
            <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
            <Stack.Screen name="ProductMarketplace" component={ProductMarketplaceScreen} />
            <Stack.Screen name="Reviews" component={ReviewsScreen} />
            <Stack.Screen name="BusinessDetail" component={BusinessDetailScreen} />
            <Stack.Screen name="BusinessListing" component={BusinessListingScreen} />
            <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
            <Stack.Screen name="CommunityFeed" component={CommunityFeedScreen} />
            <Stack.Screen name="CheckoutPayment" component={CheckoutPaymentScreen} />
            <Stack.Screen name="DeliveryAddresses" component={DeliveryAddressesScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Navigator>
    );
};

export default AppStackNavigator;
