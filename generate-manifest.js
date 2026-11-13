const fs = require("fs");
const path = require("path");

const bundledDir = path.join(__dirname, "bundled");
const outputFile = path.join(__dirname, "manifest.json");

const VERSION = "1.0.0";

// Folder ids whose display name differs from the humanized form.
const DISPLAY_NAMES = {
  cncVerse: "CNC Verse",
};

// Turn a folder id like "4khdhub" / "cncVerse" into a display name.
function humanize(id) {
  if (DISPLAY_NAMES[id]) return DISPLAY_NAMES[id];
  return id
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Derive entries from the actual bundle output so the manifest can never
// reference a provider whose bundle failed to build.
const providers = fs
  .readdirSync(bundledDir)
  .filter((file) => file.endsWith(".js"))
  .map((file) => path.basename(file, ".js"))
  .sort()
  .map((id) => ({
    id,
    name: humanize(id),
    version: VERSION,
    description: null,
    bundleUrl: `bundled/${id}.js`,
    icon: null,
  }));

const manifest = {
  version: VERSION,
  updatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  providers,
};

fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2) + "\n");
console.log(`✅ Wrote manifest.json with ${providers.length} providers`);
