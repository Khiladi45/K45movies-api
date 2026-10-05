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

// providers/movieBox/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/movieBox/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Trending",
        filter: "4"
      },
      {
        title: "Cinema",
        filter: "5"
      }
    ];
    genres = [];
  }
});

// providers/movieBox/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function extractSubjects(items) {
  var _a;
  const subjects = [];
  const seen = /* @__PURE__ */ new Set();
  for (const item of items) {
    if ((item == null ? void 0 : item.type) === "BANNER" && ((_a = item == null ? void 0 : item.banner) == null ? void 0 : _a.banners)) {
      for (const b of item.banner.banners) {
        const s = b == null ? void 0 : b.subject;
        if ((s == null ? void 0 : s.subjectId) && !seen.has(s.subjectId)) {
          seen.add(s.subjectId);
          subjects.push(s);
        }
      }
    }
    if (Array.isArray(item == null ? void 0 : item.subjects)) {
      for (const s of item.subjects) {
        if ((s == null ? void 0 : s.subjectId) && !seen.has(s.subjectId)) {
          seen.add(s.subjectId);
          subjects.push(s);
        }
      }
    }
  }
  return subjects;
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/movieBox/posts.ts"() {
    "use strict";
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        var _a, _b, _c;
        const posts = [];
        if (page > 1) {
          return posts;
        }
        const url = `/wefeed-mobile-bff/tab-operating?page=3&tabId=0&version=2fe0d7c224603ff7b0df294b46d3b84b`;
        const proxyUrl = `https://worker.zendax.me/api/moviebox?url=${encodeURIComponent(url)}`;
        const response = yield fetch(proxyUrl, { signal });
        const data = yield response.json();
        const items = ((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.items) || [];
        const subjects = extractSubjects(items);
        for (const item of subjects) {
          if (!(item == null ? void 0 : item.subjectId) || !(item == null ? void 0 : item.title)) continue;
          posts.push({
            image: ((_b = item == null ? void 0 : item.cover) == null ? void 0 : _b.url) || "",
            title: (_c = item == null ? void 0 : item.title) == null ? void 0 : _c.replace(/\s*\[.*?\]\s*$/, ""),
            link: `/wefeed-mobile-bff/subject-api/get?subjectId=${item == null ? void 0 : item.subjectId}`
          });
        }
        return posts;
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        var _a, _b, _c;
        const url = `/wefeed-mobile-bff/subject-api/search/v2`;
        if (page > 1) {
          return [];
        }
        const proxyUrl = `https://worker.zendax.me/api/moviebox?url=${encodeURIComponent(url)}&method=POST`;
        const response = yield fetch(proxyUrl, {
          signal,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            page: 1,
            perPage: 20,
            keyword: searchQuery,
            tabId: "Movie"
          })
        });
        const data = yield response.json();
        const list = ((_c = (_b = (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.results) == null ? void 0 : _b[0]) == null ? void 0 : _c.subjects) || [];
        const posts = list.map((item) => {
          var _a2;
          return {
            image: (_a2 = item == null ? void 0 : item.cover) == null ? void 0 : _a2.url,
            title: item == null ? void 0 : item.title,
            link: `/wefeed-mobile-bff/subject-api/get?subjectId=${item == null ? void 0 : item.subjectId}`
          };
        });
        return posts;
      });
    };
  }
});

// providers/movieBox/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/movieBox/meta.ts"() {
    "use strict";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b, _c;
        try {
          const { axios, cheerio } = providerContext;
          const links = [];
          const proxyUrl = `https://worker.zendax.me/api/moviebox?url=${encodeURIComponent(link)}`;
          const response = yield fetch(proxyUrl);
          const data = (yield response.json()).data;
          console.log("data", data);
          const title = ((data == null ? void 0 : data.title) || "").replace(/\s*\[.*?\]\s*$/, "");
          const synopsis = (data == null ? void 0 : data.description) || "";
          const image = ((_a = data == null ? void 0 : data.cover) == null ? void 0 : _a.url) || "";
          const rating = (data == null ? void 0 : data.imdbRatingValue) || "";
          const tags = ((_c = (_b = data == null ? void 0 : data.genre) == null ? void 0 : _b.split(",")) == null ? void 0 : _c.map((tag) => tag.trim())) || [];
          const dubs = (data == null ? void 0 : data.dubs) || [];
          dubs == null ? void 0 : dubs.forEach((dub) => {
            const link2 = {
              title: dub == null ? void 0 : dub.lanName,
              episodesLink: `/wefeed-mobile-bff/subject-api/resource?subjectId=${dub == null ? void 0 : dub.subjectId}&page=1&perPage=20&all=0&startPosition=1&endPosition=1&pagerMode=0&resolution=1080&se=1&epFrom=1`
            };
            links.push(link2);
          });
          console.log("meta", {
            title,
            synopsis,
            image,
            rating,
            tags,
            links
          });
          return {
            title,
            synopsis,
            image,
            rating,
            tags,
            imdbId: "",
            type: "movie",
            linkList: links
          };
        } catch (err) {
          console.error(err);
          return {
            title: "",
            synopsis: "",
            image: "",
            imdbId: "",
            type: "movie",
            linkList: []
          };
        }
      });
    };
  }
});

// providers/movieBox/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/movieBox/stream.ts"() {
    "use strict";
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link: url,
        type,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        try {
          const stream = [];
          const data = JSON.parse(url);
          stream.push({
            link: data.url,
            server: data.title || "Unknown Server",
            type: "mp4"
          });
          console.log("stream", stream);
          return stream;
        } catch (err) {
          console.log("getStream error", err);
          return [];
        }
      });
    };
  }
});

// providers/movieBox/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/movieBox/episodes.ts"() {
    "use strict";
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        var _a;
        const { axios, cheerio } = providerContext;
        try {
          const episodeLinks = [];
          const proxyUrl = `https://worker.zendax.me/api/moviebox?url=${encodeURIComponent(url)}`;
          const response = yield fetch(proxyUrl);
          const data = yield response.json();
          const list = ((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.list) || [];
          list.forEach((item) => {
            const seriesTitle = (item == null ? void 0 : item.ep) ? `S-${item == null ? void 0 : item.se} E-${item == null ? void 0 : item.ep}` : (item == null ? void 0 : item.title) || "";
            const episodesLink = (item == null ? void 0 : item.resourceLink) || "";
            if (episodesLink) {
              episodeLinks.push({
                title: seriesTitle.trim(),
                link: JSON.stringify({
                  url: episodesLink,
                  title: seriesTitle.trim()
                })
              });
            }
          });
          return episodeLinks;
        } catch (err) {
          console.error(err);
          return [];
        }
      });
    };
  }
});

// providers/movieBox/movieBox.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
