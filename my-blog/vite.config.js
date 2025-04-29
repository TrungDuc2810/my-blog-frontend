import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        // eslint-disable-next-line no-undef
        target: process.env.VITE_API_URL || "http://backend:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    "process.env.VITE_API_URL": JSON.stringify(
      // eslint-disable-next-line no-undef
      process.env.VITE_API_URL || "http://backend:8080"
    ),
  },
});
