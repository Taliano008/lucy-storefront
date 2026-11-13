import { useEffect, useRef } from 'react';
import { FilterSidebar, MobileFilters, SortSelect } from '../components/Filters';
import { Footer, Newsletter } from '../components/Footer';
import { Header } from '../components/Header';
import { Marquee } from '../components/Marquee';
import { Pagination } from '../components/Pagination';
import { ProductCard } from '../components/ProductCard';
import { PromoBanners } from '../components/PromoBanners';
import { MOBILE_QUERY, navigate, useMediaQuery } from '../lib/hooks';
import { useCatalogue } from '../lib/useCatalogue';
import { useProducts } from '../store';

export function Storefront({ route, tick }: { route: string; tick: number }) {
  const { products } = useProducts();
  const c = useCatalogue(products);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const { filters, total, start } = c;
  const per = c.pageItems.length;
  const catalogueRef = useRef<HTMLElement>(null);
  const toCatalogue = () => catalogueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Every navigation (nav links, promo buttons, logo, breadcrumb) opens its catalogue view.
  // "#/" is home: reset filters and stay at the top. Anything else also scrolls to the products.
  useEffect(() => {
    if (tick === 0 && route === '') return;
    c.applyPreset(route || 'shop');
    if (route) requestAnimationFrame(toCatalogue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, tick]);

  return (
    <div className="store">
      <Marquee />
      <Header q={filters.q} onQ={(q) => c.update({ q })} products={products} />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="#/" onClick={navigate}>Home</a><span aria-hidden="true">›</span><span className="crumbs__here">Shop</span>
      </nav>

      <PromoBanners />

      {isMobile ? (
        <section className="catalogue-mobile" id="catalogue" ref={catalogueRef}>
          <MobileFilters filters={filters} toggleCat={c.toggleCat} update={c.update} />
          <div className="mobile-count">{total} products</div>
          {total === 0 && <EmptyState onClear={c.clearAll} />}
          <div className="grid grid--2">
            {c.mobileItems.map((p) => <ProductCard key={p.id} p={p} compact />)}
          </div>
          {c.hasMore && (
            <div className="load-more">
              <button className="pill-outline pill-outline--block" onClick={c.loadMore}>Load more</button>
            </div>
          )}
        </section>
      ) : (
        <section className="catalogue" id="catalogue" ref={catalogueRef}>
          <FilterSidebar
            filters={filters}
            products={products}
            toggleCat={c.toggleCat}
            update={c.update}
            clearAll={c.clearAll}
          />
          <main className="catalogue__main">
            <div className="catalogue__bar">
              <h1>{filters.cats.length === 1 ? filters.cats[0] : 'Shop all'}</h1>
              <div className="catalogue__meta">
                <span>{total ? `Showing ${start + 1}-${start + per} of ${total} Products` : '0 Products'}</span>
                <label className="sort-label">
                  Sort by:
                  <SortSelect value={filters.sort} onChange={(sort) => c.update({ sort })} />
                </label>
              </div>
            </div>
            {total === 0 && <EmptyState onClear={c.clearAll} />}
            <div className="grid grid--3">
              {c.pageItems.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
            <Pagination
              page={c.page}
              nPages={c.nPages}
              setPage={(n) => {
                c.setPage(n);
                toCatalogue();
              }}
            />
          </main>
        </section>
      )}

      <Newsletter />
      <Footer />
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="empty">
      <div className="empty__title">Nothing matches those filters</div>
      <button className="pill pill--forest" onClick={onClear}>Clear filters</button>
    </div>
  );
}
