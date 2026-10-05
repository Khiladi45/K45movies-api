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

// providers/flixhq/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/flixhq/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Trending",
        filter: "/trending"
      },
      {
        title: "Movies",
        filter: "/recent-movies"
      },
      {
        title: "TV Shows",
        filter: "/recent-shows"
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

// providers/flixhq/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0) {
  return __async(this, arguments, function* ({
    url,
    signal,
    providerContext
  }) {
    var _a;
    try {
      const { axios } = providerContext;
      const res = yield axios.get(url, { signal });
      const data = ((_a = res.data) == null ? void 0 : _a.results) || res.data;
      const catalog2 = [];
      data == null ? void 0 : data.map((element) => {
        const title = element.title;
        const link = element.id;
        const image = element.image;
        if (title && link && image) {
          catalog2.push({
            title,
            link,
            image
          });
        }
      });
      return catalog2;
    } catch (err) {
      console.error("flixhq error ", err);
      return [];
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/flixhq/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        signal,
        providerContext
      }) {
        const urlRes = yield getBaseUrl("consumet");
        const baseUrl = urlRes + "/movies/flixhq";
        const url = `${baseUrl + filter}`;
        return posts({ url, signal, providerContext });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        const urlRes = yield getBaseUrl("consumet");
        const baseUrl = urlRes + "/movies/flixhq";
        const url = `${baseUrl}/${searchQuery}?page=${page}`;
        return posts({ url, signal, providerContext });
      });
    };
  }
});

// providers/flixhq/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/flixhq/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link: id,
        providerContext
      }) {
        try {
          const { axios } = providerContext;
          const baseUrl = yield getBaseUrl("consumet");
          const url = `${baseUrl}/movies/flixhq/info?id=` + id;
          const res = yield axios.get(url);
          const data = res.data;
          const meta = {
            title: data.title,
            synopsis: data.description.replace(/<[^>]*>?/gm, "").trim(),
            image: data.cover,
            cast: data.casts,
            rating: data.rating,
            tags: [data == null ? void 0 : data.type, data == null ? void 0 : data.duration, data.releaseDate.split("-")[0]],
            imdbId: "",
            type: data.episodes.length > 1 ? "series" : "movie"
          };
          const links = [];
          data.episodes.forEach((episode) => {
            const title = (episode == null ? void 0 : episode.number) ? "Season-" + (episode == null ? void 0 : episode.season) + " Ep-" + episode.number : episode.title;
            const link = episode.id + "*" + data.id;
            if (link && title) {
              links.push({
                title,
                link
              });
            }
          });
          return __spreadProps(__spreadValues({}, meta), {
            linkList: [
              {
                title: meta.title,
                directLinks: links
              }
            ]
          });
        } catch (err) {
          console.error(err);
          return {
            title: "",
            synopsis: "",
            image: "",
            imdbId: "",
            type: "movie",
            linkList: []
          };
        }
      });
    };
  }
});

// providers/flixhq/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/flixhq/stream.ts"() {
    "use strict";
    init_getBaseUrl();
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: id,
        providerContext
      }) {
        var _a;
        try {
          const episodeId = id.split("*")[0];
          const mediaId = id.split("*")[1];
          const baseUrl = yield getBaseUrl("consumet");
          const serverUrl = `${baseUrl}/movies/flixhq/servers?episodeId=${episodeId}&mediaId=${mediaId}`;
          const res = yield fetch(serverUrl);
          const servers = yield res.json();
          const streamLinks = [];
          for (const server of servers) {
            const streamUrl = `${baseUrl}/movies/flixhq/watch?server=` + server.name + "&episodeId=" + episodeId + "&mediaId=" + mediaId;
            const streamRes = yield fetch(streamUrl);
            const streamData = yield streamRes.json();
            const subtitles = [];
            if (((_a = streamData == null ? void 0 : streamData.sources) == null ? void 0 : _a.length) > 0) {
              if (streamData.subtitles) {
                streamData.subtitles.forEach((sub) => {
                  var _a2;
                  subtitles.push({
                    language: (_a2 = sub == null ? void 0 : sub.lang) == null ? void 0 : _a2.slice(0, 2),
                    uri: sub == null ? void 0 : sub.url,
                    type: "text/vtt",
                    title: sub == null ? void 0 : sub.lang
                  });
                });
              }
              streamData.sources.forEach((source) => {
                var _a2;
                streamLinks.push({
                  server: (server == null ? void 0 : server.name) + "-" + ((_a2 = source == null ? void 0 : source.quality) == null ? void 0 : _a2.replace("auto", "MultiQuality")),
                  link: source.url,
                  type: source.isM3U8 ? "m3u8" : "mp4",
                  subtitles
                });
              });
            }
          }
          return streamLinks;
        } catch (err) {
          console.error(err);
          return [];
        }
      });
    };
  }
});

// providers/flixhq/flixhq.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
