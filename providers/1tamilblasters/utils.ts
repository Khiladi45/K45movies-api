export const cleanText = (value: string | undefined | null) =>
  (value || "").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();

export const getQuality = (text: string) => {
  const m = text.match(/(?:^|[^\d])(2160|1080|720|480|360)p?(?:[^\d]|$)/i);
  if (m) return m[1];
  if (/\b4k\b/i.test(text)) return "2160";
  return undefined;
};

/** "Mookuthi Amman 2 (2026) Tamil" -> "Mookuthi Amman 2 (2026)". */
export const displayTitle = (releaseTitle: string) => {
  const title = cleanText(releaseTitle)
    .replace(/\s*[-–|]\s*Tamil\s*Blasters.*$/i, "")
    .replace(/\s*[-–]\s*Tamilblasters.*$/i, "")
    .trim();
  return title
    .replace(/\s+(Tamil|Telugu|Hindi|Malayalam|Kannada|English)$/i, "")
    .trim();
};

export const isSeriesTitle = (text: string) =>
  /\bS\d{1,2}\s*E\d{1,3}\b|\bseason\s*\d|\bweb[\s-]?series\b|\bepisode\s*[-–:]?\s*\d/i.test(
    text,
  );

/** Swissupload clones serve the download page from a random *.xyz host. */
export const isFilePage = (url: string) =>
  /\/files\/[^?#]+\.(?:mkv|mp4|avi|webm)\b/i.test(url) ||
  /\/download\/files\//i.test(url);

export const isWatchHost = (url: string) =>
  /luluvido\.|lulustream\.|lulust\.|luluvid\.|luvbx\.|mbfile\.|filelions\.|streamruby\.|vidhide\.|dood(?:stream|watch)\./i.test(
    url,
  );

export const isUltrashow = (url: string) => /ultrashow\.|ultra.*\.club/i.test(url);

export const MEDIA_RE = /\.(m3u8|mp4|mkv|webm)(?:\?|$)/i;

/**
 * Packed jwplayer config (same obfuscation used by the LuluStream family):
 *   eval(function(p,a,c,k,e,d){…}('payload',36,294,'word|word|…'.split('|')))
 * The payload may contain quotes, so slice between `}('` and the
 * `,radix,count,'words'` tail instead of relying on a regex.
 */
export const unpackPacked = (html: string): string | null => {
  const evalIdx = html.indexOf("eval(function(p,a,c,k");
  if (evalIdx < 0) return null;
  const startIdx = html.indexOf("}('", evalIdx);
  if (startIdx < 0) return null;

  const tailRe = /',(\d+),(\d+),'([^']*)'\.split\('\|'\)/g;
  tailRe.lastIndex = startIdx;
  const tail = tailRe.exec(html);
  if (!tail || tail.index <= startIdx) return null;

  const payload = html.slice(startIdx + 3, tail.index);
  const radix = Number(tail[1]);
  const count = Number(tail[2]);
  if (radix < 2 || radix > 36 || count > 2048 || payload.length > 128_000) return null;
  const words = tail[3].split("|");

  let result = payload;
  for (let i = count - 1; i >= 0; i--) {
    const token = i.toString(radix);
    if (!words[i]) continue;
    result = result.replace(new RegExp(`\\b${token}\\b`, "g"), () => words[i]);
  }
  return result;
};

export const playerSourceFrom = (unpacked: string): string | null => {
  const file = unpacked.match(
    /(?:file|src)\s*:\s*["']([^"']*(?:\.m3u8|\.mp4|\.mkv)[^"']*)["']/i,
  );
  return file ? file[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&") : null;
};

export type PlayerEntry = { title: string; url: string; quality?: string };

/**
 * Detail pages label players with a paragraph right before the iframe:
 *   <p>Player: 01</p><p><iframe src="…"></iframe></p>
 *   <p>Episode – 01</p> …
 */
export const parsePlayers = ($: any, content: any): PlayerEntry[] => {
  const entries: PlayerEntry[] = [];
  const seen = new Set<string>();
  let pendingLabel = "";

  content.find("p, iframe").each((_i: number, el: any) => {
    const tag = (el.tagName || "").toLowerCase();
    if (tag === "p") {
      const text = cleanText($(el).text());
      if (/^(?:player|episode|ep)\s*[:\-–]?\s*\d+/i.test(text)) {
        pendingLabel = text;
      }
      return;
    }
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    if (!src || seen.has(src)) return;
    seen.add(src);
    entries.push({
      title: pendingLabel || `Player ${entries.length + 1}`,
      url: src,
      quality: getQuality(src) || getQuality(pendingLabel),
    });
    pendingLabel = "";
  });

  // Some posts embed the player without a preceding label.
  content.find("iframe[src]").each((_i: number, el: any) => {
    const src = $(el).attr("src") || "";
    if (!src || seen.has(src)) return;
    seen.add(src);
    entries.push({
      title: `Player ${entries.length + 1}`,
      url: src,
      quality: getQuality(src),
    });
  });

  return entries;
};

export type FileEntry = {
  title: string;
  url: string;
  quality?: string;
};

/** Release links embed quality/codec/size in the filename. */
export const parseDownloadLinks = ($: any, content: any): FileEntry[] => {
  const entries: FileEntry[] = [];
  const seen = new Set<string>();
  content.find("a[href]").each((_i: number, el: any) => {
    const href = $(el).attr("href") || "";
    if (!/\/files\/[^/?#]+\.(?:mkv|mp4|avi|webm)\b/i.test(href)) return;
    if (seen.has(href)) return;
    seen.add(href);

    let filename = href.split("/").pop() || "";
    try {
      filename = decodeURIComponent(filename);
    } catch {}
    const quality = getQuality(filename);
    const codec = /hevc|x265/i.test(filename) ? "HEVC" : "x264";
    const size = filename.match(/(\d+(?:\.\d+)?\s*(?:GB|MB))/i)?.[1];
    const title = [quality ? `${quality}p` : "", codec, size]
      .filter(Boolean)
      .join(" ");

    entries.push({ title: title || filename, url: href, quality });
  });
  return entries;
};
