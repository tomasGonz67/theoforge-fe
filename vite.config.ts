import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,      // Ensure it matches Docker's exposed port
    strictPort: true,
  },
  preview: {
    allowedHosts: ['dev.theoforge.com', 'www.dev.theoforge.com', 'qa.theoforge.com', 'www.qa.theoforge.com', 'theoforge.com' ,'www.theoforge.com'],
  },
  plugins: [react()],
  optimizeDeps:  {
    exclude: ['lucide-react'],
  },
});
