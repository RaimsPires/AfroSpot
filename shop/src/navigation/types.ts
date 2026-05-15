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
    StoreTab: undefined;
    ProfileTab: undefined;
};

export type AppStackParamList = {
    MainTabs: undefined;
    BusinessNotifications: undefined;
    ManageStaff: undefined;
    MerchantSupport: undefined;
    PayoutsEarnings: undefined;
    Report: undefined;
    Settings: undefined;
    StoreAnalytics: undefined;
    TaxInvoice: undefined;
    BusinessKYC: undefined;
    OrderFulfillment: undefined;
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
    StoreFeeds: undefined;
    CreatePromo: undefined;
    ManagePromotions: undefined;
    ManageProducts: undefined;
    ManageProfile: undefined;
    ManageReviews: undefined;
    ManageServices: undefined;
};

export type RootStackParamList = {
    AuthFlow: undefined;
    AppFlow: undefined;
};
