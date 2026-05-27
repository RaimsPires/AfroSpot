import { UserAddress } from '@type/auth';

export const LABEL_TO_ADDRESS_TYPE = {
    Home: 'home',
    Work: 'work',
    Other: 'other',
} as const;

export type AddressLabel = keyof typeof LABEL_TO_ADDRESS_TYPE;

export type LocationOption = {
    id?: number;
    label: string;
    value: string;
    isoCode?: string;
};

export function normalizeLocationValue(value: string): string {
    return value.trim().toLowerCase();
}

export function findCountryOptionByValue(countries: LocationOption[], value: string): LocationOption | null {
    const normalizedValue = normalizeLocationValue(value);
    if (!normalizedValue) {
        return null;
    }

    return countries.find((country) => {
        return normalizeLocationValue(country.label) === normalizedValue
            || normalizeLocationValue(country.isoCode ?? '') === normalizedValue;
    }) ?? null;
}

export function findStateOptionByValue(states: LocationOption[], value: string): LocationOption | null {
    const normalizedValue = normalizeLocationValue(value);
    if (!normalizedValue) {
        return null;
    }

    return states.find((stateItem) => {
        return normalizeLocationValue(stateItem.label) === normalizedValue
            || normalizeLocationValue(stateItem.isoCode ?? '') === normalizedValue;
    }) ?? null;
}

export function getAddressTypeLabel(type: UserAddress['address_type']): 'Home' | 'Work' | 'Other' {
    if (type === 'home') {
        return 'Home';
    }

    if (type === 'work') {
        return 'Work';
    }

    return 'Other';
}

export function getAddressIcon(type: UserAddress['address_type']): 'home' | 'briefcase' | 'map-pin' {
    if (type === 'home') {
        return 'home';
    }

    if (type === 'work') {
        return 'briefcase';
    }

    return 'map-pin';
}
