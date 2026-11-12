const { test } = require("node:test");
const assert = require("node:assert/strict");
const cheerio = require("cheerio");
const hd = require("../bundled/hdmovieslife");
const movieswood = require("../bundled/movieswood");
const dvdplay = require("../bundled/dvdplay");
const tamilmv = require("../bundled/1tamilmv");

const context = { cheerio, commonHeaders: { "User-Agent": "Provider test" } };
const signal = () => AbortSignal.timeout(8_000);
const mkv = Uint8Array.from([0x1a, 0x45, 0xdf, 0xa3]);

// probeMedia first issues HEAD, then a Range GET for the magic bytes.
const mediaProbe = (signed) => ({
  async head(url) {
    assert.equal(url, signed);
    return { headers: { "content-type": "video/matroska", "accept-ranges": "bytes" } };
  },
  async get(url, options = {}) {
    assert.equal(url, signed);
    assert.equal(options.headers.Range, "bytes=0-63");
    return { status: 206, data: mkv, headers: { "content-range": "bytes 0-63/1000" } };
  },
});

test("HDMoviesLife follows the get_buttons mirror chain to PixelDrain", async () => {
  const entry = "https://links.hdlinks.online/file/example";
  const buttons = '<a data-mirror="pixeldrain" href="?token=abc">PixelDrain</a>';
  const gdfiles = "https://www.gdfiles-xyz.workers.dev/file/abc";
  const direct = "https://pixeldrain.dev/api/file/xyz123?download";
  const streams = await hd.getStream({
    link: entry,
    type: "movie",
    signal: signal(),
    providerContext: {
      ...context,
      axios: {
        ...mediaProbe(direct),
        async head(url) {
          if (url === direct) return mediaProbe(direct).head(url);
          if (url === entry + "?token=abc") {
            return { status: 301, headers: { location: "https://cdn.fxshare.org/file/example?token=abc" } };
          }
          if (url === "https://cdn.fxshare.org/file/example?token=abc") {
            return { status: 302, headers: { location: gdfiles } };
          }
          if (url === gdfiles) return { status: 200, headers: {} };
          if (url === gdfiles + "?token=abc") {
            return { status: 302, headers: { location: "https://pixeldrain.com/u/xyz123" } };
          }
          if (url === "https://pixeldrain.com/u/xyz123") return { status: 200, headers: {} };
          throw new Error("unexpected HEAD " + url);
        },
        async get(url, options = {}) {
          if (url === direct) return mediaProbe(direct).get(url, options);
          if (url === entry) return { status: 200, headers: {}, data: buttons };
          if (url === gdfiles) return { status: 200, headers: {}, data: buttons };
          throw new Error("unexpected " + url);
        },
      },
    },
  });
  assert.equal(streams.length, 1);
  assert.equal(streams[0].link, direct);
  assert.equal(streams[0].type, "mkv");
});

test("HDMoviesLife keeps the legacy payload chain working", async () => {
  const entry = "https://links.hdlinks.online/file/example";
  const landing = "https://alpha.fxdl.site/file/example";
  const file = "https://fast-02.fxcloud-as.site/dl/example/Blind.Game.480p.mkv";
  const signed = file + "?start=1&hash=example";
  const [video] = await hd.getStream({
    link: entry,
    type: "movie",
    signal: signal(),
    providerContext: {
      ...context,
      axios: {
        ...mediaProbe(signed),
        async get(url, options = {}) {
          if (url === signed) return mediaProbe(signed).get(url, options);
          if (url === entry) {
            return { request: { responseURL: landing }, data: '<a href="?payload=example">Fast Download</a>' };
          }
          if (url === landing + "?payload=example") {
            return { request: { responseURL: file }, data: '<a href="?start=1&hash=example">Start</a>' };
          }
          if (url === entry + "?action=get_buttons") return { status: 200, data: "" };
          throw new Error("unexpected " + url);
        },
      },
    },
  });
  assert.equal(video.link, signed);
  assert.equal(video.type, "mkv");
});

test("MoviesWood resolves download-start.php with the session cookie", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({
    movieswood: { url: "https://movieswood.cloud" },
  }));
  const movie = "https://movieswood.cloud/telugu1/?d=m1";
  const rating = "https://movieswood.cloud/telugu1/rating.php?f=1";
  const start = "https://movieswood.cloud/telugu1/download-start.php?t=1";
  const signed = "https://my.lustmaya.com/Example_2026_720p.mkv?expires=1&sig=abc";
  let cookieSeen = "";
  const streams = await movieswood.getStream({
    link: movie,
    type: "movie",
    signal: signal(),
    providerContext: {
      ...context,
      axios: {
        ...mediaProbe(signed),
        async head(url, options = {}) {
          if (url === start) {
            cookieSeen = options.headers.Cookie || "";
            return { status: 302, headers: { location: signed } };
          }
          return mediaProbe(signed).head(url);
        },
        async get(url, options = {}) {
          if (url === signed) return mediaProbe(signed).get(url, options);
          if (url === movie) {
            return {
              status: 200,
              headers: { "set-cookie": ["PHPSESSID=session; path=/"] },
              data: '<h1>Example</h1><a href="rating.php?f=1">⬇ Download</a>',
            };
          }
          if (url === rating) {
            assert.equal(options.headers.Cookie, "PHPSESSID=session");
            return {
              status: 200,
              headers: {},
              data: '<title>Example 720p</title><a href="download-start.php?t=1">↓ Download file · 700 MB</a><a href="download-start.php?t=2">Open Telegram download ↗</a>',
            };
          }
          if (url === start) {
            cookieSeen = options.headers.Cookie || "";
            return { status: 302, headers: { location: signed }, data: "" };
          }
          throw new Error("unexpected " + url);
        },
      },
    },
  });
  assert.equal(cookieSeen, "PHPSESSID=session");
  assert.equal(streams.length, 1);
  assert.equal(streams[0].link, signed);
  assert.equal(streams[0].type, "mkv");
  assert.equal(streams[0].quality, "720");
});

test("DVDPlay resolves the HubCloud server to a direct file", async () => {
  const filePage = "https://dvdplay.singles/download/file/1/1/";
  const hub = "https://hubcloud.pw/video/example";
  const generated = "https://gamerxyt.com/hubcloud.php?host=hubvid&id=example";
  const file = "https://odd-star.workers.dev/abc/movie.mkv";
  const streams = await dvdplay.getStream({
    link: filePage,
    type: "movie",
    signal: signal(),
    providerContext: {
      ...context,
      axios: {
        ...mediaProbe(file),
        async get(url, options = {}) {
          if (url === file) return mediaProbe(file).get(url, options);
          if (url === filePage) {
            return {
              status: 200,
              data: `<title>Example</title><a href="${hub}">01 Download File (Server 1) ↗</a><a href="https://dtflix.site/share/1">02 Download File (Server 2)Google Drive ↗</a>`,
            };
          }
          if (url === hub) {
            return { status: 200, data: `<a href="${generated}">Generate Direct Download Link</a>` };
          }
          if (url === generated) {
            return { status: 200, data: `<a href="${file}">Download File [1.4 GB]</a>` };
          }
          throw new Error("unexpected " + url);
        },
      },
    },
  });
  const direct = streams.find((s) => s.type === "mkv");
  assert.ok(direct);
  assert.equal(direct.link, file);
  assert.equal(streams.filter((s) => s.downloadOnly).length, 1);
});

test("1TamilMV reads StreamCash players from window.__PCr", async () => {
  const embed = "https://streamcash.to/embed/J3VIp1A5MW";
  const hls = "https://cdn.streamcash.to/videos/J3VIp1A5MW/index.m3u8";
  const config = Buffer.from(JSON.stringify({ vid: "J3VIp1A5MW", src: hls }), "utf8").toString("base64");
  const streams = await tamilmv.getStream({
    link: embed,
    type: "movie",
    signal: signal(),
    providerContext: {
      ...context,
      axios: {
        async get(url) {
          assert.equal(url, embed);
          return {
            status: 200,
            data: `<html><head><title>Example (2026) HDRip - 720p</title></head><body><script>window.__PCr='${config}'</script></body></html>`,
          };
        },
      },
    },
  });
  assert.equal(streams.length, 1);
  assert.equal(streams[0].link, hls);
  assert.equal(streams[0].type, "m3u8");
  assert.equal(streams[0].quality, "720");
  assert.equal(streams[0].headers.Referer, embed);
});
