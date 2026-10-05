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

// providers/animetsu/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/animetsu/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Popular",
        filter: "popular"
      },
      {
        title: "Trending",
        filter: "trending"
      },
      {
        title: "Top Rated",
        filter: "top"
      },
      {
        title: "Seasonal",
        filter: "seasonal"
      }
    ];
    genres = [];
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

// providers/animetsu/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0) {
  return __async(this, arguments, function* ({
    url,
    filter,
    signal,
    axios,
    providerContext,
    headers
  }) {
    var _a, _b, _c;
    const baseUrl = "https://animetsu.net";
    const { openWebView } = providerContext;
    try {
      let cookies;
      let res;
      try {
        res = yield axios.get(url, {
          signal,
          headers: __spreadProps(__spreadValues({}, headers), {
            Referer: baseUrl
          })
        });
      } catch (error) {
        if (((_a = error.response) == null ? void 0 : _a.status) === 403) {
          const wafResult = yield openWebView(baseUrl, {
            title: "Solve the captcha below and click done",
            description: "Required to bypass Animetsu anti-bot protection.",
            headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl }),
            force: true,
            waitForCookie: "cf_clearance"
          });
          cookies = wafResult.cookies;
          res = yield axios.get(url, {
            signal,
            headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl, Cookie: cookies })
          });
        } else {
          throw error;
        }
      }
      const data = filter ? (_b = res.data) == null ? void 0 : _b[filter] : ((_c = res.data) == null ? void 0 : _c.results) || res.data;
      const catalog2 = [];
      data == null ? void 0 : data.map((element) => {
        var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j, _k;
        const title = ((_a2 = element.title) == null ? void 0 : _a2.english) || ((_b2 = element.title) == null ? void 0 : _b2.romaji) || ((_c2 = element.title) == null ? void 0 : _c2.native);
        const link = (_d = element.id) == null ? void 0 : _d.toString();
        const image = ((_e = element.cover_image) == null ? void 0 : _e.large) || ((_f = element.cover_image) == null ? void 0 : _f.extraLarge) || ((_g = element.cover_image) == null ? void 0 : _g.medium) || ((_h = element.cover_image) == null ? void 0 : _h.small) || ((_i = element.coverImage) == null ? void 0 : _i.large) || ((_j = element.coverImage) == null ? void 0 : _j.extraLarge) || ((_k = element.coverImage) == null ? void 0 : _k.medium);
        if (title && link && image) {
          catalog2.push({
            title,
            link,
            image
          });
        }
      });
      return catalog2;
    } catch (err) {
      throwProviderError(
        "AnimeTsu",
        filter === void 0 ? "search posts" : "posts",
        err
      );
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/animetsu/posts.ts"() {
    "use strict";
    init_providerErrors();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        if (page > 1) {
          return [];
        }
        const { axios, commonHeaders } = providerContext;
        const baseUrl = "https://animetsu.net";
        const url = `${baseUrl}/v2/api/anime/home`;
        return posts({
          url,
          filter,
          signal,
          axios,
          providerContext,
          headers: commonHeaders
        });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        const { axios, commonHeaders } = providerContext;
        const baseUrl = "https://animetsu.net";
        const url = `${baseUrl}/v2/api/anime/search/?query=${encodeURIComponent(
          searchQuery
        )}`;
        return posts({ url, signal, axios, providerContext, headers: commonHeaders });
      });
    };
  }
});

// providers/animetsu/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/animetsu/meta.ts"() {
    "use strict";
    init_providerErrors();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
          const { axios, openWebView, commonHeaders } = providerContext;
          const baseUrl = "https://animetsu.net";
          const url = `${baseUrl}/v2/api/anime/info/${link}`;
          let cookies;
          let res;
          try {
            res = yield axios.get(url, {
              headers: __spreadProps(__spreadValues({}, commonHeaders), { Referer: baseUrl })
            });
          } catch (error) {
            if (((_a = error.response) == null ? void 0 : _a.status) === 403) {
              const wafResult = yield openWebView(baseUrl, {
                title: "Solve the captcha below and click done",
                description: "Required to bypass Animetsu anti-bot protection.",
                headers: __spreadProps(__spreadValues({}, commonHeaders), { Referer: baseUrl }),
                force: true,
                waitForCookie: "cf_clearance"
              });
              cookies = wafResult.cookies;
              res = yield axios.get(url, {
                headers: __spreadProps(__spreadValues({}, commonHeaders), { Referer: baseUrl, Cookie: cookies })
              });
            } else {
              throw error;
            }
          }
          const data = res.data;
          const meta = {
            title: ((_b = data.title) == null ? void 0 : _b.english) || ((_c = data.title) == null ? void 0 : _c.romaji) || ((_d = data.title) == null ? void 0 : _d.native) || "",
            synopsis: data.description || "",
            image: ((_e = data.cover_image) == null ? void 0 : _e.large) || ((_f = data.cover_image) == null ? void 0 : _f.medium) || ((_g = data.cover_image) == null ? void 0 : _g.small) || "",
            tags: [data == null ? void 0 : data.format, data == null ? void 0 : data.status, ...(data == null ? void 0 : data.genres) || []].filter(
              Boolean
            ),
            imdbId: "",
            type: data.format === "MOVIE" ? "movie" : "series"
          };
          const linkList = [];
          const seasons = data.seasons;
          if (seasons && seasons.length > 0) {
            yield Promise.all(
              seasons.map((season) => __async(null, null, function* () {
                var _a2, _b2, _c2;
                const seasonTitle = ((_a2 = season.title) == null ? void 0 : _a2.english) || ((_b2 = season.title) == null ? void 0 : _b2.romaji) || ((_c2 = season.title) == null ? void 0 : _c2.native);
                const directLinks = [];
                try {
                  const epsRes = yield axios.get(
                    `${baseUrl}/v2/api/anime/eps/${season.id}`,
                    {
                      headers: __spreadValues(__spreadProps(__spreadValues({}, commonHeaders), {
                        Referer: baseUrl
                      }), cookies ? { Cookie: cookies } : {})
                    }
                  );
                  const episodes = epsRes.data;
                  if (episodes && episodes.length > 0) {
                    episodes.forEach((ep) => {
                      directLinks.push({
                        title: `Episode ${ep.ep_num}`,
                        link: `${season.id}:${ep.ep_num}`
                      });
                    });
                  }
                } catch (e) {
                  const total = season.total_eps || 1;
                  for (let i = 1; i <= total; i++) {
                    directLinks.push({
                      title: `Episode ${i}`,
                      link: `${season.id}:${i}`
                    });
                  }
                }
                if (directLinks.length > 0) {
                  linkList.push({
                    title: seasonTitle || meta.title,
                    directLinks
                  });
                }
              }))
            );
          } else {
            const total = data.total_eps || 1;
            const directLinks = [];
            for (let i = 1; i <= total; i++) {
              directLinks.push({
                title: total === 1 ? "Movie" : `Episode ${i}`,
                link: `${link}:${i}`
              });
            }
            linkList.push({ title: meta.title, directLinks });
          }
          return __spreadProps(__spreadValues({}, meta), {
            linkList
          });
        } catch (err) {
          throwProviderError("AnimeTsu", "metadata", err);
        }
      });
    };
  }
});

// providers/animetsu/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/animetsu/stream.ts"() {
    "use strict";
    init_providerErrors();
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: id,
        providerContext
      }) {
        var _a;
        try {
          const { axios, openWebView, commonHeaders } = providerContext;
          const baseUrl = "https://animetsu.net";
          const streamUrl = `https://swiftstream.top/proxy`;
          let wafCookies;
          try {
            yield axios.get(baseUrl, {
              headers: __spreadProps(__spreadValues({}, commonHeaders), { Referer: baseUrl })
            });
          } catch (error) {
            if (((_a = error.response) == null ? void 0 : _a.status) === 403) {
              const wafResult = yield openWebView(baseUrl, {
                title: "Solve the captcha below and click done",
                description: "Required to bypass Animetsu anti-bot protection.",
                headers: __spreadProps(__spreadValues({}, commonHeaders), { Referer: baseUrl }),
                force: true,
                waitForCookie: "cf_clearance"
              });
              wafCookies = wafResult.cookies;
            }
          }
          const [animeId, episodeNumber] = id.split(":");
          if (!animeId || !episodeNumber) {
            throw new Error("Invalid link format");
          }
          const servers = ["sage", "dio"];
          const streamLinks = [];
          yield Promise.all(
            servers.map((server) => __async(null, null, function* () {
              try {
                const url = `${baseUrl}/v2/api/anime/oppai/${animeId}/${episodeNumber}?server=${server}&source_type=sub`;
                const res = yield axios.get(url, {
                  headers: __spreadValues(__spreadProps(__spreadValues({}, commonHeaders), {
                    Referer: baseUrl
                  }), wafCookies ? { Cookie: wafCookies } : {})
                });
                if (res.data && res.data.sources) {
                  const subtitles = [];
                  if (res.data.subs && Array.isArray(res.data.subs)) {
                    res.data.subs.forEach((sub) => {
                      if (sub.url && sub.lang) {
                        const langCode = sub.lang.toLowerCase().includes("english") ? "en" : sub.lang.toLowerCase().includes("arabic") ? "ar" : sub.lang.toLowerCase().includes("french") ? "fr" : sub.lang.toLowerCase().includes("german") ? "de" : sub.lang.toLowerCase().includes("italian") ? "it" : sub.lang.toLowerCase().includes("portuguese") ? "pt" : sub.lang.toLowerCase().includes("russian") ? "ru" : sub.lang.toLowerCase().includes("spanish") ? "es" : "und";
                        subtitles.push({
                          title: sub.lang,
                          language: langCode,
                          type: "text/vtt",
                          uri: sub.url
                        });
                      }
                    });
                  }
                  res.data.sources.forEach((source) => {
                    const sourceUrl = source.url.startsWith("/") ? `${streamUrl}${source.url}` : source.url;
                    streamLinks.push({
                      server: `${server} (Sub): ${source.quality}`,
                      link: sourceUrl,
                      type: "m3u8",
                      quality: source.quality,
                      headers: {
                        referer: baseUrl
                      },
                      subtitles: subtitles.length > 0 ? subtitles : []
                    });
                  });
                }
              } catch (e) {
                console.log(`Error with server ${server}:`, e);
              }
            }))
          );
          yield Promise.all(
            servers.map((server) => __async(null, null, function* () {
              try {
                const url = `${baseUrl}/v2/api/anime/oppai/${animeId}/${episodeNumber}?server=${server}&source_type=dub`;
                const res = yield axios.get(url, {
                  headers: __spreadValues(__spreadProps(__spreadValues({}, commonHeaders), {
                    Referer: baseUrl
                  }), wafCookies ? { Cookie: wafCookies } : {})
                });
                if (res.data && res.data.sources) {
                  const subtitles = [];
                  if (res.data.subs && Array.isArray(res.data.subs)) {
                    res.data.subs.forEach((sub) => {
                      if (sub.url && sub.lang) {
                        const langCode = sub.lang.toLowerCase().includes("english") ? "en" : sub.lang.toLowerCase().includes("arabic") ? "ar" : sub.lang.toLowerCase().includes("french") ? "fr" : sub.lang.toLowerCase().includes("german") ? "de" : sub.lang.toLowerCase().includes("italian") ? "it" : sub.lang.toLowerCase().includes("portuguese") ? "pt" : sub.lang.toLowerCase().includes("russian") ? "ru" : sub.lang.toLowerCase().includes("spanish") ? "es" : "und";
                        subtitles.push({
                          title: sub.lang,
                          language: langCode,
                          type: "text/vtt",
                          uri: sub.url
                        });
                      }
                    });
                  }
                  res.data.sources.forEach((source) => {
                    const sourceUrl = source.url.startsWith("/") ? `${streamUrl}${source.url}` : source.url;
                    streamLinks.push({
                      server: `${server} (Dub): ${source.quality}`,
                      link: sourceUrl,
                      type: "m3u8",
                      quality: source.quality,
                      headers: {
                        referer: baseUrl
                      },
                      subtitles: subtitles.length > 0 ? subtitles : []
                    });
                  });
                }
              } catch (e) {
                console.log(`Error with server ${server} (dub):`, e);
              }
            }))
          );
          console.log("Stream links:", streamLinks);
          return streamLinks;
        } catch (err) {
          throwProviderError("AnimeTsu", "stream", err);
        }
      });
    };
  }
});

// providers/animetsu/animetsu.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
