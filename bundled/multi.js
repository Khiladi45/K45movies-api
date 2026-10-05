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

// providers/multi/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/multi/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Trending",
        filter: "/trending/"
      },
      {
        title: "Netflix",
        filter: "/genre/netflix/"
      },
      {
        title: "Amazon Prime",
        filter: "/genre/amazon-prime/"
      },
      {
        title: "Disney Hotstar",
        filter: "/genre/disney-hotstar/"
      }
    ];
    genres = [
      {
        title: "Action",
        filter: "/genre/action/"
      },
      {
        title: "Adventure",
        filter: "/genre/adventure/"
      },
      {
        title: "Animation",
        filter: "/genre/animation/"
      },
      {
        title: "Comedy",
        filter: "/genre/comedy/"
      },
      {
        title: "Crime",
        filter: "/genre/crime/"
      },
      {
        title: "Drama",
        filter: "/genre/drama/"
      },
      {
        title: "Family",
        filter: "/genre/family/"
      },
      {
        title: "Fantasy",
        filter: "/genre/fantasy/"
      },
      {
        title: "History",
        filter: "/genre/history/"
      },
      {
        title: "Horror",
        filter: "/genre/horror/"
      },
      {
        title: "Mystery",
        filter: "/genre/mystery/"
      },
      {
        title: "Romance",
        filter: "/genre/romance/"
      },
      {
        title: "Science Fiction",
        filter: "/genre/science-fiction/"
      },
      {
        title: "Thriller",
        filter: "/genre/thriller/"
      }
    ];
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

// providers/multi/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0) {
  return __async(this, arguments, function* ({
    url,
    signal,
    cheerio
  }) {
    try {
      const res = yield fetch(url, { signal });
      const data = yield res.text();
      const $ = cheerio.load(data);
      const catalog2 = [];
      $(".items.full,.result-item").children().map((i, element) => {
        console.log("multiGetPosts element", element);
        const title = $(element).find(".poster,.image").find("img").attr("alt");
        const link = $(element).find(".poster,.image").find("a").attr("href");
        const image = $(element).find(".poster,.image").find("img").attr("data-src") || $(element).find(".poster,.image").find("img").attr("src");
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
      console.error("multiGetPosts error ", err);
      return [];
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/multi/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const { cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("multi");
        const url = `${baseUrl + filter}page/${page}/`;
        return posts({ url, signal, cheerio });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        signal,
        providerContext
      }) {
        const { cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("multi");
        const url = `${baseUrl}/?s=${searchQuery}`;
        console.log("multiGetPosts url", url);
        return posts({ url, signal, cheerio });
      });
    };
  }
});

// providers/multi/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/multi/meta.ts"() {
    "use strict";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        try {
          const { axios, cheerio } = providerContext;
          const url = link;
          const res = yield axios.get(url);
          const data = res.data;
          const $ = cheerio.load(data);
          const type = url.includes("tvshows") ? "series" : "movie";
          const imdbId = "";
          const title = url.split("/")[4].replace(/-/g, " ");
          const image = $(".g-item").find("a").attr("href") || "";
          const synopsis = $(".wp-content").find("p").text() || "";
          const links = [];
          if (type === "series") {
            $("#seasons").children().map((i, element) => {
              const title2 = $(element).find(".title").children().remove().end().text();
              let episodesList = [];
              $(element).find(".episodios").children().map((i2, element2) => {
                const title3 = "Episode" + $(element2).find(".numerando").text().trim().split("-")[1];
                const link2 = $(element2).find("a").attr("href");
                if (title3 && link2) {
                  episodesList.push({ title: title3, link: link2 });
                }
              });
              if (title2 && episodesList.length > 0) {
                links.push({
                  title: title2,
                  directLinks: episodesList
                });
              }
            });
          } else {
            links.push({
              title,
              directLinks: [{ title, link: url.slice(0, -1), type: "movie" }]
            });
          }
          return {
            title,
            synopsis,
            image,
            imdbId,
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

// providers/multi/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/multi/stream.ts"() {
    "use strict";
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: url,
        providerContext
      }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
        const { axios, cheerio } = providerContext;
        const headers = {
          "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          Referer: "https://multimovies.online/",
          "Sec-Fetch-User": "?1",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
        };
        try {
          const res = yield axios.get(url, { headers });
          const html = res.data;
          const $ = cheerio.load(html);
          const streamLinks = [];
          const postId = $("#player-option-1").attr("data-post");
          const nume = $("#player-option-1").attr("data-nume");
          const typeValue = $("#player-option-1").attr("data-type");
          const baseUrl = url.split("/").slice(0, 3).join("/");
          console.log("baseUrl", baseUrl);
          const formData = new FormData();
          formData.append("action", "doo_player_ajax");
          formData.append("post", postId || "");
          formData.append("nume", nume || "");
          formData.append("type", typeValue || "");
          console.log("formData", formData);
          const playerRes = yield fetch(`${baseUrl}/wp-admin/admin-ajax.php`, {
            headers,
            body: formData,
            method: "POST"
          });
          const playerData = yield playerRes.json();
          console.log("playerData", playerData);
          let ifameUrl = ((_b = (_a = playerData == null ? void 0 : playerData.embed_url) == null ? void 0 : _a.match(/<iframe[^>]+src="([^"]+)"[^>]*>/i)) == null ? void 0 : _b[1]) || (playerData == null ? void 0 : playerData.embed_url);
          console.log("ifameUrl", ifameUrl);
          if (!ifameUrl.includes("multimovies")) {
            let playerBaseUrl = ifameUrl.split("/").slice(0, 3).join("/");
            const newPlayerBaseUrl = yield axios.head(playerBaseUrl, { headers });
            if ((_c = newPlayerBaseUrl == null ? void 0 : newPlayerBaseUrl.request) == null ? void 0 : _c.responseURL) {
              playerBaseUrl = (_e = (_d = newPlayerBaseUrl.request) == null ? void 0 : _d.responseURL) == null ? void 0 : _e.split("/").slice(0, 3).join("/");
            }
            if (!((_f = newPlayerBaseUrl == null ? void 0 : newPlayerBaseUrl.request) == null ? void 0 : _f.responseURL)) {
              playerBaseUrl = (_g = (yield axios.head(playerBaseUrl, {
                headers,
                maxRedirects: 0,
                // Don't follow redirects
                validateStatus: (status) => status >= 200 && status < 400
              })).headers) == null ? void 0 : _g.location;
            }
            const playerId = ifameUrl.split("/").pop();
            const NewformData = new FormData();
            NewformData.append("sid", playerId);
            console.log(
              "NewformData",
              playerBaseUrl + "/embedhelper.php",
              NewformData
            );
            const playerRes2 = yield fetch(`${playerBaseUrl}/embedhelper.php`, {
              headers,
              body: NewformData,
              method: "POST"
            });
            const playerData2 = yield playerRes2.json();
            const siteUrl = (_h = playerData2 == null ? void 0 : playerData2.siteUrls) == null ? void 0 : _h.smwh;
            const siteId = ((_i = JSON.parse(atob(playerData2 == null ? void 0 : playerData2.mresult))) == null ? void 0 : _i.smwh) || ((_j = playerData2 == null ? void 0 : playerData2.mresult) == null ? void 0 : _j.smwh);
            const newIframeUrl = siteUrl + siteId;
            console.log("newIframeUrl", newIframeUrl);
            if (newIframeUrl) {
              ifameUrl = newIframeUrl;
            }
          }
          const iframeRes = yield axios.get(ifameUrl, {
            headers: __spreadProps(__spreadValues({}, headers), {
              Referer: url
            })
          });
          const iframeData = iframeRes.data;
          var functionRegex = /eval\(function\((.*?)\)\{.*?return p\}.*?\('(.*?)'\.split/;
          var match = functionRegex.exec(iframeData);
          let p = "";
          if (match) {
            var encodedString = match[2];
            p = (_k = encodedString.split("',36,")) == null ? void 0 : _k[0].trim();
            let a = 36;
            let c = encodedString.split("',36,")[1].slice(2).split("|").length;
            let k = encodedString.split("',36,")[1].slice(2).split("|");
            while (c--) {
              if (k[c]) {
                var regex = new RegExp("\\b" + c.toString(a) + "\\b", "g");
                p = p.replace(regex, k[c]);
              }
            }
          } else {
            console.log("No match found");
          }
          const streamUrl = (_l = p == null ? void 0 : p.match(/https?:\/\/[^"]+?\.m3u8[^"]*/)) == null ? void 0 : _l[0];
          const subtitles = [];
          const subtitleMatch = p == null ? void 0 : p.match(/https:\/\/[^\s"]+\.vtt/g);
          if (subtitleMatch == null ? void 0 : subtitleMatch.length) {
            subtitleMatch.forEach((sub) => {
              const lang = sub.match(/_([a-zA-Z]{3})\.vtt$/)[1];
              subtitles.push({
                language: lang,
                uri: sub,
                type: "text/vtt",
                title: lang
              });
            });
          }
          console.log("streamUrl", streamUrl);
          console.log("newUrl", streamUrl == null ? void 0 : streamUrl.replace(/&i=\d+,'\.4&/, "&i=0.4&"));
          if (streamUrl) {
            streamLinks.push({
              server: "Multi",
              link: streamUrl.replace(/&i=\d+,'\.4&/, "&i=0.4&"),
              type: "m3u8",
              subtitles: []
            });
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

// providers/multi/multi.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
