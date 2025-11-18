import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa"; 
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    vue(), 
    tailwindcss(), 
    vueDevTools(),
    VitePWA({ // ← AGREGAR ESTE PLUGIN
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2}"],
      },
      includeAssets: ["icons/*.png", "favicon.ico"],
      manifest: {
        name: "SGI - DGOS",
        short_name: "DGOS",
        description: "Sistema de Gestión Integral - DGOS",
        theme_color: "#053D4E",
        background_color: "#EFF6FF",
        display: "standalone",
        start_url: "/",
        orientation: "portrait",
        categories: ["business", "productivity"],
        icons: [
          {
            src: "/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   server: {
    port: 8082,
    //port: 8082,
    host: true,
    allowedHosts: ["dgos.pe", "www.dgos.pe"],
  },
});