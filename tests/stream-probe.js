// Dev-only end-to-end check for the seven NetMirror/CNC studio providers:
// catalog -> posts -> meta -> stream -> real segment bytes, per provider.
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const PROVIDERS = ["netflix", "primeVideo", "hotstar", "disneyPlus", "pixar", "starWars", "marvel"];

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

async function verifyProvider(id) {
  const p = require(path.join(__dirname, "..", "bundled", `${id}.js`));
  const started = Date.now();
  log(`\n===== ${id} =====`);

  const catalog = await p.catalog({ providerContext });
  log("catalog", catalog.map((c) => c.title).slice(0, 6));
  if (!catalog.length) return { id, ok: false, why: "empty catalog" };

  let posts = [];
  for (const entry of catalog.slice(0, 2)) {
    posts = await p.getPosts({
      filter: entry.filter,
      page: 1,
      providerValue: id,
      signal: new AbortController().signal,
      providerContext,
    });
    if (posts.length) break;
  }
  log("posts", posts.length, posts.slice(0, 3).map((x) => x.title));
  if (!posts.length) return { id, ok: false, why: "no posts" };

  for (const candidate of posts.slice(0, 3)) {
    let info;
    try {
      info = await p.getMeta({ link: candidate.link, provider: id, providerContext });
    } catch (e) {
      log("meta ERROR", candidate.title, e.message);
      continue;
    }
    log("meta", { title: info.title, type: info.type, links: info.linkList.length });

    let playLink = null;
    let label = "movie";
    if (info.type === "series") {
      const season = info.linkList.find((l) => l.episodesLink);
      if (!season) continue;
      const episodes = await p.getEpisodes({ url: season.episodesLink, providerContext });
      log("episodes", episodes.length, episodes.slice(0, 2).map((x) => x.title));
      if (!episodes.length) continue;
      playLink = episodes[0].link;
      label = `episode:${episodes[0].title}`;
    } else {
      playLink = info.linkList[0]?.directLinks?.[0]?.link;
    }
    if (!playLink) continue;

    let streams = [];
    try {
      streams = await p.getStream({ link: playLink, type: info.type, providerContext });
    } catch (e) {
      log("stream ERROR", e.message);
      continue;
    }
    const abusive = streams.filter((s) => s.link.includes("220884"));
    log("streams", streams.length, "abusive", abusive.length, streams.map((s) => `${s.server}|${s.quality}`).slice(0, 4));
    if (!streams.length) continue;

    const variant = streams.find((s) => !s.server.includes("Auto")) || streams[0];
    try {
      const seg = await firstSegment(variant);
      log("PLAYBACK", seg.ok ? "PASS" : "FAIL", label, { ...seg, link: safe(variant.link) });
      if (seg.ok && abusive.length === 0) {
        return { id, ok: true, ms: Date.now() - started, title: info.title };
      }
    } catch (e) {
      log("segment ERROR", e.message);
    }
  }
  return { id, ok: false, why: "no playable stream" };
}

(async () => {
  const only = process.argv[2];
  const results = [];
  for (const id of PROVIDERS) {
    if (only && id !== only) continue;
    try {
      results.push(await verifyProvider(id));
    } catch (e) {
      log("FAIL", id, e.message);
      results.push({ id, ok: false, why: e.message });
    }
  }
  console.log("\n===== SUMMARY =====");
  for (const r of results) console.log(r.ok ? `PASS ${r.id} (${r.ms}ms)` : `FAIL ${r.id}: ${r.why}`);
  const ok = results.filter((r) => r.ok).length;
  console.log(`${ok}/${results.length} providers playable`);
  if (ok !== results.length) process.exit(1);
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
