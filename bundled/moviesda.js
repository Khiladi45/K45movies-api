var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// providers/moviesda/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/moviesda/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Tamil 2026 Movies",
        filter: "/tamil-2026-movies/"
      },
      {
        title: "Tamil 2025 Movies",
        filter: "/tamil-2025-movies/"
      },
      {
        title: "Tamil Dubbed Movies",
        filter: "/tamil-dubbed-movies/"
      },
      {
        title: "Latest Tamil Web Series",
        filter: "/latest-tamil-web-series/"
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

// providers/moviesda/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0) {
  return __async(this, arguments, function* ({
    url,
    signal,
    cheerio,
    operation
  }) {
    try {
      const res = yield fetch(url, { signal });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} | URL ${url}`);
      }
      const data = yield res.text();
      const $ = cheerio.load(data);
      const catalog2 = [];
      $('h2 a, .post-title a, a[href*="/movie/"]').each((i, el) => {
        const title = $(el).text().trim();
        const link = $(el).attr("href");
        if (title && link) {
          catalog2.push({ title, link, image: "" });
        }
      });
      return catalog2;
    } catch (err) {
      throwProviderError("Moviesda", operation, err);
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/moviesda/posts.ts"() {
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
        const { cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("moviesda");
        const url = `${baseUrl}${filter}`;
        return posts({ url, signal, cheerio, operation: "posts" });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        const { cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("moviesda");
        const url = `${baseUrl}/?s=${encodeURIComponent(searchQuery)}`;
        return posts({ url, signal, cheerio, operation: "search posts" });
      });
    };
  }
});

// providers/moviesda/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/moviesda/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        try {
          const { axios, cheerio } = providerContext;
          const baseUrl = yield getBaseUrl("moviesda");
          const url = new URL(link, baseUrl).href;
          const res = yield axios.get(url);
          const data = res.data;
          const $ = cheerio.load(data);
          const title = $("h1").first().text().trim() || $("title").text().trim();
          const image = $("img").first().attr("src") || "";
          const synopsis = $("p").first().text().trim() || "No description available.";
          const links = [];
          $("a").each((i, el) => {
            const href = $(el).attr("href");
            const text = $(el).text().trim().toLowerCase();
            if (href && (text.includes("download") || text.includes("watch") || text.includes("play"))) {
              links.push({
                title: $(el).text().trim(),
                episodesLink: href.startsWith("http") ? href : baseUrl + href
              });
            }
          });
          return {
            title,
            synopsis,
            image,
            imdbId: "tt0000000",
            tags: [],
            type: "movie",
            linkList: links,
            webUrl: url
          };
        } catch (err) {
          throwProviderError("Moviesda", "metadata", err);
        }
      });
    };
  }
});

// providers/moviesda/stream.ts
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
    const { axios, cheerio, commonHeaders: headers } = providerContext;
    const Streams = [];
    try {
      const res = yield axios.get(link, { headers, signal });
      const html = res.data;
      const $ = cheerio.load(html);
      $("a").each((i, el) => {
        const href = $(el).attr("href");
        const text = $(el).text().toLowerCase();
        if (href && (text.includes("download") || text.includes("watch"))) {
          if (href.toLowerCase().includes(".mp4") || href.toLowerCase().includes(".mkv") || href.toLowerCase().includes(".m3u8")) {
            let quality = "720";
            if (href.includes("1080") || text.includes("1080")) quality = "1080";
            else if (href.includes("480") || text.includes("480"))
              quality = "480";
            else if (href.includes("360") || text.includes("360"))
              quality = "360";
            Streams.push({
              server: "Moviesda Direct",
              link: href,
              type: href.toLowerCase().includes(".m3u8") ? "m3u8" : "mp4",
              quality,
              headers
            });
          }
        }
      });
      if (Streams.length === 0) {
        console.log("No direct streams found for:", link);
      }
    } catch (error) {
      throwProviderError("Moviesda", "stream", error);
    }
    return Streams;
  });
}
var init_stream = __esm({
  "providers/moviesda/stream.ts"() {
    "use strict";
    init_providerErrors();
  }
});

// providers/moviesda/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/moviesda/episodes.ts"() {
    "use strict";
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url
      }) {
        return [
          {
            title: "Play Movie",
            link: url
          }
        ];
      });
    };
  }
});

// providers/moviesda/moviesda.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
