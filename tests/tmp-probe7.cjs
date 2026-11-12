const axios = require("axios");
const cheerio = require("cheerio");
const H = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};
const c = axios.create({ headers: H, timeout: 30000, maxRedirects: 5 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try { return await c.get(url); } catch (e) { last = e; await sleep(1200); }
  }
  throw last;
}

(async () => {
  for (const url of [
    "https://www.1tamilblasters.blog/bigg-boss-tamil-2026-s010-ep01-day-00/",
    "https://www.1tamilblasters.blog/celebrity-master-chef-2026-s01-ep-01-02-tamil/",
  ]) {
    const r = await get(url);
    const $ = cheerio.load(r.data);
    const content = $(".entry-content").length ? $(".entry-content") : $("article");
    console.log("\n#### " + url);
    console.log("content children count:", content.find("h1,h2,h3,h4,p,iframe,a,strong,span").length);
    content.find("h1,h2,h3,h4,p,strong,iframe,a").each((i, el) => {
      const t = $(el).text().trim().replace(/\s+/g, " ");
      const src = $(el).attr("src");
      const href = $(el).attr("href");
      if (el.tagName === "iframe" || el.tagName === "a" || /episode|ep\s*\d|player/i.test(t)) {
        console.log(
          (i + "").padStart(3) + " " + el.tagName.padEnd(6) + " | " + t.slice(0, 80) + " | " + (src || href || ""),
        );
      }
    });
  }
})();
