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

// providers/kickAssAnime/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/kickAssAnime/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Trending", filter: "/api/show/trending" },
      { title: "Popular", filter: "/api/show/popular" },
      { title: "Recent (Sub)", filter: "/api/show/recent?type=sub" },
      { title: "Recent (Dub)", filter: "/api/show/recent?type=dub" },
      { title: "Recent (Chinese)", filter: "/api/show/recent?type=chinese" },
      { title: "All Anime", filter: "/api/anime" }
    ];
    genres = [
      { title: "Action", filter: "Action" },
      { title: "Adventure", filter: "Adventure" },
      { title: "Comedy", filter: "Comedy" },
      { title: "Drama", filter: "Drama" },
      { title: "Ecchi", filter: "Ecchi" },
      { title: "Fantasy", filter: "Fantasy" },
      { title: "Horror", filter: "Horror" },
      { title: "Mahou Shoujo", filter: "Mahou Shoujo" },
      { title: "Mecha", filter: "Mecha" },
      { title: "Music", filter: "Music" },
      { title: "Mystery", filter: "Mystery" },
      { title: "Psychological", filter: "Psychological" },
      { title: "Romance", filter: "Romance" },
      { title: "Sci-Fi", filter: "Sci-Fi" },
      { title: "Slice of Life", filter: "Slice of Life" },
      { title: "Sports", filter: "Sports" },
      { title: "Supernatural", filter: "Supernatural" },
      { title: "Suspense", filter: "Suspense" },
      { title: "Thriller", filter: "Thriller" }
    ];
  }
});

// providers/kickAssAnime/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function formatPoster(poster) {
  if (!poster) return "";
  if (poster.hq) return `${BASE_URL}/image/poster/${poster.hq}.webp`;
  if (poster.sm) return `${BASE_URL}/image/poster/${poster.sm}.webp`;
  if (poster.url) return poster.url.startsWith("http") ? poster.url : `${BASE_URL}/${poster.url}`;
  return "";
}
var BASE_URL, headers, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/kickAssAnime/posts.ts"() {
    "use strict";
    BASE_URL = "https://kaa.lt";
    headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*"
    };
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page = 1,
        providerContext
      }) {
        var _a;
        const { axios } = providerContext;
        let url = `${BASE_URL}${filter}`;
        if (filter.includes("/api/show/trending")) {
          url = `${BASE_URL}/api/show/trending?page=${page}`;
        } else if (filter.includes("/api/show/popular")) {
          url = `${BASE_URL}/api/show/popular?page=${page}`;
        } else if (filter.includes("/api/show/recent")) {
          const typeMatch = filter.match(/type=([a-z]+)/);
          const type = typeMatch ? typeMatch[1] : "all";
          url = `${BASE_URL}/api/show/recent?type=${type}&page=${page}`;
        } else if (filter.startsWith("/api/anime")) {
          url = `${BASE_URL}/api/anime?page=${page}`;
        } else {
          const encoded = btoa(JSON.stringify({ genres: [filter] }));
          url = `${BASE_URL}/api/anime?page=${page}&filters=${encoded}`;
        }
        const res = yield axios.get(url, { headers });
        const list = ((_a = res.data) == null ? void 0 : _a.result) || [];
        return list.map((item) => ({
          title: item.title_en || item.title || "",
          link: `${BASE_URL}/${item.slug}`,
          image: formatPoster(item.poster)
        }));
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page = 1,
        providerContext
      }) {
        var _a;
        const { axios } = providerContext;
        const res = yield axios.post(
          `${BASE_URL}/api/fsearch`,
          {
            page,
            query: searchQuery
          },
          {
            headers: __spreadProps(__spreadValues({}, headers), {
              "Content-Type": "application/json",
              Referer: `${BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`
            })
          }
        );
        const list = ((_a = res.data) == null ? void 0 : _a.result) || [];
        return list.map((item) => ({
          title: item.title_en || item.title || "",
          link: `${BASE_URL}/${item.slug}`,
          image: formatPoster(item.poster)
        }));
      });
    };
  }
});

// providers/kickAssAnime/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function formatPoster2(poster) {
  if (!poster) return "";
  if (poster.hq) return `${BASE_URL2}/image/poster/${poster.hq}.webp`;
  if (poster.sm) return `${BASE_URL2}/image/poster/${poster.sm}.webp`;
  if (poster.url) return poster.url.startsWith("http") ? poster.url : `${BASE_URL2}/${poster.url}`;
  return "";
}
function formatThumbnail(thumbnail) {
  if (!thumbnail) return void 0;
  if (thumbnail.hq) return `${BASE_URL2}/image/thumbnail/${thumbnail.hq}.webp`;
  if (thumbnail.sm) return `${BASE_URL2}/image/thumbnail/${thumbnail.sm}.webp`;
  if (thumbnail.url) return thumbnail.url.startsWith("http") ? thumbnail.url : `${BASE_URL2}/${thumbnail.url}`;
  return void 0;
}
function getLangLabel(lang) {
  if (lang === "ja-JP") return "Sub";
  if (lang === "en-US") return "Dub";
  if (lang === "es-419" || lang === "es-ES") return "Spanish";
  if (lang === "ko-KR") return "Korean";
  if (lang === "zh-CN") return "Chinese";
  return lang;
}
var BASE_URL2, headers2, getMeta;
var init_meta = __esm({
  "providers/kickAssAnime/meta.ts"() {
    "use strict";
    BASE_URL2 = "https://kaa.lt";
    headers2 = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*"
    };
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b, _c;
        const { axios } = providerContext;
        const slug = link.replace(/^https?:\/\/[^/]+\//, "").replace(/^\//, "").split("/")[0];
        const detailRes = yield axios.get(`${BASE_URL2}/api/show/${slug}`, { headers: headers2 });
        const data = detailRes.data || {};
        const title = data.title_en || data.title || slug;
        const synopsis = data.synopsis || "";
        const image = formatPoster2(data.poster);
        const type = data.type === "movie" ? "movie" : "series";
        let languages = ["ja-JP"];
        try {
          const langRes = yield axios.get(`${BASE_URL2}/api/show/${slug}/language`, { headers: headers2 });
          if (Array.isArray((_a = langRes.data) == null ? void 0 : _a.result) && langRes.data.result.length > 0) {
            languages = langRes.data.result;
          }
        } catch (e) {
        }
        const linkList = [];
        for (const lang of languages) {
          try {
            const epRes = yield axios.get(`${BASE_URL2}/api/show/${slug}/episodes?page=1&lang=${lang}`, {
              headers: headers2
            });
            let episodes = ((_b = epRes.data) == null ? void 0 : _b.result) || [];
            const pages = ((_c = epRes.data) == null ? void 0 : _c.pages) || [];
            if (pages.length > 1) {
              const remainingPages = yield Promise.all(
                pages.slice(1).map(
                  (_, idx) => axios.get(`${BASE_URL2}/api/show/${slug}/episodes?page=${idx + 2}&lang=${lang}`, { headers: headers2 }).then((r) => {
                    var _a2;
                    return ((_a2 = r.data) == null ? void 0 : _a2.result) || [];
                  }).catch(() => [])
                )
              );
              episodes = episodes.concat(remainingPages.flat());
            }
            if (episodes.length > 0) {
              const directLinks = episodes.map((ep) => {
                const epTitle = `Episode ${ep.episode_string}${ep.title ? ` - ${ep.title}` : ""}`;
                return {
                  title: epTitle,
                  link: JSON.stringify({
                    slug,
                    epSlug: ep.slug,
                    epNum: ep.episode_string,
                    lang
                  }),
                  type,
                  image: formatThumbnail(ep.thumbnail)
                };
              });
              const langLabel = getLangLabel(lang);
              linkList.push({
                title: languages.length > 1 ? `Episodes (${langLabel})` : "Episodes",
                directLinks
              });
            }
          } catch (e) {
          }
        }
        return {
          title,
          synopsis,
          image,
          imdbId: "",
          type,
          linkList,
          webUrl: `${BASE_URL2}/${slug}`
        };
      });
    };
  }
});

// providers/kickAssAnime/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function fixUrl(rawUrl, baseUrl) {
  let trimmed = rawUrl.trim();
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    trimmed = trimmed.replace(/^(https?:)\/\/+/, "$1//");
  } else if (trimmed.startsWith("//")) {
    trimmed = "https:" + trimmed;
  } else if (trimmed.startsWith("/")) {
    try {
      const u = new URL(baseUrl);
      trimmed = `${u.origin}${trimmed}`;
    } catch (e) {
      trimmed = `${BASE_URL3}${trimmed}`;
    }
  }
  return trimmed;
}
var BASE_URL3, defaultHeaders, getStream;
var init_stream = __esm({
  "providers/kickAssAnime/stream.ts"() {
    "use strict";
    BASE_URL3 = "https://kaa.lt";
    defaultHeaders = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*"
    };
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b;
        const { axios } = providerContext;
        let epApiUrl = link;
        if (link.startsWith("{")) {
          try {
            const parsed = JSON.parse(link);
            const { slug, epNum, epSlug } = parsed;
            epApiUrl = `${BASE_URL3}/api/show/${slug}/episode/ep-${epNum}-${epSlug}`;
          } catch (e) {
          }
        }
        let servers = [];
        try {
          const srvRes = yield axios.get(epApiUrl, { headers: defaultHeaders });
          servers = ((_a = srvRes.data) == null ? void 0 : _a.servers) || [];
        } catch (e) {
          return [];
        }
        const streams = [];
        for (const srv of servers) {
          if (!srv.src) continue;
          try {
            const playerUrl = fixUrl(srv.src, BASE_URL3);
            const playerRes = yield axios.get(playerUrl, {
              headers: __spreadProps(__spreadValues({}, defaultHeaders), {
                Referer: `${BASE_URL3}/`
              })
            });
            const html = typeof playerRes.data === "string" ? playerRes.data : JSON.stringify(playerRes.data);
            const cleanHtml = html.replace(/&quot;/g, '"');
            const manifestMatch = cleanHtml.match(/manifest":\[0,"(?:https?:)?(\/\/[^"]+)"]/);
            if (manifestMatch) {
              let rawManifest = manifestMatch[1];
              const manifestUrl = fixUrl(rawManifest, playerUrl);
              let origin = "";
              try {
                origin = new URL(playerUrl).origin;
              } catch (e) {
                origin = BASE_URL3;
              }
              const hlsHeaders = {
                "User-Agent": defaultHeaders["User-Agent"],
                Origin: origin,
                Referer: playerUrl
              };
              const subtitles = [];
              const trackRegex = /"language":\[\d+,"([^"]+)"][^}]+?"name":\[\d+,"([^"]+)"][^}]+?"src":\[\d+,"([^"]+)"]/g;
              let tMatch;
              while ((tMatch = trackRegex.exec(cleanHtml)) !== null) {
                const lang = tMatch[1];
                const subName = tMatch[2];
                let subSrc = tMatch[3].replace(/\\\//g, "/");
                const subUrl = fixUrl(subSrc, playerUrl);
                const proxyUrl = `https://worker.zendax.me/api/fetch?url=${encodeURIComponent(
                  subUrl
                )}&headers=${encodeURIComponent(JSON.stringify(hlsHeaders))}`;
                subtitles.push({
                  title: `${subName} (${lang})`,
                  language: lang,
                  type: "text/vtt",
                  uri: proxyUrl
                });
              }
              if (manifestUrl.includes(".m3u8")) {
                streams.push({
                  server: `${srv.name} (Auto)`,
                  link: manifestUrl,
                  type: "m3u8",
                  quality: "auto",
                  subtitles: subtitles.length > 0 ? subtitles : void 0,
                  headers: hlsHeaders
                });
                try {
                  const m3u8Res = yield axios.get(manifestUrl, { headers: hlsHeaders });
                  const lines = m3u8Res.data.split("\n");
                  const baseUrl = manifestUrl.substring(0, manifestUrl.lastIndexOf("/") + 1);
                  for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith("#EXT-X-STREAM-INF")) {
                      const resMatch = line.match(/RESOLUTION=\d+x(\d+)/);
                      const quality = resMatch ? `${resMatch[1]}p` : "unknown";
                      const nextLine = (_b = lines[i + 1]) == null ? void 0 : _b.trim();
                      if (nextLine && !nextLine.startsWith("#")) {
                        const streamUrl = nextLine.startsWith("http") ? nextLine : baseUrl + nextLine;
                        streams.push({
                          server: `${srv.name} (${quality})`,
                          link: streamUrl,
                          type: "m3u8",
                          quality,
                          subtitles: subtitles.length > 0 ? subtitles : void 0,
                          headers: hlsHeaders
                        });
                      }
                    }
                  }
                } catch (e) {
                }
              } else if (manifestUrl.includes(".mpd")) {
                streams.push({
                  server: `${srv.name} (DASH)`,
                  link: manifestUrl,
                  type: "dash",
                  quality: "auto",
                  subtitles: subtitles.length > 0 ? subtitles : void 0,
                  headers: hlsHeaders
                });
              }
            }
          } catch (e) {
          }
        }
        return streams;
      });
    };
  }
});

// providers/kickAssAnime/kickAssAnime.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
