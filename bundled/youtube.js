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

// providers/youtube/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/youtube/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Trending", filter: "trending" },
      { title: "Music", filter: "trending music" },
      { title: "Gaming", filter: "trending gaming" },
      { title: "Movies & Trailers", filter: "official movie trailers" },
      { title: "News", filter: "world news" },
      { title: "Documentaries", filter: "documentary full" },
      { title: "Tech & Science", filter: "technology science" }
    ];
    genres = [
      { title: "Podcasts", filter: "popular podcasts" },
      { title: "Animation", filter: "animation short film" },
      { title: "Comedy", filter: "comedy standup" },
      { title: "Education", filter: "educational documentary" },
      { title: "Sports", filter: "sports highlights" },
      { title: "Nature", filter: "4k nature wildlife" }
    ];
  }
});

// providers/youtube/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function extractVideosFromData(data) {
  const posts = [];
  const seenIds = /* @__PURE__ */ new Set();
  function walk(obj) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    if (!obj || typeof obj !== "object") return;
    if (obj.videoRenderer) {
      const vr = obj.videoRenderer;
      const videoId = vr.videoId;
      if (videoId && !seenIds.has(videoId)) {
        seenIds.add(videoId);
        const title = ((_b = (_a = vr.title) == null ? void 0 : _a.runs) == null ? void 0 : _b.map((r) => r.text).join("")) || ((_c = vr.title) == null ? void 0 : _c.simpleText) || "";
        const channel = ((_e = (_d = vr.ownerText) == null ? void 0 : _d.runs) == null ? void 0 : _e.map((r) => r.text).join("")) || ((_g = (_f = vr.shortBylineText) == null ? void 0 : _f.runs) == null ? void 0 : _g.map((r) => r.text).join("")) || "";
        const views = ((_h = vr.shortViewCountText) == null ? void 0 : _h.simpleText) || ((_i = vr.viewCountText) == null ? void 0 : _i.simpleText) || "";
        const duration = ((_j = vr.lengthText) == null ? void 0 : _j.simpleText) || "";
        const image = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`;
        const tag = channel ? `${channel}${views ? ` \u2022 ${views}` : ""}` : views || void 0;
        posts.push({
          title: title.trim(),
          link: `https://www.youtube.com/watch?v=${videoId}`,
          image,
          aspectRatio: 16 / 9,
          borderRadius: 8,
          tag,
          cornerTag: duration || void 0
        });
      }
    }
    for (const key of Object.keys(obj)) {
      walk(obj[key]);
    }
  }
  walk(data);
  return posts;
}
var defaultHeaders, getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/youtube/posts.ts"() {
    "use strict";
    defaultHeaders = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9"
    };
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        providerContext
      }) {
        const { axios } = providerContext;
        try {
          const query = filter || "trending";
          const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
            query
          )}`;
          const res = yield axios.get(searchUrl, {
            headers: defaultHeaders
          });
          const match = res.data.match(/var ytInitialData\s*=\s*({.+?});<\/script>/) || res.data.match(/ytInitialData\s*=\s*({.+?});/);
          if (!match) return [];
          const data = JSON.parse(match[1]);
          const posts = extractVideosFromData(data);
          const pageSize = 20;
          const startIndex = (page - 1) * pageSize;
          if (startIndex >= posts.length) {
            return posts.slice(0, pageSize);
          }
          return posts.slice(startIndex, startIndex + pageSize);
        } catch (err) {
          console.error("YouTube getPosts error:", err);
          return [];
        }
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        providerContext
      }) {
        const { axios } = providerContext;
        try {
          const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
            searchQuery
          )}`;
          const res = yield axios.get(searchUrl, {
            headers: defaultHeaders
          });
          const match = res.data.match(/var ytInitialData\s*=\s*({.+?});<\/script>/) || res.data.match(/ytInitialData\s*=\s*({.+?});/);
          if (!match) return [];
          const data = JSON.parse(match[1]);
          const posts = extractVideosFromData(data);
          const pageSize = 20;
          const startIndex = (page - 1) * pageSize;
          if (startIndex >= posts.length) {
            return posts.slice(0, pageSize);
          }
          return posts.slice(startIndex, startIndex + pageSize);
        } catch (err) {
          console.error("YouTube getSearchPosts error:", err);
          return [];
        }
      });
    };
  }
});

// providers/youtube/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function extractVideoId(link) {
  const match = link.match(/(?:v=|\/watch\?v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/i) || link.match(/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : link;
}
function formatViews(rawCount) {
  const num = typeof rawCount === "number" ? rawCount : parseInt(rawCount, 10);
  if (isNaN(num) || num <= 0) return "";
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B views";
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M views";
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K views";
  }
  return num.toLocaleString() + " views";
}
function formatDuration(totalSeconds) {
  const sec = typeof totalSeconds === "number" ? totalSeconds : parseInt(totalSeconds, 10);
  if (isNaN(sec) || sec <= 0) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const h = Math.floor(m / 60);
  const remM = m % 60;
  if (h > 0) {
    return `${h}:${remM.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}
var defaultHeaders2, getMeta;
var init_meta = __esm({
  "providers/youtube/meta.ts"() {
    "use strict";
    defaultHeaders2 = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9"
    };
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a;
        const { axios, cheerio } = providerContext;
        const videoId = extractVideoId(link);
        const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
        try {
          const res = yield axios.get(watchUrl, { headers: defaultHeaders2 });
          const $ = cheerio.load(res.data);
          let title = $('meta[name="title"]').attr("content") || $('meta[property="og:title"]').attr("content") || $("title").text().replace(/ - YouTube$/, "").trim();
          let synopsis = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "";
          let channel = $('link[itemprop="name"]').attr("content") || $('span[itemprop="author"] link[itemprop="name"]').attr("content") || "";
          let formattedViewCount = "";
          let durationStr = "";
          let publishDateStr = "";
          let category = "";
          let likes = "";
          const prMatch = res.data.match(/var ytInitialPlayerResponse\s*=\s*({.+?});(?:var|<\/script>)/) || res.data.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
          if (prMatch) {
            try {
              const pr = JSON.parse(prMatch[1]);
              const details = pr.videoDetails;
              if (details) {
                title = details.title || title;
                synopsis = details.shortDescription || synopsis;
                channel = details.author || channel;
                if (details.viewCount) {
                  formattedViewCount = formatViews(details.viewCount);
                }
                if (details.lengthSeconds) {
                  durationStr = formatDuration(details.lengthSeconds);
                }
              }
              const micro = (_a = pr.microformat) == null ? void 0 : _a.playerMicroformatRenderer;
              if (micro) {
                if (micro.category) {
                  category = micro.category;
                }
                const pubDate = micro.publishDate || micro.uploadDate;
                if (pubDate) {
                  const dateObj = new Date(pubDate);
                  if (!isNaN(dateObj.getTime())) {
                    publishDateStr = dateObj.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    });
                  }
                }
              }
            } catch (e) {
            }
          }
          const dMatch = res.data.match(/var ytInitialData\s*=\s*({.+?});<\/script>/) || res.data.match(/ytInitialData\s*=\s*({.+?});/);
          if (dMatch) {
            try {
              let findLikes2 = function(obj) {
                if (!obj || typeof obj !== "object" || likes) return;
                if (obj.iconName === "LIKE" && typeof obj.title === "string") {
                  likes = obj.title.trim();
                  return;
                }
                if (obj.defaultText && typeof obj.defaultText.simpleText === "string" && /^[0-9.]+[KMB]?$/i.test(obj.defaultText.simpleText)) {
                  likes = obj.defaultText.simpleText.trim();
                  return;
                }
                for (const k of Object.keys(obj)) {
                  if (!likes) findLikes2(obj[k]);
                }
              };
              var findLikes = findLikes2;
              const data = JSON.parse(dMatch[1]);
              findLikes2(data);
            } catch (e) {
            }
          }
          if (!likes) {
            const regexMatch = res.data.match(/"iconName":"LIKE"[^}]*?"title":"([^"]+)"/);
            if (regexMatch) likes = regexMatch[1].trim();
          }
          const tags = [];
          if (formattedViewCount) tags.push(formattedViewCount);
          if (likes) tags.push(likes.toLowerCase().includes("like") ? likes : `${likes} likes`);
          if (durationStr) tags.push(`\u23F1 ${durationStr}`);
          if (publishDateStr) tags.push(publishDateStr);
          if (category) tags.push(category);
          const landscapeImage = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`;
          const fallbackImage = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          return {
            title: title || "YouTube Video",
            synopsis,
            image: landscapeImage || fallbackImage,
            poster: landscapeImage || fallbackImage,
            imdbId: "",
            type: "movie",
            cast: channel ? [channel] : void 0,
            tags: tags.length > 0 ? tags : void 0,
            rating: void 0,
            // Do not set rating to avoid "views/10" in the app UI
            linkList: [
              {
                title: "Watch Video",
                quality: "HD",
                directLinks: [
                  {
                    title: "Play Video",
                    link: `https://www.youtube.com/watch?v=${videoId}`,
                    type: "movie",
                    image: landscapeImage
                  }
                ]
              }
            ],
            webUrl: watchUrl
          };
        } catch (err) {
          console.error("YouTube getMeta error:", err);
          const landscapeImage = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`;
          return {
            title: "YouTube Video",
            synopsis: "",
            image: landscapeImage,
            poster: landscapeImage,
            imdbId: "",
            type: "movie",
            linkList: [
              {
                title: "Watch Video",
                quality: "HD",
                directLinks: [
                  {
                    title: "Play Video",
                    link: `https://www.youtube.com/watch?v=${videoId}`,
                    type: "movie"
                  }
                ]
              }
            ],
            webUrl: watchUrl
          };
        }
      });
    };
  }
});

// providers/youtube/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function extractVideoId2(link) {
  const match = link.match(/(?:v=|\/watch\?v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/i) || link.match(/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : link;
}
function getVisitorData(axios, kvStore) {
  return __async(this, null, function* () {
    const fallback = "CgtSdHczNXdoNzhqQSiYoJ7WBjIKCgJJThIEGgAgZGLfAgrcAjIyLllUPUpQRHNlLWd6ZzYwc3FRN2JRSGNlMzdJWHFlelQxLUZMd00yR3M5X1gxZUd4RWtRdUxyakphLS1iaU1LMk9fcU83MHl4cExXcFRKd3p2ckcxcGMyU0RBS3FmYXVPOGpnd1dpWUtUdU5rQ1pZZzFZeHh3UkFnRXYtNE9YR1gtaWhvd2RvblQ3dENIV0NmdDgtZU9Ibi04M2QtUlBoZlhoZGpyNjE4YlFGY0VWVU5UanJBZ2g0cVFCRXJWbktnQm4tV1Eydm1CNE5qTl9FajBQVV9TaFlsYkxEOGY3WFJaUGVNRnIzTzhoejEyMDJQQlJpRUwyX1gtV2N0WG1YRmFvLVYyZXRpTWJDSUZLaU9jNEZUTU1lSktrWVBKV1A0WlV5eFZYeTNPZUlFMS1XeXpaa1Y3T1dVVDE5SllHcTNSN0NFcE5HNTNFZElmcW9UVDdMYjV2N09mdw==";
    try {
      const cached = yield kvStore == null ? void 0 : kvStore.get("youtube_visitor_data");
      if (cached) return cached;
      const res = yield axios.get("https://www.youtube.com", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout: 3e3
      });
      const match = typeof (res == null ? void 0 : res.data) === "string" ? res.data.match(/"visitorData"\s*:\s*"([^"]+)"/) : null;
      if (match && match[1]) {
        yield kvStore == null ? void 0 : kvStore.set("youtube_visitor_data", match[1]);
        return match[1];
      }
    } catch (e) {
    }
    return fallback;
  });
}
function extractCaptions(data) {
  var _a, _b, _c, _d, _e, _f;
  const subtitles = [];
  const captionTracks = (_b = (_a = data == null ? void 0 : data.captions) == null ? void 0 : _a.playerCaptionsTracklistRenderer) == null ? void 0 : _b.captionTracks;
  if (Array.isArray(captionTracks)) {
    for (const c of captionTracks) {
      if (c.baseUrl) {
        const name = ((_e = (_d = (_c = c.name) == null ? void 0 : _c.runs) == null ? void 0 : _d[0]) == null ? void 0 : _e.text) || ((_f = c.name) == null ? void 0 : _f.simpleText) || c.languageCode;
        subtitles.push({
          title: name,
          language: c.languageCode || name,
          type: "text/vtt",
          uri: c.baseUrl.includes("fmt=") ? c.baseUrl : `${c.baseUrl}&fmt=vtt`
        });
      }
    }
  }
  return subtitles;
}
function fetchFromInnerTube(axios, kvStore, videoId, signal) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d;
    const streams = [];
    let subtitles = [];
    const visitorData = yield getVisitorData(axios, kvStore);
    try {
      const [visionRes, vrRes] = yield Promise.allSettled([
        axios.post(
          "https://www.youtube.com/youtubei/v1/player?prettyPrint=false&alt=json",
          {
            videoId,
            racyCheckOk: true,
            contentCheckOk: true,
            playbackContext: {
              contentPlaybackContext: {
                signatureTimestamp: 20731
              }
            },
            context: {
              client: {
                hl: "en",
                gl: "US",
                visitorData,
                clientName: "VISIONOS",
                clientVersion: "1.02",
                osName: "visionOS",
                osVersion: "26.5.23O471",
                platform: "MOBILE",
                deviceMake: "Apple",
                deviceModel: "RealityDevice17,1"
              }
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-YouTube-Client-Name": "101",
              "X-YouTube-Client-Version": "1.02",
              "X-Goog-Visitor-Id": visitorData,
              "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
              Origin: "https://www.youtube.com",
              Referer: `https://www.youtube.com/watch?v=${videoId}`
            },
            timeout: 5e3,
            signal
          }
        ),
        axios.post(
          "https://www.youtube.com/youtubei/v1/player?prettyPrint=false&alt=json",
          {
            videoId,
            racyCheckOk: true,
            contentCheckOk: true,
            playbackContext: {
              contentPlaybackContext: {
                signatureTimestamp: 20731
              }
            },
            context: {
              client: {
                clientName: "ANDROID_VR",
                clientVersion: "1.60.19",
                deviceMake: "Oculus",
                deviceModel: "Quest 3",
                platform: "MOBILE",
                hl: "en",
                gl: "US"
              }
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0 (Linux; Android 12; Quest 3) AppleWebKit/537.36"
            },
            timeout: 5e3,
            signal
          }
        )
      ]);
      const vData = visionRes.status === "fulfilled" ? (_a = visionRes.value) == null ? void 0 : _a.data : null;
      const vrData = vrRes.status === "fulfilled" ? (_b = vrRes.value) == null ? void 0 : _b.data : null;
      const masterUrl = (_c = vData == null ? void 0 : vData.streamingData) == null ? void 0 : _c.hlsManifestUrl;
      if (masterUrl) {
        streams.push({
          server: "YouTube HLS (Multi-Quality)",
          link: masterUrl,
          type: "m3u8",
          quality: "1080",
          tag: "Audio + Video"
        });
      }
      const formats = ((_d = vrData == null ? void 0 : vrData.streamingData) == null ? void 0 : _d.formats) || [];
      for (const f of formats) {
        if (f.url) {
          const qualityLabel = f.qualityLabel || "360p";
          streams.push({
            server: `YouTube (${qualityLabel} MP4)`,
            link: f.url,
            type: "mp4",
            quality: qualityLabel.replace("p", ""),
            tag: "Audio + Video"
          });
        }
      }
      subtitles = extractCaptions(vData) || extractCaptions(vrData) || [];
    } catch (e) {
    }
    return { streams, subtitles };
  });
}
function sortStreams(streams, preferredQuality, isDownload) {
  streams.sort((a, b) => {
    if (isDownload) {
      const aIsMp4 = a.type === "mp4";
      const bIsMp4 = b.type === "mp4";
      if (aIsMp4 && !bIsMp4) return -1;
      if (!aIsMp4 && bIsMp4) return 1;
    }
    if (!isDownload) {
      const aIsHls = a.server.includes("Multi-Quality") || a.type === "m3u8";
      const bIsHls = b.server.includes("Multi-Quality") || b.type === "m3u8";
      if (aIsHls && !bIsHls) return -1;
      if (!aIsHls && bIsHls) return 1;
    }
    if (preferredQuality && preferredQuality !== "auto") {
      const cleanPref = preferredQuality.replace("p", "");
      const aMatches = a.quality === cleanPref;
      const bMatches = b.quality === cleanPref;
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
    }
    const orderA = QUALITY_ORDER[a.quality || ""] || 99;
    const orderB = QUALITY_ORDER[b.quality || ""] || 99;
    return orderA - orderB;
  });
}
var QUALITY_ORDER, getStream;
var init_stream = __esm({
  "providers/youtube/stream.ts"() {
    "use strict";
    QUALITY_ORDER = {
      "2160": 1,
      "1440": 2,
      "1080": 3,
      "720": 4,
      "480": 5,
      "360": 6,
      "240": 7,
      "144": 8
    };
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        signal,
        providerContext,
        isDownload
      }) {
        const { axios, kvStore } = providerContext;
        const videoId = extractVideoId2(link);
        if (!videoId) return [];
        const preferredQuality = yield kvStore == null ? void 0 : kvStore.get("preferredQuality");
        const { streams, subtitles } = yield fetchFromInnerTube(
          axios,
          kvStore,
          videoId,
          signal
        );
        if (streams.length === 0) {
          return [];
        }
        const seenUrls = /* @__PURE__ */ new Set();
        const uniqueStreams = [];
        for (const s of streams) {
          if (!seenUrls.has(s.link)) {
            seenUrls.add(s.link);
            uniqueStreams.push(s);
          }
        }
        if (subtitles.length > 0) {
          for (const s of uniqueStreams) {
            if (!s.subtitles) {
              s.subtitles = subtitles;
            }
          }
        }
        sortStreams(uniqueStreams, preferredQuality, isDownload);
        return uniqueStreams;
      });
    };
  }
});

// providers/youtube/youtube.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
