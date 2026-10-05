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

// providers/kissKh/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/kissKh/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Latest",
        filter: "/api/DramaList/List?type=0&sub=0&country=0&status=0&order=2"
      },
      {
        title: "Hollywood",
        filter: "/api/DramaList/List?type=4&sub=0&country=0&status=0&order=2"
      },
      {
        title: "Anime",
        filter: "/api/DramaList/List?type=3&sub=0&country=0&status=0&order=2"
      },
      {
        title: "K Drama",
        filter: "/api/DramaList/List?type=0&sub=0&country=0&status=0&order=2"
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

// providers/kissKh/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/kissKh/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        signal,
        providerContext
      }) {
        var _a;
        const { axios } = providerContext;
        const baseUrl = yield getBaseUrl("kissKh");
        const url = `${baseUrl + filter}&type=0`;
        try {
          const res = yield axios.get(url, { signal });
          const data = (_a = res.data) == null ? void 0 : _a.data;
          const catalog2 = [];
          data == null ? void 0 : data.map((element) => {
            const title = element.title;
            const link = baseUrl + `/api/DramaList/Drama/${element == null ? void 0 : element.id}?isq=false`;
            const image = element.thumbnail;
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
          console.error("kiss error ", err);
          return [];
        }
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        signal,
        providerContext
      }) {
        const { axios } = providerContext;
        const baseUrl = yield getBaseUrl("kissKh");
        const url = `${baseUrl}/api/DramaList/Search?q=${searchQuery}&type=0`;
        try {
          const res = yield axios.get(url, { signal });
          const data = res.data;
          const catalog2 = [];
          data == null ? void 0 : data.map((element) => {
            const title = element.title;
            const link = baseUrl + `/api/DramaList/Drama/${element == null ? void 0 : element.id}?isq=false`;
            const image = element.thumbnail;
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
          console.error("kiss error ", err);
          return [];
        }
      });
    };
  }
});

// providers/kissKh/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/kissKh/meta.ts"() {
    "use strict";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b;
        try {
          const { axios } = providerContext;
          const res = yield axios.get(link);
          const data = res.data;
          const meta = {
            title: data.title,
            synopsis: data.description,
            image: data.thumbnail,
            tags: [(_a = data == null ? void 0 : data.releaseDate) == null ? void 0 : _a.split("-")[0], data == null ? void 0 : data.status, data == null ? void 0 : data.type],
            imdbId: "",
            type: data.episodesCount > 1 ? "series" : "movie"
          };
          const linkList = [];
          const subLinks = [];
          (_b = data == null ? void 0 : data.episodes) == null ? void 0 : _b.reverse().map((episode) => {
            var _a2;
            const title = "Episode " + (episode == null ? void 0 : episode.number);
            const link2 = (_a2 = episode == null ? void 0 : episode.id) == null ? void 0 : _a2.toString();
            if (link2 && title) {
              subLinks.push({
                title,
                link: link2
              });
            }
          });
          linkList.push({
            title: meta.title,
            directLinks: subLinks
          });
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

// providers/kissKh/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/kissKh/stream.ts"() {
    "use strict";
    init_getBaseUrl();
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: id,
        providerContext
      }) {
        var _a, _b, _c;
        try {
          const { axios } = providerContext;
          const streamLinks = [];
          const subtitles = [];
          const baseUrl = yield getBaseUrl("kissKh");
          const streamUrl = "https://adorable-salamander-ecbb21.netlify.app/api/kisskh/video?id=" + id;
          const res = yield axios.get(streamUrl);
          const stream = (_b = (_a = res.data) == null ? void 0 : _a.source) == null ? void 0 : _b.Video;
          const subData = (_c = res.data) == null ? void 0 : _c.subtitles;
          subData == null ? void 0 : subData.map((sub) => {
            var _a2;
            subtitles.push({
              title: sub == null ? void 0 : sub.label,
              language: sub == null ? void 0 : sub.land,
              type: ((_a2 = sub == null ? void 0 : sub.src) == null ? void 0 : _a2.includes(".vtt")) ? "text/vtt" : "application/x-subrip",
              uri: sub == null ? void 0 : sub.src
            });
          });
          streamLinks.push({
            server: "kissKh",
            link: stream,
            type: (stream == null ? void 0 : stream.includes(".mp4")) ? "mp4" : "m3u8",
            headers: {
              referer: baseUrl
            }
          });
          return streamLinks;
        } catch (err) {
          console.error(err);
          return [];
        }
      });
    };
  }
});

// providers/kissKh/kissKh.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
