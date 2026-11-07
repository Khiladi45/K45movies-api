export type FolderLink = { title: string; url: string };

export const cleanText = (value: string | undefined | null) =>
  (value || "").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();

export const absoluteUrl = (baseUrl: string, href?: string | null) => {
  if (!href) return "";
  const value = href.trim();
  if (!value || value === "#") return "";
  try {
    return new URL(value, `${baseUrl}/`).href;
  } catch {
    return value;
  }
};

const isFolderNavLink = (href: string) =>
  href.startsWith("/tamil-movies/") ||
  href.startsWith("/movies.php") ||
  href.includes("facebook") ||
  href.includes("telegram");

/**
 * Listing pages carry no posters, but posters follow a predictable path:
 * /jailer-2-2026-tamil-movie/ -> /uploads/posters/jailer-2-2026.jpg
 */
export const posterFor = (url: string) => {
  try {
    const parsed = new URL(url);
    const slug = parsed.pathname.replace(/\/+$/, "").split("/").pop() || "";
    const base = slug.replace(/-(tamil-)?(movie|web-series)$/i, "");
    if (!base || base === slug) return "";
    return `${parsed.origin}/uploads/posters/${base}.jpg`;
  } catch {
    return "";
  }
};

/**
 * Content entries on moviesda are always `<div class="f"><img …><a>Title</a></div>`.
 * The old selector (`a[href*="/movie/"]`) never matched because slugs end in
 * `-tamil-movie/`, `-web-series/` or `-hd/`.
 */
export const collectFolderLinks = (
  $: any,
  baseUrl: string,
): FolderLink[] => {
  const links: FolderLink[] = [];
  const seen = new Set<string>();

  $("div.f a[href]").each((_i: number, el: any) => {
    const href = ($(el).attr("href") || "").trim();
    const anchorText = cleanText($(el).text());
    const strongText = cleanText(
      $(el).closest("div.f").find("strong").first().text(),
    );
    const label = /^(download|download now|watch|watch now|play)$/i.test(
      anchorText,
    )
      ? strongText
      : anchorText;
    const title = label || strongText;
    if (!href || href === "#" || !title || isFolderNavLink(href)) return;
    const url = absoluteUrl(baseUrl, href);
    if (!url || seen.has(url)) return;
    seen.add(url);
    links.push({ title, url });
  });

  return links;
};

const normalizeQuality = (value: string) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  if (n >= 2000) return "2160";
  if (n >= 1000) return "1080";
  if (n >= 700) return "720";
  if (n >= 500) return "480";
  if (n >= 300) return "360";
  return String(n);
};

const heightToQuality = (height: number) => {
  if (height >= 2000) return "2160";
  if (height >= 1000) return "1080";
  if (height >= 700) return "720";
  if (height >= 500) return "480";
  if (height >= 300) return "360";
  return undefined;
};

// Resolution is usually written as widthxheight with a cropped height
// (1920x800, 1280x692), so width is the reliable quality signal.
const resolutionToQuality = (width: number, height: number) => {
  if (width >= 3000) return "2160";
  if (width >= 1800) return "1080";
  if (width >= 1200) return "720";
  if (width >= 800) return "480";
  if (width >= 600) return "360";
  return heightToQuality(height);
};

export const getQuality = (...parts: (string | undefined | null)[]) => {
  const text = cleanText(parts.filter(Boolean).join(" "));
  if (!text) return undefined;

  const p = text.match(/(\d{3,4})\s*p\b/i);
  if (p) return normalizeQuality(p[1]);

  const res = text.match(/(\d{3,4})\s*[x×]\s*(\d{3,4})/i);
  if (res) return resolutionToQuality(Number(res[1]), Number(res[2]));

  const k = text.match(/\b(2160|1080|720|480|360)\b/);
  if (k) return normalizeQuality(k[1]);

  return undefined;
};

export const isDirectMedia = (url: string) =>
  /\.(mp4|mkv|m3u8|webm|avi)(\?|#|$)/i.test(url) ||
  /\/(download|open)\.php\?dl=/i.test(url);

// The download chain mirrors the same file across hosts with a shared numeric
// id (/download/file/103358, /download/page/103358, /stream/page/103358).
// file → page → stream are sequential chain *steps*, not mirrors — only
// dedupe the same stage+id (e.g. the same file page on two different hosts).
export const streamStageKey = (url: string) => {
  const id = url.match(/\/(\d+)(?:\/|$|\?)/)?.[1];
  if (!id) return null;
  if (/\/download\/file\//.test(url)) return `file:${id}`;
  if (/\/download\/page\//.test(url)) return `page:${id}`;
  if (/\/stream\/page\//.test(url)) return `stream:${id}`;
  return null;
};

/**
 * axios's `timeout` only covers time-to-response-headers; the download hosts
 * sometimes accept a request and then stall the body forever, which hangs the
 * whole stream walk. This races a hard wall-clock deadline.
 */
export async function fetchWithDeadline(
  axios: any,
  url: string,
  headers: any,
  signal: AbortSignal | undefined,
  deadlineMs: number,
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), deadlineMs);
  const onOuterAbort = () => controller.abort();
  signal?.addEventListener("abort", onOuterAbort);
  try {
    const res = await axios.get(url, {
      headers,
      signal: controller.signal,
      timeout: deadlineMs,
    });
    return typeof res.data === "string" ? res.data : String(res.data ?? "");
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onOuterAbort);
  }
}

export const sortQualityDesc = (a: string, b: string) =>
  Number(b) - Number(a);
