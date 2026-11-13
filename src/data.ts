import { config } from './config';

export type Badge = '' | 'CAMPUS STEAL' | 'HOT DEAL' | 'HOSTEL ESSENTIAL' | 'NEW';

export interface Product {
  id: number;
  name: string;
  cat: Category;
  price: number;
  /** Original price; 0 when the item isn't discounted. */
  orig: number;
  badge: Badge;
  inStock: boolean;
  /** Product photo: an uploaded image (data: URL, stored in the browser) or a link to a hosted image. */
  img?: string;
}

export const CATEGORIES = [
  'Bedsitter Kitchen',
  'Hostel Storage',
  'Aesthetic Lighting',
  'Cleaning & Laundry',
  'Bedding & Comfort',
  'Smart Tech & Study',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const BADGES: { value: Badge; label: string }[] = [
  { value: '', label: 'None' },
  { value: 'CAMPUS STEAL', label: 'Campus Steal' },
  { value: 'HOT DEAL', label: 'Hot Deal' },
  { value: 'HOSTEL ESSENTIAL', label: 'Hostel Essential' },
  { value: 'NEW', label: 'New' },
];

export const BUDGETS: { label: string; min: number; max: number }[] = [
  { label: 'Under KES 500', min: 0, max: 499 },
  { label: 'KES 500 - 1,500', min: 500, max: 1500 },
  { label: 'KES 1,500 - 3,000+', min: 1501, max: Infinity },
];

export type Availability = 'in' | 'out';
export const AVAILABILITY: { value: Availability; label: string; short: string }[] = [
  { value: 'in', label: 'In Stock Now', short: 'In Stock Now' },
  { value: 'out', label: 'Pre-order / Restocking', short: 'Pre-order' },
];

export type SortKey = 'low' | 'high' | 'new' | 'disc';
export const SORTS: { value: SortKey; label: string; short: string }[] = [
  { value: 'low', label: 'Price: Low to High', short: 'Price: Low-High' },
  { value: 'high', label: 'Price: High to Low', short: 'Price: High-Low' },
  { value: 'new', label: 'Newest Campus Arrivals', short: 'Newest' },
  { value: 'disc', label: 'Biggest Discount %', short: 'Biggest %' },
];

// Sample catalogue from the design. Higher id = newer arrival.
const SEED: [string, Category, number, number, Badge, boolean][] = [
  ['Electric Kettle 1.8L', 'Bedsitter Kitchen', 950, 1500, 'CAMPUS STEAL', true],
  ['2-Burner Gas Stove', 'Bedsitter Kitchen', 2800, 3600, '', true],
  ['Non-Stick Sufuria Set (3pc)', 'Bedsitter Kitchen', 1450, 2000, 'HOSTEL ESSENTIAL', true],
  ['Mini Blender 600ml', 'Bedsitter Kitchen', 1900, 0, 'NEW', false],
  ['Canvas Wardrobe, 2-Door', 'Hostel Storage', 2400, 3200, 'CAMPUS STEAL', true],
  ['4-Tier Shoe Rack', 'Hostel Storage', 850, 1200, '', true],
  ['Under-Bed Storage Box', 'Hostel Storage', 650, 0, '', true],
  ['LED Strip Lights 5m', 'Aesthetic Lighting', 450, 800, 'HOT DEAL', true],
  ['Sunset Projection Lamp', 'Aesthetic Lighting', 1200, 1800, 'NEW', true],
  ['Fairy Curtain Lights', 'Aesthetic Lighting', 700, 0, '', false],
  ['Laundry Basin 40L', 'Cleaning & Laundry', 350, 450, '', true],
  ['Spin Mop & Bucket', 'Cleaning & Laundry', 1650, 2400, 'HOT DEAL', true],
  ['Clothes Pegs (48pc)', 'Cleaning & Laundry', 180, 0, '', true],
  ['4x6 Duvet + 2 Pillowcases', 'Bedding & Comfort', 2200, 3500, 'CAMPUS STEAL', true],
  ['Fibre Pillow Pair', 'Bedding & Comfort', 900, 1300, '', true],
  ['Cotton Bedsheet Set 4x6', 'Bedding & Comfort', 1100, 0, 'NEW', false],
  ['4-Way Extension Cable 3m', 'Smart Tech & Study', 480, 750, 'HOSTEL ESSENTIAL', true],
  ['Rechargeable Study Lamp', 'Smart Tech & Study', 1350, 1900, '', true],
];

export const SEED_PRODUCTS: Product[] = SEED.map(([name, cat, price, orig, badge, inStock], id) => ({
  id, name, cat, price, orig, badge, inStock,
}));

/** A promo banner on the storefront. Edited from Admin Studio → Promotions. */
export interface Banner {
  id: string;
  on: boolean;
  /** Small rotated label, e.g. "PROMO". Empty = no label. */
  sticker: string;
  title: string;
  /** Optional line under the title. */
  subtitle: string;
  button: string;
  /** Storefront view the button opens — a key from PROMO_LINKS. */
  link: string;
  /** Photo (main banner slides): uploaded data: URL, https link, or a file in /public. */
  photo: string;
}

export interface Promos {
  marquee: { on: boolean; text: string };
  /** The main banner: one or more slides that rotate every `seconds`. */
  carousel: { on: boolean; seconds: number };
  slides: Banner[];
  side: Banner;
}

/** Each slide's photo is ~60–150 KB in browser storage, so keep the slideshow small. */
export const MAX_SLIDES = 6;

export const newSlideId = () => 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const BLANK_SLIDE: Omit<Banner, 'id'> = {
  on: true,
  sticker: 'NEW',
  title: 'New promotion',
  subtitle: '',
  button: 'Shop now',
  link: 'deals',
  photo: '',
};

export const DEFAULT_PROMOS: Promos = {
  marquee: { on: true, text: config.marqueeText },
  carousel: { on: true, seconds: 6 },
  slides: [
    {
      id: 'glow-up',
      on: true,
      sticker: 'PROMO',
      title: 'Bedsitter Glow-Up Under KES 3,000',
      subtitle: '',
      button: 'Shop the deal',
      link: 'glow-up',
      photo: config.promoPhoto,
    },
  ],
  side: {
    id: 'side',
    on: true,
    sticker: 'HOLIDAY DISCOUNT',
    title: 'Back-to-Campus Essentials',
    subtitle: 'Hostel Starter Packs',
    button: 'View packs',
    link: 'starter-packs',
    photo: '',
  },
};
