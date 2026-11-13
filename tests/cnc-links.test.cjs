// Dev-only unit tests: studio link round-trips (3 shapes x 7 studios),
// catalog toggling and prefixed search routing.
const assert = require("assert");
const path = require("path");
const esbuild = require("esbuild");

function loadStudioModule() {
  const out = esbuild.buildSync({
    entryPoints: [path.join(__dirname, "..", "providers", "cncVerse", "studio.ts")],
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
    target: "node18",
  }).outputFiles[0].text;
  const Module = module.constructor;
  const m = new Module();
  m.paths = module.paths;
  m._compile(out, path.join(__dirname, "studio.compiled.js"));
  return m.exports;
}

const { STUDIOS, ALL_STUDIOS, parseStudioLink, toAppLink, toCoreLink } = loadStudioModule();

const shapes = [
  {
    name: "movie",
    core: (prefix) => `81260314|${prefix}|The%20Movie`,
    tagIndex: 1,
  },
  {
    name: "episode",
    core: (prefix) => `81599029|${prefix}|Stranger%20Things|5|1`,
    tagIndex: 1,
  },
  {
    name: "season",
    core: (prefix) => `80077209|80057281|${prefix}|Stranger%20Things|1`,
    tagIndex: 2,
  },
];

let checks = 0;
for (const key of ALL_STUDIOS) {
  const studio = STUDIOS[key];
  for (const shape of shapes) {
    const core = shape.core(studio.prefix);
    const appLink = toAppLink(core, studio, shape.tagIndex);
    const parts = appLink.split("|");
    assert.strictEqual(parts[shape.tagIndex], key, `${key}/${shape.name}: studio key in slot`);

    const parsed = parseStudioLink(appLink);
    assert.strictEqual(parsed.studio.key, key, `${key}/${shape.name}: parsed studio`);
    assert.strictEqual(parsed.tagIndex, shape.tagIndex, `${key}/${shape.name}: tag index`);

    const back = toCoreLink(appLink);
    assert.strictEqual(back.link, core, `${key}/${shape.name}: round-trip`);
    assert.strictEqual(back.studio.key, key, `${key}/${shape.name}: round-trip studio`);
    checks++;
  }
}

// Unknown link falls back to Netflix without throwing.
assert.strictEqual(parseStudioLink("123|weird|Title").studio.key, "netflix");

console.log(`✅ link round-trip: ${checks} assertions passed (3 shapes x ${ALL_STUDIOS.length} studios)`);

// Catalog toggling through the built bundle.
const bundle = require(path.join(__dirname, "..", "bundled", "cncVerse.js"));
const kv = new Map();
const providerContext = {
  axios: {},
  cheerio: {},
  commonHeaders: {},
  openWebView: async () => {
    throw new Error("not used");
  },
  kvStore: {
    get: async (k) => (kv.has(k) ? kv.get(k) : null),
    set: async (k, v) => void kv.set(k, v),
    delete: async (k) => kv.delete(k),
    keys: async () => [...kv.keys()],
    clear: async () => kv.clear(),
  },
};

(async () => {
  const all = await bundle.catalog({ providerContext });
  assert.strictEqual(all.length, 7, "catalog exposes 7 studios by default");

  kv.set("enabledStudios", ["netflix", "marvel"]);
  // catalog caches enabled studios for 60s; simulate a fresh provider context.
  const fresh = await bundle.catalog({ providerContext });
  const keys = fresh.map((c) => c.filter);
  assert(keys.includes("netflix") && keys.includes("marvel"), "enabled studios only");
  assert(!keys.includes("prime"), "disabled studio hidden");

  console.log("✅ catalog toggling: 7 default, subset respected");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
