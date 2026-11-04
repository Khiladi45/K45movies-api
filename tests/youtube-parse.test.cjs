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
console.log("youtube parse tests passed");
