import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessStoreScreen from '@screens/app/BusinessStoreScreen';

import CreatePromoScreen from '@screens/products/CreatePromoScreen';
import ManagePromotionsScreen from '@screens/products/ManagePromotionsScreen';
import ManageProductsScreen from '@screens/shop/ManageProductsScreen';
import ManageProfileScreen from '@screens/shop/ManageProfileScreen';
import ManageReviewsScreen from '@screens/shop/ManageReviewsScreen';
import ManageServicesScreen from '@screens/shop/ManageServicesScreen';


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