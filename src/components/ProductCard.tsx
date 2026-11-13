import type { Product } from '../data';
import { ProductImage } from './ProductImage';
import { WhatsAppIcon } from './WhatsAppIcon';
import { discountPct, kes, whatsappLink } from '../lib/format';

export function ProductCard({ p, compact = false }: { p: Product; compact?: boolean }) {
  const pct = discountPct(p);
  return (
    <article className={'card' + (compact ? ' card--compact' : '')}>
      <div className={'card__media' + (p.inStock ? '' : ' is-out')}>
        <ProductImage className="card__img" src={p.img} alt={p.name} label="product shot" />
        {p.badge && <span className="card__tag">{p.badge}</span>}
        {pct > 0 && <span className="card__pct">-{pct}%</span>}
        {!p.inStock && !compact && <span className="card__out">RESTOCKING · PRE-ORDER</span>}
      </div>
      <div className="card__body">
        {!compact && <div className="card__cat">{p.cat}</div>}
        <h3 className="card__name">{p.name}</h3>
        <div className="card__prices">
          <span className="card__price">{kes(p.price)}</span>
          {pct > 0 && <s className="card__orig">{kes(p.orig)}</s>}
        </div>
      </div>
      <a className="card__cta" href={whatsappLink(p)} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon size={compact ? 20 : 24} />
        {p.inStock ? 'Buy on WhatsApp' : compact ? 'Pre-order' : 'Pre-order on WhatsApp'}
      </a>
    </article>
  );
}
