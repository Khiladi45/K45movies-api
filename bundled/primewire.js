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

// providers/primewire/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/primewire/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Recently Added",
        filter: "/filter?sort=Just+Added&free_links=true"
      },
      {
        title: "TV Shows",
        filter: "/filter?sort=Trending+Today&type=tv"
      },
      {
        title: "Movies",
        filter: "/filter?sort=Trending+Today&type=movie"
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
    urlsEndpoint = "https://raw.githubusercontent.com/Zenda-Cross/vega-providers/refs/heads/main/urls.json";
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

// providers/primewire/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0) {
  return __async(this, arguments, function* ({
    baseUrl,
    url,
    signal,
    axios,
    cheerio,
    operation
  }) {
    try {
      const res = yield axios.get(url, { signal });
      const data = res.data;
      const $ = cheerio.load(data);
      const catalog2 = [];
      $(".index_item.index_item_ie").map((i, element) => {
        const title = $(element).find("a").attr("title");
        const link = $(element).find("a").attr("href");
        const image = $(element).find("img").attr("src") || "";
        if (title && link) {
          const postUrl = new URL(link, `${baseUrl}/`);
          catalog2.push({
            title,
            link: `${postUrl.pathname}${postUrl.search}${postUrl.hash}`,
            image: baseUrl + image
          });
        }
      });
      return catalog2;
    } catch (err) {
      throwProviderError("PrimeWire", operation, err);
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/primewire/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("primewire");
        const url = `${baseUrl + filter}&page=${page}`;
        return posts({
          baseUrl,
          url,
          signal,
          axios,
          cheerio,
          operation: "posts"
        });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        const { axios, cheerio, Aes } = providerContext;
        const getSHA256ofJSON = function(input) {
          return __async(this, null, function* () {
            return yield Aes.sha1(input);
          });
        };
        const baseUrl = yield getBaseUrl("primewire");
        const hash = yield getSHA256ofJSON(searchQuery + "JyjId97F9PVqUPuMO0");
        const url = `${baseUrl}/filter?s=${searchQuery}&page=${page}&ds=${hash.slice(
          0,
          10
        )}`;
        return posts({
          baseUrl,
          url,
          signal,
          axios,
          cheerio,
          operation: "search posts"
        });
      });
    };
  }
});

// providers/primewire/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/primewire/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a;
        try {
          const { axios, cheerio } = providerContext;
          const baseUrl = yield getBaseUrl("primewire");
          const url = new URL(link, `${baseUrl}/`).href;
          const res = yield axios.get(url);
          const html = yield res.data;
          const $ = cheerio.load(html);
          const imdbId = ((_a = $(".movie_info").find('a[href*="imdb.com/title/tt"]:not([href*="imdb.com/title/tt/"])').attr("href")) == null ? void 0 : _a.split("/")[4]) || "";
          const type = $(".show_season").html() ? "series" : "movie";
          const linkList = [];
          $(".show_season").each((i, element) => {
            const seasonTitle = "Season " + $(element).attr("data-id");
            const episodes = [];
            $(element).children().each((i2, element2) => {
              const episodeTitle = $(element2).find("a").children().remove().end().text().trim().replace("E", "Epiosode ");
              const episodeLink = baseUrl + $(element2).find("a").attr("href");
              if (episodeTitle && episodeLink) {
                episodes.push({
                  title: episodeTitle,
                  link: episodeLink
                });
              }
            });
            linkList.push({
              title: seasonTitle,
              directLinks: episodes
            });
          });
          if (type === "movie") {
            linkList.push({
              title: "Movie",
              directLinks: [
                {
                  link,
                  title: "Movie",
                  type: "movie"
                }
              ]
            });
          }
          return {
            title: "",
            image: "",
            imdbId,
            synopsis: "",
            type,
            linkList,
            webUrl: url
          };
        } catch (error) {
          throwProviderError("PrimeWire", "metadata", error);
        }
      });
    };
  }
});

// providers/primewire/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function getStreamTapeUrl(html, iframeUrl) {
  const match = html.match(
    /document\.getElementById\(['"]robotlink['"]\)\.innerHTML\s*=\s*['"]([^'"]+)['"]/
  );
  if (!(match == null ? void 0 : match[1])) return "";
  const link = match[1].replace(/&amp;/g, "&").replace(/\\\//g, "/");
  return new URL(link.startsWith("//") ? `https:${link}` : link, iframeUrl).href;
}
function getEmbeddedLink(data) {
  if (typeof data === "object" && data && "link" in data) {
    const link = data.link;
    return typeof link === "string" ? link : "";
  }
  if (typeof data !== "string") return "";
  try {
    return getEmbeddedLink(JSON.parse(data));
  } catch (e) {
    return "";
  }
}
function getEmbeddedLinkWithWaf(source, pageUrl, providerContext) {
  return __async(this, null, function* () {
    var _a;
    const { axios, commonHeaders, openWebView } = providerContext;
    const url = `${new URL(pageUrl).origin}/links/go/${source.id}?embed=true`;
    const headers = __spreadProps(__spreadValues({}, commonHeaders), { Referer: pageUrl });
    try {
      return getEmbeddedLink((yield axios.get(url, { headers })).data);
    } catch (error) {
      if (((_a = error.response) == null ? void 0 : _a.status) !== 403 || !openWebView) throw error;
      const wafResult = yield openWebView(url, {
        title: "Solve the captcha below and click done",
        description: "Required to open PrimeWire streaming links.",
        headers,
        waitForCookie: "cf_clearance",
        force: true
      });
      const embeddedLink = getEmbeddedLink(wafResult.data);
      if (embeddedLink) return embeddedLink;
      return getEmbeddedLink(
        (yield axios.get(url, {
          headers: __spreadProps(__spreadValues({}, headers), {
            "User-Agent": wafResult.userAgent || headers["User-Agent"],
            Cookie: wafResult.cookies
          })
        })).data
      );
    }
  });
}
function getSources(data, providerContext) {
  const $ = providerContext.cheerio.load(data);
  const sources = [];
  $("table.movie_version").each((_, element) => {
    const row = $(element);
    const host = row.find(".version-host").text().trim().toLowerCase();
    const id = row.find(".wp-menu-btn").attr("data-wp-menu");
    const size = row.find(".quality_tag").text().trim();
    if (host.includes("streamtape") && id) sources.push({ id, size });
  });
  return sources;
}
var getStream;
var init_stream = __esm({
  "providers/primewire/stream.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        type,
        providerContext
      }) {
        const { axios, commonHeaders } = providerContext;
        try {
          const baseUrl = yield getBaseUrl("primewire");
          const pageUrl = new URL(link, `${baseUrl}/`).href;
          console.log("pwGetStream", type, pageUrl);
          const page = yield axios.get(pageUrl, { headers: commonHeaders });
          const streams = [];
          for (const source of getSources(page.data, providerContext)) {
            try {
              const iframeUrl = yield getEmbeddedLinkWithWaf(
                source,
                pageUrl,
                providerContext
              );
              if (!iframeUrl) continue;
              const iframe = yield axios.get(iframeUrl, {
                headers: __spreadProps(__spreadValues({}, commonHeaders), { Referer: pageUrl })
              });
              const streamUrl = getStreamTapeUrl(iframe.data, iframeUrl);
              if (!streamUrl) continue;
              streams.push({
                server: `StreamTape ${source.size}`.trim(),
                link: streamUrl,
                type: "mp4",
                headers: { Referer: iframeUrl }
              });
            } catch (error) {
              console.log(`PrimeWire StreamTape source ${source.id} failed`, error);
            }
          }
          return streams;
        } catch (error) {
          throwProviderError("PrimeWire", "stream", error);
        }
      });
    };
  }
});

// providers/primewire/primewire.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
