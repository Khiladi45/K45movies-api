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

// providers/hiAnime/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/hiAnime/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Recent",
        filter: "/anime/zoro/recent-episodes"
      },
      {
        title: "Top Airing",
        filter: "/anime/zoro/top-airing"
      },
      {
        title: "Most Popular",
        filter: "/anime/zoro/most-popular"
      },
      {
        title: "Most Favorited",
        filter: "/anime/zoro/most-favorite"
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

// providers/hiAnime/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0) {
  return __async(this, arguments, function* ({
    url,
    signal,
    axios
  }) {
    var _a;
    try {
      const res = yield axios.get(url, { signal });
      const data = (_a = res.data) == null ? void 0 : _a.results;
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
      console.error("zoro error ", err);
      return [];
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/hiAnime/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const { axios } = providerContext;
        const baseUrl = yield getBaseUrl("consumet");
        const url = `${baseUrl + filter}?page=${page}`;
        return posts({ url, signal, axios });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        const { axios } = providerContext;
        const baseUrl = yield getBaseUrl("consumet");
        const url = `${baseUrl}/anime/zoro/${searchQuery}?page=${page}`;
        return posts({ url, signal, axios });
      });
    };
  }
});

// providers/hiAnime/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/hiAnime/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        try {
          const { axios } = providerContext;
          const baseUrl = yield getBaseUrl("consumet");
          const url = `${baseUrl}/anime/zoro/info?id=` + link;
          const res = yield axios.get(url);
          const data = res.data;
          const meta = {
            title: data.title,
            synopsis: data.description,
            image: data.image,
            tags: [
              data == null ? void 0 : data.type,
              (data == null ? void 0 : data.subOrDub) === "both" ? "Sub And Dub" : data == null ? void 0 : data.subOrDub
            ],
            imdbId: "",
            type: data.episodes.length > 0 ? "series" : "movie"
          };
          const linkList = [];
          const subLinks = [];
          data.episodes.forEach((episode) => {
            if (!(episode == null ? void 0 : episode.isSubbed)) {
              return;
            }
            const title = "Episode " + episode.number + ((episode == null ? void 0 : episode.isFiller) ? " (Filler)" : "");
            const link2 = episode.id + "$sub";
            if (link2 && title) {
              subLinks.push({
                title,
                link: link2
              });
            }
          });
          linkList.push({
            title: meta.title + " (Sub)",
            directLinks: subLinks
          });
          if ((data == null ? void 0 : data.subOrDub) === "both") {
            const dubLinks = [];
            data.episodes.forEach((episode) => {
              if (!(episode == null ? void 0 : episode.isDubbed)) {
                return;
              }
              const title = "Episode " + episode.number + ((episode == null ? void 0 : episode.isFiller) ? " (Filler)" : "");
              const link2 = episode.id + "$dub";
              if (link2 && title) {
                dubLinks.push({
                  title,
                  link: link2
                });
              }
            });
            linkList.push({
              title: meta.title + " (Dub)",
              directLinks: dubLinks
            });
          }
          return __spreadProps(__spreadValues({}, meta), {
            linkList
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

// providers/hiAnime/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/hiAnime/stream.ts"() {
    "use strict";
    init_getBaseUrl();
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: id,
        providerContext
      }) {
        try {
          const { axios } = providerContext;
          const baseUrl = yield getBaseUrl("consumet");
          const servers = ["vidcloud", "vidstreaming"];
          const url = `${baseUrl}/anime/zoro/watch?episodeId=${id}&server=`;
          const streamLinks = [];
          yield Promise.all(
            servers.map((server) => __async(null, null, function* () {
              var _a, _b;
              try {
                const res = yield axios.get(url + server);
                if (res.data) {
                  const subtitles = [];
                  (_a = res.data) == null ? void 0 : _a.subtitles.forEach((sub) => {
                    var _a2, _b2;
                    if ((sub == null ? void 0 : sub.lang) === "Thumbnails") return;
                    subtitles.push({
                      language: ((_a2 = sub == null ? void 0 : sub.lang) == null ? void 0 : _a2.slice(0, 2)) || "Und",
                      uri: sub == null ? void 0 : sub.url,
                      title: (sub == null ? void 0 : sub.lang) || "Undefined",
                      type: ((_b2 = sub == null ? void 0 : sub.url) == null ? void 0 : _b2.endsWith(".vtt")) ? "text/vtt" : "application/x-subrip"
                    });
                  });
                  (_b = res.data) == null ? void 0 : _b.sources.forEach((source) => {
                    streamLinks.push({
                      server,
                      link: source == null ? void 0 : source.url,
                      type: (source == null ? void 0 : source.isM3U8) ? "m3u8" : "mp4",
                      headers: {
                        Referer: "https://megacloud.club/",
                        Origin: "https://megacloud.club"
                      },
                      subtitles
                    });
                  });
                }
              } catch (e) {
                console.log(e);
              }
            }))
          );
          return streamLinks;
        } catch (err) {
          console.error(err);
          return [];
        }
      });
    };
  }
});

// providers/hiAnime/hiAnime.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
