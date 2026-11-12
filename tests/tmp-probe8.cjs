const { providerContext } = require("./provider-test-context");
const cheerio = require("cheerio");

(async () => {
  const { axios } = providerContext;

  // 1. TB REST latest
  for (const u of [
    "https://www.1tamilblasters.blog/wp-json/wp/v2/posts?per_page=18&page=1&_embed=1",
    "https://www.1tamilblasters.blog/wp-json/wp/v2/posts?categories=1756&per_page=18&page=1&_embed=1",
    "https://www.1tamilblasters.blog/wp-json/wp/v2/posts?search=scene&per_page=10&_embed=1",
    "https://www.1tamilblasters.blog/wp-json/wp/v2/posts?categories=1756&per_page=18&page=2&_embed=1",
  ]) {
    try {
      const r = await axios.get(u, { headers: providerContext.commonHeaders });
      const data = JSON.parse(r.data);
      console.log("\nOK", u.replace("https://www.1tamilblasters.blog", ""), "status", r.status, "n", data.length, "totalpages", r.headers["x-wp-totalpages"]);
      console.log(
        data.slice(0, 3).map((p) => ({
          t: p.title?.rendered,
          link: p.link,
          img: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
        })),
      );
    } catch (e) {
      console.log("\nERR", u, e.message);
    }
  }

  // 2. TB post page
  try {
    const r = await axios.get("https://www.1tamilblasters.blog/jailer-2-2026-telugu-2/", { headers: providerContext.commonHeaders });
    const $ = cheerio.load(r.data);
    console.log("\nTB post status", r.status, "title", $("h1").first().text().trim(), "| iframes", $("iframe").length, "| imgs", $("article img").length);
    console.log("og:image", $("meta[property='og:image']").attr("content"));
  } catch (e) {
    console.log("\nTB post ERR", e.message);
  }

  // 3. HDM list
  try {
    const r = await axios.get("https://hdmovies.life/movies/page/2", { headers: providerContext.commonHeaders });
    const $ = cheerio.load(r.data);
    console.log("\nHDM page2 status", r.status, "cards", $(".movie-card").length, "title", $(".movie-card .movie-title a").first().text().trim());
  } catch (e) {
    console.log("\nHDM list ERR", e.message);
  }
})();
