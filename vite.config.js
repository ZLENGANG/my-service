import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { FORNT_END_PORT } from "./config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // @ 替代为 src
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: FORNT_END_PORT,
  },
});
