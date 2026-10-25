var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// providers/multi/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog
});
var catalog;
var init_catalog = __esm({
  "providers/multi/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Trending", filter: "" },
      { title: "Movies", filter: "movies" },
      { title: "Series", filter: "series" },
      { title: "K-drama", filter: "genre/k-drama" },
      { title: "Amazon Prime", filter: "genre/amazon-prime" },
      { title: "Jio Hotstar", filter: "genre/disney-hotstar" },
      { title: "Jio OTT", filter: "genre/jio-ott" },
      { title: "K-drama", filter: "genre/k-drama" },
      { title: "MX Player", filter: "genre/mx-player" },
      { title: "Netflix", filter: "genre/netflix" },
      { title: "Sony Liv", filter: "genre/sony-liv" },
      { title: "Zee 5", filter: "genre/zee-5" },
      // Genre
      { title: "Action", filter: "genre/action" }
    ];
  }
});

// providers/getBaseUrl.ts
function getCache() {
  var _a;
  const state = typeof providerGlobal !== "undefined" && providerGlobal ? providerGlobal : globalThis;
  (_a = state.__vegaProviderBaseUrlCache__) != null ? _a : state.__vegaProviderBaseUrlCache__ = { expiresAt: 0 };
  return state.__vegaProviderBaseUrlCache__;
}
function fetchProviderUrls() {
  return __async(this, null, function* () {
    const cache = getCache();
    if (cache.data && Date.now() < cache.expiresAt) {
      return cache.data;
    }
    if (cache.request) {
      return cache.request;
    }
    const request = fetch(urlsEndpoint).then((response) => __async(null, null, function* () {
      if (!response.ok) {
        throw new Error(`URL configuration request failed: ${response.status}`);
      }
      const data = yield response.json();
      console.log("Fetched provider URL configuration");
      cache.data = data;
      cache.expiresAt = Date.now() + cacheTtl;
      return data;
    })).catch((error) => {
      if (cache.data) {
        console.warn("Using stale provider URL configuration", error);
        return cache.data;
      }
      throw error;
    }).finally(() => {
      cache.request = void 0;
    });
    Object.defineProperty(cache, "request", {
      configurable: true,
      enumerable: false,
      value: request,
      writable: true
    });
    return request;
  });
}
var urlsEndpoint, cacheTtl, getBaseUrl;
var init_getBaseUrl = __esm({
  "providers/getBaseUrl.ts"() {
    "use strict";
    urlsEndpoint = "https://raw.githubusercontent.com/Khiladi45/K45movies-api/main/urls.json";
    cacheTtl = 60 * 60 * 1e3;
    getBaseUrl = (providerValue) => __async(null, null, function* () {
      var _a, _b;
      try {
        const providerUrls = yield fetchProviderUrls();
        return (_b = (_a = providerUrls[providerValue]) == null ? void 0 : _a.url) != null ? _b : "";
      } catch (error) {
        console.error(`Error fetching baseUrl: ${providerValue}`, error);
        throw error;
      }
    });
  }
});

// providers/providerErrors.ts
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch (e) {
    return String(error);
  }
}
function throwProviderError(provider, operation, error) {
  var _a, _b;
  const response = error == null ? void 0 : error.response;
  const status = response == null ? void 0 : response.status;
  const statusText = response == null ? void 0 : response.statusText;
  const url = ((_a = response == null ? void 0 : response.config) == null ? void 0 : _a.url) || ((_b = error == null ? void 0 : error.config) == null ? void 0 : _b.url);
  const details = [
    status ? `HTTP ${status}${statusText ? ` ${statusText}` : ""}` : "",
    url ? `URL ${url}` : "",
    getErrorMessage(error)
  ].filter(Boolean);
  throw new Error(`${provider} ${operation} failed: ${details.join(" | ")}`);
}
var init_providerErrors = __esm({
  "providers/providerErrors.ts"() {
    "use strict";
  }
});

// providers/multi/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function resolveUrl(href, baseUrl) {
  if (!href) return "";
  if (href.startsWith("http")) return href;
  if (href.startsWith("//")) return "https:" + href;
  try {
    return new URL(href, baseUrl).href;
  } catch (e) {
    return "";
  }
}
function getPosterSrc(imgElement) {
  if (!imgElement || !imgElement.length) return "";
  const src = imgElement.attr("src") || imgElement.attr("data-src") || imgElement.attr("data-lazy-src") || "";
  return String(src).trim();
}
function isContentLink(link) {
  if (!link) return false;
  if (link.includes("#")) return false;
  if (link.includes("/genre/")) return false;
  if (link.includes("/category/")) return false;
  if (link.includes("/tag/")) return false;
  if (link.includes("/provider/")) return false;
  if (link.includes("/collection/")) return false;
  if (link.includes("/watchlist")) return false;
  if (link.includes("/contact")) return false;
  if (link.includes("/dmca")) return false;
  if (link.includes("/privacy")) return false;
  return true;
}
function normaliseTitle(t) {
  return String(t || "").replace(/\s+/g, " ").replace("Download", "").trim();
}
function getPosts(_0) {
  return __async(this, arguments, function* ({
    filter,
    page = 1,
    signal,
    providerValue,
    providerContext
  }) {
    const { axios, cheerio } = providerContext;
    const baseUrl = (yield getBaseUrl("multi")).replace(/\/+$/, "");
    const route = (filter || "trending").replace(/^\/+/, "").replace(/\/+$/, "");
    const url = page > 1 ? `${baseUrl}/${route}/page/${page}/` : `${baseUrl}/${route}`;
    console.log(`[MultiMovies] Fetching: ${url}`);
    try {
      const res = yield axios.get(url, {
        headers: __spreadProps(__spreadValues({}, HEADERS), { Referer: baseUrl }),
        signal,
        timeout: 15e3,
        maxRedirects: 5
      });
      const $ = cheerio.load(res.data);
      const posts = [];
      $("article.poster-card").each((_, element) => {
        const card = $(element);
        const linkA = card.find("a.poster-art").first();
        const captionA = card.find(".poster-caption a").first();
        const rawHref = linkA.attr("href") || captionA.attr("href");
        if (!rawHref || !isContentLink(rawHref)) return;
        const link = resolveUrl(rawHref, baseUrl);
        if (!link || posts.some((p) => p.link === link)) return;
        const img = card.find("img").first();
        const title = normaliseTitle(
          captionA.text() || img.attr("alt") || ""
        );
        if (!title) return;
        const image = resolveUrl(getPosterSrc(img), baseUrl);
        posts.push({ title, link, image });
      });
      if (posts.length === 0) {
        console.log("[MultiMovies] No poster-card found, trying hero slides...");
        $("article.cinema-slide").each((_, element) => {
          const slide = $(element);
          const linkA = slide.find("a.button-light, a.button-glass").first();
          const rawHref = linkA.attr("href");
          if (!rawHref || !isContentLink(rawHref)) return;
          const link = resolveUrl(rawHref, baseUrl);
          if (!link || posts.some((p) => p.link === link)) return;
          const img = slide.find("img.cinema-backdrop").first();
          const title = normaliseTitle(
            slide.find("h1").first().text() || img.attr("alt") || ""
          );
          if (!title) return;
          const image = resolveUrl(getPosterSrc(img), baseUrl);
          posts.push({ title, link, image });
        });
      }
      if (posts.length === 0) {
        console.log("[MultiMovies] Trying generic fallback selector...");
        $("article, .poster-card, .item").each((_, element) => {
          const card = $(element);
          const rawHref = card.find("a[href]").first().attr("href");
          if (!rawHref || !isContentLink(rawHref)) return;
          const link = resolveUrl(rawHref, baseUrl);
          if (!link || posts.some((p) => p.link === link)) return;
          const img = card.find("img").first();
          const title = normaliseTitle(
            card.find("h1, h2, h3, .poster-caption a").first().text() || img.attr("alt") || ""
          );
          if (!title) return;
          const image = resolveUrl(getPosterSrc(img), baseUrl);
          posts.push({ title, link, image });
        });
      }
      console.log(`[MultiMovies] Found ${posts.length} posts for ${route}`);
      return posts.slice(0, 100);
    } catch (error) {
      throwProviderError("MultiMovies", "posts", error);
    }
  });
}
function getSearchPosts(_0) {
  return __async(this, arguments, function* ({
    searchQuery,
    page = 1,
    signal,
    providerValue,
    providerContext
  }) {
    const { axios, cheerio } = providerContext;
    const baseUrl = (yield getBaseUrl("multi")).replace(/\/+$/, "");
    const url = `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}`;
    console.log(`[MultiMovies] Searching: ${url}`);
    try {
      const res = yield axios.get(url, {
        headers: __spreadProps(__spreadValues({}, HEADERS), { Referer: baseUrl }),
        signal,
        timeout: 15e3,
        maxRedirects: 5
      });
      const $ = cheerio.load(res.data);
      const posts = [];
      $("article.poster-card").each((_, element) => {
        const card = $(element);
        const linkA = card.find("a.poster-art").first();
        const captionA = card.find(".poster-caption a").first();
        const rawHref = linkA.attr("href") || captionA.attr("href");
        if (!rawHref || !isContentLink(rawHref)) return;
        const link = resolveUrl(rawHref, baseUrl);
        if (!link || posts.some((p) => p.link === link)) return;
        const img = card.find("img").first();
        const title = normaliseTitle(
          captionA.text() || img.attr("alt") || ""
        );
        if (!title) return;
        const image = resolveUrl(getPosterSrc(img), baseUrl);
        posts.push({ title, link, image });
      });
      if (posts.length === 0) {
        console.log("[MultiMovies] No poster-card in search, trying fallback...");
        $("article, .result-item, .item").each((_, element) => {
          const card = $(element);
          const rawHref = card.find("a[href]").first().attr("href");
          if (!rawHref || !isContentLink(rawHref)) return;
          const link = resolveUrl(rawHref, baseUrl);
          if (!link || posts.some((p) => p.link === link)) return;
          const img = card.find("img").first();
          const title = normaliseTitle(
            card.find("h1, h2, h3, .poster-caption a, .title a").first().text() || img.attr("alt") || ""
          );
          if (!title) return;
          const image = resolveUrl(getPosterSrc(img), baseUrl);
          posts.push({ title, link, image });
        });
      }
      console.log(
        `[MultiMovies] Search found ${posts.length} results for "${searchQuery}"`
      );
      return posts.slice(0, 100);
    } catch (error) {
      throwProviderError("MultiMovies", "search posts", error);
    }
  });
}
var HEADERS;
var init_posts = __esm({
  "providers/multi/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    HEADERS = {
      "User-Agent": "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Google Chrome";v="150"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1"
    };
  }
});

// providers/multi/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var headers, getMeta;
var init_meta = __esm({
  "providers/multi/meta.ts"() {
    "use strict";
    headers = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Cache-Control": "no-store",
      "Accept-Language": "en-US,en;q=0.9",
      DNT: "1",
      "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0"
    };
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a;
        const { axios, cheerio } = providerContext;
        const url = link;
        const baseUrl = url.split("/").slice(0, 3).join("/");
        const emptyResult = {
          title: "",
          synopsis: "",
          image: "",
          imdbId: "",
          type: "movie",
          linkList: []
        };
        try {
          const response = yield axios.get(url, {
            headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl })
          });
          const $ = cheerio.load(response.data);
          const result = {
            title: "",
            synopsis: "",
            image: "",
            imdbId: "",
            type: "movie",
            linkList: []
          };
          let watchItem = null;
          let watchConfig = null;
          $("script").each((_, el) => {
            const txt = $(el).html() || "";
            const itemMatch = txt.match(
              /const\s+watchItem\s*=\s*(\{[\s\S]*?\})\s*;/
            );
            if (itemMatch && !watchItem) {
              try {
                watchItem = JSON.parse(itemMatch[1]);
              } catch (_2) {
              }
            }
            const cfgMatch = txt.match(
              /const\s+watchConfig\s*=\s*(\{[\s\S]*?\})\s*;/
            );
            if (cfgMatch && !watchConfig) {
              try {
                watchConfig = JSON.parse(cfgMatch[1]);
              } catch (_2) {
              }
            }
          });
          result.title = ((_a = watchItem == null ? void 0 : watchItem.title) == null ? void 0 : _a.toString().trim()) || $(".cinejoy-detail-title").first().text().trim() || $(".watch-details-summary").first().text().trim() || "Unknown Title";
          result.image = (watchItem == null ? void 0 : watchItem.poster) || $(".watch-bg img").first().attr("src") || $(".cinejoy-detail-poster img").first().attr("src") || "";
          result.synopsis = $("#cinejoyOverview").first().text().trim() || $(".cinejoy-detail-overview").first().text().trim() || "";
          const hasCinejoyEpisodes = $(".cinejoy-episodes-section").length > 0;
          result.type = (watchItem == null ? void 0 : watchItem.type) === "tv" || (watchItem == null ? void 0 : watchItem.type) === "series" || hasCinejoyEpisodes ? "series" : "movie";
          result.imdbId = "";
          const linkList = [];
          if (result.type === "series" || hasCinejoyEpisodes) {
            const seriesBase = url.split("?")[0].replace(/\/$/, "").replace(/\/season\/\d+(\/episode\/\d+)?$/i, "").replace(/\/episode\/\d+$/i, "");
            const seasonMap = /* @__PURE__ */ new Map();
            $(".cinejoy-season-select option").each((_, opt) => {
              const season = ($(opt).attr("value") || "").trim();
              if (!season) return;
              const label = $(opt).text().trim() || `Season ${season}`;
              seasonMap.set(season, {
                title: label,
                // Use query-string style URL
                episodesLink: `${seriesBase}?season=${season}`
              });
            });
            $(".cinejoy-season-grid").each((_, grid) => {
              const id = $(grid).attr("id") || "";
              const m = id.match(/cinejoy-season-(\d+)/);
              if (!m) return;
              const season = m[1];
              if (seasonMap.has(season)) return;
              seasonMap.set(season, {
                title: `Season ${season}`,
                episodesLink: `${seriesBase}?season=${season}`
              });
            });
            if (seasonMap.size > 0) {
              seasonMap.forEach((value) => {
                linkList.push({
                  title: value.title,
                  quality: "",
                  episodesLink: value.episodesLink,
                  directLinks: []
                });
              });
            } else {
              linkList.push({
                title: "Season 1",
                quality: "",
                episodesLink: `${seriesBase}?season=1`,
                directLinks: []
              });
            }
          } else {
            linkList.push({
              title: result.title,
              quality: "",
              episodesLink: url,
              directLinks: [
                {
                  title: result.title,
                  link: url,
                  type: "movie"
                }
              ]
            });
          }
          result.linkList = linkList;
          return result;
        } catch (err) {
          console.log("getMeta error:", err);
          return emptyResult;
        }
      });
    };
  }
});

// providers/extractors/iqst.ts
function buildHeaders() {
  return {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "User-Agent": UA,
    Referer: REFERER
  };
}
function deEscape(s) {
  return String(s).replace(/\\\//g, "/").replace(/\\u([0-9a-fA-F]{4})/g, function(_m, h) {
    return String.fromCharCode(parseInt(h, 16));
  });
}
function b64urlDecode(s) {
  const input = String(s || "").trim().replace(/-/g, "+").replace(/_/g, "/");
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - input.length % 4);
  try {
    return atob(input + pad);
  } catch (e) {
    return "";
  }
}
function hostOf(u) {
  try {
    return new URL(u).hostname;
  } catch (e) {
    return "";
  }
}
function absUrl(base, rel) {
  try {
    return new URL(rel, base).toString();
  } catch (e) {
    return "";
  }
}
function parseMaybeJson(input) {
  if (input == null) return null;
  if (typeof input === "object") return input;
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    return null;
  }
}
function baseN(num, b) {
  if (num === 0) return "0";
  let out = "";
  while (num > 0) {
    out = DIGITS[num % b] + out;
    num = Math.floor(num / b);
  }
  return out;
}
function unpackJs(source) {
  const m = source.match(
    new RegExp("\\}\\s*\\(\\s*'(.*?)'\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*'(.*?)'\\s*\\.split\\('\\|'\\)", "s")
  );
  if (!m) return null;
  let p = m[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  const a = parseInt(m[2], 10);
  let c = parseInt(m[3], 10);
  const k = m[4].split("|");
  while (c-- > 0) {
    if (c < k.length && k[c]) {
      const token = baseN(c, a);
      p = p.replace(new RegExp("\\b" + token + "\\b", "g"), function() {
        return k[c];
      });
    }
  }
  return p;
}
function extractFileList(root) {
  if (!root) return [];
  if (Array.isArray(root.data)) return root.data;
  if (Array.isArray(root.result)) return root.result;
  if (Array.isArray(root.files)) return root.files;
  if (Array.isArray(root.filelist)) return root.filelist;
  if (Array.isArray(root.sources)) return root.sources;
  if (root.data && Array.isArray(root.data.files)) return root.data.files;
  if (root.result && Array.isArray(root.result.files)) return root.result.files;
  if (Array.isArray(root)) return root;
  return [];
}
function fetchFiles(embedUrl, axios, headers2, signal) {
  return __async(this, null, function* () {
    const res = yield axios.get(embedUrl, { headers: headers2, signal, timeout: 7e3 });
    const html = res.data;
    console.log("[iqst] embed bytes: " + html.length);
    const varOf = function(name) {
      const re = new RegExp(
        "(?:var|let|const)\\s+" + name + `\\s*=\\s*["\\']([^"\\']*)["\\']`
      );
      const m = html.match(re);
      return m ? m[1] : "";
    };
    const finalId = varOf("FinalID");
    const idType = varOf("idType");
    const key = varOf("myKey");
    const season = varOf("season");
    const epname = varOf("epname");
    console.log(
      "[iqst] FinalID=" + (finalId || "(miss)") + " idType=" + (idType || "(miss)") + " key=" + (key ? "yes" : "(miss)")
    );
    if (!finalId || !key) return [];
    const paths = [];
    if (season && epname) {
      paths.push(
        API + "/myseriesapi?" + idType + "=" + encodeURIComponent(finalId) + "&season=" + season + "&epname=" + encodeURIComponent(epname) + "&key=" + key,
        API + "/myseriesapi?id=" + encodeURIComponent(finalId) + "&season=" + season + "&epname=" + encodeURIComponent(epname) + "&key=" + key,
        API + "/myseriesapi?imdbid=" + encodeURIComponent(finalId) + "&season=" + season + "&epname=" + encodeURIComponent(epname) + "&key=" + key
      );
    } else {
      paths.push(
        API + "/mymovieapi?" + idType + "=" + encodeURIComponent(finalId) + "&key=" + key,
        API + "/mymovieapi?id=" + encodeURIComponent(finalId) + "&key=" + key,
        API + "/mymovieapi?imdbid=" + encodeURIComponent(finalId) + "&key=" + key,
        API + "/mymovieapi?tmdbid=" + encodeURIComponent(finalId) + "&key=" + key,
        API + "/mymovieapi?type=imdbid&id=" + encodeURIComponent(finalId) + "&key=" + key
      );
    }
    for (let pi = 0; pi < paths.length; pi++) {
      const apiPath = paths[pi];
      try {
        const apiRes = yield axios.get(apiPath, {
          headers: Object.assign({}, headers2, { Referer: API + "/" }),
          signal,
          timeout: 7e3,
          // Force axios to return raw text so we control parsing
          transformResponse: [(data) => data]
        });
        const parsed = parseMaybeJson(apiRes.data);
        if (!parsed) {
          console.log(
            "[iqst] " + apiPath + " -> unparseable (" + typeof apiRes.data + "): " + String(apiRes.data).slice(0, 200)
          );
          continue;
        }
        if (typeof parsed === "object" && !Array.isArray(parsed)) {
          console.log("[iqst] response keys: " + Object.keys(parsed).join(","));
        }
        const list = extractFileList(parsed);
        if (list.length === 0) {
          console.log("[iqst] " + apiPath + " -> 0 files");
          continue;
        }
        console.log("[iqst] " + apiPath + " -> " + list.length + " file(s)");
        const out = [];
        for (let i = 0; i < list.length; i++) {
          const item = list[i] || {};
          const slug = String(
            item.fileslug || item.slug || item.file_slug || item.id || ""
          ).trim();
          if (!slug) continue;
          out.push({
            slug,
            name: item.filename || item.name || item.title || "",
            size: item.fsize || item.size || ""
          });
        }
        if (out.length > 0) return out;
      } catch (e) {
        console.log("[iqst] " + apiPath + " failed: " + (e && e.message));
      }
    }
    return [];
  });
}
function fetchMirrors(slug, axios, headers2, signal) {
  return __async(this, null, function* () {
    const body = new URLSearchParams({
      sid: slug,
      UserFavSite: "",
      currentDomain: '["streams.iqsmartgames.com","pro.iqsmartgames.com"]'
    }).toString();
    const res = yield axios.post(PLAYER + "/embedhelper2.php", body, {
      headers: Object.assign({}, headers2, {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: PLAYER + "/"
      }),
      signal,
      timeout: 7e3,
      transformResponse: [(data) => data]
    });
    const root = parseMaybeJson(res.data);
    if (!root || typeof root !== "object") {
      console.log("[iqst] mirrors: unparseable response");
      return [];
    }
    const sources = root.sources || {};
    let codes = {};
    const mresult = root.mresult;
    if (mresult) {
      if (typeof mresult === "object") {
        codes = mresult;
      } else if (typeof mresult === "string") {
        const direct = parseMaybeJson(mresult);
        if (direct && typeof direct === "object") {
          codes = direct;
        } else {
          const decoded = b64urlDecode(mresult);
          const parsed = parseMaybeJson(decoded);
          if (parsed && typeof parsed === "object") codes = parsed;
        }
      }
    }
    const out = [];
    const keys = Object.keys(codes);
    console.log("[iqst] mirrors: " + keys.length + " code(s)");
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const src = sources[k];
      if (!src) continue;
      const siteUrl = String(src.siteUrl || "").trim();
      const code = String(codes[k] || "").trim();
      if (!siteUrl || !code) continue;
      out.push({
        siteUrl,
        friendlyName: src.friendlyName || "",
        code
      });
    }
    return out;
  });
}
function extractLinks(unpacked, base) {
  const absolute = [];
  const relative = [];
  const seenA = {};
  const seenR = {};
  const kvRe = /"(?:hls\d|file|mp4)"\s*:\s*"([^"]+)"/g;
  let m;
  while ((m = kvRe.exec(unpacked)) !== null) {
    const u = deEscape(m[1]);
    if (!u) continue;
    if (/^https?:\/\//i.test(u)) {
      if (!seenA[u]) {
        seenA[u] = true;
        absolute.push(u);
      }
    } else {
      const full = absUrl(base + "/", u);
      if (full && !seenR[full]) {
        seenR[full] = true;
        relative.push(full);
      }
    }
  }
  const rawRe = /https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/g;
  while ((m = rawRe.exec(unpacked)) !== null) {
    const u = deEscape(m[0]);
    if (!seenA[u]) {
      seenA[u] = true;
      absolute.push(u);
    }
  }
  return absolute.concat(relative);
}
function resolveXvidStyle(pageUrl, axios, headers2, signal) {
  return __async(this, null, function* () {
    const u = new URL(pageUrl);
    const base = u.protocol + "//" + u.host;
    const res = yield axios.get(pageUrl, {
      headers: Object.assign({}, headers2, { Referer: PLAYER + "/" }),
      signal,
      timeout: 7e3
    });
    const unpacked = unpackJs(res.data) || "";
    if (!unpacked) return [];
    const links = extractLinks(unpacked, base);
    const out = [];
    for (let i = 0; i < links.length; i++) {
      out.push({ url: links[i], headers: { Referer: base + "/" } });
    }
    return out;
  });
}
function resolveGeneric(pageUrl, axios, headers2, signal) {
  return __async(this, null, function* () {
    const res = yield axios.get(pageUrl, { headers: headers2, signal, timeout: 7e3 });
    const html = res.data;
    const seen = {};
    const out = [];
    const re = /https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/g;
    let m;
    while ((m = re.exec(html)) !== null) {
      const u = deEscape(m[0]);
      if (!seen[u]) {
        seen[u] = true;
        out.push({ url: u, headers: {} });
      }
    }
    return out;
  });
}
function dispatchMirror(mirror, axios, headers2, signal) {
  return __async(this, null, function* () {
    const pageUrl = absUrl(mirror.siteUrl, mirror.code);
    if (!pageUrl) return [];
    const host = hostOf(pageUrl);
    if (KNOWN_XVID_HOSTS[host]) return resolveXvidStyle(pageUrl, axios, headers2, signal);
    return resolveGeneric(pageUrl, axios, headers2, signal);
  });
}
function iqstExtractor(link, signal, axios, _cheerio, _headers, _providerContext) {
  return __async(this, null, function* () {
    const streamLinks = [];
    const t0 = Date.now();
    try {
      console.log("[iqst] -> " + link);
      const headers2 = buildHeaders();
      const files = yield fetchFiles(link, axios, headers2, signal);
      if (files.length === 0) {
        console.log("[iqst] no files found");
        return [];
      }
      const mirrorJobs = files.map(function(f) {
        return fetchMirrors(f.slug, axios, headers2, signal).then(
          function(mirrors) {
            return { file: f, mirrors };
          },
          function(e) {
            console.warn("[iqst] mirrors " + f.slug + ": " + (e && e.message));
            return { file: f, mirrors: [] };
          }
        );
      });
      const fileMirrors = yield Promise.all(mirrorJobs);
      const linkJobs = [];
      const linkLabels = [];
      for (let i = 0; i < fileMirrors.length; i++) {
        const fm = fileMirrors[i];
        for (let j = 0; j < fm.mirrors.length; j++) {
          const mirror = fm.mirrors[j];
          linkLabels.push(mirror.friendlyName || "Mirror");
          linkJobs.push(
            dispatchMirror(mirror, axios, headers2, signal).catch(function(e) {
              console.warn(
                "[iqst] mirror " + mirror.friendlyName + ": " + (e && e.message)
              );
              return [];
            })
          );
        }
      }
      const linkResults = yield Promise.all(linkJobs);
      for (let i = 0; i < linkResults.length; i++) {
        const links = linkResults[i];
        const label = linkLabels[i];
        for (let k = 0; k < links.length; k++) {
          const entry = links[k];
          const stream = {
            server: "iqst (" + label + ")",
            link: entry.url,
            type: "m3u8"
          };
          if (entry.headers && Object.keys(entry.headers).length > 0) {
            stream.headers = entry.headers;
          }
          streamLinks.push(stream);
        }
      }
      console.log(
        "[iqst] " + streamLinks.length + " streams in " + (Date.now() - t0) + "ms"
      );
      return streamLinks;
    } catch (err) {
      console.error("[iqst] error: " + (err && err.message));
      return [];
    }
  });
}
var API, PLAYER, REFERER, UA, KNOWN_XVID_HOSTS, DIGITS;
var init_iqst = __esm({
  "providers/extractors/iqst.ts"() {
    "use strict";
    API = "https://streams.iqsmartgames.com";
    PLAYER = "https://pro.iqsmartgames.com";
    REFERER = "https://multimovies.garden/";
    UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
    KNOWN_XVID_HOSTS = {
      "hanerix.com": true,
      "morencius.com": true,
      "vibuxer.com": true,
      "n1mwq.org": true
    };
    DIGITS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
});

// providers/extractors/vidbolt.ts
function buildHeaders2() {
  return {
    Accept: "application/json, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "User-Agent": UA2,
    Referer: REFERER2,
    Origin: "https://vidbolt.xyz"
  };
}
function parseVidboltUrl(link) {
  const u = new URL(link);
  const m = u.pathname.match(/^\/(movie|tv)\/(\d+)/);
  if (!m) throw new Error("Unsupported VidBolt URL: " + link);
  const out = { isTv: m[1] === "tv", tmdbId: m[2] };
  if (out.isTv) {
    const se = u.pathname.match(/^\/tv\/\d+\/(\d+)\/(\d+)/);
    if (se) {
      out.season = Number(se[1]);
      out.episode = Number(se[2]);
    }
  }
  const q = u.searchParams;
  const qTitle = q.get("title");
  const qYear = q.get("year");
  const qImdb = q.get("imdb");
  if (qTitle) out.title = qTitle;
  if (qYear) out.year = qYear;
  if (qImdb) out.imdbId = qImdb;
  return out;
}
function extractSources(root) {
  if (!root) return [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.sources)) return root.sources;
  if (root.data) {
    if (Array.isArray(root.data)) return root.data;
    if (Array.isArray(root.data.sources)) return root.data.sources;
  }
  if (root.result) {
    if (Array.isArray(root.result)) return root.result;
    if (Array.isArray(root.result.sources)) return root.result.sources;
  }
  if (Array.isArray(root.files)) return root.files;
  if (Array.isArray(root.links)) return root.links;
  return [];
}
function addSources(root, label, results) {
  const sources = extractSources(root);
  let any = false;
  for (let i = 0; i < sources.length; i++) {
    const src = sources[i] || {};
    let url = String(src.url || src.link || src.file || src.src || "");
    if (!url) continue;
    if (url.indexOf("//") === 0) url = "https:" + url;
    if (url.indexOf("http") !== 0) continue;
    const quality = String(src.quality || src.label || src.resolution || "HD");
    const language = String(src.language || src.lang || src.audio || "");
    const langTag = language && language.toLowerCase() !== "original" ? " " + language : "";
    results.push({
      server: (label + " " + quality + langTag).trim(),
      link: url,
      type: /\.m3u8/i.test(url) ? "m3u8" : "mp4"
    });
    any = true;
  }
  return any;
}
function tryGet(axios, url, headers2, signal, label) {
  return __async(this, null, function* () {
    try {
      const r = yield axios.get(url, {
        headers: headers2,
        signal,
        timeout: 1e4,
        validateStatus: function(s) {
          return s < 500;
        }
      });
      if (r.status >= 400) {
        console.warn("[vidbolt] " + label + " -> " + r.status);
        return null;
      }
      return r.data;
    } catch (e) {
      console.warn("[vidbolt] " + label + " failed: " + (e && e.message || e));
      return null;
    }
  });
}
function vidboltExtractor(link, signal, axios, _cheerio, _headers, _providerContext) {
  return __async(this, null, function* () {
    const streamLinks = [];
    const t0 = Date.now();
    let parsed;
    try {
      parsed = parseVidboltUrl(link);
    } catch (e) {
      console.error("[vidbolt] url: " + (e && e.message));
      return streamLinks;
    }
    const isTv = parsed.isTv;
    const tmdbId = parsed.tmdbId;
    const season = parsed.season;
    const episode = parsed.episode;
    const title = parsed.title || "";
    const year = parsed.year || "";
    const imdbId = parsed.imdbId || "";
    console.log("[vidbolt] -> " + link);
    console.log(
      "[vidbolt] type=" + (isTv ? "tv" : "movie") + " tmdb=" + tmdbId + (isTv ? " s=" + season + " e=" + episode : "") + (title ? " title=" + title : "") + (imdbId ? " imdb=" + imdbId : "")
    );
    const headers2 = buildHeaders2();
    if (!isTv) {
      const movyUrl = "https://api.movy.lol/api/source/" + encodeURIComponent(tmdbId) + "?api_key=" + MOVY_KEY + "&apikey=" + MOVY_KEY;
      try {
        const movy = yield tryGet(axios, movyUrl, headers2, signal, "Movy");
        if (movy) {
          const added = addSources(movy, "Orion", streamLinks);
          if (added) console.log("[vidbolt] Orion -> " + streamLinks.length);
        }
      } catch (e) {
      }
    }
    if (isTv && season != null && episode != null) {
      const curxUrl = "https://img.animecurx.tech/api/tv/" + encodeURIComponent(tmdbId) + "/" + encodeURIComponent(String(season)) + "/" + encodeURIComponent(String(episode)) + "?api_key=" + CURX_KEY + "&apikey=" + CURX_KEY;
      try {
        const curx = yield tryGet(axios, curxUrl, headers2, signal, "AnimeCurx");
        if (curx) {
          const added = addSources(curx, "Orion", streamLinks);
          if (added) console.log("[vidbolt] AnimeCurx -> " + streamLinks.length);
        }
      } catch (e) {
      }
    }
    const idForScraper = imdbId || "tmdb" + tmdbId;
    const streamType = isTv ? "tv" : "movie";
    const epTag = isTv && season != null && episode != null ? " S" + season + "E" + episode : "";
    const titleFull = title ? title + epTag : "";
    const quasarParams = new URLSearchParams();
    quasarParams.append("tmdbId", tmdbId);
    if (imdbId) quasarParams.append("imdbId", imdbId);
    if (titleFull) quasarParams.append("title", titleFull);
    if (year) quasarParams.append("year", year);
    if (isTv && season != null) quasarParams.append("season", String(season));
    if (isTv && episode != null) quasarParams.append("episode", String(episode));
    const saffronParams = new URLSearchParams();
    saffronParams.append("tmdbId", tmdbId);
    if (imdbId) saffronParams.append("imdbId", imdbId);
    if (titleFull) saffronParams.append("title", titleFull);
    if (year) saffronParams.append("year", year);
    if (isTv && season != null) saffronParams.append("season", String(season));
    if (isTv && episode != null) saffronParams.append("episode", String(episode));
    const callistoParams = new URLSearchParams();
    callistoParams.append("tmdbId", tmdbId);
    if (imdbId) callistoParams.append("imdbId", imdbId);
    if (titleFull) callistoParams.append("title", titleFull);
    if (year) callistoParams.append("year", year);
    if (isTv && season != null) callistoParams.append("season", String(season));
    if (isTv && episode != null) callistoParams.append("episode", String(episode));
    const jobs = [
      {
        label: "Quasar",
        url: SCRAPER + "/scrape/Quasar/" + streamType + "/" + encodeURIComponent(idForScraper) + "?" + quasarParams.toString()
      },
      {
        label: "Saffron",
        url: SCRAPER + "/scrape/Saffron/" + streamType + "/" + encodeURIComponent(idForScraper) + "?" + saffronParams.toString()
      },
      {
        label: "Callisto",
        url: SCRAPER + "/scrape/Callisto/" + streamType + "/" + encodeURIComponent(idForScraper) + "?" + callistoParams.toString()
      }
    ];
    const results = yield Promise.all(
      jobs.map(function(job) {
        return tryGet(axios, job.url, headers2, signal, job.label).then(function(data) {
          return { label: job.label, data };
        });
      })
    );
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (!r.data) continue;
      const added = addSources(r.data, r.label, streamLinks);
      if (added) {
        console.log("[vidbolt] " + r.label + " -> " + streamLinks.length + " total");
      }
    }
    const seen = /* @__PURE__ */ new Set();
    const deduped = [];
    for (let i = 0; i < streamLinks.length; i++) {
      const s = streamLinks[i];
      if (!s.link || seen.has(s.link)) continue;
      seen.add(s.link);
      deduped.push(s);
    }
    console.log(
      "[vidbolt] " + deduped.length + " streams in " + (Date.now() - t0) + "ms"
    );
    return deduped;
  });
}
var MOVY_KEY, CURX_KEY, SCRAPER, REFERER2, UA2;
var init_vidbolt = __esm({
  "providers/extractors/vidbolt.ts"() {
    "use strict";
    MOVY_KEY = "0f461eaa465bb2a7acd037425217f2f209ef540a3171e1ac";
    CURX_KEY = "streamrip_secret_2026";
    SCRAPER = "https://scraper.vidbolt.xyz";
    REFERER2 = "https://vidbolt.xyz/";
    UA2 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
  }
});

// providers/extractors/cineverse.ts
function buildHeaders3() {
  return {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
    "User-Agent": MOBILE_UA,
    Referer: HUB + "/"
  };
}
function buildPlaybackHeaders() {
  return {
    "User-Agent": MOBILE_UA,
    Accept: "*/*",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
    Origin: HUB,
    Referer: HUB + "/"
  };
}
function deEscape2(s) {
  return String(s).replace(/\\+u([0-9a-fA-F]{4})/g, function(_m, h) {
    return String.fromCharCode(parseInt(h, 16));
  }).replace(/\\+\//g, "/").replace(/&amp;/g, "&");
}
function extractM3u8(html) {
  const decoded = deEscape2(html);
  let m = decoded.match(/var\s+directSrc\s*=\s*["']([^"']+\.m3u8[^"']*)["']/i);
  if (m && m[1] && /^https?:\/\//i.test(m[1])) {
    return m[1].trim();
  }
  m = decoded.match(
    /["']((?:\/|https?:\/\/)[^"'\s<>]*stream_proxy\.php\?url=[^"'\s<>]+)["']/i
  );
  if (m && m[1]) {
    let url = m[1].trim();
    if (url.indexOf("http") !== 0) {
      url = HUB + (url.indexOf("/") === 0 ? url : "/" + url);
    }
    if (!/[?&]seg=/.test(url)) {
      url += "&seg=direct";
    }
    return url;
  }
  m = decoded.match(/https?:\/\/[^"'\s\\<>]+\.m3u8[^"'\s\\<>]*/i);
  if (m) return m[0];
  m = decoded.match(/["'](\/hls\/[^"'\s]+master\.m3u8[^"'\s]*)["']/i);
  if (m && m[1]) return HUB + m[1];
  return null;
}
function parseServers(html) {
  const out = [];
  const seen = {};
  const re = /switchServer\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const platform = m[2];
    if (!platform || seen[platform]) continue;
    seen[platform] = true;
    out.push({ platform, name: m[3], code: m[4] });
  }
  return out;
}
function resolveProxyPage(server, axios, headers2, signal) {
  return __async(this, null, function* () {
    const proxyUrl = HUB + "/proxy.php?p=" + encodeURIComponent(server.platform) + "&c=" + encodeURIComponent(server.code) + "&title=" + encodeURIComponent("") + "&site_ref=" + encodeURIComponent(REFERER_HUB) + "&noredirect=1";
    console.log("[cineverse] proxy " + server.platform + " (" + server.code + ")");
    let resp;
    try {
      resp = yield axios.get(proxyUrl, {
        headers: headers2,
        signal,
        timeout: 6e3,
        maxRedirects: 0,
        validateStatus: function() {
          return true;
        }
      });
    } catch (e) {
      console.warn("[cineverse] " + server.platform + " failed: " + (e && e.message));
      return null;
    }
    const html = typeof resp.data === "string" ? resp.data : String(resp.data || "");
    console.log("[cineverse] " + server.platform + " -> " + resp.status + " (" + html.length + ")");
    if (resp.status >= 300 && resp.status < 400) {
      const loc = resp.headers && (resp.headers.location || resp.headers["Location"]) || "";
      if (loc && /\.m3u8/i.test(loc)) return { url: loc };
      return null;
    }
    const m3u8 = extractM3u8(html);
    if (!m3u8) {
      console.log("[cineverse] " + server.platform + " -> no m3u8");
      return null;
    }
    console.log("[cineverse] " + server.platform + " -> " + m3u8);
    return { url: m3u8 };
  });
}
function cineverseExtractor(link, signal, axios, _cheerio, _headers, _providerContext) {
  return __async(this, null, function* () {
    const streamLinks = [];
    const t0 = Date.now();
    const headers2 = buildHeaders3();
    console.log("[cineverse] -> " + link);
    let html = "";
    try {
      const r = yield axios.get(link, {
        headers: Object.assign({}, headers2, { Referer: REFERER_HUB }),
        signal,
        timeout: 6e3,
        validateStatus: function() {
          return true;
        }
      });
      html = typeof r.data === "string" ? r.data : String(r.data || "");
      console.log("[cineverse] embed -> " + r.status + " (" + html.length + ")");
    } catch (e) {
      console.error("[cineverse] embed: " + (e && e.message));
      return streamLinks;
    }
    const servers = parseServers(html);
    console.log("[cineverse] servers=" + servers.length);
    if (servers.length === 0) {
      console.log("[cineverse] embed head: " + html.slice(0, 200).replace(/\s+/g, " "));
      return [];
    }
    const results = yield Promise.allSettled(
      servers.map(function(s) {
        return resolveProxyPage(s, axios, headers2, signal);
      })
    );
    const playbackHeaders = buildPlaybackHeaders();
    const seenLinks = /* @__PURE__ */ new Set();
    let dropped = 0;
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (r.status !== "fulfilled" || !r.value) continue;
      const url = r.value.url;
      if (!url) continue;
      if (seenLinks.has(url)) {
        dropped++;
        continue;
      }
      seenLinks.add(url);
      streamLinks.push({
        server: "Cineverse " + servers[i].name,
        link: url,
        type: "m3u8",
        headers: playbackHeaders
      });
    }
    if (dropped > 0) {
      console.log("[cineverse] dropped " + dropped + " duplicate link(s)");
    }
    console.log(
      "[cineverse] " + streamLinks.length + " streams in " + (Date.now() - t0) + "ms"
    );
    return streamLinks;
  });
}
var HUB, REFERER_HUB, MOBILE_UA;
var init_cineverse = __esm({
  "providers/extractors/cineverse.ts"() {
    "use strict";
    HUB = "https://rozgarlelo.modiplay.xyz";
    REFERER_HUB = "https://multimovies.garden/";
    MOBILE_UA = "Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36";
  }
});

// providers/multi/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function raceWithAbort(run, ms, label) {
  return new Promise((resolve, reject) => {
    const ctrl = new AbortController();
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try {
        ctrl.abort();
      } catch (e) {
      }
      reject(new Error(label + " timeout " + ms + "ms"));
    }, ms);
    run(ctrl.signal).then(
      (v) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}
function parseServersCheerio(html, cheerio) {
  const out = [];
  let $;
  try {
    $ = cheerio.load(html, { decodeEntities: false }, false);
  } catch (e) {
    console.warn("[stream] cheerio.load failed: " + (e && e.message));
    return out;
  }
  const selectors = [
    "button.server-chip[data-url]",
    "#playerServerGrid button[data-url]",
    ".server-grid button[data-url]",
    "[data-url][data-server-index]",
    "button[data-url]"
  ];
  let nodes = null;
  for (let i = 0; i < selectors.length; i++) {
    try {
      const found = $(selectors[i]);
      if (found && found.length > 0) {
        nodes = found;
        break;
      }
    } catch (e) {
    }
  }
  if (!nodes) return out;
  nodes.each(function(_i, el) {
    try {
      const $el = $(el);
      const url = String($el.attr("data-url") || "").trim();
      if (!url) return;
      const id = String($el.attr("data-id") || "");
      const index = parseInt(String($el.attr("data-server-index") || "0"), 10) || 0;
      let name = "";
      try {
        name = String($el.find(".server-name").text() || "").trim();
      } catch (e) {
      }
      if (!name) name = id || "Server";
      out.push({ id, name, url, index });
    } catch (e) {
    }
  });
  return out;
}
function parseServersRegex(html) {
  const out = [];
  const re = /<button\b[^>]*\bdata-url\s*=\s*"([^"]+)"[^>]*>([\s\S]*?)<\/button>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const full = m[0];
    const url = String(m[1] || "").trim();
    const inner = m[2] || "";
    if (!url) continue;
    const idM = full.match(/\bdata-id\s*=\s*"([^"]*)"/i);
    const idxM = full.match(/\bdata-server-index\s*=\s*"([^"]*)"/i);
    const nameM = inner.match(/class\s*=\s*"server-name"[^>]*>([^<]*)</i);
    const id = idM ? idM[1] : "";
    let name = nameM ? String(nameM[1]).trim() : "";
    if (!name) name = id || "Server";
    out.push({
      id,
      name,
      url,
      index: idxM ? parseInt(idxM[1], 10) || 0 : 0
    });
  }
  return out;
}
function parseServers2(html, cheerio) {
  let list = parseServersCheerio(html, cheerio);
  if (list.length === 0) list = parseServersRegex(html);
  const seen = {};
  const deduped = [];
  for (let i = 0; i < list.length; i++) {
    const s = list[i];
    if (seen[s.url]) continue;
    seen[s.url] = true;
    deduped.push(s);
  }
  deduped.sort((a, b) => a.index - b.index);
  return deduped;
}
function resolveVidout(url, _mediaType, signal, ctx) {
  return __async(this, null, function* () {
    const out = [];
    const RAW = "https://raw.githubusercontent.com/Watchout2025/api/refs/heads/main";
    const idMatch = url.match(/\/movie\/([^/?#]+)/);
    if (!idMatch) return out;
    const primaryId = idMatch[1];
    const candidates = [primaryId];
    try {
      const u = new URL(url);
      const t = u.searchParams.get("tmdb");
      if (t && candidates.indexOf(t) < 0) candidates.push(t);
    } catch (e) {
    }
    const paths = [
      "/hls/movie/",
      "/movie/",
      "/hls/",
      "/"
    ];
    outer:
      for (let i = 0; i < candidates.length; i++) {
        const id = candidates[i];
        for (let j = 0; j < paths.length; j++) {
          const href = RAW + paths[j] + id;
          try {
            const r = yield ctx.axios.get(href, {
              headers: Object.assign({}, BASE_HEADERS, {
                Referer: "https://vidout.pages.dev/"
              }),
              signal
            });
            const body = String(r.data || "").trim();
            let hlsUrl = "";
            if (body.indexOf("http") === 0) {
              hlsUrl = body.split(/\s+/)[0];
            } else if (body.charAt(0) === "{") {
              try {
                const obj = JSON.parse(body);
                hlsUrl = String(obj.url || obj.hls || obj.link || "");
              } catch (e) {
              }
            }
            if (hlsUrl && hlsUrl.indexOf("http") === 0) {
              out.push({ server: "VIDOUT", link: hlsUrl, type: "m3u8" });
              break outer;
            }
          } catch (e) {
          }
        }
      }
    return out;
  });
}
function resolveFilmu(url, mediaType, signal, ctx) {
  return __async(this, null, function* () {
    const out = [];
    const HOST = "https://embed.filmu.in";
    const idMatch = url.match(/\/(?:movie|tv)\/(\d+)/);
    if (!idMatch) return out;
    const tmdbId = idMatch[1];
    const apiPath = mediaType === "tv" ? HOST + "/api/singularity-tv?tmdb=" + tmdbId : HOST + "/api/singularity-movie?id=" + tmdbId;
    try {
      const r = yield ctx.axios.get(apiPath, {
        headers: Object.assign({}, BASE_HEADERS, {
          Referer: HOST + "/" + mediaType + "/" + tmdbId
        }),
        signal
      });
      const root = r.data || {};
      const base = root._base || "";
      const sources = Array.isArray(root.sources) ? root.sources : [];
      for (let i = 0; i < sources.length; i++) {
        const src = sources[i] || {};
        let u = String(src.url || "");
        if (!u) continue;
        if (u.indexOf("http") !== 0 && base) {
          try {
            u = new URL(u, base).toString();
          } catch (e) {
          }
        }
        if (u.indexOf("http") !== 0) continue;
        out.push({
          server: "Filmu " + (src.quality || "1080p"),
          link: u,
          type: "m3u8"
        });
      }
      if (out.length === 0) {
        let single = String(root.url || "");
        if (!single && root.multilingual) single = String(root.multilingual_url || "");
        if (single.indexOf("http") === 0) {
          out.push({
            server: "Filmu " + (root.quality || "1080p"),
            link: single,
            type: "m3u8"
          });
        } else if (root.m3u8_path && base) {
          try {
            out.push({
              server: "Filmu " + (root.quality || "1080p"),
              link: new URL(root.m3u8_path, base).toString(),
              type: "m3u8"
            });
          } catch (e) {
          }
        }
      }
    } catch (e) {
      console.warn("[stream] filmu: " + (e && e.message));
    }
    return out;
  });
}
function routeServer(url, mediaType, signal, ctx) {
  return __async(this, null, function* () {
    const h = BASE_HEADERS;
    if (CINEVERSE_RE.test(url)) {
      return cineverseExtractor(url, signal, ctx.axios, ctx.cheerio, h, ctx);
    }
    if (IQST_RE.test(url)) {
      return iqstExtractor(url, signal, ctx.axios, ctx.cheerio, h, ctx);
    }
    if (VIDBOLT_RE.test(url)) {
      return vidboltExtractor(url, signal, ctx.axios, ctx.cheerio, h, ctx);
    }
    if (VIDOUT_RE.test(url)) {
      return resolveVidout(url, mediaType, signal, ctx);
    }
    if (FILMU_RE.test(url)) {
      return resolveFilmu(url, mediaType, signal, ctx);
    }
    return [];
  });
}
function detectMediaType(type, link, html) {
  const t = (type || "").toLowerCase();
  if (t.indexOf("tv") >= 0 || t.indexOf("series") >= 0 || t.indexOf("show") >= 0)
    return "tv";
  if (t.indexOf("movie") >= 0 || t.indexOf("film") >= 0) return "movie";
  if (/\/tv\//i.test(link) || /\/series\//i.test(link)) return "tv";
  if (/\/movie\//i.test(link) || /\/film\//i.test(link)) return "movie";
  if (/\/tv\//i.test(html)) return "tv";
  return "movie";
}
function getStream(_0) {
  return __async(this, arguments, function* ({
    link,
    type,
    signal,
    providerContext
  }) {
    const axios = providerContext.axios;
    const cheerio = providerContext.cheerio;
    const t0 = Date.now();
    let html = "";
    try {
      const res = yield axios.get(link, { headers: BASE_HEADERS, signal });
      html = res.data;
    } catch (e) {
      console.error("[stream] page load failed: " + (e && e.message));
      return [];
    }
    const servers = parseServers2(html, cheerio);
    console.log("[stream] " + servers.length + " chip(s) parsed");
    if (servers.length === 0) return [];
    const mediaType = detectMediaType(type, link, html);
    console.log("[stream] media type=" + mediaType + "  starting parallel run");
    const jobs = servers.map((server) => {
      const budget = TIMEOUTS[server.name] || TIMEOUTS.default;
      const t = Date.now();
      return raceWithAbort(
        (innerSignal) => routeServer(server.url, mediaType, innerSignal, providerContext),
        budget,
        server.name
      ).then(
        (streams) => {
          const dt = Date.now() - t;
          console.log("[stream] <- " + server.name + ": " + streams.length + " in " + dt + "ms");
          return { server, streams };
        },
        (e) => {
          const dt = Date.now() - t;
          console.warn("[stream] x " + server.name + " (" + dt + "ms): " + (e && e.message));
          return { server, streams: [] };
        }
      );
    });
    const settled = yield Promise.all(jobs);
    const streamLinks = [];
    const fallbacks = [];
    for (let i = 0; i < settled.length; i++) {
      const { server, streams } = settled[i];
      if (streams.length === 0) {
        fallbacks.push({
          server: server.name + " (embed)",
          link: server.url,
          type: "iframe"
        });
        continue;
      }
      for (let j = 0; j < streams.length; j++) {
        const ex = streams[j];
        const merged = {
          server: server.name + " / " + (ex.server || "stream"),
          link: ex.link,
          type: ex.type || "m3u8"
        };
        if (ex.headers) merged.headers = ex.headers;
        if (ex.quality) merged.quality = ex.quality;
        if (ex.subtitles) merged.subtitles = ex.subtitles;
        streamLinks.push(merged);
      }
    }
    console.log(
      "[stream] DONE " + streamLinks.length + " real + " + fallbacks.length + " iframe in " + (Date.now() - t0) + "ms"
    );
    if (streamLinks.length === 0 && fallbacks.length > 0) return fallbacks;
    return streamLinks;
  });
}
var REFERER3, BASE_HEADERS, CINEVERSE_RE, IQST_RE, VIDBOLT_RE, VIDOUT_RE, FILMU_RE, TIMEOUTS;
var init_stream = __esm({
  "providers/multi/stream.ts"() {
    "use strict";
    init_iqst();
    init_vidbolt();
    init_cineverse();
    REFERER3 = "https://multimovies.garden/";
    BASE_HEADERS = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Referer: REFERER3
    };
    CINEVERSE_RE = /rozgarlelo\.modiplay\.xyz\/embed\//i;
    IQST_RE = /streams\.iqsmartgames\.com\/embed\//i;
    VIDBOLT_RE = /vidbolt\.xyz\//i;
    VIDOUT_RE = /vidout\.pages\.dev\//i;
    FILMU_RE = /embed\.filmu\.in\//i;
    TIMEOUTS = {
      Cineverse: 15e3,
      // reduced from 30s, this one was the killer
      "GD mirror": 12e3,
      VIDOUT: 5e3,
      Filmu: 1e4,
      VidBolt: 12e3,
      default: 12e3
    };
  }
});

// providers/multi/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/multi/episodes.ts"() {
    "use strict";
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        const { axios, cheerio, commonHeaders: headers2 } = providerContext;
        console.log("getEpisodeLinks", url);
        try {
          const res = yield axios.get(url, {
            headers: __spreadProps(__spreadValues({}, headers2), {
              Referer: url.split("/").slice(0, 3).join("/")
            })
          });
          const $ = cheerio.load(res.data);
          const seasonMatch = url.match(/\/season\/(\d+)/i) || url.match(/[?&]season=(\d+)/i);
          const season = seasonMatch == null ? void 0 : seasonMatch[1];
          let grid = season ? $(`#cinejoy-season-${season}`) : $(".cinejoy-season-grid.active");
          if (!grid.length) grid = $(".cinejoy-season-grid.active").first();
          if (!grid.length) grid = $(".cinejoy-season-grid").first();
          if ($(".cinejoy-episodes-section").length && grid.length) {
            const episodes2 = [];
            const baseUrl = url.split("/").slice(0, 3).join("/");
            grid.find(".cinejoy-ep-card").each((_, card) => {
              const el = $(card);
              const a = el.find("a.cinejoy-ep-thumb-link").first();
              let href = a.attr("href") || el.find("a.cinejoy-ep-name").first().attr("href") || "";
              if (!href) return;
              if (href.startsWith("/")) {
                href = baseUrl + href;
              }
              const epNo = el.find(".cinejoy-ep-badge-num").first().text().trim();
              const name = el.find(".cinejoy-ep-name").first().text().trim() || el.find(".cinejoy-ep-name").first().attr("title") || "";
              episodes2.push({
                title: epNo ? `${epNo} ${name}`.trim() : name,
                link: href
              });
            });
            if (episodes2.length) return episodes2;
          }
          const container = $(".entry-content,.entry-inner, .download-links-div");
          $(".unili-content,.code-block-1").remove();
          const episodes = [];
          container.find("h5").each((_, element) => {
            const el = $(element);
            const title = el.text().trim();
            const hubCloudLink = el.next(".downloads-btns-div").find(
              'a[style*="background: linear-gradient(135deg,#e629d0,#007bff);"]'
            ).attr("href");
            if (title && hubCloudLink) {
              episodes.push({
                title: title.replace(/[-:]/g, "").trim(),
                link: hubCloudLink
              });
            }
          });
          return episodes;
        } catch (err) {
          console.log("getEpisodeLinks error:", err);
          return [];
        }
      });
    };
  }
});

// providers/multi/multi.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
