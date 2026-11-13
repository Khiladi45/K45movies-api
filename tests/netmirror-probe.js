// Dev-only live probe for the CNCVerse / NetMirror engine.
// Usage: node tests/netmirror-probe.js [step]
// Steps: base | otp | cookies | player | playlist | all
const fs = require("fs");
const path = require("path");

const LOG = path.join(__dirname, "netmirror-probe.log");
const lines = [];
function log(...args) {
  const line = args
    .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
    .join(" ");
  lines.push(line);
  console.log(line);
}
function flush() {
  fs.writeFileSync(LOG, lines.join("\n") + "\n");
}

const MOBILE_UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 5 Build/TQ3A.230901.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/144.0.7559.132 Safari/537.36 /OS.Gatu v3.0";
const NEWTV_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0 /OS.GatuNewTV v1.0";
const NEWTV_HEADERS = {
  "User-Agent": NEWTV_UA,
  "X-Requested-With": "NetmirrorNewTV v1.0",
  Accept: "application/json, text/plain, */*",
};

// 17 domains from the DEX (decoded).
const DISCOVERY_DOMAINS = [
  "https://mobidetect.art", "https://mobidetect.ink", "https://mobidetect.live",
  "https://mobidetect.pro", "https://mobidetect.shop", "https://mobidetect.site",
  "https://mobidetect.vip", "https://mobidetect.wiki", "https://mobidetect.xyz",
  "https://mobidetects.top", "https://mobidetects.xyz", "https://mobidetects.art",
  "https://mobidetects.cc", "https://mobidetects.ink", "https://mobidetects.pro",
  "https://mobidetects.store", "https://mobiledetects.com",
];

const SITE_HOSTS = ["https://net52.cc", "https://net22.cc"];

let cookie = ""; // t_hash_t=...

async function req(url, opts = {}) {
  const res = await fetch(url, {
    redirect: "manual",
    headers: opts.headers || {},
    method: opts.method || "GET",
    body: opts.body,
    signal: AbortSignal.timeout(opts.timeout || 10000),
  });
  const text = await res.text().catch(() => "");
  const setCookie = res.headers.getSetCookie?.() || [];
  return { status: res.status, headers: res.headers, text, setCookie };
}

function snippet(text, n = 500) {
  return text.length > n ? text.slice(0, n) + `…(${text.length} bytes)` : text;
}

function decodeB64(s) {
  try {
    return Buffer.from(s, "base64").toString("utf-8").trim();
  } catch {
    return "";
  }
}

async function stepBase() {
  log("# PHASE 1.1 — API base discovery");
  const winners = [];
  for (const domain of DISCOVERY_DOMAINS) {
    try {
      const r = await req(`${domain}/checknewtv.php`, {
        headers: NEWTV_HEADERS, timeout: 6000,
      });
      let parsed = null;
      try { parsed = JSON.parse(r.text); } catch {}
      const decoded = parsed?.token_hash ? decodeB64(parsed.token_hash) : "";
      log(`${domain} -> ${r.status} ${JSON.stringify(parsed)} decoded=${decoded}`);
      if (decoded.startsWith("http")) winners.push({ domain, apiBase: decoded });
    } catch (e) {
      log(`${domain} -> ERROR ${e.message}`);
    }
  }
  log(`WINNERS: ${JSON.stringify(winners)}`);
  return winners[0]?.apiBase || "";
}

async function stepOtp(apiBase) {
  log("\n# PHASE 1.2 — OTP exchange");
  const variants = [
    { name: "GET otp.php", url: `${apiBase}/newtv/otp.php`, method: "GET" },
    {
      name: "POST form otp+usertoken",
      url: `${apiBase}/newtv/otp.php`,
      method: "POST",
      body: "otp=&usertoken=",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  ];
  let otpData = null;
  for (const v of variants) {
    try {
      const r = await req(v.url, { method: v.method, body: v.body, headers: { ...NEWTV_HEADERS, ...(v.headers || {}) } });
      log(`${v.name} -> ${r.status} setCookie=${JSON.stringify(r.setCookie)} body=${snippet(r.text)}`);
      try { otpData = JSON.parse(r.text); } catch {}
      if (otpData?.otp) break;
    } catch (e) {
      log(`${v.name} -> ERROR ${e.message}`);
    }
  }
  if (!otpData?.otp) {
    log("No OTP returned — cannot proceed with token exchange.");
    return "";
  }
  const { otp, usertoken = "" } = otpData;
  const exchanges = [
    { name: "GET ?otp&usertoken", url: `${apiBase}/newtv/otp.php?otp=${encodeURIComponent(otp)}&usertoken=${encodeURIComponent(usertoken)}` },
    { name: "GET ?otp", url: `${apiBase}/newtv/otp.php?otp=${encodeURIComponent(otp)}` },
    {
      name: "POST form otp+usertoken",
      url: `${apiBase}/newtv/otp.php`,
      method: "POST",
      body: `otp=${encodeURIComponent(otp)}&usertoken=${encodeURIComponent(usertoken)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  ];
  for (const ex of exchanges) {
    try {
      const r = await req(ex.url, { method: ex.method || "GET", body: ex.body, headers: { ...NEWTV_HEADERS, ...(ex.headers || {}) } });
      log(`${ex.name} -> ${r.status} setCookie=${JSON.stringify(r.setCookie)} body=${snippet(r.text)}`);
      let data = null;
      try { data = JSON.parse(r.text); } catch {}
      const token = data?.token_hash || data?.t_hash_t;
      const fromCookie = (r.setCookie || []).map((c) => c.split(";")[0]).find((c) => c.startsWith("t_hash_t="));
      if (token || fromCookie) {
        cookie = fromCookie || `t_hash_t=${token}`;
        log(`WINNING VARIANT: ${ex.name}; cookie captured (len ${cookie.length})`);
        return cookie;
      }
    } catch (e) {
      log(`${ex.name} -> ERROR ${e.message}`);
    }
  }
  log("No variant returned token_hash/t_hash_t.");
  return "";
}

function ottHeaders(ott) {
  return { ...NEWTV_HEADERS, Ott: ott };
}

async function stepHome(apiBase, ott) {
  log(`\n# PHASE 1.3 — home?app=1 ott=${ott || "(none)"}`);
  const url = `${apiBase}/mobile/home?app=1`;
  const headers = { ...NEWTV_HEADERS, ...(ott ? { Ott: ott } : {}), ...(cookie ? { Cookie: cookie } : {}) };
  try {
    const r = await req(url, { headers });
    log(`${url} -> ${r.status} setCookie=${JSON.stringify(r.setCookie)}`);
    log(`body=${snippet(r.text, 1200)}`);
    let data = null;
    try { data = JSON.parse(r.text); } catch {}
    return data;
  } catch (e) {
    log(`ERROR ${e.message}`);
    return null;
  }
}

async function stepEndpoints(apiBase) {
  log("\n# PHASE 1.4 — endpoint smoke tests");
  const tests = [
    `${apiBase}/mobile/search.php?s=Marvel`,
    `${apiBase}/mobile/pv/search.php?s=Latest`,
    `${apiBase}/mobile/hs/search.php?s=Marvel`,
    `${apiBase}/mobile/episodes.php?s=1`,
    `${apiBase}/mobile/pv/episodes.php?s=1`,
    `${apiBase}/mobile/playlist.php?id=1`,
    `${apiBase}/mobile/pv/playlist.php?id=1`,
    `${apiBase}/newtv/main.php`,
    `${apiBase}/newtv/search.php?s=Marvel`,
  ];
  for (const url of tests) {
    try {
      const r = await req(url, { headers: { ...NEWTV_HEADERS, ...(cookie ? { Cookie: cookie } : {}) } });
      log(`${url} -> ${r.status} ${r.headers.get("content-type") || ""} ${snippet(r.text, 400)}`);
    } catch (e) {
      log(`${url} -> ERROR ${e.message}`);
    }
  }
}

async function stepSite() {
  log("\n# PHASE 1.7 — site hosts");
  for (const host of SITE_HOSTS) {
    for (const p of ["/", "/verify2", "/verify.php"]) {
      try {
        const r = await req(host + p, { headers: { ...NEWTV_HEADERS, "User-Agent": MOBILE_UA } });
        log(`${host}${p} -> ${r.status} setCookie=${JSON.stringify(r.setCookie)} ${snippet(r.text, 200)}`);
      } catch (e) {
        log(`${host}${p} -> ERROR ${e.message}`);
      }
    }
  }
}

async function main() {
  const step = process.argv[2] || "all";
  log(`CNCVerse probe — ${new Date().toISOString()} step=${step}`);
  if (step === "site") { await stepSite(); flush(); return; }
  const apiBase = await stepBase();
  if (!apiBase) {
    log("No API base resolved. ESCALATION: stop and report.");
    flush();
    return;
  }
  log(`\nAPI BASE = ${apiBase}`);
  if (step === "base") { flush(); return; }
  const c = await stepOtp(apiBase);
  if (step === "otp") { flush(); return; }
  for (const ott of ["", "nf", "pv", "hs", "dp"]) {
    await stepHome(apiBase, ott);
  }
  if (step === "cookies") { flush(); return; }
  await stepEndpoints(apiBase);
  await stepSite();
  flush();
}

main().catch((e) => {
  console.error("FATAL", e);
  flush();
  process.exit(1);
});
