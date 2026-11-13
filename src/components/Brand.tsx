import { navigate } from '../lib/hooks';

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <a href="#/" onClick={navigate} className={'brand' + (small ? ' brand--sm' : '')} aria-label="Lucy Household Items home">
      <span className="brand__name">Lucy</span>
      <span className="brand__tag">HOUSEHOLD ITEMS</span>
    </a>
  );
}
