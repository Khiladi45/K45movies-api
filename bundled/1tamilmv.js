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

// providers/1tamilmv/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/1tamilmv/catalog.ts"() {
    "use strict";
    catalog = [
      // Homepage "TOP RELEASES THIS WEEK" widget — the only section whose links
      // ([W] luluvido embeds) are directly streamable.
      { title: "Watch Online (Latest)", filter: "/watch-online/" },
      {
        title: "Tamil WEB-HD / BluRay",
        filter: "/index.php?/forums/forum/11-web-hd-itunes-hd-bluray/"
      },
      {
        title: "Tamil PreDVD / CAM",
        filter: "/index.php?/forums/forum/10-predvd-dvdscr-cam-tc/"
      },
      {
        title: "Tamil HD-Rips",
        filter: "/index.php?/forums/forum/12-hd-rips-dvd-rips-br-rips/"
      },
      {
        title: "Tamil Web Series",
        filter: "/index.php?/forums/forum/19-web-series-tv-shows/"
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

// providers/1tamilmv/utils.ts
var cleanText, WATCH_FILTER, isWatchHost, isTopicUrl, isShortLink, canonicalTopicUrl, getQuality, displayTitle, unpackPacked, playerSourceFrom, streamCashSource;
var init_utils = __esm({
  "providers/1tamilmv/utils.ts"() {
    "use strict";
    cleanText = (value) => (value || "").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
    WATCH_FILTER = "/watch-online/";
    isWatchHost = (url) => /luluvido\.|luluvdo\.|lulustream\.|luluvid\.|lulust\.|luvbx\.|mbfile\.|filelions\.|streamruby\.|streamcash\.|vidhide\.|dood(?:stream|watch)\./i.test(
      url
    );
    isTopicUrl = (url) => /\/forums\/topic\//.test(url);
    isShortLink = (url) => /spoo\.me|cyberloom\.best|stackmint\.ink|icutr\.|linkshortify/i.test(url);
    canonicalTopicUrl = (href, baseUrl) => {
      let url;
      try {
        url = new URL(href, `${baseUrl}/`).href;
      } catch (e) {
        url = href;
      }
      return url.split("#")[0].replace(/&preview=1/, "").replace(/&do=[^&]*/, "").replace(/&comment=\d+/, "").replace(/\/page\/\d+\/$/, "/");
    };
    getQuality = (text) => {
      const m = text.match(/(?:^|[^\d])(2160|1080|720|480|360)p?(?:[^\d]|$)/i);
      if (m) return m[1];
      if (/\b4k\b/i.test(text)) return "2160";
      return void 0;
    };
    displayTitle = (releaseTitle) => {
      const stripped = cleanText(releaseTitle).replace(/^www\.[^ ]*?\s*[-–]\s*/i, "").replace(/^[-–|]\s*/, "");
      const head = cleanText(stripped.split(/\s+-\s+\[/)[0]);
      const name = head.match(/^(.*?\(\d{4}\))/);
      const quality = getQuality(stripped);
      if (name) return quality ? `${name[1]} ${quality}p` : name[1];
      return head.slice(0, 80);
    };
    unpackPacked = (html) => {
      const evalIdx = html.indexOf("eval(function(p,a,c,k");
      if (evalIdx < 0) return null;
      const startIdx = html.indexOf("}('", evalIdx);
      if (startIdx < 0) return null;
      const tailRe = /',(\d+),(\d+),'([^']*)'\.split\('\|'\)/g;
      tailRe.lastIndex = startIdx;
      const tail = tailRe.exec(html);
      if (!tail || tail.index <= startIdx) return null;
      const payload = html.slice(startIdx + 3, tail.index);
      const radix = Number(tail[1]);
      const count = Number(tail[2]);
      if (radix < 2 || radix > 36 || count > 2048 || payload.length > 128e3) return null;
      const words = tail[3].split("|");
      let result = payload;
      for (let i = count - 1; i >= 0; i--) {
        const token = i.toString(radix);
        if (!words[i]) continue;
        result = result.replace(new RegExp(`\\b${token}\\b`, "g"), () => words[i]);
      }
      return result;
    };
    playerSourceFrom = (unpacked) => {
      const file = unpacked.match(/(?:file|src)\s*:\s*["']([^"']*(?:\.m3u8|\.mp4|\.mkv)[^"']*)["']/i);
      return file ? file[1] : null;
    };
    streamCashSource = (html) => {
      var _a;
      const encoded = (_a = html.match(/window\.__PCr\s*=\s*['"]([^'"]+)['"]/)) == null ? void 0 : _a[1];
      if (!encoded) return null;
      try {
        const config = JSON.parse(atob(encoded));
        const src = typeof (config == null ? void 0 : config.src) === "string" ? config.src : "";
        return /^https?:\/\//i.test(src) ? src : null;
      } catch (e) {
        return null;
      }
    };
  }
});

// providers/1tamilmv/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function fetchText(axios, url, signal, headers) {
  return __async(this, null, function* () {
    var _a;
    if (signal == null ? void 0 : signal.aborted) return "";
    const cached = htmlCache.get(url);
    if (cached && Date.now() - cached.at < HTML_TTL_MS) return cached.html;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const onOuterAbort = () => controller.abort();
    signal == null ? void 0 : signal.addEventListener("abort", onOuterAbort);
    try {
      const res = yield axios.get(url, {
        signal: controller.signal,
        headers,
        timeout: REQUEST_TIMEOUT_MS,
        maxRedirects: 5
      });
      const html = typeof res.data === "string" ? res.data : String((_a = res.data) != null ? _a : "");
      if (html) {
        if (htmlCache.size >= 6) htmlCache.delete(htmlCache.keys().next().value);
        htmlCache.set(url, { at: Date.now(), html });
      }
      return html;
    } finally {
      clearTimeout(timer);
      signal == null ? void 0 : signal.removeEventListener("abort", onOuterAbort);
    }
  });
}
function watchWidgetPosts(baseUrl, signal, axios, cheerio, headers) {
  return __async(this, null, function* () {
    const url = `${baseUrl}/`;
    if (signal == null ? void 0 : signal.aborted) return [];
    if ((watchCache == null ? void 0 : watchCache.url) === url && Date.now() - watchCache.at < HTML_TTL_MS) {
      return watchCache.posts;
    }
    const html = yield fetchText(axios, url, signal, headers);
    if (!html || (signal == null ? void 0 : signal.aborted)) return [];
    const $ = cheerio.load(html, { xml: { xmlMode: false } });
    const posts2 = [];
    const seen = /* @__PURE__ */ new Set();
    const topics = /* @__PURE__ */ new Map();
    $("a[href]").each((_i, el) => {
      const anchor = $(el);
      const href = anchor.attr("href") || "";
      if (href.includes("/forums/topic/")) {
        topics.set(anchor.closest("p, div").get(0), canonicalTopicUrl(href, baseUrl));
        return;
      }
      if (!/^https?:\/\//i.test(href) || cleanText(anchor.text()) !== "[W]") return;
      const block = anchor.closest("p, div").get(0);
      const topic = topics.get(block);
      if (!topic) return;
      topics.delete(block);
      if (seen.has(href)) return;
      const release = topic.match(/\/topic\/\d+-(.+?)-((?:19|20)\d{2})(?:-|\/|$)/i);
      if (!release) return;
      const name = release[1].split("-").map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" ");
      seen.add(href);
      posts2.push({
        title: `${name} (${release[2]})`,
        link: href,
        image: ""
      });
    });
    if (posts2.length) watchCache = { url, at: Date.now(), posts: posts2 };
    return posts2;
  });
}
function posts(_0) {
  return __async(this, arguments, function* ({
    url,
    signal,
    axios,
    cheerio,
    headers,
    operation
  }) {
    try {
      const data = yield fetchText(axios, url, signal, headers);
      if (!data || (signal == null ? void 0 : signal.aborted)) return [];
      const $ = cheerio.load(data, { xml: { xmlMode: false } });
      const baseUrl = new URL(url).origin;
      const catalog2 = [];
      const seen = /* @__PURE__ */ new Set();
      $('a[href*="/topic/"]').each((_i, el) => {
        const href = $(el).attr("href") || "";
        const title = cleanText($(el).text());
        if (!href || title.length < 15) return;
        const link = canonicalTopicUrl(href, baseUrl);
        if (seen.has(link)) return;
        seen.add(link);
        catalog2.push({ title: displayTitle(title), link, image: "" });
      });
      return catalog2;
    } catch (err) {
      throwProviderError("1TamilMV", operation, err);
    }
  });
}
var REQUEST_TIMEOUT_MS, HTML_TTL_MS, htmlCache, watchCache, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/1tamilmv/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    REQUEST_TIMEOUT_MS = 15e3;
    HTML_TTL_MS = 3 * 6e4;
    htmlCache = /* @__PURE__ */ new Map();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = (yield getBaseUrl("1tamilmv")) || "https://www.1tamilmv.io";
        const headers = commonHeaders || {};
        if (filter === WATCH_FILTER) {
          return page > 1 ? [] : watchWidgetPosts(baseUrl, signal, axios, cheerio, headers);
        }
        const url = `${baseUrl}${filter}${page > 1 ? `page/${page}/` : ""}`;
        return posts({ url, signal, axios, cheerio, headers, operation: "posts" });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        signal,
        providerContext
      }) {
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = (yield getBaseUrl("1tamilmv")) || "https://www.1tamilmv.io";
        const headers = commonHeaders || {};
        const query = cleanText(searchQuery);
        if (!query) return [];
        try {
          const searchUrl = `${baseUrl}/index.php?/search/&q=${encodeURIComponent(query)}&type=forums_topic`;
          const [forum, watchPosts] = yield Promise.all([
            posts({
              url: searchUrl,
              signal,
              axios,
              cheerio,
              headers,
              operation: "search posts"
            }).then((rows) => ({ rows }), (error) => ({ error })),
            watchWidgetPosts(baseUrl, signal, axios, cheerio, headers).catch(() => [])
          ]);
          if (signal == null ? void 0 : signal.aborted) return [];
          const lower = query.toLowerCase();
          const tokens = lower.split(/\s+/).filter(Boolean);
          const matches = (title) => {
            const t = title.toLowerCase();
            return tokens.every(
              (token) => /^\d+$/.test(token) ? new RegExp(`\\b${token}\\b`).test(t) : t.includes(token)
            );
          };
          const watchHits = watchPosts.filter((p) => matches(p.title));
          if ("error" in forum && watchHits.length === 0) throw forum.error;
          const topicResults = ("rows" in forum ? forum.rows : []).filter(
            (p) => !watchHits.some((w) => w.title === p.title)
          );
          return [...watchHits, ...topicResults];
        } catch (err) {
          throwProviderError("1TamilMV", "search posts", err);
        }
      });
    };
  }
});

// providers/1tamilmv/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function fetchHtml(axios, url, headers) {
  return __async(this, null, function* () {
    var _a;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS2);
    try {
      const res = yield axios.get(url, {
        headers,
        signal: controller.signal,
        timeout: REQUEST_TIMEOUT_MS2
      });
      return typeof res.data === "string" ? res.data : String((_a = res.data) != null ? _a : "");
    } finally {
      clearTimeout(timer);
    }
  });
}
function watchLinksFromTopic($, baseUrl) {
  const links = [];
  const seen = /* @__PURE__ */ new Set();
  $("div[data-role=commentContent] a[href]").each((_i, el) => {
    const href = $(el).attr("href") || "";
    const text = cleanText($(el).text());
    if (!href) return;
    const url = href.startsWith("http") ? href : new URL(href, `${baseUrl}/`).href;
    if (text === "[W]" || isWatchHost(url)) {
      if (!seen.has(url)) {
        seen.add(url);
        links.push({ label: text === "[W]" ? "Watch Online" : text || "Watch Online", url });
      }
    } else if (isShortLink(url) && /1080|720|watch|watch online/i.test(text)) {
      if (!seen.has(url)) {
        seen.add(url);
        links.push({ label: text, url });
      }
    }
  });
  return links;
}
var REQUEST_TIMEOUT_MS2, getMeta;
var init_meta = __esm({
  "providers/1tamilmv/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    REQUEST_TIMEOUT_MS2 = 15e3;
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = (yield getBaseUrl("1tamilmv")) || "https://www.1tamilmv.io";
        const url = new URL(link, `${baseUrl}/`).href;
        try {
          if (!isTopicUrl(url) && (isWatchHost(url) || isShortLink(url))) {
            const html2 = yield fetchHtml(axios, url, commonHeaders);
            const $2 = cheerio.load(html2);
            const pageTitle = cleanText($2("title").text()).replace(/^www\.[^ ]*\s*-\s*/i, "").replace(/\s*-\s*(LuluStream|.*Stream)$/i, "") || "Watch Online";
            const quality = getQuality(pageTitle);
            return {
              title: displayTitle(pageTitle) || pageTitle,
              synopsis: "",
              image: cleanText($2("meta[property='og:image']").attr("content")),
              imdbId: "",
              tags: [],
              type: "movie",
              linkList: [
                {
                  title: "Watch Online",
                  quality,
                  directLinks: [{ title: "Watch Online", link: url, type: "movie" }]
                }
              ],
              webUrl: url
            };
          }
          const html = yield fetchHtml(axios, url, commonHeaders);
          const $ = cheerio.load(html);
          const releaseTitle = cleanText($("h1.ipsType_pageTitle").first().text()) || cleanText($("title").text());
          const title = displayTitle(releaseTitle) || releaseTitle;
          const synopsis = cleanText($("meta[property='og:description']").attr("content")) || cleanText($("div[data-role=commentContent]").first().find("p").first().text());
          const image = cleanText($("meta[property='og:image']").attr("content"));
          const isSeries = /\bS\d{2}\b|season\s*\d|web[\s-]?series|episode|E\d{2}\b/i.test(
            releaseTitle
          );
          const watchLinks = watchLinksFromTopic($, baseUrl);
          const linkList = watchLinks.map((entry) => {
            const quality = getQuality(entry.label) || getQuality(releaseTitle);
            return isSeries ? { title: entry.label, quality, episodesLink: entry.url } : {
              title: entry.label,
              quality,
              directLinks: [{ title: entry.label, link: entry.url, type: "movie" }]
            };
          });
          return {
            title,
            synopsis,
            image,
            imdbId: "",
            tags: [],
            type: isSeries ? "series" : "movie",
            linkList,
            webUrl: url
          };
        } catch (err) {
          throwProviderError("1TamilMV", "metadata", err);
        }
      });
    };
  }
});

// providers/1tamilmv/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function fetchHtml2(axios, url, headers, signal) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS3);
    const onOuterAbort = () => controller.abort();
    if (signal == null ? void 0 : signal.aborted) controller.abort();
    signal == null ? void 0 : signal.addEventListener("abort", onOuterAbort);
    try {
      const res = yield axios.get(url, {
        headers,
        signal: controller.signal,
        timeout: REQUEST_TIMEOUT_MS3,
        maxRedirects: 5
      });
      return {
        html: typeof res.data === "string" ? res.data : "",
        url: ((_a = res.request) == null ? void 0 : _a.responseURL) || ((_c = (_b = res.request) == null ? void 0 : _b.res) == null ? void 0 : _c.responseUrl) || url
      };
    } finally {
      clearTimeout(timer);
      signal == null ? void 0 : signal.removeEventListener("abort", onOuterAbort);
    }
  });
}
function resolveDirectChain(axios, cheerio, startUrl, headers, signal) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25e3);
    const onOuterAbort = () => controller.abort();
    if (signal == null ? void 0 : signal.aborted) controller.abort();
    signal == null ? void 0 : signal.addEventListener("abort", onOuterAbort);
    try {
      let url = startUrl;
      let referer = "";
      for (let hop = 0; hop < 6 && !isDirectMedia(url); hop++) {
        const res = yield axios.get(url, {
          headers: referer ? __spreadProps(__spreadValues({}, headers), { Referer: referer }) : headers,
          signal: controller.signal,
          timeout: REQUEST_TIMEOUT_MS3,
          maxRedirects: 0,
          validateStatus: null
        });
        const location = (_a = res.headers) == null ? void 0 : _a.location;
        if (location && res.status >= 300 && res.status < 400) {
          referer = url;
          url = new URL(location, url).href;
          continue;
        }
        url = ((_b = res.request) == null ? void 0 : _b.responseURL) || ((_d = (_c = res.request) == null ? void 0 : _c.res) == null ? void 0 : _d.responseUrl) || url;
        if (res.status >= 200 && res.status < 300 && /^video\//i.test(((_e = res.headers) == null ? void 0 : _e["content-type"]) || "")) {
          return { link: url, quality: getQuality(url) };
        }
        if (res.status !== 200 || typeof res.data !== "string") return null;
        const $ = cheerio.load(res.data);
        let next = "";
        $("a[href]").each((_i, el) => {
          if (next) return;
          const href = $(el).attr("href") || "";
          const text = cleanText($(el).text());
          const abs = /^https?:\/\//i.test(href) ? href : new URL(href, url).href;
          if (isDirectMedia(abs)) {
            next = abs;
            return;
          }
          if (/continue|destination|direct|download/i.test(text) && /\/out\/?\?|\/go\/?\?/.test(abs)) {
            next = abs;
          }
        });
        if (!next) return null;
        referer = url;
        url = next.replace(/&amp;/g, "&");
      }
      return isDirectMedia(url) ? { link: url, quality: getQuality(url) } : null;
    } catch (e) {
      return null;
    } finally {
      clearTimeout(timer);
      signal == null ? void 0 : signal.removeEventListener("abort", onOuterAbort);
    }
  });
}
function resolveWatchPage(html, pageUrl, headers) {
  var _a;
  const streams = [];
  const add = (link, type, quality) => {
    try {
      link = new URL(link.replace(/\\\//g, "/").replace(/\\u0026/g, "&").replace(/&amp;/g, "&"), pageUrl).href;
    } catch (e) {
      return;
    }
    if (!/^https?:\/\//i.test(link) || streams.some((s) => s.link === link)) return;
    streams.push({
      server: `1TamilMV ${streams.length + 1}`,
      link,
      type,
      quality,
      headers: __spreadProps(__spreadValues({}, headers), { Referer: pageUrl })
    });
  };
  const title = ((_a = html.match(/<title[^>]*>([^<]*)<\/title>/i)) == null ? void 0 : _a[1]) || "";
  const streamCash = streamCashSource(html);
  if (streamCash) add(streamCash, "m3u8", getQuality(title));
  const unpacked = unpackPacked(html);
  if (unpacked) {
    const source = playerSourceFrom(unpacked);
    if (source) {
      const type = /\.m3u8/i.test(source) ? "m3u8" : "mp4";
      add(source, type, getQuality(unpacked) || getQuality(title));
    }
  }
  const video = html.match(/<(?:source|video)[^>]+src=["']([^"']*\.(?:m3u8|mp4|mkv)[^"']*)["']/i);
  if (video) {
    add(video[1], /\.m3u8/i.test(video[1]) ? "m3u8" : "mp4");
  }
  return streams;
}
function getStream(_0) {
  return __async(this, arguments, function* ({
    link,
    signal,
    providerContext
  }) {
    const { axios, cheerio, commonHeaders } = providerContext;
    const headers = commonHeaders || {};
    let streams = [];
    try {
      if (isTopicUrl(link)) {
        const topic = yield fetchHtml2(axios, link, headers, signal);
        const $ = cheerio.load(topic.html, { xml: { xmlMode: false } });
        const watchUrls = [];
        const directUrls = [];
        $("div[data-role=commentContent] a[href]").each((_i, el) => {
          const href = $(el).attr("href") || "";
          const text = cleanText($(el).text());
          if ((text === "[W]" || isWatchHost(href)) && !watchUrls.includes(href)) {
            watchUrls.push(href);
          }
          if ((/direct\s*link/i.test(text) || /cyberloom\./i.test(href)) && /^https?:\/\//i.test(href) && !directUrls.includes(href)) {
            directUrls.push(href);
          }
        });
        for (const watchUrl of watchUrls.slice(0, 5)) {
          const page = yield fetchHtml2(axios, watchUrl, __spreadProps(__spreadValues({}, headers), { Referer: topic.url }), signal).catch(
            () => null
          );
          if (page) streams.push(...resolveWatchPage(page.html, page.url, headers));
          if (streams.length >= 2) break;
        }
        for (const directUrl of directUrls.slice(0, 2)) {
          if (streams.length >= 3) break;
          const resolved = yield resolveDirectChain(
            axios,
            cheerio,
            directUrl,
            headers,
            signal
          );
          if (resolved) {
            streams.push({
              server: `1TamilMV Direct ${streams.length + 1}`,
              link: resolved.link,
              type: /\.m3u8/i.test(resolved.link) ? "m3u8" : /\.mkv/i.test(resolved.link) ? "mkv" : "mp4",
              quality: resolved.quality,
              headers
            });
          }
        }
        return streams;
      }
      if (/cyberloom\./i.test(link)) {
        const resolved = yield resolveDirectChain(
          axios,
          cheerio,
          link,
          headers,
          signal
        );
        if (resolved) {
          streams.push({
            server: "1TamilMV Direct",
            link: resolved.link,
            type: /\.m3u8/i.test(resolved.link) ? "m3u8" : /\.mkv/i.test(resolved.link) ? "mkv" : "mp4",
            quality: resolved.quality,
            headers
          });
          return streams;
        }
        return streams;
      }
      if (isShortLink(link)) {
        try {
          const page = yield fetchHtml2(axios, link, headers, signal);
          streams.push(...resolveWatchPage(page.html, page.url, headers));
          return streams;
        } catch (e) {
          return streams;
        }
      }
      try {
        const page = yield fetchHtml2(axios, link, headers, signal);
        streams = resolveWatchPage(page.html, page.url, headers);
      } catch (e) {
        return streams;
      }
      return streams;
    } catch (err) {
      if (streams.length === 0) throwProviderError("1TamilMV", "stream", err);
    }
    return streams;
  });
}
var REQUEST_TIMEOUT_MS3, isDirectMedia;
var init_stream = __esm({
  "providers/1tamilmv/stream.ts"() {
    "use strict";
    init_providerErrors();
    init_utils();
    REQUEST_TIMEOUT_MS3 = 15e3;
    isDirectMedia = (url) => /\.(mkv|mp4|webm|avi|m3u8)(\?|$)/i.test(url) || /\/files\/.+\?token=/i.test(url);
  }
});

// providers/1tamilmv/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var REQUEST_TIMEOUT_MS4, getEpisodes;
var init_episodes = __esm({
  "providers/1tamilmv/episodes.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    init_utils();
    REQUEST_TIMEOUT_MS4 = 15e3;
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        signal,
        providerContext
      }) {
        var _a;
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = (yield getBaseUrl("1tamilmv")) || "https://www.1tamilmv.io";
        const pageUrl = new URL(url, `${baseUrl}/`).href;
        if (isWatchHost(pageUrl)) {
          return [{ title: "Watch Episode", link: pageUrl }];
        }
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS4);
          try {
            const res = yield axios.get(pageUrl, {
              headers: commonHeaders,
              signal: controller.signal,
              timeout: REQUEST_TIMEOUT_MS4
            });
            const $ = cheerio.load(
              typeof res.data === "string" ? res.data : String((_a = res.data) != null ? _a : "")
            );
            const episodes = [];
            const seen = /* @__PURE__ */ new Set();
            $("div[data-role=commentContent] a[href]").each((_i, el) => {
              const href = $(el).attr("href") || "";
              const text = cleanText($(el).text());
              if (!href || text !== "[W]" && !isWatchHost(href)) return;
              if (seen.has(href)) return;
              seen.add(href);
              episodes.push({
                title: /1080|720|480|360/.test(text) ? `Episode ${episodes.length + 1} (${text})` : `Episode ${episodes.length + 1}`,
                link: href
              });
            });
            return episodes;
          } finally {
            clearTimeout(timer);
          }
        } catch (err) {
          throwProviderError("1TamilMV", "episodes", err);
        }
      });
    };
  }
});

// providers/1tamilmv/1tamilmv.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
