import { FeedPostItem } from './types';

export const FEED_POSTS: FeedPostItem[] = [
    {
        id: '1',
        videoCover: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=800',
        username: 'adara_eats',
        userAvatar: 'https://i.pravatar.cc/150?img=47',
        isVerified: true,
        caption: 'The best Jollof rice in Brooklyn! You HAVE to try their spicy goat meat.',
        tags: ['#AfricanFood', '#NYCBestEats', '#AfroSpot'],
        businessName: 'Jollof Village • Restaurant',
        likes: '12.4K',
        comments: '842',
        shares: '3.1K',
        audio: 'Original audio - adara_eats',
    },
    {
        id: '2',
        videoCover: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800',
        username: 'kofi_styles',
        userAvatar: 'https://i.pravatar.cc/150?img=11',
        isVerified: false,
        caption: 'Fresh fade for the weekend. Check out Kushite Cutz in Harlem! 💈🔥',
        tags: ['#BarberLife', '#Harlem', '#FreshCut'],
        businessName: 'Kushite Cutz & Styles • Barber',
        likes: '8.2K',
        comments: '124',
        shares: '890',
        audio: 'Afrobeats Mix 2023 - DJ Cuppy',
    },
    {
        id: '3',
        videoCover: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800',
        username: 'heritage_art',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        isVerified: true,
        caption: 'New authentic Kente cloth just arrived at the shop. Handwoven perfection.',
        tags: ['#Kente', '#AfricanFashion', '#Artisan'],
        businessName: 'Heritage Weaves • Shop',
        likes: '15.1K',
        comments: '430',
        shares: '1.2K',
        audio: 'Original audio - heritage_art',
    },
];

export const TRENDING_TAGS = ['#JollofBattle', '#AfrobeatsNights', '#NairaCuts', '#LagosToNYC'];
