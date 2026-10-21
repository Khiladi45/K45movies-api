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

// providers/everything/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/everything/catalog.ts"() {
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

// providers/everything/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/everything/posts.ts"() {
    "use strict";
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        signal,
        providerContext
      }) {
        var _a;
        try {
          const catalog2 = [];
          const url = "https://cinemeta-catalogs.strem.io" + filter;
          const res = yield providerContext.axios.get(url, {
            headers: providerContext.commonHeaders,
            signal
          });
          const data = res.data;
          (_a = data == null ? void 0 : data.metas) == null ? void 0 : _a.forEach((result) => {
            const title = result == null ? void 0 : result.name;
            const id = (result == null ? void 0 : result.imdb_id) || (result == null ? void 0 : result.id);
            const type = result == null ? void 0 : result.type;
            const image = (result == null ? void 0 : result.background) || (id ? `https://images.metahub.space/background/medium/${id}/img` : "") || (result == null ? void 0 : result.poster) || "";
            const rating = (result == null ? void 0 : result.imdbRating) || (result == null ? void 0 : result.rating);
            const tag = rating ? `${rating}\u2605` : void 0;
            if (id) {
              catalog2.push({
                title,
                link: `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
                image,
                aspectRatio: 16 / 9,
                tag
              });
            }
          });
          return catalog2;
        } catch (err) {
          console.error("Everything getPosts error:", err);
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
        try {
          if (page > 1) {
            return [];
          }
          const catalog2 = [];
          const url1 = `https://v3-cinemeta.strem.io/catalog/series/top/search=${encodeURIComponent(
            searchQuery
          )}.json`;
          const url2 = `https://v3-cinemeta.strem.io/catalog/movie/top/search=${encodeURIComponent(
            searchQuery
          )}.json`;
          const res = yield providerContext.axios.get(url1, {
            headers: providerContext.commonHeaders,
            signal
          });
          const data = res.data;
          (_a = data == null ? void 0 : data.metas) == null ? void 0 : _a.forEach((result) => {
            const title = (result == null ? void 0 : result.name) || "";
            const id = (result == null ? void 0 : result.imdb_id) || (result == null ? void 0 : result.id);
            const image = (result == null ? void 0 : result.background) || (id ? `https://images.metahub.space/background/medium/${id}/img` : "") || (result == null ? void 0 : result.poster) || "";
            const type = result == null ? void 0 : result.type;
            const rating = (result == null ? void 0 : result.imdbRating) || (result == null ? void 0 : result.rating);
            const tag = rating ? `${rating}\u2605` : void 0;
            if (id) {
              catalog2.push({
                title,
                link: `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
                image,
                aspectRatio: 16 / 9,
                tag
              });
            }
          });
          const res2 = yield providerContext.axios.get(url2, {
            headers: providerContext.commonHeaders,
            signal
          });
          const data2 = res2.data;
          (_b = data2 == null ? void 0 : data2.metas) == null ? void 0 : _b.forEach((result) => {
            const title = (result == null ? void 0 : result.name) || "";
            const id = (result == null ? void 0 : result.imdb_id) || (result == null ? void 0 : result.id);
            const image = (data2 == null ? void 0 : data2.background) || (result == null ? void 0 : result.background) || (id ? `https://images.metahub.space/background/medium/${id}/img` : "") || (result == null ? void 0 : result.poster) || "";
            const type = result == null ? void 0 : result.type;
            const rating = (result == null ? void 0 : result.imdbRating) || (result == null ? void 0 : result.rating);
            const tag = rating ? `${rating}\u2605` : void 0;
            if (id && !catalog2.some((c) => c.link.includes(id))) {
              catalog2.push({
                title,
                link: `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`,
                image,
                aspectRatio: 16 / 9,
                tag
              });
            }
          });
          return catalog2;
        } catch (err) {
          console.error("Everything getSearchPosts error:", err);
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

// providers/everything/meta.ts
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
  "providers/everything/meta.ts"() {
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
            const skipTimings = yield (_b = providerContext.kvStore) == null ? void 0 : _b.get(
              "everything_skipTimings"
            );
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
                  link: createPayload(imdbId, "movie", meta),
                  type: "movie"
                }
              ]
            });
          }
          return applyCinemetaMeta(
            {
              title: meta.name || "",
              synopsis: meta.description || "",
              image: meta.poster || "",
              imdbId,
              type,
              linkList
            },
            meta
          );
        } catch (err) {
          throwProviderError("Everything", "metadata", err);
        }
      });
    };
  }
});

// providers/everything/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function isDirectLink(url) {
  if (!url || typeof url !== "string") return false;
  if (EXCLUDE_REGEX.test(url)) return false;
  return DIRECT_REGEX.test(url);
}
function normalizeStr(e) {
  return String(e || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
function decodeAndClean(e) {
  let t = String(e || "");
  try {
    t = decodeURIComponent(t);
  } catch (e2) {
  }
  return t.replace(/[+_]/g, " ");
}
function parseSeasonEpisodes(e) {
  const t = decodeAndClean(e);
  const n = [];
  const addEntry = (s, ep, epFrom, epTo) => {
    const a = s == null ? null : Number(s);
    if (a != null && (!Number.isFinite(a) || a < 0 || a > 100)) return;
    if (ep != null) {
      const eNum = Number(ep);
      if (!Number.isFinite(eNum) || eNum < 1 || eNum > 999) return;
      n.push({ season: a, episode: eNum });
      return;
    }
    if (epFrom != null && epTo != null) {
      const eNum = Number(epFrom);
      const tNum = Number(epTo);
      if (!Number.isFinite(eNum) || !Number.isFinite(tNum)) return;
      n.push({ season: a, epFrom: Math.min(eNum, tNum), epTo: Math.max(eNum, tNum) });
      return;
    }
    if (a != null) n.push({ season: a });
  };
  for (const match of t.matchAll(/\bS(\d{1,2})E(\d{1,3})\s*[-–to]+\s*E?(\d{1,3})\b/gi)) {
    addEntry(match[1], null, match[2], match[3]);
  }
  for (const match of t.matchAll(/\bS(\d{1,2})E(\d{1,3})\b/gi)) {
    addEntry(match[1], match[2], null, null);
  }
  for (const match of t.matchAll(/\bS(\d{1,2})[.\s_-]+E(\d{1,3})\b/gi)) {
    addEntry(match[1], match[2], null, null);
  }
  for (const match of t.matchAll(/\b(\d{1,2})x(\d{1,3})\b/gi)) {
    addEntry(match[1], match[2], null, null);
  }
  for (const match of t.matchAll(
    /\bSeasons?\s*(\d{1,2})\s*(?:[-–:]\s*)?(?:Episode|Episodes|Ep)\s*(\d{1,3})\b/gi
  )) {
    addEntry(match[1], match[2], null, null);
  }
  for (const match of t.matchAll(
    /\bSeasons?\s*(\d{1,2})\b[^.\n]{0,40}?\b(?:Episode|Episodes|Ep)\s*(\d{1,3})\s*[-–to]+\s*(\d{1,3})\b/gi
  )) {
    addEntry(match[1], null, match[2], match[3]);
  }
  for (const match of t.matchAll(/\bSeasons?\s*(\d{1,2})\b/gi)) {
    addEntry(match[1], null, null, null);
  }
  for (const match of t.matchAll(/\bS(\d{1,2})(?!\d|E\d)\b/gi)) {
    addEntry(match[1], null, null, null);
  }
  return n;
}
function titleMatch(e, t) {
  const n = normalizeStr(t);
  const r = normalizeStr(e);
  if (!n || !r) return false;
  if (r.includes(n)) return true;
  const i = n.split(" ").filter((w) => w.length > 2);
  return i.length ? i.filter((w) => r.includes(w)).length >= Math.ceil(i.length * 0.75) : r.includes(n.replace(/\s/g, ""));
}
function extractMismatchedTitle(e, t) {
  const match = String(e || "").match(
    /([A-Za-z][A-Za-z0-9 .'_-]{1,48}?)(?:\s*[._-]?\s*)(?:S\d{1,2}|Seasons?\s*\d{1,2})\b/i
  );
  if (!match) return "";
  const r = normalizeStr(match[1]);
  if (!r || r.length < 3 || /^(web|webdl|webrip|bluray|hdtv|hdrip|complete|pack|english|hindi|dual|multi|download|episode|season|series)$/i.test(
    r
  ) || titleMatch(r, t) || titleMatch(t, r) || normalizeStr(t).split(" ").filter((w) => w.length > 3).some((w) => r.includes(w))) {
    return "";
  }
  return r;
}
function isPossibleWrongFile(item, target) {
  if (!target) return false;
  const isSeries = target.type === "series" || target.season != null || target.episode != null;
  const text = [item.name, ...item.tags || [], item.url].filter(Boolean).join(" ");
  if (!text.trim()) return false;
  const parsed = parseSeasonEpisodes(text);
  const withEpisode = parsed.filter(
    (e) => e.episode != null || e.epFrom != null && e.epTo != null
  );
  const withSeason = parsed.filter((e) => e.season != null);
  if (isSeries) {
    const n = target.season == null ? null : Number(target.season);
    const r = target.episode == null ? null : Number(target.episode);
    const title = target.title || "";
    const matchesTarget = (e) => {
      if (n != null && e.season != null && Number(e.season) !== n) return false;
      if (e.episode == null) {
        if (e.epFrom != null && e.epTo != null) {
          return r == null || r >= e.epFrom && r <= e.epTo;
        }
        return true;
      }
      return r == null || Number(e.episode) === r;
    };
    if (r != null && withEpisode.length > 0) {
      if (!withEpisode.some(matchesTarget)) return true;
    } else if (r != null && withSeason.length > 0 && withEpisode.length === 0) {
      if (n != null && !withSeason.some((e) => Number(e.season) === n)) return true;
    } else if (n != null && withSeason.length > 0 && withEpisode.length === 0) {
      if (!withSeason.some((e) => Number(e.season) === n)) return true;
    } else if (n != null && withEpisode.length > 0 && r == null && withEpisode.every((e) => e.season != null && Number(e.season) !== n)) {
      return true;
    }
    if (title && (n != null || r != null) && withSeason.length > 0) {
      if (!titleMatch(text, title) && Boolean(extractMismatchedTitle(text, title))) {
        return true;
      }
    }
  } else {
    if (withEpisode.length > 0 || withSeason.length > 0) return true;
  }
  return false;
}
function extractQuality(tags, name) {
  const all = [...tags || [], name].join(" ");
  if (/2160p|4k|uhd/i.test(all)) return "2160";
  if (/1080p/i.test(all)) return "1080";
  if (/720p/i.test(all)) return "720";
  if (/480p/i.test(all)) return "480";
  if (/360p/i.test(all)) return "360";
  return void 0;
}
function extractType(url, name) {
  if (/\.mp4($|\?)/i.test(url) || /\.mp4/i.test(name)) return "mp4";
  if (/\.m3u8($|\?)/i.test(url)) return "m3u8";
  return "mkv";
}
var TURNSTILE_INJECT_JS, DIRECT_REGEX, EXCLUDE_REGEX, getStream;
var init_stream = __esm({
  "providers/everything/stream.ts"() {
    "use strict";
    TURNSTILE_INJECT_JS = `(function() {
  if (window.__vega_turnstile_injected) return;
  window.__vega_turnstile_injected = true;

  function init() {
    if (!document.body) {
      setTimeout(init, 50);
      return;
    }

    var container = document.getElementById('vega-turnstile-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'vega-turnstile-container';
      container.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999999;background:#18181b;padding:24px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:300px;border:1px solid #333;font-family:system-ui,-apple-system,sans-serif;';
      
      var title = document.createElement('div');
      title.innerText = 'Security Verification';
      title.style.cssText = 'color:#fff;font-size:15px;font-weight:600;margin-bottom:8px;text-align:center;';
      container.appendChild(title);

      var subtitle = document.createElement('div');
      subtitle.innerText = 'Please wait or verify below to load streams...';
      subtitle.style.cssText = 'color:#a1a1aa;font-size:13px;margin-bottom:16px;text-align:center;';
      container.appendChild(subtitle);

      var widget = document.createElement('div');
      widget.id = 'vega-turnstile-widget';
      container.appendChild(widget);

      document.body.appendChild(container);
    }

    function renderWidget() {
      if (!window.turnstile || typeof window.turnstile.render !== 'function') return false;
      var widget = document.getElementById('vega-turnstile-widget');
      if (!widget || widget.children.length > 0) return true;
      try {
        window.turnstile.render(widget, {
          sitekey: '0x4AAAAAAE88TTCq-X3s3srZ',
          theme: 'dark',
          callback: function(token) {
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                __waf: true,
                data: token
              }));
            }
          },
          'error-callback': function() {
            console.error('Turnstile error');
          }
        });
        return true;
      } catch (err) {
        console.error('Turnstile render error', err);
        return false;
      }
    }

    if (window.turnstile && renderWidget()) {
      return;
    }

    if (!document.getElementById('vega-turnstile-script')) {
      var script = document.createElement('script');
      script.id = 'vega-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      document.head.appendChild(script);
    }

    var poll = setInterval(function() {
      if (window.turnstile && renderWidget()) {
        clearInterval(poll);
      }
    }, 100);
    setTimeout(function() { clearInterval(poll); }, 25000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); true;`;
    DIRECT_REGEX = /(r2\.dev|workers\.dev|foxcloud\.rest|neetflixcdn|drive\.google\.com\/uc|video-downloads\.googleusercontent|vikingfile\.com\/download|download\d*\.mediafire|111477|sermoviedown|highxhd|archive\.org|uupload\.ir|hakunaymatata\.com|vadapav\.mov|tattooin\.ru|public\.animeout|nimbus\.animeout|mydriveku|dl\.anime7\.download|\.mkv($|\?)|\.mp4($|\?)|\.webm($|\?)|\.avi($|\?))/i;
    EXCLUDE_REGEX = /hubcloud|hubdrive|pixeldrain|telegram|t\.me|\.rar($|\?)|\.zip($|\?)/i;
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        type,
        signal,
        providerContext,
        isDownload
      }) {
        var _a, _b;
        try {
          let params = {};
          try {
            params = JSON.parse(link);
          } catch (e) {
            params = {};
          }
          const isSeries = params.type === "series" || type === "series" || Boolean(params.season || params.episode);
          let payload;
          if (isSeries) {
            payload = {
              mode: "episode",
              title: params.title || "",
              year: params.year ? params.year.toString().slice(0, 4) : void 0,
              tmdb_id: params.tmdbId ? parseInt(params.tmdbId, 10) : void 0,
              imdb_id: params.imdbId || void 0,
              season: params.season ? parseInt(params.season, 10) : void 0,
              episode: params.episode ? parseInt(params.episode, 10) : void 0
            };
          } else {
            payload = {
              mode: "movie",
              title: params.title || "",
              year: params.year ? params.year.toString().slice(0, 4) : void 0,
              tmdb_id: params.tmdbId ? parseInt(params.tmdbId, 10) : void 0,
              imdb_id: params.imdbId || void 0
            };
          }
          const headers = {
            accept: "application/x-ndjson",
            "accept-language": "en-US,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            origin: "https://downloadeverythingfromeverywhere.com",
            pragma: "no-cache",
            referer: "https://downloadeverythingfromeverywhere.com/",
            "user-agent": ((_a = providerContext.commonHeaders) == null ? void 0 : _a["User-Agent"]) || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "x-defe-manual": "1"
          };
          const fetchStreams = (bodyPayload) => __async(null, null, function* () {
            const response = yield providerContext.axios.post(
              "https://slave.downloadeverythingfromeverywhere.com/",
              bodyPayload,
              {
                headers,
                responseType: "text",
                signal,
                timeout: 45e3
              }
            );
            return typeof response.data === "string" ? response.data : JSON.stringify(response.data);
          });
          let rawData = "";
          try {
            rawData = yield fetchStreams(payload);
          } catch (err) {
            if (err.response) {
              rawData = typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data || "");
            } else {
              throw err;
            }
          }
          if ((rawData.includes('"verify failed"') || rawData.includes('"error"')) && providerContext.openWebView) {
            try {
              const wafResult = yield providerContext.openWebView(
                "https://downloadeverythingfromeverywhere.com/",
                {
                  title: "Security Verification",
                  description: "Please complete the verification to load streams",
                  force: true,
                  injectedJavaScript: TURNSTILE_INJECT_JS
                }
              );
              const token = (_b = wafResult == null ? void 0 : wafResult.data) == null ? void 0 : _b.trim();
              if (token && !token.startsWith("<") && !token.startsWith("{")) {
                payload.turnstile = token;
                rawData = yield fetchStreams(payload);
              }
            } catch (wafErr) {
              console.error("Turnstile WAF solving failed or cancelled:", wafErr);
            }
          }
          const lines = rawData.split("\n").filter((l) => l.trim().length > 0);
          const streams = [];
          const seenUrls = /* @__PURE__ */ new Set();
          const target = {
            title: params.title || "",
            season: params.season,
            episode: params.episode,
            type: isSeries ? "series" : "movie"
          };
          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              if (json.t === "hit" && Array.isArray(json.links)) {
                const site = json.site || "Direct";
                for (const item of json.links) {
                  const url = item.url;
                  if (!url || seenUrls.has(url)) continue;
                  if (isPossibleWrongFile({ name: item.name, tags: item.tags, url }, target)) {
                    continue;
                  }
                  if (isDirectLink(url)) {
                    seenUrls.add(url);
                    const quality = extractQuality(item.tags, item.name);
                    const fileType = extractType(url, item.name);
                    const name = item.name || item.release || "Stream";
                    const server = `${site} - ${name}`;
                    const QUALITY_TAG_REGEX = /^(2160p?|1080p?|720p?|540p?|480p?|400p?|360p?|4k|uhd)$/i;
                    const cleanTags = (item.tags || []).filter(
                      (t) => t && !["Movie", "Episode", site, "Direct"].includes(t) && !t.toLowerCase().includes("telegram") && !QUALITY_TAG_REGEX.test(t.trim()) && (!quality || t.trim().toLowerCase() !== quality.toLowerCase() && t.trim().toLowerCase() !== (quality + "p").toLowerCase())
                    );
                    streams.push({
                      server,
                      link: url,
                      type: fileType,
                      quality,
                      tags: cleanTags,
                      tag: cleanTags.join(" \u2022 ") || void 0
                    });
                  }
                }
              }
            } catch (e) {
            }
          }
          const isA111477 = (s) => {
            var _a2;
            return /111477/i.test(s.server) || /111477/i.test(s.link) || Boolean((_a2 = s.tags) == null ? void 0 : _a2.some((t) => /111477/i.test(t)));
          };
          const qualityWeight = (q) => {
            switch (q) {
              case "2160":
                return 4;
              case "1080":
                return 3;
              case "720":
                return 2;
              case "480":
                return 1;
              default:
                return 0;
            }
          };
          const regularStreams = [];
          const a111477Streams = [];
          for (const stream of streams) {
            if (isA111477(stream)) {
              a111477Streams.push(stream);
            } else {
              regularStreams.push(stream);
            }
          }
          regularStreams.sort((a, b) => qualityWeight(b.quality) - qualityWeight(a.quality));
          a111477Streams.sort((a, b) => qualityWeight(b.quality) - qualityWeight(a.quality));
          return [...regularStreams, ...a111477Streams];
        } catch (err) {
          console.error("Everything getStream error:", err);
          return [];
        }
      });
    };
  }
});

// providers/everything/everything.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
