const { providerContext } = require("./provider-test-context");
const cheerio = require("cheerio");

async function main() {
  const { axios, commonHeaders } = providerContext;
  const pageUrl = "https://hdmovies.life/movie/the-odyssey-2026";
  const r = await axios.get(pageUrl, { headers: commonHeaders });
  const $ = cheerio.load(r.data);
  const forms = [];
  $("form.dl-post-form").each((i, el) => {
    const f = $(el);
    const fields = {};
    f.find("input").each((j, inp) => {
      fields[$(inp).attr("name")] = $(inp).attr("value") || "";
    });
    forms.push({ action: f.attr("action"), fields });
  });
  console.log("forms", forms.length);
  const targets = forms.filter((f) => /1080/i.test(f.fields.quality)).slice(0, 2);

  for (const target of targets) {
    console.log("\n=== POST", target.fields.label, target.fields.quality, "url:", target.fields.url);
    const body = new URLSearchParams(target.fields).toString();
    let res;
    try {
      res = await axios.post(target.action, body, {
        headers: {
          ...commonHeaders,
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "https://hdmovies.life",
          Referer: pageUrl,
        },
        maxRedirects: 0,
        validateStatus: null,
      });
      console.log("POST status", res.status, "location:", res.headers?.location, "len:", String(res.data || "").length);
    } catch (e) {
      console.log("POST ERR", e.message);
      continue;
    }

    let url = res.headers?.location ? new URL(res.headers.location, target.action).href : "";
    console.log("hop1:", url);
    let refers = pageUrl;
    for (let hop = 0; hop < 6 && url; hop++) {
      let r2;
      try {
        r2 = await axios.get(url, {
          headers: { ...commonHeaders, Referer: refers },
          maxRedirects: 0,
          validateStatus: null,
        });
      } catch (e) {
        console.log(" hop ERR", e.message);
        break;
      }
      console.log(` hop${hop} ${r2.status} ${url} ct=${r2.headers?.["content-type"]} sd=${String(r2.data || "").slice(0, 40).replace(/\s+/g, " ")}`);
      if (r2.status >= 300 && r2.status < 400 && r2.headers?.location) {
        refers = url;
        url = new URL(r2.headers.location, url).href;
        continue;
      }
      const html = String(r2.data || "");
      if (/^\s*\{/.test(html)) {
        console.log(" JSON:", html.slice(0, 500));
        try {
          const j = JSON.parse(html);
          if (j.url || j.link || j.redirect) {
            refers = url;
            url = new URL(j.url || j.link || j.redirect, url).href;
            console.log(" -> json url", url);
            continue;
          }
        } catch {}
        break;
      }
      const $2 = cheerio.load(html);
      console.log(" title:", $2("title").text().trim().slice(0, 120));
      console.log(" meta refresh:", $2("meta[http-equiv]").map((i, e) => $2(e).attr("content")).get().join(" | "));
      console.log(
        " anchors:",
        $2("a[href]")
          .map((i, e) => $2(e).text().trim().replace(/\s+/g, " ").slice(0, 30) + " => " + $2(e).attr("href"))
          .get()
          .filter((s) => /download|file|cloud|drive|click|continue|verify|get/i.test(s))
          .slice(0, 8)
          .join("\n  "),
      );
      const scripts = $2("script").map((i, e) => $2(e).html() || "").get().join("\n");
      const urls = scripts.match(/https?:\/\/[^"'\s\\)]+/g) || [];
      console.log(" script urls:", [...new Set(urls)].slice(0, 8).join("\n  "));
      const form = $2("form").first();
      if (form.length) {
        console.log(" form action:", form.attr("action"), "method:", form.attr("method"), "inputs:", form.find("input").map((i, e) => $2(e).attr("name") + "=" + String($2(e).attr("value")).slice(0, 30)).get().join(" ; "));
      }
      break;
    }
  }
}
main().catch((e) => console.log("ERR", e.message));
