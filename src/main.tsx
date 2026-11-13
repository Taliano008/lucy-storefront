import { boot } from './boot';
import { useHashRoute } from './lib/hooks';
import { Storefront } from './pages/Storefront';

// Old Admin bookmarks (#/admin) → the protected /admin/ page.
const toAdmin = () => /^#\/?admin/.test(window.location.hash) && window.location.replace('/admin/');
toAdmin();
window.addEventListener('hashchange', toAdmin);

function App() {
  const { route, tick } = useHashRoute();
  return <Storefront route={route} tick={tick} />;
}

boot(<App />);
