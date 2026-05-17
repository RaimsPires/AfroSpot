import type {
    BuyerOrderTab,
    CartItem,
    Order,
    OrderLifecycleStatus,
    OrderAddress,
    Product,
    TrackingEvent,
} from '@type/commerce';

const BUYER_ID = 'buyer-01';
const SELLER_ID = 'seller-01';

const products: Product[] = [
    {
        id: 'prod-kente-001',
        title: 'Handwoven Kente Cloth',
        brand: 'HERITAGE WEAVES',
        category: 'Fashion',
        description: 'Limited-edition kente with hand-finished fringe and ceremonial colors.',
        price: 85,
        image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=600',
        rating: 4.8,
        reviewCount: 124,
        stockLabel: 'Only 6 left',
        sellerId: SELLER_ID,
        sellerName: 'Heritage Weaves',
    },
    {
        id: 'prod-berbere-002',
        title: 'Berbere Spice Blend',
        brand: 'ADDIS FLAVORS',
        category: 'Food',
        description: 'A warm Ethiopian spice mix with smoky chili and toasted aromatics.',
        price: 18.5,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600',
        rating: 4.7,
        reviewCount: 89,
        stockLabel: 'Ready to ship',
        sellerId: SELLER_ID,
        sellerName: 'Addis Flavors',
    },
    {
        id: 'prod-shea-003',
        title: 'Shea Butter Luxe',
        brand: 'TAMALE ORGANICS',
        category: 'Beauty',
        description: 'Whipped raw shea butter infused with baobab oil for daily skin care.',
        price: 24,
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600',
        rating: 4.9,
        reviewCount: 212,
        stockLabel: 'Top seller',
        sellerId: SELLER_ID,
        sellerName: 'Tamale Organics',
    },
];

let cartItems: CartItem[] = [
    { id: 'cart-001', productId: products[0].id, quantity: 1, product: products[0] },
    { id: 'cart-002', productId: products[2].id, quantity: 2, product: products[2] },
];

const defaultAddress: OrderAddress = {
    recipient: 'Ama Mensah',
    phone: '+233 20 555 0184',
    line1: '18 Oxford Street',
    line2: 'Osu',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana',
};

const createTrackingEvents = (status: OrderLifecycleStatus): TrackingEvent[] => {
    const base: TrackingEvent[] = [
        {
            id: 'track-placed',
            title: 'Order placed',
            detail: 'Your order was received and is waiting for seller confirmation.',
            timestamp: 'May 16, 2026 • 09:12',
            complete: true,
        },
        {
            id: 'track-confirmed',
            title: 'Seller confirmed',
            detail: 'The seller accepted the order and started preparing it.',
            timestamp: 'May 16, 2026 • 10:05',
            complete: status !== 'Pending' && status !== 'Cancelled',
        },
        {
            id: 'track-shipped',
            title: 'Out for delivery',
            detail: 'Your parcel has left the fulfillment center.',
            timestamp: 'May 17, 2026 • 08:40',
            complete: status === 'Shipped' || status === 'Completed',
        },
        {
            id: 'track-delivered',
            title: 'Delivered',
            detail: 'The order was delivered to the selected address.',
            timestamp: 'May 18, 2026 • 14:15',
            complete: status === 'Completed',
        },
    ];

    if (status === 'Cancelled') {
        return [
            base[0],
            {
                id: 'track-cancelled',
                title: 'Order cancelled',
                detail: 'This order was cancelled before shipment.',
                timestamp: 'May 16, 2026 • 11:14',
                complete: true,
            },
        ];
    }

    return base;
};

let orders: Order[] = [
    {
        id: 'ORD-901',
        buyerId: BUYER_ID,
        buyerName: 'Ama Mensah',
        sellerId: SELLER_ID,
        sellerName: 'Heritage Weaves',
        createdAt: 'May 16, 2026',
        status: 'Pending',
        items: [{ id: 'item-901', productId: products[0].id, quantity: 1, product: products[0] }],
        payment: { methodLabel: 'Visa •••• 2041', subtotal: 85, shipping: 5.99, total: 90.99, status: 'Paid' },
        address: defaultAddress,
        trackingEvents: createTrackingEvents('Pending'),
        note: 'Call on arrival.',
    },
    {
        id: 'ORD-884',
        buyerId: BUYER_ID,
        buyerName: 'Ama Mensah',
        sellerId: SELLER_ID,
        sellerName: 'Tamale Organics',
        createdAt: 'May 14, 2026',
        status: 'Shipped',
        items: [{ id: 'item-884', productId: products[2].id, quantity: 2, product: products[2] }],
        payment: { methodLabel: 'Mobile Money', subtotal: 48, shipping: 5.99, total: 53.99, status: 'Paid' },
        address: defaultAddress,
        trackingNumber: 'TRK-992831',
        trackingEvents: createTrackingEvents('Shipped'),
    },
    {
        id: 'ORD-772',
        buyerId: BUYER_ID,
        buyerName: 'Ama Mensah',
        sellerId: SELLER_ID,
        sellerName: 'Addis Flavors',
        createdAt: 'May 10, 2026',
        status: 'Completed',
        items: [{ id: 'item-772', productId: products[1].id, quantity: 3, product: products[1] }],
        payment: { methodLabel: 'Visa •••• 2041', subtotal: 55.5, shipping: 5.99, total: 61.49, status: 'Paid' },
        address: defaultAddress,
        trackingNumber: 'TRK-884120',
        trackingEvents: createTrackingEvents('Completed'),
    },
    {
        id: 'ORD-730',
        buyerId: BUYER_ID,
        buyerName: 'Ama Mensah',
        sellerId: SELLER_ID,
        sellerName: 'Heritage Weaves',
        createdAt: 'May 08, 2026',
        status: 'Cancelled',
        items: [{ id: 'item-730', productId: products[0].id, quantity: 1, product: products[0] }],
        payment: { methodLabel: 'Visa •••• 2041', subtotal: 85, shipping: 0, total: 85, status: 'Refunded' },
        address: defaultAddress,
        trackingEvents: createTrackingEvents('Cancelled'),
    },
];

const cloneOrder = (order: Order): Order => ({
    ...order,
    items: order.items.map(item => ({ ...item, product: { ...item.product } })),
    payment: { ...order.payment },
    address: { ...order.address },
    trackingEvents: order.trackingEvents.map(event => ({ ...event })),
});

const mapStatusToBuyerTab = (status: OrderLifecycleStatus): BuyerOrderTab => {
    if (status === 'Completed') {
        return 'Completed';
    }

    if (status === 'Cancelled') {
        return 'Cancelled';
    }

    return 'Active';
};

const findOrderIndex = (orderId: string) => orders.findIndex(order => order.id === orderId);

const updateOrder = (orderId: string, updater: (order: Order) => Order): Order | undefined => {
    const index = findOrderIndex(orderId);

    if (index === -1) {
        return undefined;
    }

    orders[index] = updater(orders[index]);
    return cloneOrder(orders[index]);
};

export const getProducts = (): Product[] => products.map(product => ({ ...product }));

export const getProductById = (productId: string): Product | undefined =>
    products.find(product => product.id === productId);

export const getCartItems = (): CartItem[] =>
    cartItems.map(item => ({ ...item, product: { ...item.product } }));

export const getCartSummary = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + shipping;

    return { subtotal, shipping, total };
};

export const getDefaultAddress = (): OrderAddress => ({ ...defaultAddress });

export const getDefaultPaymentMethodLabel = () => 'Visa •••• 2041';

export const addToCart = (productId: string) => {
    const product = getProductById(productId);

    if (!product) {
        return getCartItems();
    }

    const existingItem = cartItems.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems = [
            ...cartItems,
            {
                id: `cart-${Date.now()}`,
                productId,
                quantity: 1,
                product,
            },
        ];
    }

    return getCartItems();
};

export const updateCartQuantity = (cartItemId: string, quantity: number) => {
    cartItems = cartItems
        .map(item => (item.id === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter(item => item.quantity > 0);

    return getCartItems();
};

export const removeCartItem = (cartItemId: string) => {
    cartItems = cartItems.filter(item => item.id !== cartItemId);
    return getCartItems();
};

export const clearCart = () => {
    cartItems = [];
    return getCartItems();
};

export const placeOrder = () => {
    if (cartItems.length === 0) {
        return undefined;
    }

    const summary = getCartSummary();
    const nextOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 900 + 100)}`,
        buyerId: BUYER_ID,
        buyerName: defaultAddress.recipient,
        sellerId: SELLER_ID,
        sellerName: cartItems[0].product.sellerName,
        createdAt: 'May 16, 2026',
        status: 'Pending',
        items: getCartItems(),
        payment: {
            methodLabel: 'Visa •••• 2041',
            subtotal: summary.subtotal,
            shipping: summary.shipping,
            total: summary.total,
            status: 'Paid',
        },
        address: { ...defaultAddress },
        trackingEvents: createTrackingEvents('Pending'),
    };

    orders = [nextOrder, ...orders];
    clearCart();
    return cloneOrder(nextOrder);
};

export const getBuyerOrders = (tab?: BuyerOrderTab): Order[] => {
    const buyerOrders = orders.filter(order => order.buyerId === BUYER_ID);
    const filtered = tab ? buyerOrders.filter(order => mapStatusToBuyerTab(order.status) === tab) : buyerOrders;
    return filtered.map(cloneOrder);
};

export const getSellerOrders = (status?: OrderLifecycleStatus): Order[] => {
    const sellerOrders = orders.filter(order => order.sellerId === SELLER_ID);
    const filtered = status ? sellerOrders.filter(order => order.status === status) : sellerOrders;
    return filtered.map(cloneOrder);
};

export const getOrderById = (orderId: string): Order | undefined => {
    const order = orders.find(entry => entry.id === orderId);
    return order ? cloneOrder(order) : undefined;
};

export const canBuyerCancelOrder = (order: Order) =>
    order.status === 'Pending' || order.status === 'Confirmed';

export const canSellerConfirmOrder = (order: Order) => order.status === 'Pending';

export const canSellerShipOrder = (order: Order) => order.status === 'Confirmed';

export const cancelOrder = (orderId: string, cancelledBy: 'buyer' | 'seller') =>
    updateOrder(orderId, order => ({
        ...order,
        status: 'Cancelled',
        payment: {
            ...order.payment,
            shipping: 0,
            total: order.payment.subtotal,
            status: 'Refunded',
        },
        trackingNumber: undefined,
        trackingEvents: [
            order.trackingEvents[0],
            {
                id: `track-cancelled-${Date.now()}`,
                title: cancelledBy === 'buyer' ? 'Buyer cancelled order' : 'Seller cancelled order',
                detail: 'The order was cancelled before shipment and will no longer be fulfilled.',
                timestamp: 'May 16, 2026 • 12:00',
                complete: true,
            },
        ],
    }));

export const confirmOrder = (orderId: string) =>
    updateOrder(orderId, order => ({
        ...order,
        status: 'Confirmed',
        trackingEvents: createTrackingEvents('Confirmed'),
    }));

export const markOrderShipped = (orderId: string, trackingNumber: string) =>
    updateOrder(orderId, order => ({
        ...order,
        status: 'Shipped',
        trackingNumber,
        trackingEvents: createTrackingEvents('Shipped'),
    }));

export const completeOrder = (orderId: string) =>
    updateOrder(orderId, order => ({
        ...order,
        status: 'Completed',
        trackingEvents: createTrackingEvents('Completed'),
    }));
