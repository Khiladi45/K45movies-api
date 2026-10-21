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

// providers/animesub/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/animesub/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Top Airing",
        filter: "mal:topanime:airing"
      },
      {
        title: "Current Season",
        filter: "mal:season:current"
      },
      {
        title: "Most Popular",
        filter: "mal:topanime:bypopularity"
      },
      {
        title: "Most Favorited",
        filter: "mal:topanime:favorite"
      }
    ];
    genres = [
      {
        title: "Action",
        filter: "mal:genre:1:Action"
      },
      {
        title: "Adventure",
        filter: "mal:genre:2:Adventure"
      },
      {
        title: "Comedy",
        filter: "mal:genre:4:Comedy"
      },
      {
        title: "Drama",
        filter: "mal:genre:8:Drama"
      },
      {
        title: "Fantasy",
        filter: "mal:genre:10:Fantasy"
      },
      {
        title: "Horror",
        filter: "mal:genre:14:Horror"
      },
      {
        title: "Mystery",
        filter: "mal:genre:7:Mystery"
      },
      {
        title: "Psychological",
        filter: "mal:genre:40:Psychological"
      },
      {
        title: "Romance",
        filter: "mal:genre:22:Romance"
      },
      {
        title: "Sci-Fi",
        filter: "mal:genre:24:Sci-Fi"
      },
      {
        title: "Slice of Life",
        filter: "mal:genre:36:Slice_of_Life"
      },
      {
        title: "Supernatural",
        filter: "mal:genre:37:Supernatural"
      },
      {
        title: "Sports",
        filter: "mal:genre:30:Sports"
      },
      {
        title: "Suspense",
        filter: "mal:genre:41:Suspense"
      }
    ];
  }
});

// providers/animesub/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function cleanMalImage(src) {
  if (!src) return "";
  return src.replace(/\/r\/\d+x\d+/, "");
}
function parseMalTopAnime(html, cheerio) {
  const $ = cheerio.load(html);
  const posts = [];
  $("tr.ranking-list").each((_, el) => {
    var _a;
    const titleEl = $(el).find(".anime_ranking_h3 a, h3 a").first();
    const title = titleEl.text().trim();
    const malUrl = titleEl.attr("href") || "";
    const malId = (_a = malUrl.match(/anime\/(\d+)/)) == null ? void 0 : _a[1];
    if (!title || !malId) return;
    const imgEl = $(el).find("td.title img, .hoverinfo_trigger img").first();
    const rawImg = imgEl.attr("data-src") || imgEl.attr("src") || "";
    const image = cleanMalImage(rawImg);
    const score = $(el).find(".score span").text().trim();
    const tag = score && score !== "N/A" ? `${score}\u2605` : void 0;
    posts.push({
      title,
      link: JSON.stringify({ malId, title, image, type: "series" }),
      image,
      tag
    });
  });
  return posts;
}
function parseMalSeasonal(html, cheerio, page) {
  const $ = cheerio.load(html);
  const allSeasonal = [];
  $(".seasonal-anime").each((_, el) => {
    var _a;
    const titleEl = $(el).find(".title a.link-title, .title-text .link-title").first();
    const title = titleEl.text().trim();
    const malUrl = titleEl.attr("href") || "";
    const malId = (_a = malUrl.match(/anime\/(\d+)/)) == null ? void 0 : _a[1];
    if (!title || !malId) return;
    const imgEl = $(el).find(".image img").first();
    const rawImg = imgEl.attr("data-src") || imgEl.attr("src") || "";
    const image = cleanMalImage(rawImg);
    const score = $(el).find(".score").text().trim();
    const tag = score && score !== "N/A" ? `${score}\u2605` : void 0;
    allSeasonal.push({
      title,
      link: JSON.stringify({ malId, title, image, type: "series" }),
      image,
      tag
    });
  });
  const pageSize = 25;
  const startIndex = (page - 1) * pageSize;
  return allSeasonal.slice(startIndex, startIndex + pageSize);
}
function parseMalGenre(html, cheerio) {
  const $ = cheerio.load(html);
  const posts = [];
  $(".seasonal-anime").each((_, el) => {
    var _a;
    const titleEl = $(el).find(".title a.link-title, .title-text .link-title").first();
    const title = titleEl.text().trim();
    const malUrl = titleEl.attr("href") || "";
    const malId = (_a = malUrl.match(/anime\/(\d+)/)) == null ? void 0 : _a[1];
    if (!title || !malId) return;
    const imgEl = $(el).find(".image img").first();
    const rawImg = imgEl.attr("data-src") || imgEl.attr("src") || "";
    const image = cleanMalImage(rawImg);
    const score = $(el).find(".score").text().trim();
    const tag = score && score !== "N/A" ? `${score}\u2605` : void 0;
    posts.push({
      title,
      link: JSON.stringify({ malId, title, image, type: "series" }),
      image,
      tag
    });
  });
  return posts;
}
function fetchKitsuFallbackPosts(filter, page, signal, providerContext) {
  return __async(this, null, function* () {
    var _a;
    try {
      const skipParam = page > 1 ? `&skip=${(page - 1) * 20}` : "";
      const filterWithSkip = filter.replace(".json", `${skipParam}.json`);
      const baseUrl = filter.startsWith("http") ? "" : "https://anime-kitsu.strem.fun";
      const url = baseUrl + filterWithSkip;
      const res = yield providerContext.axios.get(url, {
        headers: providerContext.commonHeaders,
        signal,
        timeout: 1e4
      });
      const data = res.data;
      const catalog2 = [];
      (_a = data == null ? void 0 : data.metas) == null ? void 0 : _a.forEach((result) => {
        const title = result == null ? void 0 : result.name;
        const id = result == null ? void 0 : result.id;
        const image = result == null ? void 0 : result.poster;
        const rating = (result == null ? void 0 : result.kitsuRating) || (result == null ? void 0 : result.rating);
        const tag = rating ? `${rating}\u2605` : void 0;
        if (id) {
          catalog2.push({
            title,
            link: `https://anime-kitsu.strem.fun/meta/anime/${id}.json`,
            image,
            tag
          });
        }
      });
      return catalog2;
    } catch (e) {
      return [];
    }
  });
}
var MAL_HEADERS, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/animesub/posts.ts"() {
    "use strict";
    MAL_HEADERS = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    };
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        try {
          if (filter.startsWith("mal:topanime:")) {
            const type = filter.replace("mal:topanime:", "").trim();
            const offset = (page - 1) * 50;
            const url = `https://myanimelist.net/topanime.php?type=${type}&limit=${offset}`;
            const res = yield providerContext.axios.get(url, {
              headers: MAL_HEADERS,
              signal,
              timeout: 1e4
            });
            return parseMalTopAnime(res.data, providerContext.cheerio);
          }
          if (filter === "mal:season:current") {
            const url = "https://myanimelist.net/anime/season";
            const res = yield providerContext.axios.get(url, {
              headers: MAL_HEADERS,
              signal,
              timeout: 1e4
            });
            return parseMalSeasonal(res.data, providerContext.cheerio, page);
          }
          if (filter.startsWith("mal:genre:")) {
            const parts = filter.split(":");
            const genreId = parts[2];
            const genreName = parts[3] || "Action";
            const url = `https://myanimelist.net/anime/genre/${genreId}/${genreName}?page=${page}`;
            const res = yield providerContext.axios.get(url, {
              headers: MAL_HEADERS,
              signal,
              timeout: 1e4
            });
            return parseMalGenre(res.data, providerContext.cheerio);
          }
          return yield fetchKitsuFallbackPosts(filter, page, signal, providerContext);
        } catch (err) {
          console.warn("AnimeSub getPosts error, trying Kitsu fallback:", err);
          return yield fetchKitsuFallbackPosts(filter, page, signal, providerContext);
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
          const encoded = encodeURIComponent(searchQuery);
          const searchUrl = `https://myanimelist.net/anime.php?q=${encoded}`;
          const res = yield providerContext.axios.get(searchUrl, {
            headers: MAL_HEADERS,
            signal,
            timeout: 1e4
          });
          const $ = providerContext.cheerio.load(res.data);
          const posts = [];
          $("table").eq(1).find("tr").each((i, el) => {
            var _a2;
            if (i === 0) return;
            const titleEl = $(el).find("a.hoverinfo_trigger strong, strong").first();
            const a = $(el).find("a.hoverinfo_trigger").first();
            const title = titleEl.text().trim() || a.text().trim();
            const href = a.attr("href") || "";
            const malId = (_a2 = href.match(/anime\/(\d+)/)) == null ? void 0 : _a2[1];
            if (!title || !malId) return;
            const imgEl = $(el).find("img").first();
            const rawImg = imgEl.attr("data-src") || imgEl.attr("src") || "";
            const image = cleanMalImage(rawImg);
            const score = $(el).find("td:nth-child(5)").text().trim();
            const tag = score && score !== "N/A" ? `${score}\u2605` : void 0;
            if (!posts.some((p) => p.title.toLowerCase() === title.toLowerCase())) {
              posts.push({
                title,
                link: JSON.stringify({ malId, title, image, type: "series" }),
                image,
                tag
              });
            }
          });
          if (posts.length > 0) {
            return posts;
          }
        } catch (err) {
          console.warn("AnimeSub MAL search error, falling back to Kitsu search:", err);
        }
        try {
          const encoded = encodeURIComponent(searchQuery);
          const url = `https://anime-kitsu.strem.fun/catalog/anime/kitsu-anime-list/search=${encoded}.json`;
          const res = yield providerContext.axios.get(url, {
            headers: providerContext.commonHeaders,
            signal,
            timeout: 1e4
          });
          const catalog2 = [];
          (_b = (_a = res.data) == null ? void 0 : _a.metas) == null ? void 0 : _b.forEach((result) => {
            const title = (result == null ? void 0 : result.name) || "";
            const id = result == null ? void 0 : result.id;
            const image = result == null ? void 0 : result.poster;
            const rating = (result == null ? void 0 : result.kitsuRating) || (result == null ? void 0 : result.rating);
            const tag = rating ? `${rating}\u2605` : void 0;
            if (id && !catalog2.some((item) => item.link.includes(id))) {
              catalog2.push({
                title,
                link: `https://anime-kitsu.strem.fun/meta/anime/${id}.json`,
                image,
                tag
              });
            }
          });
          return catalog2;
        } catch (e) {
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

// providers/aniskip.ts
function getAniSkipCache() {
  const state = typeof providerGlobal !== "undefined" && providerGlobal ? providerGlobal : globalThis;
  if (!state.__vegaAniSkipCache__ || typeof state.__vegaAniSkipCache__ !== "object") {
    state.__vegaAniSkipCache__ = /* @__PURE__ */ Object.create(null);
  }
  return state.__vegaAniSkipCache__;
}
function resolveMalIdFromKitsu(kitsuId, providerContext, timeout = 5e3) {
  return __async(this, null, function* () {
    var _a, _b;
    const cleanKitsuId = kitsuId.replace(/^kitsu:/i, "").split(":")[0].trim();
    if (!cleanKitsuId || !/^\d+$/.test(cleanKitsuId)) return null;
    const cache = getAniSkipCache();
    const cacheKey = `kitsu_mal_${cleanKitsuId}`;
    if (cache[cacheKey] !== void 0) {
      return cache[cacheKey];
    }
    try {
      const url = `https://kitsu.io/api/edge/anime/${cleanKitsuId}/mappings`;
      const res = yield providerContext.axios.get(url, {
        headers: {
          Accept: "application/vnd.api+json"
        },
        timeout
      });
      const mappings = Array.isArray((_a = res.data) == null ? void 0 : _a.data) ? res.data.data : [];
      const malMapping = mappings.find(
        (m) => {
          var _a2;
          return ((_a2 = m.attributes) == null ? void 0 : _a2.externalSite) === "myanimelist/anime";
        }
      );
      const malId = ((_b = malMapping == null ? void 0 : malMapping.attributes) == null ? void 0 : _b.externalId) ? String(malMapping.attributes.externalId) : null;
      cache[cacheKey] = malId;
      return malId;
    } catch (e) {
      cache[cacheKey] = null;
      return null;
    }
  });
}
function resolveKitsuIdFromMal(malId, providerContext, timeout = 5e3) {
  return __async(this, null, function* () {
    var _a, _b;
    const cleanMalId = String(malId).trim();
    if (!cleanMalId || !/^\d+$/.test(cleanMalId)) return null;
    const cache = getAniSkipCache();
    const cacheKey = `mal_kitsu_${cleanMalId}`;
    if (cache[cacheKey] !== void 0) {
      return cache[cacheKey];
    }
    try {
      const url = `https://kitsu.io/api/edge/mappings?filter[external_site]=myanimelist/anime&filter[external_id]=${cleanMalId}&include=item`;
      const res = yield providerContext.axios.get(url, {
        headers: {
          Accept: "application/vnd.api+json"
        },
        timeout
      });
      const kitsuItem = (_b = (_a = res.data) == null ? void 0 : _a.included) == null ? void 0 : _b[0];
      const kitsuId = (kitsuItem == null ? void 0 : kitsuItem.id) ? String(kitsuItem.id) : null;
      cache[cacheKey] = kitsuId;
      return kitsuId;
    } catch (e) {
      cache[cacheKey] = null;
      return null;
    }
  });
}
function resolveMalIdFromTitle(title, providerContext, timeout = 5e3) {
  return __async(this, null, function* () {
    var _a, _b;
    const cleanTitle = title.trim();
    if (!cleanTitle) return null;
    const cache = getAniSkipCache();
    const cacheKey = `title_mal_${cleanTitle.toLowerCase()}`;
    if (cache[cacheKey] !== void 0) {
      return cache[cacheKey];
    }
    try {
      const url = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(
        cleanTitle
      )}&page[limit]=1&include=mappings`;
      const res = yield providerContext.axios.get(url, {
        headers: {
          Accept: "application/vnd.api+json"
        },
        timeout
      });
      const included = Array.isArray((_a = res.data) == null ? void 0 : _a.included) ? res.data.included : [];
      const malMapping = included.find(
        (m) => {
          var _a2;
          return ((_a2 = m.attributes) == null ? void 0 : _a2.externalSite) === "myanimelist/anime";
        }
      );
      const malId = ((_b = malMapping == null ? void 0 : malMapping.attributes) == null ? void 0 : _b.externalId) ? String(malMapping.attributes.externalId) : null;
      cache[cacheKey] = malId;
      return malId;
    } catch (e) {
      cache[cacheKey] = null;
      return null;
    }
  });
}
function fetchAniSkipTimings(malId, episode, providerContext, signal, timeout = 4e3) {
  return __async(this, null, function* () {
    const numMalId = String(malId).trim();
    if (!numMalId || !episode || episode < 1) return [];
    const cache = getAniSkipCache();
    const cacheKey = `aniskip_${numMalId}_${episode}`;
    const cached = cache[cacheKey];
    if (cached) {
      if (typeof cached.then === "function") {
        return cached;
      }
      return cached;
    }
    const fetchPromise = (() => __async(null, null, function* () {
      try {
        const url = `https://api.aniskip.com/v2/skip-times/${numMalId}/${episode}?types=op&types=ed&types=recap&types=mixed-op&types=mixed-ed&episodeLength=0`;
        const res = yield providerContext.axios.get(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
          },
          timeout,
          signal
        });
        const data = res.data;
        if (!data || !data.found || !Array.isArray(data.results)) {
          cache[cacheKey] = [];
          return [];
        }
        const results = data.results;
        const intervals = [];
        const priorityMap = {
          recap: 1,
          op: 2,
          "mixed-op": 3,
          ed: 4,
          "mixed-ed": 5
        };
        const sortedResults = [...results].sort(
          (a, b) => (priorityMap[a.skipType] || 99) - (priorityMap[b.skipType] || 99)
        );
        const seenTypes = /* @__PURE__ */ new Set();
        for (const item of sortedResults) {
          const interval = item == null ? void 0 : item.interval;
          if (!interval) continue;
          const start = typeof interval.startTime === "number" ? interval.startTime : 0;
          const end = typeof interval.endTime === "number" ? interval.endTime : 0;
          if (end <= start) continue;
          let title = "Intro";
          let category = "op";
          if (item.skipType === "ed" || item.skipType === "mixed-ed") {
            title = "Credits";
            category = "ed";
          } else if (item.skipType === "recap") {
            title = "Recap";
            category = "recap";
          }
          if (seenTypes.has(category)) {
            continue;
          }
          seenTypes.add(category);
          intervals.push({
            title,
            from: Number(start.toFixed(2)),
            to: Number(end.toFixed(2))
          });
        }
        intervals.sort((a, b) => a.from - b.from);
        cache[cacheKey] = intervals;
        return intervals;
      } catch (e) {
        delete cache[cacheKey];
        return [];
      }
    }))();
    cache[cacheKey] = fetchPromise;
    return fetchPromise;
  });
}
function fetchAnimeSkipTimings(_0) {
  return __async(this, arguments, function* ({
    kitsuId,
    title,
    malId,
    episode,
    season,
    providerContext,
    signal,
    timeout
  }) {
    if (!episode || episode < 1) return [];
    let resolvedMalId = malId;
    if (!resolvedMalId && kitsuId) {
      resolvedMalId = (yield resolveMalIdFromKitsu(kitsuId, providerContext)) || void 0;
    }
    if (!resolvedMalId && !kitsuId && title && (!season || season <= 1)) {
      resolvedMalId = (yield resolveMalIdFromTitle(title, providerContext)) || void 0;
    }
    if (resolvedMalId) {
      const timings = yield fetchAniSkipTimings(
        resolvedMalId,
        episode,
        providerContext,
        signal,
        timeout
      );
      if (timings.length > 0) {
        return timings;
      }
    }
    return [];
  });
}
function enrichAnimeEpisodesWithSkipTimings(episodes, options) {
  return __async(this, null, function* () {
    const { kitsuId, title, imdbId, season, providerContext, signal } = options;
    let malId = options.malId || null;
    if (!malId && kitsuId) {
      malId = yield resolveMalIdFromKitsu(kitsuId, providerContext);
    }
    if (!malId && !kitsuId && title && (!season || season <= 1)) {
      malId = yield resolveMalIdFromTitle(title, providerContext);
    }
    const promises = episodes.map((ep) => __async(null, null, function* () {
      var _a, _b;
      let epNum;
      let animeEpNum;
      let epSeason = season;
      let epMalId = malId;
      try {
        const parsed = JSON.parse(ep.link);
        epNum = Number(parsed.episode);
        animeEpNum = Number(parsed.animeEpisode || ((_b = (_a = parsed.kitsuId) == null ? void 0 : _a.match(/^kitsu:\d+:(\d+)$/)) == null ? void 0 : _b[1]) || parsed.episode);
        epSeason = Number(parsed.season) || season;
        epMalId = parsed.malId || malId;
      } catch (e) {
        epNum = season ? getEpisodeNumber(ep.title, season) : void 0;
      }
      if (!epNum || epNum < 1) {
        return ep;
      }
      let skipTimings = [];
      if (epMalId) {
        skipTimings = yield fetchAniSkipTimings(epMalId, animeEpNum || epNum, providerContext, signal);
      }
      if ((!skipTimings || skipTimings.length === 0) && imdbId && epSeason) {
        skipTimings = yield fetchTheIntroDbSkipTimings({
          imdbId,
          season: epSeason,
          episode: epNum,
          providerContext,
          signal
        });
      }
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
var init_aniskip = __esm({
  "providers/aniskip.ts"() {
    "use strict";
    init_getCinemetaMeta();
    init_theintrodb();
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

// providers/animesub/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function createCinemetaPayload(imdbId, type, meta, video) {
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
function getCinemetaInfo(link, providerContext) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e;
    const imdbId = ((_a = link.match(/tt\d+/)) == null ? void 0 : _a[0]) || "";
    const type = /\bseries\b/i.test(link) ? "series" : "movie";
    if (!imdbId) throw new Error(`Missing IMDb ID in link: ${link}`);
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
        const episode = (_b = video.episode) != null ? _b : video.number;
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
          link: createCinemetaPayload(imdbId, "series", meta, video)
        });
        seasons.set(video.season, episodes);
      }
      const skipTimings = (_e = yield (_c = providerContext.kvStore) == null ? void 0 : _c.get("animesub_skipTimings")) != null ? _e : yield (_d = providerContext.kvStore) == null ? void 0 : _d.get("torrentio_skipTimings");
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
            link: createCinemetaPayload(imdbId, "movie", meta)
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
  });
}
function getKitsuInfo(kitsuId, providerContext, malId) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const url = `https://anime-kitsu.strem.fun/meta/anime/${kitsuId}.json`;
    const res = yield providerContext.axios.get(url, {
      headers: providerContext.commonHeaders,
      timeout: 1e4
    });
    const meta = (_a = res.data) == null ? void 0 : _a.meta;
    if (!meta) {
      throw new Error(`Failed to load Kitsu meta for ${kitsuId}`);
    }
    const isMovie = meta.type === "movie" || meta.animeType === "movie" || (!meta.videos || meta.videos.length <= 1 && meta.runtime && !((_b = meta.videos[0]) == null ? void 0 : _b.episode));
    const linkList = [];
    const skipTimings = (_e = yield (_c = providerContext.kvStore) == null ? void 0 : _c.get("animesub_skipTimings")) != null ? _e : yield (_d = providerContext.kvStore) == null ? void 0 : _d.get("torrentio_skipTimings");
    if (isMovie) {
      const video = (_f = meta.videos) == null ? void 0 : _f[0];
      const imdbId = (video == null ? void 0 : video.imdb_id) || meta.imdb_id || "";
      linkList.push({
        title: meta.name || "Movie",
        directLinks: [
          {
            title: "Movie",
            type: "movie",
            link: JSON.stringify({
              title: meta.name,
              kitsuId: (video == null ? void 0 : video.id) || meta.id,
              imdbId,
              type: "movie"
            })
          }
        ]
      });
    } else {
      const seasons = /* @__PURE__ */ new Map();
      const now = Date.now();
      for (const video of meta.videos || []) {
        const animeEpisode = (_h = (_g = video.episode) != null ? _g : video.number) != null ? _h : 1;
        const season = Number(video.imdbSeason) > 0 ? Number(video.imdbSeason) : video.season || 1;
        const episode = Number(video.imdbEpisode) > 0 ? Number(video.imdbEpisode) : animeEpisode;
        const releaseStr = video.released;
        if (releaseStr) {
          const releaseTime = new Date(releaseStr).getTime();
          if (!isNaN(releaseTime) && releaseTime > now) {
            continue;
          }
        }
        const epTitle = video.title ? formatEpisodeTitle(episode, video.title) : `Episode ${episode}`;
        const imdbId = video.imdb_id || meta.imdb_id || "";
        const episodes = seasons.get(season) || [];
        episodes.push({
          title: epTitle,
          link: JSON.stringify({
            title: meta.name,
            kitsuId: video.id || `${meta.id}:${animeEpisode}`,
            malId,
            animeEpisode: String(animeEpisode),
            imdbId,
            season: String(season),
            episode: String(episode),
            type: "series"
          }),
          description: video.overview,
          image: video.thumbnail
        });
        seasons.set(season, episodes);
      }
      for (const season of [...seasons.keys()].sort((a, b) => a - b)) {
        let directLinks = seasons.get(season) || [];
        if (directLinks.length === 0) continue;
        const firstWithImdb = directLinks.find((d) => {
          try {
            return Boolean(JSON.parse(d.link).imdbId);
          } catch (e) {
            return false;
          }
        });
        const seasonImdb = firstWithImdb ? JSON.parse(firstWithImdb.link).imdbId : meta.imdb_id;
        if (skipTimings != null ? skipTimings : true) {
          directLinks = yield enrichAnimeEpisodesWithSkipTimings(
            directLinks,
            {
              kitsuId,
              malId,
              title: meta.name,
              imdbId: seasonImdb,
              season,
              providerContext
            }
          );
        }
        linkList.push({
          title: `Season ${season}`,
          directLinks
        });
      }
    }
    return {
      title: meta.name || "",
      synopsis: meta.description || "",
      image: meta.background || meta.poster || "",
      poster: meta.poster || "",
      logo: meta.logo || void 0,
      imdbId: meta.imdb_id || "",
      type: isMovie ? "movie" : "series",
      tags: meta.genres,
      rating: meta.imdbRating || meta.kitsuRating,
      linkList
    };
  });
}
function getMalInfo(malId, title, providerContext) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f;
    let kitsuId = yield resolveKitsuIdFromMal(malId, providerContext);
    if (!kitsuId && title) {
      try {
        const searchRes = yield providerContext.axios.get(
          `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(title)}&page[limit]=1`,
          { headers: { Accept: "application/vnd.api+json" }, timeout: 6e3 }
        );
        kitsuId = ((_c = (_b = (_a = searchRes.data) == null ? void 0 : _a.data) == null ? void 0 : _b[0]) == null ? void 0 : _c.id) || null;
      } catch (e) {
      }
    }
    if (kitsuId) {
      return yield getKitsuInfo(`kitsu:${kitsuId}`, providerContext, malId);
    }
    if (title) {
      try {
        const cinemetaSearch = `https://v3-cinemeta.strem.io/catalog/series/top/search=${encodeURIComponent(title)}.json`;
        const cRes = yield providerContext.axios.get(cinemetaSearch, { timeout: 6e3 });
        const imdbId = (_f = (_e = (_d = cRes.data) == null ? void 0 : _d.metas) == null ? void 0 : _e[0]) == null ? void 0 : _f.imdb_id;
        if (imdbId) {
          return yield getCinemetaInfo(imdbId, providerContext);
        }
      } catch (e) {
      }
    }
    throw new Error(`Failed to resolve metadata for MAL ID ${malId}`);
  });
}
var getMeta;
var init_meta = __esm({
  "providers/animesub/meta.ts"() {
    "use strict";
    init_getCinemetaMeta();
    init_theintrodb();
    init_aniskip();
    init_providerErrors();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        try {
          let malId;
          let title;
          try {
            const parsed = JSON.parse(link);
            if (parsed.malId) malId = String(parsed.malId);
            if (parsed.title) title = parsed.title;
          } catch (e) {
            const malMatch = link.match(/mal:(\d+)/) || link.match(/myanimelist\.net\/anime\/(\d+)/);
            if (malMatch) malId = malMatch[1];
          }
          if (malId) {
            return yield getMalInfo(malId, title, providerContext);
          }
          const kitsuMatch = link.match(/kitsu:(\d+)/);
          if (kitsuMatch) {
            return yield getKitsuInfo(kitsuMatch[0], providerContext);
          }
          return yield getCinemetaInfo(link, providerContext);
        } catch (err) {
          throwProviderError("AnimeSub", "metadata", err);
        }
      });
    };
  }
});

// providers/animesub/stream.ts
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
  return matches.length > 0 ? [...new Set(matches)].join(", ") : "JA/EN";
}
function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return "";
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}
function extractQuality(text) {
  const lower = text.toLowerCase();
  if (lower.includes("2160") || lower.includes("4k")) return "2160";
  if (lower.includes("1080")) return "1080";
  if (lower.includes("720")) return "720";
  if (lower.includes("480")) return "480";
  if (lower.includes("360")) return "360";
  return void 0;
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
function extractSeeders(text, s) {
  var _a;
  if (typeof (s == null ? void 0 : s.seeders) === "number" && s.seeders >= 0) {
    return { label: `\u{1F464}${s.seeders}`, count: s.seeders };
  }
  if (typeof ((_a = s == null ? void 0 : s.behaviorHints) == null ? void 0 : _a.seeders) === "number" && s.behaviorHints.seeders >= 0) {
    return { label: `\u{1F464}${s.behaviorHints.seeders}`, count: s.behaviorHints.seeders };
  }
  const seedersMatch = text.match(/👤\s*(\d+)/) || text.match(/\bS:\s*(\d+)/i) || text.match(/(\d+)\s*(?:seeds?|seeders?)/i);
  if (seedersMatch) {
    const count = parseInt(seedersMatch[1], 10);
    return { label: `\u{1F464}${count}`, count };
  }
  return { label: "", count: 0 };
}
function extractSizeBytes(text, s) {
  var _a, _b;
  const rawBytes = ((_a = s == null ? void 0 : s.behaviorHints) == null ? void 0 : _a.videoSize) || ((_b = s == null ? void 0 : s.behaviorHints) == null ? void 0 : _b.fileSize) || (s == null ? void 0 : s.size);
  if (typeof rawBytes === "number" && rawBytes > 0) {
    return { label: formatBytes(rawBytes), bytes: rawBytes };
  }
  const match = text.match(/(?:💾\s*)?([\d.]+)\s*(KB|MB|GB|TB)\b/i);
  if (match) {
    const val = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    const multiplier = unit === "TB" ? 1024 * 1024 * 1024 * 1024 : unit === "GB" ? 1024 * 1024 * 1024 : unit === "MB" ? 1024 * 1024 : 1024;
    return { label: `${match[1]} ${unit}`, bytes: val * multiplier };
  }
  return { label: "", bytes: 0 };
}
function fileSizeBytes(s) {
  var _a, _b;
  const value = (_b = (_a = s == null ? void 0 : s.behaviorHints) == null ? void 0 : _a.fileSize) != null ? _b : s == null ? void 0 : s.fileSize;
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}
function torrentHash(s) {
  var _a, _b;
  return String(s.infoHash || ((_b = (_a = s.url) == null ? void 0 : _a.match(/urn:btih:([a-f0-9]{40})/i)) == null ? void 0 : _b[1]) || "").toLowerCase();
}
function filename(s) {
  var _a, _b;
  return ((_b = String(((_a = s.behaviorHints) == null ? void 0 : _a.filename) || "").split(/[\\/]/).pop()) == null ? void 0 : _b.trim().toLowerCase()) || "";
}
function getEpisodeFileSizes(streams, imdbId, season, episode, providerContext) {
  return __async(this, null, function* () {
    var _a;
    const sizes = /* @__PURE__ */ new Map();
    for (const stream of streams) {
      const bytes = fileSizeBytes(stream);
      if (bytes) sizes.set(stream, { label: formatBytes(bytes), bytes });
    }
    if (!/^tt\d+$/.test(imdbId) || !/^\d+$/.test(season) || !/^\d+$/.test(episode)) return sizes;
    if (!streams.some((s) => torrentHash(s) && !sizes.has(s))) return sizes;
    try {
      const response = yield providerContext.axios.get(
        `https://torrentio.strem.fun/stream/series/${imdbId}:${season}:${episode}.json`,
        { headers: providerContext.commonHeaders, timeout: 5e3 }
      );
      const candidates = Array.isArray((_a = response.data) == null ? void 0 : _a.streams) ? response.data.streams : [];
      for (const stream of streams) {
        if (sizes.has(stream)) continue;
        const hash = torrentHash(stream);
        if (!hash) continue;
        const matches = candidates.filter((candidate) => {
          if (torrentHash(candidate) !== hash) return false;
          const index = stream.fileIdx, candidateIndex = candidate.fileIdx;
          if (Number.isInteger(index) && index >= 0 && Number.isInteger(candidateIndex) && candidateIndex >= 0) {
            return index === candidateIndex;
          }
          const name = filename(stream);
          return /\.(mkv|mp4|avi|webm|m4v|ts)$/i.test(name) && name === filename(candidate);
        });
        if (!matches.length) continue;
        const selected = matches[0];
        const size = extractSizeBytes(`${selected.description || ""} ${selected.title || ""}`, selected);
        if (size.bytes > 0) sizes.set(stream, size);
      }
    } catch (e) {
    }
    return sizes;
  });
}
function parseCustomManifest(manifestUrl) {
  const clean = manifestUrl.trim().replace(/^stremio:\/\//i, "https://");
  const match = clean.match(/^(https?:\/\/[^\/]+)\/(u_[a-zA-Z0-9_-]+)/);
  if (match) {
    return { baseUrl: match[1], token: match[2] };
  }
  return null;
}
function registerDebridConfig(instanceUrl, service, apiKey, enableP2P, providerContext) {
  return __async(this, null, function* () {
    try {
      const configUrl = `${instanceUrl}/configure`;
      const getRes = yield providerContext.axios.get(configUrl, {
        timeout: 8e3
      });
      const html = getRes.data;
      const $ = providerContext.cheerio.load(html);
      const form = $("#configForm");
      const params = new URLSearchParams();
      form.find("input, select, textarea").each((_, el) => {
        const name = $(el).attr("name");
        const type = $(el).attr("type");
        const val = $(el).val() || "";
        if (!name) return;
        if (type === "checkbox") {
          if ($(el).prop("checked")) {
            params.append(name, val || "on");
          }
        } else if (type === "radio") {
          if ($(el).prop("checked")) {
            params.append(name, val);
          }
        } else {
          params.append(name, val);
        }
      });
      if (enableP2P) {
        params.set("enableP2P", "on");
        params.delete("hideUncached");
      } else {
        params.delete("enableP2P");
        params.set("hideUncached", "on");
      }
      if (service && service !== "none") {
        params.set("service[]", service);
        params.set("apiKey[]", apiKey);
      }
      for (const src of ALL_TORRENT_SOURCES) {
        if (!params.getAll("torrentSources[]").includes(src)) {
          params.append("torrentSources[]", src);
        }
      }
      const postRes = yield providerContext.axios.post(configUrl, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: configUrl
        },
        timeout: 8e3
      });
      const postHtml = typeof postRes.data === "string" ? postRes.data : JSON.stringify(postRes.data);
      const tokenMatch = postHtml.match(/\/(u_[a-zA-Z0-9_-]+)(?:\/manifest\.json|\/stream)/);
      if (tokenMatch) {
        return tokenMatch[1];
      }
    } catch (err) {
      console.warn("AnimeSub configure registration error:", err);
    }
    return null;
  });
}
function resolveTokenAndBaseUrl(providerContext) {
  return __async(this, null, function* () {
    var _a;
    const kv = providerContext.kvStore;
    let customManifestUrl = "";
    let instanceUrl = DEFAULT_INSTANCE_URL;
    let debridService = "none";
    let debridApiKey = "";
    let enableP2P = true;
    if (kv) {
      customManifestUrl = (yield kv.get("animesub_manifestUrl")) || (yield kv.get("customManifestUrl")) || "";
      const inst = (yield kv.get("animesub_instanceUrl")) || (yield kv.get("customInstanceUrl"));
      if (inst == null ? void 0 : inst.trim()) instanceUrl = inst.trim().replace(/\/+$/, "");
      debridService = (yield kv.get("animesub_debridService")) || (yield kv.get("debridService")) || "none";
      debridApiKey = ((yield kv.get("animesub_debridApiKey")) || (yield kv.get("debridApiKey")) || "").trim();
      const p2pVal = (_a = yield kv.get("animesub_enableP2P")) != null ? _a : yield kv.get("enableP2P");
      if (p2pVal !== void 0) enableP2P = p2pVal;
    }
    if (customManifestUrl) {
      const parsed = parseCustomManifest(customManifestUrl);
      if (parsed) return parsed;
    }
    if (debridService !== "none" && debridApiKey) {
      const cacheKey = `animesub_token_${debridService}_${debridApiKey.slice(0, 10)}_${enableP2P}`;
      let cachedToken = yield kv == null ? void 0 : kv.get(cacheKey);
      if (!cachedToken) {
        cachedToken = (yield registerDebridConfig(
          instanceUrl,
          debridService,
          debridApiKey,
          enableP2P,
          providerContext
        )) || void 0;
        if (cachedToken && kv) {
          yield kv.set(cacheKey, cachedToken);
        }
      }
      if (cachedToken) {
        return { baseUrl: instanceUrl, token: cachedToken };
      }
    }
    return { baseUrl: instanceUrl, token: DEFAULT_TOKEN };
  });
}
function fetchKitsuFallbackStreams(title, season, episode, baseUrl, token, providerContext) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d;
    try {
      const searchTerm = season && Number(season) > 1 ? `${title} Season ${season}` : title;
      const kitsuUrl = `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(searchTerm)}&page[limit]=1`;
      const res = yield providerContext.axios.get(kitsuUrl, { timeout: 5e3 });
      const kitsuId = (_c = (_b = (_a = res.data) == null ? void 0 : _a.data) == null ? void 0 : _b[0]) == null ? void 0 : _c.id;
      if (!kitsuId) return [];
      const epSuffix = episode ? `:${episode}` : "";
      const streamUrl = `${baseUrl}/${token}/stream/anime/kitsu:${kitsuId}${epSuffix}.json`;
      const streamRes = yield providerContext.axios.get(streamUrl, { timeout: 1e4 });
      return Array.isArray((_d = streamRes.data) == null ? void 0 : _d.streams) ? streamRes.data.streams : [];
    } catch (e) {
      return [];
    }
  });
}
function isUploaderCandidate(val) {
  if (!val || val.length <= 2) return false;
  if (NON_UPLOADER_REGEX.test(val)) return false;
  if (SPEC_WORDS_REGEX.test(val)) return false;
  return true;
}
function extractUploader(s) {
  var _a;
  const rawSources = [
    (_a = s.behaviorHints) == null ? void 0 : _a.filename,
    s.description,
    s.title,
    s.name
  ].filter(Boolean);
  const lines = [];
  for (const raw of rawSources) {
    for (const l of String(raw).split(/\r?\n/)) {
      const trimmed = l.trim();
      if (trimmed) lines.push(trimmed);
    }
  }
  for (const line of lines) {
    const m = line.match(/^\[([a-zA-Z0-9_.\s@-]+)\]/);
    if (m) {
      const val = m[1].replace(/^@/, "").trim();
      if (isUploaderCandidate(val)) return val;
    }
  }
  for (const line of lines) {
    const gearMatch = line.match(/⚙️\s*([^\n\r]+)/);
    if (gearMatch) {
      const val = gearMatch[1].replace(/^@/, "").trim();
      if (isUploaderCandidate(val)) return val;
    }
  }
  for (const line of lines) {
    const cleanTrailing = line.replace(/(\s*\[[^\]]*\]|\s*\([^)]*\))+$/g, "").replace(/\.(mkv|mp4|avi|webm|ts)$/i, "").trim();
    const hyphenMatch = cleanTrailing.match(/[-_–]\s*@?([a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)?)$/);
    if (hyphenMatch) {
      const val = hyphenMatch[1].trim();
      if (isUploaderCandidate(val)) return val;
    }
  }
  for (const line of lines) {
    const allBrackets = [...line.matchAll(/\[([a-zA-Z0-9_.\s@-]+)\]/g)].map(
      (m) => m[1].replace(/^@/, "").trim()
    );
    for (const b of allBrackets) {
      if (isUploaderCandidate(b)) return b;
    }
  }
  return "AnimeSub+";
}
function parseStreamItem(s, streamSkip, episodeSize) {
  var _a;
  const combinedText = `${s.name || ""} ${s.description || ""} ${s.title || ""}`;
  const quality = extractQuality(combinedText);
  let link = s.url;
  if (!link && s.infoHash) {
    const trackers = (s.sources || []).filter((src) => src.startsWith("tracker:")).map((src) => `tr=${encodeURIComponent(src.replace("tracker:", ""))}`);
    const trackerQuery = trackers.length > 0 ? `&${trackers.join("&")}` : "";
    link = `magnet:?xt=urn:btih:${s.infoHash}${trackerQuery}`;
  }
  if (!link) return null;
  const { label: seedersLabel, count: seederCount } = extractSeeders(combinedText, s);
  const { label: sizeLabel, bytes: sizeBytes } = episodeSize != null ? episodeSize : extractSizeBytes(combinedText, s);
  const formatTags = extractFormatTags(combinedText);
  const language = getLanguageCodes(combinedText);
  const debridBadge = (_a = (s.name || "").match(
    /\[(RD\+?|AD\+?|PM\+?|TB\+?|DL\+?|EN\+?|RD download|AD download)\]/i
  )) == null ? void 0 : _a[0];
  const isCachedDebrid = Boolean(debridBadge && !debridBadge.toLowerCase().includes("download")) || Boolean(link && !link.startsWith("magnet:"));
  const uploader = extractUploader(s);
  const server = debridBadge ? `${debridBadge} ${uploader}` : uploader;
  const tags = [];
  if (quality) {
    tags.push(`${quality}p`);
  }
  if (seedersLabel && !isCachedDebrid) {
    tags.push(seedersLabel);
  }
  if (debridBadge) {
    tags.push(debridBadge.replace(/[\[\]]/g, ""));
  }
  for (const tag2 of formatTags) {
    tags.push(tag2);
  }
  if (language && language !== "ENG" && language !== "JA/EN") {
    tags.push(language);
  }
  if (sizeLabel) {
    tags.push(sizeLabel);
  }
  const tag = tags.join(" \u2022 ") || void 0;
  let subtitles = void 0;
  if (Array.isArray(s.subtitles) && s.subtitles.length > 0) {
    subtitles = s.subtitles.map((sub) => {
      var _a2;
      return {
        title: sub.lang || sub.id || "Subtitle",
        language: sub.lang || "en",
        type: ((_a2 = sub.url) == null ? void 0 : _a2.endsWith(".vtt")) ? "text/vtt" : "application/x-subrip",
        uri: sub.url
      };
    });
  }
  return {
    stream: {
      server,
      link,
      type: link.startsWith("magnet:") ? "torrent" : "mp4",
      quality,
      tags: tags.length > 0 ? tags : void 0,
      tag,
      subtitles,
      skip: streamSkip
    },
    seederCount,
    sizeBytes
  };
}
function isQualityAllowed(q, qualityFilter) {
  if (!q || qualityFilter === "all" || !qualityFilter) return true;
  if (qualityFilter === "720") return q === "720" || q === "480" || q === "360";
  if (qualityFilter === "1080") return q === "1080" || q === "720" || q === "480" || q === "360";
  if (qualityFilter === "480") return q === "480" || q === "360";
  return true;
}
function sortParsedItems(items, sortBy) {
  items.sort((a, b) => {
    if (sortBy === "seeders") {
      return b.seederCount - a.seederCount;
    }
    if (sortBy === "size") {
      return b.sizeBytes - a.sizeBytes;
    }
    const qRankA = QUALITY_RANKS[a.stream.quality || ""] || 0;
    const qRankB = QUALITY_RANKS[b.stream.quality || ""] || 0;
    if (qRankA !== qRankB) {
      return qRankB - qRankA;
    }
    return b.seederCount - a.seederCount;
  });
  return items.map((item) => item.stream);
}
var DEFAULT_TOKEN, DEFAULT_INSTANCE_URL, ALL_TORRENT_SOURCES, languageCodes, NON_UPLOADER_REGEX, SPEC_WORDS_REGEX, QUALITY_RANKS, getStream;
var init_stream = __esm({
  "providers/animesub/stream.ts"() {
    "use strict";
    init_providerErrors();
    init_theintrodb();
    init_aniskip();
    DEFAULT_TOKEN = "u_mFxNX2Pva_iYMF-kz9CsNA";
    DEFAULT_INSTANCE_URL = "https://animesub.duckdns.org";
    ALL_TORRENT_SOURCES = [
      "nyaa",
      "animetosho",
      "tokyoTosho",
      "eraiRaws",
      "seadex",
      "nekobt",
      "animegarden",
      "tsukihimeDirect",
      "mikan",
      "dmhy",
      "subsplease",
      "anibt",
      "acgrip",
      "knaben",
      "piratebay",
      "torrentgalaxy",
      "torlock",
      "zilean",
      "comet",
      "stremthruTorz"
    ];
    languageCodes = [
      ["MULTI", "MULTI"],
      ["DUAL", "DUAL"],
      ["JAPANESE", "JP"],
      ["ENGLISH", "EN"],
      ["HINDI", "HI"],
      ["TAMIL", "TA"],
      ["TELUGU", "TE"],
      ["SPANISH", "ES"],
      ["FRENCH", "FR"],
      ["GERMAN", "DE"],
      ["ITALIAN", "IT"],
      ["KOREAN", "KO"],
      ["CHINESE", "ZH"],
      ["PORTUGUESE", "PT"],
      ["RUSSIAN", "RU"]
    ];
    NON_UPLOADER_REGEX = /^(\d+|[a-zA-Z]{1,2}|\d{3,4}p?|4k|uhd|bluray|bd|dvd|web(-?dl|-?rip)?|h\.?26[45]|x26[45]|hevc|av1|opus|flac|aac|ac3|dts|mp3|multi(-?audio|-?sub)?|dual(-?audio)?|sub(s|bed)?|dub(bed)?|audio|remux|hdr(10\+?)?|dv|dolby|hi10p?|10bit|8bit|v\d+|repack\d*|proper|raws?|es|lat|ger|ita|fra|eng?|jap?|batch|[0-9a-f]{8}|unofficial\s*batch)$/i;
    SPEC_WORDS_REGEX = /\b(1080p?|720p?|480p?|360p?|2160p?|4k|bd|bluray|hevc|x26[45]|h\.?26[45]|av1|aac|ac3|dts|mp3|flac|opus|dual-audio|multi-audio|sub|dub|web(-?dl|-?rip)?|remux|10-?bit|hi10p?)\b/i;
    QUALITY_RANKS = {
      "2160": 5,
      "1080": 4,
      "720": 3,
      "480": 2,
      "360": 1
    };
    getStream = (_0) => __async(null, [_0], function* ({
      link: id,
      type,
      providerContext
    }) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
      try {
        const payload = (() => {
          try {
            return JSON.parse(id);
          } catch (e) {
            return {
              imdbId: id.startsWith("tt") ? id : void 0,
              kitsuId: id.startsWith("kitsu:") ? id : void 0,
              malId: id.startsWith("mal:") ? id.replace("mal:", "") : void 0
            };
          }
        })();
        let kitsuId = (_a = payload.kitsuId) != null ? _a : typeof id === "string" && id.startsWith("kitsu:") ? id : "";
        let imdbId = (_b = payload.imdbId) != null ? _b : typeof id === "string" && id.startsWith("tt") ? id : "";
        const malId = (_c = payload.malId) != null ? _c : typeof id === "string" && id.startsWith("mal:") ? id.replace("mal:", "") : "";
        const title = (_d = payload.title) != null ? _d : "";
        const season = (_e = payload.season) != null ? _e : "";
        const episode = (_f = payload.episode) != null ? _f : "";
        const animeEpisode = (_i = (_h = payload.animeEpisode) != null ? _h : (_g = kitsuId.match(/^kitsu:\d+:(\d+)$/)) == null ? void 0 : _g[1]) != null ? _i : episode;
        const effectiveType = (_k = (_j = payload.type) != null ? _j : type) != null ? _k : "series";
        if (!kitsuId && malId) {
          kitsuId = (yield resolveKitsuIdFromMal(malId, providerContext)) || "";
        }
        if (!imdbId && !kitsuId && !title) {
          console.warn("AnimeSub: missing imdbId, kitsuId, and title in link payload");
          return [];
        }
        const kv = providerContext.kvStore;
        const skipTimings = (_l = yield kv == null ? void 0 : kv.get("animesub_skipTimings")) != null ? _l : yield kv == null ? void 0 : kv.get("torrentio_skipTimings");
        const skipTimingsEnabled = skipTimings != null ? skipTimings : true;
        let streamSkip = void 0;
        if (skipTimingsEnabled && effectiveType === "series" && episode) {
          const epNum = Number(episode);
          if (epNum > 0) {
            streamSkip = yield fetchAnimeSkipTimings({
              kitsuId,
              malId: malId || void 0,
              title,
              episode: Number(animeEpisode),
              season: Number(season),
              providerContext
            });
            if ((!streamSkip || streamSkip.length === 0) && imdbId && season) {
              streamSkip = yield fetchTheIntroDbSkipTimings({
                imdbId,
                season: Number(season),
                episode: epNum,
                providerContext
              });
            }
          }
          if (!(streamSkip == null ? void 0 : streamSkip.length)) streamSkip = void 0;
        }
        const { baseUrl, token } = yield resolveTokenAndBaseUrl(providerContext);
        const qualityFilter = (yield kv == null ? void 0 : kv.get("animesub_qualityFilter")) || (yield kv == null ? void 0 : kv.get("qualityFilter")) || "all";
        const sortBy = (yield kv == null ? void 0 : kv.get("animesub_sortBy")) || (yield kv == null ? void 0 : kv.get("sortBy")) || "qualitythenseeders";
        let rawStreams = [];
        if (kitsuId) {
          let targetKitsu = kitsuId;
          if (effectiveType === "series" && /^(?:kitsu:)?\d+$/.test(kitsuId) && animeEpisode) {
            targetKitsu = `${kitsuId}:${animeEpisode}`;
          }
          const streamType = effectiveType === "movie" ? "movie" : "anime";
          const kitsuUrl = `${baseUrl}/${token}/stream/${streamType}/${targetKitsu}.json`;
          console.log("AnimeSub Kitsu URL:", kitsuUrl);
          try {
            const res = yield providerContext.axios.get(kitsuUrl, { timeout: 12e3 });
            if (Array.isArray((_m = res.data) == null ? void 0 : _m.streams)) {
              rawStreams = res.data.streams;
            }
          } catch (e) {
            rawStreams = [];
          }
        }
        if (rawStreams.length === 0 && imdbId && imdbId.startsWith("tt")) {
          let streamTarget = imdbId;
          if (effectiveType === "series" && season && episode) {
            streamTarget = `${imdbId}:${season}:${episode}`;
          }
          const streamType = effectiveType === "series" ? "series" : "movie";
          const imdbUrl = `${baseUrl}/${token}/stream/${streamType}/${streamTarget}.json`;
          console.log("AnimeSub IMDb URL:", imdbUrl);
          try {
            const res = yield providerContext.axios.get(imdbUrl, { timeout: 12e3 });
            if (Array.isArray((_n = res.data) == null ? void 0 : _n.streams)) {
              rawStreams = res.data.streams;
            }
          } catch (e) {
            rawStreams = [];
          }
        }
        if (rawStreams.length === 0 && title) {
          rawStreams = yield fetchKitsuFallbackStreams(
            title,
            season,
            episode,
            baseUrl,
            token,
            providerContext
          );
        }
        const episodeSizes = effectiveType === "series" ? yield getEpisodeFileSizes(rawStreams, imdbId, season, episode, providerContext) : void 0;
        const parsedItems = [];
        for (const s of rawStreams) {
          const parsed = parseStreamItem(s, streamSkip, episodeSizes ? episodeSizes.get(s) || { label: "", bytes: 0 } : void 0);
          if (parsed && isQualityAllowed(parsed.stream.quality, qualityFilter)) {
            parsedItems.push(parsed);
          }
        }
        return sortParsedItems(parsedItems, sortBy);
      } catch (err) {
        throwProviderError("AnimeSub", "stream", err);
      }
    });
  }
});

// providers/animesub/animesub.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
