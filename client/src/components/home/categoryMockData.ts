import { CategoryItemProps, CategoryValue } from "@type/category";


export const ALL_CATEGORIES: CategoryItemProps[] = [
    { icon: 'restaurant', label: 'Restaurants', library: 'Ionicons', value: CategoryValue.RESTAURANTS },
    { icon: 'scissors', label: 'Beauty', library: 'Feather', value: CategoryValue.BEAUTY },
    { icon: 'trending-up', label: 'Fashion', library: 'Ionicons', value: CategoryValue.FASHION },
    { icon: 'storefront', label: 'Markets', library: 'Ionicons', value: CategoryValue.MARKETS },
    { icon: 'calendar-number', label: 'Events', library: 'Ionicons', value: CategoryValue.EVENTS },
    { icon: 'fitness', label: 'Fitness', library: 'Ionicons', value: CategoryValue.FITNESS },
    { icon: 'home', label: 'Services', library: 'Ionicons', value: CategoryValue.SERVICES },
    { icon: 'cart', label: 'Shopping', library: 'Ionicons', value: CategoryValue.SHOPPING },
    { icon: 'camera', label: 'Photography', library: 'Ionicons', value: CategoryValue.PHOTOGRAPHY },
    { icon: 'book', label: 'Education', library: 'Ionicons', value: CategoryValue.EDUCATION },
    { icon: 'medical', label: 'Healthcare', library: 'Ionicons', value: CategoryValue.HEALTHCARE },
    { icon: 'musical-notes', label: 'Entertainment', library: 'Ionicons', value: CategoryValue.ENTERTAINMENT },
];
