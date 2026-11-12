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

// providers/hdmovieslife/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/hdmovieslife/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Latest Movies", filter: "/movies" },
      { title: "Latest Series", filter: "/series" },
      { title: "4K UHD", filter: "/quality/4K+UHD" },
      { title: "1080p FHD", filter: "/quality/1080p+FHD" },
      { title: "Action", filter: "/genre/action" },
      { title: "Sci-Fi & Fantasy", filter: "/genre/sci-fi-fantasy" }
    ];
    genres = [];
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

// providers/hdmovieslife/utils.ts
var cleanText, getQuality, qualityRank, absolutize, isHdlinks, isPackUrl, seasonLabel, formValues;
var init_utils = __esm({
  "providers/hdmovieslife/utils.ts"() {
    "use strict";
    cleanText = (value) => (value || "").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
    getQuality = (text) => {
      const m = text.match(/(?:^|[^\d])(2160|1080|720|480|360)p?(?:[^\d]|$)/i);
      if (m) return m[1];
      if (/\b4k\b|\buhd\b/i.test(text)) return "2160";
      return void 0;
    };
    qualityRank = (quality) => {
      const n = Number(quality || 0);
      return Number.isFinite(n) ? n : 0;
    };
    absolutize = (href, baseUrl) => {
      const value = (href || "").trim();
      if (!value) return "";
      try {
        return new URL(value, `${baseUrl}/`).href;
      } catch (e) {
        return value;
      }
    };
    isHdlinks = (url) => /^https:\/\/(?:[\w-]+\.)?(?:hdlinks\.online|fxshare\.org|fxdl\.site|gdfiles-xyz\.workers\.dev)\/file\/[^/?#]+(?:[/?#]|$)/i.test(url);
    isPackUrl = (url) => /\/pack\//i.test(url);
    seasonLabel = (text) => {
      const match = (text || "").match(/season\s*(\d+)/i);
      if (match) return `Season ${match[1]}`;
      const tag = (text || "").match(/s(\d{1,2})\s*complete/i);
      if (tag) return `Season ${Number(tag[1])}`;
      return "Download";
    };
    formValues = ($, el) => {
      const values = {};
      $(el).find("input[type='hidden'], input[name]").each((_i, input) => {
        const name = $(input).attr("name");
        if (name) values[name] = $(input).attr("value") || "";
      });
      return values;
    };
  }
});

// providers/hdmovieslife/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function fetchText(axios, url, signal, headers) {
  return __async(this, null, function* () {
    var _a;
    const cached = htmlCache.get(url);
    if (cached && Date.now() - cached.at < HTML_TTL_MS) return cached.html;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const onOuterAbort = () => controller.abort();
    signal == null ? void 0 : signal.addEventListener("abort", onOuterAbort);
    try {
      const res = yield axios.get(url, {
        signal: controller.signal,
        headers,
        timeout: REQUEST_TIMEOUT_MS,
        maxRedirects: 5
      });
      const html = typeof res.data === "string" ? res.data : String((_a = res.data) != null ? _a : "");
      if (html) {
        if (htmlCache.size >= 6) htmlCache.delete(htmlCache.keys().next().value);
        htmlCache.set(url, { at: Date.now(), html });
      }
      return html;
    } finally {
      clearTimeout(timer);
      signal == null ? void 0 : signal.removeEventListener("abort", onOuterAbort);
    }
  });
}
function parseCards($, baseUrl) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  $(".movie-card").each((_i, el) => {
    const node = $(el);
    const anchor = node.find(".movie-title a").first();
    const href = anchor.attr("href") || node.find("a.movie-poster-box").attr("href") || "";
    if (!href) return;
    const link = absolutize(href, baseUrl);
    if (seen.has(link)) return;
    seen.add(link);
    const img = node.find(".movie-poster-img, img").first();
    const image = absolutize(img.attr("src") || img.attr("data-src") || "", baseUrl);
    const title = cleanText(anchor.text()) || cleanText(img.attr("alt"));
    if (!title) return;
    out.push({ title, link, image });
  });
  return out;
}
var REQUEST_TIMEOUT_MS, HTML_TTL_MS, htmlCache, withPage, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/hdmovieslife/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    REQUEST_TIMEOUT_MS = 15e3;
    HTML_TTL_MS = 3 * 6e4;
    htmlCache = /* @__PURE__ */ new Map();
    withPage = (url, page) => {
      if (page <= 1) return url;
      return url.includes("?") ? `${url}&page=${page}` : `${url.replace(/\/+$/, "")}/page/${page}`;
    };
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = (yield getBaseUrl("hdmovieslife")) || "https://hdmovies.life";
        const headers = commonHeaders || {};
        const path = filter && filter !== "/" ? filter : "/movies";
        const url = withPage(
          `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`,
          page
        );
        try {
          const html = yield fetchText(axios, url, signal, headers);
          return parseCards(cheerio.load(html), baseUrl);
        } catch (err) {
          throwProviderError("HDMoviesLife", "posts", err);
        }
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = (yield getBaseUrl("hdmovieslife")) || "https://hdmovies.life";
        const headers = commonHeaders || {};
        const query = cleanText(searchQuery);
        if (!query) return [];
        try {
          const url = withPage(
            `${baseUrl}/search?q=${encodeURIComponent(query)}`,
            page
          );
          const html = yield fetchText(axios, url, signal, headers);
          return parseCards(cheerio.load(html), baseUrl);
        } catch (err) {
          throwProviderError("HDMoviesLife", "search posts", err);
        }
      });
    };
  }
});

// providers/hdmovieslife/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function fetchHtml(axios, url, headers) {
  return __async(this, null, function* () {
    var _a;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS2);
    try {
      const res = yield axios.get(url, {
        headers,
        signal: controller.signal,
        timeout: REQUEST_TIMEOUT_MS2
      });
      return typeof res.data === "string" ? res.data : String((_a = res.data) != null ? _a : "");
    } finally {
      clearTimeout(timer);
    }
  });
}
var REQUEST_TIMEOUT_MS2, dedupeByUrl, entryTitle, getMeta;
var init_meta = __esm({
  "providers/hdmovieslife/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    REQUEST_TIMEOUT_MS2 = 15e3;
    dedupeByUrl = (entries) => {
      const map = /* @__PURE__ */ new Map();
      for (const entry of entries) {
        const seen = map.get(entry.url);
        if (!seen || qualityRank(entry.quality) > qualityRank(seen.quality)) {
          map.set(entry.url, entry);
        }
      }
      return [...map.values()];
    };
    entryTitle = (entry) => [entry.quality, entry.label, entry.size].filter(Boolean).join(" ");
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = (yield getBaseUrl("hdmovieslife")) || "https://hdmovies.life";
        const url = new URL(link, `${baseUrl}/`).href;
        try {
          const html = yield fetchHtml(axios, url, commonHeaders);
          const $ = cheerio.load(html);
          const title = cleanText($("h1.movie-details-title").first().text()) || cleanText($("h1").first().text()) || cleanText($("meta[property='og:title']").attr("content"));
          const image = cleanText(
            $("meta[property='og:image']").attr("content") || $(".movie-details-poster").attr("src") || ""
          );
          const synopsis = cleanText($(".movie-storyline p").first().text()) || cleanText($("meta[name='description']").attr("content"));
          const tags = [];
          $(".movie-meta-tags .meta-pill").each((_i, el) => {
            const text = cleanText($(el).text());
            if (text && !/views|dls|⬇|👁/i.test(text) && tags.length < 8) {
              tags.push(text);
            }
          });
          const entries = [];
          $("form.dl-post-form").each((_i, el) => {
            const values = formValues($, el);
            const downloadUrl = values.url || "";
            if (!/hdlinks\.online/i.test(downloadUrl)) return;
            entries.push({
              url: downloadUrl,
              label: cleanText(values.label) || "Download",
              quality: getQuality(values.quality || values.tier_title || ""),
              size: cleanText(values.size),
              tier: cleanText(values.tier_title),
              season: seasonLabel(values.tier_title)
            });
          });
          const isSeries = /\/(?:series|tv)\//i.test(url) || entries.some((entry) => /season\s*\d/i.test(entry.tier));
          const linkList = [];
          if (!isSeries) {
            const files = dedupeByUrl(entries);
            if (files.length > 0) {
              linkList.push({
                title: "Download",
                directLinks: files.map((entry) => ({
                  title: entryTitle(entry),
                  link: entry.url,
                  type: "movie"
                }))
              });
            }
          } else {
            const groups = /* @__PURE__ */ new Map();
            for (const entry of entries) {
              const key = entry.season;
              if (!groups.has(key)) groups.set(key, []);
              groups.get(key).push(entry);
            }
            const seasons = [...groups.keys()].sort((a, b) => {
              var _a, _b;
              const na = Number(((_a = a.match(/\d+/)) == null ? void 0 : _a[0]) || 0);
              const nb = Number(((_b = b.match(/\d+/)) == null ? void 0 : _b[0]) || 0);
              return na - nb;
            });
            for (const season of seasons) {
              const group = groups.get(season) || [];
              const packs = dedupeByUrl(group.filter((entry) => isPackUrl(entry.url)));
              if (packs.length > 0) {
                const best = packs.reduce(
                  (a, b) => qualityRank(b.quality) > qualityRank(a.quality) ? b : a
                );
                linkList.push({
                  title: `${season} (${best.quality || "HD"})`,
                  quality: best.quality,
                  // The pack page lists one file per episode; episodes.ts reads it.
                  episodesLink: best.url
                });
                continue;
              }
              const files = dedupeByUrl(group.filter((entry) => !isPackUrl(entry.url)));
              if (files.length > 0) {
                linkList.push({
                  title: season,
                  directLinks: files.map((entry) => ({
                    title: entryTitle(entry),
                    link: entry.url,
                    type: "series"
                  }))
                });
              }
            }
          }
          return {
            title,
            synopsis,
            image,
            imdbId: "",
            tags,
            type: isSeries ? "series" : "movie",
            linkList,
            webUrl: url
          };
        } catch (err) {
          throwProviderError("HDMoviesLife", "metadata", err);
        }
      });
    };
  }
});

// providers/extractors/httpMedia.ts
function httpUrl(href, base) {
  const value = href == null ? void 0 : href.trim();
  if (!value || value.startsWith("#")) return;
  try {
    const parent = new URL(base);
    const directory = parent.pathname.endsWith("/") ? parent.pathname : parent.pathname.replace(/[^/]*$/, "");
    const candidate = value.startsWith("?") ? `${parent.origin}${parent.pathname}${value}` : value.startsWith("//") ? `${parent.protocol}${value}` : /^[a-z][a-z\d+.-]*:/i.test(value) ? value : value.startsWith("/") ? `${parent.origin}${value}` : `${parent.origin}${directory}${value}`;
    const url = new URL(candidate);
    if (/^https?:\/\/[^/?#@]+(?=[/?#]|$)/i.test(url.href) && !url.username && !url.password) {
      return url.href;
    }
  } catch (e) {
    return;
  }
}
function followHeadRedirects(axios, url, headers, signal, onResponse, maxHops = 6) {
  return __async(this, null, function* () {
    var _a;
    let current = url;
    let referer = "";
    for (let hop = 0; hop < maxHops; hop++) {
      const response = yield axios.head(current, {
        headers: __spreadValues(__spreadValues({}, headers), referer ? { Referer: referer } : {}),
        signal,
        timeout: 6e3,
        maxRedirects: 0,
        validateStatus: () => true
      }).catch(() => void 0);
      if (!response) return;
      onResponse == null ? void 0 : onResponse(response);
      const location = (_a = response.headers) == null ? void 0 : _a.location;
      if (location && response.status >= 300 && response.status < 400) {
        referer = current;
        current = new URL(location, current).href;
        continue;
      }
      if (response.status >= 400) return;
      return responseUrl(response, current);
    }
    return current;
  });
}
function mediaExtension(url) {
  var _a;
  return (_a = url.match(/\.(m3u8|mpd|mp4|mkv|webm)(?=[?#]|$)/i)) == null ? void 0 : _a[1].toLowerCase();
}
function probeMedia(axios, link, headers, signal, requireRange = false) {
  return __async(this, null, function* () {
    try {
      const options = { headers, signal, timeout: 4e3 };
      const head = yield axios.head(link, options);
      const mime = String(head.headers["content-type"] || "").split(";")[0].toLowerCase();
      if (/^(?:application|audio)\/(?:vnd\.apple\.mpegurl|x-mpegurl|mpegurl)$/.test(mime)) return "m3u8";
      if (mime === "application/dash+xml") return "mpd";
      const type = mime === "video/x-matroska" || mime === "video/matroska" ? "mkv" : mime === "video/mp4" ? "mp4" : mime === "video/webm" ? "webm" : void 0;
      if (type && !requireRange) return type;
      if (!type && mime !== "application/octet-stream") return;
      try {
        const range = yield axios.get(link, __spreadProps(__spreadValues({}, options), {
          headers: __spreadProps(__spreadValues({}, headers), { Range: "bytes=0-63" }),
          responseType: "arraybuffer",
          maxContentLength: 1024
        }));
        if (range.status === 206 && /^bytes 0-/i.test(String(range.headers["content-range"]))) {
          const bytes = new Uint8Array(range.data);
          if (bytes[0] === 26 && bytes[1] === 69 && bytes[2] === 223 && bytes[3] === 163) {
            return type === "webm" || mediaExtension(link) === "webm" ? "webm" : "mkv";
          }
          if (bytes[4] === 102 && bytes[5] === 116 && bytes[6] === 121 && bytes[7] === 112) return "mp4";
        }
      } catch (e) {
      }
      return type;
    } catch (e) {
      return;
    }
  });
}
var responseUrl;
var init_httpMedia = __esm({
  "providers/extractors/httpMedia.ts"() {
    "use strict";
    responseUrl = (response, requested) => {
      var _a, _b, _c;
      return ((_a = response.request) == null ? void 0 : _a.responseURL) || ((_c = (_b = response.request) == null ? void 0 : _b.res) == null ? void 0 : _c.responseUrl) || requested;
    };
  }
});

// providers/extractors/directFiles.ts
function pixelDrainDirect(url) {
  const match = url.match(
    /pixeldrain\.(?:com|dev)\/(?:u\/|api\/file\/|file\/)([A-Za-z0-9]+)/i
  );
  return match ? `https://pixeldrain.dev/api/file/${match[1]}?download` : void 0;
}
var init_directFiles = __esm({
  "providers/extractors/directFiles.ts"() {
    "use strict";
  }
});

// providers/hdmovieslife/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function resolvePixeldrainMirror(_0, _1, _2, _3) {
  return __async(this, arguments, function* (link, quality, { axios, cheerio, commonHeaders }, signal) {
    var _a, _b;
    const jar = { value: "" };
    const headers = (extra = {}) => __spreadValues(__spreadValues(__spreadValues({}, commonHeaders), jar.value ? { Cookie: jar.value } : {}), extra);
    try {
      const entry = yield axios.get(link, {
        headers: headers(),
        signal,
        timeout: 8e3,
        validateStatus: () => true
      });
      accumulateCookies(jar, entry);
      const entryUrl = responseUrl(entry, link);
      if (!isHdlinks(entryUrl)) return;
      let buttonsHtml = typeof entry.data === "string" && /data-mirror/.test(entry.data) ? entry.data : "";
      if (!buttonsHtml) {
        const buttons = yield axios.get(
          `${entryUrl.split("?")[0]}?action=get_buttons`,
          {
            headers: headers({ Referer: entryUrl, "X-Requested-With": "XMLHttpRequest" }),
            signal,
            timeout: 8e3,
            validateStatus: () => true
          }
        );
        accumulateCookies(jar, buttons);
        buttonsHtml = typeof buttons.data === "string" ? buttons.data : "";
      }
      if (!buttonsHtml) return;
      let $ = cheerio.load(buttonsHtml);
      let href = $('a[data-mirror="pixeldrain"]').first().attr("href") || "";
      if (!href) {
        $("a[href]").each((_i, el) => {
          const candidate = $(el).attr("href") || "";
          if (!href && /pixeldrain\./i.test(candidate)) href = candidate;
        });
      }
      if (!href) return;
      let url = new URL(href, entryUrl).href;
      let referer = entryUrl;
      let resolved = "";
      for (let hop = 0; hop < 6 && !resolved; hop++) {
        if (signal == null ? void 0 : signal.aborted) return;
        const final = yield followHeadRedirects(
          axios,
          url,
          headers({ Referer: referer }),
          signal,
          (response) => accumulateCookies(jar, response)
        );
        if (!final) return;
        resolved = pixelDrainDirect(final) || "";
        if (!resolved && mediaExtension(final)) {
          const fileHeaders2 = __spreadProps(__spreadValues({}, commonHeaders), { Referer: referer });
          const type2 = yield probeMedia(axios, final, fileHeaders2, signal, true);
          if (type2) {
            return { server: "HDMoviesLife PixelDrain", link: final, quality: getQuality(final) || quality, type: type2, headers: fileHeaders2 };
          }
        }
        if (resolved) break;
        const pageResponse = yield axios.get(final, {
          headers: headers({ Referer: url }),
          signal,
          timeout: 8e3,
          validateStatus: () => true
        });
        accumulateCookies(jar, pageResponse);
        if (pageResponse.status !== 200 || typeof pageResponse.data !== "string") return;
        const html = pageResponse.data;
        const page = cheerio.load(html);
        const mirrorHref = page('a[data-mirror="pixeldrain"]').first().attr("href") || ((_a = html.match(/href="([^"]*pixeldrain\.[^"]*)"/i)) == null ? void 0 : _a[1]) || "";
        if (!mirrorHref) {
          const inline = (_b = html.match(/https?:\/\/pixeldrain\.[^"'\s<>]+/i)) == null ? void 0 : _b[0];
          if (inline) resolved = pixelDrainDirect(inline) || "";
          break;
        }
        referer = final;
        url = new URL(String(mirrorHref).replace(/&amp;/g, "&"), final).href;
      }
      if (!resolved) return;
      const fileHeaders = __spreadProps(__spreadValues({}, commonHeaders), { Referer: "https://pixeldrain.dev/" });
      const type = yield probeMedia(axios, resolved, fileHeaders, signal, true);
      if (type) {
        return {
          server: "HDMoviesLife PixelDrain",
          link: resolved,
          type,
          quality: quality || getQuality(link),
          headers: fileHeaders
        };
      }
    } catch (e) {
    }
    return;
  });
}
function resolveFastDownload(_0, _1, _2, _3) {
  return __async(this, arguments, function* (link, quality, { axios, cheerio, commonHeaders }, signal) {
    try {
      const options = { signal, timeout: 5e3, maxContentLength: 256 * 1024 };
      const response = yield axios.get(link, __spreadProps(__spreadValues({}, options), { headers: commonHeaders }));
      const landing = responseUrl(response, link);
      if (!isHdlinks(landing) || typeof response.data !== "string") return;
      const $ = cheerio.load(response.data);
      const payload = $('a[href^="?payload="]').first().attr("href");
      const next = httpUrl(payload, landing);
      if (!next) return;
      const filePage = yield axios.get(next, __spreadProps(__spreadValues({}, options), {
        headers: __spreadProps(__spreadValues({}, commonHeaders), { Referer: landing })
      }));
      const filePageUrl = responseUrl(filePage, next);
      if (!isFxFilePage(filePageUrl) || typeof filePage.data !== "string") return;
      const file = cheerio.load(filePage.data);
      const signed = httpUrl(file('a[href*="start=1"][href*="hash="]').first().attr("href"), filePageUrl);
      if (!signed || signed.split("?")[0] !== filePageUrl.split("?")[0]) return;
      const headers = __spreadProps(__spreadValues({}, commonHeaders), { Referer: filePageUrl });
      const type = yield probeMedia(axios, signed, headers, signal, true);
      if (type) return { server: "HDMoviesLife Fast Drive", link: signed, quality: getQuality(filePageUrl) || quality, type, headers };
    } catch (e) {
      return;
    }
  });
}
function getStream(_0) {
  return __async(this, arguments, function* ({
    link,
    signal,
    providerContext
  }) {
    const { axios, cheerio, commonHeaders } = providerContext;
    const targets = /* @__PURE__ */ new Map();
    if (signal == null ? void 0 : signal.aborted) return [];
    try {
      if (isHdlinks(link)) {
        targets.set(link, void 0);
      } else {
        const { data } = yield axios.get(link, {
          headers: commonHeaders,
          signal,
          timeout: 15e3
        });
        const $ = cheerio.load(typeof data === "string" ? data : "");
        $("form.dl-post-form").each((_i, el) => {
          const { url, quality, tier_title } = formValues($, el);
          if (!url || !isHdlinks(url)) return;
          const resolution = getQuality(quality || "") || getQuality(tier_title || "");
          if (!targets.has(url) || qualityRank(resolution) > qualityRank(targets.get(url))) {
            targets.set(url, resolution);
          }
        });
      }
      const ordered = [...targets].sort((a, b) => qualityRank(b[1]) - qualityRank(a[1]));
      const controller = new AbortController();
      const cancel = () => controller.abort();
      signal == null ? void 0 : signal.addEventListener("abort", cancel);
      if (signal == null ? void 0 : signal.aborted) cancel();
      const deadline = setTimeout(cancel, 22e3);
      try {
        return yield Promise.all(ordered.map((_02, _1) => __async(null, [_02, _1], function* ([url, quality], index) {
          const verified = index < 3 && ((yield resolvePixeldrainMirror(url, quality, providerContext, controller.signal)) || (yield resolveFastDownload(url, quality, providerContext, controller.signal)));
          return verified || {
            server: "HDMoviesLife (Download Only)",
            link: url,
            type: "embed",
            quality,
            downloadOnly: true
          };
        })));
      } finally {
        clearTimeout(deadline);
        signal == null ? void 0 : signal.removeEventListener("abort", cancel);
      }
    } catch (err) {
      throwProviderError("HDMoviesLife", "stream", err);
    }
  });
}
var isFxFilePage, accumulateCookies;
var init_stream = __esm({
  "providers/hdmovieslife/stream.ts"() {
    "use strict";
    init_providerErrors();
    init_utils();
    init_httpMedia();
    init_directFiles();
    isFxFilePage = (url) => /^https:\/\/[^./]+\.fxcloud-as\.site\/dl\//i.test(url);
    accumulateCookies = (jar, response) => {
      var _a;
      const header = (_a = response == null ? void 0 : response.headers) == null ? void 0 : _a["set-cookie"];
      if (!header) return;
      for (const line of Array.isArray(header) ? header : [header]) {
        const pair = String(line).split(";")[0];
        if (!pair || jar.value.split("; ").includes(pair)) continue;
        jar.value = jar.value ? `${jar.value}; ${pair}` : pair;
      }
    };
  }
});

// providers/hdmovieslife/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var REQUEST_TIMEOUT_MS3, episodeTitle, getEpisodes;
var init_episodes = __esm({
  "providers/hdmovieslife/episodes.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    REQUEST_TIMEOUT_MS3 = 15e3;
    episodeTitle = (text) => {
      const label = cleanText(text);
      const tag = label.match(/\bS\d{1,2}\s*E\d{1,3}\b/i);
      if (tag) return tag[0].toUpperCase();
      return label.replace(/^.*?\.onl?\s*[-–]\s*/i, "").replace(/\.(?:mkv|mp4|zip|rar)$/i, "").slice(0, 80);
    };
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        var _a;
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = (yield getBaseUrl("hdmovieslife")) || "https://hdmovies.life";
        const pageUrl = absolutize(url, baseUrl);
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS3);
          try {
            const res = yield axios.get(pageUrl, {
              headers: commonHeaders,
              signal: controller.signal,
              timeout: REQUEST_TIMEOUT_MS3
            });
            const $ = cheerio.load(
              typeof res.data === "string" ? res.data : String((_a = res.data) != null ? _a : "")
            );
            if (!isPackUrl(pageUrl)) {
              const title = cleanText($("title").text()).replace(/^.*?—\s*/, "") || "Download";
              return [{ title: episodeTitle(title), link: pageUrl }];
            }
            const episodes = [];
            const seen = /* @__PURE__ */ new Set();
            $("a[href*='/file/']").each((_i, el) => {
              const href = absolutize($(el).attr("href") || "", pageUrl);
              if (!href || seen.has(href)) return;
              seen.add(href);
              episodes.push({
                title: episodeTitle($(el).text()) || `Episode ${episodes.length + 1}`,
                link: href
              });
            });
            const tagOrder = (title) => {
              const match = title.match(/^S(\d{1,2})E(\d{1,3})$/i);
              return match ? Number(match[1]) * 1e3 + Number(match[2]) : Infinity;
            };
            return episodes.sort((a, b) => tagOrder(a.title) - tagOrder(b.title));
          } finally {
            clearTimeout(timer);
          }
        } catch (err) {
          throwProviderError("HDMoviesLife", "episodes", err);
        }
      });
    };
  }
});

// providers/hdmovieslife/hdmovieslife.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
