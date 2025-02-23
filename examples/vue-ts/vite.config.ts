import Vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import { defineConfig } from "vite"
import Components from "vite-plugin-components"
import OptimizationPersist from "vite-plugin-optimize-persist"
import PkgConfig from "vite-plugin-package-config"
import Pages from "vite-plugin-pages"

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
  resolve: {
    alias: {
      "@zag-js/vue": `${resolve(__dirname, "../../packages/frameworks/vue/src")}`,
      "@zag-js/core": `${resolve(__dirname, "../../packages/core/src")}`,
      "@zag-js/web": `${resolve(__dirname, "../../packages/machines/src")}`,
    },
  },
  plugins: [
    Vue(),
    Pages({
      pagesDir: "src/pages",
      extensions: ["vue", "ts", "tsx"],
    }),
    Components({
      extensions: ["tsx", "vue", "ts"],
      dirs: ["./src/components"],
    }),
    PkgConfig(),
    OptimizationPersist(),
  ],
})
