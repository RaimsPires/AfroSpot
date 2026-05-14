import { NotificationGroupItem } from './types';

export const FILTER_TABS = ['All Activity', 'Unread', 'Bookings', 'Deals'];

export const NOTIFICATION_GROUPS: NotificationGroupItem[] = [
    {
        title: 'BOOKINGS',
        items: [
            {
                id: 'notif-1',
                icon: 'calendar',
                iconColor: '#374151',
                iconBg: '#F3F4F6',
                title: 'Appointment Confirmed',
                time: '2h ago',
                description: 'Your session with Master Barber Kojo at \'The Fade Shop\' is confirmed for tomorrow.',
                colors: {},
            },
        ],
    },
    {
        title: 'PROMOTIONS & OFFERS',
        items: [
            {
                id: 'notif-2',
                icon: 'tag',
                iconColor: '', // Will be set to colors.primary dynamically
                iconBg: '', // Will be set dynamically
                title: 'Weekend Jollof Special!',
                time: '5h ago',
                description: '20% off all family platters at \'Mama Africa Kitchen\'. Valid this Saturday and Sunday.',
                image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=600',
                colors: {},
            },
            {
                id: 'notif-3',
                icon: 'gift',
                iconColor: '#10B981',
                iconBg: '#D1FAE5',
                title: 'New Customer Reward',
                time: '1d ago',
                description: 'You\'ve earned a $5 voucher for your next order at any participating restaurant.',
                showChevron: true,
                colors: {},
            },
        ],
    },
    {
        title: 'NEW BUSINESSES',
        items: [
            {
                id: 'notif-4',
                icon: 'home',
                iconColor: '#F59E0B',
                iconBg: '#FEF3C7',
                title: 'Artisans of Accra Now Open',
                time: '2d ago',
                description: 'A new authentic handicraft shop just opened 2 miles away from your current location.',
                colors: {},
            },
        ],
    },
];
