// Fixture tests for providers/youtube/parse.ts (run: node tests/youtube-parse.test.cjs)
const assert = require("assert");
const path = require("path");
const esbuild = require("esbuild");
const out = path.join(require("os").tmpdir(), "yt-parse.cjs");
esbuild.buildSync({
  entryPoints: [path.join(__dirname, "../providers/youtube/parse.ts")],
  bundle: true, platform: "node", format: "cjs", outfile: out, logLevel: "silent",
});
const p = require(out);

const video = {
  videoRenderer: {
    videoId: "dQw4w9WgXcQ",
    title: { runs: [{ text: "Never Gonna Give You Up" }] },
    ownerText: { runs: [{ text: "Rick Astley" }] },
    channelThumbnailSupportedRenderers: { channelThumbnailWithLinkRenderer: { thumbnail: { thumbnails: [{ url: "//yt3/a.jpg", width: 48 }] } } },
    shortViewCountText: { simpleText: "1.5B views" },
    publishedTimeText: { simpleText: "14 years ago" },
    lengthText: { simpleText: "3:33" },
    thumbnail: { thumbnails: [{ url: "https://i.ytimg.com/x.jpg", width: 360 }] },
    thumbnailOverlays: [{ thumbnailOverlayTimeStatusRenderer: { style: "DEFAULT", text: { simpleText: "3:33" } } }],
  },
};
const short = { reelItemRenderer: { videoId: "abcdefghijk", headline: { simpleText: "Cool short" }, viewCountText: { simpleText: "2.1M views" }, thumbnail: { thumbnails: [{ url: "https://i.ytimg.com/s.jpg", width: 405 }] } } };
const lockup = { lockupViewModel: { contentType: "LOCKUP_CONTENT_TYPE_VIDEO", contentId: "zzzzzzzzzzz", metadata: { lockupMetadataViewModel: { title: { content: "Lockup vid" }, metadata: { contentMetadataViewModel: { metadataRows: [{ metadataParts: [{ text: { content: "Some Channel" } }] }, { metadataParts: [{ text: { content: "10K views" } }, { text: { content: "2 days ago" } }] }] } } } }, contentImage: { thumbnailViewModel: { overlays: [{ thumbnailBottomOverlayViewModel: { badges: [{ thumbnailBadgeViewModel: { text: "14:20" } }] } }] } } } };
const data = { a: [video, short, lockup] };

const vids = p.collectVideos(data, "videos");
assert.strictEqual(vids.length, 2, "shelf Shorts excluded in videos mode");
const v = vids[0];
assert.strictEqual(v.channelName, "Rick Astley");
assert.strictEqual(v.channelAvatar, "https://yt3/a.jpg");
assert.strictEqual(v.views, "1.5B views");
assert.strictEqual(v.publishedTime, "14 years ago");
assert.strictEqual(v.duration, "3:33");
assert.strictEqual(v.aspectRatio, 16 / 9);
const l = vids[1];
assert.deepStrictEqual([l.channelName, l.views, l.publishedTime, l.duration], ["Some Channel", "10K views", "2 days ago", "14:20"]);

const shorts = p.collectVideos(data, "shorts");
assert.strictEqual(shorts.length, 1);
assert.strictEqual(shorts[0].aspectRatio, 9 / 16);
assert.ok(shorts[0].link.includes("/shorts/"));
assert.strictEqual(shorts[0].isShort, true);

assert.ok(p.isShortsQuery("#shorts trending"));
assert.ok(!p.isShortsQuery("football shorts"));
assert.strictEqual(p.normalizeViews("1,234,567 views"), "1.2M views");
assert.strictEqual(p.relativeTime("2026-11-02T00:00:00Z", Date.parse("2026-11-04T00:00:00Z")), "2 days ago");


// ---- continuation paging --------------------------------------------------
const contItem = (token) => ({ continuationItemRenderer: { continuationEndpoint: { continuationCommand: { token } } } });
const vr = (id, title) => ({ videoRenderer: { videoId: id, title: { simpleText: title }, ownerText: { simpleText: "C" }, thumbnail: { thumbnails: [{ url: "https://i/x.jpg", width: 1 }] } } });
const firstPage = { contents: { sectionListRenderer: { contents: [{ itemSectionRenderer: { contents: [vr("aaaaaaaaaa1", "One"), vr("aaaaaaaaaa2", "Two")] } }, contItem("TOKEN_PAGE_2")] } } };
assert.strictEqual(p.extractContinuationToken(firstPage), "TOKEN_PAGE_2");
assert.strictEqual(p.extractContinuationToken({ a: 1 }), undefined);
const contResponse = { onResponseReceivedCommands: [{ appendContinuationItemsAction: { continuationItems: [{ itemSectionRenderer: { contents: [vr("bbbbbbbbbb1", "Three")] } }, contItem("TOKEN_PAGE_3")] } }] };
const parsedCont = p.parseContinuationResponse(contResponse, "videos");
assert.deepStrictEqual(parsedCont.posts.map((x) => x.videoId), ["bbbbbbbbbb1"]);
assert.strictEqual(parsedCont.continuation, "TOKEN_PAGE_3");
assert.strictEqual(p.parseContinuationResponse({ onResponseReceivedCommands: [{ appendContinuationItemsAction: { continuationItems: [{ itemSectionRenderer: { contents: [vr("cccccccccc1", "Last")] } }] } }] }, "videos").continuation, undefined);
const cfg = p.extractInnertubeConfig('..."INNERTUBE_API_KEY":"KEY123","INNERTUBE_CLIENT_VERSION":"2.20260102.01.00"...');
assert.deepStrictEqual([cfg.apiKey, cfg.clientVersion], ["KEY123", "2.20260102.01.00"]);
assert.strictEqual(p.extractInnertubeConfig("").apiKey, undefined);

// ---- suggestions ----------------------------------------------------------
assert.deepStrictEqual(p.parseSuggestions('["new",["new trailer","new song","new trailer"," "]]'), ["new trailer", "new song"]);
assert.deepStrictEqual(p.parseSuggestions(["q", ["a", "b", "c"]], 2), ["a", "b"]);
assert.deepStrictEqual(p.parseSuggestions("not json"), []);
assert.deepStrictEqual(p.parseSuggestions(null), []);

// ---- comments -------------------------------------------------------------
const watchData = { contents: { twoColumnWatchNextResults: { results: { results: { contents: [
  { itemSectionRenderer: { sectionIdentifier: "other", contents: [contItem("NOT_THIS")] } },
  { itemSectionRenderer: { sectionIdentifier: "comment-item-section", contents: [contItem("COMMENTS_TOKEN")] } },
] } } } } };
assert.strictEqual(p.extractCommentsToken(watchData), "COMMENTS_TOKEN");
assert.strictEqual(p.extractCommentsToken({ engagementPanels: [{ engagementPanelSectionListRenderer: { panelIdentifier: "engagement-panel-comments-section", content: { x: [contItem("PANEL_TOKEN")] } } }] }), "PANEL_TOKEN");
assert.strictEqual(p.extractCommentsToken({}), undefined);

const entity = (id, name, text, likes, replies) => ({ payload: { commentEntityPayload: { properties: { commentId: id, content: { content: text }, publishedTime: "2 wk ago" }, author: { displayName: name, avatarThumbnailUrl: "https://yt3/" + id + ".jpg" }, toolbar: { likeCountNotliked: likes, replyCount: replies } } } });
const newShape = {
  frameworkUpdates: { entityBatchUpdate: { mutations: [entity("c1", "@alice", "First!", "4.1K", "11"), entity("c2", "@bob", "Second", "", "")] } },
  onResponseReceivedEndpoints: [
    { reloadContinuationItemsCommand: { continuationItems: [{ commentsHeaderRenderer: { countText: { runs: [{ text: "6.5K" }, { text: " Comments" }] } } }] } },
    { reloadContinuationItemsCommand: { continuationItems: [
      { commentThreadRenderer: { commentViewModel: { commentViewModel: { commentId: "c1" } }, replies: { commentRepliesRenderer: { contents: [contItem("REPLY_TOKEN")] } } } },
      { commentThreadRenderer: { commentViewModel: { commentViewModel: { commentId: "c2" } } } },
      contItem("NEXT_COMMENTS"),
    ] } },
  ],
};
const pc = p.parseComments(newShape);
assert.deepStrictEqual(pc.comments.map((c) => [c.id, c.author, c.text, c.likes, c.replyCount, c.publishedTime]), [["c1", "@alice", "First!", "4.1K", "11", "2 wk ago"], ["c2", "@bob", "Second", "", "", "2 wk ago"]]);
assert.strictEqual(pc.comments[0].authorAvatar, "https://yt3/c1.jpg");
assert.strictEqual(pc.count, "6.5K");
assert.strictEqual(pc.continuation, "NEXT_COMMENTS", "reply tokens must not leak as the next page");

const oldShape = { onResponseReceivedEndpoints: [{ appendContinuationItemsAction: { continuationItems: [
  { commentThreadRenderer: { comment: { commentRenderer: { commentId: "o1", authorText: { simpleText: "@old" }, authorThumbnail: { thumbnails: [{ url: "//yt3/o.jpg", width: 48 }] }, contentText: { runs: [{ text: "Hello " }, { text: "world" }] }, publishedTimeText: { runs: [{ text: "1 mo ago" }] }, voteCount: { simpleText: "9" }, replyCount: 3 } } } },
] } }] };
const po = p.parseComments(oldShape);
assert.deepStrictEqual([po.comments[0].text, po.comments[0].author, po.comments[0].likes, po.comments[0].replyCount, po.comments[0].authorAvatar], ["Hello world", "@old", "9", "3", "https://yt3/o.jpg"]);
assert.strictEqual(po.continuation, undefined);
assert.deepStrictEqual(p.parseComments({}), { comments: [], count: "", continuation: undefined });

// ---- HLS variants ---------------------------------------------------------
const base = "https://manifest.googlevideo.com/api/manifest/hls_variant/x/index.m3u8";
const muxed = ["#EXTM3U",
  '#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1920x1080,CODECS="avc1.640028,mp4a.40.2"', "v1080.m3u8",
  '#EXT-X-STREAM-INF:BANDWIDTH=900000,RESOLUTION=1280x720', "https://cdn/v720.m3u8",
  '#EXT-X-STREAM-INF:BANDWIDTH=1100000,RESOLUTION=1280x720', "v720b.m3u8",
  '#EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=640x360', "v360.m3u8"].join("\n");
const mv = p.parseHlsVariants(muxed, base);
assert.deepStrictEqual(mv.map((v) => v.height), [1080, 720, 360]);
assert.ok(mv[0].url.endsWith("/hls_variant/x/v1080.m3u8"), "relative URL resolved against the master");
assert.strictEqual(mv[1].bandwidth, 1100000, "highest bandwidth wins per height");
assert.ok(mv.every((v) => v.separateAudio === false));
const sep = ["#EXTM3U",
  '#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="aud",NAME="en",URI="audio.m3u8"',
  '#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="noURI",NAME="x"',
  '#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1080x1920,AUDIO="aud"', "portrait.m3u8",
  '#EXT-X-STREAM-INF:BANDWIDTH=300000,RESOLUTION=426x240,AUDIO="noURI"', "v240.m3u8"].join("\n");
const sv = p.parseHlsVariants(sep, base);
assert.deepStrictEqual(sv.map((v) => [v.height, v.separateAudio]), [[1080, true], [240, false]], "portrait uses the short side; only groups with a URI count");
assert.deepStrictEqual(p.parseHlsVariants("", base), []);

console.log("youtube parse tests passed");

// --- replies: thread carries a reply token; a reply page parses bare view models
{
  const entity = (id, text) => ({ payload: { commentEntityPayload: { properties: { commentId: id, content: { content: text }, publishedTime: "2 wk ago" }, author: { displayName: "@u" + id }, toolbar: { likeCountNotliked: "4", replyCount: "1" } } } });
  const page = {
    frameworkUpdates: { entityBatchUpdate: { mutations: [entity("c1", "top comment")] } },
    onResponseReceivedEndpoints: [{ reloadContinuationItemsCommand: { continuationItems: [
      { commentThreadRenderer: { commentViewModel: { commentViewModel: { commentId: "c1" } }, replies: { commentRepliesRenderer: { contents: [{ continuationItemRenderer: { continuationEndpoint: { continuationCommand: { token: "REPLY_TOKEN" } } } }] } } } },
      { continuationItemRenderer: { continuationEndpoint: { continuationCommand: { token: "NEXT_PAGE" } } } },
    ] } }],
  };
  const top = p.parseComments(page);
  assert.strictEqual(top.comments.length, 1);
  assert.strictEqual(top.comments[0].replyToken, "REPLY_TOKEN");
  assert.strictEqual(top.continuation, "NEXT_PAGE");

  const replies = p.parseComments({
    frameworkUpdates: { entityBatchUpdate: { mutations: [entity("r1", "first reply"), entity("r2", "second reply")] } },
    onResponseReceivedEndpoints: [{ appendContinuationItemsAction: { continuationItems: [
      { commentViewModel: { commentViewModel: { commentId: "r1" } } },
      { commentViewModel: { commentViewModel: { commentId: "r2" } } },
      { continuationItemRenderer: { continuationEndpoint: { continuationCommand: { token: "MORE_REPLIES" } } } },
    ] } }],
  });
  assert.deepStrictEqual(replies.comments.map((c) => c.text), ["first reply", "second reply"]);
  assert.strictEqual(replies.continuation, "MORE_REPLIES");
  console.log("youtube replies tests passed");
}
