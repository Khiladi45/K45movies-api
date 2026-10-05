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

// providers/showbox/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/showbox/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Home",
        filter: ""
      },
      {
        title: "Movies",
        filter: "/movie"
      },
      {
        title: "TV Shows",
        filter: "/tv"
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

// providers/showbox/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0) {
  return __async(this, arguments, function* ({
    url,
    signal,
    baseUrl,
    axios,
    cheerio,
    headers
  }) {
    const maxRetries = 3;
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = yield axios.get(url, { signal, headers });
        const data = res.data;
        console.log(data);
        const $ = cheerio.load(data);
        const catalog2 = [];
        $(".movie-item,.flw-item").map((i, element) => {
          const title = $(element).find(".film-name").text().trim();
          const link = $(element).find("a").attr("href");
          const image = $(element).find("img").attr("src");
          console.log(title, link, image);
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
        lastError = err;
        if (signal.aborted || attempt === maxRetries) {
          throw err;
        }
      }
    }
    throw lastError;
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/showbox/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        // providerValue,
        signal,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        const baseUrl = yield getBaseUrl("showbox");
        const url = `${baseUrl + filter}?page=${page}/`;
        return posts({ url, signal, baseUrl, axios, cheerio });
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
        const { axios, cheerio, commonHeaders } = providerContext;
        const baseUrl = yield getBaseUrl("showbox");
        const url = `${baseUrl}/search?keyword=${searchQuery}&page=${page}`;
        return posts({
          url,
          signal,
          baseUrl,
          axios,
          cheerio,
          headers: commonHeaders
        });
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

// providers/showbox/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/showbox/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    init_providerErrors();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        try {
          const { axios, cheerio } = providerContext;
          const baseUrlShowbox = yield getBaseUrl("showbox");
          const url = new URL(link, `${baseUrlShowbox}/`).href;
          const res = yield axios.get(url);
          const data = res.data;
          const $ = cheerio.load(data);
          const type = url.includes("tv") ? "series" : "movie";
          const imdbId = "";
          const title = $(".heading-name").text();
          const rating = ((_b = (_a = $(".btn-imdb").text()) == null ? void 0 : _a.match(/\d+(\.\d+)?/g)) == null ? void 0 : _b[0]) || "";
          const image = ((_d = (_c = $(".cover_follow").attr("style")) == null ? void 0 : _c.split("url(")[1]) == null ? void 0 : _d.split(")")[0]) || "";
          const synopsis = (_f = (_e = $(".description").text()) == null ? void 0 : _e.replace(/[\n\t]/g, "")) == null ? void 0 : _f.trim();
          const febID = (_h = (_g = $(".heading-name").find("a").attr("href")) == null ? void 0 : _g.split("/")) == null ? void 0 : _h.pop();
          const baseUrl = url.split("/").slice(0, 3).join("/");
          const indexUrl = `${baseUrl}/index/share_link?id=${febID}&type=${type === "movie" ? "1" : "2"}`;
          const indexRes = yield axios.get(indexUrl);
          const indexData = indexRes.data;
          const febKey = indexData.data.link.split("/").pop();
          const febLink = `https://www.febbox.com/file/file_share_list?share_key=${febKey}&is_html=0`;
          const febRes = yield axios.get(febLink);
          const febData = febRes.data;
          const fileList = (_i = febData == null ? void 0 : febData.data) == null ? void 0 : _i.file_list;
          const links = [];
          if (fileList) {
            fileList.map((file) => {
              const fileName = `${file.file_name} (${file.file_size})`;
              const fileId = file.fid;
              links.push({
                title: fileName,
                episodesLink: file.is_dir ? `${febKey}&${fileId}` : `${febKey}&`
              });
            });
          }
          return {
            title,
            rating,
            synopsis,
            image,
            imdbId,
            type,
            linkList: links,
            webUrl: url
          };
        } catch (err) {
          throwProviderError("ShowBox", "metadata", err);
        }
      });
    };
  }
});

// providers/showbox/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/showbox/stream.ts"() {
    "use strict";
    init_providerErrors();
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: id,
        // type,
        signal,
        providerContext
      }) {
        var _a, _b, _c, _d, _e;
        try {
          const { axios, cheerio, kvStore } = providerContext;
          const stream = [];
          const [, epId] = id.split("&");
          if (!epId) return [];
          let html = "";
          const febboxCookie = yield kvStore == null ? void 0 : kvStore.get("febboxCookie");
          if (febboxCookie) {
            try {
              const febRes = yield axios.get(
                `https://www.febbox.com/console/video_quality_list?fid=${epId}`,
                {
                  headers: {
                    Cookie: febboxCookie,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
                    "X-Requested-With": "XMLHttpRequest",
                    Referer: "https://www.febbox.com/"
                  },
                  signal
                }
              );
              if (((_a = febRes.data) == null ? void 0 : _a.html) && typeof febRes.data.html === "string") {
                html = febRes.data.html;
              } else if (((_b = febRes.data) == null ? void 0 : _b.code) === -1 || ((_c = febRes.data) == null ? void 0 : _c.login_required) || typeof ((_d = febRes.data) == null ? void 0 : _d.msg) === "string" && febRes.data.msg.toLowerCase().includes("login")) {
                throw new Error("Please set cookies in ShowBox provider settings");
              }
            } catch (e) {
              if ((_e = e.message) == null ? void 0 : _e.includes("ShowBox provider settings")) {
                throw e;
              }
            }
          }
          if (!html) {
            const url = `https://feb.8man.workers.dev/?fid=${epId}`;
            const res = yield axios.get(url, { signal });
            const data = res.data;
            if ((data == null ? void 0 : data.html) && typeof data.html === "string") {
              html = data.html;
            } else if ((data == null ? void 0 : data.code) === -1 || (data == null ? void 0 : data.login_required) || typeof (data == null ? void 0 : data.msg) === "string" && data.msg.toLowerCase().includes("login")) {
              throw new Error("Please set cookies in ShowBox provider settings");
            }
          }
          if (!html) {
            return [];
          }
          const $ = cheerio.load(html);
          $(".file_quality").each((i, el) => {
            const server = $(el).find("p.name").text() + " - " + $(el).find("p.size").text() + " - " + $(el).find("p.speed").text();
            const link = $(el).attr("data-url");
            if (link) {
              stream.push({
                server,
                type: "mkv",
                link
              });
            }
          });
          return stream;
        } catch (err) {
          throwProviderError("ShowBox", "stream", err);
        }
      });
    };
  }
});

// providers/showbox/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
function formatEpisodeName(title) {
  const regex = /[sS](\d+)\s*[eE](\d+)/;
  const match = title.match(regex);
  if (match) {
    const season = match[1].padStart(2, "0");
    const episode = match[2].padStart(2, "0");
    return `Season${season} Episode${episode}`;
  } else {
    return title;
  }
}
var getEpisodes;
var init_episodes = __esm({
  "providers/showbox/episodes.ts"() {
    "use strict";
    init_providerErrors();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url: id,
        providerContext
      }) {
        const { axios } = providerContext;
        try {
          const [fileId, febboxId] = id.split("&");
          const febLink = febboxId ? `https://www.febbox.com/file/file_share_list?share_key=${fileId}&pwd=&parent_id=${febboxId}&is_html=0` : `https://www.febbox.com/file/file_share_list?share_key=${fileId}&pwd=&is_html=0`;
          const res = yield axios.get(febLink);
          const data = res.data;
          const fileList = data.data.file_list;
          const episodeLinks = [];
          fileList == null ? void 0 : fileList.map((file) => {
            const fileName = formatEpisodeName(file.file_name);
            const epId = file == null ? void 0 : file.fid;
            if (!file.is_dir && fileName && epId) {
              episodeLinks.push({
                title: fileName,
                link: `${fileId}&${epId}`
              });
            }
          });
          return episodeLinks;
        } catch (err) {
          throwProviderError("ShowBox", "episodes", err);
        }
      });
    };
  }
});

// providers/showbox/showbox.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
