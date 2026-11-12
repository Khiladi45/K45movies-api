const { providerContext } = require("./provider-test-context");
const cheerio = require("cheerio");
const fs = require("fs");

async function main() {
  const { axios, commonHeaders } = providerContext;
  const pageUrl = "https://hdmovies.life/movie/the-odyssey-2026";
  const r = await axios.get(pageUrl, { headers: commonHeaders });
  const $ = cheerio.load(r.data);
  const forms = [];
  $("form.dl-post-form").each((i, el) => {
    const f = $(el);
    const fields = {};
    f.find("input").each((j, inp) => (fields[$(inp).attr("name")] = $(inp).attr("value") || ""));
    forms.push({ action: f.attr("action"), fields });
  });

  for (const label of ["[Quick Download]", "Download (Fast Drive)"]) {
    const target = forms.find((f) => f.fields.label === label && /1080/.test(f.fields.quality));
    if (!target) continue;
    console.log("\n=====", label, "->", target.fields.url);
    const res = await axios.post(target.action, new URLSearchParams(target.fields).toString(), {
      headers: { ...commonHeaders, "Content-Type": "application/x-www-form-urlencoded", Origin: "https://hdmovies.life", Referer: pageUrl },
      maxRedirects: 0,
      validateStatus: null,
    });
    const loc = res.headers?.location;
    console.log("POST", res.status, loc);
    let url = loc ? new URL(loc, target.action).href : target.fields.url;
    const r2 = await axios.get(url, { headers: { ...commonHeaders, Referer: pageUrl }, maxRedirects: 5, validateStatus: null });
    const html = String(r2.data || "");
    fs.writeFileSync(`tests/tmp-hdm-${label.replace(/\W+/g, "_")}.html`, html);
    console.log("GET", r2.status, url, "len", html.length);
    const $2 = cheerio.load(html);
    console.log("title:", $2("title").text().trim());
    console.log("body text:", $2("body").text().replace(/\s+/g, " ").slice(0, 800));
    console.log("forms:", $2("form").length, $2("form").first().attr("action"), $2("form").first().attr("method"));
    console.log("scripts:", $2("script").length);
    const packed = html.includes("eval(function(p,a,c,k");
    console.log("packed:", packed);
    const urls = [...new Set((html.match(/https?:\/\/[^"'\s\\)<>]+/g) || []))];
    console.log("urls:", urls.slice(0, 15).join("\n  "));
  }
}
main().catch((e) => console.log("ERR", e.message));
