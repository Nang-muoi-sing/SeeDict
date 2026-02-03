import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isGhPages = env.VITE_ENV_NAME === "github-ci";
  const baseSegments = (env.VITE_BASE_URL || "/").split("/").filter(Boolean);
  const pathSegmentsToKeep = baseSegments.length;
  const ghPagesIndexScript = `
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // https://github.com/rafgraph/spa-github-pages
    (function (l) {
      if (l.search[1] === '/') {
        var decoded = l.search
          .slice(1)
          .split('&')
          .map(function (s) {
            return s.replace(/~and~/g, '&');
          })
          .join('?');
        window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
      }
    })(window.location);
  </script>`;
  const ghPages404Html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Single Page Apps for GitHub Pages</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // https://github.com/rafgraph/spa-github-pages
      var pathSegmentsToKeep = ${pathSegmentsToKeep};
      var l = window.location;
      l.replace(
        l.protocol +
          '//' +
          l.hostname +
          (l.port ? ':' + l.port : '') +
          l.pathname
            .split('/')
            .slice(0, 1 + pathSegmentsToKeep)
            .join('/') +
          '/?/' +
          l.pathname
            .split('/')
            .slice(1 + pathSegmentsToKeep)
            .join('/') +
          l.search +
          l.hash
      );
    </script>
  </head>
  <body></body>
</html>`;
  const ghPagesSpaPlugin = (): Plugin => ({
    name: "gh-pages-spa",
    enforce: "post",
    transformIndexHtml(html: string) {
      return html.replace("</body>", `${ghPagesIndexScript}\n</body>`);
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "404.html",
        source: ghPages404Html,
      });
    },
  });
  const plugins = [
    vue(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons({ autoInstall: true }),
    legacy(),
  ];
  if (isGhPages) {
    plugins.push(ghPagesSpaPlugin());
  }
  return {
    plugins,
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
