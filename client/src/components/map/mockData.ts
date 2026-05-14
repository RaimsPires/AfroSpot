import { MapLocationItem } from './types';

export const CATEGORIES = ['All', 'Restaurants', 'Salons', 'Groceries', 'Fashion'];

export const MOCK_LOCATIONS: MapLocationItem[] = [
    {
        id: '1',
        title: 'Jollof House Kitchen',
        type: 'active',
        lat: 40.8116,
        lng: -73.9465,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200',
        rating: '4.8',
        reviews: '124',
        category: 'Restaurant',
        distance: '0.4 miles away',
        isOpen: true,
    },
    {
        id: '2',
        title: 'Lagos Cuts Barber',
        type: 'inactive',
        lat: 40.8186,
        lng: -73.9505,
        image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=200',
        rating: '4.9',
        reviews: '89',
        category: 'Salon',
        distance: '0.9 miles away',
        isOpen: true,
    },
    {
        id: '3',
        title: 'Amani Market',
        type: 'inactive',
        lat: 40.8156,
        lng: -73.9385,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200',
        rating: '4.5',
        reviews: '56',
        category: 'Groceries',
        distance: '1.2 miles away',
        isOpen: false,
    },
];
