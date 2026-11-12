const axios = require("axios");
const cheerio = require("cheerio");
const H = {
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
};

async function hops(start) {
  let url = start;
  let referer = "";
  for (let i = 0; i < 8; i++) {
    const res = await axios
      .get(url, {
        headers: referer ? { ...H, Referer: referer } : H,
        maxRedirects: 0,
        validateStatus: () => true,
        timeout: 20000,
      })
      .catch((e) => ({ status: "ERR " + e.message, headers: {} }));
    const ct = res.headers?.["content-type"] || "";
    const loc = res.headers?.location || "";
    console.log(`hop${i}`, String(res.status), url.slice(0, 110));
    console.log("   loc:", String(loc).slice(0, 130), "| ct:", ct, "| len:", String(res.data ?? "").length);
    if (loc) {
      referer = url;
      url = new URL(loc, url).href;
      continue;
    }
    if (res.status !== 200) break;
    const body = String(res.data ?? "");
    if (/html/i.test(ct)) {
      const $ = cheerio.load(body);
      console.log("   title:", $("title").text().trim().slice(0, 80));
      const anchors = $("a[href]").map((_i, el) => $(el).attr("href")).get();
      console.log("   anchors:", anchors.slice(0, 6).map((a) => String(a).slice(0, 120)));
      const media = anchors.find((a) => /\.(mkv|mp4)(\?|$)/i.test(a));
      if (media) { console.log("   MEDIA", media.slice(0, 120)); break; }
      const next = $('a[data-mirror="direct"]').first().attr("href") || $('a[href*="payload="]').first().attr("href");
      if (!next) break;
      referer = url;
      url = new URL(next, url).href;
      continue;
    }
    console.log("   NON-HTML final!");
    break;
  }
}

hops("https://links.hdlinks.online/file/IV5teAvt").catch((e) => console.log("ERR", e.message));
