import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow external access
    port: 8000,      // Ensure it matches Docker's exposed port
    strictPort: true,
  },
  preview: {
    allowedHosts: ['theoforge.com', 'www.theoforge.com', '0.0.0.0'],
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
