import { config } from '../config';

export function Marquee() {
  const forest = config.bannerColor === 'Deep Forest';
  return (
    <div className={'marquee' + (forest ? ' marquee--forest' : '')} role="note" aria-label={config.marqueeText}>
      <div className={'marquee__track' + (config.marqueeScroll ? ' is-scrolling' : '')} aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i}>{config.marqueeText}</span>
        ))}
      </div>
    </div>
  );
}
