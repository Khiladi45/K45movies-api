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

// providers/kartoons/headers.ts
function applyCredentialReset(context) {
  return __async(this, null, function* () {
    var _a;
    if ((yield (_a = context.kvStore) == null ? void 0 : _a.get("kartoons_clear_credentials")) !== true) return;
    for (const key of [SESSION_KEY, "kartoons_auth_session", "kartoons_challenge_token"]) {
      yield context.kvStore.delete(key);
    }
    yield context.kvStore.set("kartoons_clear_credentials", false);
    pendingSessions.delete(context);
  });
}
function deviceLoginScript(code, intervalMs) {
  return `
(function () {
  if (window.__vegaKartoonsDevice) return;
  window.__vegaKartoonsDevice = true;
  var done = false;
  async function poll() {
    try {
      var res = await window.fetch(${JSON.stringify(API_BASE + "/device/status?code=" + encodeURIComponent(code))}, {headers:{Accept:"application/json"}});
      if (res.ok) {
        var body = await res.json();
        var data = body.data || body;
        if (data.status === "linked" && typeof data.token === "string" && data.token) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({__waf:true,data:JSON.stringify({
              kartoonsDevice:true,code:${JSON.stringify(code)},token:data.token
            })}));
            done = true;
          }
        }
        if (data.status === "expired") return;
      }
    } catch (e) {}
    if (!done) setTimeout(poll, ${intervalMs});
  }
  poll();
})(); true;`;
}
function getSession(context, signal, force = false) {
  return __async(this, null, function* () {
    yield applyCredentialReset(context);
    const pending = pendingSessions.get(context);
    if (pending) return pending;
    const request = (() => __async(null, null, function* () {
      var _a, _b, _c, _d, _e, _f;
      if (!force) {
        let saved = yield (_a = context.kvStore) == null ? void 0 : _a.get(SESSION_KEY);
        try {
          if (typeof saved === "string") saved = JSON.parse(saved);
        } catch (e) {
          saved = null;
        }
        if (typeof (saved == null ? void 0 : saved.token) === "string" && saved.token.trim()) {
          return { token: saved.token.trim(), userAgent: saved.userAgent || commonHeaders["user-agent"] };
        }
      }
      if (signal == null ? void 0 : signal.aborted) throw new Error("Kartoons account linking cancelled");
      if (!context.openWebView) throw new Error("Link your Kartoons account to use this provider");
      let response;
      try {
        response = yield context.axios.post(`${API_BASE}/device/code`, {}, {
          headers: commonHeaders,
          signal,
          timeout: 15e3,
          validateStatus: () => true
        });
      } catch (e) {
        throw new Error("Could not generate a Kartoons login code. Please try again.");
      }
      const data = ((_b = response.data) == null ? void 0 : _b.data) || response.data;
      if (response.status !== 200 || (data == null ? void 0 : data.success) === false || !/^[A-Z0-9]{6}$/i.test((data == null ? void 0 : data.code) || "")) {
        throw new Error(`Could not generate a Kartoons login code (HTTP ${response.status})`);
      }
      const code = data.code;
      const expiresMs = Math.max(1e3, Math.min(6e5, (Number(data.expires_in) || 600) * 1e3));
      const expiresAt = Date.now() + expiresMs;
      const intervalMs = Math.max(5e3, Math.min(3e4, (Number(data.poll_interval) || 5) * 1e3));
      const redirect = `/cloudstream/link?code=${encodeURIComponent(code)}`;
      const result = yield context.openWebView(`${SITE_BASE}/login?redirect=${encodeURIComponent(redirect)}`, {
        title: "Link your Kartoons account",
        description: `Sign in and approve code ${code} to link Vega to your Kartoons account.`,
        force: true,
        timeoutMs: Math.min(3e5, expiresMs),
        injectedJavaScript: deviceLoginScript(code, intervalMs)
      });
      let payload = result == null ? void 0 : result.data;
      try {
        for (let i = 0; i < 3; i++) {
          if (typeof payload === "string") payload = JSON.parse(payload);
          if (payload == null ? void 0 : payload.kartoonsDevice) break;
          payload = payload == null ? void 0 : payload.data;
        }
      } catch (e) {
        payload = null;
      }
      if (Date.now() >= expiresAt) throw new Error("Kartoons login code expired. Please link your account again.");
      if ((payload == null ? void 0 : payload.kartoonsDevice) !== true || !/^[A-Z0-9]{6}$/i.test(payload.code || "") || typeof payload.token !== "string" || !payload.token.trim()) {
        throw new Error("Kartoons account was not linked. Complete the device-code approval to continue.");
      }
      if (payload.code !== code) {
        let linked;
        try {
          const status = yield context.axios.get(`${API_BASE}/device/status?code=${encodeURIComponent(payload.code)}`, {
            headers: commonHeaders,
            signal,
            timeout: 15e3,
            validateStatus: () => true
          });
          if (status.status === 200) linked = ((_c = status.data) == null ? void 0 : _c.data) || status.data;
        } catch (e) {
        }
        if ((linked == null ? void 0 : linked.status) !== "linked" || linked.token !== payload.token) {
          throw new Error("Kartoons account was not linked to this device. Please retry.");
        }
      }
      const session = { token: payload.token.trim(), userAgent: result.userAgent || commonHeaders["user-agent"] };
      yield (_d = context.kvStore) == null ? void 0 : _d.set(SESSION_KEY, session);
      yield (_e = context.kvStore) == null ? void 0 : _e.delete("kartoons_auth_session");
      yield (_f = context.kvStore) == null ? void 0 : _f.delete("kartoons_challenge_token");
      return session;
    }))();
    pendingSessions.set(context, request);
    try {
      return yield request;
    } finally {
      if (pendingSessions.get(context) === request) pendingSessions.delete(context);
    }
  });
}
function initializeKartoons(context, signal) {
  return __async(this, null, function* () {
    yield getSession(context, signal);
  });
}
function withKartoonsAuth(context, signal) {
  return __async(this, null, function* () {
    var _a;
    yield applyCredentialReset(context);
    let saved = yield (_a = context.kvStore) == null ? void 0 : _a.get(SESSION_KEY);
    try {
      if (typeof saved === "string") saved = JSON.parse(saved);
    } catch (e) {
      saved = null;
    }
    if (typeof (saved == null ? void 0 : saved.token) !== "string" || !saved.token.trim()) {
      throw new Error("Open the Kartoons catalog to link your account before using this provider.");
    }
    let session = { token: saved.token.trim(), userAgent: saved.userAgent || commonHeaders["user-agent"] };
    const request = (_0, _1, _2, ..._3) => __async(null, [_0, _1, _2, ..._3], function* (method, url, data, config = {}) {
      var _a2;
      if (!url.startsWith(API_BASE + "/")) {
        return method === "get" ? context.axios.get(url, config) : context.axios.post(url, data, config);
      }
      const send = () => __async(null, null, function* () {
        const target = new URL(url);
        target.searchParams.set("token", session.token);
        const headers = __spreadProps(__spreadValues(__spreadValues({}, commonHeaders), config.headers), { "user-agent": session.userAgent });
        delete headers.Authorization;
        delete headers.authorization;
        delete headers["User-Agent"];
        try {
          const options = __spreadProps(__spreadValues({}, config), { headers, validateStatus: () => true });
          return method === "get" ? yield context.axios.get(target.href, options) : yield context.axios.post(target.href, data, options);
        } catch (error) {
          if (error.response) return error.response;
          throw new Error("Kartoons request could not connect. Your linked account has been kept; please retry.");
        }
      });
      const rejected = (r) => {
        var _a3, _b;
        return r.status === 401 || ((_a3 = r.data) == null ? void 0 : _a3.auth_required) === true || ((_b = r.data) == null ? void 0 : _b.authRequired) === true;
      };
      let response = yield send();
      if (rejected(response)) {
        yield (_a2 = context.kvStore) == null ? void 0 : _a2.delete(SESSION_KEY);
        throw new Error("Kartoons rejected the device link. Open the Kartoons catalog to link your account again.");
      }
      if (response.status >= 400) throw new Error(`Kartoons request failed (HTTP ${response.status}). Your linked account has been kept.`);
      return response;
    });
    return __spreadProps(__spreadValues({}, context), { commonHeaders: __spreadProps(__spreadValues({}, context.commonHeaders), { "user-agent": session.userAgent }), axios: __spreadProps(__spreadValues({}, context.axios), {
      get: (url, config) => request("get", url, void 0, config),
      post: (url, data, config) => request("post", url, data, config)
    }) });
  });
}
var SITE_BASE, API_BASE, commonHeaders, SESSION_KEY, pendingSessions;
var init_headers = __esm({
  "providers/kartoons/headers.ts"() {
    "use strict";
    SITE_BASE = "https://kartoons.to";
    API_BASE = "https://api.kartoons.to/api/cloudstream";
    commonHeaders = {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      referer: SITE_BASE + "/",
      origin: SITE_BASE,
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36"
    };
    SESSION_KEY = "kartoons_device_session";
    pendingSessions = /* @__PURE__ */ new WeakMap();
  }
});

// providers/kartoons/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog
});
var catalogs, catalog;
var init_catalog = __esm({
  "providers/kartoons/catalog.ts"() {
    "use strict";
    init_headers();
    catalogs = [
      { title: "Latest Shows", filter: "/catalog/show" },
      { title: "Latest Movies", filter: "/catalog/movie" },
      { title: "Popular Shows", filter: "/catalog/show?catalog=popular" },
      { title: "Popular Movies", filter: "/catalog/movie?catalog=popular" }
    ];
    catalog = function(_0) {
      return __async(this, arguments, function* ({ providerContext, signal }) {
        yield initializeKartoons(providerContext, signal);
        return catalogs;
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

// providers/kartoons/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function formatPost(item) {
  const id = (item == null ? void 0 : item.id) || (item == null ? void 0 : item._id);
  if (!id || !item.title) return null;
  return {
    title: item.title,
    link: JSON.stringify({ type: item.type === "movie" ? "movie" : "show", id, slug: item.slug }),
    image: item.image || item.coverImage || "",
    tag: item.rating ? `\u2605 ${item.rating}` : void 0,
    cornerTag: item.category || String(item.year || item.startYear || item.releaseYear || "") || void 0
  };
}
var getPosts, getSearchPosts;
var init_posts = __esm({
  "providers/kartoons/posts.ts"() {
    "use strict";
    init_providerErrors();
    init_headers();
    getPosts = function(_0) {
      return __async(this, arguments, function* ({ filter, page, signal, providerContext }) {
        var _a;
        try {
          const { axios } = yield withKartoonsAuth(providerContext, signal);
          const legacy = filter || "/catalog/show";
          const mapped = legacy.replace(/^\/shows/, "/catalog/show").replace(/^\/movies/, "/catalog/movie").replace("/featured", "?catalog=popular");
          const url = new URL(API_BASE + mapped);
          url.searchParams.set("page", String(page));
          const res = yield axios.get(url.href, { headers: commonHeaders, signal });
          return (((_a = res.data) == null ? void 0 : _a.data) || []).map(formatPost).filter((p) => p !== null);
        } catch (error) {
          throwProviderError("Kartoons", "getPosts", error);
        }
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({ searchQuery, page, signal, providerContext }) {
        var _a;
        try {
          const { axios } = yield withKartoonsAuth(providerContext, signal);
          if (page > 1) return [];
          const res = yield axios.get(`${API_BASE}/search?q=${encodeURIComponent(searchQuery)}`, { headers: commonHeaders, signal });
          return (((_a = res.data) == null ? void 0 : _a.data) || []).map(formatPost).filter((p) => p !== null);
        } catch (error) {
          throwProviderError("Kartoons", "getSearchPosts", error);
        }
      });
    };
  }
});

// providers/kartoons/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function resolveLink(link, axios) {
  return __async(this, null, function* () {
    var _a;
    if (link.startsWith("{")) {
      try {
        const data = JSON.parse(link);
        return {
          type: data.type === "movie" ? "movie" : "show",
          id: data.id,
          slug: data.slug
        };
      } catch (e) {
      }
    }
    const isShow = link.includes("/show/");
    const isMovie = link.includes("/movie/");
    const type = isMovie ? "movie" : "show";
    const urlObj = new URL(link.startsWith("http") ? link : `https://kartoons.to/${link}`);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    const slugOrId = pathParts[pathParts.length - 1] || "";
    if (/^[a-fA-F0-9]{24}$/.test(slugOrId)) {
      return { type, id: slugOrId };
    }
    const searchTerm = slugOrId.split("-")[0] || slugOrId;
    const searchUrl = `${API_BASE}/search?q=${encodeURIComponent(searchTerm)}`;
    const searchRes = yield axios.get(searchUrl, { headers: commonHeaders });
    const items = ((_a = searchRes.data) == null ? void 0 : _a.data) || [];
    const matched = items.find((it) => it.slug === slugOrId || (it._id || it.id) === slugOrId) || items.find((it) => it.type === type);
    if ((matched == null ? void 0 : matched._id) || (matched == null ? void 0 : matched.id)) {
      return { type, id: matched._id || matched.id, slug: matched.slug };
    }
    return { type, id: slugOrId, slug: slugOrId };
  });
}
var getMeta;
var init_meta = __esm({
  "providers/kartoons/meta.ts"() {
    "use strict";
    init_headers();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b;
        try {
          const { axios } = yield withKartoonsAuth(providerContext);
          const { type, id } = yield resolveLink(link, axios);
          if (type === "movie") {
            const res2 = yield axios.get(`${API_BASE}/movie/${id}`, {
              headers: commonHeaders
            });
            const movie = ((_a = res2.data) == null ? void 0 : _a.data) || res2.data;
            const webUrl2 = movie.slug ? `https://kartoons.to/movie/${movie.slug}` : `https://kartoons.to/movie/${id}`;
            const backdrop2 = movie.coverImage || movie.image || "";
            const poster2 = movie.image || movie.coverImage || "";
            const logo2 = movie.hoverImage || void 0;
            return {
              title: movie.title || "Movie",
              synopsis: movie.description || "",
              image: backdrop2,
              poster: poster2,
              logo: logo2,
              imdbId: "",
              type: "movie",
              tags: Array.isArray(movie.tags) ? movie.tags : [],
              rating: movie.rating ? String(movie.rating) : "",
              webUrl: webUrl2,
              linkList: [
                {
                  title: movie.title || "Movie",
                  directLinks: [
                    {
                      title: "Watch Movie",
                      link: JSON.stringify({
                        type: "movie",
                        id: movie._id || id,
                        title: movie.title
                      }),
                      type: "movie",
                      image: poster2,
                      description: movie.description || ""
                    }
                  ]
                }
              ]
            };
          }
          const res = yield axios.get(`${API_BASE}/show/${id}`, {
            headers: commonHeaders
          });
          const show = ((_b = res.data) == null ? void 0 : _b.data) || res.data;
          const webUrl = show.slug ? `https://kartoons.to/show/${show.slug}` : `https://kartoons.to/show/${id}`;
          const backdrop = show.coverImage || show.image || "";
          const poster = show.image || show.coverImage || "";
          const logo = show.hoverImage || void 0;
          const seasons = show.seasons || [];
          const linkList = seasons.map((season) => ({
            title: season.title || `Season ${season.seasonNumber}`,
            episodesLink: JSON.stringify({
              showId: show._id || id,
              seasonId: season._id,
              seasonNumber: season.seasonNumber,
              slug: season.slug
            })
          }));
          return {
            title: show.title || "Show",
            synopsis: show.description || "",
            image: backdrop,
            poster,
            logo,
            imdbId: "",
            type: "series",
            tags: Array.isArray(show.tags) ? show.tags : [],
            rating: show.rating ? String(show.rating) : "",
            webUrl,
            linkList
          };
        } catch (error) {
          throw new Error(`Failed to get meta: ${(error == null ? void 0 : error.message) || error}`);
        }
      });
    };
  }
});

// providers/kartoons/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function rotate(value, bits) {
  return value >>> bits | value << 32 - bits;
}
function sha256(value) {
  const input = unescape(encodeURIComponent(value));
  const words = new Uint32Array(Math.ceil((input.length + 9) / 64) * 16);
  for (let i = 0; i < input.length; i++) words[i >>> 2] |= input.charCodeAt(i) << 24 - i % 4 * 8;
  words[input.length >>> 2] |= 128 << 24 - input.length % 4 * 8;
  words[words.length - 1] = input.length * 8;
  const h = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]);
  const w = new Uint32Array(64);
  for (let offset = 0; offset < words.length; offset += 16) {
    w.set(words.subarray(offset, offset + 16));
    for (let i = 16; i < 64; i++) {
      const x = w[i - 15], y = w[i - 2];
      w[i] = w[i - 16] + (rotate(x, 7) ^ rotate(x, 18) ^ x >>> 3) + w[i - 7] + (rotate(y, 17) ^ rotate(y, 19) ^ y >>> 10);
    }
    let [a, b, c, d, e, f, g, j] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = j + (rotate(e, 6) ^ rotate(e, 11) ^ rotate(e, 25)) + (e & f ^ ~e & g) + SHA256_K[i] + w[i] | 0;
      const t2 = (rotate(a, 2) ^ rotate(a, 13) ^ rotate(a, 22)) + (a & b ^ a & c ^ b & c) | 0;
      j = g;
      g = f;
      f = e;
      e = d + t1 | 0;
      d = c;
      c = b;
      b = a;
      a = t1 + t2 | 0;
    }
    const round = [a, b, c, d, e, f, g, j];
    for (let i = 0; i < 8; i++) h[i] += round[i];
  }
  return h;
}
function aesKeyExpansion(keyBytes) {
  const w = new Uint32Array(60);
  for (let i = 0; i < 8; i++) {
    w[i] = keyBytes[4 * i] << 24 | keyBytes[4 * i + 1] << 16 | keyBytes[4 * i + 2] << 8 | keyBytes[4 * i + 3];
  }
  for (let i = 8; i < 60; i++) {
    let temp = w[i - 1];
    if (i % 8 === 0) {
      temp = temp << 8 | temp >>> 24;
      temp = AES_SBOX[temp >>> 24 & 255] << 24 | AES_SBOX[temp >>> 16 & 255] << 16 | AES_SBOX[temp >>> 8 & 255] << 8 | AES_SBOX[temp & 255];
      temp ^= AES_RCON[i / 8] << 24;
    } else if (i % 8 === 4) {
      temp = AES_SBOX[temp >>> 24 & 255] << 24 | AES_SBOX[temp >>> 16 & 255] << 16 | AES_SBOX[temp >>> 8 & 255] << 8 | AES_SBOX[temp & 255];
    }
    w[i] = w[i - 8] ^ temp;
  }
  return w;
}
function aesMul(a, b) {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if (b & 1) p ^= a;
    const hi = a & 128;
    a = a << 1 & 255;
    if (hi) a ^= 27;
    b >>= 1;
  }
  return p;
}
function aesInvMixColumns(s) {
  for (let c = 0; c < 4; c++) {
    const i = c * 4;
    const a = s[i];
    const b = s[i + 1];
    const d = s[i + 2];
    const e = s[i + 3];
    s[i] = aesMul(14, a) ^ aesMul(11, b) ^ aesMul(13, d) ^ aesMul(9, e);
    s[i + 1] = aesMul(9, a) ^ aesMul(14, b) ^ aesMul(11, d) ^ aesMul(13, e);
    s[i + 2] = aesMul(13, a) ^ aesMul(9, b) ^ aesMul(14, d) ^ aesMul(11, e);
    s[i + 3] = aesMul(11, a) ^ aesMul(13, b) ^ aesMul(9, d) ^ aesMul(14, e);
  }
}
function aesDecryptBlock(block, w) {
  const state = new Uint8Array(block);
  const Nr = 14;
  for (let c = 0; c < 4; c++) {
    const rk = w[Nr * 4 + c];
    state[c * 4] ^= rk >>> 24 & 255;
    state[c * 4 + 1] ^= rk >>> 16 & 255;
    state[c * 4 + 2] ^= rk >>> 8 & 255;
    state[c * 4 + 3] ^= rk & 255;
  }
  for (let round = Nr - 1; round >= 1; round--) {
    const t12 = state[13];
    state[13] = state[9];
    state[9] = state[5];
    state[5] = state[1];
    state[1] = t12;
    const t22 = state[2];
    state[2] = state[10];
    state[10] = t22;
    const t62 = state[6];
    state[6] = state[14];
    state[14] = t62;
    const t32 = state[3];
    state[3] = state[7];
    state[7] = state[11];
    state[11] = state[15];
    state[15] = t32;
    for (let i = 0; i < 16; i++) state[i] = AES_INV_SBOX[state[i]];
    for (let c = 0; c < 4; c++) {
      const rk = w[round * 4 + c];
      state[c * 4] ^= rk >>> 24 & 255;
      state[c * 4 + 1] ^= rk >>> 16 & 255;
      state[c * 4 + 2] ^= rk >>> 8 & 255;
      state[c * 4 + 3] ^= rk & 255;
    }
    aesInvMixColumns(state);
  }
  const t1 = state[13];
  state[13] = state[9];
  state[9] = state[5];
  state[5] = state[1];
  state[1] = t1;
  const t2 = state[2];
  state[2] = state[10];
  state[10] = t2;
  const t6 = state[6];
  state[6] = state[14];
  state[14] = t6;
  const t3 = state[3];
  state[3] = state[7];
  state[7] = state[11];
  state[11] = state[15];
  state[15] = t3;
  for (let i = 0; i < 16; i++) state[i] = AES_INV_SBOX[state[i]];
  for (let c = 0; c < 4; c++) {
    const rk = w[c];
    state[c * 4] ^= rk >>> 24 & 255;
    state[c * 4 + 1] ^= rk >>> 16 & 255;
    state[c * 4 + 2] ^= rk >>> 8 & 255;
    state[c * 4 + 3] ^= rk & 255;
  }
  return state;
}
function aesDecryptCbcPureJs(cipherBytes, keyBytes, ivBytes) {
  const w = aesKeyExpansion(keyBytes);
  const out = new Uint8Array(cipherBytes.length);
  let prev = ivBytes;
  for (let offset = 0; offset < cipherBytes.length; offset += 16) {
    const block = cipherBytes.subarray(offset, offset + 16);
    const decrypted = aesDecryptBlock(block, w);
    for (let i = 0; i < 16; i++) {
      out[offset + i] = decrypted[i] ^ prev[i];
    }
    prev = block;
  }
  const pad = out[out.length - 1];
  if (pad < 1 || pad > 16) throw new Error("Invalid Kartoons URL padding");
  for (let i = out.length - pad; i < out.length; i++) {
    if (out[i] !== pad) throw new Error("Invalid Kartoons URL padding");
  }
  return out.subarray(0, out.length - pad);
}
function decodeBase64Url(encoded) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const clean = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
  if (!/^[A-Za-z0-9+/]+$/.test(clean) || clean.length % 4 === 1) throw new Error("Invalid Kartoons encoded URL");
  const bytes = [];
  let value = 0, bits = 0;
  for (const ch of clean) {
    value = value << 6 | alphabet.indexOf(ch);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push(value >>> bits & 255);
    }
  }
  return new Uint8Array(bytes);
}
function decodeUtf8(bytes) {
  return decodeURIComponent(Array.from(bytes, (b) => "%" + ("0" + b.toString(16)).slice(-2)).join(""));
}
function decryptUrl(encryptedUrl, keyStr = "bca9e0df1a5abb32906ca3f63ac04cef") {
  if (!encryptedUrl || typeof encryptedUrl !== "string") return "";
  if (encryptedUrl.startsWith("http://") || encryptedUrl.startsWith("https://")) {
    return encryptedUrl;
  }
  try {
    const raw = decodeBase64Url(encryptedUrl);
    if (raw.length < 32 || raw.length % 16 !== 0) return "";
    const key = new Uint8Array(32);
    for (let i = 0; i < 32; i++) key[i] = keyStr.charCodeAt(i) || 32;
    const decoded = aesDecryptCbcPureJs(raw.subarray(16), key, raw.subarray(0, 16));
    const url = decodeUtf8(decoded);
    return /^https?:\/\//i.test(url) ? url : "";
  } catch (e) {
    return "";
  }
}
function aesEncryptBlock(block, words) {
  const state = new Uint8Array(block);
  for (let round = 0; round <= 14; round++) {
    if (round > 0) {
      const prev = new Uint8Array(state);
      for (let column = 0; column < 4; column++) {
        for (let row = 0; row < 4; row++) {
          state[column * 4 + row] = AES_SBOX[prev[(column + row) % 4 * 4 + row]];
        }
      }
      if (round < 14) {
        for (let column = 0; column < 4; column++) {
          const i = column * 4;
          const [a, b, c, d] = state.subarray(i, i + 4);
          state[i] = aesMul(a, 2) ^ aesMul(b, 3) ^ c ^ d;
          state[i + 1] = a ^ aesMul(b, 2) ^ aesMul(c, 3) ^ d;
          state[i + 2] = a ^ b ^ aesMul(c, 2) ^ aesMul(d, 3);
          state[i + 3] = aesMul(a, 3) ^ b ^ c ^ aesMul(d, 2);
        }
      }
    }
    for (let i = 0; i < 16; i++) state[i] ^= words[round * 4 + (i >>> 2)] >>> 24 - i % 4 * 8 & 255;
  }
  return state;
}
function gcmMultiply(x, h) {
  const result = new Uint8Array(16), v = new Uint8Array(h);
  for (let bit = 0; bit < 128; bit++) {
    if (x[bit >>> 3] & 128 >>> bit % 8) {
      for (let i = 0; i < 16; i++) result[i] ^= v[i];
    }
    const low = v[15] & 1;
    for (let i = 15; i >= 0; i--) v[i] = v[i] >>> 1 | (i > 0 ? (v[i - 1] & 1) << 7 : 0);
    if (low) v[0] ^= 225;
  }
  return result;
}
function decryptPlaylistUrl(encoded) {
  if (!encoded.startsWith("enc2:")) return encoded;
  if (!playlistKey) {
    const digest = sha256("pmS0CAMG1Ruq49WbMyhE3fh1sOuLYEL9rtFazYYljVI2j4BPSog73hW7A7xMhceHD0iwrPrVVDXLvxyWr");
    const key = new Uint8Array(32);
    for (let i = 0; i < 32; i++) key[i] = digest[i >>> 2] >>> 24 - i % 4 * 8;
    playlistKey = aesKeyExpansion(key);
  }
  const raw = decodeBase64Url(encoded.slice(5));
  if (raw.length < 29) throw new Error("Kartoons playlist URL is truncated");
  const ciphertext = raw.subarray(12, raw.length - 16);
  const counter = new Uint8Array(16);
  counter.set(raw.subarray(0, 12));
  counter[15] = 1;
  const tagMask = aesEncryptBlock(counter, playlistKey);
  const h = aesEncryptBlock(new Uint8Array(16), playlistKey);
  let auth = new Uint8Array(16);
  for (let offset = 0; offset < ciphertext.length; offset += 16) {
    for (let i = 0; i < 16; i++) auth[i] ^= ciphertext[offset + i] || 0;
    auth = gcmMultiply(auth, h);
  }
  const bitLength = ciphertext.length * 8;
  for (let i = 0; i < 4; i++) auth[15 - i] ^= bitLength >>> i * 8 & 255;
  auth = gcmMultiply(auth, h);
  let invalid = 0;
  for (let i = 0; i < 16; i++) invalid |= auth[i] ^ tagMask[i] ^ raw[raw.length - 16 + i];
  if (invalid) throw new Error("Kartoons playlist URL failed authentication");
  const plain = new Uint8Array(ciphertext.length);
  for (let offset = 0; offset < ciphertext.length; offset += 16) {
    for (let i = 15; i >= 12; i--) {
      counter[i]++;
      if (counter[i]) break;
    }
    const block = aesEncryptBlock(counter, playlistKey);
    for (let i = 0; i < 16 && offset + i < plain.length; i++) plain[offset + i] = ciphertext[offset + i] ^ block[i];
  }
  const url = decodeUtf8(plain);
  if (!/^https?:\/\//i.test(url)) throw new Error("Kartoons playlist URL is not HTTP");
  return url;
}
function resolveWorkerPlaylist(_0, _1, _2, _3) {
  return __async(this, arguments, function* (url, providerContext, headers, signal, depth = 0, quality = "auto", visited = /* @__PURE__ */ new Set()) {
    var _a;
    if (depth > 3 || visited.has(url)) throw new Error("Kartoons playlist contains a loop or too many nested playlists");
    const nextVisited = new Set(visited);
    nextVisited.add(url);
    const response = yield providerContext.axios.get(url, {
      headers,
      signal,
      responseType: "text",
      timeout: 2e4,
      maxContentLength: 2097152
    });
    const text = typeof response.data === "string" ? response.data.trim() : "";
    if (response.status >= 400 || !text.startsWith("#EXTM3U")) throw new Error("Kartoons returned an invalid HLS playlist");
    if (!text.includes("enc2:")) return [{ link: url, quality }];
    const lines = text.split(/\r?\n/).map((line) => line.trim());
    const results = [];
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].startsWith("#EXT-X-STREAM-INF:")) continue;
      const height = (_a = lines[i].match(/RESOLUTION=\d+x(\d+)/i)) == null ? void 0 : _a[1];
      let next = i + 1;
      while (next < lines.length && (!lines[next] || lines[next].startsWith("#"))) next++;
      if (next === lines.length) throw new Error("Kartoons playlist is missing its variant URL");
      const variant = new URL(decryptPlaylistUrl(lines[next]), url).href;
      results.push(...yield resolveWorkerPlaylist(variant, providerContext, headers, signal, depth + 1, height ? `${height}p` : quality, nextVisited));
      i = next;
    }
    if (!results.length) throw new Error("Kartoons media playlist still contains encrypted URLs");
    if (lines.some((line) => line.startsWith("#EXT-X-MEDIA:") && /URI="enc2:/.test(line))) {
      throw new Error("Kartoons playlist requires encrypted external media tracks");
    }
    return results;
  });
}
var SHA256_K, AES_SBOX, AES_INV_SBOX, AES_RCON, playlistKey, getStream;
var init_stream = __esm({
  "providers/kartoons/stream.ts"() {
    "use strict";
    init_providerErrors();
    init_headers();
    SHA256_K = [
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ];
    AES_SBOX = [
      99,
      124,
      119,
      123,
      242,
      107,
      111,
      197,
      48,
      1,
      103,
      43,
      254,
      215,
      171,
      118,
      202,
      130,
      201,
      125,
      250,
      89,
      71,
      240,
      173,
      212,
      162,
      175,
      156,
      164,
      114,
      192,
      183,
      253,
      147,
      38,
      54,
      63,
      247,
      204,
      52,
      165,
      229,
      241,
      113,
      216,
      49,
      21,
      4,
      199,
      35,
      195,
      24,
      150,
      5,
      154,
      7,
      18,
      128,
      226,
      235,
      39,
      178,
      117,
      9,
      131,
      44,
      26,
      27,
      110,
      90,
      160,
      82,
      59,
      214,
      179,
      41,
      227,
      47,
      132,
      83,
      209,
      0,
      237,
      32,
      252,
      177,
      91,
      106,
      203,
      190,
      57,
      74,
      76,
      88,
      207,
      208,
      239,
      170,
      251,
      67,
      77,
      51,
      133,
      69,
      249,
      2,
      127,
      80,
      60,
      159,
      168,
      81,
      163,
      64,
      143,
      146,
      157,
      56,
      245,
      188,
      182,
      218,
      33,
      16,
      255,
      243,
      210,
      205,
      12,
      19,
      236,
      95,
      151,
      68,
      23,
      196,
      167,
      126,
      61,
      100,
      93,
      25,
      115,
      96,
      129,
      79,
      220,
      34,
      42,
      144,
      136,
      70,
      238,
      184,
      20,
      222,
      94,
      11,
      219,
      224,
      50,
      58,
      10,
      73,
      6,
      36,
      92,
      194,
      211,
      172,
      98,
      145,
      149,
      228,
      121,
      231,
      200,
      55,
      109,
      141,
      213,
      78,
      169,
      108,
      86,
      244,
      234,
      101,
      122,
      174,
      8,
      186,
      120,
      37,
      46,
      28,
      166,
      180,
      198,
      232,
      221,
      116,
      31,
      75,
      189,
      139,
      138,
      112,
      62,
      181,
      102,
      72,
      3,
      246,
      14,
      97,
      53,
      87,
      185,
      134,
      193,
      29,
      158,
      225,
      248,
      152,
      17,
      105,
      217,
      142,
      148,
      155,
      30,
      135,
      233,
      206,
      85,
      40,
      223,
      140,
      161,
      137,
      13,
      191,
      230,
      66,
      104,
      65,
      153,
      45,
      15,
      176,
      84,
      187,
      22
    ];
    AES_INV_SBOX = new Uint8Array(256);
    for (let i = 0; i < 256; i++) AES_INV_SBOX[AES_SBOX[i]] = i;
    AES_RCON = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        type,
        signal,
        providerContext
      }) {
        var _a, _b;
        try {
          providerContext = yield withKartoonsAuth(providerContext, signal);
          const { axios } = providerContext;
          let contentId = link;
          let isMovie = type === "movie";
          if (link.startsWith("{")) {
            try {
              const parsed = JSON.parse(link);
              contentId = parsed.id || contentId;
              if (parsed.type === "movie") isMovie = true;
              if (parsed.type === "episode" || parsed.type === "show") isMovie = false;
            } catch (e) {
            }
          }
          const endpoint = isMovie ? `/movie/${contentId}/links` : `/episode/${contentId}/links`;
          const res = yield axios.get(API_BASE + endpoint, { headers: commonHeaders, signal });
          const data = res.data;
          const linksData = Array.isArray((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.links) ? data.data.links : Array.isArray(data == null ? void 0 : data.data) ? data.data : Array.isArray(data == null ? void 0 : data.links) ? data.links : [];
          const streams = [];
          const resolutionErrors = [];
          const activeUa = providerContext.commonHeaders["user-agent"] || commonHeaders["user-agent"];
          for (const item of linksData) {
            const rawUrl = item.url || item.link || item.file || item.src;
            if (!rawUrl) continue;
            const decryptedUrl = decryptUrl(rawUrl);
            if (!decryptedUrl) continue;
            const subtitles = [];
            const subtitleItems = item.subtitles || ((_b = data == null ? void 0 : data.data) == null ? void 0 : _b.subtitles) || (data == null ? void 0 : data.subtitles);
            if (Array.isArray(subtitleItems)) {
              for (const sub of subtitleItems) {
                const rawSubUrl = sub.url || sub.file || sub.link;
                const subUrl = decryptUrl(rawSubUrl || "");
                if (subUrl) {
                  subtitles.push({
                    title: sub.label || sub.lang || sub.language || "Subtitle",
                    language: sub.lang || sub.language || "en",
                    type: subUrl.endsWith(".vtt") ? "text/vtt" : "application/x-subrip",
                    uri: subUrl
                  });
                }
              }
            }
            const headers = {
              Referer: "https://kartoons.to/",
              "User-Agent": activeUa
            };
            let resolved = [{ link: decryptedUrl, quality: item.quality || "auto" }];
            if (/^https?:\/\/[^/]+\.workers\.dev\/playlist\//i.test(decryptedUrl)) {
              try {
                resolved = yield resolveWorkerPlaylist(decryptedUrl, providerContext, headers, signal);
              } catch (error) {
                if (signal == null ? void 0 : signal.aborted) throw error;
                resolutionErrors.push(error.message || "Kartoons playlist resolution failed");
                continue;
              }
            }
            for (const source of resolved) streams.push({
              server: item.title || item.server || item.name || "Kartoons",
              link: source.link,
              type: /\.m3u8(?:[?#]|$)|\/playlist\//i.test(source.link) ? "m3u8" : "mp4",
              quality: source.quality === "auto" ? item.quality || "auto" : source.quality,
              headers,
              subtitles: subtitles.length > 0 ? subtitles : void 0
            });
          }
          if (!streams.length && resolutionErrors.length) throw new Error(resolutionErrors.join("; "));
          return streams;
        } catch (error) {
          throwProviderError("Kartoons", "getStream", error);
        }
      });
    };
  }
});

// providers/kartoons/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/kartoons/episodes.ts"() {
    "use strict";
    init_headers();
    init_providerErrors();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        try {
          const { axios } = yield withKartoonsAuth(providerContext);
          let showId = "";
          let seasonId = "";
          let seasonSlug = "";
          if (url.startsWith("{")) {
            try {
              const parsed = JSON.parse(url);
              showId = parsed.showId;
              seasonId = parsed.seasonId;
              seasonSlug = parsed.slug || (parsed.seasonNumber ? `season-${parsed.seasonNumber}` : "");
            } catch (e) {
            }
          }
          if (!showId || !seasonId) {
            const urlObj = new URL(url.startsWith("http") ? url : `https://kartoons.to/${url}`);
            const slug = urlObj.pathname.split("/").filter(Boolean).pop() || "";
            seasonSlug = urlObj.searchParams.get("season") || "";
            const searchRes = yield axios.get(
              `${API_BASE}/search?q=${encodeURIComponent(slug.split("-")[0] || slug)}`,
              { headers: commonHeaders }
            );
            const showItem = (((_a = searchRes.data) == null ? void 0 : _a.data) || []).find((s) => s.slug === slug || (s._id || s.id) === slug) || ((_c = (_b = searchRes.data) == null ? void 0 : _b.data) == null ? void 0 : _c[0]);
            if ((showItem == null ? void 0 : showItem._id) || (showItem == null ? void 0 : showItem.id)) {
              showId = showItem._id || showItem.id;
              const showDetail = yield axios.get(`${API_BASE}/show/${showId}`, {
                headers: commonHeaders
              });
              const seasons = ((_e = (_d = showDetail.data) == null ? void 0 : _d.data) == null ? void 0 : _e.seasons) || ((_f = showDetail.data) == null ? void 0 : _f.seasons) || [];
              const matchedSeason = seasons.find((s) => s.slug === seasonSlug || `season-${s.seasonNumber}` === seasonSlug) || seasons[0];
              seasonId = (matchedSeason == null ? void 0 : matchedSeason._id) || "";
              seasonSlug = (matchedSeason == null ? void 0 : matchedSeason.slug) || `season-${(matchedSeason == null ? void 0 : matchedSeason.seasonNumber) || 1}`;
            }
          }
          if (!showId || !seasonId) {
            return [];
          }
          if (!seasonSlug) {
            const detail = yield axios.get(`${API_BASE}/show/${showId}`, { headers: commonHeaders });
            const season = (((_h = (_g = detail.data) == null ? void 0 : _g.data) == null ? void 0 : _h.seasons) || []).find((s) => (s._id || s.id) === seasonId);
            if (!season) throw new Error("Kartoons season not found. Reopen the show to refresh its seasons.");
            seasonSlug = season.slug || `season-${season.seasonNumber}`;
          }
          const res = yield axios.get(
            `${API_BASE}/show/${showId}/season/${encodeURIComponent(seasonSlug)}/episodes`,
            { headers: commonHeaders }
          );
          const episodes = ((_i = res.data) == null ? void 0 : _i.data) || res.data || [];
          const episodeLinks = [];
          for (const ep of episodes) {
            const epNum = (_j = ep.episodeNumber) != null ? _j : "";
            const epTitle = ep.title ? `Episode ${epNum}: ${ep.title}` : `Episode ${epNum}`;
            const descParts = [];
            if (ep.durationMinutes || ep.duration) {
              descParts.push(`${ep.durationMinutes || ep.duration}m`);
            }
            if (ep.description) {
              descParts.push(ep.description);
            }
            episodeLinks.push({
              title: epTitle,
              link: JSON.stringify({
                type: "episode",
                id: ep._id,
                showId,
                seasonId,
                episodeNumber: ep.episodeNumber,
                title: ep.title
              }),
              image: ep.image || "",
              description: descParts.length > 0 ? descParts.join(" \u2022 ") : void 0
            });
          }
          return episodeLinks;
        } catch (error) {
          throwProviderError("Kartoons", "getEpisodes", error);
        }
      });
    };
  }
});

// providers/kartoons/kartoons.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
