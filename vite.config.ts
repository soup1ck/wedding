import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.glb"],
  build: {
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three/examples/jsm/")) {
            return "three-examples";
          }
          if (id.includes("node_modules/three/")) {
            return "three-core";
          }
          if (id.includes("node_modules/react-dom/")) {
            return "react-dom";
          }
          if (id.includes("node_modules/react/")) {
            return "react-core";
          }
          if (id.includes("node_modules/gsap/")) {
            return "gsap";
          }
          return undefined;
        },
      },
    },
  },
});
