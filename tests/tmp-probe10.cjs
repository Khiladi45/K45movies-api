const { providerContext } = require("./provider-test-context");
const cheerio = require("cheerio");

(async () => {
  const { axios, commonHeaders } = providerContext;
  const get = async (u) => {
    try {
      return { ok: true, res: await axios.get(u, { headers: commonHeaders }) };
    } catch (e) {
      return { ok: false, err: e.message, status: e.response?.status };
    }
  };

  // TB search HTML
  for (const u of [
    "https://www.1tamilblasters.blog/?s=jailer",
    "https://www.1tamilblasters.blog/search/jailer/",
  ]) {
    const r = await get(u);
    console.log("\nTB search", u, r.ok ? "OK " + r.res.status : "ERR " + r.err);
    if (r.ok) {
      const $ = cheerio.load(r.res.data);
      console.log(" title:", $("title").text().trim(), "articles:", $("article").length, "links:", $("article h2 a").length);
      $("article h2 a").slice(0, 3).each((i, el) => console.log("  ", $(el).text().trim(), "=>", $(el).attr("href")));
    }
  }

  // TB REST with embed
  const rr = await get("https://www.1tamilblasters.blog/wp-json/wp/v2/posts?search=jailer&per_page=5&_embed=1");
  if (rr.ok) {
    const data = rr.res.data;
    console.log("\nTB REST embed type", typeof data, Array.isArray(data) ? data.length : "obj");
    if (Array.isArray(data)) console.log(data.slice(0, 2).map((p) => ({ t: p.title?.rendered, m: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url })));
  } else console.log("\nTB REST embed ERR", rr.err);

  // TB post h1 + iframes labels
  const post = await get("https://www.1tamilblasters.blog/jailer-2-2026-telugu-2/");
  if (post.ok) {
    const $ = cheerio.load(post.res.data);
    console.log("\nTB post h1s:", $("h1").map((i, el) => $(el).text().trim()).get());
    console.log("og:title:", $("meta[property='og:title']").attr("content"));
    console.log("entry-title:", $(".entry-title").first().text().trim());
    console.log("img first:", $("article img").first().attr("src"));
    console.log("content imgs:", $(".entry-content img").map((i, el) => $(el).attr("src")).get().slice(0, 5));
    console.log("players:", $(".entry-content p").filter((i, el) => /^Player|^Episode/i.test($(el).text().trim())).map((i, el) => $(el).text().trim()).get().slice(0, 6));
  }

  // hgcloud player
  for (const u of ["https://hgcloud.to/e/ccfdbhhw4r6s", "https://lulust.com/e/4epdx4zse7da"]) {
    const r = await get(u);
    if (!r.ok) { console.log("\nPLYR ERR", u, r.err); continue; }
    const html = String(r.res.data || "");
    console.log("\nPLYR", u, "status", r.res.status, "len", html.length, "packed", html.includes("eval(function(p,a,c,k"));
    const $ = cheerio.load(html);
    console.log(" title:", $("title").text().trim().slice(0, 120));
    console.log(" iframe:", $("iframe").map((i, el) => $(el).attr("src")).get().slice(0, 3));
    const m = html.match(/(?:file|src)\s*:\s*["']([^"']*(?:\.m3u8|\.mp4|\.mkv)[^"']*)["']/i);
    console.log(" file:", m?.[1] || "none");
  }

  // HDM quality page + genres
  for (const u of ["https://hdmovies.life/quality/1080p+FHD", "https://hdmovies.life/quality/4K+UHD", "https://hdmovies.life/genre/action"]) {
    const r = await get(u);
    console.log("\nHDM", u, r.ok ? "OK " + r.res.status : "ERR " + r.err);
    if (r.ok) {
      const $ = cheerio.load(r.res.data);
      console.log(" title:", $("title").text().trim(), "cards:", $(".movie-card").length, "first:", $(".movie-title a").first().text().trim());
    }
  }
})();
