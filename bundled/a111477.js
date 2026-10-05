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

// providers/a111477/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/a111477/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Movies",
        filter: "/movies/"
      },
      {
        title: "TV Shows",
        filter: "/tvs/"
      },
      {
        title: "K-Drama",
        filter: "/kdrama/"
      },
      {
        title: "Asian Drama",
        filter: "/asiandrama/"
      }
    ];
    genres = [];
  }
});

// providers/a111477/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var POSTS_API, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/a111477/posts.ts"() {
    "use strict";
    POSTS_API = "https://a111477.1proxy.workers.dev/";
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        var _a;
        const response = yield providerContext.axios.get(POSTS_API, {
          params: { filter, page, limit: 50 },
          signal
        });
        return ((_a = response.data) == null ? void 0 : _a.posts) || [];
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        var _a;
        const response = yield providerContext.axios.get(POSTS_API, {
          params: { q: searchQuery, page, limit: 50 },
          signal
        });
        return ((_a = response.data) == null ? void 0 : _a.posts) || [];
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

// providers/a111477/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/a111477/meta.ts"() {
    "use strict";
    init_providerErrors();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        try {
          const { axios, cheerio } = providerContext;
          const url = link;
          const res = yield axios.get(url);
          const data = res.data;
          const $ = cheerio.load(data);
          const urlTitle = decodeURIComponent(
            new URL(url).pathname.split("/").filter(Boolean).pop() || ""
          );
          const heading = $("h1").text().trim().replace(/^Index of\s*/i, "");
          const title = heading && heading !== "/" ? heading.replace(/\/$/, "") : urlTitle;
          const links = [];
          const directLinks = [];
          $("table tbody tr").each((i, element) => {
            const $row = $(element);
            const linkElement = $row.find("a[href]").first();
            const itemTitle = linkElement.text().trim();
            const itemLink = linkElement.attr("href");
            if (itemTitle && itemLink && itemTitle !== "../" && itemTitle !== "Parent Directory") {
              const fullLink = new URL(itemLink, url).href;
              if (itemTitle.endsWith("/")) {
                const cleanTitle = itemTitle.replace(/\/$/, "");
                links.push({
                  episodesLink: fullLink,
                  title: cleanTitle
                });
              } else if (itemTitle.includes(".mp4") || itemTitle.includes(".mkv") || itemTitle.includes(".avi") || itemTitle.includes(".mov")) {
                directLinks.push({
                  title: itemTitle,
                  link: fullLink
                });
              }
            }
          });
          if (directLinks.length > 0) {
            links.push({
              title: title + " (Direct Files)",
              directLinks
            });
          }
          const pathname = new URL(url).pathname;
          const type = pathname.startsWith("/tvs/") || pathname.startsWith("/kdrama/") || pathname.startsWith("/asiandrama/") || links.some((item) => item.episodesLink) ? "series" : "movie";
          return {
            title,
            synopsis: `Content from 111477.xyz directory`,
            image: `https://placehold.jp/23/000000/ffffff/300x450.png?text=${encodeURIComponent(
              title
            )}&css=%7B%22background%22%3A%22%20-webkit-gradient(linear%2C%20left%20bottom%2C%20left%20top%2C%20from(%233f3b3b)%2C%20to(%23000000))%22%2C%22text-transform%22%3A%22%20capitalize%22%7D`,
            imdbId: "",
            type,
            linkList: links
          };
        } catch (err) {
          throwProviderError("111477", "metadata", err);
        }
      });
    };
  }
});

// providers/a111477/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/a111477/stream.ts"() {
    "use strict";
    init_providerErrors();
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: url
      }) {
        var _a;
        try {
          const stream = [];
          const fileExtension = ((_a = url.split(".").pop()) == null ? void 0 : _a.toLowerCase()) || "mp4";
          let streamType = "mp4";
          if (["mkv", "avi", "mov", "webm"].includes(fileExtension)) {
            streamType = fileExtension;
          }
          stream.push({
            server: "111477.xyz",
            link: url,
            type: streamType,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              Referer: "https://a.111477.xyz/"
            }
          });
          return stream;
        } catch (err) {
          throwProviderError("111477", "stream", err);
        }
      });
    };
  }
});

// providers/a111477/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/a111477/episodes.ts"() {
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
          const $ = cheerio.load(html);
          const episodeLinks = [];
          $("table tbody tr").each((i, element) => {
            const $row = $(element);
            const linkElement = $row.find("a[href]").first();
            const fileName = linkElement.text().trim();
            const fileLink = linkElement.attr("href");
            if (fileName && fileLink && fileName !== "../" && fileName !== "Parent Directory") {
              if (fileName.includes(".mp4") || fileName.includes(".mkv") || fileName.includes(".avi") || fileName.includes(".mov")) {
                const fullLink = new URL(fileLink, url).href;
                let episodeTitle = fileName;
                const episodeMatch = fileName.match(/[Ss](\d+)[Ee](\d+)/);
                const simpleEpisodeMatch = fileName.match(/[Ee](\d+)/);
                if (episodeMatch) {
                  episodeTitle = `S${episodeMatch[1]}E${episodeMatch[2]} - ${fileName}`;
                } else if (simpleEpisodeMatch) {
                  episodeTitle = `Episode ${simpleEpisodeMatch[1]} - ${fileName}`;
                } else {
                  const numberMatch = fileName.match(/(\d+)/);
                  if (numberMatch) {
                    episodeTitle = `Episode ${numberMatch[1]} - ${fileName}`;
                  }
                }
                episodeLinks.push({
                  title: episodeTitle,
                  link: fullLink
                });
              }
            }
          });
          return episodeLinks;
        } catch (err) {
          throwProviderError("111477", "episodes", err);
        }
      });
    };
  }
});

// providers/a111477/a111477.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
