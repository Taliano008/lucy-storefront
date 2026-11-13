import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const on = () => setMatch(mql.matches);
    on();
    mql.addEventListener('change', on);
    return () => mql.removeEventListener('change', on);
  }, [query]);
  return match;
}

const readHash = () => window.location.hash.replace(/^#\/?/, '') || '';

/**
 * Current hash route plus a `tick` that bumps on every navigation — including a click on a
 * link to the route you're already on (see `navigate`), so callers can re-apply it.
 */
export function useHashRoute() {
  const [state, setState] = useState(() => ({ route: readHash(), tick: 0 }));
  useEffect(() => {
    const on = () => {
      setState((s) => ({ route: readHash(), tick: s.tick + 1 }));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return state;
}

/** onClick for in-app hash links: re-fires navigation when the link targets the current route. */
export function navigate(e: { currentTarget: HTMLAnchorElement; preventDefault: () => void }) {
  const target = new URL(e.currentTarget.href).hash || '#/';
  const current = window.location.hash || '#/';
  if (target.replace(/^#\/?/, '') === current.replace(/^#\/?/, '')) {
    e.preventDefault();
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}
