// Run after npm run build. Live services can fail independently of the parser.
const assert = require("node:assert/strict");
const { providerContext } = require("./provider-test-context");
const context = {
  ...providerContext,
  commonHeaders: {
    "User-Agent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  },
};
const samples = {
  "1tamilmv": [0, 4, "scene"],
  "1tamilblasters": [0, 0, "jailer"],
  hdmovieslife: [0, 1, "jailer"],
};

async function probe(stream, method) {
  const headers = { ...stream.headers };
  if (method === "GET") headers.Range = "bytes=0-511";
  const response = await context.axios.request({
    method,
    url: stream.link,
    headers,
    responseType: "stream",
    signal: AbortSignal.timeout(12_000),
    validateStatus: () => true,
  });
  try {
    let prefix = "";
    if (method === "GET") {
      for await (const chunk of response.data) {
        prefix = chunk.subarray(0, 16).toString();
        break;
      }
    }
    console.log(method === "GET" ? "Range" : "HEAD", response.status,
      response.headers["content-type"], response.headers["content-range"] || "",
      prefix.startsWith("#EXTM3U") ? "HLS playlist" : "");
    return method === "GET" && response.status < 300 &&
      (prefix.startsWith("#EXTM3U") || /^video\//i.test(response.headers["content-type"] || ""));
  } finally {
    response.data.destroy();
  }
}

async function run(id, [homeIndex, seriesIndex, searchQuery]) {
  const load = (file) => require(`../dist/${id}/${file}.js`);
  const { catalog } = load("catalog");
  const { getPosts, getSearchPosts } = load("posts");
  const { getMeta } = load("meta");
  const { getEpisodes } = load("episodes");
  const { getStream } = load("stream");
  const args = { providerValue: id, providerContext: context, page: 1 };
  const step = async (label, fn, check) => {
    try {
      const started = Date.now();
      const value = await fn({ ...args, signal: AbortSignal.timeout(35_000) });
      const description = check(value);
      console.log(id, label, Date.now() - started, "ms:", description);
      return value;
    } catch (error) {
      process.exitCode = 1;
      console.error(id, label, error.message);
    }
  };
  const rows = (list) => {
    assert(list.length > 0, "empty list");
    assert(list.every((row) => row.title && /^https?:/.test(row.link)));
    return `${list.length} (${list[0].title})`;
  };
  await step("catalog", () => catalog, (list) => {
    assert(list.length > 0 && list.every((entry) => entry.title && entry.filter));
    return list.length;
  });
  const home = await step("home", (a) => getPosts({ ...a, filter: catalog[homeIndex].filter }), rows);
  const search = await step("search", (a) => getSearchPosts({ ...a, searchQuery }), rows);
  const movie = id === "hdmovieslife" ? search?.[0] : id === "1tamilmv"
    ? home?.find((row) => /^Scene \(/i.test(row.title)) || home?.[0]
    : home?.[0];
  const detail = movie && await step("meta", (a) => getMeta({ ...a, link: movie.link }), (info) => {
    assert(info.title && info.linkList.some((group) => group.directLinks?.length));
    if (id === "1tamilblasters") {
      assert(info.synopsis.length > 80);
      assert(!/^movie name\s*:/i.test(info.synopsis));
    }
    return `${info.title}, ${info.linkList.length} source group(s)`;
  });
  const sources = detail?.linkList[0]?.directLinks || [];
  if (sources.length) {
    await step("stream", async (a) => {
      let playable = 0;
      for (const source of sources.slice(0, 2)) {
        try {
          const streams = await getStream({ ...a, link: source.link, type: "movie" });
          assert(streams.length > 0, "no stream");
          for (const stream of streams) {
            console.log(id, stream.downloadOnly ? "download page" : stream.type, stream.link);
            const results = await Promise.allSettled(["HEAD", "GET"].map((method) => probe(stream, method)));
            for (const result of results) {
              if (result.status === "rejected") console.log("probe error:", result.reason.message);
            }
            const range = results[1];
            const confirmed = range.status === "fulfilled" && range.value;
            if (id === "hdmovieslife") assert.equal(stream.downloadOnly, true);
            if (confirmed && !stream.downloadOnly) playable++;
          }
        } catch (error) {
          console.error(id, "source", error.message);
          if (id === "hdmovieslife") throw error;
        }
      }
      if (id !== "hdmovieslife") assert(playable > 0, "no verified media responses");
      return playable;
    }, (count) => id === "hdmovieslife" ? "browser download only" : `${count} verified media response(s)`);
  }
  const episodes = await step("episodes", async (a) => {
    if (id === "hdmovieslife") {
      const series = await getMeta({ ...a, link: "https://hdmovies.life/series/stranger-things-2016" });
      const pack = series.linkList.find((group) => group.episodesLink);
      assert(pack, "no season pack");
      return getEpisodes({ ...a, url: pack.episodesLink });
    }
    const seriesRows = id === "1tamilblasters" ? home :
      await getPosts({ ...a, filter: catalog[seriesIndex].filter });
    const candidates = id === "1tamilblasters"
      ? (seriesRows || []).filter((row) => /\bS\d{2}\b/.test(row.title))
      : (seriesRows || []);
    for (const row of candidates.slice(0, 4)) {
      const result = await getEpisodes({ ...a, url: row.link });
      if (result.length) return result;
    }
    return [];
  }, rows);
  if (id === "hdmovieslife" && episodes?.length) {
    await step("episode download", (a) => getStream({ ...a, link: episodes[0].link, type: "series" }), (list) => {
      assert(list.length && list.every((source) => source.downloadOnly));
      return list.length;
    });
  }
}

const ids = process.argv.slice(2);
Promise.all((ids.length ? ids : Object.keys(samples)).map((id) => run(id, samples[id])))
  .catch((error) => { console.error(error.message); process.exitCode = 1; });
