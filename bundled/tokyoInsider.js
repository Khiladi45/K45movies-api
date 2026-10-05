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

// providers/tokyoInsider/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/tokyoInsider/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Top Anime",
        filter: "anime/search?r=5"
      },
      {
        title: "Popular Anime",
        filter: "anime/"
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

// providers/tokyoInsider/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0) {
  return __async(this, arguments, function* ({
    baseURL,
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
      $('td.c_h2[width="40"]').map((i, element) => {
        var _a;
        const image = (_a = $(element).find(".a_img").attr("src")) == null ? void 0 : _a.replace("small", "default");
        const title = $(element).find("a").attr("title");
        const link = baseURL + $(element).find("a").attr("href");
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
      return [];
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/tokyoInsider/posts.ts"() {
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
        const baseURL = yield getBaseUrl("tokyoinsider");
        const start = page < 2 ? 0 : (page - 1) * 20;
        const url = `${baseURL}/${filter}&start=${start}`;
        return posts({ baseURL, url, signal, axios, cheerio });
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
        const baseURL = yield getBaseUrl("tokyoinsider");
        const start = page < 2 ? 0 : (page - 1) * 20;
        const url = `${baseURL}/anime/search?k=${searchQuery}&start=${start}`;
        return posts({ baseURL, url, signal, axios, cheerio });
      });
    };
  }
});

// providers/tokyoInsider/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/tokyoInsider/meta.ts"() {
    "use strict";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        try {
          const { cheerio } = providerContext;
          const url = link;
          const res = yield fetch(url);
          const data = yield res.text();
          const $ = cheerio.load(data);
          const meta = {
            title: $('.c_h2:contains("Title(s):")').text().replace("Title(s):", "").trim().split("\n")[0],
            synopsis: $('.c_h2b:contains("Summary:"),.c_h2:contains("Summary:")').text().replace("Summary:", "").trim(),
            image: $(".a_img").attr("src") || "",
            imdbId: "",
            type: "series"
          };
          const episodesList = [];
          $(".episode").map((i, element) => {
            const link2 = "https://www.tokyoinsider.com" + $(element).find("a").attr("href") || $(".download-link").attr("href");
            let title = $(element).find("a").find("em").text() + " " + $(element).find("a").find("strong").text();
            if (!title.trim()) {
              title = $(".download-link").text();
            }
            if (link2 && title.trim()) {
              episodesList.push({ title, link: link2 });
            }
          });
          return __spreadProps(__spreadValues({}, meta), {
            linkList: [
              {
                title: meta.title,
                directLinks: episodesList
              }
            ]
          });
        } catch (err) {
          return {
            title: "",
            synopsis: "",
            image: "",
            imdbId: "",
            type: "series",
            linkList: []
          };
        }
      });
    };
  }
});

// providers/tokyoInsider/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/tokyoInsider/stream.ts"() {
    "use strict";
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        try {
          const { cheerio } = providerContext;
          const url = link;
          const res = yield fetch(url);
          const data = yield res.text();
          const $ = cheerio.load(data);
          const streamLinks = [];
          $(".c_h1,.c_h2").map((i, element) => {
            $(element).find("span").remove();
            const title = $(element).find("a").text() || "";
            const link2 = $(element).find("a").attr("href") || "";
            if (title && link2.includes("media")) {
              streamLinks.push({
                server: title,
                link: link2,
                type: link2.split(".").pop() || "mkv"
              });
            }
          });
          return streamLinks;
        } catch (err) {
          return [];
        }
      });
    };
  }
});

// providers/tokyoInsider/tokyoInsider.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
