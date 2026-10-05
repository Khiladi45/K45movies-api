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

// providers/ridoMovies/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/ridoMovies/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Popular Movies",
        filter: "/top/catalog/movie/top.json"
      },
      {
        title: "Featured Movies",
        filter: "/imdbRating/catalog/movie/imdbRating.json"
      }
    ];
    genres = [];
  }
});

// providers/ridoMovies/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/ridoMovies/posts.ts"() {
    "use strict";
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        signal,
        providerContext
      }) {
        try {
          const catalog2 = [];
          const url = "https://cinemeta-catalogs.strem.io" + filter;
          console.log("allGetPostUrl", url);
          const res = yield providerContext.axios.get(url, {
            headers: providerContext.commonHeaders,
            signal
          });
          const data = res.data;
          data == null ? void 0 : data.metas.map((result) => {
            const title = result == null ? void 0 : result.name;
            const id = (result == null ? void 0 : result.imdb_id) || (result == null ? void 0 : result.id);
            const type = result == null ? void 0 : result.type;
            const image = result == null ? void 0 : result.poster;
            if (id) {
              catalog2.push({
                title,
                link: `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
                image
              });
            }
          });
          console.log("catalog", catalog2.length);
          return catalog2;
        } catch (err) {
          console.error("AutoEmbed error ", err);
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
          const { axios, commonHeaders: headers } = providerContext;
          if (page > 1) {
            return [];
          }
          const catalog2 = [];
          const url2 = `https://v3-cinemeta.strem.io/catalog/movie/top/search=${encodeURI(
            searchQuery
          )}.json`;
          const res2 = yield axios.get(url2, { headers, signal });
          const data2 = res2.data;
          data2 == null ? void 0 : data2.metas.map((result) => {
            const title = (result == null ? void 0 : result.name) || "";
            const id = (result == null ? void 0 : result.imdb_id) || (result == null ? void 0 : result.id);
            const image = result == null ? void 0 : result.poster;
            const type = result == null ? void 0 : result.type;
            if (id) {
              catalog2.push({
                title,
                link: `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
                image
              });
            }
          });
          return catalog2;
        } catch (err) {
          console.error("AutoEmbed error ", err);
          return [];
        }
      });
    };
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

// providers/ridoMovies/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/ridoMovies/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        try {
          const { axios } = providerContext;
          const res = yield axios.get(link);
          const data = res.data;
          const meta = {
            title: "",
            synopsis: "",
            image: "",
            imdbId: ((_a = data == null ? void 0 : data.meta) == null ? void 0 : _a.imdb_id) || "",
            tmdbId: ((_c = (_b = data == null ? void 0 : data.meta) == null ? void 0 : _b.moviedb_id) == null ? void 0 : _c.toString()) || void 0,
            type: ((_d = data == null ? void 0 : data.meta) == null ? void 0 : _d.type) || "movie"
          };
          const baseUrl = yield getBaseUrl("ridomovies");
          let slug = "";
          try {
            const res2 = yield axios.get(
              baseUrl + "/core/api/search?q=" + meta.imdbId
            );
            const data2 = res2.data;
            slug = (_f = (_e = data2 == null ? void 0 : data2.data) == null ? void 0 : _e.items[0]) == null ? void 0 : _f.fullSlug;
            if (!slug || (meta == null ? void 0 : meta.type) === "series") {
              return {
                title: "",
                synopsis: "",
                image: "",
                imdbId: ((_g = data == null ? void 0 : data.meta) == null ? void 0 : _g.imdb_id) || "",
                type: (meta == null ? void 0 : meta.type) || "movie",
                linkList: []
              };
            }
          } catch (err) {
            return {
              title: "",
              synopsis: "",
              image: "",
              imdbId: (meta == null ? void 0 : meta.imdbId) || "",
              type: (meta == null ? void 0 : meta.type) || "movie",
              linkList: []
            };
          }
          const links = [];
          let directLinks = [];
          let season = /* @__PURE__ */ new Map();
          if (meta.type === "series") {
            (_i = (_h = data == null ? void 0 : data.meta) == null ? void 0 : _h.videos) == null ? void 0 : _i.map((video) => {
              if ((video == null ? void 0 : video.season) <= 0) return;
              if (!season.has(video == null ? void 0 : video.season)) {
                season.set(video == null ? void 0 : video.season, []);
              }
              season.get(video == null ? void 0 : video.season).push({
                title: "Episode " + (video == null ? void 0 : video.episode),
                link: ""
              });
            });
            for (const [seasonNum, episodes] of season.entries()) {
              links.push({
                title: "Season " + seasonNum,
                directLinks: episodes
              });
            }
          } else {
            directLinks.push({ title: "Movie", link });
            links.push({ title: "Movie", directLinks });
          }
          return __spreadProps(__spreadValues({}, meta), {
            linkList: links
          });
        } catch (err) {
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

// providers/ridoMovies/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function unpackJavaScript(packedCode) {
  const encodedString = packedCode.split("|aHR")[1].split("|")[0];
  const base64Url = "aHR" + encodedString;
  function addPadding(base64) {
    return base64 + "=".repeat((4 - base64.length % 4) % 4);
  }
  console.log("rido base64Url", base64Url);
  const unpackedCode = atob(addPadding(base64Url));
  return unpackedCode;
}
var getStream;
var init_stream = __esm({
  "providers/ridoMovies/stream.ts"() {
    "use strict";
    getStream = (_0) => __async(null, [_0], function* ({
      link: data,
      providerContext
    }) {
      var _a, _b;
      try {
        const { cheerio, commonHeaders: headers, axios } = providerContext;
        const streamData = JSON.parse(data);
        const streamLinks = [];
        const url = (streamData == null ? void 0 : streamData.baseUrl) + "/api/" + (streamData == null ? void 0 : streamData.slug);
        console.log("rido url", url);
        const res = yield axios.get(url, { headers });
        const iframe = (_b = (_a = res.data.data) == null ? void 0 : _a[0]) == null ? void 0 : _b.url;
        console.log("rido data", iframe);
        const iframeUrl = iframe.split('src="')[1].split('"')[0];
        console.log("rido iframeUrl", iframeUrl);
        const iframeRes = yield axios.get(iframeUrl, {
          headers: __spreadProps(__spreadValues({}, headers), {
            Referer: streamData == null ? void 0 : streamData.baseUrl
          })
        });
        const $ = cheerio.load(iframeRes.data);
        const script = $('script:contains("eval")').html();
        if (!script) {
          throw new Error("Unable to find script");
        }
        const srcUrl = unpackJavaScript(script.trim());
        console.log("rido srcUrl", srcUrl);
        streamLinks.push({
          link: srcUrl,
          server: "rido",
          type: "m3u8",
          headers: {
            Referer: iframeUrl
          }
        });
        return streamLinks;
      } catch (e) {
        console.log("rido get stream err", e);
        return [];
      }
    });
  }
});

// providers/ridoMovies/ridoMovies.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
