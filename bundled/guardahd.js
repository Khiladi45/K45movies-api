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

// providers/guardahd/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/guardahd/catalog.ts"() {
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

// providers/guardahd/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/guardahd/posts.ts"() {
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

// providers/guardahd/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/guardahd/meta.ts"() {
    "use strict";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
        const axios = providerContext.axios;
        try {
          console.log("all", link);
          const res = yield axios.get(link);
          const data = res.data;
          const meta = {
            title: ((_a = data == null ? void 0 : data.meta) == null ? void 0 : _a.name) || "",
            synopsis: ((_b = data == null ? void 0 : data.meta) == null ? void 0 : _b.description) || "",
            image: ((_c = data == null ? void 0 : data.meta) == null ? void 0 : _c.background) || "",
            imdbId: ((_d = data == null ? void 0 : data.meta) == null ? void 0 : _d.imdb_id) || "",
            tmdbId: ((_f = (_e = data == null ? void 0 : data.meta) == null ? void 0 : _e.moviedb_id) == null ? void 0 : _f.toString()) || void 0,
            type: ((_g = data == null ? void 0 : data.meta) == null ? void 0 : _g.type) || "movie"
          };
          const links = [];
          let directLinks = [];
          let season = /* @__PURE__ */ new Map();
          if (meta.type === "series") {
            (_i = (_h = data == null ? void 0 : data.meta) == null ? void 0 : _h.videos) == null ? void 0 : _i.map((video) => {
              var _a2, _b2, _c2;
              if ((video == null ? void 0 : video.season) <= 0) return;
              if (!season.has(video == null ? void 0 : video.season)) {
                season.set(video == null ? void 0 : video.season, []);
              }
              season.get(video == null ? void 0 : video.season).push({
                title: "Episode " + (video == null ? void 0 : video.episode),
                type: "series",
                link: `${(_a2 = data == null ? void 0 : data.meta) == null ? void 0 : _a2.imdb_id}-${(_b2 = video == null ? void 0 : video.id) == null ? void 0 : _b2.split(":")[1]}-${(_c2 = video == null ? void 0 : video.id) == null ? void 0 : _c2.split(":")[2]}`
              });
            });
            const keys = Array.from(season.keys());
            keys.sort();
            keys.map((key) => {
              directLinks = season.get(key);
              links.push({
                title: `Season ${key}`,
                directLinks
              });
            });
          } else {
            links.push({
              title: (_j = data == null ? void 0 : data.meta) == null ? void 0 : _j.name,
              directLinks: [
                {
                  title: "Movie",
                  type: "movie",
                  link: `${(_k = data == null ? void 0 : data.meta) == null ? void 0 : _k.imdb_id}-`
                }
              ]
            });
          }
          return __spreadProps(__spreadValues({}, meta), {
            linkList: links
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

// providers/extractors/supeVideo.ts
function superVideoExtractor(data) {
  return __async(this, null, function* () {
    var _a, _b;
    try {
      var functionRegex = /eval\(function\((.*?)\)\{.*?return p\}.*?\('(.*?)'\.split/;
      var match = functionRegex.exec(data);
      let p = "";
      if (match) {
        var encodedString = match[2];
        p = (_a = encodedString.split("',36,")) == null ? void 0 : _a[0].trim();
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
      const streamUrl = (_b = p == null ? void 0 : p.match(/file:\s*"([^"]+\.m3u8[^"]*)"/)) == null ? void 0 : _b[1];
      console.log("streamUrl:", streamUrl);
      return streamUrl || "";
    } catch (err) {
      console.error("SuperVideoExtractor Error:", err);
      return "";
    }
  });
}
var init_supeVideo = __esm({
  "providers/extractors/supeVideo.ts"() {
    "use strict";
  }
});

// providers/guardahd/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/guardahd/stream.ts"() {
    "use strict";
    init_supeVideo();
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: id,
        type,
        providerContext
      }) {
        try {
          const { axios, cheerio, commonHeaders } = providerContext;
          function ExtractGuardahd(_02) {
            return __async(this, arguments, function* ({
              imdb
              // type, // season,
            }) {
              try {
                const baseUrl = "https://guardahd.stream";
                const path = "/set-movie-a/" + imdb;
                const url = baseUrl + path;
                console.log("url:", url);
                const res = yield axios.get(url, { timeout: 4e3 });
                const html = res.data;
                const $ = cheerio.load(html);
                const superVideoUrl = $('li:contains("supervideo")').attr("data-link");
                console.log("superVideoUrl:", superVideoUrl);
                if (!superVideoUrl) {
                  return null;
                }
                const controller2 = new AbortController();
                const signal2 = controller2.signal;
                setTimeout(() => controller2.abort(), 4e3);
                const res2 = yield fetch("https:" + superVideoUrl, {
                  signal: signal2,
                  headers: __spreadValues({}, commonHeaders)
                });
                const data = yield res2.text();
                console.log("mostraguarda data:", data);
                const streamUrl = yield superVideoExtractor(data);
                console.log("superStreamUrl:", streamUrl);
                return streamUrl;
              } catch (err) {
                console.error("Error in GetMostraguardaStram:", err);
              }
            });
          }
          function GetMostraguardaStream(_02) {
            return __async(this, arguments, function* ({
              imdb,
              type: type2,
              season: season2,
              episode: episode2
            }) {
              try {
                const baseUrl = "https://mostraguarda.stream";
                const path = type2 === "tv" ? `/serie/${imdb}/${season2}/${episode2}` : `/movie/${imdb}`;
                const url = baseUrl + path;
                console.log("url:", url);
                const res = yield axios(url, { timeout: 4e3 });
                const html = res.data;
                const $ = cheerio.load(html);
                const superVideoUrl = $('li:contains("supervideo")').attr("data-link");
                if (!superVideoUrl) {
                  return null;
                }
                const controller2 = new AbortController();
                const signal2 = controller2.signal;
                setTimeout(() => controller2.abort(), 4e3);
                const res2 = yield fetch("https:" + superVideoUrl, {
                  signal: signal2,
                  headers: __spreadValues({}, commonHeaders)
                });
                const data = yield res2.text();
                const streamUrl = yield superVideoExtractor(data);
                return streamUrl;
              } catch (err) {
                console.error("Error in GetMostraguardaStram:", err);
              }
            });
          }
          console.log(id);
          const streams = [];
          const [imdbId, season, episode] = id.split("-");
          console.log("Parsed ID:", { imdbId, season, episode });
          console.log("imdbId:", imdbId);
          const mostraguardaStream = yield GetMostraguardaStream({
            imdb: imdbId,
            type,
            season,
            episode
          });
          if (mostraguardaStream) {
            streams.push({
              server: "Supervideo 1",
              link: mostraguardaStream,
              type: "m3u8"
            });
          }
          const guardahdStream = yield ExtractGuardahd({
            imdb: imdbId,
            type,
            season,
            episode
          });
          if (guardahdStream) {
            streams.push({
              server: "Supervideo 2",
              link: guardahdStream,
              type: "m3u8"
            });
          }
          return streams;
        } catch (err) {
          console.error(err);
          return [];
        }
      });
    };
  }
});

// providers/guardahd/guardahd.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
