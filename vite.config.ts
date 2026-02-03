import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      vue(),
      Components({
        resolvers: [IconsResolver()],
      }),
      Icons({ autoInstall: true }),
      legacy(),
    ],
    base: env.VITE_BASE_URL || "/",
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_HOST,
          changeOrigin: true,
        },
      },
    },
  };
});
