const path = require("path");
const { providerContext } = require("./provider-test-context");

const dist = (provider, module) =>
  require(path.join(__dirname, "..", "dist", provider, `${module}.js`));

const signal = () => new AbortController().signal;

async function run(name, fn) {
  const started = Date.now();
  try {
    const result = await fn();
    const ms = Date.now() - started;
    console.log(`\n=== ${name} OK (${ms}ms) ===`);
    console.log(JSON.stringify(result, null, 2).slice(0, 3000));
    return result;
  } catch (err) {
    console.log(`\n=== ${name} FAILED (${Date.now() - started}ms) ===`);
    console.log(err?.stack || err?.message || err);
    return null;
  }
}

(async () => {
  const tbPosts = dist("1tamilblasters", "posts");
  const tbMeta = dist("1tamilblasters", "meta");
  const tbStream = dist("1tamilblasters", "stream");
  const hdmPosts = dist("hdmovieslife", "posts");
  const hdmMeta = dist("hdmovieslife", "meta");
  const hdmStream = dist("hdmovieslife", "stream");
  const hdmEpisodes = dist("hdmovieslife", "episodes");

  const tb = await run("TB getPosts home", () =>
    tbPosts.getPosts({
      filter: "/",
      page: 1,
      providerValue: "1tamilblasters",
      signal: signal(),
      providerContext,
    }),
  );
  await run("TB getSearchPosts jailer", () =>
    tbPosts.getSearchPosts({
      searchQuery: "jailer",
      page: 1,
      providerValue: "1tamilblasters",
      signal: signal(),
      providerContext,
    }),
  );
  const tbDetail =
    "https://www.1tamilblasters.blog/jailer-2-2026-tamil-2/";
  const tbInfo = await run("TB getMeta", () =>
    tbMeta.getMeta({ link: tbDetail, providerContext }),
  );
  if (tbInfo?.linkList?.length) {
    await run("TB getStream watch", () =>
      tbStream.getStream({
        link: tbInfo.linkList[0].directLinks[0].link,
        type: "movie",
        signal: signal(),
        providerContext,
      }),
    );
    const downloadList = tbInfo.linkList.find((l) => l.title === "Download");
    if (downloadList?.directLinks?.[0]) {
      await run("TB getStream download", () =>
        tbStream.getStream({
          link: downloadList.directLinks[0].link,
          type: "movie",
          signal: signal(),
          providerContext,
        }),
      );
    }
  }

  const hdm = await run("HDM getPosts movies", () =>
    hdmPosts.getPosts({
      filter: "/movies",
      page: 1,
      providerValue: "hdmovieslife",
      signal: signal(),
      providerContext,
    }),
  );
  await run("HDM getSearchPosts jailer", () =>
    hdmPosts.getSearchPosts({
      searchQuery: "jailer",
      page: 1,
      providerValue: "hdmovieslife",
      signal: signal(),
      providerContext,
    }),
  );
  const hdmDetail = "https://hdmovies.life/movie/jailer-2-2026";
  const hdmInfo = await run("HDM getMeta movie", () =>
    hdmMeta.getMeta({ link: hdmDetail, providerContext }),
  );
  if (hdmInfo?.linkList?.[0]?.directLinks?.[0]) {
    await run("HDM getStream movie page", () =>
      hdmStream.getStream({
        link: hdmDetail,
        type: "movie",
        signal: signal(),
        providerContext,
      }),
    );
    await run("HDM getStream direct link", () =>
      hdmStream.getStream({
        link: hdmInfo.linkList[0].directLinks[0].link,
        type: "movie",
        signal: signal(),
        providerContext,
      }),
    );
  }
  const hdmSeries = "https://hdmovies.life/series/stranger-things-2016";
  const hdmSeriesInfo = await run("HDM getMeta series", () =>
    hdmMeta.getMeta({ link: hdmSeries, providerContext }),
  );
  const pack = hdmSeriesInfo?.linkList?.find((l) => l.episodesLink);
  if (pack) {
    await run("HDM getEpisodes pack", () =>
      hdmEpisodes.getEpisodes({
        url: pack.episodesLink,
        providerValue: "hdmovieslife",
        signal: signal(),
        providerContext,
      }),
    );
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
