import { Booking, Customer, DashboardStats } from './types';

export const DASHBOARD_STATS: DashboardStats = {
    revenue: '$4,250.00',
    revenueGrowth: '+12.5%',
    bookings: 24,
    profileViews: 1284,
};

export const TODAYS_BOOKINGS: Booking[] = [
    {
        id: '1',
        customerName: 'Marcus Johnson',
        service: 'Fresh Fade & Lineup',
        time: '10:30 AM',
        status: 'Upcoming',
        avatar: 'https://i.pravatar.cc/150?img=11',
    },
    {
        id: '2',
        customerName: 'Sarah Jenkins',
        service: 'Braiding & Styling',
        time: '01:15 PM',
        status: 'In Progress',
        avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
        id: '3',
        customerName: 'David Osei',
        service: 'Beard Grooming',
        time: '03:00 PM',
        status: 'Pending',
        avatar: 'https://i.pravatar.cc/150?img=8',
    },
];

export const RECENT_CUSTOMERS: Customer[] = [
    { id: 'c1', name: 'Amara', avatar: 'https://i.pravatar.cc/150?img=47' },
    { id: 'c2', name: 'Kwame', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 'c3', name: 'Nia', avatar: 'https://i.pravatar.cc/150?img=9' },
    { id: 'c4', name: 'Jamal', avatar: 'https://i.pravatar.cc/150?img=33' },
    { id: 'c5', name: 'Zuri', avatar: 'https://i.pravatar.cc/150?img=20' },
];
