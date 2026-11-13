import { useEffect, useRef, useState } from 'react';
import type { Banner } from '../data';
import { MOBILE_QUERY, navigate, useMediaQuery } from '../lib/hooks';
import { useProducts } from '../store';

/** Banner button: absolute so it also works from the admin preview (opens the storefront view). */
function BannerLink({ b, className, hidden }: { b: Banner; className: string; hidden?: boolean }) {
  if (!b.button.trim()) return null;
  return (
    <a href={'/#/' + b.link} onClick={navigate} className={className} tabIndex={hidden ? -1 : undefined}>
      {b.button}
    </a>
  );
}

/**
 * One main-banner slide. With a photo, the photo fills the whole banner and the text sits on a soft
 * dark fade on the left. Without one (or if the photo fails to load), it's the solid lime banner.
 */
function Slide({ b, className = '', hidden, label }: { b: Banner; className?: string; hidden?: boolean; label?: string }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [b.photo]);
  const photo = b.photo && !broken ? b.photo : '';

  return (
    <div
      className={'promo ' + (photo ? 'promo--photo' : 'promo--lime') + (className ? ' ' + className : '')}
      role={label ? 'group' : undefined}
      aria-roledescription={label ? 'slide' : undefined}
      aria-label={label}
      aria-hidden={hidden || undefined}
    >
      {photo && (
        <>
          <img className="promo__bg" src={photo} alt="" onError={() => setBroken(true)} />
          <div className="promo__scrim" aria-hidden="true" />
        </>
      )}
      <div className="promo__body">
        {b.sticker && <span className={'sticker ' + (photo ? 'sticker--lime' : 'sticker--ink')}>{b.sticker}</span>}
        <h2>{b.title}</h2>
        {b.subtitle && <p className="promo__sub">{b.subtitle}</p>}
        <BannerLink b={b} hidden={hidden} className={'pill ' + (photo ? 'pill--lime' : 'pill--forest')} />
      </div>
    </div>
  );
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Desktop slideshow: auto-advances every `seconds`, pauses on hover/keyboard focus, and doesn't
 * auto-advance for visitors who ask for reduced motion. `focusId` (admin preview) pins a slide.
 */
function Carousel({ slides, seconds, focusId }: { slides: Banner[]; seconds: number; focusId?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const current = Math.min(index, n - 1);
  const go = (i: number) => setIndex(((i % n) + n) % n);
  const rootRef = useRef<HTMLElement>(null);

  // Admin preview: jump to the slide being edited.
  useEffect(() => {
    if (!focusId) return;
    const i = slides.findIndex((s) => s.id === focusId);
    if (i >= 0) setIndex(i);
  }, [focusId, slides]);

  useEffect(() => {
    if (focusId || paused || n < 2 || prefersReducedMotion()) return;
    const t = window.setTimeout(() => go(current + 1), Math.max(3, seconds) * 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, paused, n, seconds, focusId]);

  return (
    <section
      ref={rootRef}
      className="promo-carousel"
      aria-roledescription="carousel"
      aria-label="Promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !rootRef.current?.contains(e.relatedTarget as Node) && setPaused(false)}
    >
      <div className="promo-carousel__track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((s, i) => (
          <Slide key={s.id} b={s} className="promo-carousel__slide" hidden={i !== current} label={`${i + 1} of ${n}`} />
        ))}
      </div>
      <button type="button" className="promo-carousel__arrow is-prev" aria-label="Previous promotion" onClick={() => go(current - 1)}>
        ‹
      </button>
      <button type="button" className="promo-carousel__arrow is-next" aria-label="Next promotion" onClick={() => go(current + 1)}>
        ›
      </button>
      <div className="promo-carousel__dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={'promo-carousel__dot' + (i === current ? ' is-current' : '')}
            aria-label={`Show promotion ${i + 1}: ${s.title}`}
            aria-current={i === current || undefined}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Promotional slots: the main banner (one slide, or a slideshow) and the side banner.
 * Content is edited in Admin Studio → Promotions. On phones every slide is its own swipeable card.
 */
export function PromoBanners({ focusSlideId }: { focusSlideId?: string }) {
  const { carousel, slides: all, side } = useProducts().promos;
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const slides = carousel.on ? all.filter((s) => s.on) : [];
  if (!slides.length && !side.on) return null;

  return (
    <section className={'promos' + (slides.length && side.on ? '' : ' promos--single')} aria-label="Promotions">
      {slides.length === 1 || (isMobile && slides.length > 0) ? (
        slides.map((s) => <Slide key={s.id} b={s} />)
      ) : slides.length > 1 ? (
        <Carousel slides={slides} seconds={carousel.seconds} focusId={focusSlideId} />
      ) : null}
      {side.on && (
        <div className="promo promo--forest">
          {side.sticker && <span className="sticker sticker--coral">{side.sticker}</span>}
          <h2>{side.title}</h2>
          {side.subtitle && <p>{side.subtitle}</p>}
          <BannerLink b={side} className="pill pill--lime" />
        </div>
      )}
    </section>
  );
}
