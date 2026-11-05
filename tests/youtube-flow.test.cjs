// Mocked end-to-end flows for the YouTube provider (run: node tests/youtube-flow.test.cjs)
const assert = require("assert");
const path = require("path");
const os = require("os");
const esbuild = require("esbuild");

const bundle = (name) => {
  const out = path.join(os.tmpdir(), `yt-flow-${name}-${process.pid}.cjs`);
  esbuild.buildSync({
    entryPoints: [path.join(__dirname, `../providers/youtube/${name}.ts`)],
    bundle: true, platform: "node", format: "cjs", outfile: out, logLevel: "silent",
  });
  return require(out);
};
const posts = bundle("posts");
const meta = bundle("meta");
const stream = bundle("stream");
bundle("catalog");

const cont = (t) => ({ continuationItemRenderer: { continuationEndpoint: { continuationCommand: { token: t } } } });
const vr = (id) => ({ videoRenderer: { videoId: id, title: { simpleText: "T " + id }, ownerText: { simpleText: "Chan" }, thumbnail: { thumbnails: [{ url: "https://i/x.jpg", width: 1 }] } } });
const html = (data) => `<html><script>var ytInitialData = ${JSON.stringify(data)};</script>"INNERTUBE_API_KEY":"K","INNERTUBE_CLIENT_VERSION":"2.2026.1"</html>`;

// Pages: 1 (HTML) -> 2 -> 3 (no further token)
const page1 = html({ c: [{ itemSectionRenderer: { contents: [vr("aaaaaaaaaa1"), vr("aaaaaaaaaa2")] } }, cont("T2")] });
const resp = {
  T2: { onResponseReceivedCommands: [{ appendContinuationItemsAction: { continuationItems: [{ itemSectionRenderer: { contents: [vr("bbbbbbbbbb1"), vr("bbbbbbbbbb2")] } }, cont("T3")] } }] },
  T3: { onResponseReceivedCommands: [{ appendContinuationItemsAction: { continuationItems: [{ itemSectionRenderer: { contents: [vr("cccccccccc1")] } }] } }] },
};
const calls = [];
const makeCtx = (kv) => ({
  axios: {
    get: async (url) => { calls.push("GET " + url.split("?")[0]); return { data: page1 }; },
    post: async (url, body) => {
      calls.push("POST " + body.continuation);
      assert.ok(url.includes("key=K"), "api key forwarded");
      assert.strictEqual(body.context.client.clientVersion, "2.2026.1");
      return { data: resp[body.continuation] };
    },
  },
  kvStore: kv,
});
const ids = (list) => list.map((x) => x.videoId);

(async () => {
  const ctx = makeCtx(undefined); // no kvStore at all
  const q = "flow-query-1";
  const p1 = await posts.getPosts({ filter: q, page: 1, providerContext: ctx });
  const p2 = await posts.getPosts({ filter: q, page: 2, providerContext: ctx });
  const p3 = await posts.getPosts({ filter: q, page: 3, providerContext: ctx });
  const p4 = await posts.getPosts({ filter: q, page: 4, providerContext: ctx });
  assert.deepStrictEqual(ids(p1), ["aaaaaaaaaa1", "aaaaaaaaaa2"]);
  assert.deepStrictEqual(ids(p2), ["bbbbbbbbbb1", "bbbbbbbbbb2"]);
  assert.deepStrictEqual(ids(p3), ["cccccccccc1"]);
  assert.deepStrictEqual(p4, [], "past the last page returns [] and never repeats page 1");
  const all = [...p1, ...p2, ...p3].map((x) => x.videoId);
  assert.strictEqual(new Set(all).size, all.length, "no repeated items across pages");
  assert.deepStrictEqual(calls, ["GET https://www.youtube.com/results", "POST T2", "POST T3"]);

  // Cold token cache: asking for page 3 first walks pages 1 and 2.
  calls.length = 0;
  const cold = await posts.getPosts({ filter: "flow-query-2", page: 3, providerContext: ctx });
  assert.deepStrictEqual(ids(cold), ["cccccccccc1"]);
  assert.deepStrictEqual(calls, ["GET https://www.youtube.com/results", "POST T2", "POST T3"]);

  // Tokens survive in kvStore across a "restart" of the in-memory cache is covered by TTL; check kv writes.
  const store = new Map();
  const kv = { get: async (k) => store.get(k), set: async (k, v) => { store.set(k, v); } };
  await posts.getSearchPosts({ searchQuery: "flow-query-3", page: 1, providerContext: makeCtx(kv) });
  assert.ok(store.get("yt:cont:flow-query-3:2").token === "T2", "next-page token persisted in kvStore");

  // A broken kvStore must not break paging.
  const bad = { get: async () => { throw new Error("x"); }, set: async () => { throw new Error("x"); } };
  const okPage = await posts.getPosts({ filter: "flow-query-4", page: 1, providerContext: makeCtx(bad) });
  assert.strictEqual(okPage.length, 2);

  // Suggestions
  const sctx = { axios: { get: async (url) => { assert.ok(url.includes("q=new%20tr")); return { data: '["new tr",["new trailer","new trailers"]]' }; } } };
  assert.deepStrictEqual(await posts.getSuggestions({ query: "new tr", providerContext: sctx }), ["new trailer", "new trailers"]);
  assert.deepStrictEqual(await posts.getSuggestions({ query: "  ", providerContext: sctx }), []);
  assert.deepStrictEqual(await posts.getSuggestions({ query: "x", providerContext: { axios: { get: async () => { throw new Error("net"); } } } }), []);

  // Comments: first call reads the watch page for the token, then calls /next.
  const watchHtml = html({ contents: { x: [{ itemSectionRenderer: { sectionIdentifier: "comment-item-section", contents: [cont("CT")] } }] } });
  const ent = (id, text) => ({ payload: { commentEntityPayload: { properties: { commentId: id, content: { content: text }, publishedTime: "1d" }, author: { displayName: "@u" + id }, toolbar: { likeCountNotliked: "1", replyCount: "0" } } } });
  const nextResp = {
    CT: { frameworkUpdates: { entityBatchUpdate: { mutations: [ent("k1", "hi")] } }, items: [{ commentsHeaderRenderer: { countText: { runs: [{ text: "898" }, { text: " Comments" }] } } }, { commentThreadRenderer: { commentViewModel: { commentViewModel: { commentId: "k1" } } } }, cont("CT2")] },
    CT2: { frameworkUpdates: { entityBatchUpdate: { mutations: [ent("k2", "yo")] } }, items: [{ commentThreadRenderer: { commentViewModel: { commentViewModel: { commentId: "k2" } } } }] },
  };
  const gets = [];
  const cctx = { axios: {
    get: async (url) => { gets.push(url); return { data: watchHtml }; },
    post: async (url, body) => { assert.ok(url.includes("/youtubei/v1/next")); return { data: nextResp[body.continuation] }; },
  } };
  const c1 = await meta.getComments({ link: "https://www.youtube.com/shorts/abcdefghijk", providerContext: cctx });
  assert.deepStrictEqual(gets, ["https://www.youtube.com/watch?v=abcdefghijk"], "Shorts link reads the watch page");
  assert.deepStrictEqual([c1.comments.map((c) => c.text), c1.count, c1.continuation], [["hi"], "898", "CT2"]);
  const c2 = await meta.getComments({ link: "x", continuation: c1.continuation, providerContext: cctx });
  assert.deepStrictEqual([c2.comments.map((c) => c.text), c2.continuation], [["yo"], undefined]);
  assert.strictEqual(gets.length, 1, "continuation call does not re-read the watch page");
  const failed = await meta.getComments({ link: "abcdefghijk", providerContext: { axios: { get: async () => { throw new Error("net"); } } } });
  assert.deepStrictEqual(failed, { comments: [], count: "", continuation: undefined });

  // Streams: master + per-height variants + muxed mp4, ordered for streaming and downloads.
  const masterUrl = "https://manifest.googlevideo.com/x/index.m3u8";
  const masterText = ["#EXTM3U", '#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="a",URI="audio.m3u8"',
    '#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1920x1080,AUDIO="a"', "v1080.m3u8",
    '#EXT-X-STREAM-INF:BANDWIDTH=900000,RESOLUTION=1280x720', "v720.m3u8",
    '#EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=640x360', "v360.m3u8"].join("\n");
  const sctx2 = { kvStore: undefined, axios: {
    get: async (url) => url === masterUrl ? { data: masterText } : { data: "<html></html>" },
    post: async (url, body) => body.context.client.clientName === "VISIONOS"
      ? { data: { streamingData: { hlsManifestUrl: masterUrl } } }
      : { data: { streamingData: { formats: [{ url: "https://v/18.mp4", qualityLabel: "360p" }] } } },
  } };
  const live = await stream.getStream({ link: "dQw4w9WgXcQ", type: "movie", signal: undefined, providerContext: sctx2 });
  assert.deepStrictEqual(live.map((s) => s.quality), ["auto", "1080", "720", "360", "360"]);
  assert.strictEqual(live[0].server, "YouTube HLS (Auto)");
  assert.strictEqual(live[1].tag, "HLS variant • Video only");
  assert.strictEqual(live[2].tag, "HLS variant • Audio + Video");
  const dl = await stream.getStream({ link: "dQw4w9WgXcQ", type: "movie", signal: undefined, providerContext: sctx2, isDownload: true });
  assert.deepStrictEqual(dl.map((s) => s.type + ":" + s.quality + (s.tag.includes("Video only") ? "!" : "")), ["mp4:360", "m3u8:720", "m3u8:360", "m3u8:1080!", "m3u8:auto"]);
  const pref = await stream.getStream({ link: "dQw4w9WgXcQ", type: "movie", signal: undefined, providerContext: { ...sctx2, kvStore: { get: async () => "720p", set: async () => {} } } });
  assert.deepStrictEqual(pref.map((s) => s.quality), ["auto", "720", "1080", "360", "360"]);
  // Master missing -> still returns the muxed mp4.
  const noMaster = await stream.getStream({ link: "dQw4w9WgXcQ", type: "movie", signal: undefined, providerContext: { ...sctx2, axios: { get: sctx2.axios.get, post: async (u, b) => b.context.client.clientName === "VISIONOS" ? { data: {} } : sctx2.axios.post(u, b) } } });
  assert.deepStrictEqual(noMaster.map((s) => s.type), ["mp4"]);

  console.log("youtube flow tests passed");
})().catch((e) => { console.error(e); process.exit(1); });
