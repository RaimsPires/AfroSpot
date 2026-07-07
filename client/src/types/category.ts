import { IconLibrary } from "./ui";

export enum CategoryValue {
    RESTAURANTS = 'restaurants',
    BEAUTY = 'beauty',
    FASHION = 'fashion',
    MARKETS = 'markets',
    EVENTS = 'events',
    FITNESS = 'fitness',
    SERVICES = 'services',
    SHOPPING = 'shopping',
    PHOTOGRAPHY = 'photography',
    EDUCATION = 'education',
    HEALTHCARE = 'healthcare',
    ENTERTAINMENT = 'entertainment',
}

export type CategoryItemProps = {
    icon: string;
    label: string;
    value: CategoryValue;
    active?: boolean;
    library?: IconLibrary;
    onPress?: () => void;
};