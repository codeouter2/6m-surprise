
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  baseHref: "/",
  criticalCssPlans: [[1,"/styles-5INURTSO.css",0,[],[],[]]],
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    "index.csr.html": {size: 11938, hash: "6f14065ac5817fd1", text: () => import("./assets-chunks/index.csr.html.mjs").then(m => m.default)},
    "index.server.html": {size: 12453, hash: "a21ace586013d416", text: () => import("./assets-chunks/index.server.html.mjs").then(m => m.default)},
    "index.html": {size: 29517, hash: "66e803729ff66999", text: () => import("./assets-chunks/index.html.mjs").then(m => m.default)}
  },
};
