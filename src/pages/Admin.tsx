import { Fragment, useEffect, useRef, useState } from 'react';
import { ImagePanel, ThumbButton, uploadImage } from '../components/ImageEditor';
import { BADGES, CATEGORIES, type Badge, type Category } from '../data';
import { discountPct } from '../lib/format';
import { useProducts } from '../store';
import { AdminPromotions } from './AdminPromotions';

type Tab = 'products' | 'promotions';
const readTab = (): Tab => (window.location.hash === '#promotions' ? 'promotions' : 'products');

const COLS = ['PHOTO', 'PRODUCT', 'CATEGORY', 'PRICE (KES)', 'ORIGINAL (KES)', 'OFF', 'BADGE', 'STOCK'];

export function Admin() {
  const { products, patch, add, storageFull } = useProducts();
  const [tab, setTab] = useState<Tab>(readTab);
  const [imgOpen, setImgOpen] = useState<number | null>(null);

  // Tab lives in the URL (#promotions) so it survives reloads and can be bookmarked.
  useEffect(() => {
    const on = () => setTab(readTab());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const [imgError, setImgError] = useState({ id: -1, msg: '' });
  const errorFor = (id: number) => (imgError.id === id ? imgError.msg : '');
  const [aq, setAq] = useState('');
  const [newId, setNewId] = useState<number | null>(null);
  const newNameRef = useRef<HTMLInputElement>(null);

  // Focus and select the name of a just-added product so it can be typed straight away.
  useEffect(() => {
    if (newId == null || !newNameRef.current) return;
    newNameRef.current.scrollIntoView({ block: 'center' });
    newNameRef.current.focus();
    newNameRef.current.select();
  }, [newId]);
  const aql = aq.trim().toLowerCase();
  const rows = products.filter((p) => !aql || p.name.toLowerCase().includes(aql));

  const metrics = [
    { label: 'Total Active Items', value: products.filter((p) => p.inStock).length },
    { label: 'Out-of-Stock Items', value: products.filter((p) => !p.inStock).length },
    { label: 'Active Discounts', value: products.filter((p) => discountPct(p) > 0).length },
  ];
  const missingPhotos = products.filter((p) => !p.img).length;

  return (
    <div className="admin">
      <header className="admin__header">
        <div className="admin__brand">
          <span>Lucy</span>
          <span className="admin__tag">ADMIN STUDIO</span>
        </div>
        <div className="admin__actions">
          <a href="/" className="admin__view">View store</a>
          {tab === 'products' && (
            <button
              className="admin__new"
              onClick={() => {
                setAq('');
                setNewId(add());
              }}
            >
              + New product
            </button>
          )}
        </div>
      </header>

      <nav className="admin__tabs" aria-label="Admin sections">
        <a href="#products" className={tab === 'products' ? 'is-current' : ''} aria-current={tab === 'products' ? 'page' : undefined}>
          Products
        </a>
        <a href="#promotions" className={tab === 'promotions' ? 'is-current' : ''} aria-current={tab === 'promotions' ? 'page' : undefined}>
          Promotions
        </a>
      </nav>

      <div className="admin__body">
        {storageFull && (
          <p className="admin__alert" role="alert">
            Browser storage is full, so your latest changes will be lost on reload. Remove some uploaded photos or use
            image links instead.
          </p>
        )}

        {tab === 'promotions' ? (
          <AdminPromotions />
        ) : (
        <>
        <div className="metrics">
          {metrics.map((m) => (
            <div key={m.label} className="metric">
              <span className="metric__label">{m.label}</span>
              <span className="metric__value">{m.value}</span>
            </div>
          ))}
        </div>

        <div className="admin__bar">
          <h1>
            Products
            {missingPhotos > 0 && <span className="admin__hint">{missingPhotos} without photos — click a thumbnail to add one</span>}
          </h1>
          <input
            type="search"
            className="admin__search"
            value={aq}
            onChange={(e) => setAq(e.target.value)}
            placeholder="Find a product..."
            aria-label="Find a product"
          />
        </div>

        <div className="table-scroll">
          <div className="table" role="table" aria-label="Products">
            <div className="table__row table__row--head" role="row">
              {COLS.map((c, i) => <span key={i} role="columnheader">{c}</span>)}
            </div>
            {rows.map((p) => {
              const pct = discountPct(p);
              const setImg = (img: string | undefined) => patch(p.id, { img });
              const setError = (msg: string) => setImgError({ id: p.id, msg });
              const open = imgOpen === p.id;
              return (
                <Fragment key={p.id}>
                <div className={'table__row' + (open ? ' is-open' : '')} role="row">
                  <ThumbButton
                    p={p}
                    open={open}
                    onToggle={() => setImgOpen(open ? null : p.id)}
                    onFile={(f) =>
                      uploadImage(f, setImg, (msg) => {
                        setError(msg);
                        if (msg) setImgOpen(p.id); // surface the error in the panel
                      })
                    }
                  />
                  <input
                    ref={p.id === newId ? newNameRef : undefined}
                    className="field field--bold table__name"
                    aria-label={`Product ${p.id} name`}
                    value={p.name}
                    onChange={(e) => patch(p.id, { name: e.target.value })}
                  />
                  <select
                    className="field"
                    aria-label={`${p.name} category`}
                    value={p.cat}
                    onChange={(e) => patch(p.id, { cat: e.target.value as Category })}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    type="number"
                    min={0}
                    className="field field--bold"
                    aria-label={`${p.name} price`}
                    value={p.price || ''}
                    onChange={(e) => patch(p.id, { price: Number(e.target.value) || 0 })}
                  />
                  <input
                    type="number"
                    min={0}
                    className="field"
                    aria-label={`${p.name} original price`}
                    value={p.orig || ''}
                    onChange={(e) => patch(p.id, { orig: Number(e.target.value) || 0 })}
                  />
                  <span className="mono" role="cell">{pct ? `-${pct}%` : '—'}</span>
                  <select
                    className="field"
                    aria-label={`${p.name} badge`}
                    value={p.badge}
                    onChange={(e) => patch(p.id, { badge: e.target.value as Badge })}
                  >
                    {BADGES.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                  <button
                    className="stock-toggle"
                    role="switch"
                    aria-checked={p.inStock}
                    aria-label={`${p.name} in stock`}
                    onClick={() => patch(p.id, { inStock: !p.inStock })}
                  >
                    <span className={'switch' + (p.inStock ? ' is-on' : '')}><span /></span>
                    {p.inStock ? 'In stock' : 'Out of stock'}
                  </button>
                </div>
                {open && (
                  <ImagePanel
                    key={p.id}
                    p={p}
                    setImg={setImg}
                    error={errorFor(p.id)}
                    setError={setError}
                    onClose={() => setImgOpen(null)}
                  />
                )}
                </Fragment>
              );
            })}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
