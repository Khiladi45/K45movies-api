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

// providers/torrentio/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var init_catalog2 = __esm({
  "providers/torrentio/catalog.ts"() {
    "use strict";
    init_catalog();
  }
});

// providers/autoEmbed/posts.ts
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
            const rating = (result == null ? void 0 : result.imdbRating) || (result == null ? void 0 : result.rating);
            const tag = rating ? `${rating}\u2605` : void 0;
            if (id) {
              catalog2.push({
                title,
                link: `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
                image,
                tag
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
            const rating = (result == null ? void 0 : result.imdbRating) || (result == null ? void 0 : result.rating);
            const tag = rating ? `${rating}\u2605` : void 0;
            if (id) {
              catalog2.push({
                title,
                link: `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
                image,
                tag
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
            const rating = (result == null ? void 0 : result.imdbRating) || (result == null ? void 0 : result.rating);
            const tag = rating ? `${rating}\u2605` : void 0;
            if (id) {
              catalog2.push({
                title,
                link: `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
                image,
                tag
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

// providers/torrentio/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var init_posts2 = __esm({
  "providers/torrentio/posts.ts"() {
    "use strict";
    init_posts();
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
function resolveTmdbToImdb(tmdbId, type, providerContext) {
  return __async(this, null, function* () {
    var _a;
    try {
      const tmdbType = type === "series" ? "tv" : "movie";
      const res = yield providerContext.axios.get(
        `https://api.themoviedb.org/3/${tmdbType}/${tmdbId}/external_ids?api_key=cfe422613b250f702980a3bbf9e90716`,
        { timeout: 5e3 }
      );
      const imdb = (_a = res.data) == null ? void 0 : _a.imdb_id;
      if (typeof imdb === "string" && /^tt\d+$/.test(imdb)) {
        return imdb;
      }
    } catch (e) {
    }
    return null;
  });
}
function getCinemetaMeta(id, type, providerContext) {
  return __async(this, null, function* () {
    var _a;
    if (!id || typeof id !== "string") {
      return null;
    }
    let cleanImdbId = (_a = id.match(/tt\d+/)) == null ? void 0 : _a[0];
    if (!cleanImdbId) {
      const tmdbMatch = id.match(/(?:themoviedb\.org\/(?:movie|tv)\/|tmdb:?)(\d+)/i) || id.match(/^(\d+)$/);
      if (tmdbMatch) {
        cleanImdbId = (yield resolveTmdbToImdb(tmdbMatch[1], type, providerContext)) || void 0;
      }
    }
    if (!cleanImdbId) {
      return null;
    }
    const cache = getCache();
    const cached = cache[cleanImdbId];
    if (cached) {
      if (isCinemetaPromise(cached)) {
        return cached;
      }
      if (cached.name && cached.imdb_id === cleanImdbId) {
        return cached;
      }
      delete cache[cleanImdbId];
    }
    const mediaType = type === "series" ? "series" : "movie";
    const url = `${CINEMETA_BASE_URL}/${mediaType}/${cleanImdbId}.json`;
    const request = providerContext.axios.get(url, { timeout: 8e3 }).then((response) => {
      var _a2;
      const meta = (_a2 = response.data) == null ? void 0 : _a2.meta;
      if (!(meta == null ? void 0 : meta.name) || meta.imdb_id !== cleanImdbId) {
        delete cache[cleanImdbId];
        return null;
      }
      cache[cleanImdbId] = meta;
      return meta;
    }).catch(() => {
      delete cache[cleanImdbId];
      return null;
    });
    cache[cleanImdbId] = request;
    return request;
  });
}
function applyCinemetaMeta(info, meta) {
  var _a;
  if (!meta) return info;
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
function formatEpisodeTitle(episode, name) {
  const epNum = Number(episode);
  if (!name || !name.trim()) {
    return `Episode ${episode}`;
  }
  let cleanName = name.trim();
  cleanName = cleanName.replace(/^(?:s\d+\s*e\d+|\d+x\d+)\s*[:.-]\s*/i, "");
  cleanName = cleanName.replace(
    new RegExp(`^episodes?\\s*0*${epNum}\\s*[:.-]\\s*`, "i"),
    ""
  );
  if (new RegExp(`^0*${epNum}\\s*\\.\\s*`, "i").test(cleanName)) {
    return cleanName;
  }
  if (new RegExp(`^0*${epNum}\\s*[:.-]\\s*`, "i").test(cleanName)) {
    return `${epNum}. ${cleanName.replace(new RegExp(`^0*${epNum}\\s*[:.-]\\s*`, "i"), "")}`;
  }
  if (new RegExp(`^episodes?\\s*0*${epNum}$`, "i").test(cleanName)) {
    return `Episode ${epNum}`;
  }
  return `${epNum}. ${cleanName}`;
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
    ...title.matchAll(/\be(\d{1,3})\b/gi),
    ...title.matchAll(/^\s*(\d{1,3})\s*[.:-]\s*/gi)
  ].map((match) => Number(match[1]));
  const episodes = [...new Set(matches.filter((episode) => episode > 0))];
  return episodes.length === 1 ? episodes[0] : void 0;
}
function enrichCinemetaEpisodes(episodes, videos, season) {
  var _a;
  if (!videos || !Array.isArray(videos) || videos.length === 0 || !season) {
    return episodes;
  }
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

// providers/torrentio/meta.ts
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
  "providers/torrentio/meta.ts"() {
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
          if (!meta) {
            return {
              title: imdbId,
              synopsis: "",
              image: "",
              imdbId,
              type,
              linkList: []
            };
          }
          const linkList = [];
          if (type === "series") {
            const seasons = /* @__PURE__ */ new Map();
            const now = Date.now();
            for (const video of meta.videos || []) {
              const episode = (_a = video.episode) != null ? _a : video.number;
              if (!video.season || video.season <= 0 || !episode) continue;
              const releaseStr = video.released || video.firstAired;
              if (releaseStr) {
                const releaseTime = new Date(releaseStr).getTime();
                if (!isNaN(releaseTime) && releaseTime > now) {
                  continue;
                }
              }
              const episodes = seasons.get(video.season) || [];
              episodes.push({
                title: formatEpisodeTitle(episode, video.name),
                link: createPayload(imdbId, "series", meta, video)
              });
              seasons.set(video.season, episodes);
            }
            const skipTimings = yield (_b = providerContext.kvStore) == null ? void 0 : _b.get("torrentio_skipTimings");
            for (const season of [...seasons.keys()].sort((a, b) => a - b)) {
              const seasonEpisodes = seasons.get(season) || [];
              if (seasonEpisodes.length === 0) continue;
              let directLinks = enrichCinemetaEpisodes(
                seasonEpisodes,
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
          throwProviderError("Torrentio", "metadata", err);
        }
      });
    };
  }
});

// providers/torrentio/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function getLanguageCodes(title) {
  const flagCodes = (title.match(/[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/g) || []).map(
    (flag) => [...flag].map(
      (character) => String.fromCharCode(65 + character.codePointAt(0) - 127462)
    ).join("")
  );
  if (flagCodes.length > 0) {
    const unique = [...new Set(flagCodes)];
    if (unique.length > 2) return "MULTI";
    return unique.join(", ");
  }
  const uppercaseTitle = title.toUpperCase();
  const matches = languageCodes.filter(([language]) => uppercaseTitle.includes(language)).map(([, code]) => code);
  return matches.length > 0 ? [...new Set(matches)].join(", ") : "ENG";
}
function isUploaderCandidate(val) {
  if (!val || val.length <= 2) return false;
  if (NON_UPLOADER_REGEX.test(val)) return false;
  if (SPEC_WORDS_REGEX.test(val)) return false;
  return true;
}
function extractTorrentioUploader(title, name) {
  const combined = `${name || ""}
${title || ""}`;
  const lines = combined.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const allBrackets = [...line.matchAll(/\[([a-zA-Z0-9_.\s@-]+)\]/g)].map(
      (m) => m[1].replace(/^@/, "").trim()
    );
    for (const b of allBrackets) {
      if (isUploaderCandidate(b)) return b;
    }
  }
  for (const line of lines) {
    const cleanTrailing = line.replace(/(\s*\[[^\]]*\]|\s*\([^)]*\))+$/g, "").replace(/\.(mkv|mp4|avi|webm|ts)$/i, "").trim();
    const hyphenMatch = cleanTrailing.match(/[-_–]\s*@?([a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)?)$/);
    if (hyphenMatch && isUploaderCandidate(hyphenMatch[1].trim())) {
      return hyphenMatch[1].trim();
    }
  }
  for (const line of lines) {
    const gearMatch = line.match(/⚙️\s*([^\n\r]+)/);
    if (gearMatch) {
      const val = gearMatch[1].replace(/^@/, "").trim();
      if (isUploaderCandidate(val)) return val;
    }
  }
  return "Torrentio";
}
function extractFormatTags(text) {
  const tags = [];
  if (/AV1/i.test(text)) tags.push("AV1");
  else if (/x265|HEVC/i.test(text)) tags.push("HEVC");
  else if (/x264|AVC/i.test(text)) tags.push("AVC");
  if (/10-?bit|hi10p?/i.test(text)) tags.push("10-bit");
  if (/[\b\s.]DV[\b\s.]|Dolby\s*Vision/i.test(text)) tags.push("DV");
  if (/[\b\s.]HDR(?:10(?:\+)?)?[\b\s.]/i.test(text)) tags.push("HDR");
  if (/REMUX/i.test(text)) tags.push("Remux");
  if (/BluRay|BD\b|BDRip/i.test(text)) tags.push("BluRay");
  else if (/WEB-?DL|WEBRip/i.test(text)) tags.push("WEB-DL");
  if (/Dual[\s-]Audio/i.test(text)) tags.push("Dual-Audio");
  else if (/Multi[\s-]Audio/i.test(text)) tags.push("Multi-Audio");
  return tags;
}
var languageCodes, NON_UPLOADER_REGEX, SPEC_WORDS_REGEX, getStream;
var init_stream = __esm({
  "providers/torrentio/stream.ts"() {
    "use strict";
    init_providerErrors();
    init_theintrodb();
    languageCodes = [
      ["MULTI", "MULTI"],
      ["DUAL", "DUAL"],
      ["HINDI", "HI"],
      ["TAMIL", "TA"],
      ["TELUGU", "Tz"],
      ["SPANISH", "SP"],
      ["FRENCH", "FR"],
      ["GERMAN", "DE"],
      ["ITALIAN", "IT"],
      ["KOREAN", "KO"],
      ["JAPANESE", "JP"],
      ["ENGLISH", "EN"]
    ];
    NON_UPLOADER_REGEX = /^(\d+|[a-zA-Z]{1,2}|\d{3,4}p?|4k|uhd|bluray|bd|dvd|web(-?dl|-?rip)?|h\.?26[45]|x26[45]|hevc|av1|opus|flac|aac|ac3|dts|mp3|multi(-?audio|-?sub)?|dual(-?audio)?|sub(s|bed)?|dub(bed)?|audio|remux|hdr(10\+?)?|dv|dolby|hi10p?|10bit|8bit|v\d+|repack\d*|proper|raws?|es|lat|ger|ita|fra|eng?|jap?|batch|[0-9a-f]{8})$/i;
    SPEC_WORDS_REGEX = /\b(1080p?|720p?|480p?|360p?|2160p?|4k|bd|bluray|hevc|x26[45]|h\.?26[45]|av1|aac|ac3|dts|mp3|flac|opus|dual-audio|multi-audio|sub|dub|web(-?dl|-?rip)?|remux|10-?bit|hi10p?)\b/i;
    getStream = (_0) => __async(null, [_0], function* ({
      link: id,
      type,
      providerContext
    }) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      try {
        const payload = (() => {
          try {
            return JSON.parse(id);
          } catch (e) {
            return { imdbId: id };
          }
        })();
        let imdbId = (_b = (_a = payload.imdbId) != null ? _a : id) != null ? _b : "";
        const season = (_c = payload.season) != null ? _c : "";
        const episode = (_d = payload.episode) != null ? _d : "";
        const effectiveType = (_f = (_e = payload.type) != null ? _e : type) != null ? _f : "movie";
        if (!imdbId || imdbId === "undefined" || imdbId === "[object Object]") {
          if (id && id.startsWith("tt")) {
            imdbId = id;
          }
        }
        if (!imdbId || !imdbId.startsWith("tt")) {
          console.warn("torrentio: missing or invalid imdbId in link payload");
          return [];
        }
        const skipTimings = yield (_g = providerContext.kvStore) == null ? void 0 : _g.get("torrentio_skipTimings");
        const skipTimingsEnabled = skipTimings != null ? skipTimings : true;
        let streamSkip = void 0;
        if (skipTimingsEnabled && effectiveType === "series" && imdbId && season && episode) {
          streamSkip = yield fetchTheIntroDbSkipTimings({
            imdbId,
            season: Number(season),
            episode: Number(episode),
            providerContext
          });
          if (!(streamSkip == null ? void 0 : streamSkip.length)) streamSkip = void 0;
        }
        const kv = providerContext.kvStore;
        let baseUrl = "https://torrentio.strem.fun";
        let debridService = "none";
        let debridApiKey = "";
        let qualityFilter = "all";
        let sortBy = "qualitythenseeders";
        let includeP2PFallback = true;
        if (kv) {
          const customUrl = (yield kv.get("customInstanceUrl")) || (yield kv.get("torrentio_customInstanceUrl"));
          if (customUrl && customUrl.trim()) baseUrl = customUrl.trim().replace(/\/+$/, "");
          debridService = (yield kv.get("debridService")) || (yield kv.get("torrentio_debridService")) || "none";
          debridApiKey = ((yield kv.get("debridApiKey")) || (yield kv.get("torrentio_debridApiKey")) || "").trim();
          qualityFilter = (yield kv.get("qualityFilter")) || (yield kv.get("torrentio_qualityFilter")) || "all";
          sortBy = (yield kv.get("sortBy")) || (yield kv.get("torrentio_sortBy")) || "qualitythenseeders";
          const fallbackSetting = (_h = yield kv.get("includeP2PFallback")) != null ? _h : yield kv.get("torrentio_includeP2PFallback");
          if (fallbackSetting !== void 0) includeP2PFallback = fallbackSetting;
        }
        const optionsParts = [];
        if (sortBy && sortBy !== "qualitythenseeders") {
          optionsParts.push(`sort=${sortBy}`);
        }
        if (qualityFilter && qualityFilter !== "all") {
          optionsParts.push(`qualityfilter=${qualityFilter}`);
        }
        if (debridService && debridService !== "none" && debridApiKey) {
          optionsParts.push(`${debridService}=${debridApiKey}`);
          if (!includeP2PFallback) {
            optionsParts.push("debridoptions=nodownloadlinks");
          }
        }
        const optionsSegment = optionsParts.length > 0 ? `${optionsParts.join("|")}/` : "";
        let url = `${baseUrl}/${optionsSegment}stream/${effectiveType}/${imdbId}`;
        if (effectiveType === "series" && season && episode) {
          url += `:${season}:${episode}`;
        }
        url += `.json`;
        console.log("Torrentio URL:", url);
        const res = yield providerContext.axios.get(url, {
          timeout: 1e4
        });
        const streams = [];
        if (res.data && res.data.streams) {
          res.data.streams.forEach((s) => {
            var _a2, _b2;
            let quality = void 0;
            const lowerName = (s.name || "").toLowerCase() + " " + (s.title || "").toLowerCase();
            if (lowerName.includes("2160") || lowerName.includes("4k"))
              quality = "2160";
            else if (lowerName.includes("1080")) quality = "1080";
            else if (lowerName.includes("720")) quality = "720";
            else if (lowerName.includes("480")) quality = "480";
            else if (lowerName.includes("360")) quality = "360";
            let link = s.url;
            if (!link && s.infoHash) {
              link = `magnet:?xt=urn:btih:${s.infoHash}`;
            }
            const title = s.title || "";
            const combinedText = `${s.name || ""} ${title}`;
            const language = getLanguageCodes(title);
            const size = ((_a2 = title.match(/💾\s*([\d.]+\s*(?:KB|MB|GB|TB))/i)) == null ? void 0 : _a2[1]) || "";
            const uploader = extractTorrentioUploader(title, s.name);
            let seeders = "";
            const seedersMatch = title.match(/👤\s*(\d+)/);
            if (seedersMatch) {
              seeders = `\u{1F464}${seedersMatch[1]}`;
            } else {
              const slMatch = title.match(/S:\s*(\d+)/i);
              if (slMatch) {
                seeders = `\u{1F464}${slMatch[1]}`;
              }
            }
            const formatTags = extractFormatTags(combinedText);
            const debridBadge = (_b2 = (s.name || "").match(
              /\[(RD\+?|AD\+?|PM\+?|TB\+?|DL\+?|OC\+?|RD download|AD download)\]/i
            )) == null ? void 0 : _b2[0];
            const isCachedDebrid = Boolean(debridBadge && !debridBadge.toLowerCase().includes("download")) || Boolean(link && !link.startsWith("magnet:"));
            const server = debridBadge ? `${debridBadge} ${uploader}` : uploader;
            const tags = [];
            if (quality) {
              tags.push(`${quality}p`);
            }
            if (seeders && !isCachedDebrid) {
              tags.push(seeders);
            }
            if (debridBadge) {
              tags.push(debridBadge.replace(/[\[\]]/g, ""));
            }
            for (const tag2 of formatTags) {
              tags.push(tag2);
            }
            if (language && language !== "ENG") {
              tags.push(language);
            }
            if (size) {
              tags.push(size);
            }
            const tag = tags.join(" \u2022 ") || void 0;
            if (link) {
              streams.push({
                server,
                link,
                type: link.startsWith("magnet:") ? "torrent" : "mp4",
                quality,
                tags: tags.length > 0 ? tags : void 0,
                tag,
                skip: streamSkip
              });
            }
          });
        }
        const isQualityAllowed = (q) => {
          if (!q) return true;
          if (qualityFilter === "all" || !qualityFilter) return true;
          if (qualityFilter === "720" || qualityFilter === "720p,480p") {
            return q === "720" || q === "480" || q === "360";
          }
          if (qualityFilter === "1080" || qualityFilter === "1080p,720p,480p") {
            return q === "1080" || q === "720" || q === "480" || q === "360";
          }
          if (qualityFilter === "480") {
            return q === "480" || q === "360";
          }
          return true;
        };
        const filteredStreams = streams.filter((s) => isQualityAllowed(s.quality));
        console.log(`Torrentio streams (${filteredStreams.length}/${streams.length} allowed for quality=${qualityFilter}):`, filteredStreams);
        return filteredStreams;
      } catch (err) {
        throwProviderError("Torrentio", "stream", err);
      }
    });
  }
});

// providers/torrentio/torrentio.entry.js
Object.assign(exports, (init_catalog2(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts2(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
