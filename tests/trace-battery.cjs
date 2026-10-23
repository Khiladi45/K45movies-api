// Batch trace: search -> meta -> stream for many providers; writes summary.
const { execFileSync } = require("child_process");
const path = require("path");

const providers = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "vega", "castle", "hdhub4u", "moviesmod", "uhdmovies", "primewire",
      "movies4u", "drive", "multi", "showbox", "kissKh", "protonMovies",
      "zeefliz", "topmovies", "gokuHD", "flixhq", "dramacool",
    ];

for (const p of providers) {
  let out = "";
  try {
    out = execFileSync(
      process.execPath,
      [path.join(__dirname, "trace-stream.cjs"), p, "avatar"],
      { timeout: 150000, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
  } catch (e) {
    out = String(e.stdout || "") + String(e.stderr || "") + ` EXIT=${e.status}`;
  }
  const grab = (re) => (out.match(re) || [])[0] || "-";
  const streams = (out.match(/^\d+ \{/gm) || []).length;
  console.log(
    `${p}: search=${grab(/SEARCH (\d+)ms -> (\d+)/) || "?"} streams=${streams} ${grab(/TRACE FAILED.*/) || grab(/NO .*/) || "OK"}`,
  );
}
