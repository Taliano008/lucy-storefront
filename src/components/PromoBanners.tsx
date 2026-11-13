import { navigate } from '../lib/hooks';

/** Promotional + holiday discount slots. Copy is static for now (not yet editable from Admin Studio). */
export function PromoBanners() {
  return (
    <section className="promos" aria-label="Promotions">
      <div className="promo promo--lime">
        <div className="promo__body">
          <span className="sticker sticker--ink">PROMO</span>
          <h2>Bedsitter Glow-Up Under KES 3,000</h2>
          <a href="#/glow-up" onClick={navigate} className="pill pill--forest">Shop the deal</a>
        </div>
        <div className="promo__photo placeholder">
          <span className="placeholder__label">promo lifestyle photo</span>
        </div>
      </div>
      <div className="promo promo--forest">
        <span className="sticker sticker--coral">HOLIDAY DISCOUNT</span>
        <h2>Back-to-Campus Essentials</h2>
        <p>Hostel Starter Packs</p>
        <a href="#/starter-packs" onClick={navigate} className="pill pill--lime">View packs</a>
      </div>
    </section>
  );
}
