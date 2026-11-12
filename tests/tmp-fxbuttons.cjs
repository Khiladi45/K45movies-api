const { providerContext } = require("./provider-test-context");
const cheerio = require("cheerio");

async function main() {
  const { axios, commonHeaders } = providerContext;
  const base = "https://links.hdlinks.online/file/Hu1vDqHi";
  for (const action of ["get_buttons", "get_buttons_json"]) {
    const url = base + "?action=" + action;
    try {
      const r = await axios.get(url, {
        headers: { ...commonHeaders, Referer: base, "X-Requested-With": "XMLHttpRequest", Accept: "*/*" },
      });
      console.log("\n===", action, r.status, String(r.data || "").slice(0, 2500));
      if (action === "get_buttons") {
        const $ = cheerio.load(String(r.data || ""));
        $("a[href]").each((i, el) => console.log("  BTN", $(el).text().trim().slice(0, 40), "=>", $(el).attr("href"), "| data:", JSON.stringify(Object.fromEntries(Object.entries(el.attribs || {}).filter(([k]) => k.startsWith("data-"))))));
      }
    } catch (e) {
      console.log("\nERR", action, e.message);
    }
  }
}
main().catch((e) => console.log("ERR", e.message));
