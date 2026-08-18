import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/scheduler")
          ) {
            return "react";
          }

          if (id.includes("node_modules/react-router")) {
            return "router";
          }

          if (id.includes("node_modules/@firebase/auth")) {
            return "firebase-auth";
          }

          if (id.includes("node_modules/@firebase/firestore")) {
            return "firebase-firestore";
          }

          if (id.includes("node_modules/@firebase/storage")) {
            return "firebase-storage";
          }

          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
        },
      },
    },
  },
});
