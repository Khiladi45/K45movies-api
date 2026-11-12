const path = require("path");
const fs = require("fs");
const { providerContext } = require("./provider-test-context");
const stream = require(path.join(__dirname, "..", "dist", "hdmovieslife", "stream.js"));
const axios = require("axios");
const cheerio = require("cheerio");

(async () => {
  const mobile = {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  };
  const result = await stream.getStream({
    link: "https://links.hdlinks.online/file/IV5teAvt",
    type: "movie",
    signal: new AbortController().signal,
    providerContext: { ...providerContext, commonHeaders: mobile },
  });
  const link = result[0].link;
  const res = await axios.get(link, { headers: mobile, validateStatus: () => true, timeout: 30000 });
  fs.writeFileSync(path.join(__dirname, "tmp-fast02.html"), res.data);
  const $ = cheerio.load(res.data);
  console.log("title:", $("title").text().trim());
  $("form").each((i, el) => {
    console.log(
      "form", i,
      "action:", $(el).attr("action"),
      "method:", $(el).attr("method"),
      "inputs:", $(el).find("input").map((_j, inp) => `${$(inp).attr("name")}=${String($(inp).attr("value") || "").slice(0, 40)}`).get().join(" | "),
    );
  });
  const anchors = $("a").map((_i, el) => ({ text: $(el).text().trim().slice(0, 30), href: $(el).attr("href") })).get();
  console.log("anchors:", anchors.slice(0, 14));
  const scripts = $("script").map((_i, el) => ($(el).html() || "").slice(0, 400)).get();
  console.log("scripts:", scripts.filter((s) => s && s.trim()));
})();
