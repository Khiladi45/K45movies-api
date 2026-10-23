// Non-interactive trace: search -> meta -> stream for a provider,
// timing each stage. Usage: node tests/trace-stream.cjs <provider> [query]
const path = require("path");
const { providerContext } = require("./provider-test-context");

const providerName = process.argv[2] || "vega";
const query = process.argv[3] || "avatar";

const load = (file) => {
  try {
    return require(path.join(__dirname, "..", "dist", providerName, file));
  } catch (e) {
    console.log(`LOAD FAIL ${file}: ${e.message}`);
    return {};
  }
};

const fmtStream = (s) => ({
  server: s.server,
  type: s.type,
  quality: s.quality,
  link: String(s.link).slice(0, 110),
  headers: s.headers ? Object.keys(s.headers) : [],
  subtitles: s.subtitles
    ? Array.isArray(s.subtitles)
      ? s.subtitles.length
      : Object.keys(s.subtitles).length
    : 0,
});

(async () => {
  const t0 = Date.now();
  const posts = load("posts.js");
  const meta = load("meta.js");
  const stream = load("stream.js");

  let t = Date.now();
  const searchResults = await posts.getSearchPosts({
    searchQuery: query,
    page: 1,
    providerValue: providerName,
    signal: new AbortController().signal,
    providerContext,
  });
  console.log(
    `SEARCH ${Date.now() - t}ms -> ${searchResults?.length} results`,
  );
  const first = searchResults?.[0];
  if (!first?.link) {
    console.log("NO RESULTS - aborting trace");
    process.exit(2);
  }
  console.log("FIRST:", first.title, first.link);

  t = Date.now();
  const info = await meta.getMeta({ link: first.link, providerContext });
  console.log(`META ${Date.now() - t}ms -> type=${info?.type} title=${info?.title}`);

  const directLinks =
    info?.linkList?.flatMap((l) => l.directLinks || []) || [];
  const target =
    directLinks.find((d) => d.type === "movie") || directLinks[0];
  if (!target?.link) {
    console.log("NO DIRECT LINKS - aborting trace");
    console.log(JSON.stringify(info?.linkList?.slice(0, 2), null, 1)?.slice(0, 500));
    process.exit(3);
  }
  console.log("STREAM LINK:", target.link, "type:", target.type);

  t = Date.now();
  const streams = await stream.getStream({
    link: target.link,
    type: target.type || "movie",
    signal: new AbortController().signal,
    providerContext,
    isDownload: false,
  });
  console.log(`STREAM ${Date.now() - t}ms -> ${streams?.length} streams`);
  (streams || []).slice(0, 6).forEach((s, i) => console.log(i, JSON.stringify(fmtStream(s))));
  console.log(`TOTAL ${Date.now() - t0}ms`);
})().catch((e) => {
  console.log("TRACE FAILED:", e?.message);
  process.exit(1);
});
