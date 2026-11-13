// Dev-only: assert search hits the per-studio endpoints.
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const urls = [];
const wrapped = { ...axios, get: (u, o) => { urls.push(String(u).split("?")[0]); return axios.get(u, o); } };
const kv = new Map();
const providerContext = { axios: wrapped, cheerio, commonHeaders: {}, openWebView: async () => { throw 0; },
  kvStore: { get: async k => kv.has(k) ? kv.get(k) : null, set: async (k, v) => void kv.set(k, v), delete: async k => kv.delete(k), keys: async () => [...kv.keys()], clear: async () => kv.clear() } };
const p = require(path.join(__dirname, "..", "bundled", "cncVerse.js"));
(async () => {
  const res = await p.getSearchPosts({ searchQuery: "the office", page: 1, providerValue: "cncVerse", signal: new AbortController().signal, providerContext });
  const paths = [...new Set(urls.filter(u => u.includes("search.php")))].sort();
  console.log("search endpoints:", paths);
  console.log("results:", res.length);
  const need = ["/mobile/search.php", "/mobile/pv/search.php", "/mobile/hs/search.php"];
  const ok = need.every(n => paths.some(p => p.endsWith(n)));
  console.log(ok ? "PASS: all three studio search paths used" : "FAIL: missing " + need.filter(n => !paths.includes(n)));
  process.exit(ok ? 0 : 1);
})();
