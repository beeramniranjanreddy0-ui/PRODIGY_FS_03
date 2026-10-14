import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import type {
  Product,
  Category,
  CartItem,
  Order,
  User,
  Coupon,
  DeliverySlot,
  Review
} from './src/types/bakery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// -------------------------------------------------------------
// In-Memory Database with Seeded Products, Categories & Orders
// -------------------------------------------------------------

const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Birthday Cakes',
    slug: 'birthday-cakes',
    description: 'Festive tiered and signature celebration cakes crafted to spark joy.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-2',
    name: 'Anniversary Cakes',
    slug: 'anniversary-cakes',
    description: 'Romantic handcrafted designs with elegant edible botanicals and velvet textures.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-3',
    name: 'Wedding Cakes',
    slug: 'wedding-cakes',
    description: 'Grand centerpieces tailored with bespoke fondant, ganache, and royal icing.',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-4',
    name: 'Chocolate Cakes',
    slug: 'chocolate-cakes',
    description: 'Rich Belgian chocolate sponge, silky truffle ganache, and dark cocoa curls.',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-5',
    name: 'Black Forest Cakes',
    slug: 'black-forest-cakes',
    description: 'Traditional Kirsch-kissed sour cherries, whipped cream, and chocolate flakes.',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-6',
    name: 'Red Velvet Cakes',
    slug: 'red-velvet-cakes',
    description: 'Crimson cocoa velvet layers kissed with tangy Philadelphia cream cheese frosting.',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-7',
    name: 'Photo Cakes',
    slug: 'photo-cakes',
    description: 'High-resolution edible sugar prints celebrating memories on your favorite cake base.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-8',
    name: 'Cupcakes',
    slug: 'cupcakes',
    description: 'Artisanal single-serve delights with swirled buttercreams and sprinkles.',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-9',
    name: 'Pastries',
    slug: 'pastries',
    description: 'Flaky Viennoiserie, French fruit tarts, and layered cream opera cuts.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-10',
    name: 'Brownies and Desserts',
    slug: 'brownies-and-desserts',
    description: 'Fudgy Dutch-cocoa brownie squares, walnut blondies, and gourmet mousse cups.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-11',
    name: 'Eggless Cakes',
    slug: 'eggless-cakes',
    description: 'Soft, airy 100% vegetarian sponges crafted with premium yogurt and flax puree.',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-12',
    name: 'Custom Cakes',
    slug: 'custom-cakes',
    description: 'Bespoke cakes sculpted according to your theme, message, weight, and dream design.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
  },
];

let PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Belgian Chocolate Truffle Cake',
    slug: 'belgian-chocolate-truffle-cake',
    categoryId: 'cat-4',
    categoryName: 'Chocolate Cakes',
    basePrice: 699,
    description:
      'Immerse in pure decadence. Three tender layers of dark cocoa sponge soaked in sugar syrup and smothered in glossy 54% Callebaut Belgian chocolate ganache.',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg', '1 kg', '2 kg', '3 kg'],
    supportedFlavours: ['Chocolate', 'Dark Truffle', 'Choco Hazelnut'],
    supportsEggless: true,
    stock: 25,
    isBestseller: true,
    isSpecial: true,
    rating: 4.9,
    reviewCount: 142,
    reviews: [
      {
        id: 'rev-1',
        userName: 'Aarav Sharma',
        rating: 5,
        comment: 'Rich, moist, and perfectly balanced chocolate sweetness. Best truffle cake in town!',
        date: '2026-09-18',
      },
      {
        id: 'rev-2',
        userName: 'Sneha Rao',
        rating: 5,
        comment: 'The chocolate piped message looked so elegant. Guests loved every bite.',
        date: '2026-10-02',
      },
    ],
  },
  {
    id: 'prod-2',
    name: 'Classic Black Forest Cake',
    slug: 'classic-black-forest-cake',
    categoryId: 'cat-5',
    categoryName: 'Black Forest Cakes',
    basePrice: 599,
    description:
      'The authentic German Schwarzwälder delight. Airy chocolate sponge layered with whipped vanilla cream, macerated tart cherries, and dark chocolate shavings.',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg', '1 kg', '2 kg', '3 kg'],
    supportedFlavours: ['Black Forest', 'White Forest'],
    supportsEggless: true,
    stock: 18,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 98,
  },
  {
    id: 'prod-3',
    name: 'Velvet Dream Red Velvet Cake',
    slug: 'velvet-dream-red-velvet-cake',
    categoryId: 'cat-6',
    categoryName: 'Red Velvet Cakes',
    basePrice: 799,
    description:
      'Silky buttermilk crimson sponge with subtle cacao undertones, layered with artisan cream cheese frosting and dusted with red velvet crumbs.',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg', '1 kg', '2 kg', '3 kg'],
    supportedFlavours: ['Red Velvet', 'Berry Red Velvet'],
    supportsEggless: true,
    stock: 14,
    isBestseller: true,
    isSpecial: true,
    rating: 4.9,
    reviewCount: 115,
  },
  {
    id: 'prod-4',
    name: 'Madagascar Vanilla Celebration Cake',
    slug: 'madagascar-vanilla-celebration-cake',
    categoryId: 'cat-1',
    categoryName: 'Birthday Cakes',
    basePrice: 549,
    description:
      'Pure organic Bourbon vanilla bean sponge topped with pastel cream rosettes, colorful macarons, and sparkling sugar pearls. A crowd favorite for birthdays.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg', '1 kg', '2 kg', '3 kg'],
    supportedFlavours: ['Vanilla', 'Pineapple', 'Butterscotch'],
    supportsEggless: true,
    stock: 22,
    isBestseller: true,
    rating: 4.7,
    reviewCount: 84,
  },
  {
    id: 'prod-5',
    name: 'Gourmet Chocolate Cupcake Box (6 Pcs)',
    slug: 'gourmet-chocolate-cupcake-box',
    categoryId: 'cat-8',
    categoryName: 'Cupcakes',
    basePrice: 299,
    description:
      'Handcrafted box of 6 cupcakes featuring Belgian fudge swirl, strawberry blush buttercream, and espresso caramel toppings.',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg'],
    supportedFlavours: ['Chocolate', 'Vanilla', 'Red Velvet'],
    supportsEggless: true,
    stock: 30,
    isBestseller: false,
    rating: 4.8,
    reviewCount: 65,
  },
  {
    id: 'prod-6',
    name: 'Dutch Cocoa Fudge Brownies (Pack of 4)',
    slug: 'dutch-cocoa-fudge-brownies',
    categoryId: 'cat-10',
    categoryName: 'Brownies and Desserts',
    basePrice: 349,
    description:
      'Intensely fudgy, crackly-topped brownie blocks made with premium 70% dark chocolate and toasted California walnuts.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg', '1 kg'],
    supportedFlavours: ['Chocolate', 'Walnut Fudge'],
    supportsEggless: true,
    stock: 40,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 92,
  },
  {
    id: 'prod-7',
    name: 'Golden Butterscotch Bliss Cake',
    slug: 'golden-butterscotch-bliss-cake',
    categoryId: 'cat-1',
    categoryName: 'Birthday Cakes',
    basePrice: 599,
    description:
      'Moist vanilla sponge infused with brown butter caramel sauce and crunchy praline crunchies between every layer.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg', '1 kg', '2 kg', '3 kg'],
    supportedFlavours: ['Butterscotch', 'Caramel'],
    supportsEggless: true,
    stock: 15,
    rating: 4.7,
    reviewCount: 71,
  },
  {
    id: 'prod-8',
    name: 'Royal Floral Anniversary Tier Cake',
    slug: 'royal-floral-anniversary-tier-cake',
    categoryId: 'cat-2',
    categoryName: 'Anniversary Cakes',
    basePrice: 1299,
    description:
      'Two-tiered centerpiece with blush pink ombre frosting, gold foil strokes, and fresh hand-placed organic rose petals.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['1 kg', '2 kg', '3 kg'],
    supportedFlavours: ['Red Velvet', 'Vanilla', 'Chocolate'],
    supportsEggless: true,
    stock: 10,
    isSpecial: true,
    rating: 5.0,
    reviewCount: 53,
  },
  {
    id: 'prod-9',
    name: 'Bespoke Custom Theme Cake',
    slug: 'bespoke-custom-theme-cake',
    categoryId: 'cat-12',
    categoryName: 'Custom Cakes',
    basePrice: 899,
    description:
      'Bring your fantasy cake to life! Choose your occasion, custom cake message, uploaded reference sketches, weight, and favorite flavour combination.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg', '1 kg', '2 kg', '3 kg'],
    supportedFlavours: ['Chocolate', 'Vanilla', 'Black Forest', 'Red Velvet', 'Butterscotch', 'Pineapple'],
    supportsEggless: true,
    stock: 50,
    isSpecial: true,
    rating: 4.9,
    reviewCount: 160,
  },
  {
    id: 'prod-10',
    name: 'Tropical Pineapple Sunshine Cake',
    slug: 'tropical-pineapple-sunshine-cake',
    categoryId: 'cat-11',
    categoryName: 'Eggless Cakes',
    basePrice: 529,
    description:
      '100% vegetarian sponge infused with crushed tropical pineapple, whipped cream, and candied cherries. Light, refreshing, and moist.',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg', '1 kg', '2 kg', '3 kg'],
    supportedFlavours: ['Pineapple', 'Vanilla'],
    supportsEggless: true,
    stock: 20,
    rating: 4.6,
    reviewCount: 68,
  },
  {
    id: 'prod-11',
    name: 'Personalized Sugar-Print Photo Cake',
    slug: 'personalized-sugar-print-photo-cake',
    categoryId: 'cat-7',
    categoryName: 'Photo Cakes',
    basePrice: 799,
    description:
      'Upload a memorable picture or family photograph to be printed with 100% food-grade edible ink on a smooth fondant sheet.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg', '1 kg', '2 kg', '3 kg'],
    supportedFlavours: ['Chocolate', 'Vanilla', 'Butterscotch', 'Black Forest'],
    supportsEggless: true,
    stock: 25,
    isSpecial: true,
    rating: 4.8,
    reviewCount: 89,
  },
  {
    id: 'prod-12',
    name: 'French Opera & Berry Pastry Platter (4 Pcs)',
    slug: 'french-opera-pastry-platter',
    categoryId: 'cat-9',
    categoryName: 'Pastries',
    basePrice: 399,
    description:
      'Almond joconde sponge soaked in coffee syrup, layered with French buttercream and dark chocolate glaze.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg'],
    supportedFlavours: ['Coffee Chocolate', 'Mixed Berry'],
    supportsEggless: true,
    stock: 15,
    rating: 4.7,
    reviewCount: 42,
  },
  {
    id: 'prod-13',
    name: 'Ivory Cascade Grand Wedding Cake',
    slug: 'ivory-cascade-grand-wedding-cake',
    categoryId: 'cat-3',
    categoryName: 'Wedding Cakes',
    basePrice: 2499,
    description:
      'Three magnificent tiers with white velvet crumb, Champagne mousse filling, textured Swiss meringue buttercream, and handcrafted sugar flowers.',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['2 kg', '3 kg'],
    supportedFlavours: ['Vanilla', 'White Forest', 'Red Velvet'],
    supportsEggless: true,
    stock: 6,
    isSpecial: true,
    rating: 5.0,
    reviewCount: 29,
  },
  {
    id: 'prod-14',
    name: 'White Forest Cherry Fantasy Cake',
    slug: 'white-forest-cherry-fantasy-cake',
    categoryId: 'cat-5',
    categoryName: 'Black Forest Cakes',
    basePrice: 649,
    description:
      'Delicate white chocolate flakes showering fluffy vanilla sponge, layered with imported sour cherry compote and Swiss cream.',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80',
    ],
    supportedWeights: ['0.5 kg', '1 kg', '2 kg'],
    supportedFlavours: ['White Forest', 'Vanilla'],
    supportsEggless: true,
    stock: 12,
    rating: 4.8,
    reviewCount: 45,
  },
];

// Delivery Slots
const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: 'slot-1', label: 'Morning Express (09:00 AM - 12:00 PM)', isAvailable: true },
  { id: 'slot-2', label: 'Afternoon Delight (12:00 PM - 04:00 PM)', isAvailable: true },
  { id: 'slot-3', label: 'Evening Celebration (04:00 PM - 08:00 PM)', isAvailable: true },
  { id: 'slot-4', label: 'Midnight Surprise (11:00 PM - 12:00 AM)', isAvailable: true, extraFee: 150 },
];

// Coupons
const COUPONS: Coupon[] = [
  { code: 'SWEET10', discountPercentage: 10, maxDiscount: 200, minOrderValue: 499 },
  { code: 'BAKER20', discountPercentage: 20, maxDiscount: 400, minOrderValue: 999 },
  { code: 'FIRSTCAKE', discountPercentage: 15, maxDiscount: 250, minOrderValue: 500 },
];

// Single Designated Administrator Credentials
const ADMIN_EMAIL = 'thebakerscorner@admin.com';
const ADMIN_PASSWORD = 'Bakerscorner@123';

// In-Memory State for Users, Carts, Orders
const USERS: User[] = [
  {
    id: 'user-admin',
    email: ADMIN_EMAIL,
    fullName: 'Executive Chef & Admin',
    phone: '+91 98765 43210',
    role: 'admin',
  },
  {
    id: 'user-demo',
    email: 'niro@example.com',
    fullName: 'Niranjan Reddy',
    phone: '+91 98490 12345',
    role: 'customer',
    savedAddresses: [
      {
        fullName: 'Niranjan Reddy',
        phone: '+91 98490 12345',
        email: 'niro@example.com',
        streetAddress: '42 Baker Street, Jubilee Hills',
        apartment: 'Villa 104',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
      },
    ],
  },
];

// Cart map: cartId -> CartItem[]
const CARTS: Map<string, CartItem[]> = new Map();

// Orders list
let ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'TBC-2026-1042',
    userId: 'user-demo',
    customerName: 'Niranjan Reddy',
    customerEmail: 'niro@example.com',
    customerPhone: '+91 98490 12345',
    shippingAddress: {
      fullName: 'Niranjan Reddy',
      phone: '+91 98490 12345',
      email: 'niro@example.com',
      streetAddress: '42 Baker Street, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
    },
    items: [
      {
        id: 'item-demo-1',
        productId: 'prod-1',
        productName: 'Belgian Chocolate Truffle Cake',
        productImage: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
        unitPrice: 1299,
        quantity: 1,
        itemSubtotal: 1299,
        customization: {
          occasion: 'Birthday',
          weight: '1 kg',
          flavour: 'Chocolate',
          isEggless: true,
          hasMessage: true,
          cakeMessage: 'Happy Birthday, Niro!',
          deliveryDate: '2026-10-15',
          deliveryTimeSlot: 'Evening Celebration (04:00 PM - 08:00 PM)',
          specialInstructions: 'Please add dark chocolate shavings generously on top.',
        },
      },
    ],
    subtotal: 1299,
    discountAmount: 130,
    couponCode: 'SWEET10',
    deliveryFee: 0,
    taxAmount: 58,
    grandTotal: 1227,
    paymentMethod: 'SIMULATED_CARD',
    paymentStatus: 'Paid',
    orderStatus: 'Preparing',
    deliveryDate: '2026-10-15',
    deliveryTimeSlot: 'Evening Celebration (04:00 PM - 08:00 PM)',
    createdAt: '2026-10-13T09:30:00.000Z',
    updatedAt: '2026-10-13T10:15:00.000Z',
  },
];

// Helper: Calculate weight price multiplier
function getWeightMultiplier(weight: string): number {
  if (weight.includes('0.5')) return 1;
  if (weight.includes('1')) return 1.8;
  if (weight.includes('2')) return 3.4;
  if (weight.includes('3')) return 4.8;
  return 1;
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Categories
app.get('/api/categories', (_req, res) => {
  res.json({ categories: CATEGORIES });
});

// Products
app.get('/api/products', (req, res) => {
  const { category, search, sort, isBestseller, isSpecial } = req.query;
  let filtered = [...PRODUCTS];

  if (category && typeof category === 'string' && category !== 'all') {
    filtered = filtered.filter(
      (p) => p.categoryId === category || p.slug.includes(category)
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.supportedFlavours.some((f) => f.toLowerCase().includes(q))
    );
  }

  if (isBestseller === 'true') {
    filtered = filtered.filter((p) => p.isBestseller);
  }

  if (isSpecial === 'true') {
    filtered = filtered.filter((p) => p.isSpecial);
  }

  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.basePrice - b.basePrice);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.basePrice - a.basePrice);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  res.json({ products: filtered });
});

app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// Admin Product Create / Update / Delete
app.post('/api/products', (req, res) => {
  const body = req.body;
  if (!body.name || !body.basePrice || !body.categoryId) {
    return res.status(400).json({ error: 'Name, basePrice, and categoryId are required' });
  }

  const category = CATEGORIES.find((c) => c.id === body.categoryId);
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: body.name,
    slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    categoryId: body.categoryId,
    categoryName: category ? category.name : 'Custom Cakes',
    basePrice: Number(body.basePrice),
    description: body.description || 'Freshly baked artisanal gourmet cake.',
    image: body.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    galleryImages: body.galleryImages || [body.image],
    supportedWeights: body.supportedWeights || ['0.5 kg', '1 kg', '2 kg'],
    supportedFlavours: body.supportedFlavours || ['Chocolate', 'Vanilla'],
    supportsEggless: body.supportsEggless ?? true,
    stock: Number(body.stock ?? 20),
    rating: 5.0,
    reviewCount: 1,
    isBestseller: !!body.isBestseller,
    isSpecial: !!body.isSpecial,
  };

  PRODUCTS.unshift(newProduct);
  res.status(201).json({ product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const index = PRODUCTS.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = PRODUCTS[index];
  const updated = { ...existing, ...req.body };
  PRODUCTS[index] = updated;
  res.json({ product: updated });
});

app.delete('/api/products/:id', (req, res) => {
  const index = PRODUCTS.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  PRODUCTS.splice(index, 1);
  res.json({ success: true, message: 'Product deleted' });
});

// Reviews
app.post('/api/products/:id/reviews', (req, res) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { userName, rating, comment } = req.body;
  if (!userName || !rating || !comment) {
    return res.status(400).json({ error: 'Name, rating and comment are required' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    userName,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0],
  };

  if (!product.reviews) product.reviews = [];
  product.reviews.unshift(newReview);
  product.reviewCount = product.reviews.length;
  product.rating = Number(
    (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
  );

  res.status(201).json({ review: newReview, product });
});

// Delivery Slots
app.get('/api/delivery-slots', (_req, res) => {
  res.json({ slots: DELIVERY_SLOTS });
});

// Coupons
app.post('/api/coupons/validate', (req, res) => {
  const { code, orderValue } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Coupon code required' });
  }

  const coupon = COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!coupon) {
    return res.status(404).json({ error: 'Invalid coupon code' });
  }

  if (orderValue < coupon.minOrderValue) {
    return res.status(400).json({
      error: `Coupon requires minimum order value of ₹${coupon.minOrderValue}`,
    });
  }

  let discount = Math.round((orderValue * coupon.discountPercentage) / 100);
  if (discount > coupon.maxDiscount) discount = coupon.maxDiscount;

  res.json({
    valid: true,
    code: coupon.code,
    discountAmount: discount,
    discountPercentage: coupon.discountPercentage,
  });
});

// Auth - Customer Registration
app.post('/api/auth/register', (req, res) => {
  const { email, password, fullName, phone } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Full name, email, and password are required' });
  }

  // Prevent customer registration under admin email
  if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return res.status(400).json({
      error: 'This email is reserved and cannot be registered as a standard customer account.',
    });
  }

  const existing = USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email: email.trim().toLowerCase(),
    fullName: fullName.trim(),
    phone: phone || '',
    role: 'customer',
    savedAddresses: [],
  };

  USERS.push(newUser);
  res.status(201).json({
    user: newUser,
    token: `jwt-customer-${newUser.id}-${Date.now()}`,
  });
});

// Auth - Standard Customer / General Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Admin login check with exact required credentials
  if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
    if (password === ADMIN_PASSWORD) {
      const adminUser = USERS.find((u) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase())!;
      return res.json({
        user: adminUser,
        token: `jwt-admin-${adminUser.id}`,
      });
    } else {
      return res.status(401).json({ error: 'Incorrect password for administrator account.' });
    }
  }

  // Customer account login
  const user = USERS.find((u) => u.email.toLowerCase() === cleanEmail && u.role === 'customer');
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    user,
    token: `jwt-${user.id}-${Date.now()}`,
  });
});

// Auth - Dedicated Admin Portal Login
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Administrator email and password required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
    return res.status(403).json({
      error: 'Access denied. Invalid administrator credentials or unauthorized email.',
    });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      error: 'Invalid administrator password. Please check your credentials.',
    });
  }

  const adminUser = USERS.find((u) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase())!;
  res.json({
    user: adminUser,
    token: `jwt-admin-${adminUser.id}`,
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (authHeader.includes('jwt-admin')) {
    const admin = USERS.find((u) => u.role === 'admin');
    return res.json({ user: admin });
  }

  // fallback to demo or first user
  res.json({ user: USERS[1] || USERS[0] });
});

// Cart APIs
app.get('/api/cart/:cartId', (req, res) => {
  const items = CARTS.get(req.params.cartId) || [];
  const subtotal = items.reduce((sum, item) => sum + item.itemSubtotal, 0);
  res.json({ items, subtotal });
});

app.post('/api/cart/:cartId/items', (req, res) => {
  const { cartId } = req.params;
  const { productId, quantity, customization } = req.body;

  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!customization || !customization.occasion) {
    return res.status(400).json({ error: 'Occasion selection is required' });
  }

  // Validate message length if hasMessage is true
  if (customization.hasMessage && customization.cakeMessage) {
    if (customization.cakeMessage.length > 60) {
      return res.status(400).json({ error: 'Cake message must not exceed 60 characters' });
    }
  }

  // Server-side calculation of unit price based on selected weight
  const multiplier = getWeightMultiplier(customization.weight || '0.5 kg');
  const unitPrice = Math.round(product.basePrice * multiplier);
  const qty = Math.max(1, Number(quantity || 1));
  const itemSubtotal = unitPrice * qty;

  const newItem: CartItem = {
    id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    productId: product.id,
    productName: product.name,
    productImage: product.image,
    unitPrice,
    quantity: qty,
    customization: {
      occasion: customization.occasion,
      weight: customization.weight || '0.5 kg',
      flavour: customization.flavour || product.supportedFlavours[0] || 'Vanilla',
      isEggless: !!customization.isEggless,
      hasMessage: !!customization.hasMessage,
      cakeMessage: customization.hasMessage ? customization.cakeMessage : null,
      photoUrl: customization.photoUrl || null,
      specialInstructions: customization.specialInstructions || '',
      deliveryDate: customization.deliveryDate || '',
      deliveryTimeSlot: customization.deliveryTimeSlot || '',
    },
    itemSubtotal,
  };

  const currentItems = CARTS.get(cartId) || [];
  currentItems.push(newItem);
  CARTS.set(cartId, currentItems);

  res.status(201).json({ item: newItem, items: currentItems });
});

app.put('/api/cart/:cartId/items/:itemId', (req, res) => {
  const { cartId, itemId } = req.params;
  const { quantity } = req.body;

  const currentItems = CARTS.get(cartId) || [];
  const item = currentItems.find((i) => i.id === itemId);
  if (!item) {
    return res.status(404).json({ error: 'Cart item not found' });
  }

  const qty = Math.max(1, Number(quantity));
  item.quantity = qty;
  item.itemSubtotal = item.unitPrice * qty;

  CARTS.set(cartId, currentItems);
  res.json({ item, items: currentItems });
});

app.delete('/api/cart/:cartId/items/:itemId', (req, res) => {
  const { cartId, itemId } = req.params;
  let currentItems = CARTS.get(cartId) || [];
  currentItems = currentItems.filter((i) => i.id !== itemId);
  CARTS.set(cartId, currentItems);
  res.json({ success: true, items: currentItems });
});

app.delete('/api/cart/:cartId', (req, res) => {
  CARTS.delete(req.params.cartId);
  res.json({ success: true, message: 'Cart cleared' });
});

// Orders & Checkout
app.post('/api/orders', (req, res) => {
  const {
    userId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items,
    couponCode,
    paymentMethod,
    deliveryDate,
    deliveryTimeSlot,
  } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !items.length) {
    return res.status(400).json({ error: 'All customer, address and item details are required' });
  }

  // Server-side recalculate subtotal
  let calculatedSubtotal = 0;
  const orderItems = items.map((it: CartItem) => {
    const prod = PRODUCTS.find((p) => p.id === it.productId);
    const base = prod ? prod.basePrice : 599;
    const mult = getWeightMultiplier(it.customization?.weight || '0.5 kg');
    const unitPrice = Math.round(base * mult);
    const subtotal = unitPrice * it.quantity;
    calculatedSubtotal += subtotal;

    return {
      id: `ord-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: it.productId,
      productName: it.productName,
      productImage: it.productImage,
      unitPrice,
      quantity: it.quantity,
      itemSubtotal: subtotal,
      customization: it.customization,
    };
  });

  // Calculate discount
  let discountAmount = 0;
  if (couponCode) {
    const coupon = COUPONS.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (coupon && calculatedSubtotal >= coupon.minOrderValue) {
      discountAmount = Math.round((calculatedSubtotal * coupon.discountPercentage) / 100);
      if (discountAmount > coupon.maxDiscount) discountAmount = coupon.maxDiscount;
    }
  }

  // Delivery fee: free above 999 else 50
  const deliveryFee = calculatedSubtotal >= 999 ? 0 : 50;
  const taxAmount = Math.round((calculatedSubtotal - discountAmount) * 0.05);
  const grandTotal = calculatedSubtotal - discountAmount + deliveryFee + taxAmount;

  const orderNum = `TBC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: orderNum,
    userId: userId || null,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items: orderItems,
    subtotal: calculatedSubtotal,
    discountAmount,
    couponCode: couponCode || null,
    deliveryFee,
    taxAmount,
    grandTotal,
    paymentMethod: paymentMethod || 'COD',
    paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
    orderStatus: 'Confirmed',
    deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
    deliveryTimeSlot: deliveryTimeSlot || 'Afternoon Delight (12:00 PM - 04:00 PM)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  ORDERS.unshift(newOrder);

  // Decrement stock
  orderItems.forEach((oi: any) => {
    const prod = PRODUCTS.find((p) => p.id === oi.productId);
    if (prod && prod.stock > 0) {
      prod.stock = Math.max(0, prod.stock - oi.quantity);
    }
  });

  res.status(201).json({ order: newOrder });
});

app.get('/api/orders', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userOrders = ORDERS.filter((o) => o.userId === userId);
    return res.json({ orders: userOrders });
  }
  res.json({ orders: ORDERS });
});

app.get('/api/orders/:id', (req, res) => {
  const order = ORDERS.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = ORDERS.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  order.orderStatus = status;
  order.updatedAt = new Date().toISOString();
  res.json({ order });
});

// Admin Stats
app.get('/api/admin/stats', (_req, res) => {
  const totalSales = ORDERS.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrders = ORDERS.length;
  const pendingOrders = ORDERS.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Preparing').length;
  const lowStockProducts = PRODUCTS.filter((p) => p.stock <= 10);

  res.json({
    totalSales,
    totalOrders,
    pendingOrders,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    recentOrders: ORDERS.slice(0, 5),
  });
});

// Image Upload Mock / Data URI handler
app.post('/api/upload', (req, res) => {
  const { dataUrl } = req.body;
  if (!dataUrl) {
    return res.status(400).json({ error: 'dataUrl required' });
  }
  // Returns base64 or stored URL
  res.json({ url: dataUrl });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving Setup
// -------------------------------------------------------------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[The Baker's Corner] Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
