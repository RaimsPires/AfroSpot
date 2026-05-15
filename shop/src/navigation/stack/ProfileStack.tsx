

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BusinessProfileScreen } from '@screens/app/BusinessProfileScreen';
import { ManageStaffScreen } from '@screens/app/ManageStaffScreen';
import { MerchantSupportScreen } from '@screens/app/MerchantSupportScreen';
import { PayoutsEarningsScreen } from '@screens/app/PayoutsEarningsScreen';
import SettingsScreen from '@screens/app/SettingsScreen';
import { TaxInvoiceScreen } from '@screens/app/TaxInvoiceScreen';


const Stack = createNativeStackNavigator();

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

export default ProfileStack;