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

// providers/cinemaLuxe/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/cinemaLuxe/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Trending",
        filter: "/genre/latest-trending-releases/"
      },
      {
        title: "Netflix",
        filter: "/network/netflix/"
      },
      {
        title: "Amazon Prime",
        filter: "/network/prime-video/"
      },
      {
        title: "Animation",
        filter: "/genre/anime/"
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
    urlsEndpoint = "https://raw.githubusercontent.com/Khiladi45/K45movies-api/main/urls.json";
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

// providers/cinemaLuxe/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function posts(_0) {
  return __async(this, arguments, function* ({
    url,
    signal,
    providerContext
  }) {
    try {
      const res = yield fetch(url, {
        headers: providerContext.commonHeaders,
        signal
      });
      const data = yield res.text();
      const $ = providerContext.cheerio.load(data);
      const catalog2 = [];
      $(".item.tvshows,.item.movies").map((i, element) => {
        const title = $(element).find(".poster").find("img").attr("alt");
        const link = $(element).find(".poster").find("a").attr("href");
        const image = $(element).find(".poster").find("img").attr("data-src");
        if (title && link && image) {
          catalog2.push({
            title,
            link,
            image
          });
        }
      });
      $(".result-item").map((i, element) => {
        const title = $(element).find(".thumbnail").find("img").attr("alt");
        const link = $(element).find(".thumbnail").find("a").attr("href");
        const image = $(element).find(".thumbnail").find("img").attr("data-src");
        if (title && link && image) {
          catalog2.push({
            title,
            link,
            image
          });
        }
      });
      return catalog2;
    } catch (err) {
      console.error("cinemaluxe error ", err);
      return [];
    }
  });
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/cinemaLuxe/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const baseUrl = yield getBaseUrl("cinemaLuxe");
        const url = `${baseUrl + filter}page/${page}/`;
        return posts({ url, signal, providerContext });
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        const baseUrl = yield getBaseUrl("cinemaLuxe");
        const url = `${baseUrl}/page/${page}/?s=${searchQuery}`;
        return posts({ url, signal, providerContext });
      });
    };
  }
});

// providers/cinemaLuxe/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/cinemaLuxe/meta.ts"() {
    "use strict";
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a;
        try {
          const url = link;
          const res = yield providerContext.axios.get(url, {
            headers: providerContext.commonHeaders
          });
          const data = res.data;
          const $ = providerContext.cheerio.load(data);
          const type = url.includes("tvshows") ? "series" : "movie";
          const imdbId = "";
          const title = url.split("/")[4].replace(/-/g, " ");
          const image = $(".g-item").find("a").attr("href") || "";
          const synopsis = $(".wp-content").text().trim();
          const tags = $(".sgeneros").children().map((i, element) => $(element).text()).get().slice(3);
          const rating = Number($("#repimdb").find("strong").text()).toFixed(1).toString();
          const links = [];
          $(".custom-links").find(".ep-button-container").map((i, element) => {
            var _a2;
            const title2 = $(element).text().replace("\u2B07Download", "").replace("\u2B07 Download", "").trim();
            const link2 = $(element).find("a").attr("href");
            if (title2 && link2) {
              links.push({
                title: title2,
                episodesLink: link2,
                quality: ((_a2 = title2 == null ? void 0 : title2.match(/\d+P\b/)) == null ? void 0 : _a2[0].replace("P", "p")) || ""
              });
            }
          });
          if (links.length === 0) {
            $(
              ".ep-button-container:not(:has(a:contains('Click Here To Visit')))"
            ).map((i, element) => {
              var _a2;
              let title2 = $(element).find("a").text().replace("\u2B07Download", "").replace("\u2B07 Download", "").trim();
              if (title2.includes("Download Now")) {
                title2 = $(element).parent().find("h3").text().trim().replace("\u2B07Download", "").replace("\u2B07 Download", "");
              }
              const link2 = $(element).find("a").attr("href");
              if (title2 && link2) {
                links.push({
                  title: title2,
                  episodesLink: link2,
                  quality: ((_a2 = title2 == null ? void 0 : title2.match(/\d+P\b/)) == null ? void 0 : _a2[0].replace("P", "p")) || ""
                });
              }
            });
          }
          const quickDownload = yield (_a = providerContext.kvStore) == null ? void 0 : _a.get("cinemaLuxe_quickDownload");
          return {
            title,
            tags,
            rating,
            synopsis,
            image,
            imdbId,
            type,
            quickDownload: quickDownload != null ? quickDownload : true,
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

// providers/extractors/gofile.ts
function getOrFetchGenerateWT(axios) {
  return __async(this, null, function* () {
    const now = Date.now();
    if (cachedGenerateWT && now - cachedWTTime < 3 * 60 * 60 * 1e3) {
      return cachedGenerateWT;
    }
    try {
      const res = yield axios.get("https://gofile.io/js/wt.obf.js", {
        headers: {
          "User-Agent": GOFILE_USER_AGENT,
          Referer: "https://gofile.io/"
        }
      });
      const code = res.data;
      const runner = new Function(
        "navigator",
        "window",
        "document",
        "location",
        `${code}
return generateWT;`
      );
      const fakeNav = {
        userAgent: GOFILE_USER_AGENT,
        language: GOFILE_LANGUAGE
      };
      const fakeWin = {
        navigator: fakeNav,
        location: {
          href: "https://gofile.io/",
          protocol: "https:",
          host: "gofile.io"
        }
      };
      const generateWT = runner(fakeNav, fakeWin, {}, fakeWin.location);
      if (typeof generateWT === "function") {
        cachedGenerateWT = generateWT;
        cachedWTTime = now;
        return generateWT;
      }
    } catch (err) {
      console.warn("gofile: failed to fetch/execute wt.obf.js:", (err == null ? void 0 : err.message) || err);
    }
    return (accountToken) => accountToken;
  });
}
function getOrFetchToken(axios, providerContext) {
  return __async(this, null, function* () {
    var _a, _b;
    if (cachedAccountToken) return cachedAccountToken;
    const kvStore = providerContext == null ? void 0 : providerContext.kvStore;
    try {
      const saved = yield kvStore == null ? void 0 : kvStore.get("gofile_account_token");
      if (saved && typeof saved === "string") {
        cachedAccountToken = saved;
        return saved;
      }
    } catch (e) {
    }
    const accountResponse = yield axios.post(
      `${GOFILE_API}/accounts`,
      {},
      {
        headers: {
          "User-Agent": GOFILE_USER_AGENT,
          Origin: "https://gofile.io",
          Referer: "https://gofile.io/"
        }
      }
    );
    const token = (_b = (_a = accountResponse.data) == null ? void 0 : _a.data) == null ? void 0 : _b.token;
    if (!token) throw new Error("Gofile did not return an account token");
    cachedAccountToken = token;
    try {
      yield kvStore == null ? void 0 : kvStore.set("gofile_account_token", token);
    } catch (e) {
    }
    return token;
  });
}
function findFirstFile(content) {
  var _a;
  if ((content == null ? void 0 : content.type) === "file" && (content == null ? void 0 : content.link)) return content;
  for (const child of Object.values((_a = content == null ? void 0 : content.children) != null ? _a : {})) {
    const file = findFirstFile(child);
    if (file) return file;
  }
  return void 0;
}
function gofileExtractor(id, axios, providerContext) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      const token = yield getOrFetchToken(axios, providerContext);
      const generateWT = yield getOrFetchGenerateWT(axios);
      const websiteToken = generateWT(token);
      const response = yield axios.get(`${GOFILE_API}/contents/${id}`, {
        params: {
          contentFilter: "",
          page: 1,
          pageSize: 1e3,
          sortField: "name",
          sortDirection: 1
        },
        headers: {
          Accept: "*/*",
          "Accept-Language": `${GOFILE_LANGUAGE},en;q=0.9`,
          Authorization: `Bearer ${token}`,
          Origin: "https://gofile.io",
          Referer: "https://gofile.io/",
          "User-Agent": GOFILE_USER_AGENT,
          "X-BL": GOFILE_LANGUAGE,
          "X-Website-Token": websiteToken
        }
      });
      if (((_a = response.data) == null ? void 0 : _a.status) !== "ok") {
        if (((_b = response.data) == null ? void 0 : _b.status) === "error-auth" || response.status === 401) {
          cachedAccountToken = null;
          try {
            yield (_c = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _c.delete("gofile_account_token");
          } catch (e) {
          }
        }
        throw new Error(
          `Gofile API returned ${(_e = (_d = response.data) == null ? void 0 : _d.status) != null ? _e : "invalid data"}`
        );
      }
      const file = findFirstFile(response.data.data);
      if (!(file == null ? void 0 : file.link)) throw new Error("No downloadable file found in Gofile response");
      return { link: file.link, token };
    } catch (error) {
      if (((_f = error == null ? void 0 : error.response) == null ? void 0 : _f.status) === 401) {
        cachedAccountToken = null;
        try {
          yield (_g = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _g.delete("gofile_account_token");
        } catch (e) {
        }
      }
      throwProviderError("Gofile", `extract ${id}`, error);
    }
  });
}
var GOFILE_API, GOFILE_LANGUAGE, GOFILE_USER_AGENT, cachedAccountToken, cachedGenerateWT, cachedWTTime;
var init_gofile = __esm({
  "providers/extractors/gofile.ts"() {
    "use strict";
    init_providerErrors();
    GOFILE_API = "https://api.gofile.io";
    GOFILE_LANGUAGE = "en-US";
    GOFILE_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
    cachedAccountToken = null;
    cachedGenerateWT = null;
    cachedWTTime = 0;
  }
});

// providers/extractors/hubcloud.ts
function resolveGofileLink(gofileLink, axios, providerContext) {
  return __async(this, null, function* () {
    try {
      const gofileUrl = new URL(gofileLink);
      const id = gofileUrl.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;
      const gfResult = yield gofileExtractor(id, axios, providerContext);
      if (!(gfResult == null ? void 0 : gfResult.link) || !(gfResult == null ? void 0 : gfResult.token)) return null;
      return {
        server: "Gofile",
        link: gfResult.link,
        type: "mkv",
        headers: {
          Referer: "https://gofile.io/",
          Cookie: `accountToken=${gfResult.token}`
        }
      };
    } catch (error) {
      console.log("hubcloudExtractor: resolveGofileLink error:", error);
      return null;
    }
  });
}
function hubcloudExtractor(link, signal, axios, cheerio, headers, providerContext, isDownload, providerValue) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      if (!headers["Cookie"]) {
        headers["Cookie"] = "ext_name=ojplmecpdpgccookcobabopnaifgidhf; xla=s4t; cf_clearance=woQrFGXtLfmEMBEiGUsVHrUBMT8s3cmguIzmMjmvpkg-1770053679-1.2.1.1-xBrQdciOJsweUF6F2T_OtH6jmyanN_TduQ0yslc_XqjU6RcHSxI7.YOKv6ry7oYo64868HYoULnVyww536H2eVI3R2e4wKzsky6abjPdfQPxqpUaXjxfJ02o6jl3_Vkwr4uiaU7Wy596Vdst3y78HXvVmKdIohhtPvp.vZ9_L7wvWdce0GRixjh_6JiqWmWMws46hwEt3hboaS1e1e4EoWCvj5b0M_jVwvSxBOAW5emFzvT3QrnRh4nyYmKDERnY";
      }
      console.log("hubcloudExtractor", link);
      const baseUrl = link.split("/").slice(0, 3).join("/");
      const streamLinks2 = [];
      const openWebView = providerContext == null ? void 0 : providerContext.openWebView;
      let vLinkRes;
      try {
        vLinkRes = yield axios(`${link}`, { headers, signal });
      } catch (error) {
        if (((_a = error.response) == null ? void 0 : _a.status) === 403) {
          if (openWebView) {
            console.log(
              `hubcloudExtractor: WAF detected (403) for ${link}, using solver...`
            );
            const cleanHeaders = __spreadProps(__spreadValues({}, headers), { Referer: baseUrl });
            const wafResult = yield openWebView(baseUrl, {
              title: "Solve the captcha below and click done",
              description: "Required to bypass anti-bot protection.",
              headers: cleanHeaders,
              waitForCookie: "cf_clearance",
              force: true
            });
            if (wafResult.userAgent) headers["User-Agent"] = wafResult.userAgent;
            headers["Cookie"] = (headers["Cookie"] ? headers["Cookie"] + "; " : "") + wafResult.cookies;
            vLinkRes = yield axios(`${link}`, { headers, signal });
          } else {
            console.log(
              `hubcloudExtractor: 403 Forbidden for ${link}, but openWebView solver is not available!`
            );
            throw error;
          }
        } else {
          throw error;
        }
      }
      const vLinkText = vLinkRes.data;
      const $vLink = cheerio.load(vLinkText);
      const vLinkGofileBtns = $vLink("a[href*='gofile.io']");
      for (const el of vLinkGofileBtns) {
        const gfHref = $vLink(el).attr("href");
        if (gfHref) {
          const gfStream = yield resolveGofileLink(gfHref, axios, providerContext);
          if (gfStream && !streamLinks2.some((s) => s.link === gfStream.link)) {
            streamLinks2.push(gfStream);
          }
        }
      }
      let vcloudLink = extractUrlFromScript(vLinkText) || $vLink(".fa-file-download.fa-lg").parent().attr("href") || link;
      console.log("vcloudLink", vcloudLink);
      if (vcloudLink == null ? void 0 : vcloudLink.startsWith("/")) {
        vcloudLink = `${baseUrl}${vcloudLink}`;
        console.log("New vcloudLink", vcloudLink);
      }
      if (vcloudLink == null ? void 0 : vcloudLink.includes("gofile.io")) {
        const gfStream = yield resolveGofileLink(vcloudLink, axios, providerContext);
        if (gfStream && !streamLinks2.some((s) => s.link === gfStream.link)) {
          streamLinks2.push(gfStream);
        }
      }
      let vcloudText = "";
      if (vcloudLink && !vcloudLink.includes("gofile.io") && vcloudLink !== link) {
        try {
          const vcloudRes = yield axios.get(vcloudLink, { headers, signal });
          vcloudText = vcloudRes.data;
        } catch (error) {
          if (((_b = error.response) == null ? void 0 : _b.status) === 403 && openWebView) {
            console.log(
              `hubcloudExtractor: WAF detected (403) for ${vcloudLink}, using solver...`
            );
            const vcloudBaseUrl = vcloudLink.split("/").slice(0, 3).join("/");
            const cleanHeaders2 = __spreadProps(__spreadValues({}, headers), { Referer: vcloudBaseUrl });
            const wafResult = yield openWebView(vcloudBaseUrl, {
              title: "Solve the captcha below and click done",
              description: "Required to bypass anti-bot protection.",
              headers: cleanHeaders2,
              waitForCookie: "cf_clearance",
              force: true
            });
            if (wafResult.userAgent) headers["User-Agent"] = wafResult.userAgent;
            headers["Cookie"] = (headers["Cookie"] ? headers["Cookie"] + "; " : "") + wafResult.cookies;
            const retryRes = yield axios.get(vcloudLink, { headers, signal });
            vcloudText = retryRes.data;
          } else {
            throw error;
          }
        }
      }
      const $ = cheerio.load(vcloudText);
      const linkClass = $(".btn-success.btn-lg.h6,.btn-danger,.btn-secondary");
      for (const element of linkClass) {
        const itm = $(element);
        let link2 = itm.attr("href") || "";
        switch (true) {
          case (link2 == null ? void 0 : link2.includes("pixeld")):
            console.log("Pixeldrain link found:", link2);
            if (!(link2 == null ? void 0 : link2.includes("api"))) {
              const redirectedPixelDrainUrl = getRedirectedPixelDrainUrl(
                vLinkText,
                vcloudText
              );
              if (redirectedPixelDrainUrl) {
                console.log(
                  "Special case for token negn6f",
                  redirectedPixelDrainUrl
                );
                link2 = redirectedPixelDrainUrl;
              }
              const token = (_c = link2.split("/").pop()) == null ? void 0 : _c.split("?")[0];
              const baseUrl2 = link2.split("/").slice(0, -2).join("/");
              link2 = `${baseUrl2}/api/file/${token}?download`;
            }
            streamLinks2.push({ server: "Pixeldrain", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes(".dev")) && !(link2 == null ? void 0 : link2.includes("/?id="))):
            streamLinks2.push({ server: "CF Worker", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes("hubcloud")) || (link2 == null ? void 0 : link2.includes("/?id="))):
            try {
              let newLink = link2;
              try {
                if (typeof fetch !== "undefined") {
                  const fRes = yield fetch(link2, {
                    headers,
                    signal,
                    redirect: "follow"
                  });
                  if (fRes.url && fRes.url.includes("googleusercontent")) {
                    newLink = fRes.url.split("?link=")[1] || fRes.url;
                  } else if (fRes.url && fRes.url !== link2) {
                    newLink = fRes.url;
                  }
                }
              } catch (e) {
              }
              if (!newLink.includes("googleusercontent")) {
                try {
                  const res1 = yield axios.get(newLink, {
                    headers,
                    signal,
                    maxRedirects: 0,
                    validateStatus: (s) => s >= 200 && s < 400
                  });
                  if ((_d = res1.headers) == null ? void 0 : _d["location"]) {
                    newLink = res1.headers["location"];
                  }
                  if (newLink.includes("googleusercontent")) {
                    newLink = newLink.split("?link=")[1] || newLink;
                  } else if (newLink.includes("http")) {
                    const res2 = yield axios.get(newLink, {
                      headers,
                      signal,
                      maxRedirects: 0,
                      validateStatus: (s) => s >= 200 && s < 400
                    });
                    if ((_e = res2.headers) == null ? void 0 : _e["location"]) {
                      const loc2 = res2.headers["location"];
                      newLink = loc2.includes("?link=") ? loc2.split("?link=")[1] : loc2;
                    }
                  }
                } catch (e) {
                }
              }
              if (newLink.includes("?link=")) {
                newLink = newLink.split("?link=")[1] || newLink;
              }
              streamLinks2.push({
                server: "GDrive (download only)",
                link: newLink,
                type: "mkv"
              });
            } catch (error) {
              console.log("hubcloudExtractor error in hubcloud link: ", error);
            }
            break;
          case (link2 == null ? void 0 : link2.includes("gofile.io")):
            try {
              const gfStream = yield resolveGofileLink(link2, axios, providerContext);
              if (gfStream && !streamLinks2.some((s) => s.link === gfStream.link)) {
                streamLinks2.push(gfStream);
              }
            } catch (error) {
              console.log("hubcloudExtractor error in gofile link: ", error);
            }
            break;
          case (link2 == null ? void 0 : link2.includes("cloudflarestorage")):
            streamLinks2.push({ server: "CF Storage", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes("fastdl")) || (link2 == null ? void 0 : link2.includes("fsl."))):
            streamLinks2.push({ server: "FastDl", link: link2, type: "mkv" });
            break;
          case (link2.includes("hubcdn") && !link2.includes("/?id=")):
            streamLinks2.push({
              server: "HubCdn",
              link: link2,
              type: "mkv"
            });
            break;
          default:
            if ((link2 == null ? void 0 : link2.includes(".mkv")) || (link2 == null ? void 0 : link2.includes("?token="))) {
              const serverName = "CF Worker";
              streamLinks2.push({ server: serverName, link: link2, type: "mkv" });
            }
            break;
        }
      }
      let preferredServer = "auto";
      try {
        const specificKey = providerValue ? `${providerValue}_preferredDownloadServer` : "";
        preferredServer = ((specificKey ? yield (_f = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _f.get(specificKey) : void 0) || (yield (_g = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _g.get("preferredDownloadServer")) || "auto").toLowerCase().trim();
      } catch (e) {
      }
      const getPriority = (serverName = "") => {
        const s = serverName.toLowerCase();
        if (isDownload && preferredServer !== "auto" && preferredServer !== "" && s.includes(preferredServer)) {
          return 0;
        }
        if (isDownload) {
          if (s.includes("cf storage") || s.includes("storage") || s.includes("resumable")) return 1;
          if (s.includes("gdrive") || s.includes("google") || s.includes("instant")) return 2;
          if (s.includes("pixeldrain")) return 3;
          if (s.includes("gofile")) return 4;
          if (s.includes("fastdl") || s.includes("fsl")) return 5;
          if (s.includes("hubcdn")) return 6;
          if (s.includes("cf worker") || s.includes("worker") || s.includes("fast cloud")) return 8;
          return 10;
        } else {
          if (s.includes("cf storage") || s.includes("storage")) return 1;
          if (s.includes("cf worker") || s.includes("worker") || s.includes("fast cloud")) return 2;
          if (s.includes("gofile")) return 3;
          if (s.includes("pixeldrain")) return 4;
          if (s.includes("fastdl") || s.includes("fsl")) return 5;
          if (s.includes("hubcdn")) return 6;
          if (s.includes("gdrive") || s.includes("google")) return 7;
          return 10;
        }
      };
      streamLinks2.sort((a, b) => getPriority(a.server) - getPriority(b.server));
      console.log("streamLinks", streamLinks2);
      return streamLinks2;
    } catch (error) {
      throwProviderError("HubCloud", `extract ${link}`, error);
    }
  });
}
var hubcloudDecode, extractUrlFromScript, getPixelDrainUrl, getRedirectedPixelDrainUrl;
var init_hubcloud = __esm({
  "providers/extractors/hubcloud.ts"() {
    "use strict";
    init_providerErrors();
    init_gofile();
    hubcloudDecode = function(value) {
      if (value === void 0) {
        return "";
      }
      return atob(value.toString());
    };
    extractUrlFromScript = (html) => {
      var _a, _b, _c;
      const doubleAtobMatch = html.match(
        /(?:var|let|const)\s+\w+\s*=\s*atob\(atob\(['"]([^'"]+)['"]\)\)/
      );
      if (doubleAtobMatch == null ? void 0 : doubleAtobMatch[1]) {
        return atob(atob(doubleAtobMatch[1]));
      }
      const plainMatch = html.match(/var\s+url\s*=\s*['"]([^'"]+)['"]/);
      return hubcloudDecode((_c = (_b = (_a = plainMatch == null ? void 0 : plainMatch[1]) == null ? void 0 : _a.split("r=")) == null ? void 0 : _b[1]) != null ? _c : "") || (plainMatch == null ? void 0 : plainMatch[1]) || "";
    };
    getPixelDrainUrl = (html) => {
      const match = html.match(/var\s+pxl\s*=\s*['"]([^'"]+)['"];?/i);
      return (match == null ? void 0 : match[1]) || "";
    };
    getRedirectedPixelDrainUrl = (...htmlSources) => {
      for (const html of htmlSources) {
        if (!html) {
          continue;
        }
        const redirectedUrl = getPixelDrainUrl(html);
        if (redirectedUrl) {
          return redirectedUrl;
        }
      }
      return "";
    };
  }
});

// providers/extractors/gdflix.ts
function gdflixExtractor(link, signal, axios, cheerio, headers, providerContext) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      let wafCookies;
      try {
        yield axios.get(link, { headers, signal });
      } catch (error) {
        if (((_a = error.response) == null ? void 0 : _a.status) === 403 && (providerContext == null ? void 0 : providerContext.openWebView)) {
          console.log("gdflix: WAF detected (403), using solver...");
          const baseUrl = link.split("/").slice(0, 3).join("/");
          const wafResult = yield providerContext.openWebView(link, {
            title: "Solve the captcha below and click done",
            description: "Required to bypass GDFlix anti-bot protection.",
            headers: __spreadProps(__spreadValues({}, headers), { Referer: baseUrl }),
            force: true,
            waitForCookie: "cf_clearance"
          });
          wafCookies = wafResult.cookies;
        } else {
          throw error;
        }
      }
      if (wafCookies) {
        headers["Cookie"] = wafCookies;
      }
      const streamLinks2 = [];
      const res = yield axios(`${link}`, { headers, signal });
      console.log("gdflixExtractor", link);
      const data = res.data;
      let $drive = cheerio.load(data);
      if ((_b = $drive("body").attr("onload")) == null ? void 0 : _b.includes("location.replace")) {
        const newLink = (_e = (_d = (_c = $drive("body").attr("onload")) == null ? void 0 : _c.split("location.replace('")) == null ? void 0 : _d[1].split("'")) == null ? void 0 : _e[0];
        console.log("newLink", newLink);
        if (newLink) {
          const newRes = yield axios.get(newLink, { headers, signal });
          $drive = cheerio.load(newRes.data);
        }
      }
      try {
        const baseUrl = link.split("/").slice(0, 3).join("/");
        const resumeDrive = $drive(".btn-secondary").attr("href") || "";
        console.log("resumeDrive", resumeDrive);
        if (resumeDrive.includes("indexbot")) {
          const resumeBotRes = yield axios.get(resumeDrive, { headers });
          const resumeBotToken = resumeBotRes.data.match(
            /formData\.append\('token', '([a-f0-9]+)'\)/
          )[1];
          const resumeBotBody = new FormData();
          resumeBotBody.append("token", resumeBotToken);
          const resumeBotPath = resumeBotRes.data.match(
            /fetch\('\/download\?id=([a-zA-Z0-9\/+]+)'/
          )[1];
          const resumeBotBaseUrl = resumeDrive.split("/download")[0];
          const resumeBotDownload = yield fetch(
            resumeBotBaseUrl + "/download?id=" + resumeBotPath,
            {
              method: "POST",
              body: resumeBotBody,
              headers: {
                Referer: resumeDrive,
                Cookie: "PHPSESSID=7e9658ce7c805dab5bbcea9046f7f308"
              }
            }
          );
          const resumeBotDownloadData = yield resumeBotDownload.json();
          console.log("resumeBotDownloadData", resumeBotDownloadData.url);
          streamLinks2.push({
            server: "ResumeBot",
            link: resumeBotDownloadData.url,
            type: "mkv"
          });
        } else {
          const url = baseUrl + resumeDrive;
          const resumeDriveRes = yield axios.get(url, { headers });
          const resumeDriveHtml = resumeDriveRes.data;
          const $resumeDrive = cheerio.load(resumeDriveHtml);
          const resumeLink = $resumeDrive(".btn-success").attr("href");
          if (resumeLink) {
            streamLinks2.push({
              server: "ResumeCloud",
              link: resumeLink,
              type: "mkv"
            });
          }
        }
      } catch (err) {
        console.log("Resume link not found");
      }
      try {
        const seed = $drive(".btn-danger").attr("href") || "";
        if (seed && seed.startsWith("http")) {
          if (seed.includes("url=")) {
            const directPart = decodeURIComponent(seed.split("url=")[1]);
            if (directPart && directPart.startsWith("http")) {
              streamLinks2.push({ server: "Instant Download", link: directPart, type: "mkv" });
            }
          }
          try {
            const vRes = yield axios.get(seed, {
              headers: __spreadProps(__spreadValues({}, headers), { Referer: link }),
              maxRedirects: 0,
              validateStatus: (s) => s >= 200 && s < 400,
              signal
            });
            const loc = (_f = vRes.headers) == null ? void 0 : _f.location;
            if (loc) {
              let directGoogleUrl = null;
              if (loc.includes("url=")) {
                directGoogleUrl = decodeURIComponent(loc.split("url=")[1]);
              } else if (loc.includes("googleusercontent.com") || loc.startsWith("http")) {
                directGoogleUrl = loc;
              }
              if (directGoogleUrl && directGoogleUrl.startsWith("http")) {
                streamLinks2.push({ server: "Instant Download", link: directGoogleUrl, type: "mkv" });
              }
            } else if (typeof vRes.data === "string") {
              const upMatch = vRes.data.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
              if (upMatch) {
                const upPath = upMatch[1];
                const vOrigin = new URL(seed).origin;
                const upUrl = upPath.startsWith("http") ? upPath : vOrigin + upPath;
                const upRes = yield axios.get(upUrl, {
                  headers: __spreadProps(__spreadValues({}, headers), { Referer: seed }),
                  signal
                });
                const loc2 = (_g = upRes.headers) == null ? void 0 : _g.location;
                if (loc2 && loc2.startsWith("http")) {
                  streamLinks2.push({ server: "Instant Download", link: loc2, type: "mkv" });
                } else if (typeof upRes.data === "string") {
                  const $up = cheerio.load(upRes.data);
                  const dlBtn = $up("#downloadBtn, a.btn-danger, a.btn-success").attr("href");
                  if (dlBtn && dlBtn.startsWith("http")) {
                    streamLinks2.push({ server: "Instant Download", link: dlBtn, type: "mkv" });
                  }
                }
              }
            }
          } catch (e) {
          }
        }
      } catch (e) {
      }
      return streamLinks2;
    } catch (error) {
      return streamLinks;
    }
  });
}
var init_gdflix = __esm({
  "providers/extractors/gdflix.ts"() {
    "use strict";
  }
});

// providers/cinemaLuxe/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/cinemaLuxe/stream.ts"() {
    "use strict";
    init_hubcloud();
    init_gdflix();
    getStream = (_0) => __async(null, [_0], function* ({
      link,
      type,
      signal,
      providerContext,
      isDownload
    }) {
      var _a;
      const { axios, cheerio, commonHeaders: headers } = providerContext;
      try {
        let newLink = link;
        console.log("getStream 1", link);
        if (link.includes("linkstore")) {
          console.log("linkstore detected");
          const res = yield fetch(link, {
            signal,
            headers: {
              accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
              "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
              "cache-control": "no-cache",
              pragma: "no-cache",
              priority: "u=0, i",
              "sec-ch-ua": '"Microsoft Edge";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "document",
              "sec-fetch-mode": "navigate",
              "sec-fetch-site": "none",
              "sec-fetch-user": "?1",
              "upgrade-insecure-requests": "1",
              cookie: "PHPSESSID=9o57cff841dqtv8djtn1rp1712; ext_name=ojplmecpdpgccookcobabopnaifgidhf"
            }
          });
          const html = yield res.text();
          const refreshMetaMatch = html.match(
            /<meta\s+http-equiv="refresh"\s+content="[^"]*url=([^"]+)"/i
          );
          if (refreshMetaMatch && refreshMetaMatch[1]) {
            link = refreshMetaMatch[1];
          }
        } else {
          console.log("linkstore not detected");
        }
        console.log("getStream 2", link);
        if (link.includes("luxedrive")) {
          const res = yield axios.get(link, { signal });
          const $ = cheerio.load(res.data);
          const hubcloudLink = $("a.btn.hubcloud").attr("href");
          if (hubcloudLink) {
            newLink = hubcloudLink;
          } else {
            const gdFlixLink = $("a.btn.gdflix").attr("href");
            if (gdFlixLink) {
              newLink = gdFlixLink;
            }
          }
        }
        if (newLink.includes("flix")) {
          const sreams = yield gdflixExtractor(
            newLink,
            signal,
            axios,
            cheerio,
            headers,
            providerContext
          );
          return sreams;
        }
        const res2 = yield axios.get(newLink, { signal });
        const data2 = res2.data;
        const hcLink = ((_a = data2.match(/location\.replace\('([^']+)'/)) == null ? void 0 : _a[1]) || newLink;
        const hubCloudLinks = yield hubcloudExtractor(
          hcLink.includes("https://hubcloud") ? hcLink : newLink,
          signal,
          axios,
          cheerio,
          headers,
          providerContext,
          isDownload,
          "cinemaLuxe"
        );
        return hubCloudLinks;
      } catch (err) {
        console.error(err);
        return [];
      }
    });
  }
});

// providers/cinemaLuxe/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/cinemaLuxe/episodes.ts"() {
    "use strict";
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        var _a, _b;
        try {
          if (!url.includes("luxelinks") || url.includes("cinemalux")) {
            const res2 = yield providerContext.axios.get(url, {
              headers: providerContext.commonHeaders
            });
            const data = res2.data;
            const encodedLink = (_a = data.match(/"link":"([^"]+)"/)) == null ? void 0 : _a[1];
            if (encodedLink) {
              url = encodedLink ? atob(encodedLink) : url;
            } else {
              const redirectUrlRes = yield fetch(
                "https://cm-decrypt.8man.workers.dev/cinemaluxe",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ url })
                }
              );
              const redirectUrl = yield redirectUrlRes.json();
              url = (redirectUrl == null ? void 0 : redirectUrl.redirectUrl) || url;
            }
          }
          const episodeLinks = [];
          if (url.includes("luxedrive") || url.includes("drive.linkstore")) {
            episodeLinks.push({
              title: "Movie",
              link: url
            });
            return episodeLinks;
          }
          const res = yield providerContext.axios.get(url, {
            headers: providerContext.commonHeaders
          });
          const html = res.data;
          let $ = providerContext.cheerio.load(html);
          $("a.maxbutton-4,a.maxbutton,.maxbutton-hubcloud,.ep-simple-button").map(
            (i, element) => {
              var _a2;
              const title = (_a2 = $(element).text()) == null ? void 0 : _a2.trim();
              const link = $(element).attr("href");
              if (title && link && !title.includes("Batch") && !title.toLowerCase().includes("zip")) {
                episodeLinks.push({
                  title: title.replace(/\(\d{4}\)/, "").replace("Download", "Movie").replace("\u26A1", "").trim(),
                  link
                });
              }
            }
          );
          const quickDownload = yield (_b = providerContext.kvStore) == null ? void 0 : _b.get("cinemaLuxe_quickDownload");
          return episodeLinks.map((e) => __spreadProps(__spreadValues({}, e), {
            quickDownload: quickDownload != null ? quickDownload : true
          }));
        } catch (err) {
          console.error("cl episode links", err);
          return [];
        }
      });
    };
  }
});

// providers/cinemaLuxe/cinemaLuxe.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
