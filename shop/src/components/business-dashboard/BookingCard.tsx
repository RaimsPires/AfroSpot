import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';
import { Booking, DashboardColors } from './types';

type BookingCardProps = {
    booking: Booking;
    colors: DashboardColors;
};

export const BookingCard = ({ booking, colors }: BookingCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Upcoming':
                return colors.primary;
            case 'In Progress':
                return colors.success;
            case 'Pending':
                return colors.warning;
            default:
                return colors.textSecondary;
        }
    };

    return (
        <TouchableOpacity style={[styles.bookingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.bookingTimeCol}>
                <Text style={[styles.bookingTimeText, { color: colors.text }]}>{booking.time.split(' ')[0]}</Text>
                <Text style={[styles.bookingAmPm, { color: colors.textSecondary }]}>{booking.time.split(' ')[1]}</Text>
            </View>

            <View style={[styles.bookingDivider, { backgroundColor: colors.border }]} />

            <View style={styles.bookingDetails}>
                <View style={styles.bookingHeaderRow}>
                    <Text style={[styles.bookingCustomer, { color: colors.text }]}>{booking.customerName}</Text>
                    <View style={[styles.statusPill, { backgroundColor: getStatusColor(booking.status) + '15' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>{booking.status}</Text>
                    </View>
                </View>
                <Text style={[styles.bookingService, { color: colors.textSecondary }]}>{booking.service}</Text>
            </View>

            <Image source={{ uri: booking.avatar }} style={styles.bookingAvatar} />
        </TouchableOpacity>
    );
};
