const path = require("path");
const { providerContext } = require("./provider-test-context");
const dist = (p, m) => require(path.join(__dirname, "..", "dist", p, `${m}.js`));

(async () => {
  const meta = dist("hdmovieslife", "meta");
  const stream = dist("hdmovieslife", "stream");
  const detail = "https://hdmovies.life/movie/the-odyssey-2026";
  const info = await meta.getMeta({ link: detail, providerContext });
  console.log("linkList:", JSON.stringify(info.linkList, null, 2).slice(0, 2000));

  const direct = info.linkList?.[0]?.directLinks?.[0];
  if (direct) {
    console.log("direct link:", direct.link);
    const result = await stream.getStream({
      link: direct.link,
      type: "movie",
      signal: new AbortController().signal,
      providerContext,
    });
    console.log("streams:", JSON.stringify(result, null, 2));
    for (const s of result) {
      const res = await providerContext.axios.get(s.link, {
        headers: providerContext.commonHeaders,
        maxRedirects: 0,
        validateStatus: () => true,
        timeout: 20000,
      }).catch((e) => ({ status: "ERR " + e.message }));
      console.log("verify", s.link.slice(0, 120), "->", res.status, res.headers?.["content-type"], res.headers?.location?.slice?.(0, 120));
    }
  }
})();
