const axios = require("axios");
const cheerio = require("cheerio");

const H = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
};
const c = axios.create({ headers: H, timeout: 30000, maxRedirects: 5 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const show = (l, v) => console.log("\n### " + l + "\n" + v);

async function get(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await c.get(url);
    } catch (e) {
      last = e;
      await sleep(1500);
    }
  }
  throw last;
}

async function tbCats() {
  const r = await get("https://www.1tamilblasters.blog/wp-json/wp/v2/categories?per_page=100");
  console.log(
    (r.data || [])
      .map((c) => `${c.id} ${c.slug} count=${c.count} link=${c.link}`)
      .join("\n"),
  );
  const home = await get("https://www.1tamilblasters.blog/");
  const $ = cheerio.load(home.data);
  show("TB home title", $("title").text());
  show(
    "TB home nav links",
    $("nav a[href], .menu a[href], header a[href]")
      .map((i, el) => $(el).text().trim().replace(/\s+/g, " ").slice(0, 40) + " => " + $(el).attr("href"))
      .get()
      .slice(0, 40)
      .join("\n"),
  );
  show(
    "TB home article links",
    $("article a[href]")
      .map((i, el) => $(el).text().trim().replace(/\s+/g, " ").slice(0, 70) + " => " + $(el).attr("href"))
      .get()
      .slice(0, 20)
      .join("\n"),
  );
}

async function tbPost() {
  const r = await get("https://www.1tamilblasters.blog/jailer-2-2026-telugu-2/");
  const $ = cheerio.load(r.data);
  const content = $(".entry-content").length ? $(".entry-content") : $("article");
  show("TB content children tags", content.find("h1,h2,h3,h4,p,iframe,a").map((i, el) => el.tagName + " | " + $(el).text().trim().replace(/\s+/g, " ").slice(0, 90) + " | " + ($(el).attr("href") || $(el).attr("src") || "")).get().join("\n").slice(0, 8000));
}

async function hdmForms() {
  const r = await get("https://hdmovies.life/movie/the-odyssey-2026");
  const $ = cheerio.load(r.data);
  $("form").each((i, el) => {
    const f = $(el);
    console.log(
      "form[" + i + "] action=" + f.attr("action") + " method=" + f.attr("method") + " class=" + f.attr("class") +
        " | inputs: " +
        f
          .find("input")
          .map((j, inp) => $(inp).attr("name") + "=" + String($(inp).attr("value")).slice(0, 40))
          .get()
          .join(" ; "),
    );
    const wrap = f.closest("[class]");
    console.log("  wrapper class=" + wrap.attr("class") + " text=" + wrap.text().trim().replace(/\s+/g, " ").slice(0, 160));
  });
  show("HDM downloads section html", ($("#downloads").html() || $("[id*=download]").first().html() || "").slice(0, 5000));
}

async function hdmCard() {
  const r = await get("https://hdmovies.life/movies");
  const $ = cheerio.load(r.data);
  show("HDM first card html", $(".movie-card").first().html()?.slice(0, 1500));
  show("HDM pagination html", $(".pagination, nav[class*=pag]").first().html()?.replace(/\s+/g, " ").slice(0, 1200));
  const next = $("a[href*='/movies/page/2']").attr("href");
  show("HDM next", next);
  const series = await get("https://hdmovies.life/series");
  const s$ = cheerio.load(series.data);
  show("HDM series card count", s$.length + " cards:" + s$(".movie-card").length);
  show("HDM series card 0", s$(".movie-card").first().html()?.slice(0, 800));
  show("HDM series pagination", s$("a[href*='/series/page/']").map((i, el) => s$(el).attr("href")).get().slice(0,5).join(", "));
}

async function hdmSeriesEpisodes() {
  const r = await get("https://hdmovies.life/series/visionquest-2026");
  const $ = cheerio.load(r.data);
  show("HDM series season text", $("[class*=season], [class*=episode]").map((i, el) => ($(el).attr("class") || "") + " | " + $(el).text().trim().replace(/\s+/g, " ").slice(0, 120)).get().slice(0, 15).join("\n"));
  show("HDM post content links (all internal)", $("a[href^='/'], a[href*='hdmovies.life']").map((i, el) => $(el).text().trim().replace(/\s+/g, " ").slice(0, 60) + " => " + $(el).attr("href")).get().filter((s) => !/movie\/|quality\/|genre\//.test(s)).slice(0, 40).join("\n"));
  show("HDM sidebar/related excluded; script hints", ($("script").map((i, el) => $(el).html() || "").get().join("\n").match(/episode[^;]{0,80}/gi) || []).slice(0, 10).join("\n"));
}

(async () => {
  for (const fn of [tbCats, tbPost, hdmForms, hdmCard, hdmSeriesEpisodes]) {
    try {
      await fn();
    } catch (e) {
      console.log("ERR " + fn.name + ": " + e.message);
    }
    await sleep(800);
  }
})();
