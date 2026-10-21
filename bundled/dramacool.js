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

// providers/dramacool/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog
});
var catalog;
var init_catalog = __esm({
  "providers/dramacool/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Recently Added",
        filter: "/recently-added"
      },
      {
        title: "Most Popular",
        filter: "/most-popular-drama"
      }
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

// providers/dramacool/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function resolveBaseUrl(providerContext) {
  return __async(this, null, function* () {
    try {
      if (providerContext && typeof providerContext.getBaseUrl === "function") {
        const resolved = (yield providerContext.getBaseUrl("dramacool")) || (yield providerContext.getBaseUrl("asianc"));
        if (resolved) {
          return resolved.replace(/\/+$/, "");
        }
      }
    } catch (e) {
    }
    try {
      const resolved = (yield getBaseUrl("dramacool")) || (yield getBaseUrl("asianc"));
      if (resolved) {
        return resolved.replace(/\/+$/, "");
      }
    } catch (e) {
    }
    return DEFAULT_BASE_URL;
  });
}
function parseItems(html, cheerio, baseUrl) {
  const $ = cheerio.load(html);
  const posts = [];
  $("ul.list-episode-item li, ul.list-movie li, ul.list-star li").each(
    (_, element) => {
      var _a;
      const $el = $(element);
      const a = $el.find("a").first();
      const href = a.attr("href") || "";
      const title = $el.find("h3, .title").text().trim() || ((_a = a.attr("title")) == null ? void 0 : _a.trim()) || "";
      const rawImg = $el.find("img").attr("data-original") || $el.find("img").attr("src") || "";
      const tag = $el.find(".ep, .type").first().text().trim();
      if (title && href) {
        const link = href.startsWith("http") ? href : `${baseUrl}${href.startsWith("/") ? "" : "/"}${href}`;
        const image = rawImg.startsWith("http") ? rawImg : rawImg ? `${baseUrl}${rawImg.startsWith("/") ? "" : "/"}${rawImg}` : "";
        posts.push(__spreadValues({
          title,
          link,
          image,
          aspectRatio: 2 / 3
        }, tag ? { tag } : {}));
      }
    }
  );
  return posts;
}
var DEFAULT_BASE_URL, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/dramacool/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    DEFAULT_BASE_URL = "https://asianc.id";
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        try {
          const { axios, cheerio, commonHeaders } = providerContext;
          const baseUrl = yield resolveBaseUrl(providerContext);
          const cleanFilter = filter || "/recently-added";
          const pageParam = page > 1 ? cleanFilter.includes("?") ? `&page=${page}` : `?page=${page}` : "";
          const url = `${baseUrl}${cleanFilter.startsWith("/") ? "" : "/"}${cleanFilter}${pageParam}`;
          const res = yield axios.get(url, {
            headers: __spreadProps(__spreadValues({}, commonHeaders || {}), {
              Referer: `${baseUrl}/`
            }),
            signal
          });
          return parseItems(res.data, cheerio, baseUrl);
        } catch (err) {
          console.error("dramacool getPosts error:", err);
          return [];
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
        try {
          const { axios, cheerio, commonHeaders } = providerContext;
          const baseUrl = yield resolveBaseUrl(providerContext);
          const pageParam = page > 1 ? `&page=${page}` : "";
          const url = `${baseUrl}/search?type=drama&keyword=${encodeURIComponent(
            searchQuery
          )}${pageParam}`;
          const res = yield axios.get(url, {
            headers: __spreadProps(__spreadValues({}, commonHeaders || {}), {
              Referer: `${baseUrl}/`
            }),
            signal
          });
          return parseItems(res.data, cheerio, baseUrl);
        } catch (err) {
          console.error("dramacool getSearchPosts error:", err);
          return [];
        }
      });
    };
  }
});

// providers/dramacool/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function resolveBaseUrl2(providerContext) {
  return __async(this, null, function* () {
    try {
      if (providerContext && typeof providerContext.getBaseUrl === "function") {
        const resolved = (yield providerContext.getBaseUrl("dramacool")) || (yield providerContext.getBaseUrl("asianc"));
        if (resolved) {
          return resolved.replace(/\/+$/, "");
        }
      }
    } catch (e) {
    }
    try {
      const resolved = (yield getBaseUrl("dramacool")) || (yield getBaseUrl("asianc"));
      if (resolved) {
        return resolved.replace(/\/+$/, "");
      }
    } catch (e) {
    }
    return DEFAULT_BASE_URL2;
  });
}
function cleanSynopsis(raw) {
  return raw.replace(/^Description:\s*/i, "").replace(/^Other name:\s*/i, "").trim();
}
var DEFAULT_BASE_URL2, getMeta;
var init_meta = __esm({
  "providers/dramacool/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    DEFAULT_BASE_URL2 = "https://asianc.id";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        try {
          const { axios, cheerio, commonHeaders } = providerContext;
          const baseUrl = yield resolveBaseUrl2(providerContext);
          let currentUrl = link.startsWith("http") ? link : `${baseUrl}${link.startsWith("/") ? "" : "/"}${link}`;
          const headers = __spreadProps(__spreadValues({}, commonHeaders || {}), {
            Referer: `${baseUrl}/`
          });
          if (!currentUrl.includes("/drama-detail/")) {
            try {
              const epRes = yield axios.get(currentUrl, { headers });
              const $ep = cheerio.load(epRes.data);
              const detailHref = $ep('.category a[href*="/drama-detail/"]').first().attr("href") || $ep('a[href*="/drama-detail/"]').first().attr("href");
              if (detailHref) {
                currentUrl = detailHref.startsWith("http") ? detailHref : `${baseUrl}${detailHref.startsWith("/") ? "" : "/"}${detailHref}`;
              }
            } catch (e) {
              console.warn("Failed to resolve detail link from episode page:", e);
            }
          }
          const res = yield axios.get(currentUrl, { headers });
          const $ = cheerio.load(res.data);
          const title = $("h1").first().text().trim();
          const rawImage = $(".img img, .info .img img, .drama-detail .img img").first().attr("src") || $(".img img").first().attr("data-original") || "";
          const image = rawImage.startsWith("http") ? rawImage : rawImage ? `${baseUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}` : "";
          let synopsis = "";
          $(".info p, .content p, .details p").each((_, p) => {
            const text = $(p).text().trim();
            if (text.toLowerCase().includes("description:") || !synopsis && text.length > 50 && !text.includes("Country:")) {
              synopsis = cleanSynopsis(text);
            }
          });
          const tags = [];
          $(".other-info p, .info p").each((_, p) => {
            const text = $(p).text().trim();
            if (text.startsWith("Country:")) {
              tags.push(text.replace("Country:", "").trim());
            } else if (text.startsWith("Status:")) {
              tags.push(text.replace("Status:", "").trim());
            } else if (text.startsWith("Released:")) {
              tags.push(text.replace("Released:", "").trim());
            } else if (text.startsWith("Genre:")) {
              const genreList = text.replace("Genre:", "").split(",").map((g) => g.trim()).filter(Boolean);
              tags.push(...genreList);
            }
          });
          const isMovie = currentUrl.includes("/drama-movie") || tags.some((t) => t.toLowerCase() === "movie");
          const mediaType = isMovie ? "movie" : "series";
          const subLinks = [];
          const episodeElements = [];
          $("ul.all-episode li").each((_, el) => {
            var _a;
            const a = $(el).find("a").first();
            const href = a.attr("href") || "";
            const epTitle = $(el).find("h3, .title").text().trim() || ((_a = a.attr("title")) == null ? void 0 : _a.trim()) || "";
            const epType = $(el).find(".type").first().text().trim();
            if (href) {
              episodeElements.push({ href, title: epTitle, type: epType });
            }
          });
          episodeElements.reverse();
          episodeElements.forEach((ep, index) => {
            const epUrl = ep.href.startsWith("http") ? ep.href : `${baseUrl}${ep.href.startsWith("/") ? "" : "/"}${ep.href}`;
            let displayTitle = isMovie ? "Full Movie" : `Episode ${index + 1}`;
            const epNumMatch = ep.title.match(/episode\s*([0-9.]+)/i);
            if (epNumMatch && !isMovie) {
              displayTitle = `Episode ${epNumMatch[1]}`;
            }
            if (ep.type && ep.type !== "SUB") {
              displayTitle += ` (${ep.type})`;
            }
            subLinks.push({
              title: displayTitle,
              link: epUrl,
              type: mediaType
            });
          });
          const linkList = [
            {
              title: isMovie ? "Movie" : title || "Episodes",
              directLinks: subLinks
            }
          ];
          return {
            title: title || "Drama",
            synopsis,
            image,
            imdbId: "",
            type: mediaType,
            tags: tags.filter(Boolean),
            linkList
          };
        } catch (err) {
          console.error("dramacool getMeta error:", err);
          return {
            title: "",
            synopsis: "",
            image: "",
            imdbId: "",
            type: "series",
            linkList: []
          };
        }
      });
    };
  }
});

// providers/dramacool/aes.ts
function base64ToUint8Array(base64) {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"));
  }
  const clean = base64.replace(/[\r\n\s]/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (typeof atob !== "undefined") {
    try {
      const pad = clean.padEnd(4 * Math.ceil(clean.length / 4), "=");
      const bin = atob(pad);
      const bytes2 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        bytes2[i] = bin.charCodeAt(i);
      }
      return bytes2;
    } catch (e) {
    }
  }
  const len = clean.length;
  let validLen = len;
  if (clean.endsWith("==")) validLen -= 2;
  else if (clean.endsWith("=")) validLen -= 1;
  const byteLen = Math.floor(validLen * 3 / 4);
  const bytes = new Uint8Array(byteLen);
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const b0 = B64_LOOKUP[clean.charCodeAt(i)];
    const b1 = B64_LOOKUP[clean.charCodeAt(i + 1)];
    const b2 = clean.charAt(i + 2) === "=" ? 0 : B64_LOOKUP[clean.charCodeAt(i + 2)];
    const b3 = clean.charAt(i + 3) === "=" ? 0 : B64_LOOKUP[clean.charCodeAt(i + 3)];
    if (p < byteLen) bytes[p++] = b0 << 2 | b1 >> 4;
    if (p < byteLen) bytes[p++] = (b1 & 15) << 4 | b2 >> 2;
    if (p < byteLen) bytes[p++] = (b2 & 3) << 6 | b3;
  }
  return bytes;
}
function getSubtleCrypto() {
  var _a, _b;
  if (typeof crypto !== "undefined" && crypto && crypto.subtle) {
    return crypto.subtle;
  }
  if (typeof globalThis !== "undefined" && globalThis && ((_a = globalThis.crypto) == null ? void 0 : _a.subtle)) {
    return globalThis.crypto.subtle;
  }
  if (typeof self !== "undefined" && self && ((_b = self.crypto) == null ? void 0 : _b.subtle)) {
    return self.crypto.subtle;
  }
  try {
    const g = Function("return this")();
    if (g && g.crypto && g.crypto.subtle) {
      return g.crypto.subtle;
    }
  } catch (e) {
  }
  return null;
}
function decryptVidbasicAes(_0) {
  return __async(this, arguments, function* (ciphertextB64, keyStr = DEFAULT_KEY, ivStr = DEFAULT_IV) {
    try {
      if (!ciphertextB64) return "";
      const subtle = getSubtleCrypto();
      if (!subtle) return "";
      const keyBytes = new TextEncoder().encode(keyStr);
      const ivBytes = new TextEncoder().encode(ivStr);
      const cipherBytes = base64ToUint8Array(ciphertextB64);
      const cryptoKey = yield subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
      );
      const decryptedBuf = yield subtle.decrypt(
        { name: "AES-CBC", iv: ivBytes },
        cryptoKey,
        cipherBytes
      );
      return new TextDecoder().decode(decryptedBuf);
    } catch (e) {
      return "";
    }
  });
}
var DEFAULT_KEY, DEFAULT_IV, B64_CHARS, B64_LOOKUP;
var init_aes = __esm({
  "providers/dramacool/aes.ts"() {
    "use strict";
    DEFAULT_KEY = "94588293375053432799222445521289";
    DEFAULT_IV = "5259228356829423";
    B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    B64_LOOKUP = new Uint8Array(256);
    for (let i = 0; i < B64_CHARS.length; i++) {
      B64_LOOKUP[B64_CHARS.charCodeAt(i)] = i;
    }
  }
});

// providers/dramacool/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function resolveBaseUrl3(providerContext) {
  return __async(this, null, function* () {
    try {
      if (providerContext && typeof providerContext.getBaseUrl === "function") {
        const resolved = (yield providerContext.getBaseUrl("dramacool")) || (yield providerContext.getBaseUrl("asianc"));
        if (resolved) {
          return resolved.replace(/\/+$/, "");
        }
      }
    } catch (e) {
    }
    try {
      const resolved = (yield getBaseUrl("dramacool")) || (yield getBaseUrl("asianc"));
      if (resolved) {
        return resolved.replace(/\/+$/, "");
      }
    } catch (e) {
    }
    return DEFAULT_BASE_URL3;
  });
}
function resolveFullUrl(path, base) {
  if (path.startsWith("http")) return path;
  if (path.startsWith("//")) return `https:${path}`;
  return `${base.replace(/\/+$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}
function extractVidbasicPlayer(playerUrl, embedUrl, providerContext, signal) {
  return __async(this, null, function* () {
    const { axios, cheerio } = providerContext;
    const playerRes = yield axios.get(playerUrl, {
      headers: {
        Referer: embedUrl,
        Origin: "https://vidbasic.top",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
      },
      signal,
      timeout: 1e4
    });
    const $player = cheerio.load(playerRes.data);
    const cryptoData = $player("script[data-name='crypto']").attr("data-value") || "";
    if (!cryptoData) {
      return null;
    }
    const streamUrl = yield decryptVidbasicAes(cryptoData);
    if (!streamUrl || !streamUrl.startsWith("http")) {
      return null;
    }
    const subtitles = [];
    try {
      const parsedPlayer = new URL(playerUrl);
      const subParam = parsedPlayer.searchParams.get("sub");
      if (subParam) {
        const subUrl = yield decryptVidbasicAes(decodeURIComponent(subParam));
        if (subUrl && subUrl.startsWith("http")) {
          subtitles.push({
            title: "English",
            language: "en",
            type: "text/vtt",
            uri: subUrl
          });
        }
      }
    } catch (e) {
    }
    const isM3u8 = streamUrl.includes(".m3u8");
    return {
      server: "Standard Server (VidBasic)",
      link: streamUrl,
      type: isM3u8 ? "m3u8" : "mp4",
      quality: "auto",
      subtitles,
      headers: {
        Referer: "https://vidbasic.top/",
        Origin: "https://vidbasic.top"
      }
    };
  });
}
var DEFAULT_BASE_URL3, getStream;
var init_stream = __esm({
  "providers/dramacool/stream.ts"() {
    "use strict";
    init_getBaseUrl();
    init_aes();
    DEFAULT_BASE_URL3 = "https://asianc.id";
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        signal,
        providerContext
      }) {
        try {
          const { axios, cheerio, commonHeaders } = providerContext;
          const baseUrl = yield resolveBaseUrl3(providerContext);
          const streamLinks = [];
          const headers = __spreadProps(__spreadValues({}, commonHeaders || {}), {
            Referer: `${baseUrl}/`,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
          });
          let embedUrl = "";
          if (link.includes("/embed/") || link.includes("vidbasic.top")) {
            embedUrl = link;
          } else {
            const episodeUrl = resolveFullUrl(link, baseUrl);
            const epRes = yield axios.get(episodeUrl, {
              headers,
              signal,
              timeout: 1e4
            });
            const $ep = cheerio.load(epRes.data);
            const iframeSrc = $ep("iframe").first().attr("src") || "";
            if (iframeSrc) {
              embedUrl = resolveFullUrl(iframeSrc, "https://vidbasic.top");
            }
          }
          if (!embedUrl) {
            return [];
          }
          const embedRes = yield axios.get(embedUrl, {
            headers: __spreadProps(__spreadValues({}, headers), {
              Referer: `${baseUrl}/`,
              Origin: baseUrl
            }),
            signal,
            timeout: 1e4
          });
          const $embed = cheerio.load(embedRes.data);
          const standardLi = $embed(
            "li[data-video*='3rdplayer'], a[data-video*='3rdplayer']"
          ).first();
          let playerPath = standardLi.attr("data-video") || "";
          if (!playerPath) {
            $embed("li[data-video], a[data-video]").each((_, el) => {
              const dv = $embed(el).attr("data-video") || "";
              if (dv.includes("3rdplayer") && !playerPath) {
                playerPath = dv;
              }
            });
          }
          if (playerPath) {
            const playerUrl = resolveFullUrl(playerPath, "https://vidbasic.top");
            const standardStream = yield extractVidbasicPlayer(
              playerUrl,
              embedUrl,
              providerContext,
              signal
            );
            if (standardStream) {
              streamLinks.push(standardStream);
            }
          }
          $embed("li[data-video], a[data-video]").each((_, el) => {
            const serverName = $embed(el).text().trim() || "Server";
            const dv = $embed(el).attr("data-video") || "";
            if (dv && !dv.includes("3rdplayer")) {
              const targetUrl = resolveFullUrl(dv, "https://vidbasic.top");
              const isDirect = targetUrl.includes(".m3u8") || targetUrl.includes(".mp4");
              if (isDirect) {
                streamLinks.push({
                  server: serverName,
                  link: targetUrl,
                  type: targetUrl.includes(".m3u8") ? "m3u8" : "mp4",
                  quality: "auto",
                  headers: {
                    Referer: embedUrl
                  }
                });
              }
            }
          });
          return streamLinks;
        } catch (err) {
          console.error("dramacool getStream error:", err);
          return [];
        }
      });
    };
  }
});

// providers/dramacool/dramacool.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
