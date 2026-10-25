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

// providers/vega/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/vega/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "New",
        filter: ""
      },
      {
        title: "Netflix",
        filter: "web-series/netflix"
      },
      {
        title: "Amazon Prime",
        filter: "web-series/amazon-prime-video"
      },
      {
        title: "Apple TV+",
        filter: "web-series/apple-tv"
      },
      {
        title: "Korean",
        filter: "/korean-series"
      },
      {
        title: "Action",
        filter: "category/movies-by-genres/action"
      },
      {
        title: "Adventure",
        filter: "category/movies-by-genres/adventure"
      },
      {
        title: "Comedy",
        filter: "category/movies-by-genres/comedy"
      },
      {
        title: "Crime",
        filter: "category/movies-by-genres/crime"
      },
      {
        title: "Family",
        filter: "category/movies-by-genres/family"
      },
      {
        title: "Fantasy",
        filter: "category/movies-by-genres/fantasy"
      },
      {
        title: "Horror",
        filter: "category/movies-by-genres/horror"
      },
      {
        title: "Mystery",
        filter: "category/movies-by-genres/mystery"
      },
      {
        title: "Romance",
        filter: "category/movies-by-genres/romance"
      },
      {
        title: "Sci-Fi",
        filter: "category/movies-by-genres/sci-fi"
      },
      {
        title: "Sport",
        filter: "category/movies-by-genres/sport"
      },
      {
        title: "Thriller",
        filter: "category/movies-by-genres/thriller"
      }
    ];
    genres = [
      {
        title: "Action",
        filter: "category/movies-by-genres/action"
      },
      {
        title: "Adventure",
        filter: "category/movies-by-genres/adventure"
      },
      {
        title: "Animation",
        filter: "category/movies-by-genres/animation"
      },
      {
        title: "Biography",
        filter: "category/movies-by-genres/biography"
      },
      {
        title: "Comedy",
        filter: "category/movies-by-genres/comedy"
      },
      {
        title: "Crime",
        filter: "category/movies-by-genres/crime"
      },
      {
        title: "Documentary",
        filter: "category/movies-by-genres/documentary"
      },
      {
        title: "Drama",
        filter: "category/movies-by-genres/drama"
      },
      {
        title: "Family",
        filter: "category/movies-by-genres/family"
      },
      {
        title: "Fantasy",
        filter: "category/movies-by-genres/fantasy"
      },
      {
        title: "History",
        filter: "category/movies-by-genres/history"
      },
      {
        title: "Horror",
        filter: "category/movies-by-genres/horror"
      },
      {
        title: "Music",
        filter: "category/movies-by-genres/music"
      },
      {
        title: "Mystery",
        filter: "category/movies-by-genres/mystery"
      },
      {
        title: "Romance",
        filter: "category/movies-by-genres/romance"
      },
      {
        title: "Sci-Fi",
        filter: "category/movies-by-genres/sci-fi"
      },
      {
        title: "Sport",
        filter: "category/movies-by-genres/sport"
      },
      {
        title: "Thriller",
        filter: "category/movies-by-genres/thriller"
      },
      {
        title: "War",
        filter: "category/movies-by-genres/war"
      },
      {
        title: "Western",
        filter: "category/movies-by-genres/western"
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

// providers/vega/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0, _1, _2) {
  return __async(this, arguments, function* (baseUrl, url, signal, headers3 = {}, axios, cheerio) {
    var _a, _b;
    try {
      const urlRes = yield fetch(url, {
        headers: __spreadProps(__spreadValues({}, headers3), {
          Referer: baseUrl
        }),
        signal
      });
      if (!urlRes.ok) {
        throw new Error(
          `HTTP ${urlRes.status} ${urlRes.statusText} | URL ${url}`
        );
      }
      const $ = cheerio.load(yield urlRes.text());
      const posts2 = [];
      (_b = (_a = $(".blog-items,.post-list,#archive-container,.movies-grid")) == null ? void 0 : _a.children("article,.entry-list-item,a")) == null ? void 0 : _b.each((index, element) => {
        var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
        const href = ((_b2 = (_a2 = $(element)) == null ? void 0 : _a2.find("a")) == null ? void 0 : _b2.attr("href")) || ((_c = $(element)) == null ? void 0 : _c.attr("href")) || "";
        const postUrl = new URL(href, `${baseUrl}/`);
        const rating = ((_d = $(element).find(".imdb-score, .rating, [class*='score']").text().match(/(\d+(?:\.\d+)?)/)) == null ? void 0 : _d[1]) || ((_e = $(element).find('meta[itemprop="ratingValue"]').attr("content")) == null ? void 0 : _e.trim());
        const tag = rating ? `${rating}\u2605` : void 0;
        const post = {
          title: (((_j = (_i = (_h = (_g = (_f = $(element)) == null ? void 0 : _f.find(".entry-title,.poster-title")) == null ? void 0 : _g.text()) == null ? void 0 : _h.replace("Download", "")) == null ? void 0 : _i.match(/^(.*?)\s*\((\d{4})\)|^(.*?)\s*\((Season \d+)\)/)) == null ? void 0 : _j[0]) || ((_m = (_l = (_k = $(element)) == null ? void 0 : _k.find("a")) == null ? void 0 : _l.attr("title")) == null ? void 0 : _m.replace("Download", "")) || ((_o = (_n = $(element)) == null ? void 0 : _n.find(".post-title,.poster-title").text()) == null ? void 0 : _o.replace("Download", "")) || "").trim(),
          link: `${postUrl.pathname}${postUrl.search}${postUrl.hash}`,
          image: $(element).find("a").find("img").attr("data-lazy-src") || $(element).find("a").find("img").attr("data-src") || $(element).find("a").find("img").attr("src") || $(element).find("img").attr("data-src") || $(element).find("img").attr("src") || "",
          tag
        };
        if (post.image.startsWith("//")) {
          post.image = "https:" + post.image;
        }
        console.log("vegaGetPosts post:", post);
        posts2.push(post);
      });
      return posts2;
    } catch (error) {
      throwProviderError("Vega", "posts", error);
    }
  });
}
var headers, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/vega/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    headers = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
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
      Cookie: "xla=s4t; _ga=GA1.1.1081149560.1756378968; _ga_BLZGKYN5PF=GS2.1.s1756378968$o1$g1$t1756378984$j44$l0$h0",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0"
    };
    getPosts = (_0) => __async(null, [_0], function* ({
      filter,
      page,
      providerValue,
      signal,
      providerContext
    }) {
      const { axios, cheerio } = providerContext;
      const baseUrl = yield getBaseUrl("Vega");
      console.log("vegaGetPosts baseUrl:", providerValue, baseUrl);
      const url = filter ? `${baseUrl}/${filter}/page/${page}/` : `${baseUrl}/page/${page}/`;
      console.log("vegaGetPosts url:", url);
      return posts(baseUrl, url, signal, headers, axios, cheerio);
    });
    getSearchPosts = (_0) => __async(null, [_0], function* ({
      searchQuery,
      page,
      providerValue,
      signal,
      providerContext
    }) {
      const { axios, cheerio } = providerContext;
      const baseUrl = yield getBaseUrl("Vega");
      console.log("vegaGetPosts baseUrl:", providerValue, baseUrl);
      const url = `${baseUrl}/search.php?q=${searchQuery}&page=${page}`;
      console.log("vegaGetPosts url:", url);
      try {
        const response = yield axios.get(url, {
          headers: __spreadProps(__spreadValues({}, headers), {
            Referer: baseUrl
          }),
          signal
        });
        const data = response.data;
        const posts2 = [];
        if (data == null ? void 0 : data.hits) {
          data.hits.forEach((hit) => {
            const doc = hit.document;
            const postUrl = new URL(doc.permalink, `${baseUrl}/`);
            const docRating = doc.rating || doc.imdbRating || doc.imdb_rating;
            const tag = docRating ? `${docRating}\u2605` : void 0;
            const post = {
              title: doc.post_title.replace("Download", "").trim(),
              link: `${postUrl.pathname}${postUrl.search}${postUrl.hash}`,
              image: doc.post_thumbnail,
              tag
            };
            posts2.push(post);
          });
        }
        return posts2;
      } catch (error) {
        throwProviderError("Vega", "search posts", error);
      }
    });
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

// providers/vega/cinemeta.ts
var init_cinemeta = __esm({
  "providers/vega/cinemeta.ts"() {
    "use strict";
    init_getCinemetaMeta();
  }
});

// providers/vega/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function applyCinemeta(info, meta) {
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
var headers2, getMeta;
var init_meta = __esm({
  "providers/vega/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    init_getCinemetaMeta();
    init_cinemeta();
    headers2 = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Cache-Control": "no-store",
      "Accept-Language": "en-US,en;q=0.9",
      DNT: "1",
      "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0"
    };
    getMeta = (_0) => __async(null, [_0], function* ({
      link,
      providerContext
    }) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
      try {
        const { axios, cheerio } = providerContext;
        const currentBaseUrl = yield getBaseUrl("Vega");
        const url = new URL(link, `${currentBaseUrl}/`).href;
        console.log("url", url);
        const baseUrl = url.split("/").slice(0, 3).join("/");
        const response = yield axios.get(url, {
          headers: __spreadProps(__spreadValues({}, headers2), {
            Referer: baseUrl
          })
        });
        const $ = cheerio.load(response.data);
        const infoContainer = $(
          ".entry-content, .post-content, .post-inner, .page-body"
        ).first();
        const cleanContainer = infoContainer.clone();
        cleanContainer.find(
          "#comments, .comments-area, #respond, .comments, .related-posts, footer, script, style, .sidebar, .widget"
        ).remove();
        let title = $("h1.post-title").text().trim();
        if (!title) {
          const heading2 = cleanContainer.find("h3");
          const titleRegex = /Name: (.+)/;
          title = ((_c = (_b = (_a = heading2 == null ? void 0 : heading2.next("p")) == null ? void 0 : _a.text()) == null ? void 0 : _b.match(titleRegex)) == null ? void 0 : _c[1]) || "";
        }
        let imdbId = ((_e = (_d = $('a[href*="imdb.com"]').attr("href")) == null ? void 0 : _d.match(/tt\d+/)) == null ? void 0 : _e[0]) || "";
        if (!imdbId) {
          const heading2 = cleanContainer.find("h3");
          imdbId = ((_i = (_h = (_g = (_f = heading2 == null ? void 0 : heading2.next("p")) == null ? void 0 : _f.find("a")) == null ? void 0 : _g.attr("href")) == null ? void 0 : _h.match(/tt\d+/g)) == null ? void 0 : _i[0]) || ((_j = cleanContainer.text().match(/tt\d+/g)) == null ? void 0 : _j[0]) || "";
        }
        let type = "movie";
        const heading = cleanContainer.find("h3");
        const cleanText = `${title} ${cleanContainer.text()}`;
        if (((_l = (_k = heading == null ? void 0 : heading.next("p")) == null ? void 0 : _k.text()) == null ? void 0 : _l.includes("Series Name")) || ((_m = heading == null ? void 0 : heading.text()) == null ? void 0 : _m.includes("Series Info")) || /\b(?:web\s*series|tv\s*series)\b/i.test(cleanText) || /\bseason\s*\d{1,2}\b/i.test(title) || /\bs\d{1,2}\s*e\d{1,3}\b/i.test(title) || /\bseason\s*\d{1,2}\b/i.test(cleanText) && !/\b(?:full\s*movie|movie\s*info)\b/i.test(cleanText)) {
          type = "series";
        }
        let synopsis = "";
        const synopsisHeader = $("h3").filter(
          (i, el) => $(el).text().includes("SYNOPSIS/PLOT") || $(el).text().includes("Plot")
        );
        if (synopsisHeader.length > 0) {
          synopsis = synopsisHeader.next("p").text().trim();
        }
        if (!synopsis) {
          const synopsisNode = (
            //@ts-ignore
            (_r = (_q = (_p = (_o = (_n = cleanContainer.find("p")) == null ? void 0 : _n.next("h3,h4")) == null ? void 0 : _o.next("p")) == null ? void 0 : _p[0]) == null ? void 0 : _q.children) == null ? void 0 : _r[0]
          );
          synopsis = synopsisNode && "data" in synopsisNode ? synopsisNode.data : "";
        }
        let image = cleanContainer.find("img[data-src]").first().attr("data-src") || cleanContainer.find("img[data-lazy-src]").first().attr("data-lazy-src") || cleanContainer.find("img[data-orig-src]").first().attr("data-orig-src") || ((_t = (_s = cleanContainer.find("img").filter((i, el) => {
          const src = $(el).attr("src") || "";
          return !!src && !src.startsWith("data:") && !src.includes("logo") && !src.includes("svg") && !src.includes("placeholder") && !src.includes("icon");
        })) == null ? void 0 : _s.first()) == null ? void 0 : _t.attr("src")) || "";
        if (image.startsWith("//")) {
          image = "https:" + image;
        }
        console.log({ title, synopsis, image, imdbId, type });
        let hr = (_u = infoContainer == null ? void 0 : infoContainer.first()) == null ? void 0 : _u.find("hr");
        const firstButton = $(".dwd-button, a[href*='nexdrive'], a[href*='vcloud'], a[href*='fastdl'], a[href*='hubcloud']").first();
        if (firstButton.length > 0) {
          const containerP = firstButton.closest("p");
          let prev = containerP.prev();
          while (prev.length && !prev.is("hr")) {
            prev = prev.prev();
          }
          if (prev.is("hr")) {
            hr = prev;
          }
        }
        const list = hr == null ? void 0 : hr.nextAll();
        const links = [];
        list.each((index, element) => {
          var _a2;
          element = $(element);
          if (element.is("hr") || element.is("style") || element.is("script")) return;
          if (element.find("a").length > 0 && (element.text().includes("Instant") || element.text().includes("Resumable") || element.text().includes("Download Now") || element.text().includes("Batch/Zip") || element.find(".dwd-button, .btn-outline").length > 0)) {
            return;
          }
          let rawTitle = element.text();
          let title2 = rawTitle.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
          if (!title2) return;
          if (/^[\s\-_=~*•–—:|]+$/.test(title2)) return;
          const lower = title2.toLowerCase();
          if (lower.includes("winding up") || lower.includes("thank you") || lower.includes("telegram") || lower.includes("how to download") || lower.includes("join our") || lower === "download now") {
            return;
          }
          const quality = ((_a2 = title2.match(/\d+p\b/i)) == null ? void 0 : _a2[0]) || "";
          if (!quality && !/episodes?\s*[:\d\-]/i.test(title2) && !/\[.*(?:mb|gb|e).*\]/i.test(title2)) {
            const nextEl = element.next();
            if (nextEl.length && (nextEl.is("h1, h2, h3, h4, h5, h6, strong") || nextEl.is("p") && nextEl.find("strong").length)) {
              return;
            }
          }
          title2 = title2.replace(/^[\s•\-*—_:=~|]+|[\s•\-*—_:=~|]+$/g, "").trim();
          if (!title2) return;
          let nextP = element.next();
          while (nextP.length && !nextP.is("hr") && !nextP.find("a[href]").length) {
            nextP = nextP.next();
          }
          if (!nextP.length || nextP.is("hr")) return;
          let btn;
          if (type === "series") {
            btn = nextP.find("a:contains('V-Cloud'), a:contains('vcloud'), a[href*='vcloud']").first();
            if (!btn.length) {
              btn = nextP.find("a").filter((_, a) => {
                const txt = $(a).text().toLowerCase();
                const href = ($(a).attr("href") || "").toLowerCase();
                return !txt.includes("zip") && !txt.includes("batch") && !href.includes("zip") && !href.includes("batch");
              }).first();
            }
          } else {
            btn = nextP.find("a:contains('V-Cloud'), a:contains('vcloud'), a[href*='vcloud']").first();
            if (!btn.length) {
              btn = nextP.find("a:contains('G-Direct'), a:contains('Direct'), a[href*='fastdl']").first();
            }
            if (!btn.length) {
              btn = nextP.find(".dwd-button, .btn-outline").first().parent();
            }
            if (!btn.length || !btn.attr("href")) {
              btn = nextP.find("a[href]").first();
            }
          }
          if (!btn || !btn.length) return;
          const btnHref = btn.attr("href") || "";
          if (!btnHref || btnHref === "/" || btnHref === "#") return;
          if (links.some(
            (l) => {
              var _a3;
              return l.episodesLink === btnHref || l.directLinks && ((_a3 = l.directLinks[0]) == null ? void 0 : _a3.link) === btnHref;
            }
          )) {
            return;
          }
          if (type === "series") {
            links.push({
              title: title2,
              episodesLink: btnHref,
              quality
            });
          } else {
            links.push({
              title: title2,
              directLinks: [{ title: "Movie", link: btnHref, type: "movie" }],
              quality
            });
          }
        });
        const quickDownload = yield (_v = providerContext.kvStore) == null ? void 0 : _v.get("vega_quickDownload");
        const websiteInfo = {
          title,
          synopsis,
          image,
          imdbId: imdbId || "",
          type,
          quickDownload: quickDownload != null ? quickDownload : true,
          linkList: links,
          webUrl: url
        };
        if (!imdbId) return websiteInfo;
        try {
          const cinemeta = yield getCinemetaMeta(imdbId, type, providerContext);
          if (cinemeta) {
            if (type === "series" && cinemeta.type === "series") {
              websiteInfo.linkList = websiteInfo.linkList.map((item) => {
                if (!item.episodesLink) return item;
                const season = getCinemetaSeason(item.title);
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
            return applyCinemeta(websiteInfo, cinemeta);
          }
        } catch (e) {
          console.warn("Vega: Cinemeta lookup failed", e);
        }
        return websiteInfo;
      } catch (error) {
        console.log("getInfo error");
        console.error(error);
        throw error;
      }
    });
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
function hubcloudExtractor(link, signal, axios, cheerio, headers3, providerContext, isDownload, providerValue) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      if (!headers3["Cookie"]) {
        headers3["Cookie"] = "ext_name=ojplmecpdpgccookcobabopnaifgidhf; xla=s4t; cf_clearance=woQrFGXtLfmEMBEiGUsVHrUBMT8s3cmguIzmMjmvpkg-1770053679-1.2.1.1-xBrQdciOJsweUF6F2T_OtH6jmyanN_TduQ0yslc_XqjU6RcHSxI7.YOKv6ry7oYo64868HYoULnVyww536H2eVI3R2e4wKzsky6abjPdfQPxqpUaXjxfJ02o6jl3_Vkwr4uiaU7Wy596Vdst3y78HXvVmKdIohhtPvp.vZ9_L7wvWdce0GRixjh_6JiqWmWMws46hwEt3hboaS1e1e4EoWCvj5b0M_jVwvSxBOAW5emFzvT3QrnRh4nyYmKDERnY";
      }
      console.log("hubcloudExtractor", link);
      const baseUrl = link.split("/").slice(0, 3).join("/");
      const streamLinks = [];
      const openWebView = providerContext == null ? void 0 : providerContext.openWebView;
      let vLinkRes;
      try {
        vLinkRes = yield axios(`${link}`, { headers: headers3, signal });
      } catch (error) {
        if (((_a = error.response) == null ? void 0 : _a.status) === 403) {
          if (openWebView) {
            console.log(
              `hubcloudExtractor: WAF detected (403) for ${link}, using solver...`
            );
            const cleanHeaders = __spreadProps(__spreadValues({}, headers3), { Referer: baseUrl });
            const wafResult = yield openWebView(baseUrl, {
              title: "Solve the captcha below and click done",
              description: "Required to bypass anti-bot protection.",
              headers: cleanHeaders,
              waitForCookie: "cf_clearance",
              force: true
            });
            if (wafResult.userAgent) headers3["User-Agent"] = wafResult.userAgent;
            headers3["Cookie"] = (headers3["Cookie"] ? headers3["Cookie"] + "; " : "") + wafResult.cookies;
            vLinkRes = yield axios(`${link}`, { headers: headers3, signal });
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
          if (gfStream && !streamLinks.some((s) => s.link === gfStream.link)) {
            streamLinks.push(gfStream);
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
        if (gfStream && !streamLinks.some((s) => s.link === gfStream.link)) {
          streamLinks.push(gfStream);
        }
      }
      let vcloudText = "";
      if (vcloudLink && !vcloudLink.includes("gofile.io") && vcloudLink !== link) {
        try {
          const vcloudRes = yield axios.get(vcloudLink, { headers: headers3, signal });
          vcloudText = vcloudRes.data;
        } catch (error) {
          if (((_b = error.response) == null ? void 0 : _b.status) === 403 && openWebView) {
            console.log(
              `hubcloudExtractor: WAF detected (403) for ${vcloudLink}, using solver...`
            );
            const vcloudBaseUrl = vcloudLink.split("/").slice(0, 3).join("/");
            const cleanHeaders2 = __spreadProps(__spreadValues({}, headers3), { Referer: vcloudBaseUrl });
            const wafResult = yield openWebView(vcloudBaseUrl, {
              title: "Solve the captcha below and click done",
              description: "Required to bypass anti-bot protection.",
              headers: cleanHeaders2,
              waitForCookie: "cf_clearance",
              force: true
            });
            if (wafResult.userAgent) headers3["User-Agent"] = wafResult.userAgent;
            headers3["Cookie"] = (headers3["Cookie"] ? headers3["Cookie"] + "; " : "") + wafResult.cookies;
            const retryRes = yield axios.get(vcloudLink, { headers: headers3, signal });
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
            streamLinks.push({ server: "Pixeldrain", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes(".dev")) && !(link2 == null ? void 0 : link2.includes("/?id="))):
            streamLinks.push({ server: "CF Worker", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes("hubcloud")) || (link2 == null ? void 0 : link2.includes("/?id="))):
            try {
              let newLink = link2;
              try {
                if (typeof fetch !== "undefined") {
                  const fRes = yield fetch(link2, {
                    headers: headers3,
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
                    headers: headers3,
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
                      headers: headers3,
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
              streamLinks.push({
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
              if (gfStream && !streamLinks.some((s) => s.link === gfStream.link)) {
                streamLinks.push(gfStream);
              }
            } catch (error) {
              console.log("hubcloudExtractor error in gofile link: ", error);
            }
            break;
          case (link2 == null ? void 0 : link2.includes("cloudflarestorage")):
            streamLinks.push({ server: "CF Storage", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes("fastdl")) || (link2 == null ? void 0 : link2.includes("fsl."))):
            streamLinks.push({ server: "FastDl", link: link2, type: "mkv" });
            break;
          case (link2.includes("hubcdn") && !link2.includes("/?id=")):
            streamLinks.push({
              server: "HubCdn",
              link: link2,
              type: "mkv"
            });
            break;
          default:
            if ((link2 == null ? void 0 : link2.includes(".mkv")) || (link2 == null ? void 0 : link2.includes("?token="))) {
              const serverName = "CF Worker";
              streamLinks.push({ server: serverName, link: link2, type: "mkv" });
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
      streamLinks.sort((a, b) => getPriority(a.server) - getPriority(b.server));
      console.log("streamLinks", streamLinks);
      return streamLinks;
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

// providers/extractors/transferit.ts
function transferitExtractor(transferId, axios, userAgent) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e;
    try {
      const megaApiUrl = `https://g.api.mega.co.nz/cs?x=${transferId}&bc=1`;
      const headers3 = {
        "Content-Type": "application/json",
        "User-Agent": userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      };
      const fileListRes = yield axios.post(
        megaApiUrl,
        [{ a: "f", c: 1, r: 1 }],
        {
          headers: headers3,
          timeout: 1e4
        }
      );
      const fileNode = (_c = (_b = (_a = fileListRes.data) == null ? void 0 : _a[0]) == null ? void 0 : _b.f) == null ? void 0 : _c.find((f) => f.t === 0);
      if (!(fileNode == null ? void 0 : fileNode.h)) return null;
      const dlRes = yield axios.post(
        megaApiUrl,
        [{ a: "g", n: fileNode.h, pt: 1, g: 1, ssl: 1 }],
        {
          headers: headers3,
          timeout: 1e4
        }
      );
      const gUrl = (_e = (_d = dlRes.data) == null ? void 0 : _d[0]) == null ? void 0 : _e.g;
      if (!gUrl) return null;
      return `${gUrl}/video.mp4`;
    } catch (err) {
      return null;
    }
  });
}
var init_transferit = __esm({
  "providers/extractors/transferit.ts"() {
    "use strict";
  }
});

// providers/extractors/buzzheavier.ts
function buzzheavierExtractor(link, axios, ctx) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    try {
      const pageUrl = new URL(link);
      pageUrl.pathname = pageUrl.pathname.replace(/\/download\/?$/, "");
      const headers3 = __spreadProps(__spreadValues({}, ctx.commonHeaders), {
        Referer: pageUrl.origin + "/"
      });
      const page = yield axios.get(pageUrl.href, { headers: headers3 });
      const $ = ctx.cheerio.load(page.data);
      const path = $("a.download-btn").attr("hx-get");
      if (!path) return null;
      const cookies = (_a = page.headers) == null ? void 0 : _a["set-cookie"];
      const cookie = (Array.isArray(cookies) ? cookies : [cookies]).filter((value) => typeof value === "string" && !!value).map((value) => value.split(";", 1)[0]).join("; ");
      const response = yield axios.head(new URL(path, pageUrl).href, {
        headers: __spreadValues(__spreadProps(__spreadValues({}, headers3), {
          Referer: pageUrl.href,
          "HX-Request": "true",
          "HX-Current-URL": pageUrl.href
        }), cookie ? { Cookie: cookie } : {}),
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400
      });
      const target = ((_b = response.headers) == null ? void 0 : _b["hx-redirect"]) || ((_c = response.headers) == null ? void 0 : _c.location);
      if (typeof target !== "string" || !target) return null;
      const mediaUrl = new URL(target, pageUrl);
      if (!["https:", "http:"].includes(mediaUrl.protocol)) return null;
      return {
        server: "Buzzheavier",
        link: mediaUrl.href,
        type: "mkv",
        headers: __spreadProps(__spreadValues({}, ctx.commonHeaders), { Referer: pageUrl.href })
      };
    } catch (error) {
      console.warn("Buzzheavier extraction failed:", (error == null ? void 0 : error.message) || "request failed");
      return null;
    }
  });
}
var init_buzzheavier = __esm({
  "providers/extractors/buzzheavier.ts"() {
    "use strict";
  }
});

// providers/extractors/vegadrive.ts
function vegadriveExtractor(vegadriveUrl, axios, ctx) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d;
    const streams = [];
    try {
      const defaultUserAgent = ((_a = ctx == null ? void 0 : ctx.commonHeaders) == null ? void 0 : _a["User-Agent"]) || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      const baseHeaders = {
        "User-Agent": defaultUserAgent,
        Referer: vegadriveUrl
      };
      let finalUrl = vegadriveUrl;
      let pageRes;
      for (let redirects = 0; ; redirects++) {
        pageRes = yield axios.get(finalUrl, {
          headers: baseHeaders,
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400
        });
        const location = ((_b = pageRes.headers) == null ? void 0 : _b.location) || ((_c = pageRes.headers) == null ? void 0 : _c.Location);
        if (![301, 302, 303, 307, 308].includes(pageRes.status) || !location) break;
        if (redirects >= 8) throw new Error("Too many VegaDrive mirror redirects");
        const nextUrl = new URL(String(location), finalUrl);
        if (!["http:", "https:"].includes(nextUrl.protocol)) {
          throw new Error("Invalid VegaDrive mirror redirect");
        }
        finalUrl = nextUrl.href;
      }
      const cookieHeader = (_d = pageRes.headers) == null ? void 0 : _d["set-cookie"];
      let cookieStr = "";
      if (Array.isArray(cookieHeader)) {
        cookieStr = cookieHeader.map((c) => String(c).split(";")[0]).join("; ");
      } else if (cookieHeader) {
        cookieStr = String(cookieHeader).split(";")[0];
      }
      const vdBase = new URL(finalUrl).origin;
      const reqHeaders = __spreadValues(__spreadProps(__spreadValues({}, baseHeaders), {
        Referer: finalUrl
      }), cookieStr ? { Cookie: cookieStr } : {});
      const shareIdMatch = vegadriveUrl.match(/\/s\/([a-zA-Z0-9]+)/);
      if (!shareIdMatch) return streams;
      const shareId = shareIdMatch[1];
      const targetProviders = ["buzzheavier", "gofile", "pixeldrain", "transferit"];
      yield Promise.all(
        targetProviders.map((provider) => __async(null, null, function* () {
          var _a2, _b2, _c2, _d2;
          try {
            const dUrl = `${vdBase}/d/${shareId}/${provider}`;
            const dRes = yield axios.get(dUrl, {
              headers: reqHeaders,
              maxRedirects: 0,
              validateStatus: (s) => s >= 200 && s < 400
            });
            let targetLoc = ((_a2 = dRes.headers) == null ? void 0 : _a2.location) || ((_b2 = dRes.headers) == null ? void 0 : _b2.Location);
            if (!targetLoc) return;
            if (targetLoc.startsWith("/")) {
              targetLoc = `${vdBase}${targetLoc}`;
            }
            if (targetLoc.includes("__vega_bridge")) {
              const bridgeRes = yield axios.get(targetLoc, {
                headers: reqHeaders,
                maxRedirects: 0,
                validateStatus: (s) => s >= 200 && s < 400
              });
              targetLoc = ((_c2 = bridgeRes.headers) == null ? void 0 : _c2.location) || ((_d2 = bridgeRes.headers) == null ? void 0 : _d2.Location);
              if (targetLoc && targetLoc.startsWith("/")) {
                targetLoc = `${vdBase}${targetLoc}`;
              }
            }
            if (!targetLoc) return;
            if (provider === "buzzheavier") {
              const resolved = yield buzzheavierExtractor(targetLoc, axios, ctx);
              if (resolved) streams.push(resolved);
            } else if (provider === "pixeldrain") {
              const pxMatch = targetLoc.match(/\/u\/([a-zA-Z0-9_-]+)/) || targetLoc.match(/\/file\/([a-zA-Z0-9_-]+)/);
              if (pxMatch) {
                streams.push({
                  server: "Pixeldrain",
                  link: `https://pixeldrain.com/api/file/${pxMatch[1]}`,
                  type: "mp4"
                });
              }
            } else if (provider === "gofile") {
              const gofileMatch = targetLoc.match(/\/d\/([a-zA-Z0-9]+)/);
              if (gofileMatch) {
                const gfStream = yield gofileExtractor(gofileMatch[1], axios, ctx);
                if (gfStream && gfStream.link) {
                  streams.push({
                    server: "Gofile",
                    link: gfStream.link,
                    type: "mp4",
                    headers: {
                      "User-Agent": defaultUserAgent,
                      Referer: "https://gofile.io/",
                      Cookie: `accountToken=${gfStream.token}`
                    }
                  });
                }
              }
            } else if (provider === "transferit") {
              const trMatch = targetLoc.match(/\/t\/([a-zA-Z0-9_-]+)/);
              if (trMatch) {
                const transferId = trMatch[1];
                const ddl = yield transferitExtractor(transferId, axios, defaultUserAgent);
                if (ddl) {
                  streams.push({
                    server: "Transfer.it",
                    link: ddl,
                    type: "mp4"
                  });
                }
              }
            }
          } catch (err) {
          }
        }))
      );
    } catch (error) {
    }
    return streams;
  });
}
var init_vegadrive = __esm({
  "providers/extractors/vegadrive.ts"() {
    "use strict";
    init_gofile();
    init_transferit();
    init_buzzheavier();
  }
});

// providers/vega/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
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
      const streamLinks = [];
      console.log("dotlink", link);
      let hubcloudUrl = link;
      let vegadriveUrl = "";
      if (link.startsWith("{") && link.endsWith("}")) {
        try {
          const parsed = JSON.parse(link);
          if (parsed.hubcloud) hubcloudUrl = parsed.hubcloud;
          if (parsed.vegadrive) vegadriveUrl = parsed.vegadrive;
        } catch (e) {
        }
      } else if (link.includes("vegadrive") || link.includes("one.vegadrive")) {
        vegadriveUrl = link;
        hubcloudUrl = "";
      }
      if (vegadriveUrl) {
        try {
          const vdStreams = yield vegadriveExtractor(vegadriveUrl, axios, providerContext);
          if (Array.isArray(vdStreams)) {
            for (const s of vdStreams) {
              if (!streamLinks.some((existing) => existing.link === s.link)) {
                streamLinks.push(s);
              }
            }
          }
        } catch (e) {
          console.log("vegadrive error:", e == null ? void 0 : e.message);
        }
      }
      if (!hubcloudUrl) {
        if (streamLinks.length > 0) return streamLinks;
      }
      link = hubcloudUrl;
      if (!link.includes("cloud")) {
        try {
          const dotlinkRes = yield axios.get(link, {
            headers: __spreadProps(__spreadValues({}, commonHeaders), { Referer: link.split("/").slice(0, 3).join("/") }),
            signal,
            timeout: 1e4
          });
          const dotlinkText = dotlinkRes.data;
          const $ = cheerio.load(dotlinkText);
          const gDirectLink = $(
            "a:contains('G-Direct'), a:contains('Instant'), a[href*='fastdl']"
          ).attr("href");
          if (gDirectLink) {
            try {
              const fastdlRes = yield axios.get(gDirectLink, {
                headers: __spreadProps(__spreadValues({}, commonHeaders), { Referer: link }),
                signal,
                timeout: 1e4
              });
              const m = fastdlRes.data.match(/reurl\s*=\s*["']([^"']+)["']/);
              if (m) {
                const targetUrl = m[1].includes("link=") ? decodeURIComponent(m[1].split("link=")[1]) : m[1];
                if (targetUrl.includes("googleusercontent.com") || targetUrl.startsWith("http")) {
                  streamLinks.push({
                    server: "Instant (Google CDN)",
                    link: targetUrl,
                    type: "mkv"
                  });
                }
              }
            } catch (e) {
              console.log("FastDL error:", e == null ? void 0 : e.message);
            }
          }
          const vegadriveAnchor = $(
            "a:contains('Vega Drive'), a[href*='vegadrive']"
          );
          const pageVdLink = vegadriveAnchor.attr("href");
          if (pageVdLink) {
            try {
              const vdStreams = yield vegadriveExtractor(pageVdLink, axios, providerContext);
              if (Array.isArray(vdStreams)) {
                for (const s of vdStreams) {
                  if (!streamLinks.some((existing) => existing.link === s.link)) {
                    streamLinks.push(s);
                  }
                }
              }
            } catch (e) {
              console.log("vegadrive dotlink error:", e == null ? void 0 : e.message);
            }
          }
          const vcloudAnchor = $(
            "a:contains('V-Cloud'), a[href*='vcloud'], a[href*='hubcloud']"
          );
          const vlink = vcloudAnchor.attr("href") || (dotlinkText.match(/<a\s+href="([^"]*cloud\.[^"]*)"/i) || [])[1];
          if (vlink) {
            try {
              const hcStreams = yield hubcloudExtractor(
                vlink,
                signal,
                axios,
                cheerio,
                commonHeaders,
                providerContext,
                isDownload,
                "vega"
              );
              if (Array.isArray(hcStreams)) {
                for (const s of hcStreams) {
                  if (!streamLinks.some((existing) => existing.link === s.link)) {
                    streamLinks.push(s);
                  }
                }
              }
            } catch (e) {
              console.log("HubCloud vcloud error:", e == null ? void 0 : e.message);
            }
          }
          try {
            const filepressAnchor = $(
              '.btn.btn-sm.btn-outline[style*="rgb(252,185,0)"], a:contains("Filepress"), a[href*="filepress"], a[href*="filebee"]'
            ).first();
            const filepressLink = filepressAnchor.attr("href") || filepressAnchor.parent().attr("href");
            if (filepressLink) {
              const filepressID = filepressLink.split("/").pop();
              const filepressBaseUrl = filepressLink.split("/").slice(0, -2).join("/");
              const filepressTokenRes = yield axios.post(
                filepressBaseUrl + "/api/file/downlaod/",
                {
                  id: filepressID,
                  method: "indexDownlaod",
                  captchaValue: null
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Referer: filepressBaseUrl
                  },
                  timeout: 1e4
                }
              );
              if ((_a = filepressTokenRes.data) == null ? void 0 : _a.status) {
                const filepressToken = (_b = filepressTokenRes.data) == null ? void 0 : _b.data;
                const filepressStreamLink = yield axios.post(
                  filepressBaseUrl + "/api/file/downlaod2/",
                  {
                    id: filepressToken,
                    method: "indexDownlaod",
                    captchaValue: null
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Referer: filepressBaseUrl
                    },
                    timeout: 1e4
                  }
                );
                if ((_d = (_c = filepressStreamLink.data) == null ? void 0 : _c.data) == null ? void 0 : _d[0]) {
                  streamLinks.push({
                    server: "filepress",
                    link: filepressStreamLink.data.data[0],
                    type: "mkv"
                  });
                }
              }
            }
          } catch (error) {
            console.log("filepress error:", error == null ? void 0 : error.message);
          }
        } catch (err) {
          console.log("dotlink error:", err == null ? void 0 : err.message);
        }
      } else {
        const hcStreams = yield hubcloudExtractor(
          link,
          signal,
          axios,
          cheerio,
          commonHeaders,
          providerContext,
          isDownload,
          "vega"
        );
        if (Array.isArray(hcStreams)) {
          streamLinks.push(...hcStreams);
        }
      }
      if (streamLinks.length > 0) {
        return streamLinks;
      }
      return yield hubcloudExtractor(
        link,
        signal,
        axios,
        cheerio,
        commonHeaders,
        providerContext,
        isDownload,
        "vega"
      );
    } catch (error) {
      throwProviderError("Vega", "stream", error);
    }
  });
}
var init_stream = __esm({
  "providers/vega/stream.ts"() {
    "use strict";
    init_hubcloud();
    init_vegadrive();
    init_providerErrors();
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

// providers/vega/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/vega/episodes.ts"() {
    "use strict";
    init_providerErrors();
    init_getCinemetaMeta();
    init_cinemeta();
    init_theintrodb();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        var _a, _b;
        const { axios, cheerio, commonHeaders: headers3 } = providerContext;
        console.log("getEpisodeLinks", url);
        try {
          const context = readCinemetaContext(url);
          const res = yield axios.get(context.requestUrl, {
            headers: __spreadProps(__spreadValues({}, headers3), {
              cookie: "ext_name=ojplmecpdpgccookcobabopnaifgidhf; cf_clearance=6yZYfXQxBgjaD1eacR5zZCz7njssbxjtSZZCElTOGk0-1764836255-1.2.1.1-bzHvDcDRLp6AAYo7qvGVzJ6Gk6zaqAepuGiGhAWCGYL.ZDpw5yI4TkUIXDgAnEhGCZ9J5X2_OagzgeMHZrd8rzeyAFQXj0dmYMErcfII7_Rhq5kZ4kAtS0tl9PtaNKKd2m4taIufySXCCstl3iNLMODTjbsW_KZi8U8DauOdGSAhBd1DCGxvLlAOM.snfkhb0yQiVJcLW8Bv9IeKQac0ar_TKkV6QexqNZYiyRXnE7E; xla=s4t",
              "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0"
            })
          });
          const $ = cheerio.load(res.data);
          const container = $(".entry-content,.entry-inner");
          $(".unili-content,.code-block-1").remove();
          const episodes = [];
          container.find("h3, h4, h5, p").each((index, element) => {
            const el = $(element);
            const text = el.text().trim();
            if (/episodes?\s*[:\d\-]/i.test(text) || /e\d{1,3}\b/i.test(text) || /^episode\s*\d+/i.test(text)) {
              const title = text.replace(/\s+/g, " ").trim().replace(/^[-:\s]+|[-:\s]+$/g, "").replace(/^episodes?\s*:\s*/i, "Episode ");
              let nextP = el.next();
              while (nextP.length && !nextP.is("p") && !nextP.find("a[href]").length) {
                nextP = nextP.next();
              }
              const vcloudLink = nextP.find("a[href*='vcloud'], a[href*='hubcloud']").attr("href");
              const vegadriveLink = nextP.find("a[href*='vegadrive']").attr("href");
              let link = "";
              if (vcloudLink && vegadriveLink) {
                link = JSON.stringify({ hubcloud: vcloudLink, vegadrive: vegadriveLink });
              } else {
                link = vcloudLink || vegadriveLink || nextP.find("a[href*='fastdl']").attr("href") || nextP.find(".btn-outline").parent().attr("href") || nextP.find(".btn-outline").attr("href") || nextP.find("a[href]").first().attr("href") || "";
              }
              if (title && link && !episodes.some((e) => e.title === title)) {
                episodes.push({ title, link });
              }
            }
          });
          const quickDownload = yield (_a = providerContext.kvStore) == null ? void 0 : _a.get("vega_quickDownload");
          const skipTimings = yield (_b = providerContext.kvStore) == null ? void 0 : _b.get("vega_skipTimings");
          if (!context.imdbId || !context.season) {
            return episodes.map((e) => __spreadProps(__spreadValues({}, e), {
              quickDownload: quickDownload != null ? quickDownload : true
            }));
          }
          let enriched = episodes;
          try {
            const cinemeta = yield getCinemetaMeta(
              context.imdbId,
              "series",
              providerContext
            );
            if (cinemeta) {
              enriched = enrichCinemetaEpisodes(episodes, cinemeta.videos || [], context.season);
            }
          } catch (e) {
            console.warn("Vega: Cinemeta episode lookup failed", e);
          }
          if (skipTimings != null ? skipTimings : true) {
            try {
              enriched = yield enrichEpisodesWithSkipTimings(
                enriched,
                context.imdbId,
                context.season,
                providerContext
              );
            } catch (e) {
              console.warn("Vega: Skip timings lookup failed", e);
            }
          }
          return enriched.map((e) => __spreadProps(__spreadValues({}, e), {
            quickDownload: quickDownload != null ? quickDownload : true
          }));
        } catch (err) {
          throwProviderError("Vega", "episodes", err);
        }
      });
    };
  }
});

// providers/vega/vega.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
