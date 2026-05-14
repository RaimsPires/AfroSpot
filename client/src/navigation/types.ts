import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AppStackParamList = {
    MainTabs: undefined;
    Main: undefined;
    Home: undefined;
    Explore: undefined;
    Favorites: undefined;
    Search: {
        initialCategory?: string;
        initialQuery?: string;
        initialView?: 'list' | 'map';
    } | undefined;
    Profile: undefined;
    EditProfile: undefined;
    Chat: {
        businessId?: string;
        businessName?: string;
    } | undefined;
    InteractiveMap: {
        businessId?: string;
        initialCategory?: string;
    } | undefined;
    Notifications: undefined;
    Booking: {
        businessId?: string;
        businessName?: string;
        serviceType?: string;
    } | undefined;
    ProductMarketplace: {
        businessId?: string;
        categoryId?: string;
        productId?: string;
    } | undefined;
    Reviews: {
        businessId?: string;
        source?: string;
    } | undefined;
    BusinessDetail: {
        businessId?: string;
        businessName?: string;
        source?: string;
    } | undefined;
    BusinessListing: {
        category?: string;
        collection?: string;
        title?: string;
    } | undefined;
    RestaurantDetail: {
        restaurantId?: string;
        restaurantName?: string;
    } | undefined;
    CommunityFeed: undefined;
    CheckoutPayment: {
        bookingId?: string;
        businessId?: string;
    } | undefined;
    Onboarding: undefined;
    OnboardingDiscover: undefined;
    OnboardingBookServices: undefined;
    CommunityOnboarding: undefined;
    Saved: undefined;
    BookingHistory: undefined;
    OrdersHistory: undefined;
    Cart: undefined;
    DeliveryAddresses: undefined;
    BookingDetail: {
        bookingId?: string;
        bookingStatus?: string;
    } | undefined;
};

export type AppStackNavigationProp<RouteName extends keyof AppStackParamList = keyof AppStackParamList> =
    NativeStackNavigationProp<AppStackParamList, RouteName>;

export type AppStackRouteProp<RouteName extends keyof AppStackParamList> = RouteProp<
    AppStackParamList,
    RouteName
>;