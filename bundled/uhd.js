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

// providers/uhd/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/uhd/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Latest",
        filter: ""
      },
      {
        title: "Web Series",
        filter: "/web-series"
      },
      {
        title: "Movies",
        filter: "/movies"
      },
      {
        title: "4K HDR",
        filter: "/4k-hdr"
      }
    ];
    genres = [
      {
        title: "4K HEVC",
        filter: "/2160p-hevc"
      },
      {
        title: "HD 10bit",
        filter: "/1080p-10bit"
      },
      {
        title: "English Movies",
        filter: "/movies/english-movies"
      },
      {
        title: "Dual Audio",
        filter: "/movies/dual-audio-movies"
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

// providers/uhd/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function getWithWAF(url, axios, openWebView, headers) {
  return __async(this, null, function* () {
    var _a;
    const baseUrl = url.split("/").slice(0, 3).join("/");
    try {
      return yield axios.get(url, { headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl }) });
    } catch (error) {
      if (((_a = error.response) == null ? void 0 : _a.status) === 403 && openWebView) {
        console.log(`WAF detected (403) for ${url}, using solver...`);
        const wafResult = yield openWebView(baseUrl, {
          title: "Solve the captcha below and click done",
          description: "Required to bypass anti-bot protection.",
          headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl }),
          waitForCookie: "cf_clearance",
          force: true
        });
        return yield axios.get(url, {
          headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl, Cookie: wafResult.cookie })
        });
      }
      throw error;
    }
  });
}
function posts(baseURL, url, signal, providerContext, operation) {
  return __async(this, null, function* () {
    try {
      const { axios, cheerio, openWebView, commonHeaders } = providerContext;
      const res = yield getWithWAF(url, axios, openWebView, commonHeaders);
      const html = res.data;
      const $ = cheerio.load(html);
      const uhdCatalog = [];
      $(".gridlove-posts").find(".layout-masonry").each((index, element) => {
        const title = $(element).find("a").attr("title");
        const link = $(element).find("a").attr("href");
        const image = $(element).find("a").find("img").attr("src");
        if (title && link && image) {
          const postUrl = new URL(link, `${baseURL}/`);
          uhdCatalog.push({
            title: title.replace("Download", "").trim(),
            link: `${postUrl.pathname}${postUrl.search}${postUrl.hash}`,
            image
          });
        }
      });
      return uhdCatalog;
    } catch (err) {
      throwProviderError("UHDMovies", operation, err);
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/uhd/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    getPosts = (_0) => __async(null, [_0], function* ({
      filter,
      page,
      // providerValue,
      signal,
      providerContext
    }) {
      const baseUrl = yield getBaseUrl("UhdMovies");
      const url = page === 1 ? `${baseUrl}/${filter}/` : `${baseUrl + filter}/page/${page}/`;
      console.log("url", url);
      return posts(baseUrl, url, signal, providerContext, "posts");
    });
    getSearchPosts = (_0) => __async(null, [_0], function* ({
      searchQuery,
      page,
      // providerValue,
      signal,
      providerContext
    }) {
      const baseUrl = yield getBaseUrl("UhdMovies");
      const url = `${baseUrl}/search/${searchQuery}/page/${page}/`;
      return posts(baseUrl, url, signal, providerContext, "search posts");
    });
  }
});

// providers/uhd/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function getWithWAF2(url, axios, openWebView, headers) {
  return __async(this, null, function* () {
    var _a;
    const baseUrl = url.split("/").slice(0, 3).join("/");
    try {
      return yield axios.get(url, { headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl }) });
    } catch (error) {
      if (((_a = error.response) == null ? void 0 : _a.status) === 403 && openWebView) {
        console.log(`WAF detected (403) for ${url}, using solver...`);
        const wafResult = yield openWebView(baseUrl, {
          title: "Solve the captcha below and click done",
          description: "Required to bypass anti-bot protection.",
          headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl }),
          waitForCookie: "cf_clearance",
          force: true
        });
        return yield axios.get(url, {
          headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl, Cookie: wafResult.cookie })
        });
      }
      throw error;
    }
  });
}
var getMeta;
var init_meta = __esm({
  "providers/uhd/meta.ts"() {
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
          const { axios, cheerio, openWebView, commonHeaders } = providerContext;
          console.log("Fetching metadata from UHD...", link, providerContext);
          const baseUrl = yield getBaseUrl("UhdMovies");
          const url = new URL(link, `${baseUrl}/`).href;
          const res = yield getWithWAF2(url, axios, openWebView, commonHeaders);
          const html = yield res.data;
          const $ = cheerio.load(html);
          const title = $("h2:first").text() || "";
          const image = $("h2").siblings().find("img").attr("src") || "";
          const episodes = [];
          $(".mks_separator,p:contains('mks_separator')").each((index, element) => {
            $(element).nextUntil(".mks_separator").each((index2, element2) => {
              const title2 = $(element2).text();
              const episodesList = [];
              $(element2).next("p").find("a").each((index3, element3) => {
                const title3 = $(element3).text();
                const link2 = $(element3).attr("href");
                if (title3 && link2 && !title3.toLocaleLowerCase().includes("zip")) {
                  episodesList.push({ title: title3, link: link2 });
                }
              });
              if (title2 && episodesList.length > 0) {
                episodes.push({
                  title: title2,
                  directLinks: episodesList
                });
              }
            });
          });
          $("hr").each((index, element) => {
            $(element).nextUntil("hr").each((index2, element2) => {
              const title2 = $(element2).text();
              const episodesList = [];
              $(element2).next("p").find("a").each((index3, element3) => {
                const title3 = $(element3).text();
                const link2 = $(element3).attr("href");
                if (title3 && link2 && !title3.toLocaleLowerCase().includes("zip")) {
                  episodesList.push({ title: title3, link: link2 });
                }
              });
              if (title2 && episodesList.length > 0) {
                episodes.push({
                  title: title2,
                  directLinks: episodesList
                });
              }
            });
          });
          return {
            title: title.match(/^Download\s+([^(\[]+)/i) ? ((_a = title == null ? void 0 : title.match(/^Download\s+([^(\[]+)/i)) == null ? void 0 : _a[1]) || "" : title.replace("Download", "") || "",
            image,
            imdbId: "",
            synopsis: title,
            type: "",
            linkList: episodes,
            webUrl: url
          };
        } catch (error) {
          throwProviderError("UHDMovies", "metadata", error);
        }
      });
    };
  }
});

// providers/uhd/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function getWithWAF3(url, axios, openWebView, headers) {
  return __async(this, null, function* () {
    var _a;
    const baseUrl = url.split("/").slice(0, 3).join("/");
    try {
      return yield axios.get(url, { headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl }) });
    } catch (error) {
      if (((_a = error.response) == null ? void 0 : _a.status) === 403 && openWebView) {
        console.log(`WAF detected (403) for ${url}, using solver...`);
        const wafResult = yield openWebView(baseUrl, {
          title: "Solve the captcha below and click done",
          description: "Required to bypass anti-bot protection.",
          headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl }),
          waitForCookie: "cf_clearance",
          force: true
        });
        return yield axios.get(url, {
          headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl, Cookie: wafResult.cookie })
        });
      }
      throw error;
    }
  });
}
function modExtractor(url, providerContext) {
  return __async(this, null, function* () {
    const { axios, cheerio, openWebView } = providerContext;
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
      var bodyFormData = new FormData();
      bodyFormData.append("_wp_http2", wpHttp2);
      const formUrl1 = $("form").attr("action");
      const formUrl = formUrl1 || url.split("?")[0];
      const res2 = yield fetch(formUrl, {
        method: "POST",
        body: bodyFormData
      });
      const html2 = yield res2.text();
      const linkMatch = html2.match(/setAttribute\("href",\s*"(.*?)"/);
      if (!linkMatch) return null;
      const link = linkMatch[1];
      console.log(link);
      const cookie = link.split("=")[1];
      console.log("cookie", cookie);
      const downloadLink = yield getWithWAF3(link, axios, openWebView, {
        Referer: formUrl,
        Cookie: `${cookie}=${wpHttp2}`
      });
      return downloadLink;
    } catch (err) {
      console.log("modGetStream error", err);
    }
  });
}
var getStream, isDriveLink;
var init_stream = __esm({
  "providers/uhd/stream.ts"() {
    "use strict";
    init_providerErrors();
    getStream = (_0) => __async(null, [_0], function* ({
      link: url,
      providerContext
    }) {
      var _a, _b;
      try {
        const { axios, cheerio, commonHeaders: headers } = providerContext;
        let downloadLink = yield modExtractor(url, providerContext);
        const ddl = ((_b = (_a = downloadLink == null ? void 0 : downloadLink.data) == null ? void 0 : _a.match(/content="0;url=(.*?)"/)) == null ? void 0 : _b[1]) || url;
        console.log("ddl", ddl);
        const driveLink = yield isDriveLink(ddl);
        const ServerLinks = [];
        const driveRes = yield axios.get(driveLink, { headers });
        const driveHtml = driveRes.data;
        const $drive = cheerio.load(driveHtml);
        try {
          const seed = $drive(".btn-danger").attr("href") || "";
          const instantToken = seed.split("=")[1];
          const InstantFromData = new FormData();
          InstantFromData.append("keys", instantToken);
          const videoSeedUrl = seed.split("/").slice(0, 3).join("/") + "/api";
          const instantLinkRes = yield fetch(videoSeedUrl, {
            method: "POST",
            body: InstantFromData,
            headers: {
              "x-token": videoSeedUrl
            }
          });
          const instantLinkData = yield instantLinkRes.json();
          if (instantLinkData.error === false) {
            const instantLink = instantLinkData.url;
            ServerLinks.push({
              server: "G-Drive (download only)",
              link: instantLink,
              type: "mkv"
            });
          } else {
            console.log("Instant link not found", instantLinkData);
          }
        } catch (err) {
          console.log("Instant link not found", err);
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
          ServerLinks.push({
            server: "G-Drive (download only)",
            link: (newLink == null ? void 0 : newLink.split("?url=")[1]) || newLink,
            type: "mkv"
          });
        } catch (err) {
          console.log("Instant link not found", err);
        }
        try {
          const resumeDrive = driveLink.replace("/file", "/zfile");
          const resumeDriveRes = yield axios.get(resumeDrive, { headers });
          const resumeDriveHtml = resumeDriveRes.data;
          const $resumeDrive = cheerio.load(resumeDriveHtml);
          const resumeLink = $resumeDrive(".btn-success").attr("href");
          if (resumeLink) {
            ServerLinks.push({
              server: "ResumeCloud",
              link: resumeLink,
              type: "mkv"
            });
          }
        } catch (err) {
          console.log("Resume link not found");
        }
        try {
          const baseWorkerStream = $drive(".btn-success");
          baseWorkerStream.each((i, el) => {
            var _a2;
            const link = (_a2 = el.attribs) == null ? void 0 : _a2.href;
            if (link) {
              ServerLinks.push({
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
              ServerLinks.push({
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
              ServerLinks.push({
                server: "Cf Worker 2." + i,
                link,
                type: "mkv"
              });
            }
          });
        } catch (err) {
          console.log("CF workers link not found", err);
        }
        console.log("ServerLinks", ServerLinks);
        return ServerLinks;
      } catch (err) {
        throwProviderError("UHDMovies", "stream", err);
      }
    });
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

// providers/uhd/uhd.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
