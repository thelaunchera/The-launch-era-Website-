import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/The-launch-era-Website-/cleaning-app/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
