//flynet-multi-app/saas-dashboard/vite.config.mjs
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  server: {
    port: 5173
  }
});
//flynet-multi-app/saas-dashboard/vite.config.mjs