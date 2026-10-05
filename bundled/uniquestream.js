var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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

// providers/uniquestream/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/uniquestream/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "New",
        filter: "new"
      },
      {
        title: "Trending",
        filter: "trending"
      },
      {
        title: "Popular",
        filter: "popular"
      }
    ];
    genres = [];
  }
});

// providers/uniquestream/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/uniquestream/posts.ts"() {
    "use strict";
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        var _a;
        const { axios, commonHeaders } = providerContext;
        const baseUrl = "https://anime.uniquestream.net";
        const url = `${baseUrl}/api/v1/videos/${filter}?page=${page}&limit=20&type=all`;
        try {
          const res = yield axios.get(url, { headers: commonHeaders, signal });
          const data = Array.isArray(res.data) ? res.data : ((_a = res.data) == null ? void 0 : _a.data) || [];
          return data.map((item) => ({
            title: item.title,
            link: `https://anime.uniquestream.net/api/v1/series/${item.content_id}`,
            image: item.image || ""
          }));
        } catch (error) {
          console.error("uniquestream getPosts failed", error);
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
        var _a, _b;
        if (page > 1) {
          return [];
        }
        const { axios, commonHeaders } = providerContext;
        const baseUrl = "https://anime.uniquestream.net";
        const url = `${baseUrl}/api/v1/search?q=${encodeURIComponent(searchQuery)}`;
        try {
          const res = yield axios.get(url, { headers: commonHeaders, signal });
          const series = ((_a = res.data) == null ? void 0 : _a.series) || [];
          const movies = ((_b = res.data) == null ? void 0 : _b.movies) || [];
          const combined = [...series, ...movies];
          return combined.map((item) => ({
            title: item.title,
            link: `https://anime.uniquestream.net/api/v1/series/${item.content_id}`,
            image: item.image || ""
          }));
        } catch (error) {
          console.error("uniquestream getSearchPosts failed", error);
          return [];
        }
      });
    };
  }
});

// providers/uniquestream/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/uniquestream/meta.ts"() {
    "use strict";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        const { axios, commonHeaders } = providerContext;
        try {
          const res = yield axios.get(link, { headers: commonHeaders });
          const data = res.data;
          const series = data.content_id ? data : data.data || data;
          const linkList = [];
          if (series.seasons && series.seasons.length > 0) {
            for (const season of series.seasons) {
              linkList.push({
                title: season.title || `Season ${season.season_number || ""}`.trim(),
                episodesLink: `https://anime.uniquestream.net/api/v1/season/${season.content_id}/episodes?page=1&limit=100&order_by=asc`
              });
            }
          } else {
            linkList.push({
              title: "Episodes",
              episodesLink: `https://anime.uniquestream.net/api/v1/season/${series.content_id}/episodes?page=1&limit=100&order_by=asc`
            });
          }
          let imageUrl = series.image || "";
          if (series.images && Array.isArray(series.images)) {
            const widePoster = series.images.find((img) => img.type === "poster_wide");
            if (widePoster && widePoster.url) {
              imageUrl = widePoster.url;
            }
          }
          return {
            title: series.title || "",
            image: imageUrl,
            synopsis: series.description || "",
            imdbId: "",
            type: "series",
            tags: series.genre || [],
            rating: series.rating_avg ? String(series.rating_avg) : "",
            linkList
          };
        } catch (error) {
          console.error("uniquestream getMeta failed", error);
          return {
            title: "",
            image: "",
            synopsis: "",
            imdbId: "",
            type: "series",
            linkList: []
          };
        }
      });
    };
  }
});

// providers/uniquestream/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/uniquestream/stream.ts"() {
    "use strict";
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a;
        const { axios, commonHeaders } = providerContext;
        const streams = [];
        try {
          const res = yield axios.get(link, { headers: commonHeaders });
          const data = res.data;
          if (!data) return streams;
          let softSubtitles = [];
          if (data.hls && Array.isArray(data.hls.subtitles)) {
            softSubtitles = data.hls.subtitles.map((sub) => ({
              language: sub.locale || "unknown",
              url: sub.url || sub.file || sub.link || ""
            })).filter((sub) => sub.url);
          }
          if (data.hls) {
            if (data.hls.playlist) {
              streams.push(__spreadValues({
                server: `uniquestream (RAW - ${data.hls.locale || "unknown"})`,
                link: data.hls.playlist,
                type: "m3u8"
              }, softSubtitles.length > 0 && { subtitles: softSubtitles }));
            }
            if (data.hls.hard_subs && Array.isArray(data.hls.hard_subs)) {
              data.hls.hard_subs.forEach((sub) => {
                if (sub.locale === "en-US") {
                  streams.push({
                    server: `uniquestream (Sub - ${sub.locale})`,
                    link: sub.playlist,
                    type: "m3u8"
                  });
                }
              });
            }
          }
          if (data.versions && data.versions.hls && Array.isArray(data.versions.hls)) {
            data.versions.hls.forEach((version) => {
              if (version.playlist && version.locale === "en-US") {
                streams.push({
                  server: `uniquestream (Dub - ${version.locale})`,
                  link: version.playlist,
                  type: "m3u8"
                });
              }
            });
          }
          if (streams.length === 1 && streams[0].server.includes("RAW")) {
            if (((_a = data.hls) == null ? void 0 : _a.hard_subs) && Array.isArray(data.hls.hard_subs)) {
              data.hls.hard_subs.forEach((sub) => {
                if (sub.locale !== "en-US") {
                  streams.push({
                    server: `uniquestream (Sub - ${sub.locale})`,
                    link: sub.playlist,
                    type: "m3u8"
                  });
                }
              });
            }
          }
          console.log("streams", streams);
          return streams;
        } catch (error) {
          console.error("uniquestream getStream failed", error);
          return [];
        }
      });
    };
  }
});

// providers/uniquestream/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/uniquestream/episodes.ts"() {
    "use strict";
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        var _a;
        const { axios, commonHeaders } = providerContext;
        try {
          let allEpisodes = [];
          let page = 1;
          let hasMore = true;
          while (hasMore) {
            const pageUrl = url.replace(/page=\d+/, `page=${page}`).replace(/limit=\d+/, `limit=20`);
            const res = yield axios.get(pageUrl, { headers: commonHeaders });
            const data = Array.isArray(res.data) ? res.data : ((_a = res.data) == null ? void 0 : _a.data) || [];
            if (data.length > 0) {
              allEpisodes = allEpisodes.concat(data);
              page++;
              if (data.length < 20) {
                hasMore = false;
              }
            } else {
              hasMore = false;
            }
          }
          return allEpisodes.map((item) => ({
            title: item.title || `Episode ${item.episode_number}`,
            link: `https://anime.uniquestream.net/api/v1/episode/${item.content_id}/media/dash/ja-JP`
          }));
        } catch (error) {
          console.error("uniquestream getEpisodes failed", error);
          return [];
        }
      });
    };
  }
});

// providers/uniquestream/uniquestream.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
