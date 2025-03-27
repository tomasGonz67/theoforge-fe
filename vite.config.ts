import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,      // Ensure it matches Docker's exposed port
    strictPort: true,
  },
  preview: {
    allowedHosts: ['dev.theoforge.com', 'www.dev.theoforge.com', 'qa.theoforge.com', 'www.qa.theoforge.com', 'theoforge.com' ,'www.theoforge.com'],
  },
  plugins: [react(), EnvironmentPlugin('all')],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
