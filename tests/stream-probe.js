// Dev-only end-to-end check for cncVerse. Loads the built bundle and exercises
// catalog -> posts -> meta -> episodes -> stream -> real segment bytes.
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const kv = new Map();
const providerContext = {
  axios,
  cheerio,
  commonHeaders: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  },
  openWebView: async () => {
    throw new Error("not used");
  },
  kvStore: {
    get: async (k) => (kv.has(k) ? kv.get(k) : null),
    set: async (k, v) => void kv.set(k, v),
    delete: async (k) => kv.delete(k),
    keys: async () => [...kv.keys()],
    clear: async () => kv.clear(),
  },
};

const p = require(path.join(__dirname, "..", "bundled", "cncVerse.js"));

const safe = (u) => String(u || "").replace(/(in=)[^&]+/g, "$1<token>");
const log = (...a) => console.log(...a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))));

async function firstSegment(stream) {
  const r = await axios.get(stream.link, {
    headers: stream.headers,
    timeout: 15000,
    responseType: "text",
    validateStatus: () => true,
  });
  const text = typeof r.data === "string" ? r.data : "";
  if (!text.includes("#EXTM3U")) return { ok: false, why: `manifest status ${r.status}` };
  const lines = text.split(/\r?\n/);
  let variant = stream.link;
  const idx = lines.findIndex((l) => l.startsWith("#EXT-X-STREAM-INF"));
  if (idx >= 0 && lines[idx + 1] && !lines[idx + 1].startsWith("#")) {
    variant = new URL(lines[idx + 1].trim(), stream.link).href;
    const v = await axios.get(variant, {
      headers: stream.headers,
      timeout: 15000,
      responseType: "text",
      validateStatus: () => true,
    });
    const vt = typeof v.data === "string" ? v.data : "";
    if (!vt.includes("#EXTM3U")) return { ok: false, why: `variant status ${v.status}` };
    const seg = vt.split(/\r?\n/).find((l) => l && !l.startsWith("#"));
    if (!seg) return { ok: false, why: "no segment" };
    variant = new URL(seg.trim(), variant).href;
  } else {
    const seg = lines.find((l) => l && !l.startsWith("#") && !l.startsWith("http"));
    if (!seg) return { ok: false, why: "no segment" };
    variant = new URL(seg.trim(), stream.link).href;
  }

  const s = await axios.get(variant, {
    headers: { ...stream.headers, Range: "bytes=0-131071" },
    timeout: 15000,
    responseType: "arraybuffer",
    validateStatus: () => true,
  });
  const buf = Buffer.from(s.data);
  let sync = 0;
  for (let o = 0; o + 188 <= buf.length; o += 188) if (buf[o] === 0x47) sync++;
  const ctype = String(s.headers?.["content-type"] || "");
  const isVideo = ctype.startsWith("video/");
  const isTs = sync > 100;
  return {
    ok: isVideo || isTs,
    bytes: buf.length,
    status: s.status,
    ctype,
    tsSync: `${sync}/${Math.floor(buf.length / 188)}`,
    hex: buf.slice(0, 8).toString("hex"),
  };
}

(async () => {
  const studios = await p.catalog({ providerContext });
  log("CATALOG", studios);

  for (const entry of studios) {
    const filter = entry.filter;
    log(`\n===== ${entry.title} (${filter}) =====`);
    let posts = [];
    try {
      posts = await p.getPosts({
        filter,
        page: 1,
        providerValue: "cncVerse",
        signal: new AbortController().signal,
        providerContext,
      });
    } catch (e) {
      log("posts ERROR", e.message);
      continue;
    }
    log("posts", posts.length, posts.slice(0, 3).map((x) => x.title));
    if (!posts.length) continue;

    let target = posts[0];
    let info = null;
    try {
      info = await p.getMeta({ link: target.link, provider: "cncVerse", providerContext });
    } catch (e) {
      log("meta ERROR", e.message);
      continue;
    }
    log("meta", { title: info.title, type: info.type, links: info.linkList.length });

    let playLink = null;
    let label = "";
    if (info.type === "series") {
      const season = info.linkList.find((l) => l.episodesLink);
      if (!season) {
        log("no season link");
        continue;
      }
      let episodes = [];
      try {
        episodes = await p.getEpisodes({ url: season.episodesLink, providerContext });
      } catch (e) {
        log("episodes ERROR", e.message);
      }
      log("episodes", episodes.length, episodes.slice(0, 2).map((x) => x.title));
      if (!episodes.length) continue;
      playLink = episodes[0].link;
      label = `episode:${episodes[0].title}`;
    } else {
      playLink = info.linkList[0]?.directLinks?.[0]?.link;
      label = "movie";
    }
    if (!playLink) {
      log("no play link");
      continue;
    }

    let streams = [];
    try {
      streams = await p.getStream({ link: playLink, type: info.type, providerContext });
    } catch (e) {
      log("stream ERROR", e.message);
      continue;
    }
    const bad = streams.filter((s) => s.link.includes("220884"));
    log("streams", streams.length, "abusive", bad.length, streams.map((s) => `${s.server}|${s.quality}`).slice(0, 4));
    if (!streams.length) {
      log("PLAYBACK FAIL: no streams", label);
      continue;
    }
    const variant = streams.find((s) => !s.server.includes("Auto")) || streams[0];
    try {
      const seg = await firstSegment(variant);
      log("PLAYBACK", seg.ok ? "PASS" : "FAIL", label, seg);
    } catch (e) {
      log("segment ERROR", e.message);
    }
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log("\n===== SEARCH =====");
  const found = await p.getSearchPosts({
    searchQuery: "the office",
    page: 1,
    providerValue: "cncVerse",
    signal: new AbortController().signal,
    providerContext,
  });
  log("search results", found.length, found.slice(0, 6).map((x) => [x.title, x.link.split("|")[1]]));
  console.log("DONE");
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
