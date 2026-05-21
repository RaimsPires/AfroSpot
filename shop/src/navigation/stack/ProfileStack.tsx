

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BusinessProfileScreen } from '@screens/app/BusinessProfileScreen';
import { ManageHoursScreen } from '@screens/app/ManageHoursScreen';
import { ManageStaffScreen } from '@screens/app/ManageStaffScreen';
import { MerchantSupportScreen } from '@screens/app/MerchantSupportScreen';
import { PayoutsEarningsScreen } from '@screens/app/PayoutsEarningsScreen';
import { TaxInvoiceScreen } from '@screens/app/TaxInvoiceScreen';
import CreatePromoScreen from '@screens/products/CreatePromoScreen';
import ManagePromotionsScreen from '@screens/products/ManagePromotionsScreen';
import { CreateFeedScreen } from '@screens/feeds/CreateFeedScreen';
import { FeedInsightsScreen } from '@screens/feeds/FeedInsightsScreen';
import { FeedViewerScreen } from '@screens/feeds/FeedViewerScreen';
import { StoreFeedsScreen } from '@screens/feeds/StoreFeedsScreen';
import { BoostFeedScreen } from '@screens/feeds/BoostFeedScreen';
import ManageReviewsScreen from '@screens/shop/ManageReviewsScreen';


const Stack = createNativeStackNavigator();

const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BusinessProfileHome" component={BusinessProfileScreen} />
        <Stack.Screen name="ManageHours" component={ManageHoursScreen} />
        {/* <Stack.Screen name="SettingsInTab" component={SettingsScreen} /> */}
        <Stack.Screen name="ManageStaff" component={ManageStaffScreen} />
        <Stack.Screen name="MerchantSupport" component={MerchantSupportScreen} />
        <Stack.Screen name="Payouts" component={PayoutsEarningsScreen} />
        <Stack.Screen name="TaxInvoice" component={TaxInvoiceScreen} />
        <Stack.Screen name="Promotions" component={ManagePromotionsScreen} />
        <Stack.Screen name="CreatePromo" component={CreatePromoScreen} />
        <Stack.Screen name="StoreFeeds" component={StoreFeedsScreen} />
        <Stack.Screen name="FeedViewer" component={FeedViewerScreen} />
        <Stack.Screen name="FeedInsights" component={FeedInsightsScreen} />
        <Stack.Screen name="CreateFeed" component={CreateFeedScreen} />
        <Stack.Screen name="BoostFeed" component={BoostFeedScreen} />
        <Stack.Screen name="ManageReviews" component={ManageReviewsScreen} />
    </Stack.Navigator>
);

export default ProfileStack;