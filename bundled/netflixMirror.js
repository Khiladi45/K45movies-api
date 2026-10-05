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

// providers/netflixMirror/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/netflixMirror/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Home",
        filter: "/mobile/home?app=1"
      },
      {
        title: "Series",
        filter: "/mobile/series"
      },
      {
        title: "Movies",
        filter: "/mobile/movies"
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

// providers/netflixMirror/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/netflixMirror/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        providerValue,
        signal,
        providerContext
      }) {
        try {
          const { cheerio } = providerContext;
          const baseUrl = yield getBaseUrl("nfMirror");
          const catalog2 = [];
          if (page > 1) {
            return [];
          }
          const isPrime = providerValue === "primeMirror" ? "isPrime=true" : "isPrime=false";
          const url = `https://netmirror.8man.dev/api/net-proxy?${isPrime}&url=${baseUrl + filter}`;
          const res = yield fetch(url, {
            signal,
            method: "GET",
            credentials: "omit"
          });
          const data = yield res.text();
          const $ = cheerio.load(data);
          $("a.post-data").map((i, element) => {
            const title = "";
            const id = $(element).attr("data-post");
            const image = $(element).find("img").attr("data-src") || "";
            if (id) {
              catalog2.push({
                title,
                link: baseUrl + `${providerValue === "netflixMirror" ? "/post.php?id=" : "/pv/post.php?id="}` + id + "&t=" + Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
                image
              });
            }
          });
          return catalog2;
        } catch (err) {
          console.error("nf error ", err);
          return [];
        }
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        providerValue,
        signal,
        providerContext
      }) {
        var _a;
        try {
          if (page > 1) {
            return [];
          }
          const catalog2 = [];
          const baseUrl = yield getBaseUrl("nfMirror");
          const isPrime = providerValue === "primeMirror" ? "isPrime=true" : "isPrime=false";
          const url = `https://netmirror.8man.dev/api/net-proxy?${isPrime}&url=${baseUrl}${providerValue === "netflixMirror" ? "" : "/pv"}/search.php?s=${encodeURI(searchQuery)}`;
          const res = yield fetch(url, {
            signal,
            method: "GET",
            credentials: "omit"
          });
          const data = yield res.json();
          (_a = data == null ? void 0 : data.searchResult) == null ? void 0 : _a.forEach((result) => {
            const title = (result == null ? void 0 : result.t) || "";
            const id = result == null ? void 0 : result.id;
            const image = providerValue === "netflixMirror" ? `https://imgcdn.media/poster/v/${id}.jpg` : "";
            if (id) {
              catalog2.push({
                title,
                link: baseUrl + `${providerValue === "netflixMirror" ? "/mobile/post.php?id=" : "/mobile/pv/post.php?id="}` + id + "&t=" + Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3),
                image
              });
            }
          });
          return catalog2;
        } catch (err) {
          console.error("Search error:", err);
          return [];
        }
      });
    };
  }
});

// providers/netflixMirror/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/netflixMirror/meta.ts"() {
    "use strict";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link
      }) {
        var _a, _b, _c, _d;
        let providerValue = "netflixMirror";
        try {
          const isPrime = providerValue === "primeMirror" ? "isPrime=true" : "isPrime=false";
          const url = `https://netmirror.8man.dev/api/net-proxy?${isPrime}&url=${encodeURIComponent(
            link
          )}`;
          console.log("nfifo", url);
          const res = yield fetch(url, {
            credentials: "omit"
          });
          const data = yield res.json();
          const id = (_a = link.split("id=")[1]) == null ? void 0 : _a.split("&")[0];
          const meta = {
            title: data.title,
            synopsis: data.desc,
            image: `https://img.nfmirrorcdn.top/poster/h/${id}.jpg`,
            cast: (_b = data == null ? void 0 : data.short_cast) == null ? void 0 : _b.split(","),
            tags: [data == null ? void 0 : data.year, data == null ? void 0 : data.hdsd, ...(_c = data == null ? void 0 : data.thismovieis) == null ? void 0 : _c.split(",")],
            imdbId: "",
            type: "series"
          };
          console.log("nfinfo", meta);
          const linkList = [];
          if (((_d = data == null ? void 0 : data.season) == null ? void 0 : _d.length) > 0) {
            data.season.map((season) => {
              linkList.push({
                title: "Season " + (season == null ? void 0 : season.s),
                episodesLink: season == null ? void 0 : season.id
              });
            });
          } else {
            linkList.push({
              title: meta.title,
              directLinks: [{ link: id, title: "Movie", type: "movie" }]
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
            type: "",
            linkList: []
          };
        }
      });
    };
  }
});

// providers/netflixMirror/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/netflixMirror/stream.ts"() {
    "use strict";
    init_getBaseUrl();
    getStream = (_0) => __async(null, [_0], function* ({
      link: id,
      providerContext
    }) {
      try {
        let providerValue = "netflixMirror";
        const baseUrl = yield getBaseUrl("nfMirror");
        console.log("nfGetStream, baseUrl:", baseUrl);
        const url = `https://netmirror.8man.dev/api/net-proxy?url=${baseUrl}${providerValue === "netflixMirror" ? "/mobile/playlist.php?id=" : "/pv/playlist.php?id="}${id}&t=${Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3)}`;
        console.log("nfGetStream, url:", url);
        const res = yield fetch(url, {
          credentials: "omit"
        });
        const resJson = yield res.json();
        const data = resJson == null ? void 0 : resJson[0];
        const streamLinks = [];
        data == null ? void 0 : data.sources.forEach((source) => {
          var _a;
          streamLinks.push({
            server: source.label,
            link: ((_a = source.file) == null ? void 0 : _a.startsWith("http")) ? source.file : `${baseUrl}${source.file}`,
            type: "m3u8",
            headers: {
              Referer: baseUrl,
              origin: baseUrl,
              Cookie: "hd=on"
            }
          });
        });
        console.log(streamLinks);
        return streamLinks;
      } catch (err) {
        console.error(err);
        return [];
      }
    });
  }
});

// providers/netflixMirror/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/netflixMirror/episodes.ts"() {
    "use strict";
    init_getBaseUrl();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url: link,
        providerContext
      }) {
        var _a;
        const { axios } = providerContext;
        let providerValue = "netflixMirror";
        try {
          const baseUrl = yield getBaseUrl("nfMirror");
          const url = `${baseUrl}${providerValue === "netflixMirror" ? "/episodes.php?s=" : "/pv/episodes.php?s="}` + link + "&t=" + Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3);
          console.log("nfEpisodesUrl", url);
          let page = 1;
          let hasMorePages = true;
          const episodeList = [];
          while (hasMorePages) {
            const res = yield axios.get(url + `&page=${page}`, {
              headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9"
              }
            });
            const data = res.data;
            (_a = data == null ? void 0 : data.episodes) == null ? void 0 : _a.map((episode) => {
              episodeList.push({
                title: "Episode " + (episode == null ? void 0 : episode.ep.replace("E", "")),
                link: episode == null ? void 0 : episode.id
              });
            });
            if (data == null ? void 0 : data.nextPageShow) {
              page++;
            } else {
              hasMorePages = false;
            }
          }
          return episodeList.sort((a, b) => {
            const aNum = parseInt(a.title.replace("Episode ", ""));
            const bNum = parseInt(b.title.replace("Episode ", ""));
            return aNum - bNum;
          });
        } catch (err) {
          console.error("nfGetEpisodes error", err);
          return [];
        }
      });
    };
  }
});

// providers/netflixMirror/netflixMirror.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
