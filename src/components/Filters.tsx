import { AVAILABILITY, BUDGETS, CATEGORIES, SORTS, type Availability, type Product, type SortKey } from '../data';
import type { Filters } from '../lib/useCatalogue';
import type { Category } from '../data';

interface Props {
  filters: Filters;
  products: Product[];
  toggleCat: (c: Category) => void;
  update: (f: Partial<Filters>) => void;
  clearAll: () => void;
}

export function FilterSidebar({ filters, products, toggleCat, update, clearAll }: Props) {
  return (
    <aside className="filters" aria-label="Filters">
      <div className="filters__head">
        <h2>Filters</h2>
        <button className="link-btn" onClick={clearAll}>Clear all</button>
      </div>
      <hr />
      <fieldset className="filters__group">
        <legend>Categories</legend>
        {CATEGORIES.map((c) => {
          const on = filters.cats.includes(c);
          return (
            <button key={c} className="check-row" aria-pressed={on} onClick={() => toggleCat(c)}>
              <span className={'checkbox' + (on ? ' is-on' : '')} />
              <span className="check-row__label">{c}</span>
              <span className="mono muted">{products.filter((p) => p.cat === c).length}</span>
            </button>
          );
        })}
      </fieldset>
      <hr />
      <fieldset className="filters__group">
        <legend>Student Budget</legend>
        <div className="chip-wrap">
          {BUDGETS.map((b, i) => (
            <button
              key={b.label}
              className={'chip' + (filters.budget === i ? ' is-lime' : '')}
              aria-pressed={filters.budget === i}
              onClick={() => update({ budget: filters.budget === i ? null : i })}
            >
              {b.label}
            </button>
          ))}
        </div>
      </fieldset>
      <hr />
      <fieldset className="filters__group">
        <legend>Availability</legend>
        {AVAILABILITY.map((a) => {
          const on = filters.avail === a.value;
          return (
            <button key={a.value} className="check-row" aria-pressed={on} onClick={() => update({ avail: on ? null : a.value })}>
              <span className={'checkbox checkbox--round' + (on ? ' is-on' : '')} />
              <span>{a.label}</span>
            </button>
          );
        })}
      </fieldset>
    </aside>
  );
}

export function SortSelect({ value, onChange, short = false }: { value: SortKey; onChange: (s: SortKey) => void; short?: boolean }) {
  return (
    <select className="select" value={value} onChange={(e) => onChange(e.target.value as SortKey)} aria-label="Sort by">
      {SORTS.map((s) => (
        <option key={s.value} value={s.value}>{short ? s.short : s.label}</option>
      ))}
    </select>
  );
}

/** Mobile: scrolling category chips + one row of compact dropdowns. */
export function MobileFilters({ filters, toggleCat, update }: Omit<Props, 'products' | 'clearAll'>) {
  return (
    <>
      <div className="chip-scroll" role="group" aria-label="Categories">
        {CATEGORIES.map((c) => {
          const on = filters.cats.includes(c);
          return (
            <button key={c} className={'chip chip--lg' + (on ? ' is-ink' : '')} aria-pressed={on} onClick={() => toggleCat(c)}>
              {c}
            </button>
          );
        })}
      </div>
      <div className="mobile-selects">
        <select
          className="select select--sm"
          aria-label="Budget"
          value={filters.budget == null ? '' : String(filters.budget)}
          onChange={(e) => update({ budget: e.target.value === '' ? null : Number(e.target.value) })}
        >
          <option value="">Budget: Any</option>
          {BUDGETS.map((b, i) => (
            <option key={b.label} value={i}>{b.label}</option>
          ))}
        </select>
        <select
          className="select select--sm"
          aria-label="Availability"
          value={filters.avail ?? ''}
          onChange={(e) => update({ avail: (e.target.value || null) as Availability | null })}
        >
          <option value="">Stock: All</option>
          {AVAILABILITY.map((a) => (
            <option key={a.value} value={a.value}>{a.short}</option>
          ))}
        </select>
        <div className="select-sm-wrap">
          <SortSelect short value={filters.sort} onChange={(sort) => update({ sort })} />
        </div>
      </div>
    </>
  );
}
