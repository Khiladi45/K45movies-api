const { providerContext } = require("./provider-test-context");
const cheerio = require("cheerio");

async function main() {
  const { axios, commonHeaders } = providerContext;
  const base = "https://links.hdlinks.online/file/Hu1vDqHi";
  const cookies = new Map();
  const cookieHeader = () => [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ");

  const absorb = (res) => {
    const sc = res.headers?.["set-cookie"];
    if (!sc) return;
    const arr = Array.isArray(sc) ? sc : [sc];
    for (const line of arr) {
      const [pair] = line.split(";");
      const idx = pair.indexOf("=");
      if (idx > 0) cookies.set(pair.slice(0, idx).trim(), pair.slice(idx + 1).trim());
    }
  };

  const page = await axios.get(base, { headers: { ...commonHeaders, ...(cookieHeader() ? { Cookie: cookieHeader() } : {}) } });
  absorb(page);
  const $page = cheerio.load(String(page.data || ""));
  const title = $page("title").text().replace(/^FXShare — /, "").trim();
  console.log("page status", page.status, "title", title.slice(0, 120));

  let buttonsHtml = "";
  try {
    const r = await axios.get(base + "?action=get_buttons", {
      headers: { ...commonHeaders, Referer: base, "X-Requested-With": "XMLHttpRequest", ...(cookieHeader() ? { Cookie: cookieHeader() } : {}) },
    });
    absorb(r);
    buttonsHtml = String(r.data || "");
  } catch (e) {
    console.log("get_buttons ERR", e.message);
  }
  const $b = cheerio.load(buttonsHtml);
  const fast = $b("a[data-mirror=direct]").first().attr("href");
  console.log("fast href?", !!fast);

  const urls = [fast, base + (fast || "")].filter(Boolean);
  let url = new URL(fast, base).href;
  for (let hop = 0; hop < 8; hop++) {
    let res;
    try {
      res = await axios.get(url, {
        headers: { ...commonHeaders, Referer: base, ...(cookieHeader() ? { Cookie: cookieHeader() } : {}) },
        maxRedirects: 0,
        validateStatus: null,
      });
    } catch (e) {
      console.log(`hop${hop} ERR ${e.message}`);
      break;
    }
    absorb(res);
    const ct = res.headers?.["content-type"];
    const loc = res.headers?.location;
    const body = String(res.data || "");
    console.log(`hop${hop} status=${res.status} ct=${ct} location=${loc || ""} len=${body.length} head=${body.slice(0, 60).replace(/\s+/g, " ")}`);
    if (res.status >= 300 && res.status < 400 && loc) {
      url = new URL(loc, url).href;
      continue;
    }
    if (/video\/|octet-stream|application\/x-matroska/.test(ct || "")) {
      console.log("GOT MEDIA", url, ct);
      break;
    }
    if (/json/.test(ct || "")) {
      console.log("JSON", body.slice(0, 600));
      break;
    }
    const $ = cheerio.load(body);
    console.log(" title:", $("title").text().trim().slice(0, 120));
    console.log(" anchors:", $("a[href]").map((i, e) => $(e).text().trim().slice(0, 25) + " => " + $(e).attr("href")).get().slice(0, 6).join(" | "));
    console.log(" forms:", $("form").map((i, e) => $(e).attr("action") + "[" + $(e).attr("method") + "]").get().join(", "));
    const mm = body.match(/https?:\/\/[^"'\s<>]+\.(?:mkv|mp4|m3u8)[^"'\s<>]*/i);
    console.log(" media in html:", mm?.[0] || "none");
    break;
  }
}
main().catch((e) => console.log("ERR", e.message));
