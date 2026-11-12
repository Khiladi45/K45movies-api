const cheerio = require("cheerio");
const axios = require("axios");
const mw = require("../bundled/movieswood");
const UA = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
const providerContext = { cheerio, axios, commonHeaders: { "User-Agent": UA, Referer: "https://movieswood.cloud/" } };
(async () => {
  const link = "https://movieswood.cloud/telugu1/?d=ma6740d8c47526dc";
  const streams = await mw.getStream({ link, type: "movie", signal: AbortSignal.timeout(60000), providerContext });
  console.log(JSON.stringify(streams, null, 2));
})().catch(e => { console.error("ERR", e.message); process.exit(1); });
