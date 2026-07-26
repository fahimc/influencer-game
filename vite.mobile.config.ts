import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  root: path.resolve(__dirname, "mobile"),
  publicDir: path.resolve(__dirname, "public"),
  plugins: [react()],
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "mobile-dist"),
    emptyOutDir: true,
    target: "es2020",
  },
});
