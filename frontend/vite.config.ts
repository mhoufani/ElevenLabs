import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// Vite configuration file
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Enable React support with Hot Module Replacement (HMR)
    react(),
    // Convert SVG files to React components
    svgr(),
    // Progressive Web App support with auto-update functionality
    VitePWA({ registerType: "autoUpdate" })
  ],
  server: {
    // Listen on all network interfaces in Docker container
    // Required for Docker to expose the dev server
    host: '0.0.0.0',
    // Port number for the dev server
    port: 3000,
    // Fail if port 3000 is already in use
    strictPort: true,
    watch: {
      // Enable polling for file changes in Docker
      // Required for proper HMR in Docker volumes
      usePolling: true,
    },
  },
});
