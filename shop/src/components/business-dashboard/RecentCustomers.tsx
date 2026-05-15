import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import { styles } from './styles';
import { Customer, DashboardColors } from './types';

type RecentCustomersProps = {
    customers: Customer[];
    colors: DashboardColors;
};

export const RecentCustomers = ({ customers, colors }: RecentCustomersProps) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.customersScroll}>
        {customers.map((customer) => (
            <View key={customer.id} style={styles.customerItem}>
                <Image source={{ uri: customer.avatar }} style={[styles.customerAvatar, { borderColor: colors.border }]} />
                <Text style={[styles.customerName, { color: colors.text }]} numberOfLines={1}>{customer.name}</Text>
            </View>
        ))}
    </ScrollView>
);
