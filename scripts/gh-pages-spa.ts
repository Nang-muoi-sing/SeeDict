import type { Plugin } from "vite";

const buildIndexScript = () => `
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

const build404Html = (pathSegmentsToKeep: number) => `<!doctype html>
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

const getPathSegmentsToKeep = (baseUrl: string) =>
  baseUrl.split("/").filter(Boolean).length;

export const createGhPagesSpaPlugin = (baseUrl: string): Plugin => {
  const pathSegmentsToKeep = getPathSegmentsToKeep(baseUrl || "/");
  const ghPagesIndexScript = buildIndexScript();
  const ghPages404Html = build404Html(pathSegmentsToKeep);

  return {
    name: "gh-pages-spa",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace("</body>", `${ghPagesIndexScript}\n</body>`);
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "404.html",
        source: ghPages404Html,
      });
    },
  };
};
