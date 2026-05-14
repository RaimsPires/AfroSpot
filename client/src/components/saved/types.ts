export type SavedItemType = 'Places' | 'Products';

export type SavedItem = {
    id: string;
    type: SavedItemType;
    title: string;
    image: string;
    // Places fields
    subtitle?: string;
    rating?: string;
    reviews?: string;
    isOpen?: boolean;
    // Products fields
    brand?: string;
    price?: string;
    inStock?: boolean;
};
