import { defineConfig, type ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";
import Inspect from "vite-plugin-inspect";
import UnoCSS from "unocss/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { viteMockServe } from "vite-plugin-mock";
import importMetaUrlPlugin from "@codingame/esbuild-import-meta-url-plugin";

import { resolve } from "path";

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  return defineConfig({
    define: {
      __TRUE__: true,
    },
    optimizeDeps: {
      esbuildOptions: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        plugins: [importMetaUrlPlugin],
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
          manualChunks: {
            katex: ["katex"],
            // "naive-ui": ["naive-ui"],
            vue: ["vue", "vue-router", "@vueuse/core"],
            // vue: ["vue", "vue-router", "pinia", "vue-i18n", "@vueuse/core"],
            editor: [
              "monaco-editor",
              "monaco-editor-wrapper",
              "monaco-languageclient",
              "vscode",
              "vscode-ws-jsonrpc",
              "@codingame/monaco-vscode-configuration-service-override",
              "@codingame/monaco-vscode-cpp-default-extension",
              "@codingame/monaco-vscode-languages-service-override",
              "@codingame/monaco-vscode-localization-service-override",
              "@codingame/monaco-vscode-markdown-basics-default-extension",
              "@codingame/monaco-vscode-markdown-math-default-extension",
              "@codingame/monaco-vscode-model-service-override",
              "@codingame/monaco-vscode-textmate-service-override",
            ],
          },
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      Inspect(),
      UnoCSS(),
      Components({
        dts: true,
        types: [
          {
            from: "vue-router",
            names: ["RouterLink", "RouterView"],
          },
        ],
        resolvers: [NaiveUiResolver()],
      }),
      viteMockServe({
        mockPath: "mock",
        enable: true,
        logger: true,
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
};
