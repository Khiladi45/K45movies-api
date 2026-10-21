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

// providers/movieBoxWeb/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/movieBoxWeb/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Trending", filter: "/" },
      { title: "Movies", filter: "/newWeb/movie" },
      { title: "TV Series", filter: "/newWeb/tv-series" }
    ];
    genres = [];
  }
});

// providers/movieBoxWeb/utils.ts
function getProviderBaseUrl() {
  return __async(this, null, function* () {
    return defaultBaseUrl;
  });
}
function parseNuxtDetail(html, cheerio) {
  return findDetail(parseNuxtData(html, cheerio));
}
function parseNuxtData(html, cheerio) {
  const $ = cheerio.load(html);
  const serialized = $("#__NUXT_DATA__").text();
  if (!serialized) return null;
  return decodeNuxtData(JSON.parse(serialized));
}
function decodeNuxtData(values) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error("Invalid Nuxt data");
  }
  const entries = values;
  const hydrated = new Array(entries.length);
  function hydrate(index) {
    if (index === -1 || index === -2) return void 0;
    if (index === -3) return NaN;
    if (index === -4) return Infinity;
    if (index === -5) return -Infinity;
    if (index === -6) return -0;
    if (typeof index !== "number" || index < 0 || index >= entries.length) {
      throw new Error("Invalid Nuxt data index");
    }
    if (Object.prototype.hasOwnProperty.call(hydrated, index)) {
      return hydrated[index];
    }
    const value = entries[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = value;
      return value;
    }
    if (Array.isArray(value)) {
      const type = value[0];
      if (type === "Reactive" || type === "ShallowReactive" || type === "Ref" || type === "ShallowRef") {
        const result3 = hydrate(value[1]);
        hydrated[index] = result3;
        return result3;
      }
      if (type === "Set") {
        const result3 = /* @__PURE__ */ new Set();
        hydrated[index] = result3;
        for (let item = 1; item < value.length; item++) {
          result3.add(hydrate(value[item]));
        }
        return result3;
      }
      if (typeof type === "string") {
        throw new Error(`Unsupported Nuxt data type: ${type}`);
      }
      const result2 = [];
      hydrated[index] = result2;
      for (const item of value) {
        result2.push(item === -2 ? void 0 : hydrate(item));
      }
      return result2;
    }
    const result = {};
    hydrated[index] = result;
    for (const [key, item] of Object.entries(value)) {
      if (key === "__proto__") throw new Error("Invalid Nuxt data key");
      result[key] = hydrate(item);
    }
    return result;
  }
  return hydrate(0);
}
function findDetail(value) {
  if (!value || typeof value !== "object") return null;
  if ("subject" in value && "resource" in value && typeof value.subject === "object" && typeof value.resource === "object") {
    return value;
  }
  for (const child of Object.values(value)) {
    const result = findDetail(child);
    if (result) return result;
  }
  return null;
}
function encodeLink(value) {
  return JSON.stringify(value);
}
function decodeLink(value) {
  if (value && typeof value === "object") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    const dp = detailPath(String(value || ""));
    return {
      subjectId: "",
      detailPath: dp,
      language: "Original",
      season: 1,
      episode: 1
    };
  }
}
function detailPath(link) {
  return link.replace(/^https?:\/\/[^/]+/, "").replace(/^\/moviesDetail\//, "");
}
function absoluteUrl(baseUrl, path) {
  return new URL(path, `${baseUrl}/`).toString();
}
var defaultBaseUrl;
var init_utils = __esm({
  "providers/movieBoxWeb/utils.ts"() {
    "use strict";
    defaultBaseUrl = "https://officialmoviebox.com";
  }
});

// providers/movieBoxWeb/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function collectSubjectPreviews(value) {
  const subjects = /* @__PURE__ */ new Map();
  const visited = /* @__PURE__ */ new Set();
  function visit(current) {
    if (!current || typeof current !== "object" || visited.has(current)) return;
    visited.add(current);
    if ("detailPath" in current && typeof current.detailPath === "string") {
      const cover = "cover" in current ? current.cover : void 0;
      subjects.set(current.detailPath, {
        title: "title" in current && typeof current.title === "string" ? current.title : void 0,
        coverUrl: cover && typeof cover === "object" && "url" in cover && typeof cover.url === "string" ? cover.url : void 0,
        hasResource: "hasResource" in current && typeof current.hasResource === "boolean" ? current.hasResource : void 0
      });
    }
    Object.values(current).forEach(visit);
  }
  visit(value);
  return subjects;
}
function fetchPosts(path, signal, providerContext) {
  return __async(this, null, function* () {
    const baseUrl = yield getProviderBaseUrl();
    const response = yield fetch(absoluteUrl(baseUrl, path), { signal });
    if (!response.ok) throw new Error(`MovieBox Web returned ${response.status}`);
    const html = yield response.text();
    const $ = providerContext.cheerio.load(html);
    const subjects = collectSubjectPreviews(
      parseNuxtData(html, providerContext.cheerio)
    );
    const posts = [];
    const seen = /* @__PURE__ */ new Set();
    $('a[href^="/moviesDetail/"]').each((_, element) => {
      var _a, _b, _c, _d;
      const card = $(element);
      const href = card.attr("href") || "";
      if (!href.startsWith("/moviesDetail/") || seen.has(href)) return;
      const subject = subjects.get(href.replace("/moviesDetail/", ""));
      if (path === "/upcoming" && (subject == null ? void 0 : subject.hasResource) !== true) return;
      const image = card.find("img").first();
      const title = ((_a = subject == null ? void 0 : subject.title) == null ? void 0 : _a.trim()) || ((_b = card.find("h2, h3").first().attr("title")) == null ? void 0 : _b.trim()) || ((_c = image.attr("alt")) == null ? void 0 : _c.trim()) || card.find("h2, h3").first().text().trim() || ((_d = card.attr("title")) == null ? void 0 : _d.replace(/^go to /i, "").replace(/ detail page$/i, "").trim()) || "";
      if (!title) return;
      seen.add(href);
      posts.push({
        title,
        link: href,
        image: image.attr("data-src") || (subject == null ? void 0 : subject.coverUrl) || image.attr("src") || ""
      });
    });
    return posts;
  });
}
function mapSubjects(subjects) {
  return subjects.filter(
    (subject) => Boolean(subject.detailPath && subject.title) && subject.hasResource !== false
  ).map((subject) => ({
    title: subject.title || "",
    link: `/moviesDetail/${subject.detailPath}`,
    image: subject.coverUrl || ""
  }));
}
function fetchCatalogPage(filter, page, signal) {
  return __async(this, null, function* () {
    var _a;
    const baseUrl = yield getProviderBaseUrl();
    const params = new URLSearchParams({
      page: String(Math.max(1, page)),
      perPage: String(pageSize)
    });
    if (filter === "/newWeb/movie") {
      params.set("tabId", "ONEROOM_MOVIE");
    }
    const response = yield fetch(
      absoluteUrl(
        baseUrl,
        `/wefeed-h5api-bff/subject/trending?${params.toString()}`
      ),
      { headers: requestHeaders, signal }
    );
    if (!response.ok) throw new Error(`MovieBox Web returned ${response.status}`);
    const payload = yield response.json();
    if (payload.code !== 0) {
      throw new Error(payload.message || "MovieBox Web catalog request failed");
    }
    return mapSubjects(
      (((_a = payload.data) == null ? void 0 : _a.subjectList) || []).map((subject) => {
        var _a2;
        return {
          detailPath: subject.detailPath,
          title: subject.title,
          coverUrl: (_a2 = subject.cover) == null ? void 0 : _a2.url,
          hasResource: subject.hasResource
        };
      })
    );
  });
}
var pageSize, requestHeaders, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/movieBoxWeb/posts.ts"() {
    "use strict";
    init_utils();
    pageSize = 18;
    requestHeaders = {
      Accept: "application/json",
      "x-client-info": JSON.stringify({ timezone: "Asia/Colombo" }),
      "x-source": ""
    };
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const path = filter || "/";
        if (["/", "/newWeb/movie", "/newWeb/tv-series"].includes(path)) {
          return fetchCatalogPage(path, page, signal);
        }
        if (page > 1) return [];
        return fetchPosts(path, signal, providerContext);
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        if (page > 1 || !searchQuery.trim()) return [];
        return fetchPosts(
          `/newWeb/searchResult?keyword=${encodeURIComponent(searchQuery.trim())}`,
          signal,
          providerContext
        );
      });
    };
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

// providers/movieBoxWeb/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function buildPlaybackLink(subject, dub, seasons) {
  var _a, _b, _c, _d;
  const isSeries = subject.subjectType === 2;
  const movieSeason = (seasons == null ? void 0 : seasons.find((season) => season.se === 0)) || (seasons == null ? void 0 : seasons[0]);
  const firstSeriesSeason = (seasons == null ? void 0 : seasons.find((season) => (season.se || 0) > 0)) || (seasons == null ? void 0 : seasons[0]);
  const movieResolution = (_b = (_a = movieSeason == null ? void 0 : movieSeason.resolutions) == null ? void 0 : _a.filter((item) => (item.epNum || 0) >= 1).sort((a, b) => (b.resolution || 0) - (a.resolution || 0))[0]) == null ? void 0 : _b.resolution;
  const targetSubjectId = dub.subjectId || subject.subjectId || "";
  const targetDetailPath = dub.detailPath || subject.detailPath || "";
  const alternateDub = ((_c = subject.dubs) == null ? void 0 : _c.find(
    (d) => {
      var _a2;
      return d.subjectId && d.subjectId !== targetSubjectId && (d.original || ((_a2 = d.lanName) == null ? void 0 : _a2.toLowerCase().includes("original")) || d.lanCode === "en");
    }
  )) || ((_d = subject.dubs) == null ? void 0 : _d.find((d) => d.subjectId && d.subjectId !== targetSubjectId));
  const fallbackSubjectId = subject.subjectId && subject.subjectId !== targetSubjectId ? subject.subjectId : alternateDub == null ? void 0 : alternateDub.subjectId;
  const fallbackDetailPath = subject.detailPath && subject.detailPath !== targetDetailPath ? subject.detailPath : alternateDub == null ? void 0 : alternateDub.detailPath;
  return encodeLink({
    subjectId: targetSubjectId,
    detailPath: targetDetailPath,
    fallbackSubjectId,
    fallbackDetailPath,
    language: dub.lanName || dub.lanCode || "Original",
    season: isSeries ? (firstSeriesSeason == null ? void 0 : firstSeriesSeason.se) || 1 : (movieSeason == null ? void 0 : movieSeason.se) || 0,
    episode: 1,
    resolution: isSeries ? void 0 : movieResolution,
    seasons
  });
}
var getMeta;
var init_meta = __esm({
  "providers/movieBoxWeb/meta.ts"() {
    "use strict";
    init_providerErrors();
    init_utils();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b, _c, _d;
        try {
          const baseUrl = yield getProviderBaseUrl();
          const pageUrl = absoluteUrl(baseUrl, `/moviesDetail/${detailPath(link)}`);
          const response = yield fetch(pageUrl);
          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status} ${response.statusText} | URL ${pageUrl}`
            );
          }
          const detail = parseNuxtDetail(
            yield response.text(),
            providerContext.cheerio
          );
          if (!detail) throw new Error("MovieBox Web detail data was not found");
          const { subject, resource } = detail;
          const isSeries = subject.subjectType === 2;
          const dubs = ((_a = subject.dubs) == null ? void 0 : _a.length) ? subject.dubs : [
            {
              subjectId: subject.subjectId,
              detailPath: subject.detailPath,
              lanName: "Original"
            }
          ];
          const linkList = (subject.hasResource === false ? [] : dubs).filter((dub) => dub.subjectId && (dub.detailPath || subject.detailPath)).map((dub) => {
            const playbackLink = buildPlaybackLink(subject, dub, resource.seasons);
            if (isSeries) {
              return {
                title: dub.lanName || dub.lanCode || "Original",
                episodesLink: playbackLink
              };
            }
            return {
              title: dub.lanName || dub.lanCode || "Original",
              directLinks: [
                {
                  title: dub.lanName || dub.lanCode || "Original",
                  link: playbackLink,
                  type: "movie"
                }
              ]
            };
          });
          const tags = [
            subject.countryName,
            (_b = subject.releaseDate) == null ? void 0 : _b.slice(0, 4),
            ...(subject.genre || "").split(",").map((tag) => tag.trim())
          ].filter((tag) => Boolean(tag));
          return {
            title: subject.title || "",
            image: ((_c = subject.cover) == null ? void 0 : _c.url) || "",
            synopsis: subject.description || "",
            imdbId: "",
            type: isSeries ? "series" : "movie",
            tags,
            cast: (_d = subject.stars) == null ? void 0 : _d.map((star) => star.name || "").filter(Boolean),
            rating: subject.imdbRatingValue || "",
            linkList,
            webUrl: pageUrl
          };
        } catch (error) {
          throwProviderError("MovieBox Web", "metadata", error);
        }
      });
    };
  }
});

// providers/movieBoxWeb/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function getQuality(resolutions) {
  const values = (resolutions || "").split(",").map(Number).filter((value) => [360, 480, 720, 1080, 2160].includes(value));
  const quality = Math.max(...values);
  return Number.isFinite(quality) ? String(quality) : void 0;
}
function getStreamType(format, url) {
  const normalized = format == null ? void 0 : format.toUpperCase();
  if (normalized === "HLS" || normalized === "M3U8") return "m3u8";
  if (normalized === "DASH" || normalized === "MPD") return "mpd";
  if (url) {
    const cleanUrl = url.split("?")[0].toLowerCase();
    if (cleanUrl.endsWith(".m3u8")) return "m3u8";
    if (cleanUrl.endsWith(".mpd")) return "mpd";
  }
  return "mp4";
}
function mapCaptions(captions) {
  return captions.filter((caption) => Boolean(caption.url)).map((caption) => {
    var _a;
    return {
      title: caption.lanName || caption.lan || "Subtitle",
      language: caption.lan || "und",
      type: ((_a = caption.url) == null ? void 0 : _a.includes(".vtt")) ? "text/vtt" : "application/x-subrip",
      uri: caption.url || ""
    };
  });
}
function getCaptions(_0, _1, _2, _3) {
  return __async(this, arguments, function* (baseUrl, playback, stream, referer, userAgent = defaultUserAgent, providerContext, signal) {
    var _a, _b, _c;
    try {
      if (!stream.id || !stream.format) return [];
      const params = new URLSearchParams({
        format: stream.format,
        id: stream.id,
        subjectId: playback.subjectId,
        detailPath: playback.detailPath
      });
      const url = absoluteUrl(
        baseUrl,
        `/wefeed-h5api-bff/subject/caption?${params}`
      );
      const headers = __spreadProps(__spreadValues({}, requestHeaders2), { "User-Agent": userAgent, Referer: referer });
      if (providerContext == null ? void 0 : providerContext.axios) {
        const res = yield providerContext.axios.get(url, {
          headers,
          signal,
          timeout: 1e4,
          validateStatus: () => true
        });
        if (res.status >= 200 && res.status < 300) {
          return mapCaptions(((_b = (_a = res.data) == null ? void 0 : _a.data) == null ? void 0 : _b.captions) || []);
        }
        return [];
      }
      const response = yield fetch(url, { headers, signal });
      if (!response.ok) return [];
      const data = yield response.json();
      return mapCaptions(((_c = data == null ? void 0 : data.data) == null ? void 0 : _c.captions) || []);
    } catch (e) {
      return [];
    }
  });
}
function hasPlayableStreams(result) {
  var _a, _b, _c, _d;
  if (!result || result.noContent || result.code !== 0 || ((_a = result.data) == null ? void 0 : _a.hasResource) === false) {
    return false;
  }
  const sources = [
    ...((_b = result.data) == null ? void 0 : _b.streams) || [],
    ...((_c = result.data) == null ? void 0 : _c.hls) || [],
    ...((_d = result.data) == null ? void 0 : _d.dash) || []
  ];
  return sources.some((s) => Boolean((s == null ? void 0 : s.url) && !(s == null ? void 0 : s.vipLocked)));
}
function checkPlaybackLimit(result) {
  var _a;
  if (((_a = result == null ? void 0 : result.data) == null ? void 0 : _a.limited) && !hasPlayableStreams(result)) {
    throw new MovieBoxPlaybackLimitError(
      "MovieBox is limiting playback for this session. Please try again later."
    );
  }
}
function fetchPlayData(apiBase, params, refererUrl, ua, providerContext, signal) {
  return __async(this, null, function* () {
    var _a, _b;
    const playUrl = absoluteUrl(
      apiBase,
      `/wefeed-h5api-bff/subject/play?${params.toString()}`
    );
    const headers = __spreadProps(__spreadValues({}, requestHeaders2), {
      "User-Agent": ua,
      Referer: refererUrl
    });
    try {
      if (providerContext == null ? void 0 : providerContext.axios) {
        const res = yield providerContext.axios.get(playUrl, {
          headers,
          signal,
          timeout: 15e3,
          validateStatus: () => true
        });
        if (res.status === 429) {
          throw new MovieBoxPlaybackLimitError("MovieBox is temporarily rate limiting playback. Please try again later.");
        }
        if (res.status === 406) return { noContent: true };
        if (res.status < 200 || res.status >= 300) {
          console.warn(`[movieBoxWeb] Play API HTTP ${res.status} for ${playUrl}`);
          return null;
        }
        const json2 = res.data;
        checkPlaybackLimit(json2);
        if ((json2 == null ? void 0 : json2.code) === 406 || ((_a = json2 == null ? void 0 : json2.message) == null ? void 0 : _a.includes("find no content"))) {
          return { noContent: true };
        }
        return json2;
      }
      const response = yield fetch(playUrl, {
        headers,
        signal
      });
      if (response.status === 429) {
        throw new MovieBoxPlaybackLimitError("MovieBox is temporarily rate limiting playback. Please try again later.");
      }
      if (response.status === 406) {
        return { noContent: true };
      }
      if (!response.ok) {
        console.warn(`[movieBoxWeb] Play API HTTP ${response.status} for ${playUrl}`);
        return null;
      }
      const json = yield response.json();
      checkPlaybackLimit(json);
      if ((json == null ? void 0 : json.code) === 406 || ((_b = json == null ? void 0 : json.message) == null ? void 0 : _b.includes("find no content"))) {
        return { noContent: true };
      }
      return json;
    } catch (err) {
      if (err instanceof MovieBoxPlaybackLimitError) throw err;
      console.warn(`[movieBoxWeb] Play API fetch error for ${playUrl}:`, (err == null ? void 0 : err.message) || err);
      return null;
    }
  });
}
var defaultUserAgent, requestHeaders2, MovieBoxPlaybackLimitError, getStream;
var init_stream = __esm({
  "providers/movieBoxWeb/stream.ts"() {
    "use strict";
    init_providerErrors();
    init_utils();
    defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    requestHeaders2 = {
      // This provider uses the public anonymous API, not a saved website session.
      // An explicit empty token overrides that cookie in the app's author jar.
      Cookie: "token=",
      Accept: "application/json",
      "User-Agent": defaultUserAgent,
      "x-client-info": JSON.stringify({ timezone: "Asia/Colombo" }),
      "x-source": ""
    };
    MovieBoxPlaybackLimitError = class extends Error {
    };
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        type,
        signal,
        providerContext,
        isDownload
      }) {
        var _a, _b, _c, _d, _e;
        try {
          const playback = decodeLink(link);
          const baseUrl = yield getProviderBaseUrl();
          const userAgent = ((_a = providerContext == null ? void 0 : providerContext.commonHeaders) == null ? void 0 : _a["User-Agent"]) || defaultUserAgent;
          const streamHeaders = {
            Referer: `${baseUrl}/`,
            Origin: baseUrl,
            "User-Agent": userAgent
          };
          if (!playback.subjectId && playback.detailPath) {
            try {
              const detailUrl = absoluteUrl(baseUrl, `/moviesDetail/${playback.detailPath}`);
              const res = yield fetch(detailUrl);
              if (res.ok) {
                const detail = parseNuxtDetail(yield res.text(), providerContext.cheerio);
                if ((_b = detail == null ? void 0 : detail.subject) == null ? void 0 : _b.subjectId) {
                  playback.subjectId = detail.subject.subjectId;
                  if (!playback.fallbackSubjectId) {
                    playback.fallbackSubjectId = detail.subject.subjectId;
                  }
                }
              }
            } catch (e) {
              console.warn("[movieBoxWeb] Failed to resolve missing subjectId:", (e == null ? void 0 : e.message) || e);
            }
          }
          const isSeries = Boolean(
            playback.season !== void 0 && playback.season > 0 || playback.seasons && playback.seasons.some((s) => (s.se || 0) > 0)
          );
          const seasonNumber = playback.season !== void 0 ? playback.season : ((_d = (_c = playback.seasons) == null ? void 0 : _c.find((s) => (s.se || 0) > 0)) == null ? void 0 : _d.se) || 1;
          const episodeNumber = playback.episode !== void 0 ? playback.episode : 1;
          const watchParams = new URLSearchParams({
            id: playback.subjectId,
            type: "/movie/detail",
            detailSe: isSeries && seasonNumber > 0 ? String(seasonNumber) : "",
            detailEp: isSeries && episodeNumber > 0 ? String(episodeNumber) : "",
            lang: "en"
          });
          const referer = absoluteUrl(
            baseUrl,
            `/movies/${playback.detailPath}?${watchParams}`
          );
          const playParams = new URLSearchParams({
            subjectId: playback.subjectId,
            detailPath: playback.detailPath
          });
          if (isSeries && seasonNumber > 0) {
            playParams.set("se", String(seasonNumber));
            playParams.set("ep", String(episodeNumber));
          }
          let playResult = yield fetchPlayData(
            baseUrl,
            playParams,
            referer,
            userAgent,
            providerContext,
            signal
          );
          if (!hasPlayableStreams(playResult) && (playback.fallbackSubjectId || playback.fallbackDetailPath)) {
            const fbSubjectId = playback.fallbackSubjectId || playback.subjectId;
            const fbDetailPath = playback.fallbackDetailPath || playback.detailPath;
            const fbParams = new URLSearchParams({
              subjectId: fbSubjectId,
              detailPath: fbDetailPath
            });
            if (isSeries && seasonNumber > 0) {
              fbParams.set("se", String(seasonNumber));
              fbParams.set("ep", String(episodeNumber));
            }
            const fbWatchParams = new URLSearchParams({
              id: fbSubjectId,
              type: "/movie/detail",
              detailSe: isSeries && seasonNumber > 0 ? String(seasonNumber) : "",
              detailEp: isSeries && episodeNumber > 0 ? String(episodeNumber) : "",
              lang: "en"
            });
            const fbReferer = absoluteUrl(
              baseUrl,
              `/movies/${fbDetailPath}?${fbWatchParams}`
            );
            const fbResult = yield fetchPlayData(
              baseUrl,
              fbParams,
              fbReferer,
              userAgent,
              providerContext,
              signal
            );
            if (hasPlayableStreams(fbResult)) {
              playResult = fbResult;
            }
          }
          if (!hasPlayableStreams(playResult)) {
            const cleanParams = new URLSearchParams({
              subjectId: playback.subjectId,
              detailPath: playback.detailPath
            });
            const cleanResult = yield fetchPlayData(
              baseUrl,
              cleanParams,
              referer,
              userAgent,
              providerContext,
              signal
            );
            if (hasPlayableStreams(cleanResult)) {
              playResult = cleanResult;
            }
          }
          if (!playResult || playResult.noContent || ((_e = playResult.data) == null ? void 0 : _e.hasResource) === false) {
            console.warn("[movieBoxWeb] No playable resource found for:", playback.detailPath);
            return [];
          }
          if (playResult.code !== 0) {
            throw new Error(
              playResult.message || `MovieBox Web play API code ${playResult.code}`
            );
          }
          const playData = playResult.data;
          if (!playData) return [];
          const sources = [
            ...playData.streams || [],
            ...playData.hls || [],
            ...playData.dash || []
          ];
          const availableSources = sources.filter(
            (source) => source.url && !source.vipLocked
          );
          console.log("MovieBox Web stream sources", availableSources);
          return Promise.all(
            availableSources.map((source) => __async(null, null, function* () {
              return {
                server: `${playback.language} ${source.resolutions || source.format || ""}`.trim(),
                link: source.url || "",
                type: getStreamType(source.format, source.url),
                quality: getQuality(source.resolutions),
                subtitles: yield getCaptions(
                  baseUrl,
                  playback,
                  source,
                  referer,
                  userAgent,
                  providerContext,
                  signal
                ),
                headers: streamHeaders
              };
            }))
          );
        } catch (error) {
          throwProviderError("MovieBox Web", "stream", error);
        }
      });
    };
  }
});

// providers/movieBoxWeb/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/movieBoxWeb/episodes.ts"() {
    "use strict";
    init_utils();
    init_providerErrors();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url
      }) {
        var _a, _b, _c, _d;
        try {
          const playback = decodeLink(url);
          const episodes = [];
          for (const season of playback.seasons || []) {
            const seasonNumber = season.se || 1;
            const maxEpFromRes = ((_a = season.resolutions) == null ? void 0 : _a.length) ? Math.max(0, ...season.resolutions.map((r) => r.epNum || 0)) : 0;
            const availableEpisodes = season.allEp ? season.allEp.split(",").map(Number).filter((episode) => episode > 0) : Array.from(
              {
                length: maxEpFromRes > 0 ? Math.min(season.maxEp || maxEpFromRes, maxEpFromRes) : season.maxEp || 0
              },
              (_, index) => index + 1
            );
            for (const episode of availableEpisodes) {
              const resolution = (_c = (_b = season.resolutions) == null ? void 0 : _b.filter((item) => (item.epNum || 0) >= episode).sort(
                (a, b) => (b.resolution || 0) - (a.resolution || 0)
              )[0]) == null ? void 0 : _c.resolution;
              if (((_d = season.resolutions) == null ? void 0 : _d.length) && !resolution) {
                continue;
              }
              episodes.push({
                title: `S${String(seasonNumber).padStart(2, "0")} E${String(episode).padStart(2, "0")}`,
                link: encodeLink(__spreadProps(__spreadValues({}, playback), {
                  seasons: void 0,
                  season: seasonNumber,
                  episode,
                  resolution
                }))
              });
            }
          }
          return episodes;
        } catch (error) {
          throwProviderError("MovieBox Web", "episodes", error);
        }
      });
    };
  }
});

// providers/movieBoxWeb/movieBoxWeb.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
