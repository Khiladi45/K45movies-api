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

// providers/vega/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0, _1, _2) {
  return __async(this, arguments, function* (baseUrl, url, signal, headers4 = {}, axios, cheerio) {
    var _a, _b;
    try {
      const urlRes = yield fetch(url, {
        headers: __spreadProps(__spreadValues({}, headers4), {
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
        var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
        const href = ((_b2 = (_a2 = $(element)) == null ? void 0 : _a2.find("a")) == null ? void 0 : _b2.attr("href")) || ((_c = $(element)) == null ? void 0 : _c.attr("href")) || "";
        const postUrl = new URL(href, `${baseUrl}/`);
        const post = {
          title: (((_h = (_g = (_f = (_e = (_d = $(element)) == null ? void 0 : _d.find(".entry-title,.poster-title")) == null ? void 0 : _e.text()) == null ? void 0 : _f.replace("Download", "")) == null ? void 0 : _g.match(/^(.*?)\s*\((\d{4})\)|^(.*?)\s*\((Season \d+)\)/)) == null ? void 0 : _h[0]) || ((_k = (_j = (_i = $(element)) == null ? void 0 : _i.find("a")) == null ? void 0 : _j.attr("title")) == null ? void 0 : _k.replace("Download", "")) || ((_m = (_l = $(element)) == null ? void 0 : _l.find(".post-title,.poster-title").text()) == null ? void 0 : _m.replace("Download", "")) || "").trim(),
          link: `${postUrl.pathname}${postUrl.search}${postUrl.hash}`,
          image: $(element).find("a").find("img").attr("data-lazy-src") || $(element).find("a").find("img").attr("data-src") || $(element).find("a").find("img").attr("src") || $(element).find("img").attr("data-src") || $(element).find("img").attr("src") || ""
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
            const post = {
              title: doc.post_title.replace("Download", "").trim(),
              link: `${postUrl.pathname}${postUrl.search}${postUrl.hash}`,
              image: doc.post_thumbnail
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
      "Sec-Fetch-User": "?1",
      Cookie: "xla=s4t; _ga=GA1.1.1081149560.1756378968; _ga_BLZGKYN5PF=GS2.1.s1756378968$o1$g1$t1756378984$j44$l0$h0",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0"
    };
    getMeta = (_0) => __async(null, [_0], function* ({
      link,
      providerContext
    }) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
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
          ".entry-content, .post-inner, .post-content, .page-body"
        );
        let title = $("h1.post-title").text().trim();
        if (!title) {
          const heading2 = infoContainer == null ? void 0 : infoContainer.find("h3");
          const titleRegex = /Name: (.+)/;
          title = ((_c = (_b = (_a = heading2 == null ? void 0 : heading2.next("p")) == null ? void 0 : _a.text()) == null ? void 0 : _b.match(titleRegex)) == null ? void 0 : _c[1]) || "";
        }
        let imdbId = ((_e = (_d = $('a[href*="imdb.com"]').attr("href")) == null ? void 0 : _d.match(/tt\d+/)) == null ? void 0 : _e[0]) || "";
        if (!imdbId) {
          const heading2 = infoContainer == null ? void 0 : infoContainer.find("h3");
          imdbId = ((_i = (_h = (_g = (_f = heading2 == null ? void 0 : heading2.next("p")) == null ? void 0 : _f.find("a")) == null ? void 0 : _g.attr("href")) == null ? void 0 : _h.match(/tt\d+/g)) == null ? void 0 : _i[0]) || ((_j = infoContainer.text().match(/tt\d+/g)) == null ? void 0 : _j[0]) || "";
        }
        let type = "movie";
        const heading = infoContainer == null ? void 0 : infoContainer.find("h3");
        const pageText = `${title} ${infoContainer.text()}`;
        if (((_l = (_k = heading == null ? void 0 : heading.next("p")) == null ? void 0 : _k.text()) == null ? void 0 : _l.includes("Series Name")) || /\b(?:web\s+series|season\s*\d{1,2}|s\d{1,2}\s*e\d{1,3})\b/i.test(
          pageText
        )) {
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
            (_q = (_p = (_o = (_n = (_m = infoContainer == null ? void 0 : infoContainer.find("p")) == null ? void 0 : _m.next("h3,h4")) == null ? void 0 : _n.next("p")) == null ? void 0 : _o[0]) == null ? void 0 : _p.children) == null ? void 0 : _q[0]
          );
          synopsis = synopsisNode && "data" in synopsisNode ? synopsisNode.data : "";
        }
        let image = ((_r = infoContainer == null ? void 0 : infoContainer.find("img[data-lazy-src]")) == null ? void 0 : _r.attr("data-lazy-src")) || ((_u = (_t = (_s = infoContainer == null ? void 0 : infoContainer.find("img")) == null ? void 0 : _s.filter((i, el) => {
          const src = $(el).attr("src");
          return !!src && !src.includes("logo") && !src.includes("svg") && !src.includes("placeholder") && !src.includes("icon");
        })) == null ? void 0 : _t.first()) == null ? void 0 : _u.attr("src")) || "";
        if (image.startsWith("//")) {
          image = "https:" + image;
        }
        console.log({ title, synopsis, image, imdbId, type });
        let hr = (_v = infoContainer == null ? void 0 : infoContainer.first()) == null ? void 0 : _v.find("hr");
        const firstButton = $(".dwd-button").first();
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
          var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2;
          element = $(element);
          const title2 = (element == null ? void 0 : element.text()) || "";
          const quality = ((_a2 = element == null ? void 0 : element.text().match(/\d+p\b/)) == null ? void 0 : _a2[0]) || "";
          const movieLinks = (element == null ? void 0 : element.next().find(".dwd-button").text().toLowerCase().includes("download")) || element.next().find("a").text().toLowerCase().includes("download") ? ((_c2 = (_b2 = element == null ? void 0 : element.next().find(".dwd-button")) == null ? void 0 : _b2.parent()) == null ? void 0 : _c2.attr("href")) || ((_d2 = element == null ? void 0 : element.next().find("a[href]")) == null ? void 0 : _d2.attr("href")) : "";
          const vcloudLinks = (_f2 = (_e2 = element == null ? void 0 : element.next().find(".btn-outline[style*='#ed0b0b']")) == null ? void 0 : _e2.parent()) == null ? void 0 : _f2.attr("href");
          const episodesLink = (vcloudLinks ? vcloudLinks : (element == null ? void 0 : element.next().find(".dwd-button").text().toLowerCase().includes("episode")) ? (_h2 = (_g2 = element == null ? void 0 : element.next().find(".dwd-button")) == null ? void 0 : _g2.parent()) == null ? void 0 : _h2.attr("href") : "") || ((_j2 = (_i2 = element == null ? void 0 : element.next().find(".btn-outline[style*='#0ebac3']")) == null ? void 0 : _i2.parent()) == null ? void 0 : _j2.attr("href"));
          if (movieLinks || episodesLink) {
            links.push({
              title: title2,
              directLinks: movieLinks ? [{ title: "Movie", link: movieLinks, type: "movie" }] : [],
              episodesLink,
              quality
            });
          }
        });
        const quickDownload = yield (_w = providerContext.kvStore) == null ? void 0 : _w.get("vega_quickDownload");
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
        const cinemeta = yield getCinemetaMeta(imdbId, type, providerContext);
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
function checkStreamHealth(stream, signal) {
  return __async(this, null, function* () {
    if (!(stream == null ? void 0 : stream.link)) return false;
    const reqHeaders = __spreadValues({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }, stream.headers || {});
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4e3);
      if (signal) {
        signal.addEventListener("abort", () => controller.abort(), { once: true });
      }
      const res = yield fetch(stream.link, {
        method: "HEAD",
        headers: reqHeaders,
        signal: controller.signal,
        redirect: "follow"
      });
      clearTimeout(timeoutId);
      if (res.status >= 200 && res.status < 400) {
        return true;
      }
      if (res.status === 405 || res.status === 403) {
        const getController = new AbortController();
        const getTimeoutId = setTimeout(() => getController.abort(), 4e3);
        if (signal) {
          signal.addEventListener("abort", () => getController.abort(), { once: true });
        }
        const getRes = yield fetch(stream.link, {
          method: "GET",
          headers: __spreadProps(__spreadValues({}, reqHeaders), { Range: "bytes=0-0" }),
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
}
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
function hubcloudExtractor(link, signal, axios, cheerio, headers4, providerContext, isDownload, providerValue) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
      if (!headers4["Cookie"]) {
        headers4["Cookie"] = "ext_name=ojplmecpdpgccookcobabopnaifgidhf; xla=s4t; cf_clearance=woQrFGXtLfmEMBEiGUsVHrUBMT8s3cmguIzmMjmvpkg-1770053679-1.2.1.1-xBrQdciOJsweUF6F2T_OtH6jmyanN_TduQ0yslc_XqjU6RcHSxI7.YOKv6ry7oYo64868HYoULnVyww536H2eVI3R2e4wKzsky6abjPdfQPxqpUaXjxfJ02o6jl3_Vkwr4uiaU7Wy596Vdst3y78HXvVmKdIohhtPvp.vZ9_L7wvWdce0GRixjh_6JiqWmWMws46hwEt3hboaS1e1e4EoWCvj5b0M_jVwvSxBOAW5emFzvT3QrnRh4nyYmKDERnY";
      }
      console.log("hubcloudExtractor", link);
      const baseUrl = link.split("/").slice(0, 3).join("/");
      const streamLinks = [];
      const openWebView = providerContext == null ? void 0 : providerContext.openWebView;
      let vLinkRes;
      try {
        vLinkRes = yield axios(`${link}`, { headers: headers4, signal });
      } catch (error) {
        if (((_a = error.response) == null ? void 0 : _a.status) === 403) {
          if (openWebView) {
            console.log(
              `hubcloudExtractor: WAF detected (403) for ${link}, using solver...`
            );
            const cleanHeaders = __spreadProps(__spreadValues({}, headers4), { Referer: baseUrl });
            delete cleanHeaders["User-Agent"];
            delete cleanHeaders["sec-ch-ua"];
            delete cleanHeaders["sec-ch-ua-mobile"];
            delete cleanHeaders["sec-ch-ua-platform"];
            delete cleanHeaders["Cookie"];
            const wafResult = yield openWebView(baseUrl, {
              title: "Solve the captcha below and click done",
              description: "Required to bypass anti-bot protection.",
              headers: cleanHeaders,
              waitForCookie: "cf_clearance",
              force: true
            });
            if (wafResult.userAgent) headers4["User-Agent"] = wafResult.userAgent;
            headers4["Cookie"] = (headers4["Cookie"] ? headers4["Cookie"] + "; " : "") + wafResult.cookies;
            vLinkRes = yield axios(`${link}`, { headers: headers4, signal });
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
          const vcloudRes = yield axios.get(vcloudLink, { headers: headers4, signal });
          vcloudText = vcloudRes.data;
        } catch (error) {
          if (((_b = error.response) == null ? void 0 : _b.status) === 403 && openWebView) {
            console.log(
              `hubcloudExtractor: WAF detected (403) for ${vcloudLink}, using solver...`
            );
            const vcloudBaseUrl = vcloudLink.split("/").slice(0, 3).join("/");
            const cleanHeaders2 = __spreadProps(__spreadValues({}, headers4), { Referer: vcloudBaseUrl });
            delete cleanHeaders2["User-Agent"];
            delete cleanHeaders2["sec-ch-ua"];
            delete cleanHeaders2["sec-ch-ua-mobile"];
            delete cleanHeaders2["sec-ch-ua-platform"];
            delete cleanHeaders2["Cookie"];
            const wafResult = yield openWebView(vcloudBaseUrl, {
              title: "Solve the captcha below and click done",
              description: "Required to bypass anti-bot protection.",
              headers: cleanHeaders2,
              waitForCookie: "cf_clearance",
              force: true
            });
            if (wafResult.userAgent) headers4["User-Agent"] = wafResult.userAgent;
            headers4["Cookie"] = (headers4["Cookie"] ? headers4["Cookie"] + "; " : "") + wafResult.cookies;
            const retryRes = yield axios.get(vcloudLink, { headers: headers4, signal });
            vcloudText = retryRes.data;
          } else {
            if (((_c = error.response) == null ? void 0 : _c.status) === 403 && !openWebView) {
              console.log(
                `hubcloudExtractor: 403 Forbidden for ${vcloudLink}, but openWebView solver is not available!`
              );
            }
            let fetchRes = yield fetch(vcloudLink, {
              headers: headers4,
              signal,
              redirect: "follow"
            });
            if (fetchRes.status === 403 && openWebView) {
              console.log(
                `hubcloudExtractor: WAF detected (403) for ${vcloudLink}, using solver...`
              );
              const vcloudBaseUrl = vcloudLink.split("/").slice(0, 3).join("/");
              const cleanHeaders3 = __spreadProps(__spreadValues({}, headers4), { Referer: vcloudBaseUrl });
              delete cleanHeaders3["User-Agent"];
              delete cleanHeaders3["sec-ch-ua"];
              delete cleanHeaders3["sec-ch-ua-mobile"];
              delete cleanHeaders3["sec-ch-ua-platform"];
              delete cleanHeaders3["Cookie"];
              const wafResult = yield openWebView(vcloudBaseUrl, {
                title: "Solve the captcha below and click done",
                description: "Required to bypass anti-bot protection.",
                headers: cleanHeaders3,
                waitForCookie: "cf_clearance",
                force: true
              });
              if (wafResult.userAgent) headers4["User-Agent"] = wafResult.userAgent;
              headers4["Cookie"] = (headers4["Cookie"] ? headers4["Cookie"] + "; " : "") + wafResult.cookies;
              fetchRes = yield fetch(vcloudLink, {
                headers: headers4,
                signal,
                redirect: "follow"
              });
            }
            if (!fetchRes.ok) {
              throw new Error(
                `HTTP ${fetchRes.status} ${fetchRes.statusText} | URL ${vcloudLink}`
              );
            }
            vcloudText = yield fetchRes.text();
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
              const token = (_d = link2.split("/").pop()) == null ? void 0 : _d.split("?")[0];
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
              const newLinkRes = yield fetch(link2, {
                method: "HEAD",
                headers: headers4,
                signal,
                redirect: "manual"
              });
              let newLink = link2;
              if (newLinkRes.status >= 300 && newLinkRes.status < 400) {
                newLink = newLinkRes.headers.get("location") || link2;
              } else if (newLinkRes.url && newLinkRes.url !== link2) {
                newLink = newLinkRes.url;
              } else {
                newLink = newLinkRes.headers.get("location") || link2;
              }
              if (newLink.includes("googleusercontent")) {
                newLink = newLink.split("?link=")[1];
              } else {
                const newLinkRes2 = yield fetch(newLink, {
                  method: "HEAD",
                  headers: headers4,
                  signal,
                  redirect: "manual"
                });
                if (newLinkRes2.status >= 300 && newLinkRes2.status < 400) {
                  newLink = ((_e = newLinkRes2.headers.get("location")) == null ? void 0 : _e.split("?link=")[1]) || newLink;
                } else if (newLinkRes2.url && newLinkRes2.url !== newLink) {
                  newLink = newLinkRes2.url.split("?link=")[1] || newLinkRes2.url;
                } else {
                  newLink = ((_f = newLinkRes2.headers.get("location")) == null ? void 0 : _f.split("?link=")[1]) || newLink;
                }
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
        preferredServer = ((specificKey ? yield (_g = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _g.get(specificKey) : void 0) || (yield (_h = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _h.get("preferredDownloadServer")) || "auto").toLowerCase().trim();
      } catch (e) {
      }
      const getPriority = (serverName = "") => {
        const s = serverName.toLowerCase();
        if (isDownload && preferredServer !== "auto" && preferredServer !== "" && s.includes(preferredServer)) {
          return 0;
        }
        if (isDownload) {
          if (s.includes("cf worker") || s.includes("fast cloud")) return 1;
          if (s.includes("cf storage") || s.includes("resumable")) return 2;
          if (s.includes("gdrive") || s.includes("instant")) return 3;
          if (s.includes("gofile")) return 4;
          if (s.includes("pixeldrain")) return 5;
          if (s.includes("fastdl")) return 6;
          if (s.includes("hubcdn")) return 7;
          return 10;
        } else {
          if (s.includes("cf worker") || s.includes("fast cloud")) return 1;
          if (s.includes("cf storage")) return 2;
          if (s.includes("gofile")) return 3;
          if (s.includes("pixeldrain")) return 4;
          if (s.includes("fastdl")) return 5;
          if (s.includes("hubcdn")) return 6;
          if (s.includes("gdrive")) return 7;
          return 10;
        }
      };
      streamLinks.sort((a, b) => getPriority(a.server) - getPriority(b.server));
      if (isDownload && streamLinks.length > 0) {
        const isTopHealthy = yield checkStreamHealth(
          streamLinks[0],
          signal
        );
        if (!isTopHealthy) {
          let healthyIndex = -1;
          for (let i = 1; i < streamLinks.length; i++) {
            const isHealthy = yield checkStreamHealth(
              streamLinks[i],
              signal
            );
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
      if (type === "movie" && !link.includes("cloud")) {
        const dotlinkRes = yield axios(`${link}`, { headers: headers3 });
        const dotlinkText = dotlinkRes.data;
        const vlink = dotlinkText.match(/<a\s+href="([^"]*cloud\.[^"]*)"/i) || [];
        console.log("vLink", vlink[1]);
        link = vlink[1];
        try {
          const $ = cheerio.load(dotlinkText);
          const filepressLink = $(
            '.btn.btn-sm.btn-outline[style="background:linear-gradient(135deg,rgb(252,185,0) 0%,rgb(0,0,0)); color: #fdf8f2;"]'
          ).parent().attr("href");
          const filepressID = filepressLink == null ? void 0 : filepressLink.split("/").pop();
          const filepressBaseUrl = filepressLink == null ? void 0 : filepressLink.split("/").slice(0, -2).join("/");
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
              }
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
                }
              }
            );
            streamLinks.push({
              server: "filepress",
              link: (_d = (_c = filepressStreamLink.data) == null ? void 0 : _c.data) == null ? void 0 : _d[0],
              type: "mkv"
            });
          }
        } catch (error) {
          console.log("filepress error: ");
        }
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
var headers3;
var init_stream = __esm({
  "providers/vega/stream.ts"() {
    "use strict";
    init_hubcloud();
    init_providerErrors();
    headers3 = {
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
      Cookie: "ext_name=ojplmecpdpgccookcobabopnaifgidhf; cf_clearance=6yZYfXQxBgjaD1eacR5zZCz7njssbxjtSZZCElTOGk0-1764836255-1.2.1.1-bzHvDcDRLp6AAYo7qvGVzJ6Gk6zaqAepuGiGhAWCGYL.ZDpw5yI4TkUIXDgAnEhGCZ9J5X2_OagzgeMHZrd8rzeyAFQXj0dmYMErcfII7_Rhq5kZ4kAtS0tl9PtaNKKd2m4taIufySXCCstl3iNLMODTjbsW_KZi8U8DauOdGSAhBd1DCGxvLlAOM.snfkhb0yQiVJcLW8Bv9IeKQac0ar_TKkV6QexqNZYiyRXnE7E; xla=s4t",
      "Upgrade-Insecure-Requests": "1",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0"
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
        const { axios, cheerio, commonHeaders: headers4 } = providerContext;
        console.log("getEpisodeLinks", url);
        try {
          const context = readCinemetaContext(url);
          const res = yield axios.get(context.requestUrl, {
            headers: __spreadProps(__spreadValues({}, headers4), {
              cookie: "ext_name=ojplmecpdpgccookcobabopnaifgidhf; cf_clearance=6yZYfXQxBgjaD1eacR5zZCz7njssbxjtSZZCElTOGk0-1764836255-1.2.1.1-bzHvDcDRLp6AAYo7qvGVzJ6Gk6zaqAepuGiGhAWCGYL.ZDpw5yI4TkUIXDgAnEhGCZ9J5X2_OagzgeMHZrd8rzeyAFQXj0dmYMErcfII7_Rhq5kZ4kAtS0tl9PtaNKKd2m4taIufySXCCstl3iNLMODTjbsW_KZi8U8DauOdGSAhBd1DCGxvLlAOM.snfkhb0yQiVJcLW8Bv9IeKQac0ar_TKkV6QexqNZYiyRXnE7E; xla=s4t",
              "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0"
            })
          });
          const $ = cheerio.load(res.data);
          const container = $(".entry-content,.entry-inner");
          $(".unili-content,.code-block-1").remove();
          const episodes = [];
          container.find("h4").each((index, element) => {
            const el = $(element);
            const title = el.text().replace(/\s+/g, " ").trim().replace(/^[-:\s]+|[-:\s]+$/g, "").replace(/^episodes?\s*:\s*/i, "Episode ");
            const link = el.next("p").find(
              '.btn-outline[style="background:linear-gradient(135deg,#ed0b0b,#f2d152); color: white;"]'
            ).parent().attr("href");
            if (title && link) {
              episodes.push({ title, link });
            }
          });
          const quickDownload = yield (_a = providerContext.kvStore) == null ? void 0 : _a.get("vega_quickDownload");
          const skipTimings = yield (_b = providerContext.kvStore) == null ? void 0 : _b.get("vega_skipTimings");
          if (!context.imdbId || !context.season) {
            return episodes.map((e) => __spreadProps(__spreadValues({}, e), {
              quickDownload: quickDownload != null ? quickDownload : true
            }));
          }
          const cinemeta = yield getCinemetaMeta(
            context.imdbId,
            "series",
            providerContext
          );
          let enriched = enrichCinemetaEpisodes(episodes, cinemeta.videos || [], context.season);
          if (skipTimings != null ? skipTimings : true) {
            enriched = yield enrichEpisodesWithSkipTimings(
              enriched,
              context.imdbId,
              context.season,
              providerContext
            );
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
