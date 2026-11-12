const { providerContext } = require("./provider-test-context");
const cheerio = require("cheerio");

async function main() {
  const { axios, commonHeaders } = providerContext;
  const base = "https://links.hdlinks.online/file/Hu1vDqHi";
  let cookie = "";
  const absorb = (res) => {
    const sc = res.headers?.["set-cookie"];
    if (!sc) return;
    for (const line of Array.isArray(sc) ? sc : [sc]) {
      const [pair] = line.split(";");
      cookie = cookie ? cookie + "; " + pair : pair;
    }
  };
  const hdr = (extra) => ({ ...commonHeaders, ...(cookie ? { Cookie: cookie } : {}), ...extra });

  const page = await axios.get(base, { headers: hdr({}) });
  absorb(page);
  const r = await axios.get(base + "?action=get_buttons", { headers: hdr({ Referer: base, "X-Requested-With": "XMLHttpRequest" }) });
  absorb(r);
  const $ = cheerio.load(String(r.data || ""));

  for (const mirror of ["pixeldrain", "cloud", "direct"]) {
    const href = $("a[data-mirror=" + mirror + "]").attr("href");
    if (!href) continue;
    let url = new URL(href, base).href;
    let referer = base;
    console.log("\n===== mirror", mirror);
    for (let hop = 0; hop < 10; hop++) {
      let res;
      try {
        res = await axios.get(url, { headers: hdr({ Referer: referer }), maxRedirects: 0, validateStatus: null });
      } catch (e) {
        console.log(` hop${hop} ERR ${e.message}`);
        break;
      }
      absorb(res);
      const loc = res.headers?.location;
      const ct = res.headers?.["content-type"] || "";
      console.log(` hop${hop} ${res.status} ct=${ct.slice(0, 30)} loc=${loc ? loc.slice(0, 160) : ""}`);
      if (res.status >= 300 && res.status < 400 && loc) {
        referer = url;
        url = new URL(loc, url).href;
        continue;
      }
      if (/video|octet|matroska/.test(ct)) {
        console.log("  MEDIA", url.slice(0, 160));
        break;
      }
      if (String(res.data || "").length < 3000) console.log("  body:", String(res.data || "").replace(/\s+/g, " ").slice(0, 400));
      break;
    }
  }
}
main().catch((e) => console.log("ERR", e.message));
