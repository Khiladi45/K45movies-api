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

// providers/topmovies/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/topmovies/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Latest",
        filter: ""
      },
      {
        title: "Netflix",
        filter: "/web-series/tv-shows-by-network/netflix"
      },
      {
        title: "Hotstar",
        filter: "/web-series/tv-shows-by-network/hotstar"
      },
      {
        title: "Amazon Prime",
        filter: "/web-series/tv-shows-by-network/amazon-prime-video"
      }
    ];
    genres = [
      {
        title: "Apple TV+",
        filter: "/ott/apple-tv"
      },
      {
        title: "Disney+",
        filter: "/ott/disney-plus"
      },
      {
        title: "Hulu",
        filter: "/ott/hulu"
      },
      {
        title: "Crunchyroll",
        filter: "/ott/crunchyroll"
      },
      {
        title: "Action",
        filter: "/movies-by-genre/action/"
      },
      {
        title: "Adventure",
        filter: "/movies-by-genre/adventure/"
      },
      {
        title: "Animation",
        filter: "/movies-by-genre/animated/"
      },
      {
        title: "Comedy",
        filter: "/movies-by-genre/comedy/"
      },
      {
        title: "Crime",
        filter: "/movies-by-genre/crime/"
      },
      {
        title: "Documentary",
        filter: "/movies-by-genre/documentary/"
      },
      {
        title: "Fantasy",
        filter: "/movies-by-genre/fantasy/"
      },
      {
        title: "Horror",
        filter: "/movies-by-genre/horror/"
      },
      {
        title: "Mystery",
        filter: "/movies-by-genre/mystery/"
      },
      {
        title: "Romance",
        filter: "/movies-by-genre/romance/"
      },
      {
        title: "Thriller",
        filter: "/movies-by-genre/thriller/"
      },
      {
        title: "Sci-Fi",
        filter: "/movies-by-genre/sci-fi/"
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
    urlsEndpoint = "https://raw.githubusercontent.com/Khiladi45/K45movies-api/main/urls.json";
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

// providers/topmovies/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function fetchWithRetry(axios, url, config, retries = 2) {
  return __async(this, null, function* () {
    var _a;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return yield axios.get(url, config);
      } catch (err) {
        if ((err.code === "ECONNRESET" || ((_a = err.message) == null ? void 0 : _a.includes("ECONNRESET"))) && attempt < retries) {
          yield new Promise((r) => setTimeout(r, 400));
          continue;
        }
        throw err;
      }
    }
  });
}
function posts(baseUrl, url, signal, providerContext, operation) {
  return __async(this, null, function* () {
    try {
      const { axios, cheerio, commonHeaders } = providerContext;
      const res = yield fetchWithRetry(axios, url, { headers: commonHeaders, signal });
      const data = res.data;
      const $ = cheerio.load(data);
      const catalog2 = [];
      $(".post-cards").find("article").map((i, element) => {
        const title = $(element).find("a").attr("title");
        const link = $(element).find("a").attr("href");
        const image = $(element).find("img").attr("data-src") || $(element).find("img").attr("src") || "";
        if (title && link) {
          catalog2.push({
            title: title.replace("Download", "").trim(),
            link: (() => {
              const postUrl = new URL(link, `${baseUrl}/`);
              return `${postUrl.pathname}${postUrl.search}${postUrl.hash}`;
            })(),
            image
          });
        }
      });
      return catalog2;
    } catch (err) {
      throwProviderError("TopMovies", operation, err);
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/topmovies/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const baseUrl = yield getBaseUrl("Topmovies");
        const url = `${baseUrl + filter}/page/${page}/`;
        return posts(baseUrl, url, signal, providerContext, "posts");
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        const baseUrl = yield getBaseUrl("Topmovies");
        const url = `${baseUrl}/search/${searchQuery}/page/${page}/`;
        return posts(baseUrl, url, signal, providerContext, "search posts");
      });
    };
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
    const cache = getCache2();
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
function getCinemetaSeason(value) {
  if (/\bseason\s*:?\s*\d{1,2}\s*[-–&/]\s*(?:season\s*:?\s*)?\d{1,2}\b/i.test(
    value
  )) {
    return void 0;
  }
  const matches = [
    ...value.matchAll(/\bseason\s*:?\s*(\d{1,2})\b/gi),
    ...value.matchAll(/\bs(\d{1,2})(?=\s*e\d|\b)/gi)
  ].map((match) => Number(match[1]));
  const seasons = [...new Set(matches.filter((season) => season > 0))];
  return seasons.length === 1 ? seasons[0] : void 0;
}
function addCinemetaContext(url, imdbId, season) {
  const parsedUrl = new URL(url);
  parsedUrl.hash = `${CONTEXT_KEY}=${encodeURIComponent(
    JSON.stringify({ imdbId, season })
  )}`;
  return parsedUrl.href;
}
function readCinemetaContext(url) {
  const parsedUrl = new URL(url);
  const encoded = new URLSearchParams(parsedUrl.hash.slice(1)).get(CONTEXT_KEY);
  parsedUrl.hash = "";
  if (!encoded) return { requestUrl: parsedUrl.href };
  try {
    const context = JSON.parse(decodeURIComponent(encoded));
    if (/^tt\d+$/.test(context.imdbId) && Number.isInteger(context.season)) {
      return {
        requestUrl: parsedUrl.href,
        imdbId: context.imdbId,
        season: context.season
      };
    }
  } catch (e) {
    return { requestUrl: parsedUrl.href };
  }
  return { requestUrl: parsedUrl.href };
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
var CINEMETA_BASE_URL, CONTEXT_KEY;
var init_getCinemetaMeta = __esm({
  "providers/getCinemetaMeta.ts"() {
    "use strict";
    CINEMETA_BASE_URL = "https://v3-cinemeta.strem.io/meta";
    CONTEXT_KEY = "cinemetaMeta";
  }
});

// providers/topmovies/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/topmovies/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_getCinemetaMeta();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b;
        try {
          const { axios, cheerio, commonHeaders } = providerContext;
          const baseUrl = yield getBaseUrl("Topmovies");
          const url = new URL(link, `${baseUrl}/`).href;
          let res;
          for (let attempt = 0; attempt <= 2; attempt++) {
            try {
              res = yield axios.get(url, { headers: commonHeaders });
              break;
            } catch (err) {
              if ((err.code === "ECONNRESET" || ((_a = err.message) == null ? void 0 : _a.includes("ECONNRESET"))) && attempt < 2) {
                yield new Promise((r) => setTimeout(r, 400));
                continue;
              }
              throw err;
            }
          }
          const data = res.data;
          const $ = cheerio.load(data);
          const meta = {
            title: $(".imdbwp__title").text(),
            synopsis: $(".imdbwp__teaser").text(),
            image: $(".imdbwp__thumb").find("img").attr("src") || "",
            imdbId: ((_b = $(".imdbwp__link").attr("href")) == null ? void 0 : _b.split("/")[4]) || "",
            type: $(".thecontent").text().toLocaleLowerCase().includes("season") ? "series" : "movie",
            linkList: [],
            webUrl: url
          };
          const links = [];
          $("h3,h4").map((i, element) => {
            var _a2;
            const seriesTitle = $(element).text();
            const episodesLink = $(element).next("p").find(
              ".maxbutton-episode-links,.maxbutton-g-drive,.maxbutton-af-download"
            ).attr("href");
            const movieLink = $(element).next("p").find(".maxbutton-download-links").attr("href");
            if (movieLink || episodesLink && episodesLink !== "javascript:void(0);") {
              links.push({
                title: seriesTitle.replace("Download ", "").trim() || "Download",
                episodesLink: episodesLink || "",
                directLinks: movieLink ? [{ link: movieLink, title: "Movie", type: "movie" }] : [],
                quality: ((_a2 = seriesTitle == null ? void 0 : seriesTitle.match(/\d+p\b/)) == null ? void 0 : _a2[0]) || ""
              });
            }
          });
          const imdbId = meta.imdbId;
          meta.linkList = links;
          if (!imdbId) return meta;
          try {
            const cinemeta = yield getCinemetaMeta(imdbId, meta.type, providerContext);
            if (cinemeta) {
              if (meta.type === "series" && cinemeta.type === "series") {
                meta.linkList = meta.linkList.map((item) => {
                  if (!item.episodesLink) return item;
                  const season = getCinemetaSeason(item.title) || getCinemetaSeason(meta.title);
                  if (!season) return item;
                  return __spreadProps(__spreadValues({}, item), {
                    episodesLink: addCinemetaContext(
                      new URL(item.episodesLink, url).href,
                      imdbId,
                      season
                    )
                  });
                });
              }
              return applyCinemetaMeta(meta, cinemeta);
            }
          } catch (e) {
            console.warn("TopMovies: Cinemeta lookup failed", e);
          }
          return meta;
        } catch (err) {
          throwProviderError("TopMovies", "metadata", err);
        }
      });
    };
  }
});

// providers/extractors/gofile.ts
function getOrFetchGenerateWT(axios) {
  return __async(this, null, function* () {
    const now = Date.now();
    if (cachedGenerateWT && now - cachedWTTime < 3 * 60 * 60 * 1e3) {
      return cachedGenerateWT;
    }
    try {
      const res = yield axios.get("https://gofile.io/js/wt.obf.js", {
        headers: {
          "User-Agent": GOFILE_USER_AGENT,
          Referer: "https://gofile.io/"
        }
      });
      const code = res.data;
      const runner = new Function(
        "navigator",
        "window",
        "document",
        "location",
        `${code}
return generateWT;`
      );
      const fakeNav = {
        userAgent: GOFILE_USER_AGENT,
        language: GOFILE_LANGUAGE
      };
      const fakeWin = {
        navigator: fakeNav,
        location: {
          href: "https://gofile.io/",
          protocol: "https:",
          host: "gofile.io"
        }
      };
      const generateWT = runner(fakeNav, fakeWin, {}, fakeWin.location);
      if (typeof generateWT === "function") {
        cachedGenerateWT = generateWT;
        cachedWTTime = now;
        return generateWT;
      }
    } catch (err) {
      console.warn("gofile: failed to fetch/execute wt.obf.js:", (err == null ? void 0 : err.message) || err);
    }
    return (accountToken) => accountToken;
  });
}
function getOrFetchToken(axios, providerContext) {
  return __async(this, null, function* () {
    var _a, _b;
    if (cachedAccountToken) return cachedAccountToken;
    const kvStore = providerContext == null ? void 0 : providerContext.kvStore;
    try {
      const saved = yield kvStore == null ? void 0 : kvStore.get("gofile_account_token");
      if (saved && typeof saved === "string") {
        cachedAccountToken = saved;
        return saved;
      }
    } catch (e) {
    }
    const accountResponse = yield axios.post(
      `${GOFILE_API}/accounts`,
      {},
      {
        headers: {
          "User-Agent": GOFILE_USER_AGENT,
          Origin: "https://gofile.io",
          Referer: "https://gofile.io/"
        }
      }
    );
    const token = (_b = (_a = accountResponse.data) == null ? void 0 : _a.data) == null ? void 0 : _b.token;
    if (!token) throw new Error("Gofile did not return an account token");
    cachedAccountToken = token;
    try {
      yield kvStore == null ? void 0 : kvStore.set("gofile_account_token", token);
    } catch (e) {
    }
    return token;
  });
}
function findFirstFile(content) {
  var _a;
  if ((content == null ? void 0 : content.type) === "file" && (content == null ? void 0 : content.link)) return content;
  for (const child of Object.values((_a = content == null ? void 0 : content.children) != null ? _a : {})) {
    const file = findFirstFile(child);
    if (file) return file;
  }
  return void 0;
}
function gofileExtractor(id, axios, providerContext) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      const token = yield getOrFetchToken(axios, providerContext);
      const generateWT = yield getOrFetchGenerateWT(axios);
      const websiteToken = generateWT(token);
      const response = yield axios.get(`${GOFILE_API}/contents/${id}`, {
        params: {
          contentFilter: "",
          page: 1,
          pageSize: 1e3,
          sortField: "name",
          sortDirection: 1
        },
        headers: {
          Accept: "*/*",
          "Accept-Language": `${GOFILE_LANGUAGE},en;q=0.9`,
          Authorization: `Bearer ${token}`,
          Origin: "https://gofile.io",
          Referer: "https://gofile.io/",
          "User-Agent": GOFILE_USER_AGENT,
          "X-BL": GOFILE_LANGUAGE,
          "X-Website-Token": websiteToken
        }
      });
      if (((_a = response.data) == null ? void 0 : _a.status) !== "ok") {
        if (((_b = response.data) == null ? void 0 : _b.status) === "error-auth" || response.status === 401) {
          cachedAccountToken = null;
          try {
            yield (_c = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _c.delete("gofile_account_token");
          } catch (e) {
          }
        }
        throw new Error(
          `Gofile API returned ${(_e = (_d = response.data) == null ? void 0 : _d.status) != null ? _e : "invalid data"}`
        );
      }
      const file = findFirstFile(response.data.data);
      if (!(file == null ? void 0 : file.link)) throw new Error("No downloadable file found in Gofile response");
      return { link: file.link, token };
    } catch (error) {
      if (((_f = error == null ? void 0 : error.response) == null ? void 0 : _f.status) === 401) {
        cachedAccountToken = null;
        try {
          yield (_g = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _g.delete("gofile_account_token");
        } catch (e) {
        }
      }
      throwProviderError("Gofile", `extract ${id}`, error);
    }
  });
}
var GOFILE_API, GOFILE_LANGUAGE, GOFILE_USER_AGENT, cachedAccountToken, cachedGenerateWT, cachedWTTime;
var init_gofile = __esm({
  "providers/extractors/gofile.ts"() {
    "use strict";
    init_providerErrors();
    GOFILE_API = "https://api.gofile.io";
    GOFILE_LANGUAGE = "en-US";
    GOFILE_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
    cachedAccountToken = null;
    cachedGenerateWT = null;
    cachedWTTime = 0;
  }
});

// providers/extractors/hubcloud.ts
function resolveGofileLink(gofileLink, axios, providerContext) {
  return __async(this, null, function* () {
    try {
      const gofileUrl = new URL(gofileLink);
      const id = gofileUrl.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;
      const gfResult = yield gofileExtractor(id, axios, providerContext);
      if (!(gfResult == null ? void 0 : gfResult.link) || !(gfResult == null ? void 0 : gfResult.token)) return null;
      return {
        server: "Gofile",
        link: gfResult.link,
        type: "mkv",
        headers: {
          Referer: "https://gofile.io/",
          Cookie: `accountToken=${gfResult.token}`
        }
      };
    } catch (error) {
      console.log("hubcloudExtractor: resolveGofileLink error:", error);
      return null;
    }
  });
}
function hubcloudExtractor(link, signal, axios, cheerio, headers, providerContext, isDownload, providerValue) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      if (!headers["Cookie"]) {
        headers["Cookie"] = "ext_name=ojplmecpdpgccookcobabopnaifgidhf; xla=s4t; cf_clearance=woQrFGXtLfmEMBEiGUsVHrUBMT8s3cmguIzmMjmvpkg-1770053679-1.2.1.1-xBrQdciOJsweUF6F2T_OtH6jmyanN_TduQ0yslc_XqjU6RcHSxI7.YOKv6ry7oYo64868HYoULnVyww536H2eVI3R2e4wKzsky6abjPdfQPxqpUaXjxfJ02o6jl3_Vkwr4uiaU7Wy596Vdst3y78HXvVmKdIohhtPvp.vZ9_L7wvWdce0GRixjh_6JiqWmWMws46hwEt3hboaS1e1e4EoWCvj5b0M_jVwvSxBOAW5emFzvT3QrnRh4nyYmKDERnY";
      }
      console.log("hubcloudExtractor", link);
      const baseUrl = link.split("/").slice(0, 3).join("/");
      const streamLinks2 = [];
      const openWebView = providerContext == null ? void 0 : providerContext.openWebView;
      let vLinkRes;
      try {
        vLinkRes = yield axios(`${link}`, { headers, signal });
      } catch (error) {
        if (((_a = error.response) == null ? void 0 : _a.status) === 403) {
          if (openWebView) {
            console.log(
              `hubcloudExtractor: WAF detected (403) for ${link}, using solver...`
            );
            const cleanHeaders = __spreadProps(__spreadValues({}, headers), { Referer: baseUrl });
            const wafResult = yield openWebView(baseUrl, {
              title: "Solve the captcha below and click done",
              description: "Required to bypass anti-bot protection.",
              headers: cleanHeaders,
              waitForCookie: "cf_clearance",
              force: true
            });
            if (wafResult.userAgent) headers["User-Agent"] = wafResult.userAgent;
            headers["Cookie"] = (headers["Cookie"] ? headers["Cookie"] + "; " : "") + wafResult.cookies;
            vLinkRes = yield axios(`${link}`, { headers, signal });
          } else {
            console.log(
              `hubcloudExtractor: 403 Forbidden for ${link}, but openWebView solver is not available!`
            );
            throw error;
          }
        } else {
          throw error;
        }
      }
      const vLinkText = vLinkRes.data;
      const $vLink = cheerio.load(vLinkText);
      const vLinkGofileBtns = $vLink("a[href*='gofile.io']");
      for (const el of vLinkGofileBtns) {
        const gfHref = $vLink(el).attr("href");
        if (gfHref) {
          const gfStream = yield resolveGofileLink(gfHref, axios, providerContext);
          if (gfStream && !streamLinks2.some((s) => s.link === gfStream.link)) {
            streamLinks2.push(gfStream);
          }
        }
      }
      let vcloudLink = extractUrlFromScript(vLinkText) || $vLink(".fa-file-download.fa-lg").parent().attr("href") || link;
      console.log("vcloudLink", vcloudLink);
      if (vcloudLink == null ? void 0 : vcloudLink.startsWith("/")) {
        vcloudLink = `${baseUrl}${vcloudLink}`;
        console.log("New vcloudLink", vcloudLink);
      }
      if (vcloudLink == null ? void 0 : vcloudLink.includes("gofile.io")) {
        const gfStream = yield resolveGofileLink(vcloudLink, axios, providerContext);
        if (gfStream && !streamLinks2.some((s) => s.link === gfStream.link)) {
          streamLinks2.push(gfStream);
        }
      }
      let vcloudText = "";
      if (vcloudLink && !vcloudLink.includes("gofile.io") && vcloudLink !== link) {
        try {
          const vcloudRes = yield axios.get(vcloudLink, { headers, signal });
          vcloudText = vcloudRes.data;
        } catch (error) {
          if (((_b = error.response) == null ? void 0 : _b.status) === 403 && openWebView) {
            console.log(
              `hubcloudExtractor: WAF detected (403) for ${vcloudLink}, using solver...`
            );
            const vcloudBaseUrl = vcloudLink.split("/").slice(0, 3).join("/");
            const cleanHeaders2 = __spreadProps(__spreadValues({}, headers), { Referer: vcloudBaseUrl });
            const wafResult = yield openWebView(vcloudBaseUrl, {
              title: "Solve the captcha below and click done",
              description: "Required to bypass anti-bot protection.",
              headers: cleanHeaders2,
              waitForCookie: "cf_clearance",
              force: true
            });
            if (wafResult.userAgent) headers["User-Agent"] = wafResult.userAgent;
            headers["Cookie"] = (headers["Cookie"] ? headers["Cookie"] + "; " : "") + wafResult.cookies;
            const retryRes = yield axios.get(vcloudLink, { headers, signal });
            vcloudText = retryRes.data;
          } else {
            throw error;
          }
        }
      }
      const $ = cheerio.load(vcloudText);
      const linkClass = $(".btn-success.btn-lg.h6,.btn-danger,.btn-secondary");
      for (const element of linkClass) {
        const itm = $(element);
        let link2 = itm.attr("href") || "";
        switch (true) {
          case (link2 == null ? void 0 : link2.includes("pixeld")):
            console.log("Pixeldrain link found:", link2);
            if (!(link2 == null ? void 0 : link2.includes("api"))) {
              const redirectedPixelDrainUrl = getRedirectedPixelDrainUrl(
                vLinkText,
                vcloudText
              );
              if (redirectedPixelDrainUrl) {
                console.log(
                  "Special case for token negn6f",
                  redirectedPixelDrainUrl
                );
                link2 = redirectedPixelDrainUrl;
              }
              const token = (_c = link2.split("/").pop()) == null ? void 0 : _c.split("?")[0];
              const baseUrl2 = link2.split("/").slice(0, -2).join("/");
              link2 = `${baseUrl2}/api/file/${token}?download`;
            }
            streamLinks2.push({ server: "Pixeldrain", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes(".dev")) && !(link2 == null ? void 0 : link2.includes("/?id="))):
            streamLinks2.push({ server: "CF Worker", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes("hubcloud")) || (link2 == null ? void 0 : link2.includes("/?id="))):
            try {
              let newLink = link2;
              try {
                if (typeof fetch !== "undefined") {
                  const fRes = yield fetch(link2, {
                    headers,
                    signal,
                    redirect: "follow"
                  });
                  if (fRes.url && fRes.url.includes("googleusercontent")) {
                    newLink = fRes.url.split("?link=")[1] || fRes.url;
                  } else if (fRes.url && fRes.url !== link2) {
                    newLink = fRes.url;
                  }
                }
              } catch (e) {
              }
              if (!newLink.includes("googleusercontent")) {
                try {
                  const res1 = yield axios.get(newLink, {
                    headers,
                    signal,
                    maxRedirects: 0,
                    validateStatus: (s) => s >= 200 && s < 400
                  });
                  if ((_d = res1.headers) == null ? void 0 : _d["location"]) {
                    newLink = res1.headers["location"];
                  }
                  if (newLink.includes("googleusercontent")) {
                    newLink = newLink.split("?link=")[1] || newLink;
                  } else if (newLink.includes("http")) {
                    const res2 = yield axios.get(newLink, {
                      headers,
                      signal,
                      maxRedirects: 0,
                      validateStatus: (s) => s >= 200 && s < 400
                    });
                    if ((_e = res2.headers) == null ? void 0 : _e["location"]) {
                      const loc2 = res2.headers["location"];
                      newLink = loc2.includes("?link=") ? loc2.split("?link=")[1] : loc2;
                    }
                  }
                } catch (e) {
                }
              }
              if (newLink.includes("?link=")) {
                newLink = newLink.split("?link=")[1] || newLink;
              }
              streamLinks2.push({
                server: "GDrive (download only)",
                link: newLink,
                type: "mkv"
              });
            } catch (error) {
              console.log("hubcloudExtractor error in hubcloud link: ", error);
            }
            break;
          case (link2 == null ? void 0 : link2.includes("gofile.io")):
            try {
              const gfStream = yield resolveGofileLink(link2, axios, providerContext);
              if (gfStream && !streamLinks2.some((s) => s.link === gfStream.link)) {
                streamLinks2.push(gfStream);
              }
            } catch (error) {
              console.log("hubcloudExtractor error in gofile link: ", error);
            }
            break;
          case (link2 == null ? void 0 : link2.includes("cloudflarestorage")):
            streamLinks2.push({ server: "CF Storage", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes("fastdl")) || (link2 == null ? void 0 : link2.includes("fsl."))):
            streamLinks2.push({ server: "FastDl", link: link2, type: "mkv" });
            break;
          case (link2.includes("hubcdn") && !link2.includes("/?id=")):
            streamLinks2.push({
              server: "HubCdn",
              link: link2,
              type: "mkv"
            });
            break;
          default:
            if ((link2 == null ? void 0 : link2.includes(".mkv")) || (link2 == null ? void 0 : link2.includes("?token="))) {
              const serverName = "CF Worker";
              streamLinks2.push({ server: serverName, link: link2, type: "mkv" });
            }
            break;
        }
      }
      let preferredServer = "auto";
      try {
        const specificKey = providerValue ? `${providerValue}_preferredDownloadServer` : "";
        preferredServer = ((specificKey ? yield (_f = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _f.get(specificKey) : void 0) || (yield (_g = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _g.get("preferredDownloadServer")) || "auto").toLowerCase().trim();
      } catch (e) {
      }
      const getPriority = (serverName = "") => {
        const s = serverName.toLowerCase();
        if (isDownload && preferredServer !== "auto" && preferredServer !== "" && s.includes(preferredServer)) {
          return 0;
        }
        if (isDownload) {
          if (s.includes("cf storage") || s.includes("storage") || s.includes("resumable")) return 1;
          if (s.includes("gdrive") || s.includes("google") || s.includes("instant")) return 2;
          if (s.includes("pixeldrain")) return 3;
          if (s.includes("gofile")) return 4;
          if (s.includes("fastdl") || s.includes("fsl")) return 5;
          if (s.includes("hubcdn")) return 6;
          if (s.includes("cf worker") || s.includes("worker") || s.includes("fast cloud")) return 8;
          return 10;
        } else {
          if (s.includes("cf storage") || s.includes("storage")) return 1;
          if (s.includes("cf worker") || s.includes("worker") || s.includes("fast cloud")) return 2;
          if (s.includes("gofile")) return 3;
          if (s.includes("pixeldrain")) return 4;
          if (s.includes("fastdl") || s.includes("fsl")) return 5;
          if (s.includes("hubcdn")) return 6;
          if (s.includes("gdrive") || s.includes("google")) return 7;
          return 10;
        }
      };
      streamLinks2.sort((a, b) => getPriority(a.server) - getPriority(b.server));
      console.log("streamLinks", streamLinks2);
      return streamLinks2;
    } catch (error) {
      throwProviderError("HubCloud", `extract ${link}`, error);
    }
  });
}
var hubcloudDecode, extractUrlFromScript, getPixelDrainUrl, getRedirectedPixelDrainUrl;
var init_hubcloud = __esm({
  "providers/extractors/hubcloud.ts"() {
    "use strict";
    init_providerErrors();
    init_gofile();
    hubcloudDecode = function(value) {
      if (value === void 0) {
        return "";
      }
      return atob(value.toString());
    };
    extractUrlFromScript = (html) => {
      var _a, _b, _c;
      const doubleAtobMatch = html.match(
        /(?:var|let|const)\s+\w+\s*=\s*atob\(atob\(['"]([^'"]+)['"]\)\)/
      );
      if (doubleAtobMatch == null ? void 0 : doubleAtobMatch[1]) {
        return atob(atob(doubleAtobMatch[1]));
      }
      const plainMatch = html.match(/var\s+url\s*=\s*['"]([^'"]+)['"]/);
      return hubcloudDecode((_c = (_b = (_a = plainMatch == null ? void 0 : plainMatch[1]) == null ? void 0 : _a.split("r=")) == null ? void 0 : _b[1]) != null ? _c : "") || (plainMatch == null ? void 0 : plainMatch[1]) || "";
    };
    getPixelDrainUrl = (html) => {
      const match = html.match(/var\s+pxl\s*=\s*['"]([^'"]+)['"];?/i);
      return (match == null ? void 0 : match[1]) || "";
    };
    getRedirectedPixelDrainUrl = (...htmlSources) => {
      for (const html of htmlSources) {
        if (!html) {
          continue;
        }
        const redirectedUrl = getPixelDrainUrl(html);
        if (redirectedUrl) {
          return redirectedUrl;
        }
      }
      return "";
    };
  }
});

// providers/extractors/gdflix.ts
function gdflixExtractor(link, signal, axios, cheerio, headers, providerContext) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      let wafCookies;
      try {
        yield axios.get(link, { headers, signal });
      } catch (error) {
        if (((_a = error.response) == null ? void 0 : _a.status) === 403 && (providerContext == null ? void 0 : providerContext.openWebView)) {
          console.log("gdflix: WAF detected (403), using solver...");
          const baseUrl = link.split("/").slice(0, 3).join("/");
          const wafResult = yield providerContext.openWebView(link, {
            title: "Solve the captcha below and click done",
            description: "Required to bypass GDFlix anti-bot protection.",
            headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl }),
            force: true,
            waitForCookie: "cf_clearance"
          });
          wafCookies = wafResult.cookies;
        } else {
          throw error;
        }
      }
      if (wafCookies) {
        headers["Cookie"] = wafCookies;
      }
      const streamLinks2 = [];
      const res = yield axios(`${link}`, { headers, signal });
      console.log("gdflixExtractor", link);
      const data = res.data;
      let $drive = cheerio.load(data);
      if ((_b = $drive("body").attr("onload")) == null ? void 0 : _b.includes("location.replace")) {
        const newLink = (_e = (_d = (_c = $drive("body").attr("onload")) == null ? void 0 : _c.split("location.replace('")) == null ? void 0 : _d[1].split("'")) == null ? void 0 : _e[0];
        console.log("newLink", newLink);
        if (newLink) {
          const newRes = yield axios.get(newLink, { headers, signal });
          $drive = cheerio.load(newRes.data);
        }
      }
      try {
        const baseUrl = link.split("/").slice(0, 3).join("/");
        const resumeDrive = $drive(".btn-secondary").attr("href") || "";
        console.log("resumeDrive", resumeDrive);
        if (resumeDrive.includes("indexbot")) {
          const resumeBotRes = yield axios.get(resumeDrive, { headers });
          const resumeBotToken = resumeBotRes.data.match(
            /formData\.append\('token', '([a-f0-9]+)'\)/
          )[1];
          const resumeBotBody = new FormData();
          resumeBotBody.append("token", resumeBotToken);
          const resumeBotPath = resumeBotRes.data.match(
            /fetch\('\/download\?id=([a-zA-Z0-9\/+]+)'/
          )[1];
          const resumeBotBaseUrl = resumeDrive.split("/download")[0];
          const resumeBotDownload = yield fetch(
            resumeBotBaseUrl + "/download?id=" + resumeBotPath,
            {
              method: "POST",
              body: resumeBotBody,
              headers: {
                Referer: resumeDrive,
                Cookie: "PHPSESSID=7e9658ce7c805dab5bbcea9046f7f308"
              }
            }
          );
          const resumeBotDownloadData = yield resumeBotDownload.json();
          console.log("resumeBotDownloadData", resumeBotDownloadData.url);
          streamLinks2.push({
            server: "ResumeBot",
            link: resumeBotDownloadData.url,
            type: "mkv"
          });
        } else {
          const url = baseUrl + resumeDrive;
          const resumeDriveRes = yield axios.get(url, { headers });
          const resumeDriveHtml = resumeDriveRes.data;
          const $resumeDrive = cheerio.load(resumeDriveHtml);
          const resumeLink = $resumeDrive(".btn-success").attr("href");
          if (resumeLink) {
            streamLinks2.push({
              server: "ResumeCloud",
              link: resumeLink,
              type: "mkv"
            });
          }
        }
      } catch (err) {
        console.log("Resume link not found");
      }
      try {
        const seed = $drive(".btn-danger").attr("href") || "";
        if (seed && seed.startsWith("http")) {
          if (seed.includes("url=")) {
            const directPart = decodeURIComponent(seed.split("url=")[1]);
            if (directPart && directPart.startsWith("http")) {
              streamLinks2.push({ server: "Instant Download", link: directPart, type: "mkv" });
            }
          }
          try {
            const vRes = yield axios.get(seed, {
              headers: __spreadProps(__spreadValues({}, headers), { Referer: link }),
              maxRedirects: 0,
              validateStatus: (s) => s >= 200 && s < 400,
              signal
            });
            const loc = (_f = vRes.headers) == null ? void 0 : _f.location;
            if (loc) {
              let directGoogleUrl = null;
              if (loc.includes("url=")) {
                directGoogleUrl = decodeURIComponent(loc.split("url=")[1]);
              } else if (loc.includes("googleusercontent.com") || loc.startsWith("http")) {
                directGoogleUrl = loc;
              }
              if (directGoogleUrl && directGoogleUrl.startsWith("http")) {
                streamLinks2.push({ server: "Instant Download", link: directGoogleUrl, type: "mkv" });
              }
            } else if (typeof vRes.data === "string") {
              const upMatch = vRes.data.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
              if (upMatch) {
                const upPath = upMatch[1];
                const vOrigin = new URL(seed).origin;
                const upUrl = upPath.startsWith("http") ? upPath : vOrigin + upPath;
                const upRes = yield axios.get(upUrl, {
                  headers: __spreadProps(__spreadValues({}, headers), { Referer: seed }),
                  signal
                });
                const loc2 = (_g = upRes.headers) == null ? void 0 : _g.location;
                if (loc2 && loc2.startsWith("http")) {
                  streamLinks2.push({ server: "Instant Download", link: loc2, type: "mkv" });
                } else if (typeof upRes.data === "string") {
                  const $up = cheerio.load(upRes.data);
                  const dlBtn = $up("#downloadBtn, a.btn-danger, a.btn-success").attr("href");
                  if (dlBtn && dlBtn.startsWith("http")) {
                    streamLinks2.push({ server: "Instant Download", link: dlBtn, type: "mkv" });
                  }
                }
              }
            }
          } catch (e) {
          }
        }
      } catch (e) {
      }
      return streamLinks2;
    } catch (error) {
      return streamLinks;
    }
  });
}
var init_gdflix = __esm({
  "providers/extractors/gdflix.ts"() {
    "use strict";
  }
});

// providers/topmovies/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function modGetEpisodeLinks(_0) {
  return __async(this, arguments, function* ({
    url,
    providerContext
  }) {
    var _a;
    const { axios, cheerio, commonHeaders } = providerContext;
    try {
      let cleanUrl = url;
      if (cleanUrl.includes("url=")) {
        cleanUrl = atob(cleanUrl.split("url=")[1]);
      }
      const res = yield axios.get(cleanUrl, { headers: commonHeaders });
      const html = res.data;
      let $ = cheerio.load(html);
      if (url.includes("url=")) {
        const newUrl = (_a = $("meta[http-equiv='refresh']").attr("content")) == null ? void 0 : _a.split("url=")[1];
        if (newUrl) {
          const res2 = yield axios.get(newUrl, { headers: commonHeaders });
          $ = cheerio.load(res2.data);
        }
      }
      const episodeLinks = [];
      $("h3,h4").each((_, element) => {
        const seriesTitle = $(element).text();
        const link = $(element).find("a").attr("href");
        if (link && link !== "#") {
          episodeLinks.push({
            title: seriesTitle.trim() || "Download",
            link
          });
        }
      });
      $("a.maxbutton").each((_, element) => {
        const seriesTitle = $(element).children("span").text();
        const link = $(element).attr("href");
        if (link && link !== "#") {
          episodeLinks.push({
            title: seriesTitle.trim() || "Download",
            link
          });
        }
      });
      return episodeLinks;
    } catch (e) {
      return [];
    }
  });
}
function bypassThenaukriadda(initialUrl, providerContext, signal) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e;
    const { axios, cheerio, commonHeaders } = providerContext;
    const headers = __spreadProps(__spreadValues({}, commonHeaders), { Referer: "https://moviesleech.club/" });
    const res1 = yield axios.get(initialUrl, { headers, signal });
    const html1 = typeof res1.data === "string" ? res1.data : "";
    const $1 = cheerio.load(html1);
    const lpHttp = $1('input[name="_lp_http"]').val();
    let action1 = $1("form#lp-land").attr("action") || $1("form").attr("action") || initialUrl;
    if (!action1.startsWith("http")) {
      action1 = new URL(action1, initialUrl).href;
    }
    let cookies = "";
    const setCookies1 = (_a = res1.headers) == null ? void 0 : _a["set-cookie"];
    if (Array.isArray(setCookies1)) {
      cookies = setCookies1.map((c) => c.split(";")[0]).join("; ");
    }
    if (!lpHttp) {
      const directMatch = html1.match(/location\.replace\(["']([^"']+)["']\)/);
      if (directMatch) return directMatch[1].replace(/\\/g, "");
      return initialUrl;
    }
    const fd1 = new URLSearchParams();
    fd1.append("_lp_http", lpHttp);
    const res2 = yield axios.post(action1, fd1.toString(), {
      headers: __spreadProps(__spreadValues({}, headers), {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: initialUrl,
        Cookie: cookies
      }),
      signal
    });
    const setCookies2 = (_b = res2.headers) == null ? void 0 : _b["set-cookie"];
    if (Array.isArray(setCookies2)) {
      const c2 = setCookies2.map((c) => c.split(";")[0]).join("; ");
      cookies = cookies ? `${cookies}; ${c2}` : c2;
    }
    const html2 = typeof res2.data === "string" ? res2.data : "";
    const $2 = cheerio.load(html2);
    const form2 = $2("form#lp-s1-form").length > 0 ? $2("form#lp-s1-form") : $2("form").first();
    let action2 = form2.attr("action") || action1;
    if (!action2.startsWith("http")) {
      action2 = new URL(action2, action1).href;
    }
    const fd2 = new URLSearchParams();
    form2.find("input").each((_, el) => {
      const name = $2(el).attr("name");
      const val = $2(el).attr("value");
      if (name && val !== void 0) {
        fd2.append(name, val);
      }
    });
    const res3 = yield axios.post(action2, fd2.toString(), {
      headers: __spreadProps(__spreadValues({}, headers), {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: action1,
        Cookie: cookies
      }),
      signal
    });
    const setCookies3 = (_c = res3.headers) == null ? void 0 : _c["set-cookie"];
    if (Array.isArray(setCookies3)) {
      const c3 = setCookies3.map((c) => c.split(";")[0]).join("; ");
      cookies = cookies ? `${cookies}; ${c3}` : c3;
    }
    const html3 = typeof res3.data === "string" ? res3.data : "";
    const scMatch = html3.match(/sc\(["']([^"']+)["'],\s*["']([^"']+)["']/);
    if (!scMatch) {
      const directGo = html3.match(/href=["'](https?:\/\/[^"']*?[?&]lp_go=[^"']*)["']/);
      if (directGo) return directGo[1];
      const directMatch = html3.match(/location\.replace\(["']([^"']+)["']\)/);
      if (directMatch) return directMatch[1].replace(/\\/g, "");
      return action2;
    }
    const tokenName = scMatch[1];
    const tokenVal = scMatch[2];
    const origin2 = new URL(action2).origin;
    const lpGoUrl = `${origin2}/?lp_go=${tokenName}`;
    cookies += `; ${tokenName}=${tokenVal}`;
    const res4 = yield axios.get(lpGoUrl, {
      headers: __spreadProps(__spreadValues({}, headers), {
        Referer: action2,
        Cookie: cookies
      }),
      signal
    });
    const html4 = typeof res4.data === "string" ? res4.data : "";
    const redirectMatch = html4.match(/location\.replace\(["']([^"']+)["']\)/);
    if (redirectMatch) {
      return redirectMatch[1].replace(/\\/g, "");
    }
    return ((_e = (_d = res4.request) == null ? void 0 : _d.res) == null ? void 0 : _e.responseUrl) || lpGoUrl;
  });
}
function bypassLegacyWpHttp(url, providerContext, signal) {
  return __async(this, null, function* () {
    var _a, _b;
    const { axios, cheerio, commonHeaders: headers } = providerContext;
    try {
      const sid = url.includes("sid=") ? url.split("sid=")[1] : "";
      let formUrl = url.split("?")[0];
      let wpHttp2 = "";
      if (sid) {
        const fd = new URLSearchParams();
        fd.append("_wp_http", sid);
        const res = yield axios.post(formUrl, fd.toString(), {
          headers: __spreadProps(__spreadValues({}, headers), { "Content-Type": "application/x-www-form-urlencoded" }),
          signal
        });
        const $ = cheerio.load(res.data);
        wpHttp2 = $('input[name="_wp_http2"]').val();
        const act = $("form").attr("action");
        if (act) formUrl = act.startsWith("http") ? act : new URL(act, formUrl).href;
      } else {
        const res = yield axios.get(url, { headers, signal });
        const $ = cheerio.load(res.data);
        wpHttp2 = $('input[name="_wp_http2"]').val();
        const act = $("form").attr("action");
        if (act) formUrl = act.startsWith("http") ? act : new URL(act, formUrl).href;
      }
      if (!wpHttp2) return null;
      const fd2 = new URLSearchParams();
      fd2.append("_wp_http2", wpHttp2);
      const res2 = yield axios.post(formUrl, fd2.toString(), {
        headers: __spreadProps(__spreadValues({}, headers), {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: url
        }),
        signal
      });
      const html2 = typeof res2.data === "string" ? res2.data : "";
      const linkMatch = html2.match(/setAttribute\("href",\s*"(.*?)"/);
      if (!linkMatch) return null;
      const link = linkMatch[1];
      const cookie = link.split("=")[1];
      const res3 = yield axios.get(link, {
        headers: __spreadProps(__spreadValues({}, headers), {
          Referer: formUrl,
          Cookie: `${cookie}=${wpHttp2}`
        }),
        signal
      });
      const html3 = typeof res3.data === "string" ? res3.data : "";
      const refreshMatch = html3.match(/content=["']\d+;\s*url=(.*?)["']/i);
      if (refreshMatch) return refreshMatch[1];
      const replaceMatch = html3.match(/location\.replace\(["']([^"']+)["']\)/i);
      if (replaceMatch) return replaceMatch[1];
      return ((_b = (_a = res3.request) == null ? void 0 : _a.res) == null ? void 0 : _b.responseUrl) || link;
    } catch (e) {
      return null;
    }
  });
}
function extractStreamsFromDriveseed(driveUrl, providerContext, signal) {
  return __async(this, null, function* () {
    var _a, _b;
    const { axios, cheerio, commonHeaders: headers } = providerContext;
    const streams = [];
    const addedUrls = /* @__PURE__ */ new Set();
    const addStream = (server, link) => {
      if (link && link.startsWith("http") && !addedUrls.has(link)) {
        addedUrls.add(link);
        streams.push({ server, link, type: "mkv" });
      }
    };
    let fileUrl = driveUrl;
    if (driveUrl.includes("/r?")) {
      try {
        const rRes = yield axios.get(driveUrl, {
          headers: __spreadProps(__spreadValues({}, headers), { Referer: "https://en.thenaukriadda.in/" }),
          signal
        });
        const html = typeof rRes.data === "string" ? rRes.data : "";
        const pathMatch = html.match(/location\.replace\(["']([^"']+)["']\)/);
        if (pathMatch) {
          const p = pathMatch[1].replace(/\\/g, "");
          const origin = new URL(driveUrl).origin;
          fileUrl = p.startsWith("http") ? p : origin + p;
        }
      } catch (e) {
      }
    }
    try {
      const fileRes = yield axios.get(fileUrl, {
        headers: __spreadProps(__spreadValues({}, headers), { Referer: driveUrl }),
        signal
      });
      const fileHtml = typeof fileRes.data === "string" ? fileRes.data : "";
      const $file = cheerio.load(fileHtml);
      try {
        const zfileUrl = fileUrl.replace("/file/", "/zfile/");
        const zRes = yield axios.get(zfileUrl, {
          headers: __spreadProps(__spreadValues({}, headers), { Referer: fileUrl }),
          signal
        });
        const zHtml = typeof zRes.data === "string" ? zRes.data : "";
        const $z = cheerio.load(zHtml);
        $z("a").each((_, el) => {
          const href = $z(el).attr("href");
          if (href && (href.includes("workers.dev") || href.includes("r2.dev") || href.includes("drive.google.com") || /\.(mp4|mkv|m3u8)($|\?)/i.test(href))) {
            const serverName = href.includes("drive.google.com") ? "Google Drive" : "Resume Cloud (Fast)";
            addStream(serverName, href);
          }
        });
        $z("iframe, video, source").each((_, el) => {
          const src = $z(el).attr("src");
          if (src) {
            const match = src.match(/link=(https?:\/\/[^&"']+)/);
            if (match && match[1]) {
              addStream("Direct Stream", match[1]);
            }
          }
        });
      } catch (e) {
      }
      $file("a").each((_, el) => {
        const href = $file(el).attr("href");
        if (href && (href.includes("workers.dev") || href.includes("r2.dev") || href.includes("drive.google.com") || /\.(mp4|mkv|m3u8)($|\?)/i.test(href))) {
          const serverName = href.includes("drive.google.com") ? "Google Drive" : "Direct File Stream";
          addStream(serverName, href);
        }
      });
      try {
        const instantHref = $file(".btn-danger, a:contains('Instant Download')").attr("href");
        if (instantHref && instantHref.startsWith("http")) {
          let added = false;
          if (instantHref.includes("url=")) {
            const directPart = decodeURIComponent(instantHref.split("url=")[1]);
            if (directPart && directPart.startsWith("http")) {
              addStream("Instant Download", directPart);
              added = true;
            }
          }
          if (!added) {
            try {
              const vRes = yield axios.get(instantHref, {
                headers: __spreadProps(__spreadValues({}, headers), { Referer: fileUrl }),
                maxRedirects: 0,
                validateStatus: (s) => s >= 200 && s < 400,
                signal
              });
              const loc = (_a = vRes.headers) == null ? void 0 : _a.location;
              if (loc) {
                let directGoogleUrl = null;
                if (loc.includes("url=")) {
                  directGoogleUrl = decodeURIComponent(loc.split("url=")[1]);
                } else if (loc.includes("googleusercontent.com") || loc.startsWith("http")) {
                  directGoogleUrl = loc;
                }
                if (directGoogleUrl && directGoogleUrl.startsWith("http")) {
                  addStream("Instant Download", directGoogleUrl);
                }
              } else if (typeof vRes.data === "string") {
                const upMatch = vRes.data.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
                if (upMatch) {
                  const upPath = upMatch[1];
                  const vOrigin = new URL(instantHref).origin;
                  const upUrl = upPath.startsWith("http") ? upPath : vOrigin + upPath;
                  const upRes = yield axios.get(upUrl, {
                    headers: __spreadProps(__spreadValues({}, headers), { Referer: instantHref }),
                    maxRedirects: 0,
                    validateStatus: (s) => s >= 200 && s < 400,
                    signal
                  });
                  const loc2 = (_b = upRes.headers) == null ? void 0 : _b.location;
                  if (loc2 && loc2.startsWith("http")) {
                    addStream("Instant Download", loc2);
                  } else if (typeof upRes.data === "string") {
                    const $up = cheerio.load(upRes.data);
                    const dlBtn = $up("#downloadBtn, a.btn-danger, a.btn-success").attr("href");
                    if (dlBtn && dlBtn.startsWith("http")) {
                      addStream("Instant Download", dlBtn);
                    }
                  }
                }
              }
            } catch (e) {
            }
          }
        }
      } catch (e) {
      }
      for (const t of [1, 2]) {
        try {
          const wfileUrl = fileUrl.replace("/file/", "/wfile/") + `?type=${t}`;
          const wRes = yield axios.get(wfileUrl, {
            headers: __spreadProps(__spreadValues({}, headers), { Referer: fileUrl }),
            signal
          });
          const wHtml = typeof wRes.data === "string" ? wRes.data : "";
          const $w = cheerio.load(wHtml);
          $w(".btn-success, a.btn").each((i, el) => {
            const href = $w(el).attr("href");
            if (href) addStream(`Worker ${t}.${i + 1}`, href);
          });
        } catch (e) {
        }
      }
    } catch (e) {
    }
    if (streams.length === 0) {
      try {
        const gdStreams = yield gdflixExtractor(
          fileUrl,
          signal,
          axios,
          cheerio,
          headers,
          providerContext
        );
        if (Array.isArray(gdStreams)) {
          for (const s of gdStreams) {
            addStream(s.server || "GDFlix", s.link);
          }
        }
      } catch (e) {
      }
    }
    return streams;
  });
}
var getStream;
var init_stream = __esm({
  "providers/topmovies/stream.ts"() {
    "use strict";
    init_providerErrors();
    init_hubcloud();
    init_gdflix();
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: url,
        type,
        signal,
        providerContext,
        isDownload
      }) {
        const { axios, cheerio, commonHeaders } = providerContext;
        try {
          let targetUrl = url;
          if (type === "movie" && !targetUrl.includes("thenaukriadda") && !targetUrl.includes("sid=") && !targetUrl.includes("driveseed") && !targetUrl.includes("driveleech") && !targetUrl.includes("appdrive") && !targetUrl.includes("hubcloud") && !targetUrl.includes("gdflix")) {
            try {
              const episodeLinks = yield modGetEpisodeLinks({ url: targetUrl, providerContext });
              if (episodeLinks && episodeLinks.length > 0 && episodeLinks[0].link) {
                targetUrl = episodeLinks[0].link;
              }
            } catch (e) {
            }
          }
          if (targetUrl.includes("thenaukriadda") || targetUrl.includes("sid=")) {
            try {
              const bypassed = yield bypassThenaukriadda(targetUrl, providerContext, signal);
              if (bypassed) {
                targetUrl = bypassed;
              }
            } catch (bypassErr) {
              console.warn("TopMovies: thenaukriadda bypass failed:", bypassErr.message);
            }
          }
          if (!targetUrl.includes("driveseed") && !targetUrl.includes("driveleech") && !targetUrl.includes("appdrive") && !targetUrl.includes("hubcloud") && !targetUrl.includes("gdflix")) {
            try {
              const legacyBypassed = yield bypassLegacyWpHttp(targetUrl, providerContext, signal);
              if (legacyBypassed) {
                targetUrl = legacyBypassed;
              }
            } catch (e) {
            }
          }
          if (targetUrl.includes("unblockedgames") || targetUrl.includes("leechpro")) {
            try {
              const res = yield axios.get(targetUrl, {
                headers: commonHeaders,
                signal
              });
              const html = typeof res.data === "string" ? res.data : "";
              const refreshMatch = html.match(/content=["']\d+;\s*url=(.*?)["']/i);
              const replaceMatch = html.match(/location\.replace\(["']([^"']+)["']\)/i);
              const nextUrl = (refreshMatch == null ? void 0 : refreshMatch[1]) || (replaceMatch == null ? void 0 : replaceMatch[1]);
              if (nextUrl) {
                targetUrl = nextUrl.replace(/\\/g, "");
              }
            } catch (e) {
            }
          }
          if (targetUrl.includes("hubcloud")) {
            return yield hubcloudExtractor(
              targetUrl,
              signal,
              axios,
              cheerio,
              commonHeaders,
              providerContext,
              isDownload,
              "TopMovies"
            );
          }
          if (targetUrl.includes("gdflix")) {
            return yield gdflixExtractor(
              targetUrl,
              signal,
              axios,
              cheerio,
              commonHeaders,
              providerContext
            );
          }
          if (targetUrl.includes("driveseed") || targetUrl.includes("driveleech") || targetUrl.includes("appdrive")) {
            const driveStreams = yield extractStreamsFromDriveseed(
              targetUrl,
              providerContext,
              signal
            );
            if (driveStreams.length > 0) {
              return driveStreams;
            }
          }
          if (/\.(mp4|mkv|m3u8|avi)($|\?)/i.test(targetUrl)) {
            return [
              {
                server: "Direct Stream",
                link: targetUrl,
                type: targetUrl.includes(".m3u8") ? "m3u8" : "mkv"
              }
            ];
          }
          return [];
        } catch (err) {
          throwProviderError("TopMovies", "stream", err);
          return [];
        }
      });
    };
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

// providers/topmovies/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/topmovies/episodes.ts"() {
    "use strict";
    init_providerErrors();
    init_getCinemetaMeta();
    init_theintrodb();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        var _a, _b;
        const { axios, cheerio } = providerContext;
        try {
          const context = readCinemetaContext(url);
          let requestUrl = context.requestUrl;
          const hasEncodedUrl = requestUrl.includes("url=");
          if (hasEncodedUrl) {
            requestUrl = atob(requestUrl.split("url=")[1]);
          }
          const res = yield axios.get(requestUrl);
          const html = res.data;
          let $ = cheerio.load(html);
          if (hasEncodedUrl) {
            const newUrl = (_a = $("meta[http-equiv='refresh']").attr("content")) == null ? void 0 : _a.split("url=")[1];
            const res2 = yield axios.get(newUrl || requestUrl);
            const html2 = res2.data;
            $ = cheerio.load(html2);
          }
          const episodeLinks = [];
          $("h3,h4").map((i, element) => {
            const seriesTitle = $(element).text();
            const episodesLink = $(element).find("a").attr("href");
            if (episodesLink && episodesLink !== "#") {
              episodeLinks.push({
                title: seriesTitle.trim() || "No title found",
                link: episodesLink || ""
              });
            }
          });
          $("a.maxbutton").map((i, element) => {
            const seriesTitle = $(element).children("span").text();
            const episodesLink = $(element).attr("href");
            if (episodesLink && episodesLink !== "#") {
              episodeLinks.push({
                title: seriesTitle.trim() || "No title found",
                link: episodesLink || ""
              });
            }
          });
          if (!context.imdbId || !context.season) return episodeLinks;
          let enriched = episodeLinks;
          try {
            const cinemeta = yield getCinemetaMeta(
              context.imdbId,
              "series",
              providerContext
            );
            if (cinemeta) {
              enriched = enrichCinemetaEpisodes(
                episodeLinks,
                cinemeta.videos || [],
                context.season
              );
            }
          } catch (e) {
            console.warn("TopMovies: Cinemeta episode lookup failed", e);
          }
          const skipTimings = yield (_b = providerContext.kvStore) == null ? void 0 : _b.get("topmovies_skipTimings");
          if (skipTimings != null ? skipTimings : true) {
            try {
              enriched = yield enrichEpisodesWithSkipTimings(
                enriched,
                context.imdbId,
                context.season,
                providerContext
              );
            } catch (e) {
              console.warn("TopMovies: Skip timings lookup failed", e);
            }
          }
          return enriched;
        } catch (err) {
          throwProviderError("TopMovies", "episodes", err);
        }
      });
    };
  }
});

// providers/topmovies/topmovies.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
