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

// providers/cinefreak/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/cinefreak/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Latest Releases", filter: "" },
      { title: "WEB-Series", filter: "/web-series" },
      { title: "Dual Audio", filter: "/dual-audio" },
      { title: "Hindi Movies", filter: "/hindi-movies" },
      { title: "English Movies", filter: "/english-movies" },
      { title: "Spanish", filter: "/spanish" }
    ];
    genres = [
      { title: "Action & Adventure", filter: "/genre/action-adventure" },
      { title: "Comedy", filter: "/genre/comedy" },
      { title: "Drama", filter: "/genre/drama" },
      { title: "Romance", filter: "/genre/romance" },
      { title: "Crime", filter: "/genre/crime" },
      { title: "Sci-Fi", filter: "/genre/sci-fi" },
      { title: "Thriller", filter: "/genre/thriller" },
      { title: "4K", filter: "/genre/4k" }
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
    getBaseUrl = (providerValue3) => __async(null, null, function* () {
      var _a, _b;
      try {
        const providerUrls = yield fetchProviderUrls();
        return (_b = (_a = providerUrls[providerValue3]) == null ? void 0 : _a.url) != null ? _b : "";
      } catch (error) {
        console.error(`Error fetching baseUrl: ${providerValue3}`, error);
        throw error;
      }
    });
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

// providers/cinefreak/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function toPath(link, baseUrl) {
  try {
    const url = new URL(link, baseUrl);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch (e) {
    return link;
  }
}
function fetchPosts(url, baseUrl, signal, providerContext) {
  return __async(this, null, function* () {
    const { axios, cheerio, commonHeaders } = providerContext;
    try {
      const response = yield axios.get(url, {
        headers: __spreadProps(__spreadValues({}, commonHeaders), {
          Referer: `${baseUrl}/`
        }),
        signal
      });
      const $ = cheerio.load(response.data || "");
      const posts = [];
      $(".movie-card").each((_, element) => {
        var _a, _b, _c;
        const card = $(element);
        const link = card.attr("href") || card.find("a").attr("href") || "";
        const image = card.find("img").attr("src") || card.find("img").attr("data-src") || "";
        const title = card.find(".movie-card-title").text().replace(/\s+/g, " ").trim() || ((_b = (_a = card.attr("aria-label")) == null ? void 0 : _a.replace(/ details$/i, "")) == null ? void 0 : _b.trim()) || ((_c = card.find("img").attr("alt")) == null ? void 0 : _c.trim()) || "";
        if (title && link) {
          posts.push({
            title,
            link: toPath(link, baseUrl),
            image
          });
        }
      });
      return posts;
    } catch (error) {
      throwProviderError("CineFreak", "posts", error);
      return [];
    }
  });
}
function getPosts(_0) {
  return __async(this, arguments, function* ({
    filter,
    page,
    signal,
    providerContext
  }) {
    const baseUrl = (yield getBaseUrl(providerValue)) || defaultBaseUrl;
    const cleanFilter = filter ? filter.replace(/\/+$/, "") : "";
    const pageUrl = page <= 1 ? `${baseUrl}${cleanFilter}/` : `${baseUrl}${cleanFilter}/page/${page}/`;
    return fetchPosts(pageUrl, baseUrl, signal, providerContext);
  });
}
function getSearchPosts(_0) {
  return __async(this, arguments, function* ({
    searchQuery,
    page,
    signal,
    providerContext
  }) {
    const baseUrl = (yield getBaseUrl(providerValue)) || defaultBaseUrl;
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    const searchUrl = page <= 1 ? `${baseUrl}/?s=${encodedQuery}` : `${baseUrl}/page/${page}/?s=${encodedQuery}`;
    return fetchPosts(searchUrl, baseUrl, signal, providerContext);
  });
}
var providerValue, defaultBaseUrl;
var init_posts = __esm({
  "providers/cinefreak/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    providerValue = "cinefreak";
    defaultBaseUrl = "https://cinefreak.net";
  }
});

// providers/getCinemetaMeta.ts
function isCinemetaPromise(value) {
  return typeof value.then === "function";
}
function getCache2() {
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
  const cache = getCache2();
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

// providers/cinefreak/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function cleanQuality(text) {
  const match = text.match(/\b(480p|720p|1080p|2160p|4k)\b/i);
  if (match) return match[1].toLowerCase();
  return "";
}
function decodeCinefreakLink(link, baseUrl) {
  try {
    if (link.includes("generate.php") && link.includes("id=")) {
      const urlObj = new URL(link, baseUrl);
      const rawId = urlObj.searchParams.get("id") || "";
      if (rawId) {
        let decoded = "";
        try {
          decoded = atob(rawId);
        } catch (e) {
          decoded = Buffer.from(rawId, "base64").toString("utf8");
        }
        if (decoded.startsWith("http")) {
          return decoded.replace(/newgo\d*$/i, "");
        }
      }
    }
  } catch (e) {
  }
  try {
    return new URL(link, baseUrl).href;
  } catch (e) {
    return link;
  }
}
var providerValue2, defaultBaseUrl2, getMeta;
var init_meta = __esm({
  "providers/cinefreak/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    init_getCinemetaMeta();
    init_theintrodb();
    init_providerErrors();
    providerValue2 = "cinefreak";
    defaultBaseUrl2 = "https://cinefreak.net";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b, _c;
        const { axios, cheerio, commonHeaders } = providerContext;
        try {
          const baseUrl = (yield getBaseUrl(providerValue2)) || defaultBaseUrl2;
          const url = new URL(link, baseUrl).href;
          const response = yield axios.get(url, {
            headers: __spreadProps(__spreadValues({}, commonHeaders), {
              Referer: `${baseUrl}/`
            })
          });
          const $ = cheerio.load(response.data || "");
          const rawTitle = $("h1.page-title, .page-title").first().text().replace(/\s+/g, " ").trim() || $("title").text().split("|")[0].trim();
          const title = rawTitle.replace(/Download\s*|Watch Online\s*/gi, "").replace(/\s*–\s*CineFreak.*$/i, "").replace(/\s*\|\s*CineFreak.*$/i, "").replace(/–\s*GDrive.*$/i, "").replace(/\|\s*GDrive.*$/i, "").replace(/\s*&\s*Watch Online.*$/i, "").replace(/\s*\|\s*Full Movie.*$/i, "").replace(/\s*Full Movie.*$/i, "").replace(/\s*\[.*?\]/g, "").replace(/\s*\|\s*$/g, "").replace(/\s*&\s*$/g, "").replace(/\s+/g, " ").trim();
          const image = $(".poster-image img, .content-sidebar img, .poster-container img").first().attr("src") || $('meta[property="og:image"]').attr("content") || "";
          let synopsis = "";
          $(".entry-content p").each((_, el) => {
            const text = $(el).text().trim();
            if (text && !text.includes("IMDb Rating") && !text.includes("Movie Details") && !text.includes("Series Info") && !text.includes("Screenshots") && !text.includes("Download") && !synopsis) {
              synopsis = text;
            }
          });
          let imdbId = "";
          const imdbLink = $('a[href*="imdb.com/title/"]').attr("href") || "";
          const imdbMatch = imdbLink.match(/tt\d+/i) || response.data.match(/tt\d+/i);
          if (imdbMatch) {
            imdbId = imdbMatch[0];
          } else {
            const tmdbLink = $('a[href*="themoviedb.org/"]').attr("href") || "";
            const tmdbMatch = tmdbLink.match(/themoviedb\.org\/(tv|movie)\/(\d+)/i);
            if (tmdbMatch) {
              const tmdbType = tmdbMatch[1] === "tv" ? "tv" : "movie";
              const tmdbNum = tmdbMatch[2];
              try {
                const tmdbRes = yield axios.get(
                  `https://api.themoviedb.org/3/${tmdbType}/${tmdbNum}/external_ids?api_key=cfe422613b250f702980a3bbf9e90716`,
                  { timeout: 5e3 }
                );
                if ((_a = tmdbRes.data) == null ? void 0 : _a.imdb_id) {
                  imdbId = tmdbRes.data.imdb_id;
                }
              } catch (e) {
                console.warn(`CineFreak: Failed to resolve TMDb to IMDb via API: ${e.message}`);
              }
            }
          }
          const hasEpisodeCards = $(".ep-card").length > 0;
          const isSeries = hasEpisodeCards || /\b(season\s*\d+|s\d+|complete\s+series|all\s+episodes|episode\s*\d+|k-drama|c-drama|drama\s+series|web\s+series)\b/i.test(rawTitle) || /-full-series-download|-season-\d+/i.test(url);
          const linkList = [];
          if (hasEpisodeCards) {
            const seasonMap = {};
            $(".ep-card").each((_, epElement) => {
              var _a2, _b2;
              const card = $(epElement);
              const seasonText = card.find(".season-number").text().trim();
              const seasonNum = ((_a2 = seasonText.match(/\d+/)) == null ? void 0 : _a2[0]) || "1";
              const seasonName = `Season ${parseInt(seasonNum, 10)}`;
              const epBadgeText = card.find(".episode-badge").text().trim();
              const epNumMatch = (_b2 = epBadgeText.match(/\d+/)) == null ? void 0 : _b2[0];
              const episodeTitle = epNumMatch ? `EPISODE ${parseInt(epNumMatch, 10)}` : epBadgeText || "EPISODE 1";
              if (!seasonMap[seasonName]) {
                seasonMap[seasonName] = {};
              }
              card.find(".download-links .quality-grid a, .quality-box.download-links a").each((_2, qEl) => {
                const qAnchor = $(qEl);
                const qText = qAnchor.text().trim();
                const quality = cleanQuality(qText) || "720p";
                const qHref = qAnchor.attr("href") || "";
                if (!qHref) return;
                const fullLink = decodeCinefreakLink(qHref, baseUrl);
                if (!seasonMap[seasonName][quality]) {
                  seasonMap[seasonName][quality] = [];
                }
                const exists = seasonMap[seasonName][quality].some(
                  (ep) => ep.title === episodeTitle
                );
                if (!exists) {
                  seasonMap[seasonName][quality].push({
                    title: episodeTitle,
                    link: fullLink,
                    type: "series"
                  });
                }
              });
            });
            for (const [seasonName, qualityObj] of Object.entries(seasonMap)) {
              const qualityKeys = Object.keys(qualityObj);
              for (const quality of qualityKeys) {
                const directLinks = qualityObj[quality];
                directLinks.sort((a, b) => {
                  const numA = parseInt(a.title.replace(/\D+/g, "") || "0", 10);
                  const numB = parseInt(b.title.replace(/\D+/g, "") || "0", 10);
                  return numA - numB;
                });
                linkList.push({
                  title: qualityKeys.length > 1 ? `${seasonName} - ${quality}` : seasonName,
                  quality,
                  directLinks
                });
              }
            }
          }
          if (linkList.length === 0) {
            $(".download-links-div h4.movie-title, .download-links-div h3.movie-title, .download-links-div h4, .download-links-div h3").each(
              (_, headingEl) => {
                const heading = $(headingEl);
                const headingText = heading.text().replace(/\s+/g, " ").trim();
                const quality = cleanQuality(headingText);
                const container = heading.nextAll(".dlbtn-container").first();
                const directLinks = [];
                container.find("a[href]").each((_2, aEl) => {
                  const btn = $(aEl);
                  const href = btn.attr("href");
                  if (!href) return;
                  const fullLink = decodeCinefreakLink(href, baseUrl);
                  const btnText = btn.text().replace(/\s+/g, " ").trim() || "Download";
                  directLinks.push({
                    title: isSeries ? btnText.includes("Watch") ? "Watch Online" : "Download" : "Movie",
                    link: fullLink,
                    type: isSeries ? "series" : "movie"
                  });
                });
                if (directLinks.length > 0) {
                  linkList.push({
                    title: headingText || `${quality || "Default"} Links`,
                    quality: quality || void 0,
                    directLinks
                  });
                }
              }
            );
          }
          if (linkList.length === 0) {
            const fallbackLinks = [];
            $('a[href*="generate.php"]').each((_, el) => {
              const href = $(el).attr("href");
              if (href) {
                const btnText = $(el).text().replace(/\s+/g, " ").trim() || "Download";
                fallbackLinks.push({
                  title: isSeries ? btnText.includes("Watch") ? "Watch Online" : "Download" : "Movie",
                  link: decodeCinefreakLink(href, baseUrl),
                  type: isSeries ? "series" : "movie"
                });
              }
            });
            if (fallbackLinks.length > 0) {
              linkList.push({
                title: isSeries ? "Episodes" : "Movie",
                directLinks: fallbackLinks
              });
            }
          }
          const quickDownload = yield (_b = providerContext.kvStore) == null ? void 0 : _b.get(
            "cinefreak_quickDownload"
          );
          let info = {
            title,
            image,
            synopsis,
            imdbId: imdbId || "",
            type: isSeries ? "series" : "movie",
            quickDownload: quickDownload != null ? quickDownload : true,
            linkList
          };
          if (imdbId && /^tt\d+$/.test(imdbId)) {
            try {
              const cinemeta = yield getCinemetaMeta(
                imdbId,
                info.type,
                providerContext
              );
              if (cinemeta) {
                info = applyCinemetaMeta(info, cinemeta);
                if (cinemeta.videos && info.linkList) {
                  const skipTimings = yield (_c = providerContext.kvStore) == null ? void 0 : _c.get("cinefreak_skipTimings");
                  info.linkList = yield Promise.all(
                    info.linkList.map((linkGroup) => __async(null, null, function* () {
                      var _a2;
                      if (linkGroup.directLinks) {
                        const seasonNum = parseInt(
                          ((_a2 = linkGroup.title.match(/season\s*(\d+)/i)) == null ? void 0 : _a2[1]) || "1",
                          10
                        );
                        let enriched = enrichCinemetaEpisodes(
                          linkGroup.directLinks,
                          cinemeta.videos || [],
                          seasonNum
                        );
                        if (skipTimings != null ? skipTimings : true) {
                          enriched = yield enrichEpisodesWithSkipTimings(
                            enriched,
                            imdbId,
                            seasonNum,
                            providerContext
                          );
                        }
                        return __spreadProps(__spreadValues({}, linkGroup), {
                          directLinks: enriched
                        });
                      }
                      return linkGroup;
                    }))
                  );
                }
              }
            } catch (e) {
            }
          }
          return info;
        } catch (error) {
          throwProviderError("CineFreak", "meta", error);
        }
      });
    };
  }
});

// providers/cinefreak/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function decodeBase64Safe(str) {
  try {
    return atob(str);
  } catch (e) {
    try {
      return Buffer.from(str, "base64").toString("utf8");
    } catch (e2) {
      return str;
    }
  }
}
function resolveCinecloudUrl(link) {
  try {
    if (link.includes("generate.php") && link.includes("id=")) {
      const urlObj = new URL(link);
      const rawId = urlObj.searchParams.get("id") || "";
      if (rawId) {
        const decoded = decodeBase64Safe(rawId);
        if (decoded.startsWith("http")) {
          const cleaned = decoded.replace(/newgo\d*$/i, "");
          return cleaned;
        }
      }
    }
  } catch (e) {
  }
  return link;
}
function followRedirect(link, headers, signal, cheerio) {
  return __async(this, null, function* () {
    var _a, _b;
    const newLinkRes = yield fetch(link, {
      method: "GET",
      headers,
      signal,
      redirect: "manual"
    });
    let newLink = link;
    if (newLinkRes.status >= 300 && newLinkRes.status < 400) {
      newLink = newLinkRes.headers.get("location") || link;
    } else if (newLinkRes.status === 200) {
      try {
        const html = yield newLinkRes.text();
        const $ = cheerio.load(html);
        let instantLink = $("a.instant-download, a.download-btn, a.fsl-btn, a.server-btn").attr("href");
        if (!instantLink) {
          instantLink = $("a.btn-success").attr("href");
        }
        if (instantLink && instantLink !== "#") {
          newLink = instantLink;
        }
      } catch (e) {
        console.warn("followRedirect: failed to parse 200 body", e);
      }
    } else if (newLinkRes.url && newLinkRes.url !== link) {
      newLink = newLinkRes.url;
    } else {
      newLink = newLinkRes.headers.get("location") || link;
    }
    if (newLink.startsWith("/")) {
      const url = new URL(link);
      newLink = `${url.origin}${newLink}`;
    }
    if (newLink.includes("googleusercontent")) {
      newLink = newLink.split("?link=")[1] || newLink;
    } else if (newLink !== link) {
      const newLinkRes2 = yield fetch(newLink, {
        method: "GET",
        headers,
        signal,
        redirect: "manual"
      });
      if (newLinkRes2.status >= 300 && newLinkRes2.status < 400) {
        newLink = ((_a = newLinkRes2.headers.get("location")) == null ? void 0 : _a.split("?link=")[1]) || newLink;
      } else if (newLinkRes2.url && newLinkRes2.url !== newLink) {
        newLink = newLinkRes2.url.split("?link=")[1] || newLinkRes2.url;
      } else {
        newLink = ((_b = newLinkRes2.headers.get("location")) == null ? void 0 : _b.split("?link=")[1]) || newLink;
      }
    }
    return newLink;
  });
}
function getStream(_0) {
  return __async(this, arguments, function* ({
    link,
    type,
    signal,
    providerContext,
    isDownload
  }) {
    var _a, _b, _c, _d;
    const { axios, cheerio, commonHeaders } = providerContext;
    try {
      let targetLink = resolveCinecloudUrl(link);
      if (targetLink.includes("generate.php")) {
        try {
          const res = yield axios.get(targetLink, {
            headers: commonHeaders,
            signal
          });
          const match = (_a = res.data) == null ? void 0 : _a.match(
            /window\.location\.href\s*=\s*["'](https?:\/\/[^"']+)["']/i
          );
          if (match == null ? void 0 : match[1]) {
            targetLink = match[1];
          }
        } catch (e) {
          console.warn("CineFreak: Failed to resolve generate.php via fetch", e);
        }
      }
      const streamLinks = [];
      let baseUrl = "";
      try {
        baseUrl = new URL(targetLink).origin;
      } catch (e) {
        baseUrl = "https://new5.cinecloud.site";
      }
      const idMatch = targetLink.match(/\/(?:x|f|d|w|gp)\/([a-zA-Z0-9]+)/);
      const id = idMatch ? idMatch[1] : "";
      const mainPageUrl = id ? `${baseUrl}/f/${id}` : targetLink;
      let pageHtml = "";
      try {
        const res = yield axios.get(mainPageUrl, {
          headers: commonHeaders,
          signal
        });
        pageHtml = res.data;
      } catch (e) {
        if (((_b = e.response) == null ? void 0 : _b.status) === 403 && providerContext.openWebView) {
          const cleanHeaders = __spreadProps(__spreadValues({}, commonHeaders), { Referer: baseUrl });
          delete cleanHeaders["User-Agent"];
          delete cleanHeaders["sec-ch-ua"];
          delete cleanHeaders["sec-ch-ua-mobile"];
          delete cleanHeaders["sec-ch-ua-platform"];
          delete cleanHeaders["Cookie"];
          const wafResult = yield providerContext.openWebView(baseUrl, {
            title: "Solve the captcha below and click done",
            description: "Required to bypass anti-bot protection.",
            headers: cleanHeaders,
            waitForCookie: "cf_clearance",
            force: true
          });
          if (wafResult.userAgent) commonHeaders["User-Agent"] = wafResult.userAgent;
          commonHeaders["Cookie"] = (commonHeaders["Cookie"] ? commonHeaders["Cookie"] + "; " : "") + wafResult.cookies;
          const retryRes = yield axios.get(mainPageUrl, { headers: commonHeaders, signal });
          pageHtml = retryRes.data;
        } else {
          throw e;
        }
      }
      const $ = cheerio.load(pageHtml);
      const linkElements = $(".server-btn");
      for (const el of linkElements) {
        const btn = $(el);
        let href = btn.attr("href") || "";
        if (!href || href === "#") continue;
        if (href.startsWith("/")) {
          href = `${baseUrl}${href}`;
        }
        const text = btn.text().trim().toLowerCase();
        try {
          if (href.includes(".dev") && !href.includes("/?id=")) {
            streamLinks.push({ server: "Fast Cloud", link: href, type: "mkv" });
          } else if (href.includes("/w/") || href.includes("/gp/") || text.includes("instant download")) {
            const newLink = yield followRedirect(href, commonHeaders, signal, cheerio);
            if (newLink && newLink !== href) {
              streamLinks.push({
                server: text.includes("v2") || href.includes("/gp/") ? "Instant V2 (download only)" : "Instant (download only)",
                link: newLink,
                type: "mkv"
              });
            }
          } else if (href.includes("/d/") || text.includes("cloud [resumable]")) {
            let dPageHtml = "";
            try {
              const dPageRes = yield axios.get(href, { headers: commonHeaders, signal });
              dPageHtml = dPageRes.data;
            } catch (e) {
              if (((_c = e.response) == null ? void 0 : _c.status) === 403 && providerContext.openWebView) {
                const retryRes = yield axios.get(href, { headers: commonHeaders, signal });
                dPageHtml = retryRes.data;
              }
            }
            if (dPageHtml && !dPageHtml.includes("File not Found") && !dPageHtml.includes("cannot be found")) {
              const $dPage = cheerio.load(dPageHtml);
              let dPageLink = $dPage("a.download-now, a.btn-warning, a:contains('Download Now')").attr("href");
              if (dPageLink && (dPageLink.includes("/x/") || dPageLink.includes("/w/") || dPageLink.includes("/gp/") || dPageLink === "#")) {
                dPageLink = null;
              }
              if (!dPageLink) {
                $dPage("a[href]").each((_, aEl) => {
                  const h = $dPage(aEl).attr("href") || "";
                  if (h.includes("cloudflarestorage") || h.includes(".r2.dev") || h.includes("response-content-disposition")) {
                    dPageLink = h;
                  }
                });
              }
              if (!dPageLink) {
                const match = dPageHtml.match(/https?:\/\/[^\s"'<>]*(?:cloudflarestorage|r2\.dev)[^\s"'<>]*/);
                if (match) {
                  dPageLink = match[0];
                }
              }
              if (dPageLink && dPageLink.startsWith("http") && !dPageLink.includes("/x/")) {
                streamLinks.push({ server: "Cloud Resumable", link: dPageLink, type: "mkv" });
              }
            }
          } else if (href.includes("/x/") || text.includes("stream online")) {
            try {
              const xRes = yield axios.get(href, { headers: commonHeaders, signal });
              const $x = cheerio.load(xRes.data);
              const iframeSrc = $x("iframe").attr("src");
              if (iframeSrc) {
                const u = new URL(iframeSrc.startsWith("//") ? "https:" + iframeSrc : iframeSrc);
                const rawId = u.searchParams.get("id");
                if (rawId && rawId.startsWith("http")) {
                  streamLinks.push({ server: "Stream Online", link: rawId, type: "mkv" });
                }
              }
            } catch (err) {
            }
          }
        } catch (error) {
          console.warn(`Cinefreak extraction error for ${href}:`, error);
        }
      }
      let preferredServer = "auto";
      try {
        preferredServer = ((yield (_d = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _d.get("cinefreak_preferredDownloadServer")) || "auto").toLowerCase().trim();
      } catch (e) {
      }
      const getPriority = (server = "") => {
        const s = server.toLowerCase();
        if (isDownload && preferredServer !== "auto" && preferredServer !== "" && s.includes(preferredServer)) {
          return 0;
        }
        if (isDownload) {
          if (s.includes("fast cloud")) return 1;
          if (s.includes("resumable")) return 2;
          if (s.includes("instant (download only)")) return 3;
          if (s.includes("instant v2")) return 4;
          if (s.includes("stream online")) return 5;
        } else {
          if (s.includes("fast cloud")) return 1;
          if (s.includes("stream online")) return 2;
          if (s.includes("resumable")) return 3;
          if (s.includes("instant (download only)")) return 4;
          if (s.includes("instant v2")) return 5;
        }
        return 6;
      };
      streamLinks.sort((a, b) => getPriority(a.server) - getPriority(b.server));
      if (isDownload && streamLinks.length > 0) {
        const checkHealth = (linkUrl) => __async(null, null, function* () {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4e3);
            if (signal) {
              signal.addEventListener("abort", () => controller.abort(), { once: true });
            }
            const res = yield fetch(linkUrl, {
              method: "HEAD",
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
              },
              signal: controller.signal,
              redirect: "follow"
            });
            clearTimeout(timeoutId);
            if (res.status >= 200 && res.status < 400) return true;
            if (res.status === 405 || res.status === 403) {
              const getController = new AbortController();
              const getTimeoutId = setTimeout(() => getController.abort(), 4e3);
              if (signal) {
                signal.addEventListener("abort", () => getController.abort(), { once: true });
              }
              const getRes = yield fetch(linkUrl, {
                method: "GET",
                headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                  Range: "bytes=0-0"
                },
                signal: getController.signal
              });
              clearTimeout(getTimeoutId);
              return getRes.status >= 200 && getRes.status < 400;
            }
            return false;
          } catch (e) {
            return false;
          }
        });
        const isTopHealthy = yield checkHealth(streamLinks[0].link);
        if (!isTopHealthy) {
          let healthyIndex = -1;
          for (let i = 1; i < streamLinks.length; i++) {
            const isHealthy = yield checkHealth(streamLinks[i].link);
            if (isHealthy) {
              healthyIndex = i;
              break;
            }
          }
          if (healthyIndex > 0) {
            const [workingStream] = streamLinks.splice(healthyIndex, 1);
            streamLinks.unshift(workingStream);
          }
        }
      }
      return streamLinks;
    } catch (error) {
      throwProviderError("CineFreak", "stream", error);
      return [];
    }
  });
}
var init_stream = __esm({
  "providers/cinefreak/stream.ts"() {
    "use strict";
    init_providerErrors();
  }
});

// providers/cinefreak/cinefreak.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
