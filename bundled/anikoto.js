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

// providers/anikoto/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/anikoto/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Popular",
        filter: "/most-viewed"
      },
      {
        title: "Recently Updated",
        filter: "/latest-updated"
      },
      {
        title: "New Releases",
        filter: "/new-release"
      },
      {
        title: "Top Rated",
        filter: "/filter?sort=score"
      },
      {
        title: "Anime Movies",
        filter: "/type/movie"
      },
      {
        title: "Ongoing Anime",
        filter: "/status/currently-airing"
      },
      {
        title: "Completed Anime",
        filter: "/status/finished-airing"
      }
    ];
    genres = [
      { title: "Action", filter: "/genre/action" },
      { title: "Adventure", filter: "/genre/adventure" },
      { title: "Comedy", filter: "/genre/comedy" },
      { title: "Drama", filter: "/genre/drama" },
      { title: "Ecchi", filter: "/genre/ecchi" },
      { title: "Fantasy", filter: "/genre/fantasy" },
      { title: "Horror", filter: "/genre/horror" },
      { title: "Isekai", filter: "/genre/isekai" },
      { title: "Mecha", filter: "/genre/mecha" },
      { title: "Mystery", filter: "/genre/mystery" },
      { title: "Psychological", filter: "/genre/psychological" },
      { title: "Romance", filter: "/genre/romance" },
      { title: "Sci-Fi", filter: "/genre/sci-fi" },
      { title: "Seinen", filter: "/genre/seinen" },
      { title: "Shoujo", filter: "/genre/shoujo" },
      { title: "Shounen", filter: "/genre/shounen" },
      { title: "Slice of Life", filter: "/genre/slice-of-life" },
      { title: "Sports", filter: "/genre/sports" },
      { title: "Supernatural", filter: "/genre/supernatural" },
      { title: "Thriller", filter: "/genre/thriller" }
    ];
  }
});

// providers/anikoto/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var BASE_URL, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/anikoto/posts.ts"() {
    "use strict";
    BASE_URL = "https://anikototv.to";
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        try {
          const { axios, cheerio } = providerContext;
          const delimiter = filter.includes("?") ? "&" : "?";
          const url = `${BASE_URL}${filter}${delimiter}page=${page}`;
          const res = yield axios.get(url, {
            headers: __spreadProps(__spreadValues({}, providerContext.commonHeaders), {
              Referer: `${BASE_URL}/`
            }),
            signal
          });
          const $ = cheerio.load(res.data);
          const posts = [];
          $(".ani.items .item, .items .item, div.item").each((_, el) => {
            const title = $(el).find(".info a.name, .info a.d-title, a.name.d-title").first().text().trim() || $(el).find(".info a.name, a.name.d-title").first().attr("data-jp") || $(el).find("img").attr("alt") || "";
            const linkEl = $(el).find(".info a.name, .info a.d-title, .poster a, a[href*='/watch/']").first();
            let href = linkEl.attr("href") || "";
            if (!href) return;
            if (!href.startsWith("http")) {
              href = `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
            }
            const image = $(el).find("img").attr("src") || "";
            if (title && href) {
              posts.push({
                title,
                link: href,
                image
              });
            }
          });
          return posts;
        } catch (err) {
          console.error("Anikoto getPosts error:", err);
          return [];
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
        try {
          const { axios, cheerio } = providerContext;
          const url = `${BASE_URL}/filter?keyword=${encodeURIComponent(
            searchQuery
          )}&page=${page}`;
          const res = yield axios.get(url, {
            headers: __spreadProps(__spreadValues({}, providerContext.commonHeaders), {
              Referer: `${BASE_URL}/`
            }),
            signal
          });
          const $ = cheerio.load(res.data);
          const posts = [];
          $(".ani.items .item, .items .item, div.item").each((_, el) => {
            const title = $(el).find(".info a.name, .info a.d-title, a.name.d-title").first().text().trim() || $(el).find(".info a.name, a.name.d-title").first().attr("data-jp") || $(el).find("img").attr("alt") || "";
            const linkEl = $(el).find(".info a.name, .info a.d-title, .poster a, a[href*='/watch/']").first();
            let href = linkEl.attr("href") || "";
            if (!href) return;
            if (!href.startsWith("http")) {
              href = `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
            }
            const image = $(el).find("img").attr("src") || "";
            if (title && href) {
              posts.push({
                title,
                link: href,
                image
              });
            }
          });
          return posts;
        } catch (err) {
          console.error("Anikoto getSearchPosts error:", err);
          return [];
        }
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

// providers/anikoto/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function rc4(key, input) {
  const s = Array.from({ length: 256 }, (_, i) => i);
  let a = 0;
  for (let n = 0; n < 256; n++) {
    a = (s[n] + a + key.charCodeAt(n % key.length)) % 256;
    const tmp = s[n];
    s[n] = s[a];
    s[a] = tmp;
  }
  let out = "";
  let n2 = 0;
  let a2 = 0;
  for (let r = 0; r < input.length; r++) {
    n2 = (n2 + 1) % 256;
    a2 = (s[n2] + a2) % 256;
    const tmp2 = s[n2];
    s[n2] = s[a2];
    s[a2] = tmp2;
    const k = s[(s[n2] + s[a2]) % 256];
    out += String.fromCharCode(input.charCodeAt(r) ^ k);
  }
  return out;
}
function encodeVrf(animeId) {
  const encrypted = rc4("simple-hash", animeId);
  return btoa(encrypted);
}
var BASE_URL2, getMeta;
var init_meta = __esm({
  "providers/anikoto/meta.ts"() {
    "use strict";
    init_providerErrors();
    BASE_URL2 = "https://anikototv.to";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b;
        try {
          const { axios, cheerio } = providerContext;
          let watchUrl = link;
          if (!watchUrl.startsWith("http")) {
            watchUrl = `${BASE_URL2}${watchUrl.startsWith("/") ? "" : "/"}${watchUrl}`;
          }
          if (!watchUrl.includes("/ep-")) {
            watchUrl = `${watchUrl.replace(/\/+$/, "")}/ep-1`;
          }
          const slug = watchUrl.replace(BASE_URL2, "").replace(/^\/watch\//, "").split("/")[0];
          const res = yield axios.get(watchUrl, {
            headers: __spreadProps(__spreadValues({}, providerContext.commonHeaders), {
              Referer: `${BASE_URL2}/`
            })
          });
          const $ = cheerio.load(res.data);
          const title = $("h1.title").text().trim() || $(".binfo h1").text().trim() || slug;
          const synopsis = $("div.synopsis div.content").text().trim() || $("div.synopsis").text().trim() || "";
          const image = $("#w-info .poster img, .poster img").first().attr("src") || $("img").first().attr("src") || "";
          const rating = $("[itemprop='ratingValue']").first().text().trim() || ((_a = $(".meta div:contains('MAL'), #w-info div:contains('MAL')").first().text().match(/MAL:\s*(\d+(?:\.\d+)?)/)) == null ? void 0 : _a[1]) || ((_b = $(".score .value").text().match(/\d+(?:\.\d+)?/)) == null ? void 0 : _b[0]) || void 0;
          const tags = [];
          $("div:contains(Genres) span a, .genre a").each((_, el) => {
            const g = $(el).text().trim();
            if (g && !tags.includes(g)) tags.push(g);
          });
          const typeText = $(".meta div:contains(Type) span, .m-item span").first().text().trim().toLowerCase();
          const type = typeText.includes("movie") ? "movie" : "series";
          const animeId = $("#watch-page, #watch-main, .watch-wrap, [data-id]").first().attr("data-id");
          const linkList = [];
          if (animeId) {
            const vrf = encodeURIComponent(encodeVrf(animeId));
            const epAjaxUrl = `${BASE_URL2}/ajax/episode/list/${animeId}?vrf=${vrf}&style=default`;
            const epRes = yield axios.get(epAjaxUrl, {
              headers: __spreadProps(__spreadValues({}, providerContext.commonHeaders), {
                "X-Requested-With": "XMLHttpRequest",
                Referer: watchUrl
              })
            });
            if (epRes.data && epRes.data.status === 200 && epRes.data.result) {
              const $ep = cheerio.load(epRes.data.result);
              const epElements = $ep(
                "ul.ep-range a, .ep-range a, .range a, a[data-ids]"
              );
              const directLinks = [];
              epElements.each((_, el) => {
                const num = $ep(el).attr("data-num") || "";
                if (!num) return;
                const dataIds = $ep(el).attr("data-ids") || "";
                const malId = $ep(el).attr("data-mal") || "";
                const timestamp = $ep(el).attr("data-timestamp") || "";
                const hasSub = $ep(el).attr("data-sub") === "1";
                const hasDub = $ep(el).attr("data-dub") === "1";
                let epTitle = $ep(el).attr("title") || `Episode ${num}`;
                directLinks.push({
                  title: epTitle,
                  link: JSON.stringify({
                    slug,
                    epNum: num,
                    dataIds,
                    malId,
                    timestamp,
                    hasSub,
                    hasDub,
                    title: epTitle
                  })
                });
              });
              if (directLinks.length > 0) {
                linkList.push({
                  title,
                  directLinks
                });
              }
            }
          }
          if (linkList.length === 0) {
            linkList.push({
              title,
              directLinks: [
                {
                  title: type === "movie" ? "Movie" : "Episode 1",
                  link: JSON.stringify({
                    slug,
                    epNum: "1",
                    dataIds: "",
                    malId: "",
                    timestamp: "",
                    hasSub: true,
                    hasDub: false,
                    title
                  })
                }
              ]
            });
          }
          return {
            title,
            synopsis,
            image,
            imdbId: "",
            type,
            tags: tags.length > 0 ? tags : void 0,
            rating,
            linkList,
            webUrl: watchUrl
          };
        } catch (err) {
          throwProviderError("Anikoto", "metadata", err);
        }
      });
    };
  }
});

// providers/anikoto/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function rc42(key, input) {
  const s = Array.from({ length: 256 }, (_, i) => i);
  let a = 0;
  for (let n = 0; n < 256; n++) {
    a = (s[n] + a + key.charCodeAt(n % key.length)) % 256;
    const tmp = s[n];
    s[n] = s[a];
    s[a] = tmp;
  }
  let out = "";
  let n2 = 0;
  let a2 = 0;
  for (let r = 0; r < input.length; r++) {
    n2 = (n2 + 1) % 256;
    a2 = (s[n2] + a2) % 256;
    const tmp2 = s[n2];
    s[n2] = s[a2];
    s[a2] = tmp2;
    const k = s[(s[n2] + s[a2]) % 256];
    out += String.fromCharCode(input.charCodeAt(r) ^ k);
  }
  return out;
}
function encodeVrf2(animeId) {
  const encrypted = rc42("simple-hash", animeId);
  return btoa(encrypted);
}
function inferLang(label) {
  const l = (label || "").toLowerCase();
  if (l.includes("english") || l.includes("eng")) return "en";
  if (l.includes("spanish") || l.includes("spa")) return "es";
  if (l.includes("french") || l.includes("fra")) return "fr";
  if (l.includes("german") || l.includes("deu")) return "de";
  if (l.includes("portuguese") || l.includes("por")) return "pt";
  if (l.includes("japanese") || l.includes("jpn")) return "ja";
  if (l.includes("chinese") || l.includes("chi") || l.includes("zho")) return "zh";
  if (l.includes("indonesian") || l.includes("ind")) return "id";
  if (l.includes("thai") || l.includes("tha")) return "th";
  if (l.includes("vietnamese") || l.includes("vie")) return "vi";
  if (l.includes("arabic") || l.includes("ara")) return "ar";
  if (l.includes("hindi") || l.includes("hin")) return "hi";
  return "und";
}
var BASE_URL3, defaultHeaders, getStream;
var init_stream = __esm({
  "providers/anikoto/stream.ts"() {
    "use strict";
    init_providerErrors();
    BASE_URL3 = "https://anikototv.to";
    defaultHeaders = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      Accept: "*/*"
    };
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a;
        try {
          const { axios, cheerio } = providerContext;
          const payload = (() => {
            try {
              return JSON.parse(link);
            } catch (e) {
              return { slug: link, epNum: "1" };
            }
          })();
          let { slug, epNum, dataIds } = payload;
          if (!slug) return [];
          const watchUrl = `${BASE_URL3}/watch/${slug}/ep-${epNum || 1}`;
          const headers = __spreadProps(__spreadValues({}, defaultHeaders), {
            Referer: `${BASE_URL3}/`
          });
          if (!dataIds) {
            const detailRes = yield axios.get(watchUrl, { headers });
            const $d = cheerio.load(detailRes.data);
            const animeId = $d(
              "#watch-page, #watch-main, .watch-wrap, [data-id]"
            ).first().attr("data-id");
            if (animeId) {
              const vrf = encodeURIComponent(encodeVrf2(animeId));
              const epRes = yield axios.get(
                `${BASE_URL3}/ajax/episode/list/${animeId}?vrf=${vrf}&style=default`,
                {
                  headers: __spreadProps(__spreadValues({}, headers), {
                    "X-Requested-With": "XMLHttpRequest",
                    Referer: watchUrl
                  })
                }
              );
              if ((_a = epRes.data) == null ? void 0 : _a.result) {
                const $ep = cheerio.load(epRes.data.result);
                const epEl = $ep(
                  `ul.ep-range a[data-num="${epNum}"], .ep-range a[data-num="${epNum}"], a[data-ids]`
                ).first();
                dataIds = epEl.attr("data-ids") || "";
              }
            }
          }
          if (!dataIds) {
            return [];
          }
          const serverListUrl = `${BASE_URL3}/ajax/server/list?servers=${dataIds}`;
          const srvRes = yield axios.get(serverListUrl, {
            headers: __spreadProps(__spreadValues({}, headers), {
              "X-Requested-With": "XMLHttpRequest",
              Referer: watchUrl
            })
          });
          if (!srvRes.data || srvRes.data.status !== 200 || !srvRes.data.result) {
            return [];
          }
          const $s = cheerio.load(srvRes.data.result);
          const tasks = [];
          const seenLinkIds = /* @__PURE__ */ new Set();
          $s("div.type, .server-type, div.types > div.type").each((_, typeEl) => {
            const dataType = $s(typeEl).attr("data-type") || "sub";
            $s(typeEl).find("[data-link-id]").each((_2, sEl) => {
              const linkId = $s(sEl).attr("data-link-id") || "";
              const serverName = $s(sEl).text().trim() || "Server";
              if (linkId && !seenLinkIds.has(linkId)) {
                seenLinkIds.add(linkId);
                tasks.push({ dataType, serverName, linkId });
              }
            });
          });
          const streams = [];
          const seenIframeUrls = /* @__PURE__ */ new Set();
          const seenStreamLinks = /* @__PURE__ */ new Set();
          const addStream = (stream) => {
            if (!stream.link || seenStreamLinks.has(stream.link)) return;
            seenStreamLinks.add(stream.link);
            streams.push(stream);
          };
          yield Promise.all(
            tasks.map((task) => __async(null, null, function* () {
              var _a2, _b, _c, _d, _e, _f, _g, _h;
              try {
                const getUrl = `${BASE_URL3}/ajax/server?get=${encodeURIComponent(
                  task.linkId
                )}`;
                const getRes = yield axios.get(getUrl, {
                  headers: __spreadProps(__spreadValues({}, headers), {
                    "X-Requested-With": "XMLHttpRequest",
                    Referer: watchUrl
                  }),
                  timeout: 8e3
                });
                const iframeUrl = (_b = (_a2 = getRes.data) == null ? void 0 : _a2.result) == null ? void 0 : _b.url;
                if (!iframeUrl) return;
                const skipTimings = yield (_c = providerContext.kvStore) == null ? void 0 : _c.get("anikoto_skipTimings");
                const skipTimingsEnabled = skipTimings != null ? skipTimings : true;
                let skipIntervals = void 0;
                if (skipTimingsEnabled) {
                  const skipData = (_e = (_d = getRes.data) == null ? void 0 : _d.result) == null ? void 0 : _e.skip_data;
                  if (skipData && typeof skipData === "object") {
                    const intervals = [];
                    if (Array.isArray(skipData.intro) && skipData.intro.length >= 2) {
                      const from = Number(skipData.intro[0]);
                      const to = Number(skipData.intro[1]);
                      if (!isNaN(from) && !isNaN(to) && to > from) {
                        intervals.push({ title: "Intro", from, to });
                      }
                    }
                    if (Array.isArray(skipData.outro) && skipData.outro.length >= 2) {
                      const from = Number(skipData.outro[0]);
                      const to = Number(skipData.outro[1]);
                      if (!isNaN(from) && !isNaN(to) && to > from) {
                        intervals.push({ title: "Outro", from, to });
                      }
                    }
                    if (intervals.length > 0) {
                      skipIntervals = intervals;
                    }
                  }
                }
                const baseIframe = iframeUrl.split("?")[0] + "#" + task.dataType;
                if (seenIframeUrls.has(baseIframe)) return;
                seenIframeUrls.add(baseIframe);
                let host = "";
                try {
                  host = new URL(iframeUrl).host;
                } catch (e) {
                  host = ((_f = iframeUrl.split("://")[1]) == null ? void 0 : _f.split("/")[0]) || "";
                }
                const audioLabel = task.dataType.toUpperCase();
                if (host.includes("vidtube") || host.includes("megaplay") || host.includes("vidwish")) {
                  const pageRes = yield axios.get(iframeUrl, {
                    headers: __spreadProps(__spreadValues({}, headers), {
                      Referer: `https://${host}/`,
                      Origin: `https://${host}`
                    }),
                    timeout: 8e3
                  });
                  const matchId = pageRes.data.match(/data-id="(\d+)"/);
                  if (matchId) {
                    const vidtubeDataId = matchId[1];
                    const srcUrl = `https://${host}/stream/getSources?id=${vidtubeDataId}&type=${task.dataType}`;
                    const srcRes = yield axios.get(srcUrl, {
                      headers: __spreadProps(__spreadValues({}, headers), {
                        "X-Requested-With": "XMLHttpRequest",
                        Referer: `https://${host}/`,
                        Origin: `https://${host}`
                      }),
                      timeout: 8e3
                    });
                    const srcData = srcRes.data;
                    if ((_g = srcData == null ? void 0 : srcData.sources) == null ? void 0 : _g.file) {
                      const masterUrl = srcData.sources.file;
                      const streamHeaders = {
                        Referer: `https://${host}/`,
                        Origin: `https://${host}`,
                        "User-Agent": defaultHeaders["User-Agent"]
                      };
                      const subtitles = (srcData.tracks || []).filter((t) => t.file && t.label).map((t) => ({
                        title: t.label,
                        language: inferLang(t.label),
                        type: "text/vtt",
                        uri: `https://worker.zendax.me/api/fetch?url=${encodeURIComponent(
                          t.file
                        )}&headers=${encodeURIComponent(JSON.stringify(streamHeaders))}`
                      }));
                      addStream({
                        server: `${task.serverName} (${audioLabel})`,
                        link: masterUrl,
                        type: "m3u8",
                        quality: "auto",
                        subtitles: subtitles.length > 0 ? subtitles : void 0,
                        headers: streamHeaders,
                        skip: skipIntervals
                      });
                      try {
                        const m3u8Res = yield axios.get(masterUrl, {
                          headers: streamHeaders,
                          timeout: 6e3
                        });
                        const lines = m3u8Res.data.split("\n");
                        const baseUrl = masterUrl.substring(0, masterUrl.lastIndexOf("/") + 1);
                        for (let i = 0; i < lines.length; i++) {
                          const line = lines[i].trim();
                          if (line.startsWith("#EXT-X-STREAM-INF")) {
                            const resMatch = line.match(/RESOLUTION=\d+x(\d+)/);
                            const quality = resMatch ? `${resMatch[1]}p` : "unknown";
                            const nextLine = (_h = lines[i + 1]) == null ? void 0 : _h.trim();
                            if (nextLine && !nextLine.startsWith("#")) {
                              const streamUrl = nextLine.startsWith("http") ? nextLine : baseUrl + nextLine;
                              addStream({
                                server: `${task.serverName} (${audioLabel}) ${quality}`,
                                link: streamUrl,
                                type: "m3u8",
                                quality,
                                subtitles: subtitles.length > 0 ? subtitles : void 0,
                                headers: streamHeaders,
                                skip: skipIntervals
                              });
                            }
                          }
                        }
                      } catch (e) {
                      }
                    }
                  }
                } else if (iframeUrl.includes("#")) {
                  const fragment = iframeUrl.substring(iframeUrl.indexOf("#") + 1);
                  if (fragment) {
                    try {
                      const decoded = atob(fragment);
                      if (decoded.startsWith("http")) {
                        addStream({
                          server: `${task.serverName} (${audioLabel})`,
                          link: decoded,
                          type: "m3u8",
                          headers: {
                            Referer: "https://vibeplayer.site/",
                            Origin: "https://vibeplayer.site",
                            "User-Agent": defaultHeaders["User-Agent"]
                          },
                          skip: skipIntervals
                        });
                      }
                    } catch (e) {
                    }
                  }
                }
              } catch (e) {
              }
            }))
          );
          return streams;
        } catch (err) {
          throwProviderError("Anikoto", "stream", err);
        }
      });
    };
  }
});

// providers/anikoto/anikoto.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
