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
  const r = await axios.get(base + "?action=get_buttons", {
    headers: hdr({ Referer: base, "X-Requested-With": "XMLHttpRequest", Accept: "*/*" }),
  });
  absorb(r);
  const $ = cheerio.load(String(r.data || ""));
  const links = [];
  $("a[data-mirror]").each((i, el) => links.push({ mirror: $(el).attr("data-mirror"), href: $(el).attr("href"), label: $(el).text().trim() }));

  for (const l of links) {
    const url = new URL(l.href, base).href;
    try {
      const res = await axios.get(url, {
        headers: hdr({ Referer: base }),
        maxRedirects: 0,
        validateStatus: null,
      });
      absorb(res);
      console.log(`\n[${l.mirror}] ${l.label} -> ${res.status} ${res.headers?.location || ""}`);
      if (res.status === 200) {
        const body = String(res.data || "");
        const $b = cheerio.load(body);
        console.log("  title:", $b("title").text().trim().slice(0, 100), "len", body.length);
        const media = body.match(/https?:\/\/[^"'\s<>]+\.(?:mkv|mp4)[^"'\s<>]*/i);
        console.log("  media:", media?.[0] || "none");
        console.log("  anchors:", $b("a[href]").map((i2, e) => $b(e).attr("href")).get().filter((u) => !/^#/.test(u)).slice(0, 5).join(" | "));
      }
    } catch (e) {
      console.log(`\n[${l.mirror}] ERR ${e.message}`);
    }
  }
}
main().catch((e) => console.log("ERR", e.message));
