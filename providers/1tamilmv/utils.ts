export type TopicLink = { title: string; url: string; watchUrl?: string };

export const cleanText = (value: string | undefined | null) =>
  (value || "").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();

export const WATCH_FILTER = "/watch-online/";

// Third-party video hosts embedded through [W] links. LuluStream clones serve
// an obfuscated jwplayer config whose packed script hides a direct m3u8.
export const isWatchHost = (url: string) =>
  /luluvido\.|lulustream\.|luluvid\.|luvbx\.|mbfile\.|filelions\.|streamruby\.|vidhide\.|dood(?:stream|watch)\./i.test(
    url,
  );

export const isTopicUrl = (url: string) => /\/forums\/topic\//.test(url);

export const isShortLink = (url: string) =>
  /spoo\.me|cyberloom\.best|stackmint\.ink|icutr\.|linkshortify/i.test(url);

/** Canonical topic URL (drops &preview=1, #comments, /page/N/ extras). */
export const canonicalTopicUrl = (href: string, baseUrl: string) => {
  let url: string;
  try {
    url = new URL(href, `${baseUrl}/`).href;
  } catch {
    url = href;
  }
  return url
    .split("#")[0]
    .replace(/&preview=1/, "")
    .replace(/&do=[^&]*/, "")
    .replace(/&comment=\d+/, "")
    .replace(/\/page\/\d+\/$/, "/");
};

export const getQuality = (text: string) => {
  // Filenames join tokens with "_", so plain \b misses "_1080p_" — use
  // digit boundaries instead.
  const m = text.match(/(?:^|[^\d])(2160|1080|720|480|360)p?(?:[^\d]|$)/i);
  if (m) return m[1];
  if (/\b4k\b/i.test(text)) return "2160";
  return undefined;
};

/**
 * Forum titles are full release names:
 *   "Scene (2026) Tamil HQ HDTS - [1080p & 720p - x264 - 2.6GB...] - HQ Clean Aud"
 * Reduce to "<Name> (<year>) <first quality hint>" for list rows.
 */
export const displayTitle = (releaseTitle: string) => {
  const stripped = cleanText(releaseTitle)
    .replace(/^www\.[^ ]*?\s*[-–]\s*/i, "")
    .replace(/^[-–|]\s*/, "");
  const head = cleanText(stripped.split(/\s+-\s+\[/)[0]);
  const name = head.match(/^(.*?\(\d{4}\))/);
  const quality = getQuality(stripped);
  if (name) return quality ? `${name[1]} ${quality}p` : name[1];
  return head.slice(0, 80);
};

/**
 * Packed player scripts (LuluStream-family hosts):
 *   eval(function(p,a,c,k,e,d){while(c--)if(k[c])p=p.replace(
 *     new RegExp('\\b'+c.toString(a)+'\\b','g'),k[c]);return p}(
 *     'payload',36,294,'word|word|…'.split('|')))
 * The payload may itself contain quotes, so it is located by slicing between
 * the `}('` opener and the `,radix,count,'words'` tail rather than by regex.
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
  const words = tail[3].split("|");

  let result = payload;
  for (let i = count - 1; i >= 0; i--) {
    const token = i.toString(radix);
    if (!words[i]) continue;
    result = result.replace(new RegExp(`\\b${token}\\b`, "g"), () => words[i]);
  }
  return result;
};

/** Extract the playable file URL from an unpacked player config. */
export const playerSourceFrom = (unpacked: string): string | null => {
  const file = unpacked.match(/(?:file|src)\s*:\s*["']([^"']*(?:\.m3u8|\.mp4|\.mkv)[^"']*)["']/i);
  return file ? file[1] : null;
};
