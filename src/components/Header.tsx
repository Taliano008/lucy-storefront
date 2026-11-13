import { useState } from 'react';
import type { Product } from '../data';
import { kes } from '../lib/format';
import { navigate } from '../lib/hooks';
import { matchesQuery } from '../lib/useCatalogue';
import { Brand } from './Brand';

interface Props {
  q: string;
  onQ: (q: string) => void;
  products: Product[];
}

const NAV = [
  { label: 'Shop', href: '#/shop' },
  { label: 'Deals', href: '#/deals' },
  { label: 'Starter Packs', href: '#/starter-packs' },
];

function SearchIcon() {
  return <span className="search__icon" aria-hidden="true" />;
}

export function Header({ q, onQ, products }: Props) {
  const [focus, setFocus] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const showSuggest = focus && q.trim().length > 0;
  const suggestions = products.filter((p) => matchesQuery(p, q)).slice(0, 5);

  return (
    <>
      {/* Desktop */}
      <header className="header header--desktop">
        <Brand />
        <div className="header__search">
          <label className="search">
            <SearchIcon />
            <input
              type="search"
              value={q}
              onChange={(e) => onQ(e.target.value)}
              onFocus={() => setFocus(true)}
              onBlur={() => setTimeout(() => setFocus(false), 120)}
              placeholder="Search kettles, LED lights, duvets, sockets..."
              aria-label="Search products"
              role="combobox"
              aria-expanded={showSuggest}
              aria-controls="search-suggestions"
            />
          </label>
          {showSuggest && suggestions.length > 0 && (
            <div className="suggest" id="search-suggestions" role="listbox">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  role="option"
                  aria-selected={false}
                  className="suggest__item"
                  onMouseDown={() => {
                    onQ(p.name);
                    setFocus(false);
                  }}
                >
                  <span>{p.name}</span>
                  <span className="mono">{kes(p.price)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <nav className="header__nav">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} onClick={navigate}>{n.label}</a>
          ))}
        </nav>
      </header>

      {/* Mobile */}
      <header className="header header--mobile">
        <div className="header__row">
          <Brand small />
          <button
            className="menu-btn"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-menu" onClick={() => setMenuOpen(false)}>
            {NAV.map((n) => (
              <a key={n.label} href={n.href} onClick={navigate}>{n.label}</a>
            ))}
          </nav>
        )}
        <label className="search search--sm">
          <SearchIcon />
          <input
            type="search"
            value={q}
            onChange={(e) => onQ(e.target.value)}
            placeholder="Search kettles, LED lights, duvets..."
            aria-label="Search products"
          />
        </label>
      </header>
    </>
  );
}
