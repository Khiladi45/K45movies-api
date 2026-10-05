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

// providers/eonMovies/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/eonMovies/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Latest", filter: "" },
      { title: "Bollywood", filter: "bollywood" },
      { title: "Hollywood", filter: "hollywood" },
      { title: "South Indian", filter: "tollywood" },
      { title: "Web Series", filter: "series" },
      { title: "Netflix", filter: "netflix" }
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
    getBaseUrl = (providerValue3) => __async(null, null, function* () {
      var _a, _b;
      try {
        const providerUrls = yield fetchProviderUrls();
        return (_b = (_a = providerUrls[providerValue3]) == null ? void 0 : _a.url) != null ? _b : "";
      } catch (error) {
        console.error(`Error fetching baseUrl: ${providerValue3}`, error);
        throw error;
      }
    });
  }
});

// providers/eonMovies/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function toPath(link, baseUrl) {
  const url = new URL(link, `${baseUrl}/`);
  return `${url.pathname}${url.search}${url.hash}`;
}
function fetchPosts(url, baseUrl, signal, providerContext) {
  return __async(this, null, function* () {
    const response = yield providerContext.axios.get(url, { signal });
    const $ = providerContext.cheerio.load(response.data || "");
    const posts = [];
    $(".image-container").each((_, element) => {
      const container = $(element);
      const anchor = container.closest("a[href]");
      const link = anchor.attr("href") || "";
      const image = container.find("img").attr("data-src") || container.find("img").attr("src") || "";
      const title = anchor.find(".card-title").text().replace(/\s+/g, " ").trim() || container.find("img").attr("alt") || "";
      if (title && link && image) {
        posts.push({ title, link: toPath(link, baseUrl), image });
      }
    });
    return posts;
  });
}
function getPosts(_0) {
  return __async(this, arguments, function* ({
    filter,
    page,
    signal,
    providerContext
  }) {
    const baseUrl = yield getBaseUrl(providerValue);
    const url = new URL("/", `${baseUrl}/`);
    url.search = new URLSearchParams({
      action: "",
      page: String(page),
      name: "",
      category: filter
    }).toString();
    return fetchPosts(url.href, baseUrl, signal, providerContext);
  });
}
function getSearchPosts(_0) {
  return __async(this, arguments, function* ({
    searchQuery,
    page,
    signal,
    providerContext
  }) {
    const baseUrl = yield getBaseUrl(providerValue);
    const url = new URL("/", `${baseUrl}/`);
    url.search = new URLSearchParams({
      action: "search",
      page: String(page),
      name: searchQuery
    }).toString();
    return fetchPosts(url.href, baseUrl, signal, providerContext);
  });
}
var providerValue;
var init_posts = __esm({
  "providers/eonMovies/posts.ts"() {
    "use strict";
    init_getBaseUrl();
    providerValue = "eonMovies";
  }
});

// providers/eonMovies/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function getTitle($) {
  const openGraphTitle = $('meta[property="og:title"]').attr("content") || "";
  return openGraphTitle.replace(/\s+-\s+Download in HD\s*\|\s*EonMovies\s*$/i, "").trim();
}
function getBackdrop($) {
  var _a;
  const style = $("#heroBackdrop").attr("style") || "";
  return ((_a = style.match(/background-image\s*:\s*url\(['"]?([^'")]+)['"]?\)/i)) == null ? void 0 : _a[1]) || "";
}
function getTags($) {
  const genres2 = $("#movieGenresBox .genre-pill").map((_, element) => $(element).text().trim()).get().filter(Boolean);
  const metadata = $(".meta-pill").map(
    (_, element) => $(element).text().replace(/\s+/g, " ").trim()
  ).get().filter(
    (value) => /^(?:Movie|Series|WEB-DL|Hindi|English|Dual Audio)$/i.test(value)
  );
  return [.../* @__PURE__ */ new Set([...genres2, ...metadata])].slice(0, 3);
}
function getDownloadLinks($, baseUrl) {
  const directLinks = [];
  $(".dl-row").each((_, element) => {
    const row = $(element);
    const title = row.attr("data-dlname") || row.find(".dl-row-name").text().replace(/\s+/g, " ").trim();
    const href = row.find("a[href*='/dl/']").attr("href") || "";
    if (!title || !href) return;
    directLinks.push({
      title,
      link: new URL(href, `${baseUrl}/`).href
    });
  });
  return directLinks.length ? [{ title: "Downloads", directLinks }] : [];
}
function getMeta(_0) {
  return __async(this, arguments, function* ({
    link,
    providerContext
  }) {
    var _a;
    const baseUrl = yield getBaseUrl(providerValue2);
    const url = new URL(link, `${baseUrl}/`).href;
    const response = yield providerContext.axios.get(url);
    const $ = providerContext.cheerio.load(response.data || "");
    const title = getTitle($);
    const image = getBackdrop($);
    const synopsis = $(".overview-text").first().text().replace(/\s+/g, " ").trim();
    const type = $(".meta-pills").text().includes("Series") ? "series" : "movie";
    const quickDownload = yield (_a = providerContext.kvStore) == null ? void 0 : _a.get("eonMovies_quickDownload");
    return {
      title,
      image,
      synopsis,
      imdbId: "",
      type,
      quickDownload: quickDownload != null ? quickDownload : true,
      tags: getTags($),
      linkList: getDownloadLinks($, baseUrl),
      webUrl: url
    };
  });
}
var providerValue2;
var init_meta = __esm({
  "providers/eonMovies/meta.ts"() {
    "use strict";
    init_getBaseUrl();
    providerValue2 = "eonMovies";
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
function checkStreamHealth(stream, signal) {
  return __async(this, null, function* () {
    if (!(stream == null ? void 0 : stream.link)) return false;
    const reqHeaders = __spreadValues({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }, stream.headers || {});
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4e3);
      if (signal) {
        signal.addEventListener("abort", () => controller.abort(), { once: true });
      }
      const res = yield fetch(stream.link, {
        method: "HEAD",
        headers: reqHeaders,
        signal: controller.signal,
        redirect: "follow"
      });
      clearTimeout(timeoutId);
      if (res.status >= 200 && res.status < 400) {
        return true;
      }
      if (res.status === 405 || res.status === 403) {
        const getController = new AbortController();
        const getTimeoutId = setTimeout(() => getController.abort(), 4e3);
        if (signal) {
          signal.addEventListener("abort", () => getController.abort(), { once: true });
        }
        const getRes = yield fetch(stream.link, {
          method: "GET",
          headers: __spreadProps(__spreadValues({}, reqHeaders), { Range: "bytes=0-0" }),
          signal: getController.signal
        });
        clearTimeout(getTimeoutId);
        return getRes.status >= 200 && getRes.status < 400;
      }
      return false;
    } catch (e) {
      return false;
    }
  });
}
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
function hubcloudExtractor(link, signal, axios, cheerio, headers, providerContext, isDownload, providerValue3) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
      if (!headers["Cookie"]) {
        headers["Cookie"] = "ext_name=ojplmecpdpgccookcobabopnaifgidhf; xla=s4t; cf_clearance=woQrFGXtLfmEMBEiGUsVHrUBMT8s3cmguIzmMjmvpkg-1770053679-1.2.1.1-xBrQdciOJsweUF6F2T_OtH6jmyanN_TduQ0yslc_XqjU6RcHSxI7.YOKv6ry7oYo64868HYoULnVyww536H2eVI3R2e4wKzsky6abjPdfQPxqpUaXjxfJ02o6jl3_Vkwr4uiaU7Wy596Vdst3y78HXvVmKdIohhtPvp.vZ9_L7wvWdce0GRixjh_6JiqWmWMws46hwEt3hboaS1e1e4EoWCvj5b0M_jVwvSxBOAW5emFzvT3QrnRh4nyYmKDERnY";
      }
      console.log("hubcloudExtractor", link);
      const baseUrl = link.split("/").slice(0, 3).join("/");
      const streamLinks = [];
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
            delete cleanHeaders["User-Agent"];
            delete cleanHeaders["sec-ch-ua"];
            delete cleanHeaders["sec-ch-ua-mobile"];
            delete cleanHeaders["sec-ch-ua-platform"];
            delete cleanHeaders["Cookie"];
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
          if (gfStream && !streamLinks.some((s) => s.link === gfStream.link)) {
            streamLinks.push(gfStream);
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
        if (gfStream && !streamLinks.some((s) => s.link === gfStream.link)) {
          streamLinks.push(gfStream);
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
            delete cleanHeaders2["User-Agent"];
            delete cleanHeaders2["sec-ch-ua"];
            delete cleanHeaders2["sec-ch-ua-mobile"];
            delete cleanHeaders2["sec-ch-ua-platform"];
            delete cleanHeaders2["Cookie"];
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
            if (((_c = error.response) == null ? void 0 : _c.status) === 403 && !openWebView) {
              console.log(
                `hubcloudExtractor: 403 Forbidden for ${vcloudLink}, but openWebView solver is not available!`
              );
            }
            let fetchRes = yield fetch(vcloudLink, {
              headers,
              signal,
              redirect: "follow"
            });
            if (fetchRes.status === 403 && openWebView) {
              console.log(
                `hubcloudExtractor: WAF detected (403) for ${vcloudLink}, using solver...`
              );
              const vcloudBaseUrl = vcloudLink.split("/").slice(0, 3).join("/");
              const cleanHeaders3 = __spreadProps(__spreadValues({}, headers), { Referer: vcloudBaseUrl });
              delete cleanHeaders3["User-Agent"];
              delete cleanHeaders3["sec-ch-ua"];
              delete cleanHeaders3["sec-ch-ua-mobile"];
              delete cleanHeaders3["sec-ch-ua-platform"];
              delete cleanHeaders3["Cookie"];
              const wafResult = yield openWebView(vcloudBaseUrl, {
                title: "Solve the captcha below and click done",
                description: "Required to bypass anti-bot protection.",
                headers: cleanHeaders3,
                waitForCookie: "cf_clearance",
                force: true
              });
              if (wafResult.userAgent) headers["User-Agent"] = wafResult.userAgent;
              headers["Cookie"] = (headers["Cookie"] ? headers["Cookie"] + "; " : "") + wafResult.cookies;
              fetchRes = yield fetch(vcloudLink, {
                headers,
                signal,
                redirect: "follow"
              });
            }
            if (!fetchRes.ok) {
              throw new Error(
                `HTTP ${fetchRes.status} ${fetchRes.statusText} | URL ${vcloudLink}`
              );
            }
            vcloudText = yield fetchRes.text();
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
              const token = (_d = link2.split("/").pop()) == null ? void 0 : _d.split("?")[0];
              const baseUrl2 = link2.split("/").slice(0, -2).join("/");
              link2 = `${baseUrl2}/api/file/${token}?download`;
            }
            streamLinks.push({ server: "Pixeldrain", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes(".dev")) && !(link2 == null ? void 0 : link2.includes("/?id="))):
            streamLinks.push({ server: "CF Worker", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes("hubcloud")) || (link2 == null ? void 0 : link2.includes("/?id="))):
            try {
              const newLinkRes = yield fetch(link2, {
                method: "HEAD",
                headers,
                signal,
                redirect: "manual"
              });
              let newLink = link2;
              if (newLinkRes.status >= 300 && newLinkRes.status < 400) {
                newLink = newLinkRes.headers.get("location") || link2;
              } else if (newLinkRes.url && newLinkRes.url !== link2) {
                newLink = newLinkRes.url;
              } else {
                newLink = newLinkRes.headers.get("location") || link2;
              }
              if (newLink.includes("googleusercontent")) {
                newLink = newLink.split("?link=")[1];
              } else {
                const newLinkRes2 = yield fetch(newLink, {
                  method: "HEAD",
                  headers,
                  signal,
                  redirect: "manual"
                });
                if (newLinkRes2.status >= 300 && newLinkRes2.status < 400) {
                  newLink = ((_e = newLinkRes2.headers.get("location")) == null ? void 0 : _e.split("?link=")[1]) || newLink;
                } else if (newLinkRes2.url && newLinkRes2.url !== newLink) {
                  newLink = newLinkRes2.url.split("?link=")[1] || newLinkRes2.url;
                } else {
                  newLink = ((_f = newLinkRes2.headers.get("location")) == null ? void 0 : _f.split("?link=")[1]) || newLink;
                }
              }
              streamLinks.push({
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
              if (gfStream && !streamLinks.some((s) => s.link === gfStream.link)) {
                streamLinks.push(gfStream);
              }
            } catch (error) {
              console.log("hubcloudExtractor error in gofile link: ", error);
            }
            break;
          case (link2 == null ? void 0 : link2.includes("cloudflarestorage")):
            streamLinks.push({ server: "CF Storage", link: link2, type: "mkv" });
            break;
          case ((link2 == null ? void 0 : link2.includes("fastdl")) || (link2 == null ? void 0 : link2.includes("fsl."))):
            streamLinks.push({ server: "FastDl", link: link2, type: "mkv" });
            break;
          case (link2.includes("hubcdn") && !link2.includes("/?id=")):
            streamLinks.push({
              server: "HubCdn",
              link: link2,
              type: "mkv"
            });
            break;
          default:
            if ((link2 == null ? void 0 : link2.includes(".mkv")) || (link2 == null ? void 0 : link2.includes("?token="))) {
              const serverName = "CF Worker";
              streamLinks.push({ server: serverName, link: link2, type: "mkv" });
            }
            break;
        }
      }
      let preferredServer = "auto";
      try {
        const specificKey = providerValue3 ? `${providerValue3}_preferredDownloadServer` : "";
        preferredServer = ((specificKey ? yield (_g = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _g.get(specificKey) : void 0) || (yield (_h = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _h.get("preferredDownloadServer")) || "auto").toLowerCase().trim();
      } catch (e) {
      }
      const getPriority = (serverName = "") => {
        const s = serverName.toLowerCase();
        if (isDownload && preferredServer !== "auto" && preferredServer !== "" && s.includes(preferredServer)) {
          return 0;
        }
        if (isDownload) {
          if (s.includes("cf worker") || s.includes("fast cloud")) return 1;
          if (s.includes("cf storage") || s.includes("resumable")) return 2;
          if (s.includes("gdrive") || s.includes("instant")) return 3;
          if (s.includes("gofile")) return 4;
          if (s.includes("pixeldrain")) return 5;
          if (s.includes("fastdl")) return 6;
          if (s.includes("hubcdn")) return 7;
          return 10;
        } else {
          if (s.includes("cf worker") || s.includes("fast cloud")) return 1;
          if (s.includes("cf storage")) return 2;
          if (s.includes("gofile")) return 3;
          if (s.includes("pixeldrain")) return 4;
          if (s.includes("fastdl")) return 5;
          if (s.includes("hubcdn")) return 6;
          if (s.includes("gdrive")) return 7;
          return 10;
        }
      };
      streamLinks.sort((a, b) => getPriority(a.server) - getPriority(b.server));
      if (isDownload && streamLinks.length > 0) {
        const isTopHealthy = yield checkStreamHealth(
          streamLinks[0],
          signal
        );
        if (!isTopHealthy) {
          let healthyIndex = -1;
          for (let i = 1; i < streamLinks.length; i++) {
            const isHealthy = yield checkStreamHealth(
              streamLinks[i],
              signal
            );
            if (isHealthy) {
              healthyIndex = i;
              break;
            }
          }
          if (healthyIndex > 0) {
            const [workingStream] = streamLinks.splice(healthyIndex, 1);
            streamLinks.unshift(workingStream);
          }
        }
      }
      console.log("streamLinks", streamLinks);
      return streamLinks;
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

// providers/eonMovies/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function getStreamQuality(label) {
  var _a;
  const resolution = Number((_a = label.match(/\b(\d{3,4})p\b/i)) == null ? void 0 : _a[1]);
  if (!resolution) return void 0;
  if (resolution >= 2160) return "2160";
  if (resolution >= 1080) return "1080";
  if (resolution >= 720) return "720";
  if (resolution >= 480) return "480";
  if (resolution >= 360) return "360";
  return void 0;
}
function addQuality(streams, quality) {
  const resolvedQuality = quality || streams.reduce(
    (result, stream) => result || getStreamQuality(decodeURIComponent(stream.link)),
    void 0
  );
  return streams.map((stream) => __spreadProps(__spreadValues({}, stream), {
    server: resolvedQuality ? `${stream.server} ${resolvedQuality}p` : stream.server,
    quality: resolvedQuality
  }));
}
function getDotflixUrl(data) {
  var _a;
  return ((_a = data.match(/https?:\/\/dotflix\.[^\s"'<>]+\/share\/[a-z\d]+/i)) == null ? void 0 : _a[0]) || "";
}
function getDotflixSharingCode(value) {
  var _a;
  try {
    const url = new URL(value);
    if (!/^(?:www\.)?dotflix\./i.test(url.hostname)) return "";
    return ((_a = url.pathname.match(/^\/share\/([a-z\d]+)/i)) == null ? void 0 : _a[1]) || "";
  } catch (e) {
    return "";
  }
}
function isHubcloudUrl(value) {
  try {
    return /(?:^|\.)hubcloud\./i.test(new URL(value).hostname);
  } catch (e) {
    return false;
  }
}
function getDotflixRouterState(sharingCode) {
  return encodeURIComponent(
    JSON.stringify([
      "",
      {
        children: [
          "share",
          {
            children: [
              ["code", sharingCode, "d"],
              { children: ["__PAGE__", {}, null, null] },
              null,
              null
            ]
          },
          null,
          null
        ]
      },
      null,
      null,
      true
    ])
  );
}
function getServerActionDownloadUrl(data) {
  if (typeof data !== "string") return "";
  for (const line of data.split(/\r?\n/)) {
    const value = line.slice(line.indexOf(":") + 1);
    try {
      const payload = JSON.parse(value);
      if ((payload == null ? void 0 : payload.success) && typeof payload.downloadUrl === "string") {
        return payload.downloadUrl;
      }
    } catch (e) {
      continue;
    }
  }
  return "";
}
function followDownloadLink(link, signal, headers) {
  return __async(this, null, function* () {
    let currentUrl = link;
    for (let index = 0; index < 5; index += 1) {
      const response = yield fetch(currentUrl, {
        headers,
        signal,
        redirect: "manual"
      });
      const location = response.headers.get("location");
      if (location) {
        currentUrl = new URL(location, currentUrl).href;
        continue;
      }
      if (!response.ok) {
        throw new Error(`EonMovies download redirect failed: ${response.status}`);
      }
      const data = yield response.text();
      const responseUrl = response.url || currentUrl;
      return {
        data,
        url: getDotflixSharingCode(responseUrl) ? responseUrl : getDotflixUrl(data) || responseUrl
      };
    }
    throw new Error("EonMovies download redirect chain exceeded the limit");
  });
}
function extractDotflixStream(link, signal, headers, providerContext) {
  return __async(this, null, function* () {
    const sharingCode = getDotflixSharingCode(link);
    if (!sharingCode) return [];
    const origin = new URL(link).origin;
    const requestHeaders = __spreadProps(__spreadValues({}, headers), { Origin: origin, Referer: link });
    const [directResult, proxyResult] = yield Promise.allSettled([
      providerContext.axios.post(
        `${origin}/api/extract-download`,
        { sharingCode },
        {
          signal,
          headers: __spreadProps(__spreadValues({}, requestHeaders), {
            "Content-Type": "application/json"
          })
        }
      ),
      providerContext.axios.post(link, JSON.stringify([sharingCode]), {
        signal,
        headers: __spreadProps(__spreadValues({}, requestHeaders), {
          Accept: "text/x-component",
          "Content-Type": "text/plain;charset=UTF-8",
          "Next-Action": dotflixProxyAction,
          "Next-Router-State-Tree": getDotflixRouterState(sharingCode)
        })
      })
    ]);
    const streams = [];
    if (directResult.status === "fulfilled") {
      const data = directResult.value.data;
      if ((data == null ? void 0 : data.success) && typeof data.downloadUrl === "string") {
        streams.push({ server: "Dotflix", link: data.downloadUrl, type: "mkv" });
      }
    }
    if (proxyResult.status === "fulfilled") {
      const proxyUrl = getServerActionDownloadUrl(proxyResult.value.data);
      if (proxyUrl && !streams.some((stream) => stream.link === proxyUrl)) {
        streams.push({ server: "Dotflix Proxy", link: proxyUrl, type: "mkv" });
      }
    }
    if (!streams.length) {
      throw new Error("Dotflix did not return a direct or proxy download URL");
    }
    return streams;
  });
}
function extractDownloadStreams(link, signal, headers, providerContext, isDownload) {
  return __async(this, null, function* () {
    if (getDotflixSharingCode(link)) {
      return extractDotflixStream(link, signal, headers, providerContext);
    }
    if (isHubcloudUrl(link)) {
      return hubcloudExtractor(
        link,
        signal,
        providerContext.axios,
        providerContext.cheerio,
        __spreadValues({}, headers),
        providerContext,
        isDownload,
        "eonMovies"
      );
    }
    return [];
  });
}
function getStream(_0) {
  return __async(this, arguments, function* ({
    link,
    type,
    signal,
    providerContext,
    isDownload
  }) {
    const headers = __spreadValues({}, providerContext.commonHeaders);
    const page = yield followDownloadLink(link, signal, headers);
    if (getDotflixSharingCode(page.url) || isHubcloudUrl(page.url)) {
      const streams2 = yield extractDownloadStreams(
        page.url,
        signal,
        headers,
        providerContext,
        isDownload,
        "eonMovies"
      );
      return addQuality(streams2);
    }
    const $ = providerContext.cheerio.load(page.data);
    const downloadLinks = $(".dl-row a[href*='/dl/']").map((_, element) => {
      const anchor = $(element);
      const row = anchor.closest(".dl-row");
      const label = row.attr("data-dlname") || row.find(".dl-row-name").text().replace(/\s+/g, " ").trim();
      return {
        link: new URL(anchor.attr("href") || "", page.url).href,
        quality: getStreamQuality(label)
      };
    }).get();
    if (!downloadLinks.length) {
      throw new Error(
        `EonMovies did not redirect to Dotflix or HubCloud: ${page.url}`
      );
    }
    const streams = [];
    const seen = /* @__PURE__ */ new Set();
    for (const downloadLink of downloadLinks) {
      const downloadPage = yield followDownloadLink(
        downloadLink.link,
        signal,
        headers
      );
      if (!getDotflixSharingCode(downloadPage.url) && !isHubcloudUrl(downloadPage.url)) {
        continue;
      }
      const extracted = yield extractDownloadStreams(
        downloadPage.url,
        signal,
        headers,
        providerContext,
        isDownload,
        "eonMovies"
      );
      addQuality(extracted, downloadLink.quality).forEach((stream) => {
        if (!seen.has(stream.link)) {
          seen.add(stream.link);
          streams.push(stream);
        }
      });
    }
    return streams;
  });
}
var dotflixProxyAction;
var init_stream = __esm({
  "providers/eonMovies/stream.ts"() {
    "use strict";
    init_hubcloud();
    dotflixProxyAction = "4020c531ae02b8be9927fed961160ff20b3f81aafa";
  }
});

// providers/eonMovies/eonMovies.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
