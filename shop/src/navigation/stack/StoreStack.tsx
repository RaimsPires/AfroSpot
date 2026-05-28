import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessStoreScreen from '@screens/app/BusinessStoreScreen';

import CreatePromoScreen from '@screens/products/CreatePromoScreen';
import ManagePromotionsScreen from '@screens/products/ManagePromotionsScreen';
import ManageProductsScreen from '@screens/spot/ManageProductsScreen';
import ManageProfileScreen from '@screens/spot/ManageProfileScreen';
import ManageReviewsScreen from '@screens/spot/ManageReviewsScreen';
import ManageServicesScreen from '@screens/spot/ManageServicesScreen';


const Stack = createNativeStackNavigator();

const StoreStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BusinessStoreHome" component={BusinessStoreScreen} />
        <Stack.Screen name="ManageProductsInTab" component={ManageProductsScreen} />
        <Stack.Screen name="ManageServicesInTab" component={ManageServicesScreen} />
        <Stack.Screen name="ManagePromotionsInTab" component={ManagePromotionsScreen} />
        <Stack.Screen name="CreatePromo" component={CreatePromoScreen} />
        <Stack.Screen name="ManageProfileInTab" component={ManageProfileScreen} />
        <Stack.Screen name="ManageReviewsInTab" component={ManageReviewsScreen} />
    </Stack.Navigator>
);

export default StoreStack;