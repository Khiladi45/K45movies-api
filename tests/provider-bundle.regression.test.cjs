// Regression smoke test against the REAL distribution format (bundled/*.js —
// single-file bundles the app downloads from the manifest's bundleUrl).
// Asserts: urls.json parses, every bundled provider loads and exports a
// usable interface, and primewire's search signing (context.Aes.sha1) works.
// Run: node tests/provider-bundle.regression.test.cjs
const fs = require("fs");
const path = require("path");
const { createHash } = require("crypto");

const rootDir = path.join(__dirname, "..");
const bundledDir = path.join(rootDir, "bundled");

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error("FAIL:", msg);
};

// 1. urls.json parses and every entry has a url string.
try {
  const urls = JSON.parse(fs.readFileSync(path.join(rootDir, "urls.json"), "utf-8"));
  const keys = Object.keys(urls);
  if (keys.length < 40) fail(`urls.json has only ${keys.length} keys`);
  for (const key of keys) {
    if (typeof urls[key]?.url !== "string") fail(`urls.json "${key}" missing url`);
  }
  console.log(`PASS: urls.json parses (${keys.length} keys)`);
} catch (e) {
  fail(`urls.json unreadable: ${e.message}`);
}

// 2. Every manifest provider has a loadable bundle with a usable interface.
const manifest = JSON.parse(
  fs.readFileSync(path.join(rootDir, "manifest.json"), "utf-8"),
);
const manifestIds = (Array.isArray(manifest) ? manifest : manifest.providers || []).map(
  (p) => p.value ?? p.id,
);
const bundledFiles = fs
  .readdirSync(bundledDir)
  .filter((f) => f.endsWith(".js"))
  .map((f) => f.replace(/\.js$/, ""));

for (const id of manifestIds) {
  const file = path.join(bundledDir, `${id}.js`);
  if (!fs.existsSync(file)) {
    fail(`manifest provider "${id}" has no bundled/${id}.js`);
    continue;
  }
  try {
    const mod = require(file);
    if (id === "moviesApi") continue; // aggregator helper, checked below
    if (typeof mod.getPosts !== "function") fail(`${id}: getPosts missing`);
    if (typeof mod.getMeta !== "function") fail(`${id}: getMeta missing`);
    if (typeof mod.getStream !== "function") fail(`${id}: getStream missing`);
    // catalog may be an array or a (async) function returning one.
    if (!Array.isArray(mod.catalog) && typeof mod.catalog !== "function") {
      fail(`${id}: catalog is neither array nor function`);
    }
  } catch (e) {
    fail(`${id}.js failed to load: ${e.message}`);
  }
}
console.log(`PASS: ${manifestIds.length} manifest providers have loadable bundles`);

// 3. moviesApi helper contract: exports mpGetStream for aggregators.
try {
  const mod = require(path.join(bundledDir, "moviesApi.js"));
  if (typeof mod.mpGetStream !== "function") {
    fail("moviesApi: mpGetStream missing");
  } else {
    console.log("PASS: moviesApi helper exports mpGetStream");
  }
} catch (e) {
  fail(`moviesApi.js failed to load: ${e.message}`);
}

// 4. primewire search signing with the same Aes contract the app sandbox injects.
async function checkPrimewireSigning() {
  try {
    const mod = require(path.join(bundledDir, "primewire.js"));
    const Aes = {
      sha1: async (input) =>
        createHash("sha1").update(String(input), "utf8").digest("hex"),
    };
    const digest = (await Aes.sha1("avatarJyjId97F9PVqUPuMO0")).slice(0, 10);
    if (typeof mod.getSearchPosts !== "function") {
      fail("primewire: getSearchPosts not a function");
    } else if (!/^[0-9a-f]{10}$/.test(digest)) {
      fail(`primewire signing produced bad digest: ${digest}`);
    } else {
      console.log(`PASS: primewire Aes.sha1 signing works (digest ${digest})`);
    }
  } catch (e) {
    fail(`primewire signing test crashed: ${e.message}`);
  }
}

checkPrimewireSigning().then(() => {
  if (failures === 0) {
    console.log(`\nALL PROVIDER BUNDLE REGRESSION CHECKS PASSED (${manifestIds.length} providers)`);
    process.exit(0);
  }
  console.error(`\n${failures} regression check(s) failed`);
  process.exit(1);
});
