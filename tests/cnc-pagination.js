// Dev-only: prove episode pagination beyond the old 6-page cap.
const axios = require("axios"), cheerio = require("cheerio"), path = require("path");
const kv = new Map();
const providerContext = { axios, cheerio, commonHeaders: {}, openWebView: async () => { throw 0; },
  kvStore: { get: async k => kv.has(k) ? kv.get(k) : null, set: async (k, v) => void kv.set(k, v), delete: async k => kv.delete(k), keys: async () => [...kv.keys()], clear: async () => kv.clear() } };
const p = require(path.join(__dirname, "..", "bundled", "cncVerse.js"));
kv.set("enabledStudios", [process.argv[3] || "hotstar"]);
(async () => {
  const q = process.argv[2] || "kumkum bhagya";
  const hits = await p.getSearchPosts({ searchQuery: q, page: 1, providerValue: "cncVerse", signal: new AbortController().signal, providerContext });
  const hs = hits;
  console.log("hits", hs.length, hs.slice(0, 5).map(h => [h.title, h.link.split("|")[1]]));
  if (!hs.length) return;
  const meta = await p.getMeta({ link: hs[0].link, provider: "cncVerse", providerContext });
  console.log("meta", meta.title, meta.type, "seasons", meta.linkList.length);
  const season = meta.linkList.find(l => l.episodesLink);
  if (!season) return console.log("no season");
  const eps = await p.getEpisodes({ url: season.episodesLink, providerContext });
  console.log("episodes", eps.length, eps.slice(0, 2).map(e => e.title), "...", eps.slice(-2).map(e => e.title));
  const ok = eps.length > 54; // old cap: 6 pages x 9 episodes
  console.log(ok ? "PASS: pagination beyond 36 episodes" : `INFO: ${eps.length} episodes (old cap 54 / 6 pages)`);
})();
