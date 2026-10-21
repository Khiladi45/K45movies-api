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

// providers/animeworld/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog
});
var catalog;
var init_catalog = __esm({
  "providers/animeworld/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Trending",
        filter: ""
      },
      {
        title: "Series",
        filter: "series/"
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

// providers/animeworld/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function getPosts(_0) {
  return __async(this, arguments, function* ({
    filter,
    page = 1,
    signal,
    providerContext
  }) {
    return fetchPosts({ filter, page, query: "", signal, providerContext });
  });
}
function getSearchPosts(_0) {
  return __async(this, arguments, function* ({
    searchQuery,
    page = 1,
    signal,
    providerContext
  }) {
    return fetchPosts({ filter: "", page, query: searchQuery, signal, providerContext });
  });
}
function fetchPosts(_0) {
  return __async(this, arguments, function* ({
    filter,
    query,
    page = 1,
    signal,
    providerContext
  }) {
    try {
      const { axios, cheerio } = providerContext;
      const baseUrl = ((yield getBaseUrl("animeworld").catch(() => "")) || "https://watchanimeworld.one").replace(/\/+$/, "");
      let url;
      if (query && query.trim()) {
        url = `${baseUrl}/?s=${encodeURIComponent(query)}${page > 1 ? `&paged=${page}` : ""}`;
      } else if (filter) {
        const cleanFilter = filter.replace(/^\/+/, "").replace(/\/+$/, "");
        url = `${baseUrl}/${cleanFilter}${page > 1 ? `/page/${page}` : ""}`;
      } else {
        url = `${baseUrl}${page > 1 ? `/page/${page}` : ""}`;
      }
      const res = yield axios.get(url, { headers: defaultHeaders, signal });
      const $ = cheerio.load(res.data || "");
      const resolveUrl = (href) => (href == null ? void 0 : href.startsWith("http")) ? href : new URL(href, baseUrl).href;
      const seen = /* @__PURE__ */ new Set();
      const catalog2 = [];
      const POST_SELECTORS = [
        ".anime-blog",
        "article",
        "li.post",
        ".swiper-slide li",
        ".latest-movies-series-swiper-slide li",
        "ul.post-lst li"
      ].join(",");
      $(POST_SELECTORS).each((_, el) => {
        var _a;
        const card = $(el);
        let link = card.find("a.lnk-blk[href]").attr("href") || card.find(".action-overlay a[href]").attr("href") || card.find("a[href]").first().attr("href") || "";
        if (!link) return;
        link = resolveUrl(link);
        if (seen.has(link)) return;
        let rawTitle = card.find("h2.entry-title").first().text().trim() || card.find(".entry-title").first().text().trim() || ((_a = card.find("img").attr("alt")) == null ? void 0 : _a.trim()) || card.find("p[style*='medium']").first().text().trim() || card.find("a[href]").last().text().trim() || "";
        if (!rawTitle) return;
        let title = rawTitle.replace(/^Image\s+/, "").trim();
        if (title.startsWith("Image ")) {
          title = title.substring(6).trim();
        }
        let img = card.find("img").attr("data-src") || card.find("img").attr("src") || "";
        const image = img ? resolveUrl(img) : "";
        seen.add(link);
        catalog2.push({ title, link, image });
      });
      const limit = page === 1 ? 20 : 100;
      return catalog2.slice(0, limit);
    } catch (err) {
      console.error(
        "Animesalt fetchPosts error:",
        err instanceof Error ? err.message : String(err)
      );
      return [];
    }
  });
}
var defaultHeaders;
var init_posts = __esm({
  "providers/animeworld/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    defaultHeaders = {
      Referer: "https://www.google.com",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Pragma: "no-cache",
      "Cache-Control": "no-cache"
    };
  }
});

// providers/animeworld/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var headers, getMeta;
var init_meta = __esm({
  "providers/animeworld/meta.ts"() {
    "use strict";
    headers = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,signed-exchange;v=b3;q=0.7",
      "Cache-Control": "no-store",
      "Accept-Language": "en-US,en;q=0.9",
      DNT: "1",
      Cookie: "xla=s4t; _ga=GA1.1.1081149560.1756378968; _ga_BLZGKYN5PF=GS2.1.s1756378968$o1$g1$t1756378984$j44$l0$h0",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    };
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        const empty = {
          title: "",
          synopsis: "",
          image: "",
          imdbId: "",
          type: "series",
          linkList: []
        };
        try {
          const response = yield axios.get(link, { headers });
          const $ = cheerio.load(response.data);
          const result = {
            title: "",
            synopsis: "",
            image: "",
            imdbId: "",
            type: "series",
            linkList: []
          };
          result.title = $(".dfxb.alg-cr .entry-title").text().trim() || $("h1.entry-title").first().text().trim() || $("h1.post-title").first().text().trim() || $("title").text().trim();
          let image = $(".dfxb.alg-cr img[alt]").attr("src") || $("figure img").first().attr("src") || "";
          if (image.startsWith("//")) image = "https:" + image;
          result.image = image;
          result.synopsis = $(".description p").text().trim() || $(".entry-content p").first().text().trim();
          const isMovie = link.includes("/movies/") || link.includes("/movie/");
          if (isMovie) {
            result.type = "movie";
            result.linkList.push({
              title: result.title || "Play Movie",
              quality: "Movie",
              episodesLink: link,
              // play button uses the same page link
              directLinks: []
            });
          } else {
            result.type = "series";
            const seasonSet = /* @__PURE__ */ new Set();
            $(".choose-season .aa-cnt li a").each((_, el) => {
              const s = parseInt($(el).attr("data-season") || "", 10);
              if (!isNaN(s) && s > 0) seasonSet.add(s);
            });
            $("#episode_by_temp .post.episodes").each((_, el) => {
              const numEpi = $(el).find(".num-epi").text().trim();
              const match = numEpi.match(/(\d+)x(\d+)/);
              if (match) seasonSet.add(parseInt(match[1], 10));
            });
            const seasons = Array.from(seasonSet).sort((a, b) => a - b);
            if (seasons.length > 0) {
              for (const s of seasons) {
                result.linkList.push({
                  title: `Season ${s}`,
                  quality: `S${s}`,
                  episodesLink: `watchanimeworld://season?url=${encodeURIComponent(
                    link
                  )}&season=${s}`,
                  directLinks: []
                });
              }
            } else {
              result.linkList.push({
                title: result.title || "Watch",
                quality: "Series",
                episodesLink: link,
                directLinks: []
              });
            }
          }
          return result;
        } catch (err) {
          console.log("Meta error:", err);
          return empty;
        }
      });
    };
  }
});

// providers/extractors/abbasy.ts
function buildPlaybackHeaders() {
  return {
    "User-Agent": UA,
    Accept: "*/*",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
    Referer: "https://playhydrax.com/"
  };
}
function makeAbsolute(url, base) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const b = new URL(base);
  if (url.startsWith("/")) return `${b.protocol}//${b.host}${url}`;
  return `${b.protocol}//${b.host}/${url}`;
}
function fetchCuidCookie(axios) {
  return __async(this, null, function* () {
    var _a;
    try {
      const res = yield axios.post(
        "https://meatusbyway.cfd/cuid/?f=https%3A%2F%2Fwatchanimeworld.one",
        "{}",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Origin: "https://watchanimeworld.one",
            Referer: "https://watchanimeworld.one/",
            "User-Agent": UA
          },
          timeout: 5e3
          // ↓ from 10s — fail fast if down
        }
      );
      const key = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.key;
      return key ? `a97fa794a0f9=${key}` : "";
    } catch (e) {
      return "";
    }
  });
}
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    let rejectedCount = 0;
    if (promises.length === 0) return reject(new Error("Empty promise array"));
    promises.forEach((p) => {
      Promise.resolve(p).then(resolve, () => {
        rejectedCount++;
        if (rejectedCount === promises.length) {
          reject(new Error("All promises rejected"));
        }
      });
    });
  });
}
function parseConfigLangs(pageHtml) {
  const out = [];
  const m = pageHtml.match(/var CONFIG = (\{[\s\S]*?\});/);
  if (!m) return out;
  try {
    const config = JSON.parse(m[1]);
    const ready = config.ready || {};
    const langMap = config.lang || {};
    for (const code of Object.keys(ready)) {
      const info = langMap[code] || {};
      out.push({
        code,
        name: info.name || code,
        short: info.short || code.slice(0, 2).toUpperCase(),
        slug: ready[code]
      });
    }
  } catch (e) {
    console.warn("[abbasy] CONFIG parse failed", e);
  }
  return out;
}
function fetchSourcesForSlug(slug, cuidCookie, axios) {
  return __async(this, null, function* () {
    const playerUrl = `https://player.abyssplayer.com/${slug}`;
    const playerRes = yield axios.get(playerUrl, {
      headers: __spreadValues({
        "User-Agent": UA,
        Referer: "https://watchanimeworld.one/"
      }, cuidCookie ? { Cookie: cuidCookie } : {}),
      timeout: 8e3
      // ↓ from default
    });
    const playerHtml = playerRes.data;
    const datasMatch = playerHtml.match(
      /const\s+datas\s*=\s*["']([A-Za-z0-9+/=]+)["']/
    );
    if (!datasMatch) return [];
    const datasBlob = datasMatch[1];
    const apiUrl = "https://enc-dec.app/api/dec-abyss";
    const payloads = [
      { data: datasBlob },
      { datas: datasBlob },
      { text: datasBlob },
      { url: playerUrl },
      { slug }
    ];
    const apiRes = yield promiseAny(
      payloads.map(
        (p) => axios.post(apiUrl, p, {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": UA,
            Referer: "https://enc-dec.app/"
          },
          timeout: 1e4
        }).then((r) => {
          if (!(r == null ? void 0 : r.data)) throw new Error("empty");
          return r;
        })
      )
    ).catch(() => null);
    if (!(apiRes == null ? void 0 : apiRes.data)) return [];
    const data = apiRes.data;
    const sources = [];
    if ((data == null ? void 0 : data.result) && Array.isArray(data.result.sources)) {
      sources.push(...data.result.sources);
    } else if (Array.isArray(data == null ? void 0 : data.sources)) {
      sources.push(...data.sources);
    } else if (Array.isArray(data)) {
      sources.push(...data);
    }
    return sources;
  });
}
function abyssExtractor(link, _signal, axios, _cheerio, headers3, _providerContext) {
  return __async(this, null, function* () {
    const streamLinks = [];
    const t0 = Date.now();
    try {
      let pageUrl = link;
      if (!pageUrl.startsWith("http")) {
        pageUrl = makeAbsolute(pageUrl, "https://watchanimeworld.one/");
      }
      console.log(`[abbasy] \u2192 ${pageUrl}`);
      const cuidPromise = fetchCuidCookie(axios);
      let langs = [];
      if (pageUrl.includes("player.abyssplayer.com")) {
        const slug = pageUrl.split("/").pop() || "";
        langs = [{ code: "und", name: "Unknown", short: "UN", slug }];
      } else {
        const pageRes = yield axios.get(pageUrl, {
          headers: {
            "User-Agent": UA,
            Referer: "https://watchanimeworld.one/",
            Origin: "https://watchanimeworld.one"
          },
          timeout: 8e3
        });
        langs = parseConfigLangs(pageRes.data);
      }
      if (!langs.length) {
        return [
          {
            server: "AbyssPlayer",
            link: pageUrl,
            type: "iframe",
            headers: {},
            subtitles: []
          }
        ];
      }
      const cuidCookie = yield cuidPromise;
      const langsWithSources = yield Promise.all(
        langs.map((lang) => __async(null, null, function* () {
          try {
            const sources = yield fetchSourcesForSlug(
              lang.slug,
              cuidCookie,
              axios
            );
            return { lang, sources };
          } catch (e) {
            console.warn(`[abbasy] ${lang.name} failed:`, e);
            return { lang, sources: [] };
          }
        }))
      );
      const codecRank = (c) => (c == null ? void 0 : c.toLowerCase()) === "h264" ? 0 : 1;
      const resRank = (t) => parseInt((t == null ? void 0 : t.replace(/[^\d]/g, "")) || "0", 10);
      const playbackHeaders = buildPlaybackHeaders();
      for (const { lang, sources } of langsWithSources) {
        if (!sources.length) continue;
        sources.sort(
          (a, b) => codecRank(a.codec) - codecRank(b.codec) || resRank(a.type) - resRank(b.type)
        );
        for (const src of sources) {
          if (!(src == null ? void 0 : src.url) || src.status === false) continue;
          const srcLang = src.language || src.lang || src.audio_lang || lang.name;
          const srcLangShort = src.language_short || src.lang_short || lang.short;
          streamLinks.push({
            server: `AbyssPlayer (${srcLang})`,
            link: src.url,
            type: src.url.includes(".m3u8") ? "m3u8" : "mp4",
            headers: playbackHeaders,
            subtitles: [],
            quality: `${srcLangShort} \xB7 ${src.type || "auto"}${src.codec ? ` \xB7 ${src.codec}` : ""}`
          });
        }
      }
      if (!streamLinks.length) {
        streamLinks.push({
          server: "AbyssPlayer",
          link: `https://player.abyssplayer.com/${langs[0].slug}`,
          type: "iframe",
          headers: {},
          subtitles: []
        });
      }
      console.log(
        `[abbasy] ${streamLinks.length} streams in ${Date.now() - t0}ms`
      );
      return streamLinks;
    } catch (err) {
      console.error("[abbasy] error:", (err == null ? void 0 : err.message) || err);
      return [];
    }
  });
}
var UA;
var init_abbasy = __esm({
  "providers/extractors/abbasy.ts"() {
    "use strict";
    UA = "Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36";
  }
});

// providers/extractors/zypter.ts
function zypterExtractor(link, signal, axios, cheerio, headers3, providerContext) {
  return __async(this, null, function* () {
    var _a, _b;
    const streamLinks = [];
    try {
      const dataMatch = link.match(/\/video\/([a-zA-Z0-9_-]+)/) || link.match(/\/([a-zA-Z0-9_-]+)\/?$/);
      const dataId = dataMatch ? dataMatch[1] : link.split("/").filter(Boolean).pop();
      if (!dataId) {
        console.warn("[zypter] no data ID in URL");
        return [];
      }
      const urlObj = new URL(link);
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      const apiUrl = `${baseUrl}/player/index.php?data=${dataId}&do=getVideo`;
      const apiHeaders = {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: baseUrl,
        Referer: link,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest"
      };
      const body = new URLSearchParams({ hash: dataId, r: baseUrl });
      const apiRes = yield axios.post(apiUrl, body, {
        headers: apiHeaders,
        timeout: 1e4
      });
      const streamUrl = ((_a = apiRes == null ? void 0 : apiRes.data) == null ? void 0 : _a.securedLink) || ((_b = apiRes == null ? void 0 : apiRes.data) == null ? void 0 : _b.videoSource);
      if (!streamUrl) {
        console.warn("[zypter] no stream in response");
        return [];
      }
      streamLinks.push({
        server: "ZephyrFlick",
        link: streamUrl,
        type: streamUrl.includes(".m3u8") ? "m3u8" : "mp4",
        headers: {
          Referer: baseUrl,
          Origin: baseUrl,
          "User-Agent": apiHeaders["User-Agent"]
        },
        subtitles: []
      });
      console.log(`[zypter] queued ${streamUrl.slice(0, 80)}\u2026`);
      return streamLinks;
    } catch (err) {
      console.error("[zypter] error:", (err == null ? void 0 : err.message) || err);
      return [];
    }
  });
}
var init_zypter = __esm({
  "providers/extractors/zypter.ts"() {
    "use strict";
  }
});

// providers/animeworld/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function makeAbsolute2(url, base) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const b = new URL(base);
  if (url.startsWith("/")) return `${b.protocol}//${b.host}${url}`;
  return `${b.protocol}//${b.host}/${url}`;
}
var getEpisodeStreams, getStream;
var init_stream = __esm({
  "providers/animeworld/stream.ts"() {
    "use strict";
    init_abbasy();
    init_zypter();
    getEpisodeStreams = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        const { axios, cheerio, commonHeaders: headers3 } = providerContext;
        const t0 = Date.now();
        try {
          const res = yield axios.get(url, { headers: headers3, timeout: 8e3 });
          const $ = cheerio.load(res.data);
          const iframeUrls = [];
          const pick = (sel) => {
            const f = $(sel);
            if (!f.length) return;
            const src = f.attr("data-src") || f.attr("src") || "";
            if (src) iframeUrls.push(makeAbsolute2(src, url));
          };
          pick("#options-0 iframe");
          pick("#options-1 iframe");
          if (!iframeUrls.length) {
            return [
              {
                server: "Episode",
                link: url,
                type: "iframe",
                headers: {},
                subtitles: []
              }
            ];
          }
          const signal = new AbortController().signal;
          const results = yield Promise.allSettled(
            iframeUrls.map(
              (u) => u.includes("zephyrix.org") || u.includes("zephyr") ? zypterExtractor(u, signal, axios, cheerio, headers3, providerContext) : abyssExtractor(u, signal, axios, cheerio, headers3, providerContext)
            )
          );
          const merged = [];
          for (const r of results) {
            if (r.status === "fulfilled" && Array.isArray(r.value)) {
              merged.push(...r.value);
            }
          }
          console.log(`[episode] ${merged.length} streams in ${Date.now() - t0}ms`);
          if (!merged.length) {
            return [
              {
                server: "Episode",
                link: iframeUrls[0] || url,
                type: "iframe",
                headers: {},
                subtitles: []
              }
            ];
          }
          return merged;
        } catch (err) {
          console.error("[episode] error:", (err == null ? void 0 : err.message) || err);
          return [
            {
              server: "Episode",
              link: url,
              type: "iframe",
              headers: {},
              subtitles: []
            }
          ];
        }
      });
    };
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: url,
        providerContext
      }) {
        console.log("[getStream]", url);
        const { axios, cheerio, commonHeaders: headers3 } = providerContext;
        const signal = new AbortController().signal;
        if (url.includes("/episode/") || url.includes("/movies/") || url.includes("/movie/")) {
          return getEpisodeStreams({ url, providerContext });
        }
        if (url.includes("zephyrix.org") || url.includes("zephyr")) {
          return zypterExtractor(url, signal, axios, cheerio, headers3, providerContext);
        }
        if (url.includes("dub-player") || url.includes("abyssplayer") || url.includes("watchanimeworld.one/dub-player")) {
          return abyssExtractor(url, signal, axios, cheerio, headers3, providerContext);
        }
        return zypterExtractor(url, signal, axios, cheerio, headers3, providerContext);
      });
    };
  }
});

// providers/animeworld/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var headers2, getEpisodes;
var init_episodes = __esm({
  "providers/animeworld/episodes.ts"() {
    "use strict";
    headers2 = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    };
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        var _a;
        const { axios, cheerio } = providerContext;
        let pageUrl = url;
        let targetSeason = 0;
        let isMovie = false;
        if (url.startsWith("watchanimeworld://movie")) {
          try {
            const u = new URL(url);
            pageUrl = decodeURIComponent(u.searchParams.get("url") || "");
            isMovie = true;
          } catch (e) {
            console.log("getEpisodes: failed to parse movie URL", e);
            return [];
          }
        } else if (url.startsWith("watchanimeworld://season")) {
          try {
            const u = new URL(url);
            pageUrl = decodeURIComponent(u.searchParams.get("url") || "");
            targetSeason = parseInt(u.searchParams.get("season") || "0", 10);
          } catch (e) {
            console.log("getEpisodes: failed to parse season URL", e);
            return [];
          }
        } else {
          if (url.includes("/movies/") || url.includes("/movie/")) {
            isMovie = true;
            pageUrl = url;
          }
        }
        if (!pageUrl) {
          console.log("getEpisodes: missing page URL");
          return [];
        }
        console.log(
          `getEpisodes: fetching ${pageUrl}, ${isMovie ? "MOVIE" : `season: ${targetSeason || "all"}`}`
        );
        try {
          const res = yield axios.get(pageUrl, { headers: headers2 });
          const $ = cheerio.load(res.data);
          const origin = new URL(pageUrl).origin;
          if (isMovie) {
            const movieLinks = [];
            const SERVER_SELECTORS = [
              ".server-list li a",
              ".servers-list li a",
              "ul#player-list li a",
              ".mirror",
              ".play-button a",
              ".player-options li a",
              ".options-list li a"
            ];
            SERVER_SELECTORS.forEach((sel) => {
              $(sel).each((_, el) => {
                var _a2;
                const href = $(el).attr("href") || $(el).attr("data-url") || "";
                if (!href) return;
                const full = href.startsWith("http") ? href : new URL(href, pageUrl).href;
                if (full === pageUrl || full.endsWith("#")) return;
                const label = $(el).text().trim() || ((_a2 = $(el).attr("title")) == null ? void 0 : _a2.trim()) || "Play Movie";
                if (!movieLinks.find((m) => m.link === full)) {
                  movieLinks.push({ title: label, link: full });
                }
              });
            });
            if (movieLinks.length === 0) {
              movieLinks.push({
                title: "Play",
                link: pageUrl
              });
            }
            console.log(`getEpisodes: found ${movieLinks.length} movie links`);
            return movieLinks;
          }
          const postId = $(".choose-season .aa-cnt li a[data-post]").first().attr("data-post") || ((_a = $("article.post").attr("id")) == null ? void 0 : _a.replace("post-", "")) || "";
          let episodes = [];
          if (postId && targetSeason) {
            try {
              const ajaxUrl = `${origin}/wp-admin/admin-ajax.php`;
              const form = new URLSearchParams();
              form.append("action", "action_select_season");
              form.append("post", postId);
              form.append("season", String(targetSeason));
              const ajaxRes = yield axios.post(ajaxUrl, form.toString(), {
                headers: __spreadProps(__spreadValues({}, headers2), {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Referer: pageUrl,
                  "X-Requested-With": "XMLHttpRequest"
                })
              });
              let ajaxHtml = "";
              const data = ajaxRes.data;
              if (typeof data === "string") {
                ajaxHtml = data;
              } else if (data && typeof data === "object") {
                ajaxHtml = data.data || data.html || data.episodes || "";
                if (typeof ajaxHtml !== "string") ajaxHtml = "";
              }
              if (ajaxHtml.trim()) {
                const $$ = cheerio.load(ajaxHtml);
                $$("li").each((_, el) => {
                  const $li = $$(el);
                  const article = $li.find("article.episodes");
                  const $art = article.length ? article : $li;
                  const href = $art.find("a.lnk-blk").attr("href") || $art.find("a").first().attr("href");
                  if (!href) return;
                  const numEpi = $art.find(".num-epi").text().trim();
                  const match = numEpi.match(/(\d+)x(\d+)/);
                  if (!match) return;
                  const season = parseInt(match[1], 10);
                  const epNum = parseInt(match[2], 10);
                  if (targetSeason && season !== targetSeason) return;
                  episodes.push({
                    title: `Episode ${epNum}`,
                    link: href.startsWith("http") ? href : new URL(href, pageUrl).href
                  });
                });
              }
            } catch (ajaxErr) {
              console.log("getEpisodes: AJAX attempt failed:", ajaxErr);
            }
          }
          if (episodes.length === 0) {
            $("#episode_by_temp li").each((_, el) => {
              const article = $(el).find("article.episodes");
              if (!article.length) return;
              const href = article.find("a.lnk-blk").attr("href");
              if (!href) return;
              const numEpi = article.find(".num-epi").text().trim();
              const match = numEpi.match(/(\d+)x(\d+)/);
              if (!match) return;
              const season = parseInt(match[1], 10);
              const epNum = parseInt(match[2], 10);
              if (targetSeason && season !== targetSeason) return;
              episodes.push({
                title: `Episode ${epNum}`,
                link: href.startsWith("http") ? href : new URL(href, pageUrl).href
              });
            });
          }
          episodes.sort((a, b) => {
            var _a2, _b;
            const na = parseInt(((_a2 = a.title.match(/\d+/)) == null ? void 0 : _a2[0]) || "0", 10);
            const nb = parseInt(((_b = b.title.match(/\d+/)) == null ? void 0 : _b[0]) || "0", 10);
            return na - nb;
          });
          console.log(
            `getEpisodes: found ${episodes.length} episodes for season ${targetSeason}`
          );
          return episodes;
        } catch (err) {
          console.log("getEpisodes error:", err);
          return [];
        }
      });
    };
  }
});

// providers/animeworld/animeworld.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
