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

// providers/mod/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/mod/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Latest",
        filter: ""
      },
      {
        title: "Netflix",
        filter: "/ott/netflix"
      },
      {
        title: "HBO Max",
        filter: "/ott/hbo-max"
      },
      {
        title: "Amazon Prime",
        filter: "/ott/amazon-prime-video"
      }
    ];
    genres = [
      {
        title: "Apple TV+",
        filter: "/ott/apple-tv"
      },
      {
        title: "Disney+",
        filter: "/ott/disney-plus"
      },
      {
        title: "Hulu",
        filter: "/ott/hulu"
      },
      {
        title: "Crunchyroll",
        filter: "/ott/crunchyroll"
      },
      {
        title: "Action",
        filter: "/movies-by-genre/action/"
      },
      {
        title: "Adventure",
        filter: "/movies-by-genre/adventure/"
      },
      {
        title: "Animation",
        filter: "/movies-by-genre/animated/"
      },
      {
        title: "Comedy",
        filter: "/movies-by-genre/comedy/"
      },
      {
        title: "Crime",
        filter: "/movies-by-genre/crime/"
      },
      {
        title: "Documentary",
        filter: "/movies-by-genre/documentary/"
      },
      {
        title: "Fantasy",
        filter: "/movies-by-genre/fantasy/"
      },
      {
        title: "Horror",
        filter: "/movies-by-genre/horror/"
      },
      {
        title: "Mystery",
        filter: "/movies-by-genre/mystery/"
      },
      {
        title: "Romance",
        filter: "/movies-by-genre/romance/"
      },
      {
        title: "Thriller",
        filter: "/movies-by-genre/thriller/"
      },
      {
        title: "Sci-Fi",
        filter: "/movies-by-genre/sci-fi/"
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

// providers/mod/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0) {
  return __async(this, arguments, function* ({
    baseUrl,
    url,
    signal,
    axios,
    cheerio,
    operation
  }) {
    try {
      const res = yield axios.get(url, { signal });
      const data = res.data;
      const $ = cheerio.load(data);
      const catalog2 = [];
      $(".post-cards").find("article").map((i, element) => {
        const title = $(element).find("a").attr("title");
        const link = $(element).find("a").attr("href");
        const image = $(element).find("img").attr("src");
        if (title && link && image) {
          const postUrl = new URL(link, `${baseUrl}/`);
          catalog2.push({
            title,
            link: `${postUrl.pathname}${postUrl.search}${postUrl.hash}`,
            image
          });
        }
      });
      return catalog2;
    } catch (err) {
      throwProviderError("MoviesMod", operation, err);
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/mod/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("Moviesmod");
        const url = `${baseUrl + filter}/page/${page}/`;
        return posts({
          baseUrl,
          url,
          signal,
          axios,
          cheerio,
          operation: "posts"
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
        const { axios, cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("Moviesmod");
        const url = `${baseUrl}/search/${searchQuery}/page/${page}/`;
        return posts({
          baseUrl,
          url,
          signal,
          axios,
          cheerio,
          operation: "search posts"
        });
      });
    };
  }
});

// providers/mod/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/mod/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a;
        try {
          const { axios, cheerio } = providerContext;
          const baseUrl = yield getBaseUrl("Moviesmod");
          const url = new URL(link, `${baseUrl}/`).href;
          const res = yield axios.get(url);
          const data = res.data;
          const $ = cheerio.load(data);
          const meta = {
            title: $(".imdbwp__title").text() || $("strong:contains('Full Name:')").parent().clone().children().remove().end().text().trim(),
            synopsis: $(".imdbwp__teaser").text() || $(".liTOue").children("p").first().text(),
            image: $(".imdbwp__thumb").find("img").attr("src") || $("span:contains('ScreenShots:')").parent().next("p").children("img").first().attr("src") || "",
            imdbId: ((_a = $(".imdbwp__link").attr("href")) == null ? void 0 : _a.split("/")[4]) || "",
            type: $(".thecontent").text().toLocaleLowerCase().includes("season") ? "series" : "movie"
          };
          const links = [];
          $("h3,h4").map((i, element) => {
            var _a2;
            const seriesTitle = $(element).text();
            const episodesLink = $(element).next("p").find(
              ".maxbutton-episode-links,.maxbutton-g-drive,.maxbutton-af-download"
            ).attr("href");
            const movieLink = $(element).next("p").find(".maxbutton-download-links").attr("href");
            if (movieLink || episodesLink && episodesLink !== "javascript:void(0);") {
              links.push({
                title: seriesTitle.replace("Download ", "").trim() || "Download",
                episodesLink: episodesLink || "",
                directLinks: movieLink ? [{ link: movieLink, title: "Movie", type: "movie" }] : [],
                quality: ((_a2 = seriesTitle == null ? void 0 : seriesTitle.match(/\d+p\b/)) == null ? void 0 : _a2[0]) || ""
              });
            }
          });
          return __spreadProps(__spreadValues({}, meta), { linkList: links, webUrl: url });
        } catch (err) {
          throwProviderError("MoviesMod", "metadata", err);
        }
      });
    };
  }
});

// providers/mod/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function modExtractor(url, providerContext) {
  return __async(this, null, function* () {
    const { axios, cheerio } = providerContext;
    try {
      const wpHttp = url.split("sid=")[1];
      var bodyFormData0 = new FormData();
      bodyFormData0.append("_wp_http", wpHttp);
      const res = yield fetch(url.split("?")[0], {
        method: "POST",
        body: bodyFormData0
      });
      const data = yield res.text();
      const html = data;
      const $ = cheerio.load(html);
      const wpHttp2 = $("input").attr("name", "_wp_http2").val();
      console.log("wpHttp2", wpHttp2);
      var bodyFormData = new FormData();
      bodyFormData.append("_wp_http2", wpHttp2);
      const formUrl1 = $("form").attr("action");
      const formUrl = formUrl1 || url.split("?")[0];
      const res2 = yield fetch(formUrl, {
        method: "POST",
        body: bodyFormData
      });
      const html2 = yield res2.text();
      const link = html2.match(/setAttribute\("href",\s*"(.*?)"/)[1];
      console.log(link);
      const cookie = link.split("=")[1];
      console.log("cookie", cookie);
      const downloadLink = yield axios.get(link, {
        headers: {
          Referer: formUrl,
          Cookie: `${cookie}=${wpHttp2}`
        }
      });
      return downloadLink;
    } catch (err) {
      console.log("modGetStream error", err);
    }
  });
}
var headers, getStream, isDriveLink;
var init_stream = __esm({
  "providers/mod/stream.ts"() {
    "use strict";
    init_providerErrors();
    headers = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Cache-Control": "no-store",
      "Accept-Language": "en-US,en;q=0.9",
      DNT: "1",
      "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      Cookie: "popads_user_id=6ba8fe60a481387a3249f05aa058822d",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
    };
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: url,
        type,
        providerContext
      }) {
        var _a, _b;
        const { axios, cheerio } = providerContext;
        try {
          const modGetEpisodeLinks = function(_02) {
            return __async(this, arguments, function* ({
              url: url2,
              providerContext: providerContext2
            }) {
              var _a2;
              const { axios: axios2, cheerio: cheerio2 } = providerContext2;
              try {
                if (url2.includes("url=")) {
                  url2 = atob(url2.split("url=")[1]);
                }
                const res = yield axios2.get(url2);
                const html = res.data;
                let $ = cheerio2.load(html);
                if (url2.includes("url=")) {
                  const newUrl = (_a2 = $("meta[http-equiv='refresh']").attr("content")) == null ? void 0 : _a2.split("url=")[1];
                  const res2 = yield axios2.get(newUrl || url2);
                  const html2 = res2.data;
                  $ = cheerio2.load(html2);
                }
                const episodeLinks = [];
                $("h3,h4").map((i, element) => {
                  const seriesTitle = $(element).text();
                  const episodesLink = $(element).find("a").attr("href");
                  if (episodesLink && episodesLink !== "#") {
                    episodeLinks.push({
                      title: seriesTitle.trim() || "No title found",
                      link: episodesLink || ""
                    });
                  }
                });
                $("a.maxbutton").map((i, element) => {
                  const seriesTitle = $(element).children("span").text();
                  const episodesLink = $(element).attr("href");
                  if (episodesLink && episodesLink !== "#") {
                    episodeLinks.push({
                      title: seriesTitle.trim() || "No title found",
                      link: episodesLink || ""
                    });
                  }
                });
                return episodeLinks;
              } catch (err) {
                throw err;
              }
            });
          };
          console.log("modGetStream", type, url);
          if (type === "movie") {
            const servers2 = yield modGetEpisodeLinks({ url, providerContext });
            url = servers2[0].link || url;
          }
          let downloadLink = yield modExtractor(url, providerContext);
          const ddl = ((_b = (_a = downloadLink == null ? void 0 : downloadLink.data) == null ? void 0 : _a.match(/content="0;url=(.*?)"/)) == null ? void 0 : _b[1]) || url;
          const servers = [];
          const driveLink = yield isDriveLink(ddl);
          const driveRes = yield axios.get(driveLink, { headers });
          const driveHtml = driveRes.data;
          const $drive = cheerio.load(driveHtml);
          try {
            const resumeBot = $drive(".btn.btn-light").attr("href") || "";
            const resumeBotRes = yield axios.get(resumeBot, { headers });
            const resumeBotToken = resumeBotRes.data.match(
              /formData\.append\('token', '([a-f0-9]+)'\)/
            )[1];
            const resumeBotBody = new FormData();
            resumeBotBody.append("token", resumeBotToken);
            const resumeBotPath = resumeBotRes.data.match(
              /fetch\('\/download\?id=([a-zA-Z0-9\/+]+)'/
            )[1];
            const resumeBotBaseUrl = resumeBot.split("/download")[0];
            const resumeBotDownload = yield fetch(
              resumeBotBaseUrl + "/download?id=" + resumeBotPath,
              {
                method: "POST",
                body: resumeBotBody,
                headers: {
                  Referer: resumeBot,
                  Cookie: "PHPSESSID=7e9658ce7c805dab5bbcea9046f7f308"
                }
              }
            );
            const resumeBotDownloadData = yield resumeBotDownload.json();
            console.log("resumeBotDownloadData", resumeBotDownloadData.url);
            servers.push({
              server: "ResumeBot",
              link: resumeBotDownloadData.url,
              type: "mkv"
            });
          } catch (err) {
            console.log("ResumeBot link not found", err);
          }
          try {
            const baseWorkerStream = $drive(".btn-success");
            baseWorkerStream.each((i, el) => {
              var _a2;
              const link = (_a2 = el.attribs) == null ? void 0 : _a2.href;
              if (link) {
                servers.push({
                  server: "Resume Worker " + (i + 1),
                  link,
                  type: "mkv"
                });
              }
            });
          } catch (err) {
            console.log("Base page worker link not found", err);
          }
          try {
            const cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=1";
            const cfWorkersRes = yield axios.get(cfWorkersLink, { headers });
            const cfWorkersHtml = cfWorkersRes.data;
            const $cfWorkers = cheerio.load(cfWorkersHtml);
            const cfWorkersStream = $cfWorkers(".btn-success");
            cfWorkersStream.each((i, el) => {
              var _a2;
              const link = (_a2 = el.attribs) == null ? void 0 : _a2.href;
              if (link) {
                servers.push({
                  server: "Cf Worker 1." + i,
                  link,
                  type: "mkv"
                });
              }
            });
          } catch (err) {
            console.log("CF workers link not found", err);
          }
          try {
            const cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=2";
            const cfWorkersRes = yield axios.get(cfWorkersLink, { headers });
            const cfWorkersHtml = cfWorkersRes.data;
            const $cfWorkers = cheerio.load(cfWorkersHtml);
            const cfWorkersStream = $cfWorkers(".btn-success");
            cfWorkersStream.each((i, el) => {
              var _a2;
              const link = (_a2 = el.attribs) == null ? void 0 : _a2.href;
              if (link) {
                servers.push({
                  server: "Cf Worker 2." + i,
                  link,
                  type: "mkv"
                });
              }
            });
          } catch (err) {
            console.log("CF workers link not found", err);
          }
          try {
            const seed = $drive(".btn-danger").attr("href") || "";
            const newLinkRes = yield fetch(seed, {
              method: "HEAD",
              headers,
              redirect: "manual"
            });
            let newLink = seed;
            if (newLinkRes.status >= 300 && newLinkRes.status < 400) {
              newLink = newLinkRes.headers.get("location") || seed;
            } else if (newLinkRes.url && newLinkRes.url !== seed) {
              newLink = newLinkRes.url || newLinkRes.url;
            } else {
              newLink = newLinkRes.headers.get("location") || seed;
            }
            console.log("Gdrive-Instant-2 link", newLink == null ? void 0 : newLink.split("?url=")[1]);
            servers.push({
              server: "G-Drive (download only)",
              link: (newLink == null ? void 0 : newLink.split("?url=")[1]) || newLink,
              type: "mkv"
            });
          } catch (err) {
            console.log("Instant link not found", err);
          }
          return servers;
        } catch (err) {
          throwProviderError("MoviesMod", "stream", err);
        }
      });
    };
    isDriveLink = (ddl) => __async(null, null, function* () {
      if (ddl.includes("drive")) {
        const driveLeach = yield fetch(ddl);
        const driveLeachData = yield driveLeach.text();
        const pathMatch = driveLeachData.match(
          /window\.location\.replace\("([^"]+)"\)/
        );
        const path = pathMatch == null ? void 0 : pathMatch[1];
        const mainUrl = ddl.split("/")[2];
        console.log(`driveUrl = https://${mainUrl}${path}`);
        return `https://${mainUrl}${path}`;
      } else {
        return ddl;
      }
    });
  }
});

// providers/mod/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/mod/episodes.ts"() {
    "use strict";
    init_providerErrors();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        var _a;
        const { axios, cheerio } = providerContext;
        try {
          if (url.includes("url=")) {
            url = atob(url.split("url=")[1]);
          }
          const res = yield axios.get(url);
          const html = res.data;
          let $ = cheerio.load(html);
          if (url.includes("url=")) {
            const newUrl = (_a = $("meta[http-equiv='refresh']").attr("content")) == null ? void 0 : _a.split("url=")[1];
            const res2 = yield axios.get(newUrl || url);
            const html2 = res2.data;
            $ = cheerio.load(html2);
          }
          const episodeLinks = [];
          $("h3,h4").map((i, element) => {
            const seriesTitle = $(element).text();
            const episodesLink = $(element).find("a").attr("href");
            if (episodesLink && episodesLink !== "#") {
              episodeLinks.push({
                title: seriesTitle.trim() || "No title found",
                link: episodesLink || ""
              });
            }
          });
          $("a.maxbutton").map((i, element) => {
            const seriesTitle = $(element).children("span").text();
            const episodesLink = $(element).attr("href");
            if (episodesLink && episodesLink !== "#") {
              episodeLinks.push({
                title: seriesTitle.trim() || "No title found",
                link: episodesLink || ""
              });
            }
          });
          return episodeLinks;
        } catch (err) {
          throwProviderError("MoviesMod", "episodes", err);
        }
      });
    };
  }
});

// providers/mod/mod.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
