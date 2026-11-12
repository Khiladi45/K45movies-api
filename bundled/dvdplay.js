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

// providers/dvdplay/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/dvdplay/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Tamil Movies", filter: "/Tamil_2026.html" },
      { title: "Malayalam Movies", filter: "/Malayalam_2026.html" },
      { title: "Hindi Movies", filter: "/Hindi_2026.html" },
      { title: "English Movies", filter: "/English_2026.html" },
      { title: "Telugu Movies", filter: "/Telugu_2026.html" }
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

// providers/dvdplay/posts.ts
var posts_exports = {};
__export(posts_exports, {
  dvdplayBaseUrl: () => dvdplayBaseUrl,
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function dvdplayBaseUrl() {
  return __async(this, null, function* () {
    const url = yield getBaseUrl("dvdplay").catch(() => "");
    return (url || "https://dvdplay.singles").replace(/^http:\/\/dvdplay\.singles(?=\/|$)/i, "https://dvdplay.singles");
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
      const url = new URL(filter, yield dvdplayBaseUrl());
      if (page > 1) {
        url.searchParams.set("page", String(page));
        url.search = url.searchParams.toString();
      }
      const { axios, cheerio, commonHeaders } = providerContext;
      const response = yield axios.get(url.href, { headers: commonHeaders, signal, timeout: 12e3 });
      const landing = responseUrl(response, url.href);
      const $ = cheerio.load(response.data);
      const rows = /* @__PURE__ */ new Map();
      $("a[href]").each((_i, el) => {
        const anchor = $(el);
        const link = httpUrl(anchor.attr("href"), landing);
        const title = anchor.text().trim();
        if (link && title && new URL(link).origin === new URL(landing).origin && /^\/page-\d+-/.test(new URL(link).pathname)) {
          rows.set(link, { title, link, image: "" });
        }
      });
      return [...rows.values()];
    } catch (error) {
      throwProviderError("DVDPlay", "posts", error);
    }
  });
}
function getSearchPosts() {
  return __async(this, null, function* () {
    throwProviderError("DVDPlay", "search", new Error("Search is unavailable. Browse the categories."));
  });
}
var init_posts = __esm({
  "providers/dvdplay/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_httpMedia();
  }
});

// providers/dvdplay/meta.ts
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
      const url = httpUrl(link, yield dvdplayBaseUrl());
      if (!url) throw new Error("Invalid movie URL");
      const { axios, cheerio, commonHeaders } = providerContext;
      const response = yield axios.get(url, { headers: commonHeaders, signal, timeout: 12e3 });
      const landing = responseUrl(response, url);
      const $ = cheerio.load(response.data);
      const title = $("title").text().trim() || $("h1").first().text().trim();
      if (!title) throw new Error("Movie title is missing");
      const linkList = [];
      const seen = /* @__PURE__ */ new Set();
      $("a[href]").each((_i, el) => {
        const anchor = $(el);
        const target = httpUrl(anchor.attr("href"), landing);
        if (!target || seen.has(target)) return;
        const parsed = new URL(target);
        if (parsed.origin !== new URL(landing).origin || !/^\/download\/file\//.test(parsed.pathname)) return;
        seen.add(target);
        const label = anchor.text().replace(/[⇩↓]/g, "").replace(/\s+/g, " ").trim();
        const quality = qualityFrom(label);
        const name = label || "Download";
        linkList.push({ title: name, quality, directLinks: [{ title: name, link: target, type: "movie" }] });
      });
      return {
        title,
        synopsis: ((_a = $("meta[name='description']").attr("content")) == null ? void 0 : _a.trim()) || "",
        image: httpUrl($("meta[property='og:image']").attr("content") || $("main img").first().attr("src"), landing) || "",
        imdbId: "",
        tags: [],
        type: "movie",
        linkList,
        webUrl: landing
      };
    } catch (error) {
      throwProviderError("DVDPlay", "metadata", error);
    }
  });
}
var init_meta = __esm({
  "providers/dvdplay/meta.ts"() {
    "use strict";
    init_providerErrors();
    init_httpMedia();
    init_posts();
  }
});

// providers/extractors/directFiles.ts
function pixelDrainDirect(url) {
  const match = url.match(
    /pixeldrain\.(?:com|dev)\/(?:u\/|api\/file\/|file\/)([A-Za-z0-9]+)/i
  );
  return match ? `https://pixeldrain.dev/api/file/${match[1]}?download` : void 0;
}
function hubCloudCandidates(axios, cheerio, link, headers, signal) {
  return __async(this, null, function* () {
    const candidates = [];
    try {
      const page = yield axios.get(link, {
        headers,
        signal,
        timeout: 8e3,
        validateStatus: () => true
      });
      if (typeof page.data !== "string") return candidates;
      let $ = cheerio.load(page.data);
      collectCandidates($, page.data, link, candidates);
      let generate = "";
      $("a[href]").each((_i, el) => {
        const href = $(el).attr("href") || "";
        if (!generate && /hubcloud\.php/i.test(href)) generate = href;
      });
      if (!generate) return candidates;
      yield new Promise((resolve) => setTimeout(resolve, 1200));
      const generated = yield axios.get(new URL(generate, link).href, {
        headers: __spreadProps(__spreadValues({}, headers), { Referer: link }),
        signal,
        timeout: 1e4,
        validateStatus: () => true
      });
      if (typeof generated.data !== "string") return candidates;
      $ = cheerio.load(generated.data);
      collectCandidates($, generated.data, new URL(generate, link).href, candidates);
      return candidates;
    } catch (e) {
      return candidates;
    }
  });
}
function collectCandidates($, html, base, out) {
  const add = (value) => {
    try {
      const url = new URL(value, base).href;
      if (!out.includes(url)) out.push(url);
    } catch (e) {
    }
  };
  $("a[href]").each((_i, el) => {
    const href = $(el).attr("href") || "";
    if (/pixeldrain\./i.test(href)) {
      const direct = pixelDrainDirect(href);
      if (direct) add(direct);
      return;
    }
    if (/\.(?:mkv|mp4|webm)(?:\?|$)/i.test(href) || /\.workers\.dev\//i.test(href)) {
      add(href);
    }
  });
  if (out.length === 0) {
    const inline = html.match(/https?:\/\/pixeldrain\.[^"'\s<>]+/i);
    if (inline) {
      const direct = pixelDrainDirect(inline[0]);
      if (direct) add(direct);
    }
  }
}
var init_directFiles = __esm({
  "providers/extractors/directFiles.ts"() {
    "use strict";
  }
});

// providers/dvdplay/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function getStream(_0) {
  return __async(this, arguments, function* ({
    link,
    signal,
    providerContext
  }) {
    var _a, _b;
    const { axios, cheerio, commonHeaders } = providerContext;
    try {
      let url = httpUrl(link, yield dvdplayBaseUrl());
      if (!url) throw new Error("Invalid download page URL");
      let quality;
      if (/^\/page-\d+-/.test(new URL(url).pathname)) {
        const meta = yield getMeta({ link: url, signal, providerContext });
        const group = meta.linkList.find((entry) => entry.quality === "720") || meta.linkList[0];
        url = (_b = (_a = group == null ? void 0 : group.directLinks) == null ? void 0 : _a[0]) == null ? void 0 : _b.link;
        quality = group == null ? void 0 : group.quality;
        if (!url) return [];
      }
      const response = yield axios.get(url, { headers: commonHeaders, signal, timeout: 12e3 });
      const landing = responseUrl(response, url);
      const pageTitle = cheerio.load(String(response.data || ""))("title").text();
      const $ = cheerio.load(response.data);
      const candidates = /* @__PURE__ */ new Map();
      $("a[href]").each((_i, el) => {
        const anchor = $(el);
        const label = anchor.text().replace(/\s+/g, " ").trim();
        const match = label.match(/\bserver\s*([1-3])\b|google drive/i);
        const target = httpUrl(anchor.attr("href"), landing);
        if (target && match && !candidates.has(target)) {
          const server = /google drive/i.test(label) ? "DVDPlay Google Drive" : `DVDPlay Server ${match[1]}`;
          candidates.set(target, { server, quality: qualityFrom(label) });
        }
      });
      const streams = [];
      for (const [target, info] of [...candidates].slice(0, 4)) {
        if (signal == null ? void 0 : signal.aborted) break;
        const headers = __spreadProps(__spreadValues({}, commonHeaders), { Referer: landing });
        const resolvedQuality = info.quality || quality || qualityFrom(pageTitle);
        try {
          if (/hubcloud\./i.test(target)) {
            const links = yield hubCloudCandidates(axios, cheerio, target, headers, signal);
            let verified = false;
            for (const candidate of links) {
              const fileHeaders = __spreadProps(__spreadValues({}, commonHeaders), { Referer: `${new URL(candidate).origin}/` });
              const type2 = yield probeMedia(axios, candidate, fileHeaders, signal, true);
              if (!type2) continue;
              streams.push({ server: `${info.server} Direct`, link: candidate, type: type2, quality: resolvedQuality, headers: fileHeaders });
              verified = true;
              break;
            }
            if (verified) continue;
          }
          const type = mediaExtension(target) ? yield probeMedia(axios, target, headers, signal) : void 0;
          streams.push(type ? { server: info.server, link: target, type, quality: resolvedQuality, headers } : { server: info.server, link: target, type: "embed", quality: resolvedQuality, downloadOnly: true });
        } catch (e) {
          streams.push({ server: info.server, link: target, type: "embed", quality: resolvedQuality, downloadOnly: true });
        }
      }
      return streams;
    } catch (error) {
      throwProviderError("DVDPlay", "stream", error);
    }
  });
}
var init_stream = __esm({
  "providers/dvdplay/stream.ts"() {
    "use strict";
    init_providerErrors();
    init_httpMedia();
    init_directFiles();
    init_meta();
    init_posts();
  }
});

// providers/dvdplay/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
function getEpisodes(_0) {
  return __async(this, arguments, function* ({ url }) {
    const link = httpUrl(url, yield dvdplayBaseUrl());
    return link ? [{ title: "Play Movie", link }] : [];
  });
}
var init_episodes = __esm({
  "providers/dvdplay/episodes.ts"() {
    "use strict";
    init_httpMedia();
    init_posts();
  }
});

// providers/dvdplay/dvdplay.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
