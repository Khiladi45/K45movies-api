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

// providers/disneyMirror/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/disneyMirror/catalog.ts"() {
    "use strict";
    catalog = [
      {
        title: "Hotstar Specials",
        filter: "Hotstar Specials"
      },
      {
        title: "Walt Disney Animation Studios",
        filter: "Walt Disney Animation Studios"
      },
      {
        title: "Princesses & Fairy Tales",
        filter: "Princesses & Fairy Tales"
      },
      {
        title: "Live Action Movies",
        filter: "Live Action Movies"
      }
    ];
    genres = [];
  }
});

// providers/netMirrorCommon.ts
var getNetMirrorBaseUrl, getNetMirrorMobileHeaders, unlockNetMirrorMobileSession, unlockPromises, unlockSharedSession, usableSessionToken, getNetMirrorCookie, resolveNewTvApiBase, getPosterUrl, netMirrorSearch, homeTrayCache, titleCache, parseHtmlTrays, getCachedHomeTrays, netMirrorGetPosts, netMirrorGetMeta, netMirrorGetEpisodes, netMirrorGetStream;
var init_netMirrorCommon = __esm({
  "providers/netMirrorCommon.ts"() {
    "use strict";
    getNetMirrorBaseUrl = (providerContext) => __async(null, null, function* () {
      try {
        if (providerContext == null ? void 0 : providerContext.kvStore) {
          const override = yield providerContext.kvStore.get("baseUrlOverride");
          if (override && override.trim().startsWith("http")) {
            return override.trim().replace(/\/+$/, "");
          }
        }
      } catch (e) {
      }
      return "https://net52.cc";
    });
    getNetMirrorMobileHeaders = (baseUrl, cookieStr) => {
      const headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 13; Pixel 5 Build/TQ3A.230901.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/144.0.7559.132 Safari/537.36 /OS.Gatu v3.0",
        Referer: `${baseUrl}/home`,
        Origin: baseUrl,
        Accept: "application/json, text/plain, */*"
      };
      if (cookieStr) {
        headers["Cookie"] = cookieStr;
      }
      return headers;
    };
    unlockNetMirrorMobileSession = (providerContext, baseUrl) => __async(null, null, function* () {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const { axios, kvStore } = providerContext;
      try {
        const appUa = "Mozilla/5.0 (Linux; Android 13; Pixel 5 Build/TQ3A.230901.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/144.0.7559.132 Safari/537.36 /OS.Gatu v3.0";
        const homeRes = yield axios.get(`${baseUrl}/mobile/home?app=1`, {
          headers: {
            "User-Agent": appUa,
            "X-Requested-With": "com.netmirror.app",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          },
          timeout: 8e3
        });
        const setCookies = ((_a = homeRes.headers) == null ? void 0 : _a["set-cookie"]) || ((_b = homeRes.headers) == null ? void 0 : _b["x-set-cookie"]) || [];
        const cookiesArr = Array.isArray(setCookies) ? setCookies : [setCookies];
        const initialCookie = cookiesArr.map((c) => String(c).split(";")[0]).filter(Boolean).join("; ");
        for (const cookie of cookiesArr) {
          const token = usableSessionToken((_c = String(cookie).match(/t_hash_t=([^;]+)/)) == null ? void 0 : _c[1]);
          if (token) {
            if (kvStore) {
              yield kvStore.set("t_hash_t", token);
              yield kvStore.set("t_hash_t_data", { token, ts: Date.now() });
            }
            return token;
          }
        }
        const html = typeof homeRes.data === "string" ? homeRes.data : "";
        const matchAddHash = html.match(/data-addhash=["']([^"']+)["']/);
        const addhash = matchAddHash ? matchAddHash[1] : null;
        if (!addhash) return void 0;
        const hostDomain = baseUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        const userverUrl = `https://userver.${hostDomain}/?hee5=${addhash}&a=y&t=${Math.random()}`;
        yield axios.get(userverUrl, {
          headers: {
            "User-Agent": appUa,
            Referer: `${baseUrl}/mobile/home?app=1`,
            Cookie: initialCookie,
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          },
          maxRedirects: 0,
          validateStatus: () => true,
          timeout: 5e3
        }).catch(() => {
        });
        const pollCookie = [
          "ext_name=ojplmecpdpgccookcobabopnaifgidhf",
          `addhash=${encodeURIComponent(addhash)}`,
          initialCookie
        ].filter(Boolean).join("; ");
        const startTime = Date.now();
        let verifiedToken;
        while (Date.now() - startTime < 45e3) {
          yield new Promise((resolve) => setTimeout(resolve, 2e3));
          try {
            const vRes = yield axios.post(
              `${baseUrl}/mobile/verify2.php`,
              `verify=${encodeURIComponent(addhash)}`,
              {
                headers: {
                  "User-Agent": appUa,
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                  Referer: `${baseUrl}/mobile/home`,
                  Origin: baseUrl,
                  Cookie: pollCookie
                },
                validateStatus: () => true,
                timeout: 5e3
              }
            );
            const vSetCookies = ((_d = vRes.headers) == null ? void 0 : _d["set-cookie"]) || ((_e = vRes.headers) == null ? void 0 : _e["x-set-cookie"]) || [];
            const vCookiesArr = Array.isArray(vSetCookies) ? vSetCookies : [vSetCookies];
            for (const sc of vCookiesArr) {
              if (typeof sc === "string" && sc.includes("t_hash_t=")) {
                const tokenMatch = sc.match(/t_hash_t=([^;]+)/);
                if (tokenMatch && !tokenMatch[1].includes("::99")) {
                  verifiedToken = decodeURIComponent(tokenMatch[1]);
                  break;
                }
              }
            }
            if (verifiedToken) {
              break;
            }
            if (((_f = vRes.data) == null ? void 0 : _f.statusup) === "All Done") {
              const reloadRes = yield axios.get(`${baseUrl}/mobile/home?app=1`, {
                headers: {
                  "User-Agent": appUa,
                  "X-Requested-With": "com.netmirror.app",
                  Cookie: pollCookie
                },
                timeout: 6e3
              }).catch(() => null);
              const rSetCookies = ((_g = reloadRes == null ? void 0 : reloadRes.headers) == null ? void 0 : _g["set-cookie"]) || ((_h = reloadRes == null ? void 0 : reloadRes.headers) == null ? void 0 : _h["x-set-cookie"]) || [];
              const rCookiesArr = Array.isArray(rSetCookies) ? rSetCookies : [rSetCookies];
              for (const sc of rCookiesArr) {
                if (typeof sc === "string" && sc.includes("t_hash_t=")) {
                  const tokenMatch = sc.match(/t_hash_t=([^;]+)/);
                  if (tokenMatch && !tokenMatch[1].includes("::99")) {
                    verifiedToken = decodeURIComponent(tokenMatch[1]);
                    break;
                  }
                }
              }
              break;
            }
          } catch (e) {
          }
        }
        if (verifiedToken && kvStore) {
          yield kvStore.set("t_hash_t", verifiedToken);
          yield kvStore.set("t_hash_t_data", { token: verifiedToken, ts: Date.now() });
        }
        return verifiedToken;
      } catch (err) {
        console.log("Mobile ad verification notice:", (err == null ? void 0 : err.message) || err);
        return void 0;
      }
    });
    unlockPromises = /* @__PURE__ */ new Map();
    unlockSharedSession = (providerContext, baseUrl) => {
      let promise = unlockPromises.get(baseUrl);
      if (!promise) {
        promise = unlockNetMirrorMobileSession(providerContext, baseUrl).finally(() => {
          unlockPromises.delete(baseUrl);
        });
        unlockPromises.set(baseUrl, promise);
      }
      return promise;
    };
    usableSessionToken = (value) => {
      if (typeof value !== "string" || !value.trim()) return void 0;
      let token = value.trim();
      try {
        token = decodeURIComponent(token);
      } catch (e) {
      }
      if (token.includes("::99")) return void 0;
      const timestamp = token.split("::")[2];
      if (timestamp && /^\d{10}$/.test(timestamp) && Date.now() / 1e3 - Number(timestamp) >= 43200) return void 0;
      return token;
    };
    getNetMirrorCookie = (providerContext, ott, unlockIfMissing = true) => __async(null, null, function* () {
      const { kvStore } = providerContext;
      const baseUrl = yield getNetMirrorBaseUrl(providerContext);
      const ottCookie = ott === "hs" ? "dp" : ott === "pv" ? "pv" : "nf";
      let t_hash_t;
      try {
        if (kvStore) {
          const cached = yield kvStore.get("t_hash_t_data");
          const userToken = usableSessionToken(yield kvStore.get("t_hash_t"));
          if (userToken && userToken !== usableSessionToken(cached == null ? void 0 : cached.token)) {
            t_hash_t = userToken;
            yield kvStore.set("t_hash_t_data", { token: t_hash_t, ts: Date.now() });
          }
          if (!t_hash_t && cached && Date.now() - cached.ts < 432e5) {
            t_hash_t = usableSessionToken(cached.token);
          }
        }
      } catch (e) {
      }
      if (!t_hash_t && unlockIfMissing) {
        t_hash_t = yield unlockSharedSession(providerContext, baseUrl);
        if (t_hash_t && kvStore) {
          yield kvStore.set("t_hash_t", t_hash_t);
          yield kvStore.set("t_hash_t_data", { token: t_hash_t, ts: Date.now() });
        }
      }
      return [t_hash_t ? `t_hash_t=${t_hash_t}` : "", "hd=on", `ott=${ottCookie}`].filter(Boolean).join("; ");
    });
    resolveNewTvApiBase = (providerContext) => __async(null, null, function* () {
      var _a;
      const { axios, kvStore } = providerContext;
      try {
        if (kvStore) {
          const cached = yield kvStore.get("newtv_api_base");
          if (cached && cached.apiBase && Date.now() - cached.ts < 864e5) {
            return cached.apiBase;
          }
        }
      } catch (e) {
      }
      const domains = [
        "https://mobiledetects.com",
        "https://mobiledetect.app",
        "https://mobidetect.art",
        "https://mobidetect.cc",
        "https://mobidetect.shop",
        "https://mobidetects.top"
      ];
      for (const domain of domains) {
        try {
          const res = yield axios.get(`${domain}/checknewtv.php`, {
            headers: {
              "X-Requested-With": "NetmirrorNewTV v1.0",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0 /OS.GatuNewTV v1.0",
              Accept: "application/json, text/plain, */*"
            },
            timeout: 4e3
          });
          const tokenHash = (_a = res.data) == null ? void 0 : _a.token_hash;
          if (tokenHash) {
            const decoded = typeof atob === "function" ? atob(tokenHash) : Buffer.from(tokenHash, "base64").toString("utf-8");
            const apiBase = decoded.trim().replace(/\/+$/, "");
            if (apiBase.startsWith("http")) {
              if (kvStore) {
                yield kvStore.set("newtv_api_base", { apiBase, ts: Date.now() });
              }
              return apiBase;
            }
          }
        } catch (e) {
        }
      }
      return "https://tv.imgcdn.kim";
    });
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
      var _a;
      try {
        if (page > 1) return [];
        const { axios } = providerContext;
        const baseUrl = yield getNetMirrorBaseUrl(providerContext);
        const query = searchQuery == null ? void 0 : searchQuery.trim();
        if (!query) return [];
        const cookies = yield getNetMirrorCookie(providerContext, prefix);
        const t = Math.round(Date.now() / 1e3);
        const url = `${baseUrl}/mobile/search.php?s=${encodeURIComponent(query)}&t=${t}`;
        const res = yield axios.get(url, {
          signal,
          headers: getNetMirrorMobileHeaders(baseUrl, cookies)
        });
        const results = ((_a = res.data) == null ? void 0 : _a.searchResult) || [];
        const catalog2 = [];
        for (const item of results) {
          const id = item == null ? void 0 : item.id;
          const title = (item == null ? void 0 : item.t) || "";
          if (!id) continue;
          const image = getPosterUrl(id, prefix);
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
    homeTrayCache = /* @__PURE__ */ new Map();
    titleCache = /* @__PURE__ */ new Map();
    parseHtmlTrays = (html, cheerio) => {
      const trays = [];
      if (!html || typeof html !== "string") return trays;
      if (cheerio && typeof cheerio.load === "function") {
        try {
          const $ = cheerio.load(html);
          $(".tray-container").each((_i, el) => {
            const title = $(el).find("h2").first().text().trim();
            const items = [];
            $(el).find("article").each((_j, art) => {
              const a = $(art).find("a[data-post]").first();
              const id = a.attr("data-post") || $(art).attr("data-post");
              const img = $(art).find("img").attr("data-src") || $(art).find("img").attr("src");
              const alt = $(art).find("img").attr("alt") || "";
              if (id) {
                items.push({ id, image: img || "", alt });
              }
            });
            if (title && items.length > 0) {
              trays.push({ title, items });
            }
          });
          $("#top10, .top10").each((_i, el) => {
            const title = $(el).find("span").first().text().trim() || "Top 10 Today";
            const items = [];
            $(el).find(".top10-post, article").each((_j, art) => {
              const a = $(art).find("a[data-post]").first();
              const id = a.attr("data-post") || $(art).attr("data-post");
              const img = $(art).find("img").attr("data-src") || $(art).find("img").attr("src");
              if (id) {
                items.push({ id, image: img || "", alt: "" });
              }
            });
            if (title && items.length > 0 && !trays.some((t) => t.title.toLowerCase() === title.toLowerCase())) {
              trays.push({ title, items });
            }
          });
          if (trays.length > 0) return trays;
        } catch (e) {
        }
      }
      const traySections = html.split(/class="[^"]*tray-container[^"]*"/);
      for (let i = 1; i < traySections.length; i++) {
        const sec = traySections[i];
        const h2Match = sec.match(/<h2[^>]*>([^<]+)<\/h2>/);
        const title = h2Match ? h2Match[1].trim() : "";
        const items = [];
        const artMatches = sec.match(/<article[\s\S]*?<\/article>/g) || [];
        for (const art of artMatches) {
          const idMatch = art.match(/data-post="([^"]+)"/);
          const imgMatch = art.match(/data-src="([^"]+)"/) || art.match(/src="([^"]+)"/);
          const altMatch = art.match(/alt="([^"]*)"/);
          if (idMatch) {
            items.push({
              id: idMatch[1],
              image: imgMatch ? imgMatch[1] : "",
              alt: altMatch ? altMatch[1] : ""
            });
          }
        }
        if (title && items.length > 0 && !trays.some((t) => t.title.toLowerCase() === title.toLowerCase())) {
          trays.push({ title, items });
        }
      }
      return trays;
    };
    getCachedHomeTrays = (providerContext, prefix) => __async(null, null, function* () {
      const cached = homeTrayCache.get(prefix);
      if (cached && Date.now() - cached.timestamp < 9e5) {
        return cached.trays;
      }
      try {
        const { axios, cheerio } = providerContext;
        const baseUrl = yield getNetMirrorBaseUrl(providerContext);
        let cookies = yield getNetMirrorCookie(providerContext, prefix, false);
        const url = `${baseUrl}/mobile/home?app=1`;
        const homeHeaders = __spreadProps(__spreadValues({}, getNetMirrorMobileHeaders(baseUrl, cookies)), {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "en-IN,en-US;q=0.9,en;q=0.8",
          "X-Requested-With": "XMLHttpRequest",
          Referer: `${baseUrl}/mobile/home?app=1`
        });
        const res = yield axios.get(url, {
          headers: homeHeaders,
          timeout: 1e4
        });
        const html = typeof res.data === "string" ? res.data : "";
        let trays = parseHtmlTrays(html, cheerio);
        if (trays.length === 0 && (html.includes("data-addhash") || html.includes("verify2.php") || !cookies.includes("t_hash_t="))) {
          if (providerContext.kvStore) {
            try {
              yield providerContext.kvStore.delete("t_hash_t");
              yield providerContext.kvStore.delete("t_hash_t_data");
            } catch (e) {
            }
          }
          const newCookie = yield unlockSharedSession(providerContext, baseUrl);
          if (newCookie && !newCookie.includes("::99")) {
            const freshCookies = `t_hash_t=${newCookie}; hd=on; ott=${prefix === "hs" ? "dp" : prefix === "pv" ? "pv" : "nf"}`;
            cookies = freshCookies;
            const retryRes = yield axios.get(url, {
              headers: __spreadProps(__spreadValues({}, getNetMirrorMobileHeaders(baseUrl, freshCookies)), {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Language": "en-IN,en-US;q=0.9,en;q=0.8",
                "X-Requested-With": "XMLHttpRequest",
                Referer: `${baseUrl}/mobile/home?app=1`
              }),
              timeout: 1e4
            });
            trays = parseHtmlTrays(retryRes.data, cheerio);
          }
        }
        if (prefix === "hs") {
          try {
            const hsCookies = cookies.replace("ott=dp", "ott=hs").replace("ott=nf", "ott=hs");
            const hsRes = yield axios.get(url, {
              headers: __spreadProps(__spreadValues({}, homeHeaders), {
                Cookie: hsCookies
              }),
              timeout: 1e4
            });
            const hsTrays = parseHtmlTrays(hsRes.data, cheerio);
            for (const ht of hsTrays) {
              if (!trays.some((t) => t.title.toLowerCase() === ht.title.toLowerCase())) {
                trays.push(ht);
              }
            }
          } catch (e) {
          }
        }
        if (trays.length > 0) {
          homeTrayCache.set(prefix, { trays, timestamp: Date.now() });
          return trays;
        }
      } catch (err) {
        console.error(`getCachedHomeTrays error [${prefix}]:`, err);
      }
      return cached ? cached.trays : [];
    });
    netMirrorGetPosts = (_0) => __async(null, [_0], function* ({
      filter,
      page,
      prefix,
      signal,
      providerContext
    }) {
      var _a, _b, _c;
      try {
        if (page > 1) return [];
        const { axios } = providerContext;
        const baseUrl = yield getNetMirrorBaseUrl(providerContext);
        const prefixPath = prefix ? `${prefix}/` : "";
        const t = Math.round(Date.now() / 1e3);
        const cleanFilter = (filter || "").trim().toLowerCase();
        const trays = yield getCachedHomeTrays(providerContext, prefix);
        const aliasMap = {
          "us tv shows": "us tv shows",
          "us & international tv shows": "us tv shows dubbed in hindi",
          "action": prefix === "pv" ? "action films" : "blockbuster movies",
          "action & adventure": prefix === "pv" ? "action films" : "blockbuster movies",
          "get in on the action": prefix === "pv" ? "action films" : "blockbuster movies",
          "action films": "action films",
          "drama": prefix === "pv" ? "drama series" : "emotional tv shows",
          "tv dramas": prefix === "pv" ? "drama series" : "emotional tv shows",
          "drama series": "drama series",
          "sci-fi": prefix === "pv" ? "science fiction movies" : "exciting tv shows",
          "sci-fi & fantasy": prefix === "pv" ? "science fiction movies" : "exciting tv shows",
          "tv sci-fi & fantasy": prefix === "pv" ? "science fiction movies" : "exciting tv shows",
          "mystery & thriller": prefix === "pv" ? "mystery and thriller movies" : "crime tv shows",
          "tv thrillers & mysteries": prefix === "pv" ? "mystery and thriller movies" : "crime tv shows",
          "suspense & thriller": prefix === "pv" ? "mystery and thriller movies" : "crime tv shows",
          "comedy": prefix === "pv" ? "comedy movies" : "casual viewing",
          "comedy movies": "comedy movies",
          "kids & family": prefix === "pv" ? "kids and family movies" : "teen tv shows",
          "kids & family movies": "kids and family movies",
          "children & family tv": prefix === "pv" ? "kids and family movies" : "teen tv shows",
          "asian movies & tv": "hindi movies & tv",
          "exciting movies": "exciting tv shows",
          "your next watch": "crowd pleasers",
          "gems for you": "gems for you",
          "international tv shows": "us tv shows dubbed in hindi",
          "korean": "korean",
          "korean dramas": "korean",
          "hotstar specials": "hotstar specials",
          "latest releases": "latest releases",
          "horror": prefix === "pv" ? "horror films" : "horror stories",
          "horror films": "horror films",
          "horror stories": "horror stories",
          "only on netflix": "only on netflix",
          "new on netflix": "new on netflix",
          "top movies": "top 10 movies in netflix today",
          "featured originals: series": "featured originals: series",
          "featured originals: movies": "featured originals: movies",
          "latest movies": "latest movies"
        };
        let matchedTray = trays.find(
          (tr) => tr.title.toLowerCase() === cleanFilter
        );
        if (!matchedTray && aliasMap[cleanFilter]) {
          const alias = aliasMap[cleanFilter];
          matchedTray = trays.find(
            (tr) => tr.title.toLowerCase() === alias
          );
        }
        if (!matchedTray) {
          matchedTray = trays.find((tr) => {
            const trTitle = tr.title.toLowerCase();
            return trTitle.includes(cleanFilter) || cleanFilter.includes(trTitle);
          });
        }
        if (!matchedTray && trays.length > 0) {
          matchedTray = trays[0];
        }
        if (matchedTray && matchedTray.items.length > 0) {
          const cookies2 = yield getNetMirrorCookie(providerContext, prefix);
          const itemsToFetch = matchedTray.items.filter(
            (it) => {
              var _a2;
              return !titleCache.has(it.id) && !((_a2 = it.alt) == null ? void 0 : _a2.trim());
            }
          );
          if (itemsToFetch.length > 0) {
            yield Promise.all(
              itemsToFetch.map((it) => __async(null, null, function* () {
                try {
                  const postUrl = `${baseUrl}/mobile/${prefixPath}post.php?id=${it.id}&t=${t}`;
                  const postRes = yield axios.get(postUrl, {
                    headers: getNetMirrorMobileHeaders(baseUrl, cookies2),
                    timeout: 6e3
                  });
                  const tData = postRes.data;
                  if (tData && tData.title) {
                    titleCache.set(it.id, tData.title);
                  }
                } catch (e) {
                }
              }))
            );
          }
          const catalog3 = [];
          for (const it of matchedTray.items) {
            const title = titleCache.get(it.id) || ((_a = it.alt) == null ? void 0 : _a.trim()) || `Item ${it.id}`;
            const image = it.image || getPosterUrl(it.id, prefix);
            const link = `${it.id}|${prefix}|${encodeURIComponent(title)}`;
            catalog3.push({
              title,
              link,
              image,
              aspectRatio: prefix === "pv" ? 16 / 9 : void 0
            });
          }
          return catalog3;
        }
        const cookies = yield getNetMirrorCookie(providerContext, prefix, false);
        const url = `${baseUrl}/mobile/search.php?s=${encodeURIComponent(filter)}&t=${t}`;
        const res = yield axios.get(url, {
          signal,
          headers: getNetMirrorMobileHeaders(baseUrl, cookies)
        });
        const results = ((_b = res.data) == null ? void 0 : _b.searchResult) || [];
        const catalog2 = [];
        for (const item of results) {
          const id = item == null ? void 0 : item.id;
          const title = (item == null ? void 0 : item.t) || "";
          if (!id) continue;
          titleCache.set(String(id), title);
          const image = getPosterUrl(id, prefix);
          const link = `${id}|${prefix}|${encodeURIComponent(title)}`;
          catalog2.push({
            title,
            link,
            image,
            tag: (item == null ? void 0 : item.y) || ((item == null ? void 0 : item.r) && item.r !== "Series" ? item.r : void 0),
            aspectRatio: prefix === "pv" ? 16 / 9 : void 0
          });
        }
        if (catalog2.length === 0 && trays.length > 0 && trays[0].items.length > 0) {
          for (const it of trays[0].items) {
            const title = titleCache.get(it.id) || ((_c = it.alt) == null ? void 0 : _c.trim()) || `Item ${it.id}`;
            const image = it.image || getPosterUrl(it.id, prefix);
            const link = `${it.id}|${prefix}|${encodeURIComponent(title)}`;
            catalog2.push({
              title,
              link,
              image,
              aspectRatio: prefix === "pv" ? 16 / 9 : void 0
            });
          }
        }
        return catalog2;
      } catch (err) {
        console.error(`netMirrorGetPosts error [${prefix}]:`, err);
        return [];
      }
    });
    netMirrorGetMeta = (_0) => __async(null, [_0], function* ({
      link,
      prefix: defaultPrefix,
      providerContext
    }) {
      const { axios } = providerContext;
      const baseUrl = yield getNetMirrorBaseUrl(providerContext);
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
      } else if (link.includes("id=")) {
        try {
          id = link.split("id=")[1].split("&")[0];
          if (link.includes("title=")) {
            titleFromLink = decodeURIComponent(link.split("title=")[1].split("&")[0]);
          }
        } catch (e) {
        }
      } else {
        id = link;
      }
      const cookies = yield getNetMirrorCookie(providerContext, prefix);
      const prefixPath = prefix ? `${prefix}/` : "";
      const t = Math.round(Date.now() / 1e3);
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
        const postUrl = `${baseUrl}/mobile/${prefixPath}post.php?id=${id}&t=${t}`;
        const res = yield axios.get(postUrl, {
          headers: getNetMirrorMobileHeaders(baseUrl, cookies)
        });
        const data = res.data;
        if (data) {
          title = data.title || title;
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
          if (Array.isArray(data.season) && data.season.length > 0) {
            type = "series";
            data.season.forEach((s) => {
              const sNum = String(s.s || s.name || "1").replace(/[^0-9]/g, "") || "1";
              linkList.push({
                title: `Season ${s.s || s.name || "1"}`,
                episodesLink: `${s.id}|${id}|${prefix}|${encodeURIComponent(title)}|${sNum}`
              });
            });
          } else if (Array.isArray(data.episodes) && data.episodes.length > 0) {
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
        console.error(`netMirrorGetMeta post.php error [${prefix}]:`, err);
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
      const baseUrl = yield getNetMirrorBaseUrl(providerContext);
      const t = Math.round(Date.now() / 1e3);
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
      const cookies = yield getNetMirrorCookie(providerContext, prefix);
      const prefixPath = prefix ? `${prefix}/` : "";
      const episodeList = [];
      let page = 1;
      let hasMorePages = true;
      while (hasMorePages && page <= 6) {
        try {
          const url = `${baseUrl}/mobile/${prefixPath}episodes.php?s=${sid}&series=${seriesId}&t=${t}&page=${page}`;
          const res = yield axios.get(url, {
            signal,
            headers: getNetMirrorMobileHeaders(baseUrl, cookies)
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
      const { axios } = providerContext;
      const baseUrl = yield getNetMirrorBaseUrl(providerContext);
      let id = rawId;
      let prefix = defaultPrefix;
      let title = "";
      let seasonNum;
      let episodeNum;
      if (rawId.includes("|")) {
        const parts = rawId.split("|");
        id = parts[0];
        prefix = parts[1] || defaultPrefix;
        if (parts[2]) {
          try {
            title = decodeURIComponent(parts[2]);
          } catch (e) {
            title = parts[2];
          }
        }
        if (parts[3]) seasonNum = parseInt(parts[3], 10) || void 0;
        if (parts[4]) episodeNum = parseInt(parts[4], 10) || void 0;
      }
      if (!title) {
        const cachedTitle = titleCache.get(id);
        if (cachedTitle) {
          title = cachedTitle;
        } else {
          try {
            const cookies2 = yield getNetMirrorCookie(providerContext, prefix);
            const prefixPath = prefix ? `${prefix}/` : "";
            const t = Math.round(Date.now() / 1e3);
            const postRes = yield axios.get(
              `${baseUrl}/mobile/${prefixPath}post.php?id=${id}&t=${t}`,
              {
                headers: getNetMirrorMobileHeaders(baseUrl, cookies2),
                timeout: 3e3
              }
            );
            const pData = postRes.data;
            if (pData == null ? void 0 : pData.title) {
              title = pData.title;
              titleCache.set(id, title);
              if (pData.s && seasonNum === void 0) {
                seasonNum = parseInt(String(pData.s).replace(/[^0-9]/g, ""), 10) || void 0;
              }
              if (pData.ep && episodeNum === void 0) {
                episodeNum = parseInt(String(pData.ep).replace(/[^0-9]/g, ""), 10) || void 0;
              }
            }
          } catch (e) {
          }
        }
      }
      const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
      const serverName = prefix === "hs" ? "Disney+" : prefix === "pv" ? "Prime Video" : "Netflix";
      const streamLinks = [];
      let cookies = "";
      try {
        cookies = yield getNetMirrorCookie(providerContext, prefix);
        const tm = Math.round(Date.now() / 1e3);
        const prefixPath = prefix === "hs" ? "hs/" : prefix === "pv" ? "pv/" : "";
        let plData = null;
        const plUrlsToTry = [
          ...prefixPath ? [`${baseUrl}/mobile/${prefixPath}playlist.php?id=${id}&t=${encodeURIComponent(title || "Title")}&tm=${tm}`] : [],
          `${baseUrl}/mobile/playlist.php?id=${id}&t=${encodeURIComponent(title || "Title")}&tm=${tm}`
        ];
        for (const plUrl of plUrlsToTry) {
          try {
            const mPlRes = yield axios.get(plUrl, {
              signal,
              headers: getNetMirrorMobileHeaders(baseUrl, cookies),
              timeout: 6e3
            });
            const resData = Array.isArray(mPlRes.data) ? mPlRes.data[0] : mPlRes.data;
            if (resData && Array.isArray(resData.sources) && resData.sources.length > 0) {
              plData = resData;
              break;
            }
          } catch (e) {
          }
        }
        if (!plData || !Array.isArray(plData.sources)) {
          try {
            const nativeHost = "https://net77.cc";
            const playRes = yield axios.post(
              `${nativeHost}/play.php`,
              `id=${id}`,
              {
                signal,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                  Origin: nativeHost,
                  Referer: `${nativeHost}/home`,
                  Cookie: cookies,
                  "X-Requested-With": "XMLHttpRequest",
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
                },
                timeout: 5e3
              }
            );
            const playData = playRes.data;
            if (playData && playData.h) {
              const playlistUrl = `${nativeHost}/playlist.php?id=${id}&t=${encodeURIComponent(
                title || "Title"
              )}&tm=${tm}&h=${encodeURIComponent(playData.h)}`;
              const plRes = yield axios.get(playlistUrl, {
                signal,
                headers: {
                  Accept: "application/json, text/javascript, */*; q=0.01",
                  Referer: `${nativeHost}/home`,
                  Origin: nativeHost,
                  Cookie: cookies,
                  "X-Requested-With": "XMLHttpRequest",
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                },
                timeout: 5e3
              });
              plData = Array.isArray(plRes.data) ? plRes.data[0] : plRes.data;
            }
          } catch (e) {
          }
        }
        if (plData && Array.isArray(plData.sources)) {
          const subtitles = [];
          if (Array.isArray(plData.tracks)) {
            plData.tracks.forEach((track) => {
              let uri = track.file || "";
              if (uri.startsWith("//")) uri = "https:" + uri;
              if (!uri) return;
              const isVtt = uri.endsWith(".vtt");
              subtitles.push({
                title: track.label || "Subtitle",
                language: track.label || "English",
                type: isVtt ? "text/vtt" : "application/x-subrip",
                uri
              });
            });
          }
          let hadAbuseVideo = false;
          const firstSource = plData.sources[0];
          if (firstSource && firstSource.file) {
            let testUrl = firstSource.file;
            if (!testUrl.startsWith("http")) testUrl = `${baseUrl}${testUrl}`;
            try {
              const checkRes = yield axios.get(testUrl, {
                signal,
                headers: getNetMirrorMobileHeaders(baseUrl, cookies),
                timeout: 2500
              });
              const content = typeof checkRes.data === "string" ? checkRes.data : "";
              if (content.includes("220884") || content.includes("Only Valid Users Allowed")) {
                hadAbuseVideo = true;
              }
            } catch (e) {
            }
          }
          let validSources = [];
          if (!hadAbuseVideo) {
            for (const s of plData.sources) {
              let fUrl = s.file || "";
              if (!fUrl) continue;
              if (!fUrl.startsWith("http")) fUrl = `${baseUrl}${fUrl}`;
              validSources.push(__spreadProps(__spreadValues({}, s), { file: fUrl }));
            }
          }
          if (hadAbuseVideo) {
            if (providerContext.kvStore) {
              try {
                yield providerContext.kvStore.delete("t_hash_t");
                yield providerContext.kvStore.delete("t_hash_t_data");
              } catch (e) {
              }
            }
            const newCookie = yield unlockNetMirrorMobileSession(providerContext, baseUrl);
            if (newCookie && !newCookie.includes("::99")) {
              if (providerContext.kvStore) {
                yield providerContext.kvStore.set("t_hash_t", newCookie);
                yield providerContext.kvStore.set("t_hash_t_data", {
                  token: newCookie,
                  ts: Date.now()
                });
              }
              cookies = `t_hash_t=${newCookie}; hd=on; ott=${ottHeader === "hs" ? "dp" : ottHeader}`;
              const retryUrls = [
                ...prefixPath ? [`${baseUrl}/mobile/${prefixPath}playlist.php?id=${id}&t=${encodeURIComponent(title || "Title")}&tm=${Math.round(Date.now() / 1e3)}`] : [],
                `${baseUrl}/mobile/playlist.php?id=${id}&t=${encodeURIComponent(title || "Title")}&tm=${Math.round(Date.now() / 1e3)}`
              ];
              for (const rUrl of retryUrls) {
                try {
                  const newMPlRes = yield axios.get(rUrl, {
                    signal,
                    headers: getNetMirrorMobileHeaders(baseUrl, cookies),
                    timeout: 5e3
                  });
                  const newPlData = Array.isArray(newMPlRes.data) ? newMPlRes.data[0] : newMPlRes.data;
                  if (newPlData && Array.isArray(newPlData.sources) && newPlData.sources.length > 0) {
                    validSources = [];
                    for (const s of newPlData.sources) {
                      let fUrl = s.file || "";
                      if (!fUrl) continue;
                      if (!fUrl.startsWith("http")) fUrl = `${baseUrl}${fUrl}`;
                      validSources.push(__spreadProps(__spreadValues({}, s), { file: fUrl }));
                    }
                    break;
                  }
                } catch (e) {
                }
              }
            }
          }
          validSources.forEach((source) => {
            const fileUrl = source.file;
            let quality = "1080";
            const label = (source.label || "").toLowerCase();
            if (label.includes("full hd") || fileUrl.includes("1080p")) quality = "1080";
            else if (label.includes("mid hd") || fileUrl.includes("720p")) quality = "720";
            else if (label.includes("low hd") || fileUrl.includes("480p")) quality = "480";
            else if (label.includes("360p")) quality = "360";
            streamLinks.push({
              server: `${serverName} ${source.label || "HLS"}`,
              link: fileUrl,
              type: "m3u8",
              quality,
              subtitles: subtitles.length > 0 ? subtitles : void 0,
              headers: getNetMirrorMobileHeaders(baseUrl, cookies)
            });
          });
        }
      } catch (err) {
        console.log(`Native NetMirror playlist flow for ${id}:`, err);
      }
      if (streamLinks.length === 0) {
        try {
          const apiBase = yield resolveNewTvApiBase(providerContext);
          const playerUrl = `${apiBase}/newtv/player.php?id=${id}`;
          const res = yield axios.get(playerUrl, {
            signal,
            headers: {
              Ott: ottHeader,
              "X-Requested-With": "NetmirrorNewTV v1.0",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0 /OS.GatuNewTV v1.0",
              Accept: "application/json, text/plain, */*"
            },
            timeout: 5e3
          });
          const data = res.data;
          if (data && data.status === "ok" && data.video_link && !data.video_link.includes("220884")) {
            try {
              const m3u8Res = yield axios.get(data.video_link, {
                signal,
                headers: { Referer: data.referer || `${baseUrl}/` },
                timeout: 4e3
              });
              const m3u8Text = typeof m3u8Res.data === "string" ? m3u8Res.data : "";
              if (!m3u8Text.includes("220884")) {
                const variantLines = m3u8Text.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("http") && !l.includes("220884"));
                for (const vUrl of variantLines) {
                  let q = "1080";
                  if (vUrl.includes("720p")) q = "720";
                  else if (vUrl.includes("480p")) q = "480";
                  else if (vUrl.includes("360p")) q = "360";
                  streamLinks.push({
                    server: `${serverName} HLS (${q}p)`,
                    link: vUrl,
                    type: "m3u8",
                    quality: q,
                    headers: {
                      Referer: `${baseUrl}/`,
                      Origin: baseUrl
                    }
                  });
                }
              }
            } catch (e) {
            }
          }
        } catch (err) {
          console.error(`NewTV player API failed for ${id}:`, err);
        }
      }
      const cleanStreamLinks = streamLinks.filter(
        (s) => !s.link.includes("220884") && !s.server.includes("220884")
      );
      if (cleanStreamLinks.length === 0) {
        cleanStreamLinks.push({
          server: `${serverName} HLS`,
          link: `${baseUrl}/mobile/hls/${id}.m3u8`,
          type: "m3u8",
          quality: "1080",
          headers: getNetMirrorMobileHeaders(baseUrl, cookies)
        });
      }
      cleanStreamLinks.sort((a, b) => {
        if (isDownload) {
          if (a.type === "mp4" && b.type !== "mp4") return -1;
          if (b.type === "mp4" && a.type !== "mp4") return 1;
        }
        const qA = parseInt(a.quality || "0", 10);
        const qB = parseInt(b.quality || "0", 10);
        return qB - qA;
      });
      return cleanStreamLinks;
    });
  }
});

// providers/disneyMirror/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/disneyMirror/posts.ts"() {
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
          prefix: "hs",
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
          prefix: "hs",
          providerValue,
          signal,
          providerContext
        });
      });
    };
  }
});

// providers/disneyMirror/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/disneyMirror/meta.ts"() {
    "use strict";
    init_netMirrorCommon();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        return netMirrorGetMeta({
          link,
          prefix: "hs",
          providerContext
        });
      });
    };
  }
});

// providers/disneyMirror/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/disneyMirror/stream.ts"() {
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
        prefix: "hs",
        signal,
        providerContext,
        isDownload
      });
    });
  }
});

// providers/disneyMirror/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/disneyMirror/episodes.ts"() {
    "use strict";
    init_netMirrorCommon();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url: link,
        providerContext
      }) {
        return netMirrorGetEpisodes({
          seasonId: link,
          prefix: "hs",
          providerContext
        });
      });
    };
  }
});

// providers/disneyMirror/disneyMirror.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
