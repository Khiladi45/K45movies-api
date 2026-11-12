const { providerContext } = require("./provider-test-context");
const cheerio = require("cheerio");

async function main() {
  const { axios, commonHeaders } = providerContext;
  const quickUrl = "https://directyp.org/4/b48cb967f1f4f934dddd6124e4f705d0";
  const page = await axios.get(quickUrl, { headers: { ...commonHeaders, Referer: "https://hdmovies.life/movie/the-odyssey-2026" } });
  const html = String(page.data || "");
  const m = html.match(/w=\(a='([^']+)'/);
  if (!m) return console.log("no config");
  const cfg = JSON.parse(decodeURIComponent(m[1]));
  console.log("cfg", JSON.stringify(cfg, null, 1).slice(0, 800));
  const form = cfg.form;
  const body = new URLSearchParams(Object.entries(form.values).filter(([, v]) => v !== null && v !== undefined)).toString();
  const action = new URL(form.action, quickUrl).href;
  console.log("POST", action, body.slice(0, 300));

  let res = await axios.post(action, body, {
    headers: {
      ...commonHeaders,
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: quickUrl,
      Origin: "https://directyp.org",
    },
    maxRedirects: 0,
    validateStatus: null,
  });
  console.log("POST status", res.status, "loc", res.headers?.location, "len", String(res.data || "").length);

  let url = res.headers?.location ? new URL(res.headers.location, action).href : action;
  let referer = action;
  for (let hop = 0; hop < 8; hop++) {
    let r2;
    try {
      r2 = await axios.get(url, { headers: { ...commonHeaders, Referer: referer }, maxRedirects: 0, validateStatus: null });
    } catch (e) {
      console.log("hop ERR", e.message);
      break;
    }
    const loc = r2.headers?.location;
    const ct = r2.headers?.["content-type"] || "";
    const len = String(r2.data || "").length;
    console.log(`hop${hop} ${r2.status} ct=${ct.slice(0, 30)} len=${len} loc=${loc ? loc.slice(0, 150) : ""}`);
    if (r2.status >= 300 && r2.status < 400 && loc) {
      referer = url;
      url = new URL(loc, url).href;
      continue;
    }
    if (/video|octet|matroska/.test(ct)) return console.log("MEDIA", url);
    const body2 = String(r2.data || "");
    const $ = cheerio.load(body2);
    console.log(" title:", $("title").text().trim().slice(0, 120));
    console.log(" anchors:", $("a[href]").map((i, e) => $(e).text().trim().slice(0, 25) + "=>" + $(e).attr("href")).get().slice(0, 8).join(" | "));
    const media = body2.match(/https?:\/\/[^"'\s<>]+\.(?:mkv|mp4|m3u8)[^"'\s<>]*/i);
    console.log(" media:", media?.[0] || "none");
    console.log(" forms:", $("form").map((i, e) => $(e).attr("action") + "[" + $(e).attr("method") + "]").get().join(" , "));
    const scripts = $("script:not([src])").map((i, e) => $(e).html() || "").get().join("\n");
    console.log(" script head:", scripts.replace(/\s+/g, " ").slice(0, 600));
    break;
  }
}
main().catch((e) => console.log("ERR", e.message));
