import { config } from '../config';
import { useProducts } from '../store';

/** Scrolling announcement strip. Text and on/off are edited in Admin Studio → Promotions. */
export function Marquee() {
  const { marquee } = useProducts().promos;
  if (!marquee.on || !marquee.text.trim()) return null;
  const forest = config.bannerColor === 'Deep Forest';
  return (
    <div className={'marquee' + (forest ? ' marquee--forest' : '')} role="note" aria-label={marquee.text}>
      <div className={'marquee__track' + (config.marqueeScroll ? ' is-scrolling' : '')} aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i}>{marquee.text}</span>
        ))}
      </div>
    </div>
  );
}
