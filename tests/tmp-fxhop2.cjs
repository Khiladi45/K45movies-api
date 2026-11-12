const { providerContext } = require("./provider-test-context");
const cheerio = require("cheerio");
const fs = require("fs");

async function main() {
  const { axios, commonHeaders } = providerContext;
  const base = "https://links.hdlinks.online/file/Hu1vDqHi";
  let cookie = "";
  const absorb = (res) => {
    const sc = res.headers?.["set-cookie"];
    if (!sc) return;
    for (const line of Array.isArray(sc) ? sc : [sc]) cookie = cookie ? cookie + "; " + line.split(";")[0] : line.split(";")[0];
  };
  const hdr = (extra) => ({ ...commonHeaders, ...(cookie ? { Cookie: cookie } : {}), ...extra });
  absorb(await axios.get(base, { headers: hdr({}) }));
  const r = await axios.get(base + "?action=get_buttons", { headers: hdr({ Referer: base, "X-Requested-With": "XMLHttpRequest" }) });
  absorb(r);
  const $ = cheerio.load(String(r.data || ""));

  for (const mirror of ["pixeldrain", "direct"]) {
    let url = new URL($("a[data-mirror=" + mirror + "]").attr("href"), base).href;
    let referer = base;
    let final;
    for (let hop = 0; hop < 4; hop++) {
      const res = await axios.get(url, { headers: hdr({ Referer: referer }), maxRedirects: 0, validateStatus: null });
      absorb(res);
      const loc = res.headers?.location;
      if (res.status >= 300 && res.status < 400 && loc) {
        referer = url;
        url = new URL(loc, url).href;
        continue;
      }
      final = String(res.data || "");
      console.log(`\n==== ${mirror} final ${res.status} ${url}`);
      break;
    }
    if (!final) continue;
    fs.writeFileSync(`tests/tmp-fxhop2-${mirror}.html`, final);
    const $f = cheerio.load(final);
    console.log("title:", $f("title").text().trim().slice(0, 120));
    console.log("body:", $f("body").text().replace(/\s+/g, " ").slice(0, 500));
    console.log("forms:", $f("form").map((i, e) => `${$f(e).attr("action")}|${$f(e).attr("method")}|` + $f(e).find("input").map((j, x) => $f(x).attr("name") + "=" + String($f(x).attr("value")).slice(0, 50)).get().join(" ; ")).get().join("\n"));
    console.log("links:", $f("a[href]").map((i, e) => $f(e).text().trim().slice(0, 30) + " => " + $f(e).attr("href")).get().filter((s) => !/bootstrap|favicon|css/.test(s)).slice(0, 12).join("\n"));
    const scripts = $f("script:not([src])").map((i, e) => $f(e).html() || "").get().join("\n");
    console.log("script snippet:", scripts.replace(/\s+/g, " ").slice(0, 1500));
    console.log("media urls:", [...new Set(final.match(/https?:\/\/[^"'\s<>]+(?:\.mkv|\.mp4|\.m3u8)[^"'\s<>]*/gi) || [])].slice(0, 5));
  }
}
main().catch((e) => console.log("ERR", e.message));
