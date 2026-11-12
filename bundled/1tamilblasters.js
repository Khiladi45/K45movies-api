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

// providers/1tamilblasters/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/1tamilblasters/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Latest", filter: "/" },
      {
        title: "Tamil Movies 2026",
        filter: "/category/tamil-movies/tamil-movies-2026/"
      },
      {
        title: "Tamil Movies 2025",
        filter: "/category/tamil-movies/tamil-movies-2025/"
      },
      {
        title: "Tamil Dubbed",
        filter: "/category/tamil-movies/tamil-dubbed-movies/"
      },
      {
        title: "Telugu Movies 2026",
        filter: "/category/telugu-movies/telugu-movies-2026/"
      },
      {
        title: "Malayalam Movies 2026",
        filter: "/category/malayalam-movies/malayalam-movies-2026/"
      },
      {
        title: "Kannada Movies 2026",
        filter: "/category/kannada-movies/kannada-movies-2026/"
      },
      {
        title: "Hindi Movies 2026",
        filter: "/category/hindi-movies/hindi-movies-2026/"
      },
      {
        title: "English Movies 2026",
        filter: "/category/english-movies/english-movies-2026/"
      }
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

// providers/1tamilblasters/utils.ts
var cleanText, getQuality, displayTitle, isSeriesTitle, isFilePage, isWatchHost, isUltrashow, unpackPacked, playerSourceFrom, parsePlayers, parseDownloadLinks;
var init_utils = __esm({
  "providers/1tamilblasters/utils.ts"() {
    "use strict";
    cleanText = (value) => (value || "").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
    getQuality = (text) => {
      const m = text.match(/(?:^|[^\d])(2160|1080|720|480|360)p?(?:[^\d]|$)/i);
      if (m) return m[1];
      if (/\b4k\b/i.test(text)) return "2160";
      return void 0;
    };
    displayTitle = (releaseTitle) => {
      const title = cleanText(releaseTitle).replace(/\s*[-–|]\s*Tamil\s*Blasters.*$/i, "").replace(/\s*[-–]\s*Tamilblasters.*$/i, "").trim();
      return title.replace(/\s+(Tamil|Telugu|Hindi|Malayalam|Kannada|English)$/i, "").trim();
    };
    isSeriesTitle = (text) => /\bS\d{1,2}\s*E\d{1,3}\b|\bseason\s*\d|\bweb[\s-]?series\b|\bepisode\s*[-–:]?\s*\d/i.test(
      text
    );
    isFilePage = (url) => /\/files\/[^?#]+\.(?:mkv|mp4|avi|webm)\b/i.test(url) || /\/download\/files\//i.test(url);
    isWatchHost = (url) => /luluvido\.|lulustream\.|lulust\.|luluvid\.|luvbx\.|mbfile\.|filelions\.|streamruby\.|vidhide\.|dood(?:stream|watch)\./i.test(
      url
    );
    isUltrashow = (url) => /ultrashow\.|ultra.*\.club/i.test(url);
    unpackPacked = (html) => {
      const evalIdx = html.indexOf("eval(function(p,a,c,k");
      if (evalIdx < 0) return null;
      const startIdx = html.indexOf("}('", evalIdx);
      if (startIdx < 0) return null;
      const tailRe = /',(\d+),(\d+),'([^']*)'\.split\('\|'\)/g;
      tailRe.lastIndex = startIdx;
      const tail = tailRe.exec(html);
      if (!tail || tail.index <= startIdx) return null;
      const payload = html.slice(startIdx + 3, tail.index);
      const radix = Number(tail[1]);
      const count = Number(tail[2]);
      if (radix < 2 || radix > 36 || count > 2048 || payload.length > 128e3) return null;
      const words = tail[3].split("|");
      let result = payload;
      for (let i = count - 1; i >= 0; i--) {
        const token = i.toString(radix);
        if (!words[i]) continue;
        result = result.replace(new RegExp(`\\b${token}\\b`, "g"), () => words[i]);
      }
      return result;
    };
    playerSourceFrom = (unpacked) => {
      const file = unpacked.match(
        /(?:file|src)\s*:\s*["']([^"']*(?:\.m3u8|\.mp4|\.mkv)[^"']*)["']/i
      );
      return file ? file[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&") : null;
    };
    parsePlayers = ($, content) => {
      const entries = [];
      const seen = /* @__PURE__ */ new Set();
      let pendingLabel = "";
      content.find("p, iframe").each((_i, el) => {
        const tag = (el.tagName || "").toLowerCase();
        if (tag === "p") {
          const text = cleanText($(el).text());
          if (/^(?:player|episode|ep)\s*[:\-–]?\s*\d+/i.test(text)) {
            pendingLabel = text;
          }
          return;
        }
        const src = $(el).attr("src") || $(el).attr("data-src") || "";
        if (!src || seen.has(src)) return;
        seen.add(src);
        entries.push({
          title: pendingLabel || `Player ${entries.length + 1}`,
          url: src,
          quality: getQuality(src) || getQuality(pendingLabel)
        });
        pendingLabel = "";
      });
      content.find("iframe[src]").each((_i, el) => {
        const src = $(el).attr("src") || "";
        if (!src || seen.has(src)) return;
        seen.add(src);
        entries.push({
          title: `Player ${entries.length + 1}`,
          url: src,
          quality: getQuality(src)
        });
      });
      return entries;
    };
    parseDownloadLinks = ($, content) => {
      const entries = [];
      const seen = /* @__PURE__ */ new Set();
      content.find("a[href]").each((_i, el) => {
        var _a;
        const href = $(el).attr("href") || "";
        if (!/\/files\/[^/?#]+\.(?:mkv|mp4|avi|webm)\b/i.test(href)) return;
        if (seen.has(href)) return;
        seen.add(href);
        let filename = href.split("/").pop() || "";
        try {
          filename = decodeURIComponent(filename);
        } catch (e) {
        }
        const quality = getQuality(filename);
        const codec = /hevc|x265/i.test(filename) ? "HEVC" : "x264";
        const size = (_a = filename.match(/(\d+(?:\.\d+)?\s*(?:GB|MB))/i)) == null ? void 0 : _a[1];
        const title = [quality ? `${quality}p` : "", codec, size].filter(Boolean).join(" ");
        entries.push({ title: title || filename, url: href, quality });
      });
      return entries;
    };
  }
});

// providers/1tamilblasters/posts.ts
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
function parseArticles($, baseUrl) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  $("article").each((_i, el) => {
    const node = $(el);
    const anchor = node.find(".entry-title a, h2 a, h3 a").first();
    const href = anchor.attr("href") || "";
    if (!href) return;
    const link = /^https?:\/\//i.test(href) ? href : new URL(href, baseUrl).href;
    if (seen.has(link)) return;
    seen.add(link);
    const img = node.find(".nv-post-thumbnail-wrap img, .wp-post-image, img").first();
    const image = img.attr("src") || img.attr("data-src") || img.attr("data-lazy-src") || "";
    out.push({
      title: displayTitle(cleanText(anchor.text())) || cleanText(anchor.text()),
      link,
      image: image ? new URL(image, baseUrl).href : ""
    });
  });
  return out;
}
var REQUEST_TIMEOUT_MS, HTML_TTL_MS, htmlCache, pageUrl, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/1tamilblasters/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    REQUEST_TIMEOUT_MS = 15e3;
    HTML_TTL_MS = 3 * 6e4;
    htmlCache = /* @__PURE__ */ new Map();
    pageUrl = (url, page) => {
      if (page <= 1) return url;
      const clean = url.replace(/\/+$/, "");
      return `${clean}/page/${page}/`;
    };
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = (yield getBaseUrl("1tamilblasters")) || "https://www.1tamilblasters.blog";
        const headers = commonHeaders || {};
        const path = !filter || filter === "/" ? "/" : filter;
        const url = pageUrl(
          `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`,
          page
        );
        try {
          const html = yield fetchText(axios, url, signal, headers);
          return parseArticles(cheerio.load(html), baseUrl);
        } catch (err) {
          throwProviderError("1TamilBlasters", "posts", err);
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
        const baseUrl = (yield getBaseUrl("1tamilblasters")) || "https://www.1tamilblasters.blog";
        const headers = commonHeaders || {};
        const query = cleanText(searchQuery);
        if (!query) return [];
        try {
          const url = pageUrl(
            `${baseUrl}/search/${encodeURIComponent(query)}/`,
            page
          );
          const html = yield fetchText(axios, url, signal, headers);
          return parseArticles(cheerio.load(html), baseUrl);
        } catch (err) {
          throwProviderError("1TamilBlasters", "search posts", err);
        }
      });
    };
  }
});

// providers/1tamilblasters/meta.ts
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
var REQUEST_TIMEOUT_MS2, getMeta;
var init_meta = __esm({
  "providers/1tamilblasters/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    REQUEST_TIMEOUT_MS2 = 15e3;
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a;
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = (yield getBaseUrl("1tamilblasters")) || "https://www.1tamilblasters.blog";
        const url = new URL(link, `${baseUrl}/`).href;
        try {
          const html = yield fetchHtml(axios, url, commonHeaders);
          const $ = cheerio.load(html);
          const heading = cleanText($("h1.entry-title").first().text()) || cleanText($("h1").first().text()) || cleanText($("meta[property='og:title']").attr("content")) || cleanText($("title").text());
          const title = displayTitle(heading) || heading;
          const image = cleanText($("meta[property='og:image']").attr("content"));
          const content = $(".entry-content").first().length ? $(".entry-content").first() : $("article").first();
          const isMetaBlurb = (text) => /^(?:movie|film)\s*name\s*:|directed (?:and written )?by\s*:|starring by\s*:|^genres?\s*:/i.test(
            text
          );
          const paragraphs = [];
          content.find("p").each((_i, el) => {
            const text = cleanText($(el).text());
            if (text && !isMetaBlurb(text) && !/^(?:player|episode|ep)\s*[:\-–]?\s*\d+/i.test(text) && !/^(?:quality|format)/i.test(text)) {
              paragraphs.push(text);
            }
          });
          const metaDescription = cleanText($("meta[property='og:description']").attr("content")) || cleanText($("meta[name='description']").attr("content")) || "";
          const synopsis = (metaDescription && !isMetaBlurb(metaDescription) ? metaDescription : "") || paragraphs.sort((a, b) => b.length - a.length)[0] || "";
          const players = parsePlayers($, content);
          const downloads = parseDownloadLinks($, content);
          const pageText = `${heading} ${paragraphs.join(" ")}`;
          const isSeries = isSeriesTitle(pageText) || isSeriesTitle(url);
          const linkList = [];
          if (players.length > 0) {
            linkList.push({
              title: isSeries ? "Watch Episodes" : "Watch Online",
              quality: ((_a = players[0]) == null ? void 0 : _a.quality) || getQuality(heading),
              directLinks: players.map((entry, index) => ({
                title: isSeries ? entry.title.replace(/^Player/i, "Episode") : entry.title || `Player ${index + 1}`,
                link: entry.url,
                type: isSeries ? "series" : "movie"
              }))
            });
          }
          if (downloads.length > 0) {
            linkList.push({
              title: "Download",
              directLinks: downloads.map((entry) => ({
                title: entry.title,
                link: entry.url,
                type: isSeries ? "series" : "movie"
              }))
            });
          }
          return {
            title,
            synopsis,
            image,
            imdbId: "",
            tags: [],
            type: isSeries ? "series" : "movie",
            linkList,
            webUrl: url
          };
        } catch (err) {
          throwProviderError("1TamilBlasters", "metadata", err);
        }
      });
    };
  }
});

// providers/1tamilblasters/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function fetchHtml2(axios, url, headers, signal) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS3);
    const onOuterAbort = () => controller.abort();
    if (signal == null ? void 0 : signal.aborted) controller.abort();
    signal == null ? void 0 : signal.addEventListener("abort", onOuterAbort);
    try {
      const res = yield axios.get(url, {
        headers,
        signal: controller.signal,
        timeout: REQUEST_TIMEOUT_MS3,
        maxRedirects: 5
      });
      return {
        html: typeof res.data === "string" ? res.data : "",
        url: ((_a = res.request) == null ? void 0 : _a.responseURL) || ((_c = (_b = res.request) == null ? void 0 : _b.res) == null ? void 0 : _c.responseUrl) || url
      };
    } finally {
      clearTimeout(timer);
      signal == null ? void 0 : signal.removeEventListener("abort", onOuterAbort);
    }
  });
}
function resolveWatchPage(html, pageUrl2, headers) {
  var _a;
  const streams = [];
  const seen = /* @__PURE__ */ new Set();
  const add = (link, type, quality) => {
    const source = link.replace(/\\\//g, "/").replace(/\\u0026/g, "&").replace(/&amp;/g, "&").replace(/\\$/, "");
    let clean;
    try {
      clean = new URL(source, pageUrl2).href;
    } catch (e) {
      return;
    }
    if (!/^https?:\/\//i.test(clean)) return;
    if (!clean || seen.has(clean)) return;
    seen.add(clean);
    streams.push({
      server: `1TamilBlasters ${streams.length + 1}`,
      link: clean,
      type,
      quality,
      headers: __spreadProps(__spreadValues({}, headers), { Referer: pageUrl2 })
    });
  };
  const unpacked = unpackPacked(html);
  if (unpacked) {
    const source = playerSourceFrom(unpacked);
    if (source) add(source, mediaType(source), getQuality(unpacked));
  }
  const direct = (_a = html.match(
    /["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i
  )) == null ? void 0 : _a[1];
  if (direct) add(direct, "m3u8", getQuality(direct));
  const video = html.match(
    /<(?:source|video)[^>]+src=["']([^"']*\.(?:m3u8|mp4|mkv)[^"']*)["']/i
  );
  if (video) add(video[1], mediaType(video[1]), getQuality(video[1]));
  return streams;
}
function resolveDownloadChain(axios, cheerio, pageUrl2, headers, signal) {
  return __async(this, null, function* () {
    const pickFile = (html, at) => {
      const $ = cheerio.load(html);
      let found = "";
      $("a[href]").each((_i, el) => {
        if (found) return;
        const href = $(el).attr("href") || "";
        if (/response-content-disposition|amazonaws\.com|X-Amz-Signature/i.test(href)) {
          found = /^https?:\/\//i.test(href) ? href : new URL(href, at).href;
        }
      });
      return found || null;
    };
    const pickNextPage = (html, at) => {
      const $ = cheerio.load(html);
      let found = "";
      $("a[href]").each((_i, el) => {
        if (found) return;
        const href = $(el).attr("href") || "";
        if (/\/download\/files\//i.test(href)) {
          found = /^https?:\/\//i.test(href) ? href : new URL(href, at).href;
        }
      });
      return found || null;
    };
    try {
      const first = yield fetchHtml2(axios, pageUrl2, headers, signal);
      const quality = getQuality(pageUrl2);
      const finalFile = pickFile(first.html, first.url);
      if (finalFile) return { link: finalFile, quality };
      const next = pickNextPage(first.html, first.url);
      if (!next) return null;
      const second = yield fetchHtml2(
        axios,
        next,
        __spreadProps(__spreadValues({}, headers), { Referer: first.url }),
        signal
      );
      const file = pickFile(second.html, second.url);
      return file ? { link: file, quality } : null;
    } catch (e) {
      return null;
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
    const headers = commonHeaders || {};
    const streams = [];
    const seen = /* @__PURE__ */ new Set();
    const add = (server, streamLink, type, quality, requestHeaders = headers) => {
      if (!streamLink || seen.has(streamLink)) return;
      seen.add(streamLink);
      streams.push({ server, link: streamLink, type, quality, headers: requestHeaders });
    };
    try {
      if (isFilePage(link)) {
        const resolved = yield resolveDownloadChain(
          axios,
          cheerio,
          link,
          headers,
          signal
        );
        if (resolved) {
          add("1TamilBlasters Download", resolved.link, mediaType(resolved.link), resolved.quality);
        }
        return streams;
      }
      const isBlogPost = /1tamilblasters\./i.test(link);
      if (isBlogPost) {
        const post = yield fetchHtml2(axios, link, headers, signal);
        const $ = cheerio.load(post.html);
        const content = $(".entry-content").first().length ? $(".entry-content").first() : $("article").first();
        const players = parsePlayers($, content).slice(0, 2);
        for (const player of players) {
          const page2 = yield fetchHtml2(
            axios,
            player.url,
            __spreadProps(__spreadValues({}, headers), { Referer: post.url }),
            signal
          ).catch(() => null);
          if (!page2) continue;
          for (const stream of resolveWatchPage(page2.html, page2.url, headers)) {
            add(stream.server, stream.link, stream.type, stream.quality, stream.headers);
          }
          if (streams.length >= 2) break;
        }
        const files = parseDownloadLinks($, content).slice(0, 2);
        for (const file of files) {
          const resolved = yield resolveDownloadChain(
            axios,
            cheerio,
            file.url,
            headers,
            signal
          );
          if (resolved) {
            add(
              `1TamilBlasters ${file.title}`,
              resolved.link,
              mediaType(resolved.link),
              resolved.quality
            );
          }
        }
        return streams;
      }
      const page = yield fetchHtml2(
        axios,
        link,
        __spreadProps(__spreadValues({}, headers), { Referer: "https://www.1tamilblasters.blog/" }),
        signal
      );
      for (const stream of resolveWatchPage(page.html, page.url, headers)) {
        add(stream.server, stream.link, stream.type, stream.quality, stream.headers);
      }
      if (streams.length === 0 && (isWatchHost(link) || isUltrashow(link))) {
        add("1TamilBlasters Embed", link, "embed", getQuality(link));
      }
      return streams;
    } catch (err) {
      if (streams.length === 0) throwProviderError("1TamilBlasters", "stream", err);
    }
    return streams;
  });
}
var REQUEST_TIMEOUT_MS3, mediaType;
var init_stream = __esm({
  "providers/1tamilblasters/stream.ts"() {
    "use strict";
    init_providerErrors();
    init_utils();
    REQUEST_TIMEOUT_MS3 = 15e3;
    mediaType = (url) => /\.m3u8/i.test(url) ? "m3u8" : /\.mkv/i.test(url) ? "mkv" : "mp4";
  }
});

// providers/1tamilblasters/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var REQUEST_TIMEOUT_MS4, getEpisodes;
var init_episodes = __esm({
  "providers/1tamilblasters/episodes.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    REQUEST_TIMEOUT_MS4 = 15e3;
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        var _a;
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = (yield getBaseUrl("1tamilblasters")) || "https://www.1tamilblasters.blog";
        const pageUrl2 = new URL(url, `${baseUrl}/`).href;
        if (isWatchHost(pageUrl2)) {
          return [{ title: "Watch Episode", link: pageUrl2 }];
        }
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS4);
          try {
            const res = yield axios.get(pageUrl2, {
              headers: commonHeaders,
              signal: controller.signal,
              timeout: REQUEST_TIMEOUT_MS4
            });
            const $ = cheerio.load(
              typeof res.data === "string" ? res.data : String((_a = res.data) != null ? _a : "")
            );
            const content = $(".entry-content").first().length ? $(".entry-content").first() : $("article").first();
            const players = parsePlayers($, content);
            if (players.length > 0) {
              return players.map((entry, index) => ({
                title: entry.title ? entry.title.replace(/^Player/i, "Episode") : `Episode ${index + 1}`,
                link: entry.url
              }));
            }
            return parseDownloadLinks($, content).map((entry, index) => ({
              title: entry.title || `Download ${index + 1}`,
              link: entry.url
            }));
          } finally {
            clearTimeout(timer);
          }
        } catch (err) {
          throwProviderError("1TamilBlasters", "episodes", err);
        }
      });
    };
  }
});

// providers/1tamilblasters/1tamilblasters.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
