// Probe stream URLs twice: (a) plain fetch (like the app's WebView shim),
// (b) curl-cffi chrome impersonation (like Vega's server-side path).
const cffi = require("curl-cffi-node");
const CHROME_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const links = JSON.parse(process.argv[2] || "[]");

async function plainProbe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": CHROME_UA, Range: "bytes=0-1023" },
      redirect: "follow",
      signal: controller.signal,
    });
    const ct = res.headers.get("content-type") || "";
    const len =
      res.headers.get("content-length") || res.headers.get("content-range") || "?";
    return `PLAIN ${res.status} ct=${ct} len=${len}`;
  } catch (e) {
    return `PLAIN ERR ${e.name}: ${e.message}`;
  } finally {
    clearTimeout(timer);
  }
}

async function cffiProbe(url) {
  try {
    const res = await cffi.get(url, {
      impersonate: "chrome120",
      timeout: 12000,
      headers: { Range: "bytes=0-1023" },
      verify: false,
    });
    const h = res.headers || {};
    const ct = (typeof h.get === "function" ? h.get("content-type") : h["content-type"]) || "";
    const len =
      (typeof h.get === "function" ? h.get("content-range") : h["content-range"]) ||
      h["content-length"] ||
      "?";
    return `CFFI ${res.status} ct=${ct} len=${len}`;
  } catch (e) {
    return `CFFI ERR ${String(e?.message || e).slice(0, 120)}`;
  }
}

(async () => {
  for (const item of links) {
    console.log(`\n=== ${item.server} ===\n${item.link.slice(0, 100)}`);
    const [a, b] = await Promise.all([plainProbe(item.link), cffiProbe(item.link)]);
    console.log(" ", a);
    console.log(" ", b);
  }
})();
