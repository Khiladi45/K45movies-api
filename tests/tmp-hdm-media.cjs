const path = require("path");
const { providerContext } = require("./provider-test-context");
const stream = require(path.join(__dirname, "..", "dist", "hdmovieslife", "stream.js"));
const axios = require("axios");

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
  const link = result[0]?.link;
  console.log("resolved:", String(link).slice(0, 140), "type:", result[0]?.type);
  for (const [name, headers, opts] of [
    ["plain UA", mobile, {}],
    ["range", { ...mobile, Range: "bytes=0-1023" }, { responseType: "arraybuffer" }],
    ["curl-ish", { "User-Agent": "curl/8.5.0", Range: "bytes=0-1023" }, { responseType: "arraybuffer" }],
  ]) {
    const res = await axios
      .get(link, {
        headers,
        validateStatus: () => true,
        timeout: 30000,
        maxRedirects: 5,
        ...opts,
      })
      .catch((e) => ({ status: "ERR " + e.message, headers: {}, data: "" }));
    console.log(
      name,
      "->",
      res.status,
      res.headers?.["content-type"],
      "len:",
      res.data?.byteLength ?? String(res.data ?? "").length,
    );
  }
})();
