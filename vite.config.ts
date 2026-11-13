import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        admin: 'admin/index.html',
      },
      output: {
        // Admin-only code lives under /admin/ so the login middleware covers it too.
        entryFileNames: (chunk) => (chunk.name === 'admin' ? 'admin/assets/[name]-[hash].js' : 'assets/[name]-[hash].js'),
      },
    },
  },
});
