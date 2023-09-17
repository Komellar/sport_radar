/// <reference types="@testing-library/jest-dom" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@common": path.resolve(__dirname, "./src/common"),
      "@store": path.resolve(__dirname, "./src/store"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    globals: true,
  },
});
