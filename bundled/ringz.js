var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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

// providers/ringz/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/ringz/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Movies",
        filter: "MOVIES"
      },
      {
        title: "TV Shows",
        filter: "SERIES"
      },
      {
        title: "Anime",
        filter: "ANIME"
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

// providers/ringz/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getRingzAdult: () => getRingzAdult,
  getRingzAnime: () => getRingzAnime,
  getRingzMovies: () => getRingzMovies,
  getRingzShows: () => getRingzShows,
  getSearchPosts: () => getSearchPosts,
  headers: () => headers,
  ringzData: () => ringzData
});
function posts(_0) {
  return __async(this, arguments, function* ({
    filter
    // signal,
  }) {
    try {
      let response;
      if (filter === "MOVIES") {
        response = getRingzMovies();
      }
      if (filter === "SERIES") {
        response = getRingzShows();
      }
      if (filter === "ANIME") {
        response = getRingzAnime();
      }
      const data = yield response;
      const catalog2 = [];
      data.map((element) => {
        const title = (element == null ? void 0 : element.kn) || (element == null ? void 0 : element.mn);
        const link = JSON.stringify(element);
        const image = element == null ? void 0 : element.IV;
        if (title && link) {
          catalog2.push({
            title,
            link,
            image
          });
        }
      });
      return catalog2;
    } catch (err) {
      throwProviderError("Ringz", "posts", err);
    }
  });
}
function getRingzMovies() {
  return __async(this, null, function* () {
    const url = `${BASE_URL}/test.json`;
    try {
      const response = yield fetch(url, {
        headers: __spreadValues({}, headers)
      });
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} ${response.statusText} | URL ${url}`
        );
      }
      const data = yield response.json();
      return data.AllMovieDataList;
    } catch (error) {
      throwProviderError("Ringz", "fetch movies", error);
    }
  });
}
function getRingzShows() {
  return __async(this, null, function* () {
    const url = `${BASE_URL}/srs.json`;
    try {
      const response = yield fetch(url, {
        headers: __spreadValues({}, headers)
      });
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} ${response.statusText} | URL ${url}`
        );
      }
      const data = yield response.json();
      return data.webSeriesDataList;
    } catch (error) {
      throwProviderError("Ringz", "fetch shows", error);
    }
  });
}
function getRingzAnime() {
  return __async(this, null, function* () {
    const url = `${BASE_URL}/anime.json`;
    try {
      const response = yield fetch(url, {
        headers: __spreadValues({}, headers)
      });
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} ${response.statusText} | URL ${url}`
        );
      }
      const data = yield response.json();
      return data.webSeriesDataList;
    } catch (error) {
      throwProviderError("Ringz", "fetch anime", error);
    }
  });
}
function getRingzAdult() {
  return __async(this, null, function* () {
    const url = `${BASE_URL}/desihub.json`;
    try {
      const response = yield fetch(url, {
        headers: __spreadValues({}, headers)
      });
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} ${response.statusText} | URL ${url}`
        );
      }
      const data = yield response.json();
      return data.webSeriesDataList;
    } catch (error) {
      throwProviderError("Ringz", "fetch adult catalog", error);
    }
  });
}
var getPosts, getSearchPosts, headers, BASE_URL, ringzData;
var init_posts = __esm({
  "providers/ringz/posts.ts"() {
    "use strict";
    init_providerErrors();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        signal,
        providerContext
      }) {
        return posts({ filter, signal, providerContext });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page
        // providerContext,
      }) {
        if (page > 1) return [];
        function searchData(data, query) {
          const searchQuery2 = query.toLowerCase();
          return data.filter((movie) => {
            const movieName = movie.mn.toLowerCase();
            return movieName.includes(searchQuery2);
          });
        }
        try {
          const catalog2 = [];
          const promises = [getRingzMovies(), getRingzShows(), getRingzAnime()];
          const responses = yield Promise.all(promises);
          responses.map((response) => {
            const searchResults = searchData(response, searchQuery);
            searchResults.map((element) => {
              const title = (element == null ? void 0 : element.kn) || (element == null ? void 0 : element.mn);
              const link = JSON.stringify(element);
              const image = element == null ? void 0 : element.IV;
              if (title && link) {
                catalog2.push({
                  title,
                  link,
                  image
                });
              }
            });
          });
          return catalog2;
        } catch (err) {
          throwProviderError("Ringz", "search posts", err);
        }
      });
    };
    headers = {
      "cf-access-client-id": "833049b087acf6e787cedfd85d1ccdb8.access",
      "cf-access-client-secret": "02db296a961d7513c3102d7785df4113eff036b2d57d060ffcc2ba3ba820c6aa"
    };
    BASE_URL = "https://privatereporz.pages.dev";
    ringzData = {
      getRingzMovies,
      getRingzShows,
      getRingzAnime,
      getRingzAdult
    };
  }
});

// providers/ringz/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/ringz/meta.ts"() {
    "use strict";
    init_providerErrors();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link: data
      }) {
        var _a, _b;
        try {
          const dataJson = JSON.parse(data);
          const title = (dataJson == null ? void 0 : dataJson.kn) || (dataJson == null ? void 0 : dataJson.mn);
          const image = (dataJson == null ? void 0 : dataJson.IH) || (dataJson == null ? void 0 : dataJson.IV);
          const tags = dataJson == null ? void 0 : dataJson.gn.split(",").slice(0, 3).map((tag) => tag.trim());
          const type = (dataJson == null ? void 0 : dataJson.cg) === "webSeries" ? "series" : "movie";
          const linkList = [];
          if ((dataJson == null ? void 0 : dataJson.cg) === "webSeries") {
            (_a = ["1", "2", "3", "4"]) == null ? void 0 : _a.forEach((item) => {
              var _a2;
              const directLinks = [];
              if (typeof (dataJson == null ? void 0 : dataJson["eServer" + item]) === "object" && ((_a2 = Object == null ? void 0 : Object.keys(dataJson == null ? void 0 : dataJson["eServer" + item])) == null ? void 0 : _a2.length) > 0) {
                Object.keys(dataJson == null ? void 0 : dataJson["eServer" + item]).forEach((key) => {
                  directLinks.push({
                    title: "Episode " + key,
                    link: JSON.stringify({
                      url: dataJson == null ? void 0 : dataJson["eServer" + item][key],
                      server: "Server " + item
                    })
                  });
                });
                linkList.push({
                  title: (dataJson == null ? void 0 : dataJson.pn) + " (Server " + item + ")",
                  directLinks
                });
              }
            });
          } else {
            const directLinks = [];
            (_b = ["1", "2", "3", "4"]) == null ? void 0 : _b.forEach((item) => {
              if (dataJson == null ? void 0 : dataJson["s" + item]) {
                directLinks.push({
                  title: "Server " + item + " (HD)",
                  link: JSON.stringify({
                    url: dataJson == null ? void 0 : dataJson.s1,
                    server: "Server " + item
                  })
                });
              }
              if (dataJson == null ? void 0 : dataJson["4s" + item]) {
                directLinks.push({
                  title: "Server " + item + " (480p)",
                  link: JSON.stringify({
                    url: dataJson == null ? void 0 : dataJson["4s" + item],
                    server: "Server " + item
                  })
                });
              }
            });
            linkList.push({
              title: dataJson == null ? void 0 : dataJson.pn,
              directLinks
            });
          }
          return {
            title,
            image,
            imdbId: "",
            synopsis: "",
            type,
            linkList,
            tags
          };
        } catch (err) {
          throwProviderError("Ringz", "metadata", err);
        }
      });
    };
  }
});

// providers/ringz/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/ringz/stream.ts"() {
    "use strict";
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: data
      }) {
        const streamLinks = [];
        const dataJson = JSON.parse(data);
        streamLinks.push({
          link: dataJson.url,
          server: dataJson.server,
          type: "mkv"
        });
        return streamLinks;
      });
    };
  }
});

// providers/ringz/ringz.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
