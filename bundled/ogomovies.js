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

// providers/ogomovies/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog
});
var catalog;
var init_catalog = __esm({
  "providers/ogomovies/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Trending",
        filter: ""
      },
      {
        title: "Movies",
        filter: "genre/hollywood/"
      }
    ];
  }
});

// providers/ogomovies/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function getPosts(_0) {
  return __async(this, arguments, function* ({
    filter,
    page = 1,
    signal,
    providerContext
  }) {
    return fetchPosts({ filter, page, query: "", signal, providerContext });
  });
}
function getSearchPosts(_0) {
  return __async(this, arguments, function* ({
    searchQuery,
    page = 1,
    signal,
    providerContext
  }) {
    return fetchPosts({ filter: "", page, query: searchQuery, signal, providerContext });
  });
}
function fetchPosts(_0) {
  return __async(this, arguments, function* ({
    filter,
    query,
    page = 1,
    signal,
    providerContext
  }) {
    try {
      const baseUrl = "https://ogomovies.mobi";
      let url;
      if (query && query.trim()) {
        const encodedQuery = encodeURIComponent(query.trim());
        url = page > 1 ? `${baseUrl}/search-query/${encodedQuery}/page/${page}/` : `${baseUrl}/search-query/${encodedQuery}/`;
      } else if (filter) {
        url = filter.startsWith("/") ? `${baseUrl}${filter.replace(/\/$/, "")}${page > 1 ? `/page/${page}` : ""}` : `${baseUrl}/${filter}${page > 1 ? `/page/${page}` : ""}`;
      } else {
        url = `${baseUrl}${page > 1 ? `/page/${page}` : ""}`;
      }
      const { axios, cheerio } = providerContext;
      const res = yield axios.get(url, { headers: defaultHeaders, signal });
      const $ = cheerio.load(res.data || "");
      const resolveUrl = (href) => (href == null ? void 0 : href.startsWith("http")) ? href : new URL(href, baseUrl).href;
      const seen = /* @__PURE__ */ new Set();
      const catalog2 = [];
      $(".ml-item").each((_, el) => {
        var _a;
        const anchor = $(el).find("a.ml-mask");
        let link = anchor.attr("href") || "";
        if (!link) return;
        link = resolveUrl(link);
        if (seen.has(link)) return;
        const title = ((_a = anchor.attr("title")) == null ? void 0 : _a.trim()) || anchor.find("h2").text().trim() || "";
        let img = anchor.find("img").attr("data-original") || anchor.find("img").attr("src") || "";
        const image = img ? resolveUrl(img) : "";
        if (!title || !image) return;
        seen.add(link);
        catalog2.push({ title, link, image });
      });
      return catalog2.slice(0, 100);
    } catch (err) {
      console.error(
        "fetchPosts error:",
        err instanceof Error ? err.message : String(err)
      );
      return [];
    }
  });
}
var defaultHeaders;
var init_posts = __esm({
  "providers/ogomovies/posts.ts"() {
    "use strict";
    defaultHeaders = {
      Referer: "https://www.google.com",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Pragma: "no-cache",
      "Cache-Control": "no-cache"
    };
  }
});

// providers/ogomovies/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function getDownloadLinks(watchUrl, movieTitle, providerContext) {
  return __async(this, null, function* () {
    const { axios, cheerio } = providerContext;
    const finalLinks = [];
    try {
      let response = yield axios.get(watchUrl, { headers });
      let $ = cheerio.load(response.data);
      const serverLink = $('li[data-server="3"][data-putload]').attr("data-putload");
      if (!serverLink) {
        console.log("Failed to find server link (data-putload) on watch page.");
        return finalLinks;
      }
      response = yield axios.get(serverLink, { headers: __spreadProps(__spreadValues({}, headers), { Referer: watchUrl }) });
      $ = cheerio.load(response.data);
      const linkGateUrl = $(".content-pt a button").parent().attr("href");
      if (!linkGateUrl) {
        console.log("Failed to find link gate URL on server page.");
        return finalLinks;
      }
      response = yield axios.get(linkGateUrl, { headers: __spreadProps(__spreadValues({}, headers), { Referer: serverLink }) });
      $ = cheerio.load(response.data);
      const finalDownloadPageUrl = $(".video-container iframe").attr("src");
      if (!finalDownloadPageUrl) {
        console.log("Failed to find final download page URL (iframe src).");
        return finalLinks;
      }
      response = yield axios.get(finalDownloadPageUrl, { headers: __spreadProps(__spreadValues({}, headers), { Referer: linkGateUrl }) });
      $ = cheerio.load(response.data);
      const cdnLinkUrl = $(".content-pt a button").parent().attr("href");
      if (!cdnLinkUrl) {
        console.log("Failed to find CDN link URL on final download page.");
        return finalLinks;
      }
      response = yield axios.get(cdnLinkUrl, { headers: __spreadProps(__spreadValues({}, headers), { Referer: finalDownloadPageUrl }) });
      $ = cheerio.load(response.data);
      $('button[onclick^="download_video"]').each((_, element) => {
        const btnEl = $(element);
        const qualityText = btnEl.text().trim();
        const qualityMatch = qualityText.match(/(Normal|Low)\squality/i);
        const quality = qualityMatch ? qualityMatch[1] : "Unknown";
        const sizeMatch = qualityText.match(/(\d+(\.\d+)?\s(GB|MB))$/i);
        const size = sizeMatch ? sizeMatch[0] : "Unknown Size";
        finalLinks.push({
          title: `${movieTitle} - ${qualityText}`,
          // Use extracted quality (Normal/Low)
          quality,
          // episodesLink points to the final button page (since direct link is JS-driven)
          episodesLink: cdnLinkUrl,
          directLinks: [
            {
              title: `Download (${size})`,
              // Use the button page as the link (requires further processing if a direct file link is needed)
              link: cdnLinkUrl,
              type: "movie"
            }
          ]
        });
      });
    } catch (error) {
      console.error("Error during link chaining:", error);
    }
    return finalLinks;
  });
}
var headers, getMeta;
var init_meta = __esm({
  "providers/ogomovies/meta.ts"() {
    "use strict";
    headers = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Cache-Control": "no-store",
      "Accept-Language": "en-US,en;q=0.9",
      DNT: "1",
      "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      Cookie: "xla=s4t; _ga=GA1.1.1081149560.1756378968; _ga_BLZGKYN5PF=GS2.1.s1756378968$o1$g1$t1756378984$j44$l0$h0",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0"
    };
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        const { axios, cheerio } = providerContext;
        const url = link;
        const baseUrl = url.split("/").slice(0, 3).join("/");
        const emptyResult = {
          title: "",
          synopsis: "",
          image: "",
          imdbId: "",
          type: "movie",
          linkList: []
        };
        try {
          const response = yield axios.get(url, {
            headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl })
          });
          const $ = cheerio.load(response.data);
          const detailEl = $(".main-detail");
          const result = {
            title: "",
            synopsis: "",
            image: "",
            imdbId: "",
            type: "movie",
            linkList: []
          };
          result.title = detailEl.find(".detail-mod h3").text().trim() || detailEl.find(".breadcrumb .active span[itemprop='name']").text().trim().replace("(Tamil)", "").trim() || $("title").text().split("|")[0].trim();
          result.image = detailEl.find(".dm-thumb img").attr("src") || "";
          if (result.image.startsWith("//")) result.image = "https:" + result.image;
          result.synopsis = detailEl.find(".desc p").text().trim() || "Synopsis not found.";
          result.imdbId = detailEl.find("#imdb_id").text().trim();
          result.type = "movie";
          const qualityText = detailEl.find(".mvici-right .quality a").text().trim() || "Unknown";
          let finalLinks = [];
          const watchButton = detailEl.find(".ch_btn_box a.bwac-btn");
          const watchLinkUrl = watchButton.attr("href");
          if (watchLinkUrl) {
            const deepDownloadLinks = yield getDownloadLinks(watchLinkUrl, result.title, providerContext);
            finalLinks = finalLinks.concat(deepDownloadLinks);
          }
          detailEl.find(".mobile-btn a.mod-btn").each((index, element) => {
            var _a;
            const btnEl = $(element);
            const linkUrl = btnEl.attr("href");
            const rawTitle = (_a = btnEl.attr("title")) != null ? _a : "";
            const fallbackTitle = btnEl.text().trim();
            const title = rawTitle.trim() || fallbackTitle;
            if (title.includes("Download Android APP")) {
              return;
            }
            if (linkUrl && (title.includes("Download") || title.includes("Watch") || title.includes("Join Us"))) {
              finalLinks.push({
                title: `${result.title} - ${title}`,
                quality: "External Link",
                episodesLink: linkUrl,
                directLinks: [
                  {
                    title,
                    link: linkUrl,
                    type: "movie"
                  }
                ]
              });
            }
          });
          result.linkList = finalLinks;
          return result;
        } catch (err) {
          console.log("getMeta error:", err);
          return emptyResult;
        }
      });
    };
  }
});

// providers/ogomovies/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function getStream(_0) {
  return __async(this, arguments, function* ({
    link,
    type,
    signal,
    providerContext
  }) {
    const { axios, cheerio } = providerContext;
    try {
      const streamLinks = [];
      const dotlinkRes = yield axios(`${link}`, { headers: headers2, signal });
      const dotlinkText = dotlinkRes.data;
      const buttonMatches = dotlinkText.matchAll(
        /download_video\('([^']+)','([^']+)','([^']+)'\)/g
      );
      for (const match of buttonMatches) {
        const [, id, mode, hash] = match;
        const dlUrl = `https://cdn.bewab.co/dl?op=download_orig&id=${id}&mode=${mode}&hash=${hash}`;
        try {
          const dlRes = yield axios(dlUrl, { headers: headers2, signal });
          const dlText = dlRes.data;
          const $$ = cheerio.load(dlText);
          const directMatches = dlText.matchAll(
            /<a\s+href="([^"]+\.(?:mkv|mp4))"/gi
          );
          for (const m of directMatches) {
            const href = m[1];
            if (href) {
              streamLinks.push({
                server: "direct",
                link: href,
                type: href.endsWith(".mp4") ? "mp4" : "mkv"
              });
            }
          }
          $$("a").each((_, el) => {
            var _a;
            const href = (_a = $$(el).attr("href")) != null ? _a : null;
            if (href && (href.includes(".mkv") || href.includes(".mp4"))) {
              streamLinks.push({
                server: "direct",
                link: href,
                type: href.endsWith(".mp4") ? "mp4" : "mkv"
              });
            }
          });
        } catch (err) {
          console.log("\u274C error loading dl page:", err.message);
        }
      }
      return streamLinks;
    } catch (error) {
      console.log("getStream error: ", error.message);
      return [];
    }
  });
}
var headers2;
var init_stream = __esm({
  "providers/ogomovies/stream.ts"() {
    "use strict";
    headers2 = {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Cache-Control": "no-store",
      "Accept-Language": "en-US,en;q=0.9",
      DNT: "1",
      "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      Cookie: "xla=s4t; _ga=GA1.1.1081149560.1756378968; _ga_BLZGKYN5PF=GS2.1.s1756378968$o1$g1$t1756378984$j44$l0$h0",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0"
    };
  }
});

// providers/ogomovies/ogomovies.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
