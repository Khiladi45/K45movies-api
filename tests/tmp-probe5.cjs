const axios = require("axios");
const cheerio = require("cheerio");

const H = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9",
};
const c = axios.create({ headers: H, timeout: 30000, maxRedirects: 5 });

const show = (label, v) => console.log("\n### " + label + "\n" + v);

async function tbCat() {
  const r = await c.get("https://www.1tamilblasters.blog/tamil-movies-2026/");
  const $ = cheerio.load(r.data);
  show("TB cat title", $("title").text());
  // find article containers
  const articles = $("article, .post, .entry, .blog-post").slice(0, 3);
  show("TB article count", $("article").length);
  $("article").slice(0, 2).each((i, el) => {
    show("TB article html[" + i + "]", $(el).html()?.slice(0, 1200));
  });
  show(
    "TB all links sample",
    $("a[href]")
      .map((i, el) => $(el).attr("href") + " | " + $(el).text().trim().slice(0, 70))
      .get()
      .filter((s) => /2026|movie/i.test(s))
      .slice(0, 25)
      .join("\n"),
  );
  show("TB pagination", $("a.page-numbers, .nav-links a, .pagination a").map((i, el) => $(el).attr("href")).get().join("\n"));
  const r2 = await c.get("https://www.1tamilblasters.blog/tamil-movies-2026/page/2/");
  show("TB page2 status", r2.status + " title:" + cheerio.load(r2.data)("title").text());
}

async function tbRest() {
  const r = await c.get(
    "https://www.1tamilblasters.blog/wp-json/wp/v2/posts?search=jailer&_embed=1&per_page=5",
  );
  show("TB REST total pages", r.headers["x-wp-totalpages"] + " total:" + r.headers["x-wp-total"]);
  (r.data || []).slice(0, 2).forEach((p) => {
    console.log({
      id: p.id,
      date: p.date,
      title: p.title?.rendered,
      link: p.link,
      jetpack: p.jetpack_featured_media_url,
      media: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
      cats: p._embedded?.["wp:term"]?.[0]?.map((t) => t.name).slice(0, 5),
    });
  });
  const r2 = await c.get(
    "https://www.1tamilblasters.blog/wp-json/wp/v2/posts?categories=418&per_page=3&_embed=1",
  );
  show("TB REST cat tamil-movies-2026 count", (r2.data || []).length);
  (r2.data || []).slice(0, 1).forEach((p) => console.log({ link: p.link, media: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url }));
}

async function tbPost() {
  const url = "https://www.1tamilblasters.blog/jailer-2-2026-telugu-2/";
  const r = await c.get(url);
  const $ = cheerio.load(r.data);
  show("TB post title", $("title").text());
  show("TB h1s", $("h1").map((i, el) => $(el).text().trim()).get().join("\n"));
  show("TB content h2/h3", $(".entry-content h2, .entry-content h3, article h2, article h3").map((i, el) => $(el).text().trim()).get().slice(0, 12).join("\n"));
  show("TB iframes", $("iframe").map((i, el) => $(el).attr("src")).get().join("\n"));
  show("TB download buttons", $("a[href]").map((i, el) => {
    const t = $(el).text().trim().replace(/\s+/g, " ").slice(0, 80);
    const h = $(el).attr("href");
    if (/download|720|1080|480|2160|watch/i.test(t) || /\.(mkv|mp4)|files\//i.test(h || "")) return t + " => " + h;
  }).get().slice(0, 40).join("\n"));
  show("TB og:image", $("meta[property='og:image']").attr("content"));
  show("TB post content snippet", ($(".entry-content").html() || "").slice(0, 3500));
}

async function hdmList() {
  const r = await c.get("https://hdmovies.life/movies");
  const $ = cheerio.load(r.data);
  const anchors = $("a[href*='/movie/'], a[href*='/series/']");
  show("HDM anchors count", anchors.length);
  anchors.slice(0, 6).each((i, el) => {
    const a = $(el);
    show(
      "HDM a[" + i + "]",
      "href=" + a.attr("href") + "\n  img=" + (a.find("img").attr("src") || a.find("img").attr("data-src") || "") + "\n  text=" + a.text().trim().replace(/\s+/g, " ").slice(0, 90) + "\n  html=" + a.html()?.slice(0, 500),
    );
  });
  show("HDM pagination rel", $("link[rel=next]").attr("href"));
  // check card wrapper classes
  show("HDM article/div class sample", $("article, .card, .movie, [class*=item], [class*=card]").map((i, el) => $(el).attr("class")).get().slice(0, 30).join(" | "));
}

async function hdmDetail() {
  for (const url of ["https://hdmovies.life/movie/the-odyssey-2026", "https://hdmovies.life/series/visionquest-2026"]) {
    const r = await c.get(url);
    const $ = cheerio.load(r.data);
    show("HDM detail " + url + " title", $("title").text());
    show("HDM h1", $("h1").map((i, el) => $(el).text().trim()).get().join("\n"));
    show(
      "HDM detail links",
      $("a[href]")
        .map((i, el) => {
          const h = $(el).attr("href");
          const t = $(el).text().trim().replace(/\s+/g, " ").slice(0, 60);
          if (/download|480|720|1080|2160|server|form|link/i.test(t) || /download|link|file|hub|cloud|drive/i.test(h || ""))
            return t + " => " + h;
        })
        .get()
        .slice(0, 40)
        .join("\n"),
    );
    show("HDM forms", $("form").map((i, el) => $(el).html()?.replace(/\s+/g, " ").slice(0, 900)).get().join("\n----\n"));
    show("HDM og:image", $("meta[property='og:image']").attr("content"));
    show("HDM quality anchors", $("a[href*='quality/']").map((i, el) => $(el).text().trim() + " => " + $(el).attr("href")).get().join("\n"));
    show("HDM series episodes", $("a[href*='/episode']").map((i, el) => $(el).text().trim() + " => " + $(el).attr("href")).get().slice(0, 10).join("\n"));
  }
}

async function hdmSearch() {
  for (const q of ["odyssey", "visionquest"]) {
    const r = await c.get("https://hdmovies.life/search?q=" + q);
    const $ = cheerio.load(r.data);
    show("HDM search " + q + " status", r.status + " anchors:" + $("a[href*='/movie/'], a[href*='/series/']").length);
    show("HDM search hits", $("a[href*='/movie/'], a[href*='/series/']").slice(0, 6).map((i, el) => $(el).attr("href") + " | " + $(el).text().trim().replace(/\s+/g, " ").slice(0, 60)).get().join("\n"));
  }
}

(async () => {
  for (const fn of [tbCat, tbRest, tbPost, hdmList, hdmSearch, hdmDetail]) {
    try {
      await fn();
    } catch (e) {
      console.log("ERR " + fn.name + ": " + e.message);
    }
  }
})();
