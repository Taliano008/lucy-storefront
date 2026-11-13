import { boot } from './boot';
import { Admin } from './pages/Admin';

// Served at /admin/ — password-protected on Vercel by /middleware.ts.
boot(<Admin />);
