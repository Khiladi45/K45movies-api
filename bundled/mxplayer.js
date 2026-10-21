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

// providers/mxplayer/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog
});
var catalog;
var init_catalog = __esm({
  "providers/mxplayer/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Hindi Movies",
        filter: "browseLangFilterIds=hi&type=1"
      },
      {
        title: "Telugu Movies",
        filter: "browseLangFilterIds=te&type=1"
      },
      {
        title: "Drama Shows",
        filter: "genreFilterIds=48efa872f6f17facebf6149dfc536ee1&type=2"
      },
      {
        title: "Crime Shows",
        filter: "genreFilterIds=b413dff55bdad743c577a8bea3b65044&type=2"
      },
      {
        title: "Thriller Shows",
        filter: "genreFilterIds=2dd5daf25be5619543524f360c73c3d8&type=2"
      }
    ];
  }
});

// providers/mxplayer/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function getUserID(axios) {
  return __async(this, null, function* () {
    try {
      const res = yield axios.get(MAIN_URL, { headers: defaultHeaders });
      const cookies = res.headers["set-cookie"];
      if (cookies) {
        for (const c of cookies) {
          if (c.includes("UserID=")) {
            const match = c.match(/UserID=([^;]+)/);
            return match ? match[1] : "";
          }
        }
      }
      return "";
    } catch (e) {
      return "";
    }
  });
}
function getPosts(_0) {
  return __async(this, arguments, function* ({
    filter,
    page = 1,
    providerContext
  }) {
    var _a;
    const { axios } = providerContext;
    const userId = yield getUserID(axios);
    const endParam = getEndParam(userId);
    const queryParams = filter || "browseLangFilterIds=hi&type=1";
    const url = `${API_URL}/detail/browseItem?pageNum=${page}&pageSize=20&isCustomized=true&${queryParams}${endParam}`;
    try {
      const res = yield axios.get(url, { headers: defaultHeaders });
      const items = ((_a = res.data) == null ? void 0 : _a.items) || [];
      return items.map((item) => mapItemToPost(item));
    } catch (err) {
      console.error("MPlayer getPosts error", err);
      return [];
    }
  });
}
function getSearchPosts(_0) {
  return __async(this, arguments, function* ({
    searchQuery,
    providerContext
  }) {
    var _a;
    const { axios } = providerContext;
    const userId = yield getUserID(axios);
    const endParam = getEndParam(userId);
    const url = `${API_URL}/search/resultv2?query=${encodeURIComponent(searchQuery)}${endParam}`;
    try {
      const res = yield axios.post(url, {}, { headers: defaultHeaders });
      const sections = ((_a = res.data) == null ? void 0 : _a.sections) || [];
      const posts = [];
      for (const section of sections) {
        const items = section.items || [];
        for (const item of items) {
          posts.push(mapItemToPost(item));
        }
      }
      return posts;
    } catch (err) {
      console.error("MPlayer search error", err);
      return [];
    }
  });
}
function mapItemToPost(item) {
  var _a;
  let image = "";
  if (item.imageInfo) {
    const portrait = item.imageInfo.find((i) => i.type === "portrait_large");
    if (portrait && portrait.url) {
      image = IMAGE_URL + portrait.url;
    } else {
      image = ((_a = item.imageInfo[0]) == null ? void 0 : _a.url) ? IMAGE_URL + item.imageInfo[0].url : "";
    }
  }
  return {
    title: item.title || "",
    image,
    // We use the shareUrl as the link, or build a web link. 
    // Kotlin passes the whole JSON, but here we pass the URL to be scraped in meta.
    link: item.shareUrl ? `${MAIN_URL}${item.shareUrl}` : ""
  };
}
var MAIN_URL, API_URL, IMAGE_URL, defaultHeaders, getEndParam;
var init_posts = __esm({
  "providers/mxplayer/posts.ts"() {
    "use strict";
    MAIN_URL = "https://www.mxplayer.in";
    API_URL = "https://api.mxplayer.in/v1/web";
    IMAGE_URL = "https://qqcdnpictest.mxplay.com/";
    defaultHeaders = {
      Referer: `${MAIN_URL}/`,
      Origin: MAIN_URL,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    };
    getEndParam = (userId) => `&device-density=2&userid=${userId}&platform=com.mxplay.desktop&content-languages=hi,en&kids-mode-enabled=false`;
  }
});

// providers/mxplayer/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function formatImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${IMAGE_URL2}${url.replace(/^\/+/, "")}`;
}
var defaultHeaders2, IMAGE_URL2, getMeta;
var init_meta = __esm({
  "providers/mxplayer/meta.ts"() {
    "use strict";
    defaultHeaders2 = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://www.mxplayer.in/"
    };
    IMAGE_URL2 = "https://qqcdnpictest.mxplay.com/";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b, _c, _d, _e;
        const { axios, cheerio } = providerContext;
        try {
          const res = yield axios.get(link, { headers: defaultHeaders2 });
          const $ = cheerio.load(res.data);
          let mxsEntity = null;
          $("script").each((_, el) => {
            var _a2;
            const text = $(el).html() || "";
            if (text.includes("window.__mxs__")) {
              try {
                const jsonText = text.replace(/^window\.__mxs__\s*=\s*/, "").replace(/;?\s*$/, "");
                const parsed = JSON.parse(jsonText);
                const entities = (parsed == null ? void 0 : parsed.entities) || {};
                const matchId = (_a2 = link.match(
                  /\/detail\/(?:movie|tvshow|show)\/([a-zA-Z0-9_-]+)/i
                )) == null ? void 0 : _a2[1];
                mxsEntity = matchId && entities[matchId] || Object.values(entities)[0];
              } catch (e) {
              }
            }
          });
          let image = "";
          if (mxsEntity) {
            const bannerImg = (_a = mxsEntity.titleContentImageInfo) == null ? void 0 : _a.find(
              (i) => {
                var _a2, _b2;
                return i.type === "banner_and_static_bg_desktop" || i.width >= 1280 || ((_a2 = i.url) == null ? void 0 : _a2.includes("1600x900")) || ((_b2 = i.url) == null ? void 0 : _b2.includes("1280x720"));
              }
            );
            if (bannerImg == null ? void 0 : bannerImg.url) {
              image = formatImageUrl(bannerImg.url);
            }
            if (!image) {
              const bigPic = (_b = mxsEntity.imageInfo) == null ? void 0 : _b.find(
                (i) => {
                  var _a2;
                  return i.type === "bigpic" || i.width >= 640 || i.type === "landscape" || ((_a2 = i.url) == null ? void 0 : _a2.includes("16x9"));
                }
              );
              if (bigPic == null ? void 0 : bigPic.url) {
                image = formatImageUrl(bigPic.url);
              }
            }
          }
          if (!image) {
            const ogImage = $('meta[property="og:image"]').attr("content") || $('meta[name="twitter:image"]').attr("content") || "";
            if (ogImage) {
              image = ogImage.includes("/320x180/") ? ogImage.replace("/320x180/", "/640x360/") : ogImage;
            }
          }
          let poster = "";
          if (mxsEntity) {
            const portrait = (_c = mxsEntity.imageInfo) == null ? void 0 : _c.find(
              (i) => {
                var _a2, _b2;
                return i.type === "portrait_large" || i.type === "portrait" || ((_a2 = i.url) == null ? void 0 : _a2.includes("2x3")) || ((_b2 = i.url) == null ? void 0 : _b2.includes("320x480"));
              }
            );
            if (portrait == null ? void 0 : portrait.url) {
              poster = formatImageUrl(portrait.url);
            }
          }
          let logo = void 0;
          if (mxsEntity) {
            const logoImg = (_d = mxsEntity.titleContentImageInfo) == null ? void 0 : _d.find(
              (i) => {
                var _a2;
                return i.type === "title_desktop" || ((_a2 = i.type) == null ? void 0 : _a2.includes("title"));
              }
            );
            if (logoImg == null ? void 0 : logoImg.url) {
              logo = formatImageUrl(logoImg.url);
            }
          }
          const title = (mxsEntity == null ? void 0 : mxsEntity.title) || $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content") || "";
          const synopsis = (mxsEntity == null ? void 0 : mxsEntity.description) || $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || $(".description").text().trim() || "";
          const rating = (mxsEntity == null ? void 0 : mxsEntity.rating) ? String(mxsEntity.rating) : void 0;
          const tags = (mxsEntity == null ? void 0 : mxsEntity.genres) || void 0;
          const cast = (_e = mxsEntity == null ? void 0 : mxsEntity.contributors) == null ? void 0 : _e.map((c) => c.name).filter(Boolean);
          let type = "movie";
          if ((mxsEntity == null ? void 0 : mxsEntity.type) === "tvshow" || (mxsEntity == null ? void 0 : mxsEntity.type) === "show" || link.includes("/tvshow/") || link.includes("/show/")) {
            type = "series";
          }
          const linkList = [];
          const seasonTabs = $("div.hs__items-container > div");
          if (seasonTabs.length > 0) {
            type = "series";
            seasonTabs.each((_, el) => {
              const tabId = $(el).attr("data-id");
              const tabText = $(el).text().trim();
              const tabIndex = $(el).attr("data-tab");
              if (tabId) {
                const seasonTitle = tabText || (tabIndex ? `Season ${tabIndex}` : "Season 1");
                linkList.push({
                  title: seasonTitle,
                  quality: "Standard",
                  episodesLink: tabId,
                  directLinks: []
                });
              }
            });
          }
          if (type === "movie" || linkList.length === 0) {
            linkList.push({
              title: "Movie",
              quality: "Default",
              episodesLink: link,
              directLinks: []
            });
          }
          return {
            title,
            synopsis,
            image,
            poster: poster || void 0,
            logo,
            imdbId: "",
            type,
            tags,
            cast,
            rating,
            linkList,
            webUrl: link
          };
        } catch (err) {
          console.error("MXPlayer Meta Error", err);
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

// providers/mxplayer/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function normalizeUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return ENDPOINT_URL + url;
}
var ENDPOINT_URL, API_URL2, getStream;
var init_stream = __esm({
  "providers/mxplayer/stream.ts"() {
    "use strict";
    ENDPOINT_URL = "https://d3sgzbosmwirao.cloudfront.net/";
    API_URL2 = "https://api.mxplayer.in/v1/web";
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        type,
        providerContext
      }) {
        var _a, _b, _c;
        const { axios } = providerContext;
        const streamLinks = [];
        let streamObj = null;
        if (link.startsWith("{")) {
          try {
            const data = JSON.parse(link);
            streamObj = data.stream;
          } catch (e) {
            console.error("Failed to parse stream JSON");
          }
        } else if (link.startsWith("http") && link.includes("mxplayer.in")) {
          try {
            const idMatch = link.match(/movie\/([a-zA-Z0-9]+)/);
            if (idMatch && idMatch[1]) {
              const id = idMatch[1];
              const apiUrl = `${API_URL2}/detail/tab/movierecommended?type=movie&id=${id}`;
              const res = yield axios.get(apiUrl, {
                headers: {
                  Referer: "https://www.mxplayer.in/",
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                }
              });
              streamObj = ((_c = (_b = (_a = res.data) == null ? void 0 : _a.items) == null ? void 0 : _b[0]) == null ? void 0 : _c.stream) || null;
            }
          } catch (e) {
            console.error("MX Movie API error", e);
          }
        }
        if (streamObj) {
          const extract = (obj, label) => {
            if (!obj) return;
            ["high", "base", "main"].forEach((q) => {
              const url = obj[q];
              if (url) {
                streamLinks.push({
                  server: `MX ${label.toUpperCase()} ${q}`,
                  link: normalizeUrl(url),
                  type: label === "hls" ? "m3u8" : "dash",
                  headers: {
                    Referer: "https://www.mxplayer.in/"
                  }
                });
              }
            });
          };
          if (streamObj.hls) extract(streamObj.hls, "hls");
          if (streamObj.dash) extract(streamObj.dash, "dash");
          if (streamObj.mxplay) {
            if (streamObj.mxplay.hls) extract(streamObj.mxplay.hls, "hls");
            if (streamObj.mxplay.dash) extract(streamObj.mxplay.dash, "dash");
          }
          if (streamObj.thirdParty) {
            if (streamObj.thirdParty.hlsUrl) {
              streamLinks.push({
                server: "ThirdParty HLS",
                link: normalizeUrl(streamObj.thirdParty.hlsUrl),
                type: "m3u8"
              });
            }
            if (streamObj.thirdParty.dashUrl) {
              streamLinks.push({
                server: "ThirdParty DASH",
                link: normalizeUrl(streamObj.thirdParty.dashUrl),
                type: "dash"
              });
            }
          }
        }
        return streamLinks;
      });
    };
  }
});

// providers/mxplayer/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var API_URL3, IMAGE_URL3, defaultHeaders3, getEpisodes;
var init_episodes = __esm({
  "providers/mxplayer/episodes.ts"() {
    "use strict";
    API_URL3 = "https://api.mxplayer.in/v1/web";
    IMAGE_URL3 = "https://qqcdnpictest.mxplay.com/";
    defaultHeaders3 = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      Referer: "https://www.mxplayer.in/"
    };
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        // This is either a Season ID (from meta) or a Web URL (for movies)
        providerContext
      }) {
        var _a, _b;
        const { axios } = providerContext;
        const isWebUrl = url.startsWith("http");
        if (isWebUrl) {
          return [{
            title: "Full Movie",
            link: url,
            // Pass the web URL to stream.ts
            image: ""
          }];
        }
        const seasonId = url;
        const episodes = [];
        let page = 0;
        let nextQuery = null;
        const userid = "";
        const endParam = `&device-density=2&userid=${userid}&platform=com.mxplay.desktop&content-languages=hi,en&kids-mode-enabled=false`;
        do {
          let apiUrl = `${API_URL3}/detail/tab/tvshowepisodes?type=season&id=${seasonId}&sortOrder=0${endParam}`;
          if (nextQuery) {
            apiUrl = `${API_URL3}/detail/tab/tvshowepisodes?type=season&${nextQuery}&id=${seasonId}&sortOrder=0${endParam}`;
          }
          try {
            const res = yield axios.get(apiUrl, { headers: defaultHeaders3 });
            const data = res.data;
            const items = data.items || [];
            for (const item of items) {
              const title = item.title || `Episode ${item.sequence}`;
              const imgPath = (_b = (_a = item.imageInfo) == null ? void 0 : _a[0]) == null ? void 0 : _b.url;
              const image = imgPath ? IMAGE_URL3 + imgPath : "";
              const streamData = JSON.stringify({
                stream: item.stream,
                videoHash: item.videoHash
                // sometimes needed
              });
              episodes.push({
                title,
                link: streamData,
                // We pass data, not a URL
                image
              });
            }
            nextQuery = data.next;
          } catch (e) {
            console.error("Error fetching episodes", e);
            break;
          }
        } while (nextQuery);
        return episodes;
      });
    };
  }
});

// providers/mxplayer/mxplayer.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
