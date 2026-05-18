import React from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@contexts/ThemeContext';
import { MenuItem, MenuSection, ProfileHeader, ScreenHeader, styles } from '../../components/business-profile';

export const BusinessProfileScreen = ({navigation}:any) => {
    const { colors, isDark } = useTheme();

    const handleSignOut = () => {
        navigation.getParent()?.getParent()?.replace('AuthFlow');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <ScreenHeader colors={colors} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <ProfileHeader colors={colors} />

                <MenuSection title="STORE MANAGEMENT" colors={colors}>
                    <MenuItem icon="layout" label="Manage Store Hours" colors={colors} handlePress={() => navigation.navigate('ManageHours')} />
                    <MenuItem icon="scissors" label="Manage Services" colors={colors} handlePress={() => navigation.navigate('ManageServices')} />
                    <MenuItem icon="package" label="Manage Products" colors={colors} handlePress={() => navigation.navigate('ManageProducts')} />
                    <MenuItem icon="users" label="Manage Staff" colors={colors} isLast handlePress={() => navigation.navigate('ManageStaff')} />
                </MenuSection>

                <MenuSection title="MARKETING & SALES" colors={colors}>
                    <MenuItem icon="tag" label="Promotions & Discounts" colors={colors} handlePress={() => navigation.navigate('Promotions')} />
                    <MenuItem icon="film" label="Store Feeds" colors={colors} handlePress={() => navigation.navigate('StoreFeeds')} />
                    <MenuItem icon="star" label="Customer Reviews" colors={colors} isLast handlePress={() => navigation.navigate('ManageReviews')} />
                </MenuSection>

                <MenuSection title="FINANCE" colors={colors}>
                    <MenuItem icon="dollar-sign" label="Payouts & Earnings" value="$1,240 Pending" colors={colors} handlePress={() => navigation.navigate('Payouts')} />
                    <MenuItem icon="package" label="Orders & Fulfillment" colors={colors} handlePress={() => navigation.getParent()?.navigate('OrderFulfillment')} />
                    <MenuItem icon="file-text" label="Taxes & Invoices" colors={colors} isLast handlePress={() => navigation.navigate('TaxInvoice')} />
                </MenuSection>

                <TouchableOpacity
                    style={[styles.signOutButton, { borderColor: colors.error }]}
                    onPress={handleSignOut}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
                </TouchableOpacity>

                <Text style={[styles.appVersion, { color: colors.textSecondary }]}>AfroSpot Business v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};