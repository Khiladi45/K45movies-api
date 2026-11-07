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

// providers/moviesda/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/moviesda/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Tamil 2026 Movies",
        filter: "/tamil-2026-movies/"
      },
      {
        title: "Tamil 2025 Movies",
        filter: "/tamil-2025-movies/"
      },
      {
        title: "Tamil 2024 Movies",
        filter: "/tamil-2024-movies/"
      },
      {
        title: "Tamil Dubbed Movies",
        filter: "/tamil-dubbed-movies/"
      },
      {
        title: "Tamil Web Series",
        filter: "/tamil-web-series-download/"
      },
      {
        title: "Latest Updates",
        filter: "/tamil-latest-updates/"
      }
    ];
    genres = [];
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

// providers/moviesda/utils.ts
function fetchWithDeadline(axios, url, headers, signal, deadlineMs) {
  return __async(this, null, function* () {
    var _a;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), deadlineMs);
    const onOuterAbort = () => controller.abort();
    signal == null ? void 0 : signal.addEventListener("abort", onOuterAbort);
    try {
      const res = yield axios.get(url, {
        headers,
        signal: controller.signal,
        timeout: deadlineMs
      });
      return typeof res.data === "string" ? res.data : String((_a = res.data) != null ? _a : "");
    } finally {
      clearTimeout(timer);
      signal == null ? void 0 : signal.removeEventListener("abort", onOuterAbort);
    }
  });
}
var cleanText, absoluteUrl, isFolderNavLink, posterFor, collectFolderLinks, normalizeQuality, heightToQuality, resolutionToQuality, getQuality, isDirectMedia, streamStageKey;
var init_utils = __esm({
  "providers/moviesda/utils.ts"() {
    "use strict";
    cleanText = (value) => (value || "").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
    absoluteUrl = (baseUrl, href) => {
      if (!href) return "";
      const value = href.trim();
      if (!value || value === "#") return "";
      try {
        return new URL(value, `${baseUrl}/`).href;
      } catch (e) {
        return value;
      }
    };
    isFolderNavLink = (href) => href.startsWith("/tamil-movies/") || href.startsWith("/movies.php") || href.includes("facebook") || href.includes("telegram");
    posterFor = (url) => {
      try {
        const parsed = new URL(url);
        const slug = parsed.pathname.replace(/\/+$/, "").split("/").pop() || "";
        const base = slug.replace(/-(tamil-)?(movie|web-series)$/i, "");
        if (!base || base === slug) return "";
        return `${parsed.origin}/uploads/posters/${base}.jpg`;
      } catch (e) {
        return "";
      }
    };
    collectFolderLinks = ($, baseUrl) => {
      const links = [];
      const seen = /* @__PURE__ */ new Set();
      $("div.f a[href]").each((_i, el) => {
        const href = ($(el).attr("href") || "").trim();
        const anchorText = cleanText($(el).text());
        const strongText = cleanText(
          $(el).closest("div.f").find("strong").first().text()
        );
        const label = /^(download|download now|watch|watch now|play)$/i.test(
          anchorText
        ) ? strongText : anchorText;
        const title = label || strongText;
        if (!href || href === "#" || !title || isFolderNavLink(href)) return;
        const url = absoluteUrl(baseUrl, href);
        if (!url || seen.has(url)) return;
        seen.add(url);
        links.push({ title, url });
      });
      return links;
    };
    normalizeQuality = (value) => {
      const n = Number(value);
      if (!Number.isFinite(n)) return void 0;
      if (n >= 2e3) return "2160";
      if (n >= 1e3) return "1080";
      if (n >= 700) return "720";
      if (n >= 500) return "480";
      if (n >= 300) return "360";
      return String(n);
    };
    heightToQuality = (height) => {
      if (height >= 2e3) return "2160";
      if (height >= 1e3) return "1080";
      if (height >= 700) return "720";
      if (height >= 500) return "480";
      if (height >= 300) return "360";
      return void 0;
    };
    resolutionToQuality = (width, height) => {
      if (width >= 3e3) return "2160";
      if (width >= 1800) return "1080";
      if (width >= 1200) return "720";
      if (width >= 800) return "480";
      if (width >= 600) return "360";
      return heightToQuality(height);
    };
    getQuality = (...parts) => {
      const text = cleanText(parts.filter(Boolean).join(" "));
      if (!text) return void 0;
      const p = text.match(/(\d{3,4})\s*p\b/i);
      if (p) return normalizeQuality(p[1]);
      const res = text.match(/(\d{3,4})\s*[x×]\s*(\d{3,4})/i);
      if (res) return resolutionToQuality(Number(res[1]), Number(res[2]));
      const k = text.match(/\b(2160|1080|720|480|360)\b/);
      if (k) return normalizeQuality(k[1]);
      return void 0;
    };
    isDirectMedia = (url) => /\.(mp4|mkv|m3u8|webm|avi)(\?|#|$)/i.test(url) || /\/(download|open)\.php\?dl=/i.test(url);
    streamStageKey = (url) => {
      var _a;
      const id = (_a = url.match(/\/(\d+)(?:\/|$|\?)/)) == null ? void 0 : _a[1];
      if (!id) return null;
      if (/\/download\/file\//.test(url)) return `file:${id}`;
      if (/\/download\/page\//.test(url)) return `page:${id}`;
      if (/\/stream\/page\//.test(url)) return `stream:${id}`;
      return null;
    };
  }
});

// providers/moviesda/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function fetchText(url, signal) {
  return __async(this, null, function* () {
    const res = yield fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} | URL ${url}`);
    }
    return res.text();
  });
}
function posts(_0) {
  return __async(this, arguments, function* ({
    url,
    signal,
    cheerio,
    operation
  }) {
    try {
      const data = yield fetchText(url, signal);
      const $ = cheerio.load(data);
      const baseUrl = new URL(url).origin;
      return collectFolderLinks($, baseUrl).map((item) => ({
        title: item.title,
        link: item.url,
        image: posterFor(item.url)
      }));
    } catch (err) {
      throwProviderError("Moviesda", operation, err);
    }
  });
}
var MAX_SEARCH_LETTER_PAGES, withPage, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/moviesda/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    MAX_SEARCH_LETTER_PAGES = 8;
    withPage = (url, page) => {
      if (!page || page <= 1) return url;
      const target = new URL(url);
      target.searchParams.set("page", String(page));
      return target.href;
    };
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const { cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("moviesda");
        const url = withPage(`${baseUrl}${filter || "/"}`, page);
        return posts({ url, signal, cheerio, operation: "posts" });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        signal,
        providerContext
      }) {
        const { cheerio } = providerContext;
        const query = cleanText(searchQuery);
        const first = query.charAt(0).toLowerCase();
        if (!/[a-z]/.test(first)) return [];
        try {
          const baseUrl = yield getBaseUrl("moviesda");
          const letterUrl = `${baseUrl}/tamil-movies/${first}/`;
          const firstHtml = yield fetchText(withPage(letterUrl, 1), signal);
          const $first = cheerio.load(firstHtml);
          const totalPages = Number(cleanText($first("#totalPages").text())) || 1;
          const pageNumbers = [];
          for (let p = 2; p <= Math.min(totalPages, MAX_SEARCH_LETTER_PAGES); p++) {
            pageNumbers.push(p);
          }
          const extraHtml = yield Promise.all(
            pageNumbers.map(
              (p) => fetchText(withPage(letterUrl, p), signal).catch(() => "")
            )
          );
          const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
          const results = [];
          const seen = /* @__PURE__ */ new Set();
          const matches = (title) => {
            const lower = title.toLowerCase();
            return tokens.every(
              (token) => /^\d+$/.test(token) ? new RegExp(`\\b${token}\\b`).test(lower) : lower.includes(token)
            );
          };
          for (const html of [firstHtml, ...extraHtml]) {
            if (!html) continue;
            const $ = cheerio.load(html);
            for (const item of collectFolderLinks($, baseUrl)) {
              const title = cleanText(item.title);
              if (!matches(title)) continue;
              if (seen.has(item.url)) continue;
              seen.add(item.url);
              results.push({
                title,
                link: item.url,
                image: posterFor(item.url)
              });
            }
          }
          return results;
        } catch (err) {
          throwProviderError("Moviesda", "search posts", err);
        }
      });
    };
  }
});

// providers/moviesda/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function resolveQualityNodes(start, axios, cheerio, baseUrl, headers) {
  return __async(this, null, function* () {
    var _a;
    let frontier = start.map((item) => __spreadProps(__spreadValues({}, item), {
      depth: 0
    }));
    const leaves = [];
    let fetches = 0;
    while (frontier.length > 0) {
      const next = [];
      for (const node of frontier) {
        const depth = (_a = node.depth) != null ? _a : 0;
        if (getQuality(node.title) || depth >= 2 || fetches >= MAX_PAGE_FETCHES) {
          leaves.push(node);
          continue;
        }
        fetches++;
        let sub = [];
        try {
          const html = yield fetchWithDeadline(
            axios,
            node.url,
            headers,
            void 0,
            1e4
          );
          sub = collectFolderLinks(cheerio.load(html), baseUrl);
        } catch (e) {
        }
        if (sub.length === 0) {
          leaves.push(node);
          continue;
        }
        for (const child of sub) {
          next.push(__spreadProps(__spreadValues({}, child), { parent: node.title, depth: depth + 1 }));
        }
      }
      frontier = next;
    }
    return leaves;
  });
}
function buildLinks(nodes, type) {
  const titleCounts = /* @__PURE__ */ new Map();
  for (const node of nodes) {
    titleCounts.set(node.title, (titleCounts.get(node.title) || 0) + 1);
  }
  const links = [];
  const seen = /* @__PURE__ */ new Set();
  for (const node of nodes) {
    if (!node.url || seen.has(node.url)) continue;
    seen.add(node.url);
    const duplicateTitle = (titleCounts.get(node.title) || 0) > 1;
    const label = duplicateTitle && node.parent ? `${node.parent} \xB7 ${node.title}` : node.title;
    const quality = getQuality(node.title, node.url);
    if (type === "series") {
      links.push({ title: label, quality, episodesLink: node.url });
    } else {
      links.push({
        title: label,
        quality,
        directLinks: [{ title: label, link: node.url, type: "movie" }]
      });
    }
  }
  return links.sort(
    (a, b) => Number(b.quality || 0) - Number(a.quality || 0)
  );
}
var MAX_PAGE_FETCHES, getMeta;
var init_meta = __esm({
  "providers/moviesda/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    MAX_PAGE_FETCHES = 8;
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = yield getBaseUrl("moviesda");
        const url = absoluteUrl(baseUrl, link);
        try {
          const html = yield fetchWithDeadline(
            axios,
            url,
            commonHeaders,
            void 0,
            12e3
          );
          const $ = cheerio.load(html);
          const infoRows = {};
          $("ul.movie-info li").each((_i, el) => {
            const key = cleanText($(el).find("strong").first().text()).replace(/:\s*$/, "").toLowerCase();
            const value = cleanText($(el).find("span").first().text());
            if (key && value) infoRows[key] = value;
          });
          const title = (cleanText(infoRows.movie) || cleanText($("h1").first().text()) || cleanText($("title").text())).replace(
            /\s*(?:Tamil\s+)?(?:Web Series|Movie[s]?)\s+Download\s+Moviesda.*$/i,
            ""
          ).replace(/\s*[-|]\s*Moviesda.*$/i, "").trim();
          const image = absoluteUrl(
            baseUrl,
            $("picture img[src]").first().attr("src") || $(".movie-info-container img[src]").first().attr("src") || $("img.screenshot-img[src]").first().attr("src") || ""
          ) || posterFor(url);
          const synopsis = cleanText($(".movie-synopsis").text()).replace(
            /^synopsis\s*:?\s*/i,
            ""
          ) || cleanText($("p.pageDescr").text());
          const tags = cleanText(infoRows.genres).split(",").map((tag) => cleanText(tag)).filter(Boolean);
          const cast = cleanText(infoRows.starring).split(",").map((name) => cleanText(name)).filter(Boolean);
          const rating = cleanText(infoRows["movie rating"]).replace(/\s*\/\s*10$/, "");
          const children = collectFolderLinks($, baseUrl);
          const type = /web-series/i.test(url) || /season\s*\d+/i.test(children.map((child) => child.title).join(" ")) ? "series" : "movie";
          const hasDirectFolders = $(
            ".folder .left ul li a[href], .folder .dlink a[href]"
          ).length;
          let linkList = [];
          if (children.length > 0) {
            const leaves = yield resolveQualityNodes(
              children,
              axios,
              cheerio,
              baseUrl,
              commonHeaders
            );
            linkList = buildLinks(leaves, type);
          }
          if (linkList.length === 0 && hasDirectFolders) {
            const quality = getQuality(title, url);
            linkList = [
              type === "series" ? { title: title || "Episodes", quality, episodesLink: url } : {
                title: title || "Download",
                quality,
                directLinks: [
                  { title: title || "Download", link: url, type: "movie" }
                ]
              }
            ];
          }
          if (linkList.length === 0 && type === "series") {
            linkList = [{ title: title || "Episodes", episodesLink: url }];
          }
          return {
            title,
            synopsis,
            image,
            imdbId: "",
            tags,
            cast,
            rating,
            type,
            linkList,
            webUrl: url
          };
        } catch (err) {
          throwProviderError("Moviesda", "metadata", err);
        }
      });
    };
  }
});

// providers/moviesda/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function getStream(_0) {
  return __async(this, arguments, function* ({
    link,
    signal,
    providerContext
  }) {
    const { axios, cheerio, commonHeaders } = providerContext;
    const headers = commonHeaders || {};
    const streams = [];
    const visited = /* @__PURE__ */ new Set();
    const visitedStages = /* @__PURE__ */ new Set();
    const queue = [
      { url: link, depth: 0, quality: getQuality(link) }
    ];
    const startedAt = Date.now();
    const addStream = (streamLink, quality) => {
      if (!streamLink || streams.length >= STREAMS_EARLY_EXIT) return;
      if (streams.some((stream) => stream.link === streamLink)) return;
      const extension = streamLink.match(/\.(mp4|mkv|webm)(?:\?|#|$)/i);
      streams.push({
        server: `Moviesda ${streams.length + 1}`,
        link: streamLink,
        type: extension ? extension[1].toLowerCase() : "mp4",
        quality,
        headers
      });
    };
    try {
      while (queue.length > 0 && streams.length < STREAMS_EARLY_EXIT) {
        if (Date.now() - startedAt > TOTAL_DEADLINE_MS) break;
        const current = queue.shift();
        if (!current.url || visited.has(current.url)) continue;
        visited.add(current.url);
        if (isDirectMedia(current.url)) {
          addStream(current.url, current.quality || getQuality(current.url));
          continue;
        }
        const stageKey = streamStageKey(current.url);
        if (stageKey && visitedStages.has(stageKey)) continue;
        if (stageKey) visitedStages.add(stageKey);
        if (current.depth > MAX_DEPTH) continue;
        let html = "";
        try {
          html = yield fetchWithDeadline(
            axios,
            current.url,
            headers,
            signal,
            REQUEST_DEADLINE_MS
          );
        } catch (err) {
          if (current.depth === 0) throw err;
          continue;
        }
        const $ = cheerio.load(html);
        const pageQuality = getQuality(
          $("title").text(),
          $(".line").eq(1).text(),
          $(".details").text(),
          current.url
        ) || current.quality;
        const mediaSource = absoluteUrl(
          current.url,
          $("video source[src]").first().attr("src") || $("source[src]").first().attr("src") || $("video[src]").first().attr("src")
        );
        if (mediaSource) {
          addStream(mediaSource, pageQuality);
          continue;
        }
        const hrefs = [];
        const addHref = (href) => {
          const absolute = absoluteUrl(current.url, href);
          if (absolute) hrefs.push(absolute);
        };
        $(".download .dlink a[href], .dlink a[href]").each(
          (_i, el) => addHref($(el).attr("href"))
        );
        if (hrefs.length === 0) {
          $(".folder .left ul li a[href]").each(
            (_i, el) => addHref($(el).attr("href"))
          );
        }
        if (hrefs.length === 0) {
          collectFolderLinks($, current.url).forEach(
            (item) => addHref(item.url)
          );
        }
        if (hrefs.length === 0) {
          const embedded = html.match(
            /https?:\/\/[^"'\s<>]+(?:\.mp4|\.mkv|\.m3u8|(?:download|open)\.php\?dl=[^"'\s<>]*)/gi
          );
          (embedded || []).forEach((href) => addHref(href));
        }
        for (const href of Array.from(new Set(hrefs)).slice(0, HREFS_PER_PAGE)) {
          if (isDirectMedia(href)) {
            addStream(href, getQuality(href) || pageQuality);
            continue;
          }
          queue.push({
            url: href,
            depth: current.depth + 1,
            quality: getQuality(href) || pageQuality
          });
        }
      }
    } catch (err) {
      if (streams.length === 0) throwProviderError("Moviesda", "stream", err);
    }
    return streams;
  });
}
var REQUEST_DEADLINE_MS, TOTAL_DEADLINE_MS, STREAMS_EARLY_EXIT, MAX_DEPTH, HREFS_PER_PAGE;
var init_stream = __esm({
  "providers/moviesda/stream.ts"() {
    "use strict";
    init_providerErrors();
    init_utils();
    REQUEST_DEADLINE_MS = 12e3;
    TOTAL_DEADLINE_MS = 3e4;
    STREAMS_EARLY_EXIT = 2;
    MAX_DEPTH = 6;
    HREFS_PER_PAGE = 4;
  }
});

// providers/moviesda/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
function episodeIndex(title) {
  const match = title.match(/(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}
var getEpisodes;
var init_episodes = __esm({
  "providers/moviesda/episodes.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = yield getBaseUrl("moviesda");
        const pageUrl = absoluteUrl(baseUrl, url);
        try {
          const data = yield fetchWithDeadline(
            axios,
            pageUrl,
            commonHeaders,
            void 0,
            12e3
          );
          const $ = cheerio.load(data);
          const episodes = [];
          const seen = /* @__PURE__ */ new Set();
          $(".folder").each((_i, el) => {
            const anchor = $(el).find(".left ul li a[href]").first();
            const href = anchor.attr("href");
            if (!href) return;
            const link = absoluteUrl(baseUrl, href);
            if (!link || seen.has(link)) return;
            seen.add(link);
            const fileName = cleanText(anchor.text()) || cleanText($(el).find(".tblimg img").attr("alt"));
            const image = absoluteUrl(
              baseUrl,
              $(el).find(".tblimg img[src]").first().attr("src")
            );
            const size = cleanText($(el).find(".left ul li").eq(1).text()).replace(
              /^file size\s*:\s*/i,
              ""
            );
            const episodeNumber = fileName.match(/\bEpi(?:sode)?\s*[-_ ]?(\d+)/i);
            const title = episodeNumber ? `Episode ${episodeNumber[1].padStart(2, "0")}` : fileName.replace(/^moviesda\.mobi\s*-\s*/i, "").replace(/\.mp4$/i, "") || `Episode ${episodes.length + 1}`;
            episodes.push({
              title,
              link,
              image,
              description: size || void 0
            });
          });
          if (episodes.length > 0) {
            return episodes.sort((a, b) => episodeIndex(a.title) - episodeIndex(b.title));
          }
          return collectFolderLinks($, baseUrl).map((item) => ({
            title: item.title,
            link: item.url
          }));
        } catch (err) {
          throwProviderError("Moviesda", "episodes", err);
        }
      });
    };
  }
});

// providers/moviesda/moviesda.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
