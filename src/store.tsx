import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { CATEGORIES, SEED_PRODUCTS, type Product } from './data';

const KEY = 'lucy.products.v1';

function load(): Product[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Product[];
    }
  } catch {
    /* storage unavailable or corrupt — fall back to seed */
  }
  return SEED_PRODUCTS;
}

interface Store {
  products: Product[];
  patch: (id: number, change: Partial<Product>) => void;
  /** Add a blank, out-of-stock product (newest arrival) and return its id. */
  add: () => number;
  /** True when the last save failed because browser storage is full (usually too many uploaded photos). */
  storageFull: boolean;
}

const Ctx = createContext<Store | null>(null);

/** Shared product catalogue. Admin edits persist locally and sync across open tabs. */
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(load);
  const [storageFull, setStorageFull] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(products));
      setStorageFull(false);
    } catch (e) {
      // QuotaExceededError: edits still apply for this session but won't survive a reload.
      setStorageFull(e instanceof DOMException && /quota/i.test(e.name));
    }
  }, [products]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setProducts(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const patch = useCallback((id: number, change: Partial<Product>) => {
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, ...change } : p)));
  }, []);

  const add = useCallback(() => {
    const id = Math.max(-1, ...products.map((p) => p.id)) + 1;
    const fresh: Product = { id, name: 'New product', cat: CATEGORIES[0], price: 0, orig: 0, badge: 'NEW', inStock: false };
    setProducts((list) => [fresh, ...list]);
    return id;
  }, [products]);

  return <Ctx.Provider value={{ products, patch, add, storageFull }}>{children}</Ctx.Provider>;
}

export function useProducts() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useProducts must be used inside ProductsProvider');
  return s;
}
