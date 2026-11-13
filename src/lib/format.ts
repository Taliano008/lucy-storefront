import { config } from '../config';
import type { Product } from '../data';

export const kes = (n: number) => 'KES ' + Number(n || 0).toLocaleString('en-KE');

/** Whole-number discount percentage, or 0 if not discounted. */
export const discountPct = (p: Pick<Product, 'price' | 'orig'>) =>
  p.orig > p.price ? Math.round((1 - p.price / p.orig) * 100) : 0;

export const whatsappText = (msg: string) =>
  `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(msg)}`;

export function whatsappLink(p: Product) {
  return whatsappText(`Hi Lucy! I want to ${p.inStock ? 'order' : 'pre-order'}: ${p.name} (${kes(p.price)})`);
}
