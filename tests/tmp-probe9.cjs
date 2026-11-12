const { providerContext } = require("./provider-test-context");
const cheerio = require("cheerio");

(async () => {
  const { axios, commonHeaders } = providerContext;
  const tryGet = async (u) => {
    try {
      const r = await axios.get(u, { headers: commonHeaders });
      return { status: r.status, data: r.data, headers: r.headers };
    } catch (e) {
      return { status: e.response?.status || 0, error: e.message };
    }
  };

  const tests = [
    "https://www.1tamilblasters.blog/category/tamil-movies/tamil-movies-2026/",
    "https://www.1tamilblasters.blog/category/tamil-movies/tamil-movies-2026/page/2/",
    "https://www.1tamilblasters.blog/page/2/",
    "https://www.1tamilblasters.blog/wp-json/wp/v2/posts?categories=1756&per_page=18",
    "https://www.1tamilblasters.blog/wp-json/wp/v2/posts?filter[cat]=1756&per_page=18",
    "https://www.1tamilblasters.blog/wp-json/wp/v2/posts?search=jailer&per_page=5",
  ];
  for (const u of tests) {
    const r = await tryGet(u);
    console.log("\n", r.status, u);
    if (typeof r.data === "string") {
      const $ = cheerio.load(r.data);
      console.log(" title:", $("title").text().trim());
      console.log(" articles:", $("article").length);
      const first = $("article").first();
      if (first.length) console.log(" first article html:", first.html()?.replace(/\s+/g, " ").slice(0, 700));
    } else if (r.data) {
      console.log(" json type:", typeof r.data, Array.isArray(r.data) ? "len " + r.data.length : Object.keys(r.data).slice(0, 6));
      if (Array.isArray(r.data)) console.log(" first:", r.data.slice(0, 2).map((p) => ({ t: p.title?.rendered, l: p.link, m: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url })));
    }
  }
})();
