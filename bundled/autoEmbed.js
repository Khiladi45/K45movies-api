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

// providers/autoEmbed/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/autoEmbed/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Popular Movies",
        filter: "/top/catalog/movie/top.json"
      },
      {
        title: "Popular TV Shows",
        filter: "/top/catalog/series/top.json"
      },
      {
        title: "Featured Movies",
        filter: "/imdbRating/catalog/movie/imdbRating.json"
      },
      {
        title: "Featured TV Shows",
        filter: "/imdbRating/catalog/series/imdbRating.json"
      }
    ];
    genres = [];
  }
});

// providers/autoEmbed/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/autoEmbed/posts.ts"() {
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
        // providerValue,
        signal,
        providerContext
      }) {
        try {
          if (page > 1) {
            return [];
          }
          const catalog2 = [];
          const url1 = `https://v3-cinemeta.strem.io/catalog/series/top/search=${encodeURI(
            searchQuery
          )}.json`;
          const url2 = `https://v3-cinemeta.strem.io/catalog/movie/top/search=${encodeURI(
            searchQuery
          )}.json`;
          const res = yield providerContext.axios.get(url1, {
            headers: providerContext.commonHeaders,
            signal
          });
          const data = res.data;
          data == null ? void 0 : data.metas.map((result) => {
            const title = result.name || "";
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
          const res2 = yield providerContext.axios.get(url2, {
            headers: providerContext.commonHeaders,
            signal
          });
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

// providers/getCinemetaMeta.ts
function isCinemetaPromise(value) {
  return typeof value.then === "function";
}
function getCache() {
  const state = typeof providerGlobal !== "undefined" && providerGlobal ? providerGlobal : globalThis;
  if (!state.__vegaCinemetaCache__ || typeof state.__vegaCinemetaCache__ !== "object") {
    state.__vegaCinemetaCache__ = /* @__PURE__ */ Object.create(null);
  }
  return state.__vegaCinemetaCache__;
}
function getCinemetaMeta(imdbId, type, providerContext) {
  if (!/^tt\d+$/.test(imdbId)) {
    return Promise.reject(new Error(`Invalid IMDb ID: ${imdbId}`));
  }
  const cache = getCache();
  const cached = cache[imdbId];
  if (cached) {
    if (isCinemetaPromise(cached)) {
      return cached;
    }
    if (cached.name && cached.imdb_id === imdbId) {
      return Promise.resolve(cached);
    }
    delete cache[imdbId];
  }
  const mediaType = type === "series" ? "series" : "movie";
  const url = `${CINEMETA_BASE_URL}/${mediaType}/${imdbId}.json`;
  const request = providerContext.axios.get(url).then((response) => {
    var _a;
    const meta = (_a = response.data) == null ? void 0 : _a.meta;
    if (!(meta == null ? void 0 : meta.name) || meta.imdb_id !== imdbId) {
      throw new Error(`Cinemeta returned invalid metadata for ${imdbId}`);
    }
    cache[imdbId] = meta;
    return meta;
  }).catch((error) => {
    delete cache[imdbId];
    throw error;
  });
  cache[imdbId] = request;
  return request;
}
function applyCinemetaMeta(info, meta) {
  var _a;
  return __spreadProps(__spreadValues({}, info), {
    title: meta.name || info.title,
    image: meta.background || meta.poster || info.image,
    poster: meta.poster || info.poster,
    logo: meta.logo || void 0,
    synopsis: meta.description || info.synopsis,
    imdbId: meta.imdb_id || info.imdbId || "",
    tmdbId: ((_a = meta.moviedb_id) == null ? void 0 : _a.toString()) || info.tmdbId || void 0,
    type: meta.type || info.type,
    tags: meta.genres || meta.genre || void 0,
    cast: meta.cast || void 0,
    rating: meta.imdbRating || void 0
  });
}
function getEpisodeNumber(title, season) {
  if (/\b(?:e\d+|episodes?\s*:?\s*\d+)\s*(?:[-–,&/]|\band\b)\s*(?:e|episodes?\s*:?\s*)?\d+/i.test(
    title
  )) {
    return void 0;
  }
  const explicitSeasons = [
    ...title.matchAll(/\bseason\s*:?\s*(\d{1,2})\b/gi),
    ...title.matchAll(/\bs(\d{1,2})\s*e\d{1,3}\b/gi)
  ].map((match) => Number(match[1]));
  if (explicitSeasons.some((value) => value !== season)) return void 0;
  const matches = [
    ...title.matchAll(/\bs\d{1,2}\s*e(\d{1,3})\b/gi),
    ...title.matchAll(/\bepisodes?\s*:?\s*(\d{1,3})\b/gi),
    ...title.matchAll(/\bep\s*\.?:?\s*(\d{1,3})\b/gi),
    ...title.matchAll(/\be(\d{1,3})\b/gi)
  ].map((match) => Number(match[1]));
  const episodes = [...new Set(matches.filter((episode) => episode > 0))];
  return episodes.length === 1 ? episodes[0] : void 0;
}
function enrichCinemetaEpisodes(episodes, videos, season) {
  var _a;
  const videosByEpisode = /* @__PURE__ */ new Map();
  let hasDuplicateVideo = false;
  for (const video of videos) {
    const episode = (_a = video.episode) != null ? _a : video.number;
    if (video.season !== season || !episode) continue;
    if (videosByEpisode.has(episode)) {
      hasDuplicateVideo = true;
      continue;
    }
    videosByEpisode.set(episode, video);
  }
  const matched = episodes.map((episode) => {
    const episodeNumber = getEpisodeNumber(episode.title, season);
    const video = episodeNumber ? videosByEpisode.get(episodeNumber) : void 0;
    const description = (video == null ? void 0 : video.description) || (video == null ? void 0 : video.overview);
    return { episode, episodeNumber, video, description };
  });
  const numbers = matched.map(({ episodeNumber }) => episodeNumber);
  const allMatched = episodes.length > 0 && !hasDuplicateVideo && matched.every(({ video }) => Boolean(video)) && new Set(numbers).size === numbers.length;
  if (!allMatched) return episodes;
  return matched.map(({ episode, video, description }) => __spreadProps(__spreadValues({}, episode), {
    description: description || episode.description,
    image: (video == null ? void 0 : video.thumbnail) || episode.image
  }));
}
var CINEMETA_BASE_URL;
var init_getCinemetaMeta = __esm({
  "providers/getCinemetaMeta.ts"() {
    "use strict";
    CINEMETA_BASE_URL = "https://v3-cinemeta.strem.io/meta";
  }
});

// providers/theintrodb.ts
function getIntroDbCache() {
  const state = typeof providerGlobal !== "undefined" && providerGlobal ? providerGlobal : globalThis;
  if (!state.__vegaTheIntroDbCache__ || typeof state.__vegaTheIntroDbCache__ !== "object") {
    state.__vegaTheIntroDbCache__ = /* @__PURE__ */ Object.create(null);
  }
  return state.__vegaTheIntroDbCache__;
}
function fetchTheIntroDbSkipTimings(_0) {
  return __async(this, arguments, function* ({
    imdbId,
    tmdbId,
    season,
    episode,
    providerContext,
    signal,
    timeout = 4e3
  }) {
    if (!imdbId && !tmdbId) return [];
    if (!season || !episode || season < 1 || episode < 1) return [];
    const cache = getIntroDbCache();
    const cacheKey = `${imdbId || tmdbId}:${season}:${episode}`;
    const cached = cache[cacheKey];
    if (cached) {
      if (typeof cached.then === "function") {
        return cached;
      }
      return cached;
    }
    const params = new URLSearchParams();
    if (imdbId) params.set("imdb_id", imdbId);
    if (tmdbId) params.set("tmdb_id", tmdbId.toString());
    params.set("season", season.toString());
    params.set("episode", episode.toString());
    const fetchPromise = (() => __async(null, null, function* () {
      var _a, _b, _c;
      try {
        const url = `https://api.theintrodb.org/v2/media?${params.toString()}`;
        const res = yield providerContext.axios.get(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            Accept: "application/json"
          },
          timeout,
          signal
        });
        const data = res.data;
        if (!data || typeof data !== "object") {
          cache[cacheKey] = [];
          return [];
        }
        const skipIntervals = [];
        if (Array.isArray(data.intro)) {
          for (const item of data.intro) {
            const startMs = (_a = item == null ? void 0 : item.start_ms) != null ? _a : 0;
            const endMs = item == null ? void 0 : item.end_ms;
            if (typeof endMs === "number" && endMs > startMs) {
              skipIntervals.push({
                title: "Intro",
                from: Number((startMs / 1e3).toFixed(2)),
                to: Number((endMs / 1e3).toFixed(2))
              });
            }
          }
        }
        if (Array.isArray(data.recap)) {
          for (const item of data.recap) {
            const startMs = (_b = item == null ? void 0 : item.start_ms) != null ? _b : 0;
            const endMs = item == null ? void 0 : item.end_ms;
            if (typeof endMs === "number" && endMs > startMs) {
              skipIntervals.push({
                title: "Recap",
                from: Number((startMs / 1e3).toFixed(2)),
                to: Number((endMs / 1e3).toFixed(2))
              });
            }
          }
        }
        if (Array.isArray(data.credits)) {
          for (const item of data.credits) {
            const startMs = item == null ? void 0 : item.start_ms;
            const endMs = item == null ? void 0 : item.end_ms;
            if (typeof startMs === "number" && typeof endMs === "number" && endMs > startMs) {
              skipIntervals.push({
                title: "Credits",
                from: Number((startMs / 1e3).toFixed(2)),
                to: Number((endMs / 1e3).toFixed(2))
              });
            }
          }
        }
        if (Array.isArray(data.preview)) {
          for (const item of data.preview) {
            const startMs = (_c = item == null ? void 0 : item.start_ms) != null ? _c : 0;
            const endMs = item == null ? void 0 : item.end_ms;
            if (typeof endMs === "number" && endMs > startMs) {
              skipIntervals.push({
                title: "Preview",
                from: Number((startMs / 1e3).toFixed(2)),
                to: Number((endMs / 1e3).toFixed(2))
              });
            }
          }
        }
        cache[cacheKey] = skipIntervals;
        return skipIntervals;
      } catch (e) {
        delete cache[cacheKey];
        return [];
      }
    }))();
    cache[cacheKey] = fetchPromise;
    return fetchPromise;
  });
}
function enrichEpisodesWithSkipTimings(episodes, imdbId, season, providerContext, signal) {
  return __async(this, null, function* () {
    if (!imdbId || !season || season < 1 || !/^tt\d+$/.test(imdbId)) {
      return episodes;
    }
    const promises = episodes.map((ep) => __async(null, null, function* () {
      const episodeNum = getEpisodeNumber(ep.title, season);
      if (!episodeNum || episodeNum < 1) {
        return ep;
      }
      const skipTimings = yield fetchTheIntroDbSkipTimings({
        imdbId,
        season,
        episode: episodeNum,
        providerContext,
        signal
      });
      if (skipTimings && skipTimings.length > 0) {
        return __spreadProps(__spreadValues({}, ep), {
          skip: skipTimings
        });
      }
      return ep;
    }));
    return Promise.all(promises);
  });
}
var init_theintrodb = __esm({
  "providers/theintrodb.ts"() {
    "use strict";
    init_getCinemetaMeta();
  }
});

// providers/providerErrors.ts
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch (e) {
    return String(error);
  }
}
function throwProviderError(provider, operation, error) {
  var _a, _b;
  const response = error == null ? void 0 : error.response;
  const status = response == null ? void 0 : response.status;
  const statusText = response == null ? void 0 : response.statusText;
  const url = ((_a = response == null ? void 0 : response.config) == null ? void 0 : _a.url) || ((_b = error == null ? void 0 : error.config) == null ? void 0 : _b.url);
  const details = [
    status ? `HTTP ${status}${statusText ? ` ${statusText}` : ""}` : "",
    url ? `URL ${url}` : "",
    getErrorMessage(error)
  ].filter(Boolean);
  throw new Error(`${provider} ${operation} failed: ${details.join(" | ")}`);
}
var init_providerErrors = __esm({
  "providers/providerErrors.ts"() {
    "use strict";
  }
});

// providers/autoEmbed/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function getRequest(link) {
  var _a;
  const imdbId = ((_a = link.match(/tt\d+/)) == null ? void 0 : _a[0]) || "";
  const type = /\bseries\b/i.test(link) ? "series" : "movie";
  if (!imdbId) throw new Error(`Missing IMDb ID in metadata link: ${link}`);
  return { imdbId, type };
}
function createPayload(imdbId, type, meta, video) {
  var _a, _b, _c, _d, _e;
  const videoParts = ((_a = video == null ? void 0 : video.id) == null ? void 0 : _a.split(":")) || [];
  return JSON.stringify({
    title: meta.name || "",
    imdbId,
    season: ((_b = video == null ? void 0 : video.season) == null ? void 0 : _b.toString()) || videoParts[1] || "",
    episode: ((_d = (_c = video == null ? void 0 : video.episode) != null ? _c : video == null ? void 0 : video.number) == null ? void 0 : _d.toString()) || videoParts[2] || "",
    type,
    tmdbId: ((_e = meta.moviedb_id) == null ? void 0 : _e.toString()) || "",
    year: meta.year
  });
}
var getMeta;
var init_meta = __esm({
  "providers/autoEmbed/meta.ts"() {
    "use strict";
    init_getCinemetaMeta();
    init_theintrodb();
    init_providerErrors();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b;
        try {
          const { imdbId, type } = getRequest(link);
          const meta = yield getCinemetaMeta(imdbId, type, providerContext);
          const linkList = [];
          if (type === "series") {
            const seasons = /* @__PURE__ */ new Map();
            for (const video of meta.videos || []) {
              const episode = (_a = video.episode) != null ? _a : video.number;
              if (!video.season || video.season <= 0 || !episode) continue;
              const episodes = seasons.get(video.season) || [];
              episodes.push({
                title: `Episode ${episode}`,
                link: createPayload(imdbId, "series", meta, video)
              });
              seasons.set(video.season, episodes);
            }
            const skipTimings = yield (_b = providerContext.kvStore) == null ? void 0 : _b.get("autoEmbed_skipTimings");
            for (const season of [...seasons.keys()].sort((a, b) => a - b)) {
              let directLinks = enrichCinemetaEpisodes(
                seasons.get(season) || [],
                meta.videos || [],
                season
              );
              if (skipTimings != null ? skipTimings : true) {
                directLinks = yield enrichEpisodesWithSkipTimings(
                  directLinks,
                  imdbId,
                  season,
                  providerContext
                );
              }
              linkList.push({
                title: `Season ${season}`,
                directLinks
              });
            }
          } else {
            linkList.push({
              title: meta.name || "Movie",
              directLinks: [
                {
                  title: "Movie",
                  type: "movie",
                  link: createPayload(imdbId, "movie", meta)
                }
              ]
            });
          }
          return applyCinemetaMeta(
            {
              title: meta.name || "",
              synopsis: meta.description || "",
              image: meta.background || meta.poster || "",
              poster: meta.poster || "",
              imdbId: imdbId || meta.imdb_id || "",
              type,
              linkList
            },
            meta
          );
        } catch (err) {
          throwProviderError("AutoEmbed", "metadata", err);
        }
      });
    };
  }
});

// providers/autoEmbed/stream.ts
var stream_exports = {};
__export(stream_exports, {
  VIDEASY_SERVERS: () => VIDEASY_SERVERS,
  getStream: () => getStream
});
function pctEncode(s) {
  return encodeURIComponent(s).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}
function extractQuality(q) {
  if (!q) return void 0;
  const str = String(q).toLowerCase();
  if (str.includes("2160") || str.includes("4k")) return "2160";
  if (str.includes("1080")) return "1080";
  if (str.includes("720")) return "720";
  if (str.includes("480")) return "480";
  if (str.includes("360")) return "360";
  return void 0;
}
var VIDEASY_API_BASE, DECRYPTION_API_URL, ORIGIN, VIDEASY_SERVERS, doubleEncode, getStream;
var init_stream = __esm({
  "providers/autoEmbed/stream.ts"() {
    "use strict";
    init_theintrodb();
    VIDEASY_API_BASE = "https://api.speedracelight.com";
    DECRYPTION_API_URL = "https://enc-dec.app/api/dec-videasy";
    ORIGIN = "https://www.cineby.at";
    VIDEASY_SERVERS = [
      { displayName: "Yoru", path: "cdn", mayHave4K: true, audioLabel: "Original" },
      { displayName: "Cypher", path: "downloader2", audioLabel: "Original" },
      { displayName: "Breach", path: "m4uhd", audioLabel: "Original" },
      { displayName: "Neon", path: "vsrc", audioLabel: "Original" },
      { displayName: "Vyse", path: "hdmovie", qualityFilter: "English", audioLabel: "Original" },
      { displayName: "Killjoy", path: "meine", language: "german", audioLabel: "German" },
      { displayName: "Fade", path: "hdmovie", qualityFilter: "Hindi", audioLabel: "Hindi" },
      { displayName: "Omen", path: "lamovie", audioLabel: "Spanish" },
      { displayName: "Raze", path: "superflix", audioLabel: "Portuguese" }
    ];
    doubleEncode = (s) => pctEncode(pctEncode(s));
    getStream = (_0) => __async(null, [_0], function* ({
      link: id,
      type,
      providerContext
    }) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      try {
        const streams = [];
        const payload = (() => {
          try {
            return JSON.parse(id);
          } catch (e) {
            return { tmdbId: id };
          }
        })();
        let tmdbId = String((_c = (_b = (_a = payload.tmdbId) != null ? _a : payload.id) != null ? _b : payload.tmdId) != null ? _c : "");
        let imdbId = (_d = payload.imdbId) != null ? _d : "";
        const season = payload.season || 1;
        const episode = payload.episode || 1;
        const effectiveType = (_f = (_e = payload.type) != null ? _e : type) != null ? _f : "movie";
        const isMovie = effectiveType === "movie";
        let title = (_g = payload.title) != null ? _g : "";
        let year = (payload.year ? String(payload.year) : "").slice(0, 4);
        if (!tmdbId && imdbId) {
          try {
            const cinemetaUrl = `https://v3-cinemeta.strem.io/meta/${isMovie ? "movie" : "series"}/${imdbId}.json`;
            const cRes = yield providerContext.axios.get(cinemetaUrl, {
              headers: providerContext.commonHeaders,
              timeout: 8e3
            });
            const cMeta = (_h = cRes.data) == null ? void 0 : _h.meta;
            if (cMeta) {
              tmdbId = String(cMeta.moviedb_id || "");
              if (!title) title = cMeta.name || "";
              if (!year) year = String(cMeta.year || "").slice(0, 4);
            }
          } catch (e) {
          }
        }
        if (tmdbId && (!title || !year)) {
          try {
            const detailUrl = `https://db.speedracelight.com/3/${isMovie ? "movie" : "tv"}/${tmdbId}?append_to_response=external_ids`;
            const dRes = yield providerContext.axios.get(detailUrl, {
              headers: __spreadValues({
                Referer: `${ORIGIN}/`,
                Origin: ORIGIN
              }, providerContext.commonHeaders),
              timeout: 8e3
            });
            const dData = dRes.data;
            if (dData) {
              if (!title) title = dData.title || dData.name || "";
              if (!year) {
                year = (dData.release_date || dData.first_air_date || "").slice(
                  0,
                  4
                );
              }
              if (!imdbId) imdbId = ((_i = dData.external_ids) == null ? void 0 : _i.imdb_id) || "";
            }
          } catch (e) {
          }
        }
        if (!tmdbId) {
          return [];
        }
        const skipTimings = yield (_j = providerContext.kvStore) == null ? void 0 : _j.get("autoEmbed_skipTimings");
        const skipTimingsEnabled = skipTimings != null ? skipTimings : true;
        let streamSkip = void 0;
        if (skipTimingsEnabled && !isMovie && (imdbId || tmdbId)) {
          streamSkip = yield fetchTheIntroDbSkipTimings({
            imdbId,
            tmdbId,
            season: Number(season),
            episode: Number(episode),
            providerContext
          });
          if (!(streamSkip == null ? void 0 : streamSkip.length)) streamSkip = void 0;
        }
        const backendHeaders = {
          Referer: `${ORIGIN}/`,
          Origin: ORIGIN,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        };
        const seedRes = yield providerContext.axios.get(
          `${VIDEASY_API_BASE}/seed?mediaId=${tmdbId}`,
          { headers: backendHeaders, timeout: 1e4 }
        );
        const seed = (_k = seedRes.data) == null ? void 0 : _k.seed;
        if (!seed) {
          return [];
        }
        const tasks = VIDEASY_SERVERS.map((server) => __async(null, null, function* () {
          var _a2;
          try {
            let serverUrl = `${VIDEASY_API_BASE}/${server.path}/sources-with-title?title=${doubleEncode(
              title
            )}&mediaType=${isMovie ? "movie" : "tv"}&year=${year}&episodeId=${episode}&seasonId=${season}&tmdbId=${tmdbId}&enc=2&seed=${seed}`;
            if (imdbId) serverUrl += `&imdbId=${imdbId}`;
            if (server.language) serverUrl += `&language=${server.language}`;
            const encRes = yield providerContext.axios.get(serverUrl, {
              headers: backendHeaders,
              timeout: 8e3
            });
            const encText = typeof encRes.data === "string" ? encRes.data : JSON.stringify(encRes.data);
            if (!encText || encText.length < 5) return;
            const decRes = yield providerContext.axios.post(
              DECRYPTION_API_URL,
              {
                text: encText,
                id: String(tmdbId),
                seed
              },
              {
                headers: { "Content-Type": "application/json" },
                timeout: 8e3
              }
            );
            const result = (_a2 = decRes.data) == null ? void 0 : _a2.result;
            if (!result) return;
            const subtitles = (result.subtitles || []).map((sub) => {
              const u = sub.url || sub.file || sub.src;
              const lang = sub.language || sub.lang || sub.label || sub.name || "Unknown";
              if (!u) return null;
              return {
                title: lang,
                language: lang.slice(0, 2).toLowerCase(),
                type: u.endsWith(".srt") ? "application/x-subrip" : "text/vtt",
                uri: u
              };
            }).filter(Boolean);
            const videoHeaders = {
              Referer: `${ORIGIN}/`,
              Origin: ORIGIN
            };
            if (result.sources && result.sources.length > 0) {
              let sources = result.sources;
              if (server.qualityFilter) {
                sources = sources.filter(
                  (s) => s.quality && s.quality.toLowerCase() === server.qualityFilter.toLowerCase()
                );
              }
              sources.forEach((src) => {
                const q = extractQuality(src.quality);
                const serverLabel = `${server.displayName} (${server.audioLabel || "Original"})`;
                streams.push({
                  server: serverLabel,
                  link: src.url,
                  type: src.url.includes(".m3u8") ? "m3u8" : "mp4",
                  quality: q,
                  subtitles: subtitles.length > 0 ? subtitles : void 0,
                  headers: videoHeaders,
                  skip: streamSkip
                });
              });
            } else if (result.url) {
              streams.push({
                server: `${server.displayName} (${server.audioLabel || "Original"})`,
                link: result.url,
                type: "m3u8",
                subtitles: subtitles.length > 0 ? subtitles : void 0,
                headers: videoHeaders,
                skip: streamSkip
              });
            } else if (result.streams) {
              for (const [qStr, sUrl] of Object.entries(result.streams)) {
                streams.push({
                  server: `${server.displayName} (${server.audioLabel || "Original"})`,
                  link: sUrl,
                  type: sUrl.includes(".m3u8") ? "m3u8" : "mp4",
                  quality: extractQuality(qStr),
                  subtitles: subtitles.length > 0 ? subtitles : void 0,
                  headers: videoHeaders,
                  skip: streamSkip
                });
              }
            }
          } catch (e) {
          }
        }));
        yield Promise.allSettled(tasks);
        console.log(streams);
        return streams;
      } catch (err) {
        console.error("autoEmbed getStream error:", err);
        return [];
      }
    });
  }
});

// providers/autoEmbed/autoEmbed.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
