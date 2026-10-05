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

// providers/dooflix/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/dooflix/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Series",
        filter: "/rest-api//v130/tvseries"
      },
      {
        title: "Movies",
        filter: "/rest-api//v130/movies"
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

// providers/dooflix/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var headers, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/dooflix/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    headers = {
      "Accept-Encoding": "gzip",
      "API-KEY": "2pm95lc6prpdbk0ppji9rsqo",
      Connection: "Keep-Alive",
      "If-Modified-Since": "Wed, 14 Aug 2024 13:00:04 GMT",
      "User-Agent": "okhttp/3.14.9"
    };
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        try {
          const { axios } = providerContext;
          const baseUrl = yield getBaseUrl("dooflix");
          const catalog2 = [];
          const url = `${baseUrl + filter + `?page=${page}`}`;
          const res = yield axios.get(url, { headers, signal });
          const resData = res.data;
          if (!resData || typeof resData !== "string") {
            console.warn("Unexpected response format from dooflix API");
            return [];
          }
          let data;
          try {
            const jsonStart = resData.indexOf("[");
            const jsonEnd = resData.lastIndexOf("]") + 1;
            if (jsonStart === -1 || jsonEnd <= jsonStart) {
              data = JSON.parse(resData);
            } else {
              const jsonSubstring = resData.substring(jsonStart, jsonEnd);
              const parsedArray = JSON.parse(jsonSubstring);
              data = parsedArray.length > 0 ? parsedArray : resData;
            }
          } catch (parseError) {
            console.error("Error parsing dooflix response:", parseError);
            return [];
          }
          if (!Array.isArray(data)) {
            console.warn("Unexpected data format from dooflix API");
            return [];
          }
          data.forEach((result) => {
            const id = result == null ? void 0 : result.videos_id;
            if (!id) return;
            const type = !(result == null ? void 0 : result.is_tvseries) ? "tvseries" : "movie";
            const link = `${baseUrl}/rest-api//v130/single_details?type=${type}&id=${id}`;
            const thumbnailUrl = result == null ? void 0 : result.thumbnail_url;
            const image = (thumbnailUrl == null ? void 0 : thumbnailUrl.includes("https")) ? thumbnailUrl : thumbnailUrl == null ? void 0 : thumbnailUrl.replace("http", "https");
            catalog2.push({
              title: (result == null ? void 0 : result.title) || "",
              link,
              image
            });
          });
          return catalog2;
        } catch (err) {
          console.error("dooflix error:", err);
          return [];
        }
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        providerContext,
        signal
      }) {
        var _a, _b;
        try {
          if (page > 1) {
            return [];
          }
          const { axios } = providerContext;
          const catalog2 = [];
          const baseUrl = yield getBaseUrl("dooflix");
          const url = `${baseUrl}/rest-api//v130/search?q=${searchQuery}&type=movietvserieslive&range_to=0&range_from=0&tv_category_id=0&genre_id=0&country_id=0`;
          const res = yield axios.get(url, { headers, signal });
          const resData = res.data;
          if (!resData || typeof resData !== "string") {
            console.warn("Unexpected search response format from dooflix API");
            return [];
          }
          let data;
          try {
            const jsonStart = resData.indexOf("{");
            const jsonEnd = resData.lastIndexOf("}") + 1;
            if (jsonStart === -1 || jsonEnd <= jsonStart) {
              data = resData;
            } else {
              const jsonSubstring = resData.substring(jsonStart, jsonEnd);
              const parsedData = JSON.parse(jsonSubstring);
              data = (parsedData == null ? void 0 : parsedData.movie) ? parsedData : resData;
            }
          } catch (parseError) {
            console.error("Error parsing dooflix search response:", parseError);
            return [];
          }
          (_a = data == null ? void 0 : data.movie) == null ? void 0 : _a.forEach((result) => {
            const id = result == null ? void 0 : result.videos_id;
            if (!id) return;
            const link = `${baseUrl}/rest-api//v130/single_details?type=movie&id=${id}`;
            const thumbnailUrl = result == null ? void 0 : result.thumbnail_url;
            const image = (thumbnailUrl == null ? void 0 : thumbnailUrl.includes("https")) ? thumbnailUrl : thumbnailUrl == null ? void 0 : thumbnailUrl.replace("http", "https");
            catalog2.push({
              title: (result == null ? void 0 : result.title) || "",
              link,
              image
            });
          });
          (_b = data == null ? void 0 : data.tvseries) == null ? void 0 : _b.forEach((result) => {
            const id = result == null ? void 0 : result.videos_id;
            if (!id) return;
            const link = `${baseUrl}/rest-api//v130/single_details?type=tvseries&id=${id}`;
            const thumbnailUrl = result == null ? void 0 : result.thumbnail_url;
            const image = (thumbnailUrl == null ? void 0 : thumbnailUrl.includes("https")) ? thumbnailUrl : thumbnailUrl == null ? void 0 : thumbnailUrl.replace("http", "https");
            catalog2.push({
              title: (result == null ? void 0 : result.title) || "",
              link,
              image
            });
          });
          return catalog2;
        } catch (error) {
          console.error("dooflix search error:", error);
          return [];
        }
      });
    };
  }
});

// providers/dooflix/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var headers2, getMeta;
var init_meta = __esm({
  "providers/dooflix/meta.ts"() {
    "use strict";
    headers2 = {
      "Accept-Encoding": "gzip",
      "API-KEY": "2pm95lc6prpdbk0ppji9rsqo",
      Connection: "Keep-Alive",
      "If-Modified-Since": "Wed, 14 Aug 2024 13:00:04 GMT",
      "User-Agent": "okhttp/3.14.9"
    };
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b, _c, _d;
        try {
          const { axios } = providerContext;
          const res = yield axios.get(link, { headers: headers2 });
          const resData = res.data;
          const jsonStart = resData == null ? void 0 : resData.indexOf("{");
          const jsonEnd = (resData == null ? void 0 : resData.lastIndexOf("}")) + 1;
          const data = ((_a = JSON == null ? void 0 : JSON.parse(resData == null ? void 0 : resData.substring(jsonStart, jsonEnd))) == null ? void 0 : _a.title) ? JSON == null ? void 0 : JSON.parse(resData == null ? void 0 : resData.substring(jsonStart, jsonEnd)) : resData;
          const title = (data == null ? void 0 : data.title) || "";
          const synopsis = (data == null ? void 0 : data.description) || "";
          const image = (data == null ? void 0 : data.poster_url) || "";
          const cast = (data == null ? void 0 : data.cast) || [];
          const rating = (data == null ? void 0 : data.imdb_rating) || "";
          const type = Number(data == null ? void 0 : data.is_tvseries) ? "series" : "movie";
          const tags = ((_b = data == null ? void 0 : data.genre) == null ? void 0 : _b.map((genre) => genre == null ? void 0 : genre.name)) || [];
          const links = [];
          if (type === "series") {
            (_c = data == null ? void 0 : data.season) == null ? void 0 : _c.map((season) => {
              var _a2;
              const title2 = (season == null ? void 0 : season.seasons_name) || "";
              const directLinks = ((_a2 = season == null ? void 0 : season.episodes) == null ? void 0 : _a2.map((episode) => ({
                title: episode == null ? void 0 : episode.episodes_name,
                link: episode == null ? void 0 : episode.file_url
              }))) || [];
              links.push({
                title: title2,
                directLinks
              });
            });
          } else {
            (_d = data == null ? void 0 : data.videos) == null ? void 0 : _d.map((video) => {
              links.push({
                title: title + " " + (video == null ? void 0 : video.label),
                directLinks: [
                  {
                    title: "Play",
                    link: video == null ? void 0 : video.file_url
                  }
                ]
              });
            });
          }
          return {
            image: (image == null ? void 0 : image.includes("https")) ? image : image == null ? void 0 : image.replace("http", "https"),
            synopsis,
            title,
            rating,
            imdbId: "",
            cast,
            tags,
            type,
            linkList: links
          };
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

// providers/dooflix/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/dooflix/stream.ts"() {
    "use strict";
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link
      }) {
        try {
          const streams = [];
          const headers3 = {
            Connection: "Keep-Alive",
            "User-Agent": "Mozilla/5.0 (WindowsNT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.37",
            Referer: "https://molop.art/",
            Cookie: "cf_clearance=M2_2Hy4lKRy_ruRX3dzOgm3iho1FHe2DUC1lq28BUtI-1737377622-1.2.1.1-6R8RaH94._H2BuNuotsjTZ3fAF6cLwPII0guemu9A5Xa46lpCJPuELycojdREwoonYS2kRTYcZ9_1c4h4epi2LtDvMM9jIoOZKE9pIdWa30peM1hRMpvffTjGUCraHsJNCJez8S_QZ6XkkdP7GeQ5iwiYaI6Grp6qSJWoq0Hj8lS7EITZ1LzyrALI6iLlYjgLmgLGa1VuhORWJBN8ZxrJIZ_ba_pqbrR9fjnyToqxZ0XQaZfk1d3rZyNWoZUjI98GoAxVjnKtcBQQG6b2jYPJuMbbYraGoa54N7E7BR__7o"
          };
          const response = yield fetch(link, {
            redirect: "manual",
            headers: headers3
          });
          if (response.status >= 300 && response.status < 400) {
            const redirectLink = response.headers.get("Location");
            if (redirectLink) {
              link = redirectLink;
            }
          }
          if (response.url) {
            link = response.url;
          }
          streams.push({
            server: "Dooflix",
            link,
            headers: headers3,
            type: "m3u8"
          });
          console.log("doo streams", streams);
          return streams;
        } catch (err) {
          console.error(err);
          return [];
        }
      });
    };
  }
});

// providers/dooflix/dooflix.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
