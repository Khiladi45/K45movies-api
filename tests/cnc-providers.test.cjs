// Offline checks for the seven NetMirror/CNC studio providers: each bundle must
// route requests to its own backend path, session scope and home trays.
const assert = require("assert");
const path = require("path");
const cheerio = require("cheerio");

const EXPECTED = {
  netflix: { path: "/mobile/search.php", ott: "nf", studio: null, prefix: "", trays: ["K-Dramas", "Only on Netflix"] },
  primeVideo: { path: "/mobile/pv/search.php", ott: "pv", studio: null, prefix: "pv", trays: ["Top Movies", "Romance Series"] },
  hotstar: { path: "/mobile/hs/search.php", ott: "hs", studio: null, prefix: "hs", trays: ["Korean", "Hotstar Specials"] },
  disneyPlus: { path: "/mobile/hs/search.php", ott: "dp", studio: "disney", prefix: "hs", trays: ["Walt Disney Animation Studios", "Princesses & Fairy Tales"] },
  pixar: { path: "/mobile/hs/search.php", ott: "dp", studio: "pixar", prefix: "hs", trays: ["Pixar Movies", "Toy Story"] },
  starWars: { path: "/mobile/hs/search.php", ott: "dp", studio: "starwars", prefix: "hs", trays: ["Movies", "The Darth Vader Collection"] },
  marvel: { path: "/mobile/hs/search.php", ott: "dp", studio: "marvel", prefix: "hs", trays: ["MCU Movie Timeline", "Marvel Legacy Movies"] },
};

const htmlFor = (trays) =>
  `<html><body>${trays
    .map(
      (title, t) =>
        `<div class="tray-container"><h2>${title}</h2>${[0, 1]
          .map(
            (i) =>
              `<article><a href="/mobile/post.php?id=${encodeURIComponent(title + "-" + i)}" data-post="${title}-${i}"><img data-src="https://img/${title}-${i}.jpg" alt="${title} #${i}"></a></article>`
          )
          .join("")}</div>`
    )
    .join("")}</body></html>`;

const makeContext = (requests) => {
  const kv = new Map();
  const context = {
    cheerio,
    commonHeaders: {},
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
    axios: {
      get: async (url, opts = {}) => {
        requests.push({ url, cookie: opts.headers?.Cookie || "" });
        if (url.includes("/mobile/home")) {
          const cookie = opts.headers?.Cookie || "";
          const studio = /studio=([a-z]+)/.exec(cookie)?.[1];
          const ott = /ott=([a-z]+)/.exec(cookie)?.[1] || "nf";
          const key = studio ? `${ott}:${studio}` : ott;
          const spec = Object.entries(EXPECTED)
            .map(([id, value]) => ({ id, value }))
            .find(({ value }) => (value.studio ? `${value.ott}:${value.studio}` : value.ott) === key);
          return { data: htmlFor(spec ? spec.value.trays : ["Home"]) };
        }
        if (url.includes("post.php")) {
          const id = decodeURIComponent(new URL(url).searchParams.get("id") || "");
          return { data: { title: id.replace(/-\d+$/, "") } };
        }
        if (url.includes("search.php")) {
          const query = new URL(url).searchParams.get("s") || "";
          return { data: { searchResult: [{ id: `search-${query}`, t: `Result for ${query}`, y: "2026" }] } };
        }
        throw new Error(`unexpected request ${url}`);
      },
    },
  };
  return { context, kv };
};

(async () => {
  let assertions = 0;
  const seenFirstTrays = new Map();

  for (const [id, expected] of Object.entries(EXPECTED)) {
    const bundle = require(path.join(__dirname, "..", "bundled", `${id}.js`));
    for (const fn of ["catalog", "getPosts", "getSearchPosts", "getMeta", "getEpisodes", "getStream"]) {
      assert.strictEqual(typeof bundle[fn], "function", `${id} must export ${fn}`);
      assertions++;
    }

    const requests = [];
    const { context, kv } = makeContext(requests);
    kv.set(`t_hash_t_${expected.ott}`, { token: "test-token", ts: Date.now() });

    const catalog = await bundle.catalog({ providerContext: context });
    assert.deepStrictEqual(catalog.map((c) => c.title), expected.trays, `${id} catalog trays`);
    assertions++;
    const first = catalog[0].title;
    if (!seenFirstTrays.has(first)) seenFirstTrays.set(first, id);
    else assert.fail(`${id} shares its first home tray "${first}" with ${seenFirstTrays.get(first)}`);

    const posts = await bundle.getPosts({
      filter: catalog[1].title,
      page: 1,
      providerValue: id,
      signal: new AbortController().signal,
      providerContext: context,
    });
    assert.ok(posts.length > 0, `${id} getPosts returned items`);
    assert.ok(
      posts.every((p) => p.link.split("|")[1] === expected.prefix),
      `${id} links carry prefix "${expected.prefix}": ${posts[0].link}`
    );
    assert.ok(posts.every((p) => p.title.startsWith(expected.trays[1])), `${id} posts belong to the requested tray`);
    assertions += 2;

    const search = await bundle.getSearchPosts({
      searchQuery: "office",
      page: 1,
      providerValue: id,
      signal: new AbortController().signal,
      providerContext: context,
    });
    assert.strictEqual(search[0]?.title, "Result for office", `${id} search result`);
    assertions++;

    const searchReq = requests.find((r) => r.url.includes("search.php"));
    assert.ok(searchReq.url.includes(expected.path), `${id} uses ${expected.path} (got ${searchReq.url})`);
    assert.ok(searchReq.cookie.includes(`ott=${expected.ott}`), `${id} sends ott=${expected.ott}`);
    if (expected.studio) assert.ok(searchReq.cookie.includes(`studio=${expected.studio}`), `${id} sends studio=${expected.studio}`);
    assertions += 2;

    console.log(`PASS ${id}: trays=${catalog.length}, posts=${posts.length}, ${expected.path}, ott=${expected.ott}${expected.studio ? `, studio=${expected.studio}` : ""}`);
  }

  console.log(`\n✅ ${assertions} assertions passed across 7 providers`);
})().catch((error) => {
  console.error("FAIL", error);
  process.exit(1);
});
