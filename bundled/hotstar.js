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

// providers/netMirrorCommon.ts
var MOBILE_UA, FALLBACK_BASES, TIMEOUT, TOKEN_TTL, TRAY_TTL, getNetMirrorBaseUrl, getNetMirrorMobileHeaders, prefixToOtt, resolveUrl, usableSessionToken, unlockLocks, readSetCookies, extractToken, unlockNetMirrorMobileSession, unlockSharedSession, getNetMirrorCookie, invalidateNetMirrorSession, getPosterUrl, getEpisodePosterUrl, engineCookies, pathFor, netMirrorSearch, homeTrayCache, titleCache, parseHtmlTrays, getCachedHomeTrays, netMirrorGetPosts, netMirrorGetMeta, netMirrorGetEpisodes, qualityFromResolution, qualityFromUrl, subtitlesFromTracks, looksAbusive, fetchPlaylist, fetchMaster, netMirrorGetStream;
var init_netMirrorCommon = __esm({
  "providers/netMirrorCommon.ts"() {
    "use strict";
    MOBILE_UA = "Mozilla/5.0 (Linux; Android 13; Pixel 5 Build/TQ3A.230901.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/144.0.7559.132 Safari/537.36 /OS.Gatu v3.0";
    FALLBACK_BASES = ["https://net52.cc", "https://net22.cc"];
    TIMEOUT = 8e3;
    TOKEN_TTL = 12 * 60 * 60 * 1e3;
    TRAY_TTL = 15 * 60 * 1e3;
    getNetMirrorBaseUrl = (providerContext) => __async(null, null, function* () {
      var _a;
      try {
        const override = yield (_a = providerContext == null ? void 0 : providerContext.kvStore) == null ? void 0 : _a.get("baseUrlOverride");
        if (override && override.trim().startsWith("http")) {
          return override.trim().replace(/\/+$/, "");
        }
      } catch (e) {
      }
      return FALLBACK_BASES[0];
    });
    getNetMirrorMobileHeaders = (baseUrl, cookieStr) => {
      const headers = {
        "User-Agent": MOBILE_UA,
        Referer: `${baseUrl}/mobile/home?app=1`,
        Origin: baseUrl,
        Accept: "application/json, text/plain, */*",
        "X-Requested-With": "com.netmirror.app"
      };
      if (cookieStr) headers["Cookie"] = cookieStr;
      return headers;
    };
    prefixToOtt = (prefix) => prefix === "pv" ? "pv" : prefix === "hs" ? "hs" : "nf";
    resolveUrl = (value, base) => {
      var _a;
      if (!value) return "";
      if (/^https?:\/\//i.test(value)) return value;
      if (value.startsWith("//")) return `https:${value}`;
      try {
        if (value.startsWith("/")) {
          const origin = ((_a = base.match(/^https?:\/\/[^/]+/)) == null ? void 0 : _a[0]) || base;
          return origin + value;
        }
        const dir = base.replace(/[?#].*$/, "").replace(/\/[^/]*$/, "/");
        return dir + value.replace(/^\.\//, "");
      } catch (e) {
        return value;
      }
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
    unlockLocks = /* @__PURE__ */ new Map();
    readSetCookies = (res) => {
      var _a, _b;
      const raw = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a["set-cookie"]) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b["x-set-cookie"]) || [];
      return (Array.isArray(raw) ? raw : [raw]).filter(Boolean).map((c) => String(c));
    };
    extractToken = (setCookies) => {
      for (const cookie of setCookies) {
        const match = cookie.match(/t_hash_t=([^;]+)/);
        const token = match ? usableSessionToken(match[1]) : void 0;
        if (token) return token;
      }
      return void 0;
    };
    unlockNetMirrorMobileSession = (providerContext, baseUrl, ottCookie = "nf") => __async(null, null, function* () {
      var _a, _b;
      const { axios, kvStore } = providerContext;
      const scopeCookie = `hd=on; ott=${ottCookie}`;
      try {
        const homeRes = yield axios.get(`${baseUrl}/mobile/home?app=1`, {
          headers: {
            "User-Agent": MOBILE_UA,
            "X-Requested-With": "com.netmirror.app",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            Cookie: scopeCookie
          },
          timeout: TIMEOUT
        });
        const cookiesArr = readSetCookies(homeRes);
        const initialCookie = cookiesArr.map((c) => c.split(";")[0]).filter(Boolean).join("; ");
        const alreadyValid = extractToken(cookiesArr);
        if (alreadyValid) return alreadyValid;
        const html = typeof homeRes.data === "string" ? homeRes.data : "";
        const addhash = (_a = html.match(/data-addhash=["']([^"']+)["']/)) == null ? void 0 : _a[1];
        if (!addhash) return void 0;
        const hostDomain = baseUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        yield axios.get(`https://userver.${hostDomain}/?hee5=${encodeURIComponent(addhash)}&a=y&t=${Math.random()}`, {
          headers: {
            "User-Agent": MOBILE_UA,
            Referer: `${baseUrl}/mobile/home?app=1`,
            Cookie: [initialCookie, scopeCookie].filter(Boolean).join("; "),
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          },
          maxRedirects: 0,
          validateStatus: () => true,
          timeout: 8e3
        }).catch(() => {
        });
        const pollCookie = [
          "ext_name=ojplmecpdpgccookcobabopnaifgidhf",
          `addhash=${encodeURIComponent(addhash)}`,
          scopeCookie,
          initialCookie
        ].filter(Boolean).join("; ");
        const start = Date.now();
        while (Date.now() - start < 48e3) {
          yield new Promise((r) => setTimeout(r, 2500));
          try {
            const vRes = yield axios.post(
              `${baseUrl}/mobile/verify2.php`,
              `verify=${encodeURIComponent(addhash)}`,
              {
                headers: {
                  "User-Agent": MOBILE_UA,
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                  Referer: `${baseUrl}/mobile/home`,
                  Origin: baseUrl,
                  Cookie: pollCookie
                },
                validateStatus: () => true,
                timeout: 8e3
              }
            );
            const token = extractToken(readSetCookies(vRes));
            if (token) {
              if (kvStore) {
                yield kvStore.set(`t_hash_t_${ottCookie}`, { token, ts: Date.now() });
              }
              return token;
            }
            if (((_b = vRes.data) == null ? void 0 : _b.statusup) === "All Done") {
              const reloadRes = yield axios.get(`${baseUrl}/mobile/home?app=1`, {
                headers: {
                  "User-Agent": MOBILE_UA,
                  "X-Requested-With": "com.netmirror.app",
                  Cookie: pollCookie
                },
                timeout: TIMEOUT
              }).catch(() => null);
              const reloadToken = reloadRes ? extractToken(readSetCookies(reloadRes)) : void 0;
              if (reloadToken && kvStore) {
                yield kvStore.set(`t_hash_t_${ottCookie}`, { token: reloadToken, ts: Date.now() });
              }
              return reloadToken;
            }
          } catch (e) {
          }
        }
      } catch (err) {
        console.log("Mobile ad verification notice:", (err == null ? void 0 : err.message) || err);
      }
      return void 0;
    });
    unlockSharedSession = (providerContext, baseUrl, ottCookie) => {
      const key = `${baseUrl}:${ottCookie}`;
      let promise = unlockLocks.get(key);
      if (!promise) {
        promise = unlockNetMirrorMobileSession(providerContext, baseUrl, ottCookie).finally(() => {
          unlockLocks.delete(key);
        });
        unlockLocks.set(key, promise);
      }
      return promise;
    };
    getNetMirrorCookie = (providerContext, ott, unlockIfMissing = true, options) => __async(null, null, function* () {
      const { kvStore } = providerContext;
      const baseUrl = yield getNetMirrorBaseUrl(providerContext);
      const ottCookie = (options == null ? void 0 : options.ottCookie) || prefixToOtt(ott);
      let token;
      try {
        const manual = usableSessionToken(yield kvStore == null ? void 0 : kvStore.get("t_hash_t"));
        const cached = yield kvStore == null ? void 0 : kvStore.get(`t_hash_t_${ottCookie}`);
        if (manual) {
          token = manual;
        } else if (cached && Date.now() - cached.ts < TOKEN_TTL) {
          token = usableSessionToken(cached.token);
        }
      } catch (e) {
      }
      if (!token && unlockIfMissing) {
        token = yield unlockSharedSession(providerContext, baseUrl, ottCookie);
      }
      const parts = [
        token ? `t_hash_t=${token}` : "",
        "hd=on",
        `ott=${ottCookie}`,
        (options == null ? void 0 : options.studioCookie) ? `studio=${options.studioCookie}` : ""
      ].filter(Boolean);
      return parts.join("; ");
    });
    invalidateNetMirrorSession = (providerContext, ottCookie) => __async(null, null, function* () {
      try {
        yield providerContext.kvStore.delete(`t_hash_t_${ottCookie}`);
      } catch (e) {
      }
    });
    getPosterUrl = (id, prefix) => {
      if (prefix === "pv") {
        return id.length > 10 ? `https://imgcdn.kim/pv/v/350/${id}.jpg` : `https://imgcdn.kim/pv/v/${id}.jpg`;
      }
      if (prefix === "hs") return `https://imgcdn.kim/hs/v/166/${id}.jpg`;
      return `https://imgcdn.kim/poster/v/${id}.jpg`;
    };
    getEpisodePosterUrl = (id, prefix) => {
      if (prefix === "pv") return `https://imgcdn.kim/pvepimg/${id}.jpg`;
      if (prefix === "hs") return `https://imgcdn.kim/hsepimg/${id}.jpg`;
      return `https://imgcdn.kim/epimg/150/${id}.jpg`;
    };
    engineCookies = (args, unlockIfMissing = true) => getNetMirrorCookie(args.providerContext, args.prefix, unlockIfMissing, args.studio);
    pathFor = (prefix) => prefix ? `${prefix}/` : "";
    netMirrorSearch = (_0) => __async(null, [_0], function* ({
      searchQuery,
      page,
      prefix,
      signal,
      providerContext,
      studio
    }) {
      var _a;
      try {
        if (page > 1) return [];
        const { axios } = providerContext;
        const baseUrl = yield getNetMirrorBaseUrl(providerContext);
        const query = searchQuery == null ? void 0 : searchQuery.trim();
        if (!query) return [];
        const cookies = yield engineCookies({ providerContext, prefix, studio });
        const t = Math.round(Date.now() / 1e3);
        const url = `${baseUrl}/mobile/${pathFor(prefix)}search.php?s=${encodeURIComponent(query)}&t=${t}`;
        const res = yield axios.get(url, {
          signal,
          headers: getNetMirrorMobileHeaders(baseUrl, cookies),
          timeout: TIMEOUT
        });
        const results = ((_a = res.data) == null ? void 0 : _a.searchResult) || [];
        return results.filter((item) => item == null ? void 0 : item.id).map((item) => {
          const id = String(item.id);
          const title = (item == null ? void 0 : item.t) || `ID: ${id}`;
          return {
            title,
            link: `${id}|${prefix}|${encodeURIComponent(title)}`,
            image: getPosterUrl(id, prefix),
            tag: (item == null ? void 0 : item.y) || ((item == null ? void 0 : item.r) && item.r !== "Series" ? item.r : void 0),
            aspectRatio: prefix === "pv" ? 16 / 9 : void 0
          };
        });
      } catch (err) {
        console.error(`netMirrorSearch error [${prefix}]:`, err);
        return [];
      }
    });
    homeTrayCache = /* @__PURE__ */ new Map();
    titleCache = /* @__PURE__ */ new Map();
    parseHtmlTrays = (html, cheerio) => {
      var _a, _b, _c, _d, _e, _f;
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
              if (id) items.push({ id, image: img || "", alt });
            });
            if (title && items.length > 0) trays.push({ title, items });
          });
          $("#top10, .top10").each((_i, el) => {
            const title = $(el).find("span").first().text().trim() || "Top 10 Today";
            const items = [];
            $(el).find(".top10-post, article").each((_j, art) => {
              const a = $(art).find("a[data-post]").first();
              const id = a.attr("data-post") || $(art).attr("data-post");
              const img = $(art).find("img").attr("data-src") || $(art).find("img").attr("src");
              if (id) items.push({ id, image: img || "", alt: "" });
            });
            if (title && items.length > 0 && !trays.some((t) => t.title.toLowerCase() === title.toLowerCase())) {
              trays.push({ title, items });
            }
          });
          if (trays.length > 0) return trays;
        } catch (e) {
        }
      }
      const sections = html.split(/class="[^"]*tray-container[^"]*"/);
      for (let i = 1; i < sections.length; i++) {
        const sec = sections[i];
        const title = ((_b = (_a = sec.match(/<h2[^>]*>([^<]+)<\/h2>/)) == null ? void 0 : _a[1]) == null ? void 0 : _b.trim()) || "";
        const items = [];
        for (const art of sec.match(/<article[\s\S]*?<\/article>/g) || []) {
          const id = (_c = art.match(/data-post="([^"]+)"/)) == null ? void 0 : _c[1];
          const img = ((_d = art.match(/data-src="([^"]+)"/)) == null ? void 0 : _d[1]) || ((_e = art.match(/src="([^"]+)"/)) == null ? void 0 : _e[1]) || "";
          const alt = ((_f = art.match(/alt="([^"]*)"/)) == null ? void 0 : _f[1]) || "";
          if (id) items.push({ id, image: img, alt });
        }
        if (title && items.length > 0 && !trays.some((t) => t.title.toLowerCase() === title.toLowerCase())) {
          trays.push({ title, items });
        }
      }
      return trays;
    };
    getCachedHomeTrays = (providerContext, prefix, studio) => __async(null, null, function* () {
      const ottCookie = (studio == null ? void 0 : studio.ottCookie) || prefixToOtt(prefix);
      const cacheKey = `${prefix}:${ottCookie}:${(studio == null ? void 0 : studio.studioCookie) || ""}`;
      const cached = homeTrayCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < TRAY_TTL) return cached.trays;
      const { axios, cheerio } = providerContext;
      const baseUrl = yield getNetMirrorBaseUrl(providerContext);
      const url = `${baseUrl}/mobile/home?app=1`;
      const hasToken = (cookieStr) => /t_hash_t=[^;]+/.test(cookieStr);
      const fetchTrays = (unlockIfMissing) => __async(null, null, function* () {
        const cookies = yield getNetMirrorCookie(providerContext, prefix, unlockIfMissing, studio);
        const res = yield axios.get(url, {
          headers: __spreadProps(__spreadValues({}, getNetMirrorMobileHeaders(baseUrl, cookies)), {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-IN,en-US;q=0.9,en;q=0.8",
            "X-Requested-With": "XMLHttpRequest",
            Referer: `${baseUrl}/mobile/home?app=1`
          }),
          timeout: 1e4
        });
        const html = typeof res.data === "string" ? res.data : "";
        return { html, trays: parseHtmlTrays(html, cheerio), cookies };
      });
      try {
        let { html, trays, cookies } = yield fetchTrays(false);
        if (!hasToken(cookies) || trays.length === 0 && html.includes("data-addhash")) {
          yield invalidateNetMirrorSession(providerContext, ottCookie);
          ({ trays, cookies } = yield fetchTrays(true));
        }
        if (trays.length > 0 && hasToken(cookies)) {
          homeTrayCache.set(cacheKey, { trays, timestamp: Date.now() });
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
      providerContext,
      studio
    }) {
      var _a;
      try {
        if (page > 1) return [];
        const { axios } = providerContext;
        const baseUrl = yield getNetMirrorBaseUrl(providerContext);
        const prefixPath = pathFor(prefix);
        const t = Math.round(Date.now() / 1e3);
        const cleanFilter = (filter || "").trim().toLowerCase();
        const trays = yield getCachedHomeTrays(providerContext, prefix, studio);
        let matchedTray = trays.find((tr) => tr.title.toLowerCase() === cleanFilter) || trays.find((tr) => tr.title.toLowerCase().includes(cleanFilter)) || trays[0];
        if (matchedTray && matchedTray.items.length > 0) {
          const cookies2 = yield engineCookies({ providerContext, prefix, studio });
          const itemsToFetch = matchedTray.items.filter(
            (it) => {
              var _a2;
              return !titleCache.has(it.id) && !((_a2 = it.alt) == null ? void 0 : _a2.trim());
            }
          );
          yield Promise.all(
            itemsToFetch.map((it) => __async(null, null, function* () {
              var _a2;
              try {
                const postRes = yield axios.get(
                  `${baseUrl}/mobile/${prefixPath}post.php?id=${it.id}&t=${t}`,
                  { headers: getNetMirrorMobileHeaders(baseUrl, cookies2), timeout: 6e3 }
                );
                if ((_a2 = postRes.data) == null ? void 0 : _a2.title) titleCache.set(it.id, postRes.data.title);
              } catch (e) {
              }
            }))
          );
          return matchedTray.items.map((it) => {
            var _a2;
            const title = titleCache.get(it.id) || ((_a2 = it.alt) == null ? void 0 : _a2.trim()) || `Item ${it.id}`;
            return {
              title,
              link: `${it.id}|${prefix}|${encodeURIComponent(title)}`,
              image: it.image || getPosterUrl(it.id, prefix),
              aspectRatio: prefix === "pv" ? 16 / 9 : void 0
            };
          });
        }
        const cookies = yield engineCookies({ providerContext, prefix, studio });
        const res = yield axios.get(
          `${baseUrl}/mobile/${prefixPath}search.php?s=${encodeURIComponent(filter)}&t=${t}`,
          { signal, headers: getNetMirrorMobileHeaders(baseUrl, cookies), timeout: TIMEOUT }
        );
        const results = ((_a = res.data) == null ? void 0 : _a.searchResult) || [];
        return results.filter((item) => item == null ? void 0 : item.id).map((item) => {
          const id = String(item.id);
          const title = (item == null ? void 0 : item.t) || `ID: ${id}`;
          titleCache.set(id, title);
          return {
            title,
            link: `${id}|${prefix}|${encodeURIComponent(title)}`,
            image: getPosterUrl(id, prefix),
            tag: (item == null ? void 0 : item.y) || ((item == null ? void 0 : item.r) && item.r !== "Series" ? item.r : void 0),
            aspectRatio: prefix === "pv" ? 16 / 9 : void 0
          };
        });
      } catch (err) {
        console.error(`netMirrorGetPosts error [${prefix}]:`, err);
        return [];
      }
    });
    netMirrorGetMeta = (_0) => __async(null, [_0], function* ({
      link,
      prefix: defaultPrefix,
      providerContext,
      studio
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
        id = link.split("id=")[1].split("&")[0];
        if (link.includes("title=")) {
          titleFromLink = decodeURIComponent(link.split("title=")[1].split("&")[0]);
        }
      } else {
        id = link;
      }
      const cookies = yield engineCookies({ providerContext, prefix, studio });
      const prefixPath = pathFor(prefix);
      const t = Math.round(Date.now() / 1e3);
      let title = titleFromLink;
      let synopsis = "";
      const image = getPosterUrl(id, prefix);
      const poster = prefix === "pv" ? `https://imgcdn.kim/pv/v/350/${id}.jpg` : void 0;
      let cast = [];
      const tags = [];
      let imdbId = "";
      let type = "movie";
      const linkList = [];
      try {
        const res = yield axios.get(
          `${baseUrl}/mobile/${prefixPath}post.php?id=${id}&t=${t}`,
          { headers: getNetMirrorMobileHeaders(baseUrl, cookies), timeout: TIMEOUT }
        );
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
          if (typeof data.match === "string" && data.match.includes("IMDb")) tags.push(data.match);
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
        image,
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
      providerContext,
      studio
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
        if (parts[4]) seasonNumber = parseInt(parts[4], 10) || 1;
      }
      const cookies = yield engineCookies({ providerContext, prefix, studio });
      const prefixPath = pathFor(prefix);
      const episodeList = [];
      let page = 1;
      let hasMorePages = true;
      while (hasMorePages && page <= 20) {
        try {
          const res = yield axios.get(
            `${baseUrl}/mobile/${prefixPath}episodes.php?s=${sid}&series=${seriesId}&t=${t}&page=${page}`,
            { signal, headers: getNetMirrorMobileHeaders(baseUrl, cookies), timeout: TIMEOUT }
          );
          const data = res.data;
          const episodes = Array.isArray(data == null ? void 0 : data.episodes) ? data.episodes : [];
          if (episodes.length === 0) break;
          episodes.forEach((episode) => {
            if (!(episode == null ? void 0 : episode.id)) return;
            const epNum = String((episode == null ? void 0 : episode.ep) || "").replace(/[^0-9]/g, "").trim() || `${episodeList.length + 1}`;
            const sNum = String((episode == null ? void 0 : episode.s) || "").replace(/[^0-9]/g, "").trim() || `${seasonNumber}`;
            const epTitle = (episode == null ? void 0 : episode.t) ? `Episode ${epNum}: ${episode.t}` : `Episode ${epNum}`;
            episodeList.push({
              title: epTitle,
              link: `${episode.id}|${prefix}|${encodeURIComponent(seriesTitle)}|${sNum}|${epNum}`,
              description: (episode == null ? void 0 : episode.ep_desc) || void 0,
              image: getEpisodePosterUrl(episode.id, prefix)
            });
          });
          if ((data == null ? void 0 : data.nextPageShow) && data.nextPageShow > 0) page++;
          else hasMorePages = false;
        } catch (err) {
          console.error(`netMirrorGetEpisodes error [${prefix}]:`, err);
          break;
        }
      }
      if (episodeList.length === 0 && sid) {
        episodeList.push({
          title: "Episode 1",
          link: `${sid}|${prefix}|${encodeURIComponent(seriesTitle)}|${seasonNumber}|1`,
          image: getEpisodePosterUrl(sid, prefix)
        });
      }
      return episodeList;
    });
    qualityFromResolution = (line) => {
      const res = line.match(/RESOLUTION=(\d+)x(\d+)/);
      if (!res) return void 0;
      const height = parseInt(res[2], 10);
      if (height >= 2e3) return "2160";
      if (height >= 1e3) return "1080";
      if (height >= 700) return "720";
      if (height >= 450) return "480";
      return "360";
    };
    qualityFromUrl = (url) => {
      if (/2160p|4k/i.test(url)) return "2160";
      if (/720p/.test(url)) return "720";
      if (/480p/.test(url)) return "480";
      if (/360p/.test(url)) return "360";
      return "1080";
    };
    subtitlesFromTracks = (tracks) => {
      const subtitles = [];
      for (const track of tracks || []) {
        let uri = (track == null ? void 0 : track.file) || "";
        if (!uri) continue;
        if (uri.startsWith("//")) uri = `https:${uri}`;
        const isVtt = /\.vtt$/i.test(uri);
        subtitles.push({
          title: (track == null ? void 0 : track.label) || "Subtitle",
          language: (track == null ? void 0 : track.label) || "Unknown",
          type: isVtt ? "text/vtt" : "application/x-subrip",
          uri
        });
      }
      return subtitles;
    };
    looksAbusive = (text) => text.includes("220884") || text.includes("Only Valid Users Allowed");
    fetchPlaylist = (axios, baseUrl, prefix, id, title, cookies, signal) => __async(null, null, function* () {
      const tm = Math.round(Date.now() / 1e3);
      const urls = [
        `${baseUrl}/mobile/${pathFor(prefix)}playlist.php?id=${id}&t=${encodeURIComponent(title || "Title")}&tm=${tm}`,
        `${baseUrl}/mobile/playlist.php?id=${id}&t=${encodeURIComponent(title || "Title")}&tm=${tm}`
      ];
      for (const url of urls) {
        try {
          const res = yield axios.get(url, {
            signal,
            headers: getNetMirrorMobileHeaders(baseUrl, cookies),
            timeout: TIMEOUT
          });
          const data = Array.isArray(res.data) ? res.data[0] : res.data;
          if (data && Array.isArray(data.sources) && data.sources.length > 0) return data;
        } catch (e) {
        }
      }
      return null;
    });
    fetchMaster = (axios, url, headers, signal) => __async(null, null, function* () {
      try {
        const res = yield axios.get(url, { signal, headers, timeout: TIMEOUT });
        return typeof res.data === "string" ? res.data : "";
      } catch (e) {
        return "";
      }
    });
    netMirrorGetStream = (_0) => __async(null, [_0], function* ({
      id: rawId,
      type,
      prefix: defaultPrefix,
      signal,
      providerContext,
      studio
    }) {
      const { axios } = providerContext;
      const baseUrl = yield getNetMirrorBaseUrl(providerContext);
      let id = rawId;
      let prefix = defaultPrefix;
      let title = "";
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
      }
      const ottCookie = (studio == null ? void 0 : studio.ottCookie) || prefixToOtt(prefix);
      const serverName = prefix === "pv" ? "Prime Video" : prefix === "hs" ? "Disney+/Hotstar" : "Netflix";
      const streamLinks = [];
      if (!title) {
        const cachedTitle = titleCache.get(id);
        if (cachedTitle) title = cachedTitle;
      }
      const buildStreams = (cookies) => __async(null, null, function* () {
        var _a, _b;
        const playlist = yield fetchPlaylist(axios, baseUrl, prefix, id, title, cookies, signal);
        if (!playlist) return [];
        const subtitles = subtitlesFromTracks(playlist.tracks);
        const headers = {
          "User-Agent": MOBILE_UA,
          Referer: `${baseUrl}/`,
          Origin: baseUrl,
          Cookie: cookies
        };
        const streams = [];
        const seen = /* @__PURE__ */ new Set();
        const push = (link, quality, server) => {
          if (!link || looksAbusive(link) || seen.has(link)) return;
          seen.add(link);
          streams.push({
            server,
            link,
            type: "m3u8",
            quality,
            subtitles: subtitles.length > 0 ? subtitles : void 0,
            headers
          });
        };
        for (const source of playlist.sources) {
          const rawFile = source == null ? void 0 : source.file;
          if (!rawFile) continue;
          const sourceUrl = resolveUrl(rawFile, baseUrl);
          if (looksAbusive(sourceUrl)) continue;
          const masterText = yield fetchMaster(axios, sourceUrl, headers, signal);
          if (!masterText || looksAbusive(masterText)) continue;
          const autoQuality = /q=(\d{3,4})p/.test(rawFile) ? (_a = rawFile.match(/q=(\d{3,4})p/)) == null ? void 0 : _a[1] : "1080";
          push(sourceUrl, autoQuality, `${serverName} Auto`);
          const lines = masterText.split(/\r?\n/);
          for (let i = 0; i < lines.length; i++) {
            if (!lines[i].startsWith("#EXT-X-STREAM-INF")) continue;
            const next = (_b = lines[i + 1]) == null ? void 0 : _b.trim();
            if (!next || next.startsWith("#")) continue;
            const variantUrl = resolveUrl(next, sourceUrl);
            push(
              variantUrl,
              qualityFromResolution(lines[i]) || qualityFromUrl(variantUrl),
              `${serverName} HLS`
            );
          }
        }
        return streams;
      });
      try {
        let cookies = yield getNetMirrorCookie(providerContext, prefix, true, studio);
        let streams = yield buildStreams(cookies);
        if (streams.length === 0) {
          yield invalidateNetMirrorSession(providerContext, ottCookie);
          cookies = yield getNetMirrorCookie(providerContext, prefix, true, studio);
          streams = yield buildStreams(cookies);
        }
        streamLinks.push(...streams);
      } catch (err) {
        console.log(`NetMirror playlist flow failed for ${id}:`, err);
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

// providers/cncStudios.ts
var STUDIOS, studioOf, studioOptions, clearSessionsIfRequested, makeCatalog, makeGetPosts, makeGetSearchPosts, makeGetMeta, makeGetEpisodes, makeGetStream;
var init_cncStudios = __esm({
  "providers/cncStudios.ts"() {
    "use strict";
    init_netMirrorCommon();
    STUDIOS = {
      netflix: { key: "netflix", label: "Netflix", prefix: "", ott: "nf", cornerTag: "NF" },
      primeVideo: { key: "primeVideo", label: "Prime Video", prefix: "pv", ott: "pv", cornerTag: "PV" },
      hotstar: { key: "hotstar", label: "Hotstar", prefix: "hs", ott: "hs", cornerTag: "HS" },
      disneyPlus: { key: "disneyPlus", label: "Disney+", prefix: "hs", ott: "dp", studioCookie: "disney", cornerTag: "D+" },
      pixar: { key: "pixar", label: "Pixar", prefix: "hs", ott: "dp", studioCookie: "pixar", cornerTag: "PX" },
      starWars: { key: "starWars", label: "Star Wars", prefix: "hs", ott: "dp", studioCookie: "starwars", cornerTag: "SW" },
      marvel: { key: "marvel", label: "Marvel", prefix: "hs", ott: "dp", studioCookie: "marvel", cornerTag: "MV" }
    };
    studioOf = (key) => STUDIOS[key];
    studioOptions = (studio) => ({
      ottCookie: studio.ott,
      studioCookie: studio.studioCookie
    });
    clearSessionsIfRequested = (providerContext) => __async(null, null, function* () {
      try {
        const { kvStore } = providerContext;
        if (!(yield kvStore.get("clearCache"))) return;
        for (const key of yield kvStore.keys()) {
          if (key.startsWith("t_hash_t_")) yield kvStore.delete(key);
        }
        yield kvStore.set("clearCache", false);
      } catch (e) {
      }
    });
    makeCatalog = (key) => (..._0) => __async(null, [..._0], function* ({
      providerContext
    } = {}) {
      if (!providerContext) return [];
      yield clearSessionsIfRequested(providerContext);
      const studio = studioOf(key);
      const trays = yield getCachedHomeTrays(
        providerContext,
        studio.prefix,
        studioOptions(studio)
      );
      const seen = /* @__PURE__ */ new Set();
      const catalog2 = [];
      for (const tray of trays) {
        const title = tray.title.trim();
        const dedupeKey = title.toLowerCase();
        if (!title || seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);
        catalog2.push({ title, filter: title });
      }
      return catalog2;
    });
    makeGetPosts = (key) => function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        signal,
        providerContext
      }) {
        const studio = studioOf(key);
        return netMirrorGetPosts({
          filter: (filter || "").trim(),
          page,
          prefix: studio.prefix,
          signal,
          providerContext,
          studio: studioOptions(studio)
        });
      });
    };
    makeGetSearchPosts = (key) => function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        signal,
        providerContext
      }) {
        const studio = studioOf(key);
        return netMirrorSearch({
          searchQuery,
          page,
          prefix: studio.prefix,
          signal,
          providerContext,
          studio: studioOptions(studio)
        });
      });
    };
    makeGetMeta = (key) => function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        const studio = studioOf(key);
        return netMirrorGetMeta({
          link,
          prefix: studio.prefix,
          providerContext,
          studio: studioOptions(studio)
        });
      });
    };
    makeGetEpisodes = (key) => function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        const studio = studioOf(key);
        return netMirrorGetEpisodes({
          seasonId: url,
          prefix: studio.prefix,
          providerContext,
          studio: studioOptions(studio)
        });
      });
    };
    makeGetStream = (key) => (_0) => __async(null, [_0], function* ({
      link,
      type,
      signal,
      providerContext,
      isDownload
    }) {
      const studio = studioOf(key);
      yield clearSessionsIfRequested(providerContext);
      const streams = yield netMirrorGetStream({
        id: link,
        type,
        prefix: studio.prefix,
        signal,
        providerContext,
        isDownload,
        studio: studioOptions(studio)
      });
      return streams.map((stream) => __spreadProps(__spreadValues({}, stream), {
        server: stream.server.replace(/^(Netflix|Prime Video|Disney\+\/Hotstar)\s*/, `${studio.label} `),
        tag: studio.cornerTag
      }));
    });
  }
});

// providers/hotstar/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/hotstar/catalog.ts"() {
    "use strict";
    init_cncStudios();
    catalog = makeCatalog("hotstar");
    genres = [];
  }
});

// providers/hotstar/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/hotstar/posts.ts"() {
    "use strict";
    init_cncStudios();
    getPosts = makeGetPosts("hotstar");
    getSearchPosts = makeGetSearchPosts("hotstar");
  }
});

// providers/hotstar/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
var getMeta;
var init_meta = __esm({
  "providers/hotstar/meta.ts"() {
    "use strict";
    init_cncStudios();
    getMeta = makeGetMeta("hotstar");
  }
});

// providers/hotstar/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
var getStream;
var init_stream = __esm({
  "providers/hotstar/stream.ts"() {
    "use strict";
    init_cncStudios();
    getStream = makeGetStream("hotstar");
  }
});

// providers/hotstar/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/hotstar/episodes.ts"() {
    "use strict";
    init_cncStudios();
    getEpisodes = makeGetEpisodes("hotstar");
  }
});

// providers/hotstar/hotstar.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
