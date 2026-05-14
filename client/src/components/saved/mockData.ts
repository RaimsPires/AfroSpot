import { SavedItem } from './types';

export const TABS = ['All', 'Places', 'Products'] as const;

export const SAVED_ITEMS: SavedItem[] = [
    {
        id: '1',
        type: 'Places',
        title: "Mama Ashanti's Kitchen",
        subtitle: 'West African • 1.2 miles away',
        rating: '4.8',
        reviews: '500+',
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=300',
        isOpen: true,
    },
    {
        id: '2',
        type: 'Products',
        title: 'Authentic Kente Cloth',
        brand: 'HERITAGE WEAVES',
        price: '$45.00',
        image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=300',
        inStock: true,
    },
    {
        id: '3',
        type: 'Places',
        title: 'Kushite Cutz & Styles',
        subtitle: 'Barbershop • 0.8 miles away',
        rating: '4.9',
        reviews: '128',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=300',
        isOpen: false,
    },
    {
        id: '4',
        type: 'Products',
        title: 'Berbere Spice Blend',
        brand: 'ADDIS FLAVORS',
        price: '$18.50',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=300',
        inStock: true,
    },
    {
        id: '5',
        type: 'Places',
        title: 'Jollof Village',
        subtitle: 'Nigerian • 3.5 miles away',
        rating: '4.6',
        reviews: '342',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300',
        isOpen: true,
    },
];
