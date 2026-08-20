import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      obsidian: path.resolve(__dirname, "./src/test/obsidian-mock.ts"),
    },
  },
});
