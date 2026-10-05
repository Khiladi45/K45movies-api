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
function posts(baseUrl, url, signal, providerContext, operation) {
  return __async(this, null, function* () {
    try {
      const { axios, cheerio } = providerContext;
      const res = yield axios.get(url, { headers, signal });
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
var headers, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/topmovies/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    headers = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Cache-Control": "no-store",
      "Accept-Language": "en-US,en;q=0.9",
      DNT: "1",
      "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0"
    };
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
        var _a;
        try {
          const { axios, cheerio } = providerContext;
          const baseUrl = yield getBaseUrl("Topmovies");
          const url = new URL(link, `${baseUrl}/`).href;
          const res = yield axios.get(url);
          const data = res.data;
          const $ = cheerio.load(data);
          const meta = {
            title: $(".imdbwp__title").text(),
            synopsis: $(".imdbwp__teaser").text(),
            image: $(".imdbwp__thumb").find("img").attr("src") || "",
            imdbId: ((_a = $(".imdbwp__link").attr("href")) == null ? void 0 : _a.split("/")[4]) || "",
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
          const cinemeta = yield getCinemetaMeta(imdbId, meta.type, providerContext);
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
        } catch (err) {
          throwProviderError("TopMovies", "metadata", err);
        }
      });
    };
  }
});

// providers/topmovies/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function modExtractor(url, providerContext) {
  return __async(this, null, function* () {
    const { axios, cheerio } = providerContext;
    try {
      const wpHttp = url.split("sid=")[1];
      var bodyFormData0 = new FormData();
      bodyFormData0.append("_wp_http", wpHttp);
      const res = yield fetch(url.split("?")[0], {
        method: "POST",
        body: bodyFormData0
      });
      const data = yield res.text();
      const html = data;
      const $ = cheerio.load(html);
      const wpHttp2 = $("input").attr("name", "_wp_http2").val();
      console.log("wpHttp2", wpHttp2);
      var bodyFormData = new FormData();
      bodyFormData.append("_wp_http2", wpHttp2);
      const formUrl1 = $("form").attr("action");
      const formUrl = formUrl1 || url.split("?")[0];
      const res2 = yield fetch(formUrl, {
        method: "POST",
        body: bodyFormData
      });
      const html2 = yield res2.text();
      const link = html2.match(/setAttribute\("href",\s*"(.*?)"/)[1];
      console.log(link);
      const cookie = link.split("=")[1];
      console.log("cookie", cookie);
      const downloadLink = yield axios.get(link, {
        headers: {
          Referer: formUrl,
          Cookie: `${cookie}=${wpHttp2}`
        }
      });
      return downloadLink;
    } catch (err) {
      console.log("modGetStream error", err);
    }
  });
}
var headers2, getStream, isDriveLink;
var init_stream = __esm({
  "providers/topmovies/stream.ts"() {
    "use strict";
    init_providerErrors();
    headers2 = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Cache-Control": "no-store",
      "Accept-Language": "en-US,en;q=0.9",
      DNT: "1",
      "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      Cookie: "popads_user_id=6ba8fe60a481387a3249f05aa058822d",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
    };
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: url,
        type,
        providerContext
      }) {
        var _a, _b;
        const { axios, cheerio } = providerContext;
        try {
          const modGetEpisodeLinks = function(_02) {
            return __async(this, arguments, function* ({
              url: url2,
              providerContext: providerContext2
            }) {
              var _a2;
              const { axios: axios2, cheerio: cheerio2 } = providerContext2;
              try {
                if (url2.includes("url=")) {
                  url2 = atob(url2.split("url=")[1]);
                }
                const res = yield axios2.get(url2);
                const html = res.data;
                let $ = cheerio2.load(html);
                if (url2.includes("url=")) {
                  const newUrl = (_a2 = $("meta[http-equiv='refresh']").attr("content")) == null ? void 0 : _a2.split("url=")[1];
                  const res2 = yield axios2.get(newUrl || url2);
                  const html2 = res2.data;
                  $ = cheerio2.load(html2);
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
                return episodeLinks;
              } catch (err) {
                throw err;
              }
            });
          };
          console.log("modGetStream", type, url);
          if (type === "movie") {
            const servers2 = yield modGetEpisodeLinks({ url, providerContext });
            url = servers2[0].link || url;
          }
          let downloadLink = yield modExtractor(url, providerContext);
          const ddl = ((_b = (_a = downloadLink == null ? void 0 : downloadLink.data) == null ? void 0 : _a.match(/content="0;url=(.*?)"/)) == null ? void 0 : _b[1]) || url;
          const servers = [];
          const driveLink = yield isDriveLink(ddl);
          const driveRes = yield axios.get(driveLink, { headers: headers2 });
          const driveHtml = driveRes.data;
          const $drive = cheerio.load(driveHtml);
          try {
            const resumeBot = $drive(".btn.btn-light").attr("href") || "";
            const resumeBotRes = yield axios.get(resumeBot, { headers: headers2 });
            const resumeBotToken = resumeBotRes.data.match(
              /formData\.append\('token', '([a-f0-9]+)'\)/
            )[1];
            const resumeBotBody = new FormData();
            resumeBotBody.append("token", resumeBotToken);
            const resumeBotPath = resumeBotRes.data.match(
              /fetch\('\/download\?id=([a-zA-Z0-9\/+]+)'/
            )[1];
            const resumeBotBaseUrl = resumeBot.split("/download")[0];
            const resumeBotDownload = yield fetch(
              resumeBotBaseUrl + "/download?id=" + resumeBotPath,
              {
                method: "POST",
                body: resumeBotBody,
                headers: {
                  Referer: resumeBot,
                  Cookie: "PHPSESSID=7e9658ce7c805dab5bbcea9046f7f308"
                }
              }
            );
            const resumeBotDownloadData = yield resumeBotDownload.json();
            console.log("resumeBotDownloadData", resumeBotDownloadData.url);
            servers.push({
              server: "ResumeBot",
              link: resumeBotDownloadData.url,
              type: "mkv"
            });
          } catch (err) {
            console.log("ResumeBot link not found", err);
          }
          try {
            const baseWorkerStream = $drive(".btn-success");
            baseWorkerStream.each((i, el) => {
              var _a2;
              const link = (_a2 = el.attribs) == null ? void 0 : _a2.href;
              if (link) {
                servers.push({
                  server: "Resume Worker " + (i + 1),
                  link,
                  type: "mkv"
                });
              }
            });
          } catch (err) {
            console.log("Base page worker link not found", err);
          }
          try {
            const cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=1";
            const cfWorkersRes = yield axios.get(cfWorkersLink, { headers: headers2 });
            const cfWorkersHtml = cfWorkersRes.data;
            const $cfWorkers = cheerio.load(cfWorkersHtml);
            const cfWorkersStream = $cfWorkers(".btn-success");
            cfWorkersStream.each((i, el) => {
              var _a2;
              const link = (_a2 = el.attribs) == null ? void 0 : _a2.href;
              if (link) {
                servers.push({
                  server: "Cf Worker 1." + i,
                  link,
                  type: "mkv"
                });
              }
            });
          } catch (err) {
            console.log("CF workers link not found", err);
          }
          try {
            const cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=2";
            const cfWorkersRes = yield axios.get(cfWorkersLink, { headers: headers2 });
            const cfWorkersHtml = cfWorkersRes.data;
            const $cfWorkers = cheerio.load(cfWorkersHtml);
            const cfWorkersStream = $cfWorkers(".btn-success");
            cfWorkersStream.each((i, el) => {
              var _a2;
              const link = (_a2 = el.attribs) == null ? void 0 : _a2.href;
              if (link) {
                servers.push({
                  server: "Cf Worker 2." + i,
                  link,
                  type: "mkv"
                });
              }
            });
          } catch (err) {
            console.log("CF workers link not found", err);
          }
          try {
            const seed = $drive(".btn-danger").attr("href") || "";
            const newLinkRes = yield fetch(seed, {
              method: "HEAD",
              headers: headers2,
              redirect: "manual"
            });
            let newLink = seed;
            if (newLinkRes.status >= 300 && newLinkRes.status < 400) {
              newLink = newLinkRes.headers.get("location") || seed;
            } else if (newLinkRes.url && newLinkRes.url !== seed) {
              newLink = newLinkRes.url || newLinkRes.url;
            } else {
              newLink = newLinkRes.headers.get("location") || seed;
            }
            console.log("Gdrive-Instant-2 link", newLink == null ? void 0 : newLink.split("?url=")[1]);
            servers.push({
              server: "Gdrive-Instant-2",
              link: (newLink == null ? void 0 : newLink.split("?url=")[1]) || newLink,
              type: "mkv"
            });
          } catch (err) {
            console.log("Instant link not found", err);
          }
          return servers;
        } catch (err) {
          throwProviderError("TopMovies", "stream", err);
        }
      });
    };
    isDriveLink = (ddl) => __async(null, null, function* () {
      if (ddl.includes("drive")) {
        const driveLeach = yield fetch(ddl);
        const driveLeachData = yield driveLeach.text();
        const pathMatch = driveLeachData.match(
          /window\.location\.replace\("([^"]+)"\)/
        );
        const path = pathMatch == null ? void 0 : pathMatch[1];
        const mainUrl = ddl.split("/")[2];
        console.log(`driveUrl = https://${mainUrl}${path}`);
        return `https://${mainUrl}${path}`;
      } else {
        return ddl;
      }
    });
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
          const cinemeta = yield getCinemetaMeta(
            context.imdbId,
            "series",
            providerContext
          );
          let enriched = enrichCinemetaEpisodes(
            episodeLinks,
            cinemeta.videos || [],
            context.season
          );
          const skipTimings = yield (_b = providerContext.kvStore) == null ? void 0 : _b.get("topmovies_skipTimings");
          if (skipTimings != null ? skipTimings : true) {
            enriched = yield enrichEpisodesWithSkipTimings(
              enriched,
              context.imdbId,
              context.season,
              providerContext
            );
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
