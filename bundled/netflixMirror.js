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

// providers/netflixMirror/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/netflixMirror/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Only on Netflix",
        filter: "Only on Netflix"
      },
      {
        title: "New on Netflix",
        filter: "New on Netflix"
      },
      {
        title: "Blockbuster Movies",
        filter: "Blockbuster Movies"
      },
      {
        title: "US TV Shows Dubbed in Hindi",
        filter: "US TV Shows Dubbed in Hindi"
      }
    ];
    genres = [];
  }
});

// providers/netMirrorCommon.ts
var NEWTV_DOMAINS, NEWTV_BASE_HEADERS, cachedApiBase, resolveNewTvApiBase, buildNewTvHeaders, getPosterUrl, netMirrorSearch, netMirrorGetPosts, netMirrorGetMeta, netMirrorGetEpisodes, netMirrorGetStream;
var init_netMirrorCommon = __esm({
  "providers/netMirrorCommon.ts"() {
    "use strict";
    NEWTV_DOMAINS = [
      "aHR0cHM6Ly9tb2JpbGVkZXRlY3RzLmNvbQ==",
      // https://mobiledetects.com
      "aHR0cHM6Ly9tb2JpbGVkZXRlY3QuYXBw",
      // https://mobiledetect.app
      "aHR0cHM6Ly9tb2JpZGV0ZWN0LmFydA==",
      // https://mobidetect.art
      "aHR0cHM6Ly9tb2JpZGV0ZWN0LmNj",
      // https://mobidetect.cc
      "aHR0cHM6Ly9tb2JpZGV0ZWN0LmNsaWNr",
      // https://mobidetect.click
      "aHR0cHM6Ly9tb2JpZGV0ZWN0Lmluaw==",
      // https://mobidetect.ink
      "aHR0cHM6Ly9tb2JpZGV0ZWN0LmxpdmU=",
      // https://mobidetect.live
      "aHR0cHM6Ly9tb2JpZGV0ZWN0LnBybw==",
      // https://mobidetect.pro
      "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNob3A=",
      // https://mobidetect.shop
      "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNpdGU=",
      // https://mobidetect.site
      "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNwYWNl",
      // https://mobidetect.space
      "aHR0cHM6Ly9tb2JpZGV0ZWN0LnN0b3Jl",
      // https://mobidetect.store
      "aHR0cHM6Ly9tb2JpZGV0ZWN0LnZpcA==",
      // https://mobidetect.vip
      "aHR0cHM6Ly9tb2JpZGV0ZWN0Lndpa2k=",
      // https://mobidetect.wiki
      "aHR0cHM6Ly9tb2JpZGV0ZWN0Lnh5eg==",
      // https://mobidetect.xyz
      "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5hcnQ=",
      // https://mobidetects.art
      "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5jYw==",
      // https://mobidetects.cc
      "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5pbmZv",
      // https://mobidetects.info
      "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5pbms=",
      // https://mobidetects.ink
      "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5saXZl",
      // https://mobidetects.live
      "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5wcm8=",
      // https://mobidetects.pro
      "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5zdG9yZQ==",
      // https://mobidetects.store
      "aHR0cHM6Ly9tb2JpZGV0ZWN0cy50b3A=",
      // https://mobidetects.top
      "aHR0cHM6Ly9tb2JpZGV0ZWN0cy54eXo="
      // https://mobidetects.xyz
    ];
    NEWTV_BASE_HEADERS = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "X-Requested-With": "NetmirrorNewTV v1.0",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0 /OS.GatuNewTV v1.0",
      Accept: "application/json, text/plain, */*"
    };
    cachedApiBase = null;
    resolveNewTvApiBase = (providerContext) => __async(null, null, function* () {
      var _a;
      if (cachedApiBase) return cachedApiBase;
      const { axios } = providerContext;
      for (const encoded of NEWTV_DOMAINS) {
        try {
          const base = Buffer.from(encoded, "base64").toString("utf-8").trim();
          const res = yield axios.get(`${base}/checknewtv.php`, {
            headers: NEWTV_BASE_HEADERS,
            timeout: 4e3
          });
          if ((_a = res.data) == null ? void 0 : _a.token_hash) {
            const decoded = Buffer.from(res.data.token_hash, "base64").toString("utf-8").trim();
            if (decoded.startsWith("http")) {
              cachedApiBase = decoded.replace(/\/+$/, "");
              return cachedApiBase;
            }
          }
        } catch (e) {
          continue;
        }
      }
      throw new Error("Failed to resolve NewTV API base URL");
    });
    buildNewTvHeaders = (ott, extra = {}) => __spreadValues(__spreadProps(__spreadValues({}, NEWTV_BASE_HEADERS), {
      Ott: ott
    }), extra);
    getPosterUrl = (id, prefix) => {
      if (prefix === "pv") {
        return id.length > 10 ? `https://imgcdn.kim/pv/v/350/${id}.jpg` : `https://imgcdn.kim/pv/341/${id}.jpg`;
      }
      if (prefix === "hs") {
        return `https://imgcdn.kim/hs/v/166/${id}.jpg`;
      }
      return `https://imgcdn.kim/poster/v/${id}.jpg`;
    };
    netMirrorSearch = (_0) => __async(null, [_0], function* ({
      searchQuery,
      page,
      prefix,
      signal,
      providerContext
    }) {
      var _a, _b, _c;
      try {
        if (page > 1) return [];
        const { axios } = providerContext;
        const apiBase = yield resolveNewTvApiBase(providerContext);
        const query = searchQuery == null ? void 0 : searchQuery.trim();
        if (!query) return [];
        const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
        const url = `${apiBase}/newtv/search.php?s=${encodeURIComponent(query)}`;
        const res = yield axios.get(url, {
          signal,
          headers: buildNewTvHeaders(ottHeader),
          timeout: 8e3
        });
        const results = ((_a = res.data) == null ? void 0 : _a.searchResult) || [];
        const catalog2 = [];
        const template = ((_b = res.data) == null ? void 0 : _b.imgcdn) || ((_c = res.data) == null ? void 0 : _c.detailsimgcdn);
        for (const item of results) {
          const id = item == null ? void 0 : item.id;
          const title = (item == null ? void 0 : item.t) || "";
          if (!id) continue;
          const image = template ? `${template.replace(/\/+$/, "")}/${id}.jpg` : getPosterUrl(id, prefix);
          const link = `${id}|${prefix}|${encodeURIComponent(title)}`;
          catalog2.push({
            title,
            link,
            image,
            tag: (item == null ? void 0 : item.y) || ((item == null ? void 0 : item.r) && item.r !== "Series" ? item.r : void 0),
            aspectRatio: prefix === "pv" ? 16 / 9 : void 0
          });
        }
        return catalog2;
      } catch (err) {
        console.error(`netMirrorSearch error [${prefix}]:`, err);
        return [];
      }
    });
    netMirrorGetPosts = (_0) => __async(null, [_0], function* ({
      filter,
      page,
      prefix,
      signal,
      providerContext
    }) {
      return netMirrorSearch({
        searchQuery: filter,
        page,
        prefix,
        signal,
        providerContext
      });
    });
    netMirrorGetMeta = (_0) => __async(null, [_0], function* ({
      link,
      prefix: defaultPrefix,
      providerContext
    }) {
      const { axios } = providerContext;
      const apiBase = yield resolveNewTvApiBase(providerContext);
      let id = "";
      let prefix = defaultPrefix;
      let titleFromLink = "";
      if (link.includes("|")) {
        const parts = link.split("|");
        id = parts[0];
        prefix = parts[1] || defaultPrefix;
        if (parts[2]) {
          try {
            titleFromLink = decodeURIComponent(parts[2]);
          } catch (e) {
            titleFromLink = parts[2];
          }
        }
      } else {
        id = link;
      }
      const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
      const url = `${apiBase}/newtv/post.php?id=${id}`;
      let title = titleFromLink;
      let synopsis = "";
      let image = getPosterUrl(id, prefix);
      let poster = prefix === "pv" ? `https://imgcdn.kim/pv/v/${id}.jpg` : void 0;
      let cast = [];
      const tags = [];
      let imdbId = "";
      let type = "movie";
      const linkList = [];
      try {
        const res = yield axios.get(url, {
          headers: buildNewTvHeaders(ottHeader, { Lastep: "", Usertoken: "" }),
          timeout: 8e3
        });
        const data = res.data;
        if (data) {
          title = data.title || data.title_name || title;
          synopsis = data.desc || "";
          if (data.year) tags.push(String(data.year));
          if (typeof data.genre === "string") {
            data.genre.split(",").forEach((g) => {
              const trimmed = g.trim();
              if (trimmed) tags.push(trimmed);
            });
          }
          if (typeof data.match === "string" && data.match.includes("IMDb")) {
            tags.push(data.match);
          }
          if (typeof data.cast === "string") {
            cast = data.cast.split(",").map((c) => c.trim()).filter(Boolean);
          }
          const hasActualEpisodes = Array.isArray(data.episodes) && data.episodes.some((ep) => ep == null ? void 0 : ep.id);
          if (Array.isArray(data.season) && data.season.length > 0) {
            type = "series";
            data.season.forEach((s) => {
              const sNum = String(s.s || s.name || "1").replace(/[^0-9]/g, "") || "1";
              linkList.push({
                title: `Season ${s.s || s.name || "1"}`,
                episodesLink: `${s.id}|${id}|${prefix}|${encodeURIComponent(title)}|${sNum}`
              });
            });
          } else if (hasActualEpisodes) {
            type = "series";
            linkList.push({
              title: "Season 1",
              episodesLink: `${id}|${id}|${prefix}|${encodeURIComponent(title)}|1`
            });
          } else {
            type = "movie";
            linkList.push({
              title: title || "Movie",
              directLinks: [
                {
                  title: title || "Movie",
                  link: `${id}|${prefix}|${encodeURIComponent(title)}`,
                  type: "movie"
                }
              ]
            });
          }
        }
      } catch (err) {
        console.error(`netMirrorGetMeta error [${prefix}]:`, err);
      }
      if (linkList.length === 0) {
        linkList.push({
          title: title || "Movie",
          directLinks: [
            {
              title: title || "Movie",
              link: `${id}|${prefix}|${encodeURIComponent(title)}`,
              type: "movie"
            }
          ]
        });
      }
      return {
        title: title || "Unknown Title",
        synopsis: synopsis || "",
        image: image || "",
        poster,
        imdbId,
        type,
        cast: cast.length > 0 ? cast : void 0,
        tags: tags.length > 0 ? tags : void 0,
        linkList
      };
    });
    netMirrorGetEpisodes = (_0) => __async(null, [_0], function* ({
      seasonId,
      prefix: defaultPrefix,
      signal,
      providerContext
    }) {
      const { axios } = providerContext;
      const apiBase = yield resolveNewTvApiBase(providerContext);
      let sid = seasonId;
      let seriesId = seasonId;
      let prefix = defaultPrefix;
      let seriesTitle = "";
      let seasonNumber = 1;
      if (seasonId.includes("|")) {
        const parts = seasonId.split("|");
        sid = parts[0];
        seriesId = parts[1] || sid;
        prefix = parts[2] || defaultPrefix;
        if (parts[3]) {
          try {
            seriesTitle = decodeURIComponent(parts[3]);
          } catch (e) {
            seriesTitle = parts[3];
          }
        }
        if (parts[4]) {
          seasonNumber = parseInt(parts[4], 10) || 1;
        }
      }
      const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
      const episodeList = [];
      let page = 1;
      let hasMorePages = true;
      while (hasMorePages && page <= 6) {
        try {
          const url = `${apiBase}/newtv/episodes.php?id=${sid}&page=${page}`;
          const res = yield axios.get(url, {
            signal,
            headers: buildNewTvHeaders(ottHeader),
            timeout: 8e3
          });
          const data = res.data;
          if (Array.isArray(data == null ? void 0 : data.episodes) && data.episodes.length > 0) {
            data.episodes.forEach((episode) => {
              const epNum = String((episode == null ? void 0 : episode.ep) || "").replace(/[^0-9]/g, "").trim() || `${episodeList.length + 1}`;
              const sNum = String((episode == null ? void 0 : episode.s) || "").replace(/[^0-9]/g, "").trim() || `${seasonNumber}`;
              const epTitle = (episode == null ? void 0 : episode.t) ? `Episode ${epNum}: ${episode.t}` : `Episode ${epNum}`;
              episodeList.push({
                title: epTitle,
                link: `${episode == null ? void 0 : episode.id}|${prefix}|${encodeURIComponent(seriesTitle)}|${sNum}|${epNum}`,
                description: (episode == null ? void 0 : episode.ep_desc) || void 0
              });
            });
            if ((data == null ? void 0 : data.nextPageShow) && data.nextPageShow > 0) {
              page++;
            } else {
              hasMorePages = false;
            }
          } else {
            hasMorePages = false;
          }
        } catch (err) {
          console.error(`netMirrorGetEpisodes error [${prefix}]:`, err);
          break;
        }
      }
      if (episodeList.length === 0 && sid) {
        episodeList.push({
          title: "Episode 1",
          link: `${sid}|${prefix}|${encodeURIComponent(seriesTitle)}|${seasonNumber}|1`
        });
      }
      return episodeList;
    });
    netMirrorGetStream = (_0) => __async(null, [_0], function* ({
      id: rawId,
      type,
      prefix: defaultPrefix,
      signal,
      providerContext,
      isDownload
    }) {
      var _a;
      const { axios } = providerContext;
      const apiBase = yield resolveNewTvApiBase(providerContext);
      let id = rawId;
      let prefix = defaultPrefix;
      if (rawId.includes("|")) {
        const parts = rawId.split("|");
        id = parts[0];
        prefix = parts[1] || defaultPrefix;
      }
      const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
      const serverName = prefix === "hs" ? "Disney+" : prefix === "pv" ? "Prime Video" : "Netflix";
      const streamLinks = [];
      try {
        const url = `${apiBase}/newtv/player.php?id=${id}`;
        const res = yield axios.get(url, {
          signal,
          headers: buildNewTvHeaders(ottHeader, { Usertoken: "" }),
          timeout: 8e3
        });
        const data = res.data;
        if (data && data.status === "ok" && data.video_link) {
          try {
            const m3u8Res = yield axios.get(data.video_link, {
              signal,
              headers: { Referer: data.referer || apiBase },
              timeout: 5e3
            });
            const m3u8Text = typeof m3u8Res.data === "string" ? m3u8Res.data : "";
            if (m3u8Text.includes("#EXT-X-STREAM-INF")) {
              const lines = m3u8Text.split("\n");
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith("#EXT-X-STREAM-INF")) {
                  const nextLine = (_a = lines[i + 1]) == null ? void 0 : _a.trim();
                  if (nextLine && nextLine.startsWith("http")) {
                    let quality = "1080";
                    if (line.includes("1280x720") || nextLine.includes("720p")) quality = "720";
                    else if (line.includes("854x480") || nextLine.includes("480p")) quality = "480";
                    else if (line.includes("640x360") || nextLine.includes("360p")) quality = "360";
                    streamLinks.push({
                      server: `${serverName} HLS (${quality}p)`,
                      link: nextLine,
                      type: "m3u8",
                      quality,
                      headers: {
                        Referer: data.referer || apiBase,
                        Origin: apiBase
                      }
                    });
                  }
                }
              }
            } else {
              streamLinks.push({
                server: `${serverName} HLS`,
                link: data.video_link,
                type: "m3u8",
                quality: "1080",
                headers: {
                  Referer: data.referer || apiBase,
                  Origin: apiBase
                }
              });
            }
          } catch (e) {
            streamLinks.push({
              server: `${serverName} HLS`,
              link: data.video_link,
              type: "m3u8",
              quality: "1080",
              headers: {
                Referer: data.referer || apiBase,
                Origin: apiBase
              }
            });
          }
        }
      } catch (err) {
        console.error(`netMirrorGetStream error [${prefix}]:`, err);
      }
      streamLinks.sort((a, b) => {
        const qA = parseInt(a.quality || "0", 10);
        const qB = parseInt(b.quality || "0", 10);
        return qB - qA;
      });
      return streamLinks;
    });
  }
});

// providers/netflixMirror/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/netflixMirror/posts.ts"() {
    "use strict";
    init_netMirrorCommon();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        providerValue,
        signal,
        providerContext
      }) {
        return netMirrorGetPosts({
          filter,
          page,
          prefix: "",
          providerValue,
          signal,
          providerContext
        });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        providerValue,
        signal,
        providerContext
      }) {
        return netMirrorSearch({
          searchQuery,
          page,
          prefix: "",
          providerValue,
          signal,
          providerContext
        });
      });
    };
  }
});

// providers/netflixMirror/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/netflixMirror/meta.ts"() {
    "use strict";
    init_netMirrorCommon();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        return netMirrorGetMeta({
          link,
          prefix: "",
          providerContext
        });
      });
    };
  }
});

// providers/netflixMirror/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/netflixMirror/stream.ts"() {
    "use strict";
    init_netMirrorCommon();
    getStream = (_0) => __async(null, [_0], function* ({
      link: id,
      type,
      signal,
      providerContext,
      isDownload
    }) {
      return netMirrorGetStream({
        id,
        type,
        prefix: "",
        signal,
        providerContext,
        isDownload
      });
    });
  }
});

// providers/netflixMirror/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/netflixMirror/episodes.ts"() {
    "use strict";
    init_netMirrorCommon();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url: link,
        providerContext
      }) {
        return netMirrorGetEpisodes({
          seasonId: link,
          prefix: "",
          providerContext
        });
      });
    };
  }
});

// providers/netflixMirror/netflixMirror.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
