import { AppTheme } from '../../types/theme';

export type DashboardColors = AppTheme['colors'];

export type DashboardStats = {
    revenue: string;
    revenueGrowth: string;
    bookings: number;
    profileViews: number;
};

export type Booking = {
    id: string;
    customerName: string;
    service: string;
    time: string;
    status: string;
    avatar: string;
};

export type Customer = {
    id: string;
    name: string;
    avatar: string;
};
