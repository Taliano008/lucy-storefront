import { useMemo, useState } from 'react';
import { config } from '../config';
import { BUDGETS, CATEGORIES, type Availability, type Category, type Product, type SortKey } from '../data';
import { discountPct } from './format';

export const matchesQuery = (p: Product, q: string) => {
  const ql = q.trim().toLowerCase();
  return !ql || `${p.name} ${p.cat} ${p.badge}`.toLowerCase().includes(ql);
};

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  new: (a, b) => b.id - a.id,
  disc: (a, b) => discountPct(b) - discountPct(a),
};

export interface Filters {
  q: string;
  cats: Category[];
  budget: number | null;
  avail: Availability | null;
  sort: SortKey;
}

const EMPTY: Filters = { q: '', cats: [], budget: null, avail: null, sort: 'new' };

/** Storefront routes (header nav, promo banners) and the catalogue view each one opens. */
export const PRESETS: Record<string, Partial<Filters>> = {
  shop: {},
  deals: { sort: 'disc' },
  'starter-packs': { cats: ['Bedsitter Kitchen', 'Hostel Storage', 'Bedding & Comfort'], avail: 'in', sort: 'low' },
  'glow-up': { cats: ['Aesthetic Lighting', 'Bedding & Comfort'], sort: 'low' },
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Filters for a route: a named preset, or "category/<slug>" for a single category. */
function presetFor(name: string): Partial<Filters> {
  if (name.startsWith('category/')) {
    const cat = CATEGORIES.find((c) => slug(c) === name.slice(9));
    return cat ? { cats: [cat] } : {};
  }
  return PRESETS[name] ?? {};
}

/** Where a promo banner button can send shoppers (Admin → Promotions). */
export const PROMO_LINKS: { value: string; label: string }[] = [
  { value: 'shop', label: 'All products' },
  { value: 'deals', label: 'Deals (biggest discount first)' },
  { value: 'starter-packs', label: 'Starter Packs (kitchen, storage, bedding)' },
  { value: 'glow-up', label: 'Glow-Up picks (lighting & bedding)' },
  ...CATEGORIES.map((c) => ({ value: 'category/' + slug(c), label: 'Category: ' + c })),
];

/** Search, filter, sort and paginate the catalogue. Any filter change resets paging. */
export function useCatalogue(products: Product[]) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [page, setPage] = useState(1);
  const [mobileN, setMobileN] = useState(config.mobilePageSize);

  const update = (change: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...change }));
    setPage(1);
    setMobileN(config.mobilePageSize);
  };

  const list = useMemo(() => {
    const { q, cats, budget, avail, sort } = filters;
    return products
      .filter(
        (p) =>
          matchesQuery(p, q) &&
          (!cats.length || cats.includes(p.cat)) &&
          (budget == null || (p.price >= BUDGETS[budget].min && p.price <= BUDGETS[budget].max)) &&
          (avail == null || p.inStock === (avail === 'in')),
      )
      .sort(sorters[sort]);
  }, [products, filters]);

  const per = config.pageSize;
  const total = list.length;
  const nPages = Math.max(1, Math.ceil(total / per));
  const current = Math.min(page, nPages);
  const start = (current - 1) * per;

  return {
    filters,
    update,
    toggleCat: (c: Category) =>
      update({ cats: filters.cats.includes(c) ? filters.cats.filter((x) => x !== c) : [...filters.cats, c] }),
    clearAll: () => update({ q: '', cats: [], budget: null, avail: null }),
    /** Replace all filters with a named preset (unknown names reset to the full catalogue). */
    applyPreset: (name: string) => update({ ...EMPTY, ...presetFor(name) }),
    total,
    start,
    page: current,
    nPages,
    setPage: (n: number) => setPage(Math.max(1, Math.min(nPages, n))),
    pageItems: list.slice(start, start + per),
    mobileItems: list.slice(0, mobileN),
    hasMore: total > mobileN,
    loadMore: () => setMobileN((n) => n + config.mobilePageSize),
  };
}
