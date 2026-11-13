import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { config } from './config';
import { ProductsProvider } from './store';
import './styles.css';

/** Shared startup for the storefront and admin pages: theme attributes, catalogue store, render. */
export function boot(app: ReactNode) {
  const root = document.documentElement;
  root.dataset.card = config.cardStyle.toLowerCase();
  root.dataset.accent = config.popAccent === 'Vibrant Coral' ? 'coral' : 'lime';

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ProductsProvider>{app}</ProductsProvider>
    </StrictMode>,
  );
}
