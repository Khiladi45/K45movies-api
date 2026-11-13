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

// providers/movieswood/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/movieswood/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Telugu New", filter: "/telugu1/?list=new" },
      { title: "Telugu 2026", filter: "/telugu1/?list=years&value=2026" },
      { title: "Tamil New", filter: "/tamil1/?list=new" },
      { title: "Hindi Dubbed", filter: "/dub1/?list=new" },
      { title: "Malayalam", filter: "/malayalam1/?list=new" }
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
var responseUrl, qualityFrom;
var init_httpMedia = __esm({
  "providers/extractors/httpMedia.ts"() {
    "use strict";
    responseUrl = (response, requested) => {
      var _a, _b, _c;
      return ((_a = response.request) == null ? void 0 : _a.responseURL) || ((_c = (_b = response.request) == null ? void 0 : _b.res) == null ? void 0 : _c.responseUrl) || requested;
    };
    qualityFrom = (text) => {
      var _a;
      return ((_a = text.match(/\b(2160|1080|720|480|360)p\b/i)) == null ? void 0 : _a[1]) || (/\b4k\b/i.test(text) ? "2160" : void 0);
    };
  }
});

// providers/movieswood/posts.ts
var posts_exports = {};
__export(posts_exports, {
  absorbCookies: () => absorbCookies,
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts,
  loadMovieswoodPage: () => loadMovieswoodPage,
  movieswoodBaseUrl: () => movieswoodBaseUrl
});
function movieswoodBaseUrl() {
  return __async(this, null, function* () {
    return (yield getBaseUrl("movieswood").catch(() => "")) || "https://movieswood.cloud";
  });
}
function absorbCookies(jar, response) {
  var _a;
  const header = (_a = response == null ? void 0 : response.headers) == null ? void 0 : _a["set-cookie"];
  if (!header) return;
  for (const line of Array.isArray(header) ? header : [header]) {
    const pair = String(line).split(";")[0];
    if (!pair || !pair.includes("=")) continue;
    if (jar.value.split("; ").includes(pair)) continue;
    jar.value = jar.value ? `${jar.value}; ${pair}` : pair;
  }
}
function loadMovieswoodPage(url, context, signal, jar) {
  return __async(this, null, function* () {
    const headers = __spreadProps(__spreadValues(__spreadValues({}, context.commonHeaders), (jar == null ? void 0 : jar.value) ? { Cookie: jar.value } : {}), {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5"
    });
    const options = { headers, signal, timeout: 12e3, validateStatus: () => true };
    const response = yield context.axios.get(url, options);
    if (jar) absorbCookies(jar, response);
    const html = typeof response.data === "string" ? response.data : "";
    const landing = responseUrl(response, url);
    const blocked = response.status === 403 || response.headers["cf-mitigated"] === "challenge" || challenge(html);
    if (!blocked) {
      if (response.status >= 400) throw new Error(`HTTP ${response.status}`);
      return { html, url: landing, cookies: (jar == null ? void 0 : jar.value) || "" };
    }
    if (!context.openWebView || (signal == null ? void 0 : signal.aborted)) throw new Error("MoviesWood requires browser verification.");
    const origin = new URL(url).origin;
    if (new URL(landing).origin !== origin) throw new Error("Verification redirected to another site.");
    if (!verification || verification.origin !== origin) {
      const request = context.openWebView(url, {
        title: "MoviesWood verification",
        description: "Complete the browser check, then tap Done.",
        headers,
        timeoutMs: 6e4
      }).finally(() => {
        if ((verification == null ? void 0 : verification.request) === request) verification = void 0;
      });
      verification = { origin, request };
    }
    const verified = yield verification.request;
    if (signal == null ? void 0 : signal.aborted) throw new Error("Request cancelled");
    if (jar && verified.cookies) {
      const pair = String(verified.cookies).split(";")[0].trim();
      if (pair && !jar.value.includes(pair)) jar.value = jar.value ? `${jar.value}; ${pair}` : pair;
    }
    const verifiedUrl = httpUrl(verified.url, url);
    if (!verifiedUrl || new URL(verifiedUrl).origin !== origin) throw new Error("Verification left MoviesWood.");
    if (verifiedUrl === url && verified.data && !challenge(verified.data)) {
      return { html: verified.data, url: verifiedUrl, cookies: (jar == null ? void 0 : jar.value) || "" };
    }
    if (!verified.cookies) throw new Error("MoviesWood verification did not complete.");
    const retry = yield context.axios.get(url, __spreadProps(__spreadValues({}, options), {
      headers: __spreadProps(__spreadValues(__spreadValues({}, headers), (jar == null ? void 0 : jar.value) ? { Cookie: jar.value } : {}), {
        "User-Agent": verified.userAgent || context.commonHeaders["User-Agent"]
      })
    }));
    if (jar) absorbCookies(jar, retry);
    const result = typeof retry.data === "string" ? retry.data : "";
    if (retry.status >= 300 || challenge(result) || retry.headers["cf-mitigated"] === "challenge") {
      throw new Error(`MoviesWood verification did not unlock this page (HTTP ${retry.status}).`);
    }
    const retryUrl = responseUrl(retry, url);
    if (new URL(retryUrl).origin !== origin) throw new Error("Verification left MoviesWood.");
    return { html: result, url: retryUrl, cookies: (jar == null ? void 0 : jar.value) || "" };
  });
}
function getPosts(_0) {
  return __async(this, arguments, function* ({
    filter,
    page,
    signal,
    providerContext
  }) {
    try {
      const url = new URL(filter, yield movieswoodBaseUrl());
      if (page > 1) {
        url.searchParams.set("page", String(page));
        url.search = url.searchParams.toString();
      }
      const document = yield loadMovieswoodPage(url.href, providerContext, signal);
      const $ = providerContext.cheerio.load(document.html);
      const posts = /* @__PURE__ */ new Map();
      $("a[href]").each((_i, el) => {
        const anchor = $(el);
        const title = anchor.text().replace(/\s+/g, " ").trim();
        if (!/\(\d{4}\)/.test(title)) return;
        const link = httpUrl(anchor.attr("href"), document.url);
        if (!link || new URL(link).origin !== new URL(document.url).origin) return;
        const image = httpUrl(anchor.find("img").attr("src"), document.url) || "";
        posts.set(link, { title, link, image });
        if (posts.size === 50) return false;
      });
      if (!posts.size && !$("body").clone().find("script,style").remove().end().text().trim()) {
        throw new Error("MoviesWood returned an empty catalog page.");
      }
      return [...posts.values()];
    } catch (error) {
      throwProviderError("MoviesWood", "posts", error);
    }
  });
}
function getSearchPosts() {
  return __async(this, null, function* () {
    throwProviderError("MoviesWood", "search", new Error("Search is unavailable. Browse the categories."));
  });
}
var challenge, verification;
var init_posts = __esm({
  "providers/movieswood/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_httpMedia();
    challenge = (html) => /cf-browser-verification|checking your browser|\/cdn-cgi\/challenge-platform\/|<title>just a moment/i.test(html);
  }
});

// providers/movieswood/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function getMeta(_0) {
  return __async(this, arguments, function* ({
    link,
    signal,
    providerContext
  }) {
    var _a;
    try {
      const url = httpUrl(link, yield movieswoodBaseUrl());
      if (!url) throw new Error("Invalid movie URL");
      const page = yield loadMovieswoodPage(url, providerContext, signal);
      const $ = providerContext.cheerio.load(page.html);
      const title = ($("h1").first().text() || $("h2").first().text() || $("title").text()).replace(/\s*[-|]\s*MoviesWood\s*$/i, "").trim();
      if (!title) throw new Error("MoviesWood returned no movie details.");
      const linkList = [];
      const seen = /* @__PURE__ */ new Set();
      $("a[href]").each((_i, el) => {
        const anchor = $(el);
        const label = anchor.text().replace(/\s+/g, " ").trim();
        if (!/\b(?:download|\d+(?:\.\d+)?\s*[mg]b|\d{3,4}p|4k)\b/i.test(label)) return;
        const target = httpUrl(anchor.attr("href"), page.url);
        if (!target || target === page.url || seen.has(target)) return;
        seen.add(target);
        linkList.push({
          title: label,
          quality: qualityFrom(label),
          directLinks: [{ title: label, link: target, type: "movie" }]
        });
      });
      return {
        title,
        synopsis: ((_a = $("meta[name='description']").attr("content")) == null ? void 0 : _a.trim()) || "",
        image: httpUrl($("meta[property='og:image']").attr("content") || $("main img").first().attr("src"), page.url) || "",
        imdbId: "",
        tags: [],
        type: "movie",
        linkList,
        webUrl: page.url
      };
    } catch (error) {
      throwProviderError("MoviesWood", "metadata", error);
    }
  });
}
var init_meta = __esm({
  "providers/movieswood/meta.ts"() {
    "use strict";
    init_providerErrors();
    init_httpMedia();
    init_posts();
  }
});

// providers/movieswood/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function resolveStart(_0, _1, _2, _3, _4) {
  return __async(this, arguments, function* ({
    axios,
    cheerio,
    commonHeaders
  }, target, referer, signal, jar) {
    var _a, _b;
    const headers = __spreadProps(__spreadValues(__spreadValues({}, commonHeaders), jar.value ? { Cookie: jar.value } : {}), {
      Referer: referer
    });
    const redirected = yield followHeadRedirects(axios, target, headers, signal, (response2) => {
      absorbCookies(jar, response2);
    });
    if (redirected && redirected !== target) return redirected;
    const response = yield axios.get(target, {
      headers: __spreadProps(__spreadValues({}, headers), { Range: "bytes=0-65535" }),
      signal,
      timeout: 1e4,
      maxRedirects: 0,
      validateStatus: () => true
    });
    absorbCookies(jar, response);
    const location = (_a = response.headers) == null ? void 0 : _a.location;
    if (location && response.status >= 300 && response.status < 400) {
      return new URL(location, target).href;
    }
    if (response.status !== 200 || typeof response.data !== "string") return;
    const $ = cheerio.load(response.data);
    let next = "";
    $("a[href],source[src]").each((_i, el) => {
      if (next) return;
      const href = $(el).attr("href") || $(el).attr("src") || "";
      if (mediaExtension(href)) next = href;
      else if (/lustmaya|\.mkv|\.mp4/i.test(href)) next = href;
    });
    if (!next) {
      const refresh = (_b = response.data.match(/url=([^"']*\.(?:mkv|mp4)[^"']*)/i)) == null ? void 0 : _b[1];
      if (refresh) next = refresh;
    }
    return next ? new URL(next.replace(/&amp;/g, "&"), target).href : void 0;
  });
}
function getStream(_0) {
  return __async(this, arguments, function* ({
    link,
    signal,
    providerContext
  }) {
    var _a;
    try {
      const base = yield movieswoodBaseUrl();
      const url = httpUrl(link, base);
      if (!url) throw new Error("Invalid source URL");
      const { axios, commonHeaders, cheerio } = providerContext;
      const jar = { value: "" };
      const headersFor = (referer) => __spreadProps(__spreadValues({}, commonHeaders), { Referer: referer });
      const verify = (target, referer, quality, label = "MoviesWood") => __async(null, null, function* () {
        const headers = headersFor(referer);
        const type = yield probeMedia(axios, target, headers, signal, true);
        return type ? { server: label, link: target, type, quality, headers } : void 0;
      });
      const classify = (target, referer, label) => __async(null, null, function* () {
        const headers = headersFor(referer);
        const type = mediaExtension(target) && (yield probeMedia(axios, target, headers, signal));
        const quality = qualityFrom(label);
        return type ? { server: "MoviesWood", link: target, type, quality, headers } : { server: "MoviesWood", link: target, type: "embed", quality, downloadOnly: true };
      });
      if (mediaExtension(url) || new URL(url).origin !== new URL(base).origin) {
        return [yield classify(url, base, url)];
      }
      const page = yield loadMovieswoodPage(url, providerContext, signal, jar);
      const $ = cheerio.load(page.html);
      const starts = [];
      const gates = [];
      const direct = [];
      const seen = /* @__PURE__ */ new Set();
      $("a[href]").each((_i, el) => {
        const anchor = $(el);
        const label = anchor.text().replace(/\s+/g, " ").trim();
        const target = httpUrl(anchor.attr("href"), page.url);
        if (!target || target === page.url || seen.has(target)) return;
        if (/^https?:\/\/(?:t\.me|telegram\.me|telegram\.org)\//i.test(target)) return;
        if (isStartLink(target)) {
          seen.add(target);
          starts.push({ target, label });
        } else if (mediaExtension(target)) {
          seen.add(target);
          direct.push({ target, label });
        } else if (isDownloadGate(target, label)) {
          seen.add(target);
          gates.push({ target, label });
        }
      });
      const streams = [];
      for (const row of starts.slice(0, 2)) {
        if (signal == null ? void 0 : signal.aborted) break;
        const signed = yield resolveStart(providerContext, row.target, page.url, signal, jar).catch(() => void 0);
        if (!signed) continue;
        const quality = qualityFrom(row.label) || qualityFrom(signed) || qualityFrom(page.url);
        const stream = yield verify(signed, page.url, quality);
        if (stream) streams.push(__spreadProps(__spreadValues({}, stream), { server: "MoviesWood Direct" }));
      }
      if (streams.length === 0) {
        for (const gate of gates.slice(0, 3)) {
          if (signal == null ? void 0 : signal.aborted) break;
          const detail = yield loadMovieswoodPage(gate.target, providerContext, signal, jar).catch(() => null);
          if (!detail) continue;
          const title = cheerio.load(detail.html)("title").text() || ((_a = detail.html.match(/<title[^>]*>([^<]*)/i)) == null ? void 0 : _a[1]) || "";
          const detail$ = cheerio.load(detail.html);
          let start = "";
          detail$("a[href]").each((_i, el) => {
            const label = detail$(el).text().replace(/\s+/g, " ").trim();
            const href = detail$(el).attr("href") || "";
            if (start || /^https?:\/\/(?:t\.me|telegram\.me|telegram\.org)\//i.test(href) || !isStartLink(href)) return;
            start = httpUrl(href, detail.url) || "";
          });
          if (!start) continue;
          const signed = yield resolveStart(providerContext, start, detail.url, signal, jar).catch(() => void 0);
          if (!signed) continue;
          const quality = qualityFrom(gate.label) || qualityFrom(title) || qualityFrom(detail.url);
          const stream = yield verify(signed, detail.url, quality);
          if (stream) streams.push(__spreadProps(__spreadValues({}, stream), { server: "MoviesWood Direct" }));
        }
      }
      if (streams.length === 0) {
        for (const row of direct.slice(0, 3)) {
          const stream = yield verify(row.target, page.url, qualityFrom(row.label));
          if (stream) streams.push(stream);
        }
      }
      if (streams.length > 0) return streams;
      const fallback = [...starts, ...gates].slice(0, 4);
      return yield Promise.all(fallback.map((row) => classify(row.target, page.url, row.label)));
    } catch (error) {
      throwProviderError("MoviesWood", "stream", error);
    }
  });
}
var isStartLink, isDownloadGate;
var init_stream = __esm({
  "providers/movieswood/stream.ts"() {
    "use strict";
    init_providerErrors();
    init_httpMedia();
    init_posts();
    isStartLink = (url) => /download-start\.php/i.test(url);
    isDownloadGate = (url, label) => isStartLink(url) || /rating\.php/i.test(url) || /\bdownload\b/i.test(label);
  }
});

// providers/movieswood/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
function getEpisodes(_0) {
  return __async(this, arguments, function* ({ url }) {
    const link = httpUrl(url, yield movieswoodBaseUrl());
    return link ? [{ title: "Play Movie", link }] : [];
  });
}
var init_episodes = __esm({
  "providers/movieswood/episodes.ts"() {
    "use strict";
    init_httpMedia();
    init_posts();
  }
});

// providers/movieswood/movieswood.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
