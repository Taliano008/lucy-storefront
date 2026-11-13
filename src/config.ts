/**
 * Storefront configuration. These were "tweak" toggles in the design prototype;
 * the defaults below are the ones the design shipped with.
 */
export type BannerColor = 'Electric Lime' | 'Deep Forest';
export type CardStyle = 'Sticker' | 'Clean' | 'Forest';
export type PopAccent = 'Electric Lime' | 'Vibrant Coral';

export const config = {
  bannerColor: 'Electric Lime' as BannerColor,
  cardStyle: 'Sticker' as CardStyle,
  popAccent: 'Electric Lime' as PopAccent,
  marqueeScroll: true,
  /** Lucy's WhatsApp number in international format without "+", e.g. "2547XXXXXXXX". Empty = let the customer pick a chat. */
  whatsappNumber: '',
  /**
   * Lifestyle photo in the lime promo banner. Put the file at public/promo/glow-up.jpg (or change
   * this path), then commit and push. Missing file → the striped placeholder shows instead.
   */
  promoPhoto: '/promo/glow-up.jpg',
  marqueeText: '🔥 Free delivery in Juja, Kahawa & CBD for orders > KES 2,500 • Pay via M-Pesa on Delivery',
  pageSize: 9,
  mobilePageSize: 6,
};
