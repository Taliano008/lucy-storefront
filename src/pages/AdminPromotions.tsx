import { useState, type ReactNode } from 'react';
import { ImagePanel } from '../components/ImageEditor';
import { Marquee } from '../components/Marquee';
import { PromoBanners } from '../components/PromoBanners';
import { ProductImage } from '../components/ProductImage';
import { DEFAULT_PROMOS, MAX_SLIDES, type Banner } from '../data';
import { PROMO_LINKS } from '../lib/useCatalogue';
import { useProducts } from '../store';

/** Banner photos display up to ~750px wide; 1200px keeps them sharp without filling browser storage. */
const BANNER_PHOTO_EDGE = 1200;
const SPEEDS = [4, 6, 8, 10];

function OnOff({ on, label, onChange }: { on: boolean; label: string; onChange: (on: boolean) => void }) {
  return (
    <button type="button" className="stock-toggle" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}>
      <span className={'switch' + (on ? ' is-on' : '')}><span /></span>
      {on ? 'Showing' : 'Hidden'}
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="pfield">
      <span className="pfield__label">
        {label}
        {hint && <span className="muted"> · {hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Card({ title, on, onToggle, children }: { title: string; on: boolean; onToggle: (on: boolean) => void; children: ReactNode }) {
  return (
    <section className={'pcard' + (on ? '' : ' is-off')} aria-label={title}>
      <div className="pcard__head">
        <h2>{title}</h2>
        <OnOff on={on} label={`Show ${title}`} onChange={onToggle} />
      </div>
      <fieldset className="pcard__body" disabled={!on}>
        {children}
      </fieldset>
    </section>
  );
}

function BannerFields({ b, set, name }: { b: Banner; set: (c: Partial<Banner>) => void; name: string }) {
  return (
    <>
      <Field label="Label" hint="small sticker, optional">
        <input className="field" value={b.sticker} maxLength={24} onChange={(e) => set({ sticker: e.target.value.toUpperCase() })} />
      </Field>
      <Field label="Headline">
        <input className="field field--bold" value={b.title} maxLength={60} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Subtitle" hint="optional">
        <input className="field" value={b.subtitle} maxLength={60} onChange={(e) => set({ subtitle: e.target.value })} />
      </Field>
      <div className="pfield-row">
        <Field label="Button text" hint="empty = no button">
          <input className="field" value={b.button} maxLength={24} onChange={(e) => set({ button: e.target.value })} />
        </Field>
        <Field label="Button opens">
          <select className="field" value={b.link} onChange={(e) => set({ link: e.target.value })} aria-label={`${name} button opens`}>
            {PROMO_LINKS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </Field>
      </div>
    </>
  );
}

/** One slide in the slideshow list: a compact summary row, expanded into the full editor when selected. */
function SlideEditor({
  b,
  n,
  total,
  open,
  onOpen,
  photoError,
  setPhotoError,
}: {
  b: Banner;
  n: number;
  total: number;
  open: boolean;
  onOpen: () => void;
  photoError: string;
  setPhotoError: (msg: string) => void;
}) {
  const { patchSlide, removeSlide, moveSlide } = useProducts();
  const set = (c: Partial<Banner>) => patchSlide(b.id, c);
  const name = `Slide ${n}`;
  const isDefaultFile = b.photo === DEFAULT_PROMOS.slides[0].photo;

  return (
    <div className={'slide-ed' + (open ? ' is-open' : '') + (b.on ? '' : ' is-off')}>
      <div className="slide-ed__head">
        <button type="button" className="slide-ed__summary" aria-expanded={open} onClick={onOpen}>
          <ProductImage className="slide-ed__thumb" src={b.photo || undefined} alt="" />
          <span className="slide-ed__titles">
            <span className="slide-ed__n">{name}{b.on ? '' : ' · hidden'}</span>
            <span className="slide-ed__title">{b.title || 'Untitled'}</span>
          </span>
        </button>
        <div className="slide-ed__tools">
          <button type="button" className="icon-btn" aria-label={`Move ${name} earlier`} disabled={n === 1} onClick={() => moveSlide(b.id, -1)}>↑</button>
          <button type="button" className="icon-btn" aria-label={`Move ${name} later`} disabled={n === total} onClick={() => moveSlide(b.id, 1)}>↓</button>
          <OnOff on={b.on} label={`Show ${name}`} onChange={(on) => set({ on })} />
        </div>
      </div>

      {open && (
        <div className="slide-ed__body">
          <BannerFields b={b} set={set} name={name} />
          <div className="pfield">
            <span className="pfield__label">
              Photo <span className="muted">· fills the whole banner; text sits on the left, so keep the subject centre or right</span>
            </span>
            <ImagePanel
              p={{ name: name.toLowerCase(), img: b.photo || undefined }}
              setImg={(photo) => set({ photo: photo ?? '' })}
              error={photoError}
              setError={setPhotoError}
              maxEdge={BANNER_PHOTO_EDGE}
            />
            {n === 1 && b.id === DEFAULT_PROMOS.slides[0].id && !isDefaultFile && (
              <button type="button" className="link-btn pfield__reset" onClick={() => set({ photo: DEFAULT_PROMOS.slides[0].photo })}>
                Use the default photo file (public/promo/glow-up.jpg)
              </button>
            )}
          </div>
          {total > 1 && (
            <button
              type="button"
              className="link-btn img-panel__remove"
              onClick={() => window.confirm(`Delete ${name} ("${b.title}")?`) && removeSlide(b.id)}
            >
              Delete this slide
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminPromotions() {
  const { promos, patchPromo, addSlide, resetPromos } = useProducts();
  const { marquee, carousel, slides, side } = promos;
  const [openId, setOpenId] = useState<string>(slides[0]?.id ?? '');
  const [photoErrors, setPhotoErrors] = useState<Record<string, string>>({});
  const visible = slides.filter((s) => s.on).length;

  return (
    <div className="promo-admin">
      <section className="promo-preview" aria-label="Live preview">
        <div className="promo-preview__head">
          <h2>Live preview</h2>
          <span className="muted">How the top of the shop looks with your changes. Use the arrows to flip through slides.</span>
        </div>
        <div className="promo-preview__frame">
          <Marquee />
          <PromoBanners focusSlideId={openId} />
          {!marquee.on && !(carousel.on && visible) && !side.on && <p className="promo-preview__empty">All promotions are hidden.</p>}
        </div>
      </section>

      <div className="promo-grid">
        <Card title="Main banner" on={carousel.on} onToggle={(on) => patchPromo('carousel', { on })}>
          <div className="slides-bar">
            <span className="muted">
              {slides.length} slide{slides.length === 1 ? '' : 's'}
              {visible > 1 ? ' — rotates automatically' : ''}
            </span>
            {visible > 1 && (
              <label className="slides-bar__speed">
                Change every
                <select className="field" value={carousel.seconds} onChange={(e) => patchPromo('carousel', { seconds: Number(e.target.value) })}>
                  {SPEEDS.map((s) => <option key={s} value={s}>{s} seconds</option>)}
                </select>
              </label>
            )}
          </div>

          {slides.map((s, i) => (
            <SlideEditor
              key={s.id}
              b={s}
              n={i + 1}
              total={slides.length}
              open={openId === s.id}
              onOpen={() => setOpenId(openId === s.id ? '' : s.id)}
              photoError={photoErrors[s.id] ?? ''}
              setPhotoError={(msg) => setPhotoErrors((m) => ({ ...m, [s.id]: msg }))}
            />
          ))}

          <button
            type="button"
            className="pill-outline add-slide"
            disabled={slides.length >= MAX_SLIDES}
            onClick={() => {
              const id = addSlide();
              if (id) setOpenId(id);
            }}
          >
            + Add slide
          </button>
          {slides.length >= MAX_SLIDES && <span className="muted add-slide__note">Up to {MAX_SLIDES} slides — delete one to add another.</span>}
        </Card>

        <div className="promo-grid__col">
          <Card title="Side banner" on={side.on} onToggle={(on) => patchPromo('side', { on })}>
            <BannerFields b={side} set={(c) => patchPromo('side', c)} name="Side banner" />
          </Card>

          <Card title="Top strip" on={marquee.on} onToggle={(on) => patchPromo('marquee', { on })}>
            <Field label="Announcement" hint="scrolls across the top of every page">
              <textarea
                className="field field--area"
                rows={3}
                maxLength={160}
                value={marquee.text}
                onChange={(e) => patchPromo('marquee', { text: e.target.value })}
              />
            </Field>
          </Card>

          <button
            type="button"
            className="pill-outline promo-reset"
            onClick={() => {
              if (window.confirm('Reset all promotions to the original banners? Your slides and changes will be lost.')) {
                resetPromos();
                setOpenId(DEFAULT_PROMOS.slides[0].id);
                setPhotoErrors({});
              }
            }}
          >
            Reset promotions to default
          </button>
        </div>
      </div>
    </div>
  );
}
