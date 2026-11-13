import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type SetStateAction } from 'react';
import { BLANK_SLIDE, CATEGORIES, DEFAULT_PROMOS, MAX_SLIDES, SEED_PRODUCTS, newSlideId, type Banner, type Product, type Promos } from './data';

const PRODUCTS_KEY = 'lucy.products.v1';
const PROMOS_KEY = 'lucy.promos.v1';

function load<T>(key: string, fallback: T, parse: (raw: unknown) => T | null): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return parse(JSON.parse(raw)) ?? fallback;
  } catch {
    /* storage unavailable or corrupt — fall back */
  }
  return fallback;
}

/**
 * State mirrored to localStorage and synced across tabs. Only written after a local edit, so
 * visitors who never edit keep following the defaults shipped in the code.
 * `full` = the last save hit the browser's storage quota.
 */
function usePersisted<T>(key: string, fallback: T, parse: (raw: unknown) => T | null) {
  const [value, setValue] = useState<T>(() => load(key, fallback, parse));
  const [full, setFull] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    if (!dirty.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setFull(false);
    } catch (e) {
      // QuotaExceededError: edits still apply for this session but won't survive a reload.
      setFull(e instanceof DOMException && /quota/i.test(e.name));
    }
  }, [key, value]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(load(key, fallback, parse));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, fallback, parse]);

  const set = useCallback((u: SetStateAction<T>) => {
    dirty.current = true;
    setValue(u);
  }, []);

  /** Forget local edits and go back to the shipped defaults. */
  const reset = useCallback(() => {
    dirty.current = false;
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setFull(false);
    setValue(fallback);
  }, [key, fallback]);

  return { value, set, reset, full };
}

const parseProducts = (raw: unknown) => (Array.isArray(raw) ? (raw as Product[]) : null);

/**
 * Merge saved promos over the defaults so fields added later still get a value.
 * Also upgrades the older single-banner format ({ main }) to a one-slide slideshow.
 */
const parsePromos = (raw: unknown): Promos | null => {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<Promos> & { main?: Partial<Banner> };
  const base = DEFAULT_PROMOS.slides[0];
  const slides = Array.isArray(r.slides)
    ? r.slides.map((s, i) => ({ ...BLANK_SLIDE, ...s, id: s?.id || 'slide' + i }))
    : r.main
      ? [{ ...base, ...r.main, on: true, id: base.id }]
      : DEFAULT_PROMOS.slides;
  return {
    marquee: { ...DEFAULT_PROMOS.marquee, ...r.marquee },
    carousel: { ...DEFAULT_PROMOS.carousel, ...(r.main && !r.carousel ? { on: r.main.on ?? true } : {}), ...r.carousel },
    slides: slides.slice(0, MAX_SLIDES),
    side: { ...DEFAULT_PROMOS.side, ...r.side },
  };
};

interface Store {
  products: Product[];
  patch: (id: number, change: Partial<Product>) => void;
  /** Add a blank, out-of-stock product (newest arrival) and return its id. */
  add: () => number;
  promos: Promos;
  /** Merge changes into one section of the promotions (marquee, carousel settings or side banner). */
  patchPromo: <K extends 'marquee' | 'carousel' | 'side'>(section: K, change: Partial<Promos[K]>) => void;
  patchSlide: (id: string, change: Partial<Banner>) => void;
  /** Append a blank slide (up to MAX_SLIDES); returns its id, or null when full. */
  addSlide: () => string | null;
  removeSlide: (id: string) => void;
  /** Move a slide earlier (-1) or later (+1) in the slideshow. */
  moveSlide: (id: string, dir: -1 | 1) => void;
  resetPromos: () => void;
  /** True when the last save failed because browser storage is full (usually too many uploaded photos). */
  storageFull: boolean;
}

const Ctx = createContext<Store | null>(null);

/** Shared catalogue + promotions. Admin edits persist locally and sync across open tabs. */
export function ProductsProvider({ children }: { children: ReactNode }) {
  const products = usePersisted(PRODUCTS_KEY, SEED_PRODUCTS, parseProducts);
  const promos = usePersisted(PROMOS_KEY, DEFAULT_PROMOS, parsePromos);
  const setProducts = products.set;
  const setPromos = promos.set;

  const patch = useCallback(
    (id: number, change: Partial<Product>) => setProducts((list) => list.map((p) => (p.id === id ? { ...p, ...change } : p))),
    [setProducts],
  );

  const add = useCallback(() => {
    const id = Math.max(-1, ...products.value.map((p) => p.id)) + 1;
    const fresh: Product = { id, name: 'New product', cat: CATEGORIES[0], price: 0, orig: 0, badge: 'NEW', inStock: false };
    setProducts((list) => [fresh, ...list]);
    return id;
  }, [products.value, setProducts]);

  const patchPromo = useCallback(
    <K extends 'marquee' | 'carousel' | 'side'>(section: K, change: Partial<Promos[K]>) =>
      setPromos((all) => ({ ...all, [section]: { ...all[section], ...change } })),
    [setPromos],
  );

  const patchSlide = useCallback(
    (id: string, change: Partial<Banner>) =>
      setPromos((all) => ({ ...all, slides: all.slides.map((s) => (s.id === id ? { ...s, ...change } : s)) })),
    [setPromos],
  );

  const addSlide = useCallback(() => {
    if (promos.value.slides.length >= MAX_SLIDES) return null;
    const id = newSlideId();
    setPromos((all) => ({ ...all, slides: [...all.slides, { ...BLANK_SLIDE, id }] }));
    return id;
  }, [promos.value.slides.length, setPromos]);

  const removeSlide = useCallback(
    (id: string) => setPromos((all) => ({ ...all, slides: all.slides.filter((s) => s.id !== id) })),
    [setPromos],
  );

  const moveSlide = useCallback(
    (id: string, dir: -1 | 1) =>
      setPromos((all) => {
        const i = all.slides.findIndex((s) => s.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= all.slides.length) return all;
        const slides = [...all.slides];
        [slides[i], slides[j]] = [slides[j], slides[i]];
        return { ...all, slides };
      }),
    [setPromos],
  );

  return (
    <Ctx.Provider
      value={{
        products: products.value,
        patch,
        add,
        promos: promos.value,
        patchPromo,
        patchSlide,
        addSlide,
        removeSlide,
        moveSlide,
        resetPromos: promos.reset,
        storageFull: products.full || promos.full,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useProducts() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useProducts must be used inside ProductsProvider');
  return s;
}
