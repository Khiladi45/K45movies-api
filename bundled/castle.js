var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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

// providers/castle/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog
});
var catalog;
var init_catalog = __esm({
  "providers/castle/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Trending", filter: "" },
      { title: "Movies", filter: "movie" },
      { title: "Series", filter: "series" }
    ];
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

// providers/castle/castleCore.ts
function getApiBase() {
  return __async(this, null, function* () {
    try {
      const url = yield getBaseUrl("castle");
      return url || DEFAULT_API;
    } catch (e) {
      return DEFAULT_API;
    }
  });
}
function aes128KeyExpansion(keyBytes) {
  const w = new Uint32Array(44);
  for (let i = 0; i < 4; i++) {
    w[i] = keyBytes[4 * i] << 24 | keyBytes[4 * i + 1] << 16 | keyBytes[4 * i + 2] << 8 | keyBytes[4 * i + 3];
  }
  for (let i = 4; i < 44; i++) {
    let temp = w[i - 1];
    if (i % 4 === 0) {
      temp = temp << 8 | temp >>> 24;
      temp = AES_SBOX[temp >>> 24 & 255] << 24 | AES_SBOX[temp >>> 16 & 255] << 16 | AES_SBOX[temp >>> 8 & 255] << 8 | AES_SBOX[temp & 255];
      temp ^= AES_RCON[i / 4] << 24;
    }
    w[i] = w[i - 4] ^ temp;
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
    const a = s[i], b = s[i + 1], d = s[i + 2], e = s[i + 3];
    s[i] = aesMul(14, a) ^ aesMul(11, b) ^ aesMul(13, d) ^ aesMul(9, e);
    s[i + 1] = aesMul(9, a) ^ aesMul(14, b) ^ aesMul(11, d) ^ aesMul(13, e);
    s[i + 2] = aesMul(13, a) ^ aesMul(9, b) ^ aesMul(14, d) ^ aesMul(11, e);
    s[i + 3] = aesMul(11, a) ^ aesMul(13, b) ^ aesMul(9, d) ^ aesMul(14, e);
  }
}
function aesDecryptBlock128(block, w) {
  const state = new Uint8Array(block);
  const Nr = 10;
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
function aes128CbcDecrypt(cipherBytes, keyBytes, ivBytes) {
  const w = aes128KeyExpansion(keyBytes);
  const out = new Uint8Array(cipherBytes.length);
  let prev = ivBytes;
  for (let offset = 0; offset < cipherBytes.length; offset += 16) {
    const block = cipherBytes.subarray(offset, offset + 16);
    const decrypted = aesDecryptBlock128(block, w);
    for (let i = 0; i < 16; i++) {
      out[offset + i] = decrypted[i] ^ prev[i];
    }
    prev = block;
  }
  const pad = out[out.length - 1];
  if (pad > 0 && pad <= 16) {
    return out.subarray(0, out.length - pad);
  }
  return out;
}
function base64ToBytes(b64) {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(b64, "base64"));
  }
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}
function utf8ToBytes(str) {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(str);
  }
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(str, "utf8"));
  }
  const escaped = unescape(encodeURIComponent(str));
  const bytes = new Uint8Array(escaped.length);
  for (let i = 0; i < escaped.length; i++) {
    bytes[i] = escaped.charCodeAt(i);
  }
  return bytes;
}
function bytesToUtf8(bytes) {
  if (typeof TextDecoder !== "undefined") {
    return new TextDecoder().decode(bytes);
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("utf8");
  }
  let str = "";
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return decodeURIComponent(escape(str));
}
function deriveKey(securityKeyB64) {
  const decBytes = base64ToBytes(securityKeyB64);
  const suffixBytes = utf8ToBytes(SUFFIX);
  const key = new Uint8Array(16);
  let idx = 0;
  for (let i = 0; i < decBytes.length && idx < 16; i++) {
    key[idx++] = decBytes[i];
  }
  for (let i = 0; i < suffixBytes.length && idx < 16; i++) {
    key[idx++] = suffixBytes[i];
  }
  return key;
}
function decryptCBC(cipherB64, key) {
  const cipherBytes = base64ToBytes(cipherB64);
  const plainBytes = aes128CbcDecrypt(cipherBytes, key, key);
  const text = bytesToUtf8(plainBytes);
  if (!text) {
    throw new Error("CastleTV: AES decrypt produced empty output");
  }
  return text;
}
function castleSafeParse(text) {
  const cleaned = String(text).replace(
    /"([A-Za-z0-9_]*Id|id)"\s*:\s*(-?\d+)/g,
    '"$1":"$2"'
  );
  return JSON.parse(cleaned);
}
function getSecurityKey(ctx) {
  return __async(this, null, function* () {
    const now = Date.now();
    if (cachedKey && now - cachedKeyAt < KEY_TTL) return cachedKey;
    const base = yield getApiBase();
    const url = `${base}/v0.1/system/getSecurityKey/1?channel=${CHANNEL}&clientType=${CLIENT_TYPE}&lang=${LANG}`;
    const res = yield ctx.axios.get(url, { headers: { "User-Agent": UA } });
    const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
    if (!data || data.code !== 200 || !data.data) {
      throw new Error("CastleTV: failed to fetch security key");
    }
    cachedKey = deriveKey(data.data);
    cachedKeyAt = now;
    return cachedKey;
  });
}
function extractCipher(body) {
  try {
    const j = typeof body === "string" ? JSON.parse(body) : body;
    if (j && typeof j.data === "string") return j.data;
  } catch (e) {
  }
  return String(body).trim();
}
function unwrap(body, key) {
  return __async(this, null, function* () {
    try {
      const j = typeof body === "string" ? JSON.parse(body) : body;
      if (j && typeof j === "object" && j.data && typeof j.data === "object") return j;
    } catch (e) {
    }
    const cipher = extractCipher(body);
    try {
      const d = JSON.parse(cipher);
      if (d && typeof d === "object") return d;
    } catch (e) {
    }
    const plain = decryptCBC(cipher, key);
    return castleSafeParse(plain);
  });
}
function fetchDecrypted(url, ctx, signal) {
  return __async(this, null, function* () {
    const key = yield getSecurityKey(ctx);
    const res = yield ctx.axios.get(url, __spreadValues({
      headers: { "User-Agent": UA }
    }, signal ? { signal } : {}));
    return unwrap(res.data, key);
  });
}
function postDecrypted(url, body, ctx, signal) {
  return __async(this, null, function* () {
    const key = yield getSecurityKey(ctx);
    const res = yield ctx.axios.post(url, body, __spreadValues({
      headers: { "User-Agent": UA, "Content-Type": "application/json; charset=utf-8" }
    }, signal ? { signal } : {}));
    return unwrap(res.data, key);
  });
}
function pickDetails(env) {
  const outer = env == null ? void 0 : env.data;
  if (!outer || typeof outer !== "object") return {};
  const inner = outer.data;
  if (inner && typeof inner === "object" && (inner.title || inner.episodes || inner.seasons || inner.id)) {
    return inner;
  }
  return outer;
}
function pickRows(env) {
  var _a;
  const d = env == null ? void 0 : env.data;
  if (!d) return [];
  if (Array.isArray(d.rows)) return d.rows;
  if (Array.isArray((_a = d.data) == null ? void 0 : _a.rows)) return d.data.rows;
  return [];
}
function apiHome(page, ctx, signal) {
  return __async(this, null, function* () {
    const base = yield getApiBase();
    const url = `${base}/film-api/v0.1/category/home?channel=${CHANNEL}&clientType=${CLIENT_TYPE}&clientType=${CLIENT_TYPE}&lang=${LANG}&locationId=${LOCATION_ID}&mode=${MODE}&packageName=${PACKAGE}&page=${page}&size=30`;
    return fetchDecrypted(url, ctx, signal);
  });
}
function apiSearch(query, page, ctx, signal) {
  return __async(this, null, function* () {
    const base = yield getApiBase();
    const url = `${base}/film-api/v1.1.0/movie/searchByKeyword?channel=${CHANNEL}&clientType=${CLIENT_TYPE}&clientType=${CLIENT_TYPE}&keyword=${encodeURIComponent(query)}&lang=${LANG}&mode=${MODE}&packageName=${PACKAGE}&page=${page}&size=30`;
    return fetchDecrypted(url, ctx, signal);
  });
}
function apiMovieDetails(movieId, ctx, signal) {
  return __async(this, null, function* () {
    const base = yield getApiBase();
    const url = `${base}/film-api/v1.9.9/movie?channel=${CHANNEL}&clientType=${CLIENT_TYPE}&clientType=${CLIENT_TYPE}&lang=${LANG}&movieId=${encodeURIComponent(String(movieId))}&packageName=${PACKAGE}`;
    return fetchDecrypted(url, ctx, signal);
  });
}
function apiVideoUrl(movieId, episodeId, resolution, languageId, ctx, signal) {
  return __async(this, null, function* () {
    const base = yield getApiBase();
    const url = `${base}/film-api/v2.0.1/movie/getVideo2?clientType=${CLIENT_TYPE}&packageName=${PACKAGE}&channel=${CHANNEL}&lang=${LANG}`;
    const body = {
      mode: MODE,
      appMarket: APP_MARKET,
      clientType: CLIENT_TYPE,
      woolUser: "false",
      apkSignKey: APK_SIGN,
      androidVersion: ANDROID_VER,
      movieId: String(movieId),
      episodeId: String(episodeId),
      isNewUser: "true",
      resolution: String(resolution),
      packageName: PACKAGE
    };
    if (languageId != null && languageId !== "") body.languageId = String(languageId);
    return postDecrypted(url, body, ctx, signal);
  });
}
function mediaLink(id) {
  return `castle://media/${encodeURIComponent(String(id))}`;
}
function seasonLink(movieId) {
  return `castle://season/${encodeURIComponent(String(movieId))}`;
}
function playLink(movieId, episodeId) {
  return `castle://play/${encodeURIComponent(String(movieId))}_${encodeURIComponent(String(episodeId))}`;
}
function parseMediaLink(link) {
  const raw = String(link || "").trim();
  if (raw.startsWith("castle://media/")) return decodeURIComponent(raw.substring("castle://media/".length));
  const tail = raw.substring(raw.lastIndexOf("/") + 1);
  return tail || raw;
}
function parseSeasonLink(link) {
  const raw = String(link || "").trim();
  if (raw.startsWith("castle://season/")) return decodeURIComponent(raw.substring("castle://season/".length));
  return raw;
}
function parsePlayLink(link) {
  const raw = String(link || "").trim();
  let payload = raw;
  if (raw.startsWith("castle://play/")) payload = decodeURIComponent(raw.substring("castle://play/".length));
  const idx = payload.indexOf("_");
  if (idx === -1) return { movieId: payload, episodeId: "" };
  return { movieId: payload.substring(0, idx), episodeId: payload.substring(idx + 1) };
}
var DEFAULT_API, CHANNEL, CLIENT_TYPE, LANG, MODE, PACKAGE, APP_MARKET, APK_SIGN, ANDROID_VER, LOCATION_ID, UA, SUFFIX, SERIES_TYPES, QUALITY_NAME, QUALITY_NUM, RESOLUTIONS, AES_SBOX, AES_INV_SBOX, AES_RCON, cachedKey, cachedKeyAt, KEY_TTL;
var init_castleCore = __esm({
  "providers/castle/castleCore.ts"() {
    "use strict";
    init_getBaseUrl();
    DEFAULT_API = "https://api.hlowb.com";
    CHANNEL = "IndiaA";
    CLIENT_TYPE = "1";
    LANG = "en-US";
    MODE = "1";
    PACKAGE = "com.external.castle";
    APP_MARKET = "GuanWang";
    APK_SIGN = "ED0955EB04E67A1D9F3305B95454FED485261475";
    ANDROID_VER = "13";
    LOCATION_ID = "1001";
    UA = "okhttp/4.9.0";
    SUFFIX = "T!BgJB";
    SERIES_TYPES = /* @__PURE__ */ new Set(["1", "3", "5"]);
    QUALITY_NAME = { "3": "1080p", "2": "720p", "1": "480p" };
    QUALITY_NUM = { "3": 1080, "2": 720, "1": 480 };
    RESOLUTIONS = ["3", "2", "1"];
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
    cachedKey = null;
    cachedKeyAt = 0;
    KEY_TTL = 5 * 60 * 1e3;
  }
});

// providers/castle/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts
});
function normalizeType(movieType) {
  return SERIES_TYPES.has(String(movieType)) ? "series" : "movie";
}
function mapPost(item) {
  var _a;
  if (!item) return null;
  const id = (_a = item.id) != null ? _a : item.redirectId;
  const title = item.title || item.name;
  if (!id || !title) return null;
  const image = item.coverVerticalImage || item.coverHorizontalImage || item.coverImage || "https://img1.fhxod.com/placeholder.jpg";
  return {
    title,
    link: mediaLink(id),
    image
  };
}
function getPosts(_0) {
  return __async(this, arguments, function* ({
    filter,
    page = 1,
    signal,
    providerContext
  }) {
    var _a, _b;
    try {
      if (filter === "movie" || filter === "series") {
        const env = yield apiHome(page, providerContext, signal);
        const rows = pickRows(env);
        const out = [];
        const seen = /* @__PURE__ */ new Set();
        for (const row of rows) {
          if (!row || SKIP_HOME_ROWS.has(String(row.name || ""))) continue;
          for (const item of (_a = row.contents) != null ? _a : []) {
            if (normalizeType(item.movieType) !== filter) continue;
            const p = mapPost(item);
            if (p && !seen.has(p.link)) {
              seen.add(p.link);
              out.push(p);
              if (out.length >= PAGE_LIMIT) return out;
            }
          }
        }
        return out;
      }
      if (!filter || filter === "trending" || filter === "home") {
        const env = yield apiHome(page, providerContext, signal);
        const rows = pickRows(env);
        const out = [];
        const seen = /* @__PURE__ */ new Set();
        for (const row of rows) {
          if (!row || SKIP_HOME_ROWS.has(String(row.name || ""))) continue;
          for (const item of (_b = row.contents) != null ? _b : []) {
            const p = mapPost(item);
            if (p && !seen.has(p.link)) {
              seen.add(p.link);
              out.push(p);
              if (out.length >= PAGE_LIMIT) return out;
            }
          }
        }
        return out;
      }
      return yield getSearchPosts({ searchQuery: filter, page, signal, providerContext });
    } catch (err) {
      console.error("CastleTV getPosts error:", err);
      return [];
    }
  });
}
function getSearchPosts(_0) {
  return __async(this, arguments, function* ({
    searchQuery,
    page = 1,
    signal,
    providerContext
  }) {
    try {
      if (!(searchQuery == null ? void 0 : searchQuery.trim())) return [];
      const env = yield apiSearch(searchQuery.trim(), page, providerContext, signal);
      const rows = pickRows(env);
      const out = [];
      const seen = /* @__PURE__ */ new Set();
      for (const item of rows) {
        const p = mapPost(item);
        if (p && !seen.has(p.link)) {
          seen.add(p.link);
          out.push(p);
          if (out.length >= PAGE_LIMIT) return out;
        }
      }
      return out;
    } catch (err) {
      console.error("CastleTV search error:", err);
      return [];
    }
  });
}
var SKIP_HOME_ROWS, PAGE_LIMIT;
var init_posts = __esm({
  "providers/castle/posts.ts"() {
    "use strict";
    init_castleCore();
    SKIP_HOME_ROWS = /* @__PURE__ */ new Set(["Hot Erotic Series", "Bollywood Star"]);
    PAGE_LIMIT = 20;
  }
});

// providers/castle/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getMeta: () => getMeta
});
function yearFromTs(ts) {
  if (!ts) return void 0;
  const n = Number(ts);
  if (!isFinite(n)) return void 0;
  try {
    return new Date(n).getFullYear();
  } catch (e) {
    return void 0;
  }
}
var getMeta;
var init_meta = __esm({
  "providers/castle/meta.ts"() {
    "use strict";
    init_castleCore();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a, _b, _c, _d;
        const empty = {
          title: "",
          synopsis: "",
          image: "",
          imdbId: "",
          type: "movie",
          linkList: []
        };
        try {
          const movieId = parseMediaLink(link);
          if (!movieId) return empty;
          const env = yield apiMovieDetails(movieId, providerContext);
          const details = pickDetails(env);
          if (!details || !details.title) return empty;
          const episodes = Array.isArray(details.episodes) ? details.episodes : [];
          const seasons = Array.isArray(details.seasons) ? details.seasons : [];
          const isSeries = SERIES_TYPES.has(String(details.movieType)) || episodes.length > 1 || seasons.length > 1;
          const info = {
            title: details.title || "Unknown Title",
            synopsis: details.briefIntroduction || "",
            image: details.coverVerticalImage || details.coverHorizontalImage || "",
            imdbId: details.imdbId || details.imdb_id || "",
            type: isSeries ? "series" : "movie",
            linkList: []
          };
          if (details.score) {
            info.rating = String(details.score);
          }
          info.year = yearFromTs(details.publishTime);
          info.banner = details.coverHorizontalImage;
          if (isSeries) {
            const seasonList = seasons.length ? seasons : [{ movieId: (_a = details.id) != null ? _a : movieId, number: 1 }];
            const links = [];
            for (const s of seasonList) {
              if (!s || !s.movieId) continue;
              const sNum = (_b = s.number) != null ? _b : 1;
              links.push({
                title: `Season ${sNum}`,
                episodesLink: seasonLink(s.movieId),
                directLinks: []
              });
            }
            if (!links.length) {
              links.push({
                title: "Episodes",
                episodesLink: seasonLink((_c = details.id) != null ? _c : movieId),
                directLinks: []
              });
            }
            info.linkList = links;
          } else {
            const ep = episodes[0];
            if (!(ep == null ? void 0 : ep.id)) return info;
            info.linkList = [{
              title: "Movie",
              directLinks: [{
                title: "Play",
                link: playLink((_d = details.id) != null ? _d : movieId, ep.id),
                type: "movie"
              }]
            }];
          }
          return info;
        } catch (err) {
          console.error("CastleTV getMeta error:", err);
          return empty;
        }
      });
    };
  }
});

// providers/castle/stream.ts
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
    try {
      const { movieId, episodeId } = parsePlayLink(link);
      if (!movieId) return [];
      const env = yield apiMovieDetails(movieId, providerContext, signal);
      const details = pickDetails(env);
      const episodes = Array.isArray(details.episodes) ? details.episodes : [];
      if (!episodes.length) return [];
      let episode = episodeId && episodes.find((e) => String(e.id) === String(episodeId)) || (episodes.length === 1 ? episodes[0] : null) || episodes[0];
      if (!(episode == null ? void 0 : episode.id)) return [];
      const epId = String(episode.id);
      const title = details.title || "Castle TV";
      const tracks = Array.isArray(episode.tracks) ? episode.tracks : [];
      const perLang = tracks.some((t) => t && t.existIndividualVideo === true);
      const streams = [];
      const seen = /* @__PURE__ */ new Set();
      function tryOne(langId, langName, res) {
        return __async(this, null, function* () {
          var _a, _b, _c;
          try {
            const envV = yield apiVideoUrl(movieId, epId, res, langId, providerContext, signal);
            const v = (_c = (_b = (_a = envV == null ? void 0 : envV.data) == null ? void 0 : _a.data) != null ? _b : envV == null ? void 0 : envV.data) != null ? _c : {};
            const url = v.videoUrl;
            if (!url || v.permissionDenied === true) return;
            if (seen.has(url)) return;
            seen.add(url);
            const parts = [title];
            if (langName) parts.push(langName);
            if (QUALITY_NAME[res]) parts.push(QUALITY_NAME[res]);
            if (/preview/i.test(url)) parts.push("preview");
            streams.push({
              server: parts.join(" - "),
              link: url,
              type: /\.m3u8(\?|#|$)/i.test(url) ? "m3u8" : "mp4",
              quality: String(QUALITY_NUM[res] || res || "720")
            });
          } catch (e) {
          }
        });
      }
      if (!perLang) {
        const langName = tracks.map((t) => t && (t.languageName || t.abbreviate)).filter(Boolean).join(", ") || "Default";
        for (const res of RESOLUTIONS) yield tryOne(null, langName, res);
      } else {
        for (const t of tracks) {
          if (!t || t.languageId == null) continue;
          const lname = t.languageName || t.abbreviate || "Unknown";
          for (const res of RESOLUTIONS) yield tryOne(String(t.languageId), lname, res);
        }
      }
      return streams;
    } catch (err) {
      console.error("CastleTV getStream error:", err);
      return [];
    }
  });
}
var init_stream = __esm({
  "providers/castle/stream.ts"() {
    "use strict";
    init_castleCore();
  }
});

// providers/castle/episodes.ts
var episodes_exports = {};
__export(episodes_exports, {
  getEpisodes: () => getEpisodes
});
var getEpisodes;
var init_episodes = __esm({
  "providers/castle/episodes.ts"() {
    "use strict";
    init_castleCore();
    getEpisodes = function(_0) {
      return __async(this, arguments, function* ({
        url,
        providerContext
      }) {
        var _a;
        try {
          const movieId = parseSeasonLink(url);
          if (!movieId) return [];
          const env = yield apiMovieDetails(movieId, providerContext);
          const details = pickDetails(env);
          const episodes = Array.isArray(details.episodes) ? details.episodes : [];
          if (!episodes.length) return [];
          const ownerId = String((_a = details.id) != null ? _a : movieId);
          const out = [];
          episodes.forEach((ep, i) => {
            var _a2;
            if (!(ep == null ? void 0 : ep.id)) return;
            const num = (_a2 = ep.number) != null ? _a2 : i + 1;
            const name = ep.title || `Episode ${num}`;
            out.push({
              title: `${num}. ${name}`,
              link: playLink(ownerId, ep.id)
            });
          });
          return out;
        } catch (err) {
          console.error("CastleTV getEpisodes error:", err);
          return [];
        }
      });
    };
  }
});

// providers/castle/castle.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
Object.assign(exports, (init_episodes(), __toCommonJS(episodes_exports)));
