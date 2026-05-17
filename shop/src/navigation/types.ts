import type { BuyerOrderTab, OrderLifecycleStatus } from '@type/commerce';

export type AuthStackParamList = {
    Auth: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    VerifyResetCode: { contactInfo: string };
    ResetPassword: { contactInfo: string };
    PasswordResetSuccess: undefined;
    UserOnboarding: undefined;
    BusinessKYC: undefined;
    OrderFulfillment: undefined;
};

export type BusinessTabParamList = {
    DashboardTab: undefined;
    CalendarTab: undefined;
    MessagesTab: undefined;
    Settings: undefined;
};

export type AppStackParamList = {
    MainTabs: undefined;
    ProfileStack: undefined;
    MarketplaceProducts: undefined;
    ProductDetail: { productId: string };
    Cart: undefined;
    Checkout: undefined;
    OrderSuccess: { orderId: string };
    BuyerOrders: { initialTab?: BuyerOrderTab } | undefined;
    BuyerOrderDetail: { orderId: string };
    OrderTracking: { orderId: string };
    BusinessNotifications: undefined;
    BusinessNotificationsScreen: undefined;
    ManageStaff: undefined;
    MerchantSupport: undefined;
    PayoutsEarnings: undefined;
    Report: undefined;
    StoreStack: undefined;
    StoreAnalytics: undefined;
    TaxInvoice: undefined;
    BusinessKYC: undefined;
    OrderFulfillment: { initialStatus?: OrderLifecycleStatus } | undefined;
    SellerOrderDetail: { orderId: string };
    UserOnboarding: undefined;
    MessageTimeline: undefined;
    ChatRoom: undefined;
    CreateEvent: undefined;
    EventDetail: undefined;
    EventStats: undefined;
    OrganizerEventList: undefined;
    TicketScanner: undefined;
    VendorBooking: undefined;
    EventsDiscovery: undefined;
    MyTickets: undefined;
    TicketSelection: undefined;
    CreateFeed: undefined;
    FeedViewer: undefined;
    FeedInsights: { feed: any };
    StoreFeeds: undefined;
    CreatePromo: undefined;
    ManagePromotions: undefined;
    ManageProducts: undefined;
    ManageProfile: undefined;
    ManageReviews: undefined;
    ManageServices: undefined;
    ClientsList: undefined;
    PersonalInfo: undefined;
    PasswordSecurity: undefined;
    PaymentMethods: undefined;
    HelpCenter: undefined;
    ContactSupport: undefined;
    TermsOfService: undefined;
    PrivacyPolicy: undefined;
};

export type RootStackParamList = {
    AuthFlow: undefined;
    AppFlow: undefined;
};
