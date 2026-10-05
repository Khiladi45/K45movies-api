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

// providers/vadapav/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/vadapav/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Movies",
        filter: "/608c853f-704e-48f0-b785-4ae1f48ea70d"
      },
      {
        title: "Tv Shows",
        filter: "/72983eef-a12f-4be4-99a7-e8f6afa568c1"
      },
      {
        title: "Anime",
        filter: "/36abf81c-1032-4fbf-9a55-347a05ce2ca3"
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

// providers/vadapav/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0) {
  return __async(this, arguments, function* ({
    // baseUrl,
    url,
    signal,
    axios,
    cheerio
  }) {
    try {
      const res = yield axios.get(url, { signal });
      const data = res.data;
      const $ = cheerio.load(data);
      const catalog2 = [];
      $('.directory-entry:not(:contains("Parent Directory"))').map(
        (i, element) => {
          var _a;
          const title = $(element).text();
          const link = $(element).attr("href");
          const imageTitle = (title == null ? void 0 : title.length) > 30 ? (_a = title == null ? void 0 : title.slice(0, 30)) == null ? void 0 : _a.replace(/\./g, " ") : title == null ? void 0 : title.replace(/\./g, " ");
          const image = `https://placehold.jp/23/000000/ffffff/200x400.png?text=${encodeURIComponent(
            imageTitle
          )}&css=%7B%22background%22%3A%22%20-webkit-gradient(linear%2C%20left%20bottom%2C%20left%20top%2C%20from(%233f3b3b)%2C%20to(%23000000))%22%2C%22text-transform%22%3A%22%20capitalize%22%7D`;
          if (title && link) {
            catalog2.push({
              title,
              link,
              image
            });
          }
        }
      );
      return catalog2;
    } catch (err) {
      return [];
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/vadapav/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        // providerValue,
        signal,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("vadapav");
        if (page > 1) {
          return [];
        }
        const url = `${baseUrl + filter}`;
        return posts({ baseUrl, url, signal, axios, cheerio });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        // providerValue,
        signal,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("vadapav");
        if (page > 1) {
          return [];
        }
        const url = `${baseUrl}/s/${searchQuery}`;
        return posts({ baseUrl, url, signal, axios, cheerio });
      });
    };
  }
});

// providers/vadapav/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/vadapav/meta.ts"() {
    "use strict";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b;
        try {
          const { axios, cheerio } = providerContext;
          const baseUrl = link == null ? void 0 : link.split("/").slice(0, 3).join("/");
          const url = link;
          const res = yield axios.get(url);
          const data = res.data;
          const $ = cheerio.load(data);
          const title = ((_b = (_a = $(".directory").children().first().text().trim()) == null ? void 0 : _a.split("/").pop()) == null ? void 0 : _b.trim()) || "";
          const links = [];
          $('.directory-entry:not(:contains("Parent Directory"))').map(
            (i, element) => {
              const link2 = $(element).attr("href");
              if (link2) {
                links.push({
                  episodesLink: baseUrl + link2,
                  title: $(element).text()
                });
              }
            }
          );
          const directLinks = [];
          $('.file-entry:not(:contains("Parent Directory"))').map((i, element) => {
            var _a2, _b2;
            const link2 = $(element).attr("href");
            if (link2 && (((_a2 = $(element).text()) == null ? void 0 : _a2.includes(".mp4")) || ((_b2 = $(element).text()) == null ? void 0 : _b2.includes(".mkv")))) {
              directLinks.push({
                title: i + 1 + ". " + $(element).text(),
                link: baseUrl + link2
              });
            }
          });
          if (directLinks.length > 0) {
            links.push({
              title: title + " DL",
              directLinks
            });
          }
          return {
            title,
            synopsis: "",
            image: "",
            imdbId: "",
            type: "movie",
            linkList: links
          };
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

// providers/vadapav/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/vadapav/stream.ts"() {
    "use strict";
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: url
        // type, // providerContext,
      }) {
        try {
          const stream = [];
          stream.push({
            server: "vadapav",
            link: url,
            type: (url == null ? void 0 : url.split(".").pop()) || "mkv"
          });
          return stream;
        } catch (err) {
          return [];
        }
      });
    };
  }
});

// providers/vadapav/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/vadapav/episodes.ts"() {
    "use strict";
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        try {
          const baseUrl = url == null ? void 0 : url.split("/").slice(0, 3).join("/");
          const res = yield axios.get(url);
          const html = res.data;
          let $ = cheerio.load(html);
          const episodeLinks = [];
          $('.file-entry:not(:contains("Parent Directory"))').map((i, element) => {
            var _a, _b, _c, _d, _e, _f;
            const link = $(element).attr("href");
            if (link && (((_a = $(element).text()) == null ? void 0 : _a.includes(".mp4")) || ((_b = $(element).text()) == null ? void 0 : _b.includes(".mkv")))) {
              episodeLinks.push({
                title: ((_e = (_d = (_c = $(element).text()) == null ? void 0 : _c.match(/E\d+/)) == null ? void 0 : _d[0]) == null ? void 0 : _e.replace("E", "Episode ")) || i + 1 + ". " + ((_f = $(element).text()) == null ? void 0 : _f.replace(".mkv", "")),
                link: baseUrl + link
              });
            }
          });
          return episodeLinks;
        } catch (err) {
          return [];
        }
      });
    };
  }
});

// providers/vadapav/vadapav.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
