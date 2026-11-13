// Dev-only: ensure a timed-out catalog call cannot poison the per-studio tray
// cache with another provider's home page.
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const kv = new Map();
const providerContext = {
  axios,
  cheerio,
  commonHeaders: {},
  openWebView: async () => {
    throw new Error("not used");
  },
  kvStore: {
    get: async (k) => (kv.has(k) ? kv.get(k) : null),
    set: async (k, v) => void kv.set(k, v),
    delete: async (k) => kv.delete(k),
    keys: async () => [...kv.keys()],
    clear: async () => kv.clear(),
  },
};

const prime = require(path.join(__dirname, "..", "bundled", "primeVideo.js"));

const NETFLIX_TRAYS = ["Only on Netflix", "Top Searches", "K-Dramas"];

(async () => {
  const t0 = Date.now();

  // Simulate the app's 30 s timeout on the first cold open.
  const ac = new AbortController();
  setTimeout(() => ac.abort(), 5000);
  try {
    await prime.catalog({ providerContext, signal: ac.signal });
  } catch {
    console.log(`catalog aborted after ${Date.now() - t0} ms`);
  }

  // Wait for the background unlock to finish writing the token.
  for (let i = 0; i < 60; i++) {
    if (await providerContext.kvStore.get("t_hash_t_pv")) break;
    await new Promise((r) => setTimeout(r, 1000));
  }
  if (!(await providerContext.kvStore.get("t_hash_t_pv"))) {
    throw new Error("pv token never arrived");
  }
  console.log(`pv token ready after ${Date.now() - t0} ms`);

  // Now the user re-enters Prime Video. Its trays must be Prime's, not Netflix's.
  const cats = await prime.catalog({ providerContext });
  const titles = cats.map((c) => c.title);
  console.log("Prime catalog:", titles.slice(0, 6));

  const leaked = titles.find((t) => NETFLIX_TRAYS.includes(t));
  if (leaked) throw new Error(`Prime catalog leaked Netflix tray: ${leaked}`);

  // And the first tray must actually produce Prime-branded posts.
  const posts = await prime.getPosts({
    filter: titles[0],
    page: 1,
    providerValue: "primeVideo",
    signal: new AbortController().signal,
    providerContext,
  });
  const bad = posts.filter((p) => p.title.match(/^Item \d/));
  console.log(`posts: ${posts.length}, fallback-titled: ${bad.length}`);
  if (bad.length > posts.length / 2) {
    throw new Error(`Too many fallback-titled posts (${bad.length}/${posts.length})`);
  }

  console.log("✅ cache-poison test passed");
})().catch((e) => {
  console.error("FAIL", e.message);
  process.exit(1);
});
