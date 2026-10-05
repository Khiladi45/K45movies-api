var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// providers/world4u/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/world4u/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Latest",
        filter: ""
      },
      {
        title: "Hollywood",
        filter: "/category/hollywood"
      },
      {
        title: "Bollywood",
        filter: "/category/bollywood"
      },
      {
        title: "Web Series",
        filter: "/category/web-series"
      }
    ];
    genres = [
      { title: "South", filter: "/category/hindi-dubbed-movies/south-indian" },
      { title: "Punjabi", filter: "/category/punjabi" },
      { title: "Marathi", filter: "/category/bollywood/marathi" },
      { title: "Gujarati", filter: "/category/gujarati" },
      { title: "Bollywood", filter: "/category/bollywood" },
      { title: "Hollywood", filter: "/category/hollywood" }
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

// providers/world4u/posts.ts
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
      $(".recent-posts").children().map((i, element) => {
        const title = $(element).find(".post-thumb").find("a").attr("title");
        const link = $(element).find(".post-thumb").find("a").attr("href");
        const image = $(element).find(".post-thumb").find("img").attr("data-src") || $(element).find(".post-thumb").find("img").attr("src");
        if (title && link && image) {
          const postUrl = new URL(link, `${baseUrl}/`);
          catalog2.push({
            title: title.replace("Download", "").trim(),
            link: `${postUrl.pathname}${postUrl.search}${postUrl.hash}`,
            image
          });
        }
      });
      return catalog2;
    } catch (err) {
      throwProviderError("World4u", operation, err);
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/world4u/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        // providerValue,
        signal,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("w4u");
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
        // providerValue,
        signal,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("w4u");
        const url = `${baseUrl}/page/${page}/?s=${searchQuery}`;
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

// providers/world4u/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/world4u/meta.ts"() {
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
          const baseUrl = yield getBaseUrl("w4u");
          const url = new URL(link, `${baseUrl}/`).href;
          const res = yield axios.get(url);
          const data = res.data;
          const $ = cheerio.load(data);
          const type = $(".entry-content").text().toLocaleLowerCase().includes("movie name") ? "movie" : "series";
          const imdbId = ((_a = $(".imdb_left").find("a").attr("href")) == null ? void 0 : _a.split("/")[4]) || "";
          const title = $(".entry-content").find('strong:contains("Name")').children().remove().end().text().replace(":", "");
          const synopsis = $(".entry-content").find('p:contains("Synopsis"),p:contains("Plot"),p:contains("Story")').children().remove().end().text();
          const image = $(".wp-caption").find("img").attr("data-src") || $(".entry-content").find("img").attr("data-src") || "";
          const links = [];
          $(".my-button").map((i, element) => {
            var _a2;
            const title2 = $(element).parent().parent().prev().text();
            const episodesLink = $(element).attr("href");
            const quality = ((_a2 = title2.match(/\b(480p|720p|1080p|2160p)\b/i)) == null ? void 0 : _a2[0]) || "";
            if (episodesLink && title2) {
              links.push({
                title: title2,
                episodesLink: type === "series" ? episodesLink : "",
                directLinks: type === "movie" ? [
                  {
                    link: episodesLink,
                    title: title2,
                    type: "movie"
                  }
                ] : [],
                quality
              });
            }
          });
          return {
            title,
            synopsis,
            image,
            imdbId,
            type,
            linkList: links,
            webUrl: url
          };
        } catch (err) {
          throwProviderError("World4u", "metadata", err);
        }
      });
    };
  }
});

// providers/world4u/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/world4u/stream.ts"() {
    "use strict";
    init_providerErrors();
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: url,
        type,
        providerContext
      }) {
        var _a;
        const { axios, cheerio } = providerContext;
        const headers = {
          "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
          Cookie: "61cn=1; 61wk=1; __cf_bm=wtv9Eoa2wrUDgevtAnJ6wUOZrxtVYBcddhUDtT0Wj_M-1757137848-1.0.1.1-8Tr7rV19zNgUcRYe_5567LKb2IZrKyxwrc1VWgTmMDd06Givhil3U2kMtUYTYkTnuD3sHUgfh8CO9Y5LrEcZACBbrPE.3Sq5F_JLXaK7Hrw; conv_tracking_data-2=%7B%22mf_source%22%3A%22regular_download-59%22%2C%22mf_content%22%3A%22Free%22%2C%22mf_medium%22%3A%22unknown%5C%2FDefault%20Browser%22%2C%22mf_campaign%22%3A%22616qpccbrq0y4oe%22%2C%22mf_term%22%3A%22d11b8f533377139aa38d757e5057630e%22%7D; ukey=pu2dyp35fyongstav3km969l8d6u2z82"
        };
        try {
          if (type === "movie") {
            const linkRes = yield axios.get(url, { headers });
            const linkData = linkRes.data;
            const $2 = cheerio.load(linkData);
            url = $2('strong:contains("INSTANT")').parent().attr("href") || url;
          }
          if (url.includes("fastilinks")) {
            const fastilinksRes = yield axios.get(url, { headers });
            const fastilinksData = fastilinksRes.data;
            const $$ = cheerio.load(fastilinksData);
            const fastilinksKey = $$(
              'input[name="_csrf_token_645a83a41868941e4692aa31e7235f2"]'
            ).attr("value");
            console.log("fastilinksKey", fastilinksKey);
            const fastilinksFormData = new FormData();
            fastilinksFormData.append(
              "_csrf_token_645a83a41868941e4692aa31e7235f2",
              fastilinksKey || ""
            );
            console.log(
              "fastilinksFormData",
              fastilinksFormData,
              "fastilinksUrl",
              url
            );
            const fastilinksRes2 = yield fetch(url, {
              method: "POST",
              headers,
              body: fastilinksFormData
            });
            if (!fastilinksRes2.ok) {
              throw new Error(
                `HTTP ${fastilinksRes2.status} ${fastilinksRes2.statusText} | URL ${url}`
              );
            }
            const fastilinksHtml = yield fastilinksRes2.text();
            const $$$ = cheerio.load(fastilinksHtml);
            const fastilinksLink = $$$('a:contains("mediafire")').attr("href") || $$$('a:contains("photolinx")').attr("href");
            console.log("fastilinksLink", fastilinksLink);
            url = fastilinksLink || url;
          }
          console.log("world4uGetStream", type, url);
          if (url.includes("photolinx")) {
            console.log("photolinx", url);
            const photolinxBaseUrl = url.split("/").slice(0, 3).join("/");
            console.log("photolinxBaseUrl", photolinxBaseUrl);
            const photolinxRes = yield fetch(
              "https://photolinx.space/download/SzbPKzt6YMO",
              {
                headers: {
                  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                  "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
                  "cache-control": "no-cache",
                  pragma: "no-cache",
                  priority: "u=0, i",
                  "sec-ch-ua": '"Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": '"Windows"',
                  "sec-fetch-dest": "document",
                  "sec-fetch-mode": "navigate",
                  "sec-fetch-site": "none",
                  "sec-fetch-user": "?1",
                  "upgrade-insecure-requests": "1",
                  cookie: "PHPSESSID=f2211def7938d7228daaa37ffeabcfe0; ext_name=ojplmecpdpgccookcobabopnaifgidhf"
                },
                body: null,
                method: "GET"
              }
            );
            const photolinxData = yield photolinxRes.text();
            const $$$ = cheerio.load(photolinxData);
            const access_token = $$$("#generate_url").attr("data-token");
            const uid = $$$("#generate_url").attr("data-uid");
            const body = {
              type: "DOWNLOAD_GENERATE",
              payload: {
                access_token,
                uid
              }
            };
            console.log("photolinxData", JSON.stringify(body));
            const photolinxRes2 = yield fetch(`${photolinxBaseUrl}/action`, {
              headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
                "cache-control": "no-cache",
                "content-type": "application/json; charset=UTF-8",
                pragma: "no-cache",
                priority: "u=1, i",
                "sec-ch-ua": '"Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "xmlhttprequest",
                cookie: "PHPSESSID=f2211def7938d7228daaa37ffeabcfe0; ext_name=ojplmecpdpgccookcobabopnaifgidhf",
                Referer: url
              },
              body: JSON.stringify(body),
              method: "POST"
            });
            const photolinxData2 = yield photolinxRes2.json();
            console.log("photolinxData2", photolinxData2);
            const dwUrl = photolinxData2 == null ? void 0 : photolinxData2.download_url;
            if (dwUrl) {
              const streamLinks2 = [
                {
                  server: "Photolinx",
                  link: dwUrl,
                  type: "mkv"
                }
              ];
              return streamLinks2;
            }
          }
          const res = yield fetch(url, { headers });
          const html = yield res.text();
          const streamLinks = [];
          let data = { download: "" };
          try {
            const key = ((_a = html.match(/formData\.append\('key',\s*'(\d+)'\);/)) == null ? void 0 : _a[1]) || "";
            console.log("key", key, "url", url);
            const formData = new FormData();
            formData.append("key", key);
            const streamRes = yield fetch(url, {
              method: "POST",
              headers,
              body: formData
            });
            data = yield streamRes.json();
          } catch (err) {
            console.log(
              "error in world4uGetStream",
              err instanceof Error ? err.message : err
            );
          }
          let $ = cheerio.load(html);
          const mediafireUrl = $('h1:contains("Download")').find("a").attr("href") || $(".input.popsok").attr("href") || url;
          console.log("mediafireUrl", mediafireUrl);
          if (mediafireUrl) {
            const directUrl = yield fetch(mediafireUrl, {
              headers: {
                Referer: url
              }
            });
            const urlContentType = directUrl.headers.get("content-type");
            console.log("mfcontentType", urlContentType);
            if (urlContentType && urlContentType.includes("video")) {
              streamLinks.push({
                server: "Mediafire",
                link: mediafireUrl,
                type: "mkv"
              });
              return streamLinks;
            } else {
              const repairRes = yield fetch(mediafireUrl, {
                headers: {
                  Referer: url
                }
              });
              const repairHtml = yield repairRes.text();
              const base64Link = cheerio.load(repairHtml)(".input.popsok").attr("data-scrambled-url");
              console.log("base64Link", base64Link);
              const href = base64Link ? atob(base64Link) : null;
              console.log("href", href);
              let downloadLInk = (href == null ? void 0 : href.startsWith("https://")) ? href : null;
              console.log("downloadLInk", downloadLInk);
              if (downloadLInk) {
                streamLinks.push({
                  server: "Mediafire",
                  link: downloadLInk,
                  type: "mkv"
                });
              }
              return streamLinks;
            }
          }
          const requireRepairRes = yield fetch(data.download);
          const contentType = requireRepairRes.headers.get("content-type");
          console.log("contentType", contentType);
          if (contentType && contentType.includes("video")) {
            streamLinks.push({
              server: "Mediafire",
              link: data.download,
              type: "mkv"
            });
            return streamLinks;
          } else {
            const repairRes = yield fetch(data.download, {
              headers: {
                Referer: url
              }
            });
            const repairHtml = yield repairRes.text();
            const $2 = cheerio.load(repairHtml);
            const repairLink = $2("#continue-btn").attr("href");
            console.log("repairLink", "https://www.mediafire.com" + repairLink);
            const repairRequireRepairRes = yield fetch(
              "https://www.mediafire.com" + repairLink
            );
            const $$ = cheerio.load(yield repairRequireRepairRes.text());
            const repairDownloadLink = $$(".input.popsok").attr("href");
            console.log("repairDownloadLink", repairDownloadLink);
            if (repairDownloadLink) {
              streamLinks.push({
                server: "Mediafire",
                link: repairDownloadLink,
                type: "mkv"
              });
            }
          }
          return streamLinks;
        } catch (err) {
          throwProviderError("World4u", "stream", err);
        }
      });
    };
  }
});

// providers/world4u/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/world4u/episodes.ts"() {
    "use strict";
    init_providerErrors();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        try {
          const res = yield axios.get(url);
          const html = res.data;
          let $ = cheerio.load(html);
          const episodeLinks = [];
          $(
            'strong:contains("Episode"),strong:contains("1080"),strong:contains("720"),strong:contains("480")'
          ).map((i, element) => {
            const title = $(element).text();
            const link = $(element).parent().parent().next("h4").find("a").attr("href");
            if (link && !title.includes("zip")) {
              episodeLinks.push({
                title,
                link
              });
            }
          });
          return episodeLinks;
        } catch (err) {
          throwProviderError("World4u", "episodes", err);
        }
      });
    };
  }
});

// providers/world4u/world4u.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
