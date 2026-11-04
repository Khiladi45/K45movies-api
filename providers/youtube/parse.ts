import { Post } from "../types";

// Shared YouTube parsing helpers used by posts.ts and meta.ts.
//
// YouTube ships the same video in several renderer shapes depending on the page
// (search results, watch-page sidebar, Shorts shelf) and rolls out new shapes
// regularly. Every field below is therefore read defensively: a missing or
// renamed field yields an empty value, never an exception.

export const YT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

export type ExtractMode = "videos" | "shorts";

// "#shorts" (the catalog's Shorts filter, or typed by the user) switches a
// query into Shorts mode. A plain word like "shorts" must not: "football shorts"
// is a normal search.
const SHORTS_QUERY = /(^|\s)#shorts\b/i;
export const isShortsQuery = (query: string): boolean =>
  SHORTS_QUERY.test(query || "");

const DURATION = /^\d{1,2}(:\d{2}){1,2}$/;

export function extractVideoId(link: string): string {
  const match =
    link.match(
      /(?:v=|\/watch\?v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/i,
    ) || link.match(/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : link;
}

export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const shortsUrl = (id: string) => `https://www.youtube.com/shorts/${id}`;
export const landscapeThumb = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hq720.jpg`;

/** Pulls the JSON object assigned to `ytInitialData` out of a page's HTML. */
export function parseInitialData(html: unknown): any | null {
  if (typeof html !== "string") return null;
  const match =
    html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/) ||
    html.match(/ytInitialData\s*=\s*({.+?});/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

/** Text of a `{simpleText}`, `{runs:[{text}]}` or `{content}` node. */
export function textOf(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node.simpleText === "string") return node.simpleText;
  if (typeof node.content === "string") return node.content;
  if (Array.isArray(node.runs)) {
    return node.runs.map((r: any) => (r && r.text) || "").join("");
  }
  return "";
}

/** Largest image URL from `{thumbnails:[...]}`, `{sources:[...]}` or an array. */
export function pickImage(node: any): string {
  const list: any[] = Array.isArray(node)
    ? node
    : Array.isArray(node?.thumbnails)
      ? node.thumbnails
      : Array.isArray(node?.sources)
        ? node.sources
        : [];
  let best = "";
  let bestWidth = -1;
  for (const item of list) {
    const width = Number(item?.width) || 0;
    if (item?.url && width >= bestWidth) {
      best = item.url;
      bestWidth = width;
    }
  }
  return best.startsWith("//") ? `https:${best}` : best;
}

/** First value stored under `key` anywhere inside `obj` (depth-first). */
export function findFirst(obj: any, key: string): any {
  if (!obj || typeof obj !== "object") return undefined;
  if (obj[key] !== undefined) return obj[key];
  for (const k of Object.keys(obj)) {
    const found = findFirst(obj[k], key);
    if (found !== undefined) return found;
  }
  return undefined;
}

export function formatViews(rawCount: number | string): string {
  const num = typeof rawCount === "number" ? rawCount : parseInt(rawCount, 10);
  if (isNaN(num) || num <= 0) return "";
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B views";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M views";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K views";
  }
  return num === 1 ? "1 view" : `${num} views`;
}

/** "1,234,567 views" -> "1.2M views"; already-short or non-numeric text is kept. */
export function normalizeViews(raw: string): string {
  const text = (raw || "").trim();
  if (!text) return "";
  const exact = text.match(/^([\d,\s]+)\s*views?$/i);
  if (exact) {
    const n = parseInt(exact[1].replace(/[^\d]/g, ""), 10);
    if (!isNaN(n)) return formatViews(n) || "0 views";
  }
  return text;
}

export function formatDuration(totalSeconds: number | string): string {
  const sec =
    typeof totalSeconds === "number" ? totalSeconds : parseInt(totalSeconds, 10);
  if (isNaN(sec) || sec <= 0) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const h = Math.floor(m / 60);
  const remM = m % 60;
  if (h > 0) {
    return `${h}:${remM.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** ISO date -> "2 days ago". Empty when the date cannot be parsed. */
export function relativeTime(iso: string, now: number = Date.now()): string {
  const then = Date.parse(iso);
  if (isNaN(then)) return "";
  const seconds = Math.max(0, Math.floor((now - then) / 1000));
  const units: [string, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, size] of units) {
    const count = Math.floor(seconds / size);
    if (count >= 1) return `${count} ${name}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

type PostParts = {
  id: string;
  title: string;
  channelName?: string;
  channelAvatar?: string;
  views?: string;
  publishedTime?: string;
  duration?: string;
  image?: string;
  isShort?: boolean;
  isLive?: boolean;
};

function buildPost(p: PostParts): Post {
  const isShort = !!p.isShort;
  const channelName = p.channelName?.trim() || undefined;
  const views = normalizeViews(p.views || "") || undefined;
  const duration = p.duration && DURATION.test(p.duration) ? p.duration : "";

  return {
    title: p.title.trim(),
    link: isShort ? shortsUrl(p.id) : watchUrl(p.id),
    // Regular videos always use the 16:9 poster; Shorts use the portrait image
    // YouTube supplied (falling back to the 16:9 one, which `cover` can crop).
    image: isShort ? p.image || landscapeThumb(p.id) : landscapeThumb(p.id),
    aspectRatio: isShort ? 9 / 16 : 16 / 9,
    borderRadius: 8,
    // Legacy combined fields, kept so existing layouts render as before.
    tag: channelName
      ? `${channelName}${views ? ` • ${views}` : ""}`
      : views || undefined,
    cornerTag: duration || undefined,
    // Structured fields for the YouTube layout.
    videoId: p.id,
    channelName,
    channelAvatar: p.channelAvatar || undefined,
    views,
    publishedTime: p.publishedTime?.trim() || undefined,
    duration: duration || undefined,
    isShort,
    isLive: !!p.isLive,
  };
}

// videoRenderer (search results) and compactVideoRenderer (watch-page sidebar)
// share the fields read here.
function fromVideoRenderer(vr: any): Post | null {
  const id = vr?.videoId;
  if (!id || typeof id !== "string") return null;

  const overlays: any[] = Array.isArray(vr.thumbnailOverlays)
    ? vr.thumbnailOverlays
    : [];
  const timeOverlay = overlays
    .map((o) => o?.thumbnailOverlayTimeStatusRenderer)
    .find(Boolean);
  const overlayStyle = String(timeOverlay?.style || "");
  const badges: any[] = Array.isArray(vr.badges) ? vr.badges : [];
  const isLive =
    overlayStyle === "LIVE" ||
    badges.some((b) =>
      String(b?.metadataBadgeRenderer?.style || "").includes("LIVE"),
    );
  const isShort =
    overlayStyle === "SHORTS" || !!vr.navigationEndpoint?.reelWatchEndpoint;

  return buildPost({
    id,
    title: textOf(vr.title),
    channelName:
      textOf(vr.ownerText) ||
      textOf(vr.shortBylineText) ||
      textOf(vr.longBylineText),
    channelAvatar:
      pickImage(
        vr.channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer
          ?.thumbnail,
      ) || pickImage(vr.channelThumbnail),
    views: textOf(vr.shortViewCountText) || textOf(vr.viewCountText),
    publishedTime: textOf(vr.publishedTimeText),
    duration: isLive ? "" : textOf(vr.lengthText) || textOf(timeOverlay?.text),
    image: pickImage(vr.thumbnail),
    isShort,
    isLive,
  });
}

// Older Shorts shelf item.
function fromReelItem(rr: any): Post | null {
  const id = rr?.videoId;
  if (!id || typeof id !== "string") return null;
  return buildPost({
    id,
    title: textOf(rr.headline) || textOf(rr.accessibility?.accessibilityData),
    views: textOf(rr.viewCountText),
    image: pickImage(rr.thumbnail),
    isShort: true,
  });
}

// Newer Shorts shelf item.
function fromShortsLockup(sl: any): Post | null {
  const id =
    sl?.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId ||
    (typeof sl?.entityId === "string"
      ? sl.entityId.replace(/^shorts-shelf-item-/, "")
      : "");
  if (!id || typeof id !== "string") return null;
  return buildPost({
    id,
    title: textOf(sl.overlayMetadata?.primaryText),
    views: textOf(sl.overlayMetadata?.secondaryText),
    image: pickImage(sl.thumbnail) || pickImage(sl.thumbnailViewModel?.image),
    isShort: true,
  });
}

function collectBadgeTexts(node: any, out: string[]): void {
  if (!node || typeof node !== "object") return;
  const badge = node.thumbnailBadgeViewModel;
  if (badge && typeof badge.text === "string") out.push(badge.text);
  for (const key of Object.keys(node)) collectBadgeTexts(node[key], out);
}

// Newer unified card used on watch-page sidebars (and some result pages).
function fromLockup(lv: any): Post | null {
  if (lv?.contentType !== "LOCKUP_CONTENT_TYPE_VIDEO") return null;
  const id = lv.contentId;
  if (!id || typeof id !== "string") return null;

  const meta = lv.metadata?.lockupMetadataViewModel;
  const rows: any[] = Array.isArray(
    meta?.metadata?.contentMetadataViewModel?.metadataRows,
  )
    ? meta.metadata.contentMetadataViewModel.metadataRows
    : [];

  // Order differs between layouts, so classify each text part by content.
  let channelName = "";
  let views = "";
  let publishedTime = "";
  for (const row of rows) {
    const parts: any[] = Array.isArray(row?.metadataParts)
      ? row.metadataParts
      : [];
    for (const part of parts) {
      const text = textOf(part?.text).trim();
      if (!text) continue;
      if (/\b(views?|watching)\b/i.test(text)) views = views || text;
      else if (/\bago$/i.test(text)) publishedTime = publishedTime || text;
      else channelName = channelName || text;
    }
  }

  const badgeTexts: string[] = [];
  collectBadgeTexts(lv.contentImage, badgeTexts);
  const isLive = badgeTexts.some((t) => /^live$/i.test(t.trim()));
  const duration = badgeTexts.map((t) => t.trim()).find((t) => DURATION.test(t));

  return buildPost({
    id,
    title: textOf(meta?.title),
    channelName,
    channelAvatar: pickImage(
      meta?.image?.decoratedAvatarViewModel?.avatar?.avatarViewModel?.image,
    ),
    views,
    publishedTime,
    duration: duration || "",
    isLive,
  });
}

/**
 * Walks a ytInitialData tree and returns every video it can recognise, in page
 * order and without duplicates.
 *
 * - "videos": regular videos (the legacy behaviour). Shorts that YouTube returns
 *   as ordinary video results are kept (and flagged), but Shorts-shelf items are
 *   skipped, so existing layouts see the same list as before.
 * - "shorts": only Shorts, from any renderer shape.
 */
export function collectVideos(data: any, mode: ExtractMode): Post[] {
  const posts: Post[] = [];
  const seen = new Set<string>();

  const add = (post: Post | null, fromShelf: boolean) => {
    if (!post || !post.videoId || seen.has(post.videoId)) return;
    if (mode === "videos" && fromShelf) return;
    if (mode === "shorts" && !post.isShort) return;
    seen.add(post.videoId);
    posts.push(post);
  };

  const walk = (obj: any) => {
    if (!obj || typeof obj !== "object") return;

    if (obj.videoRenderer) add(fromVideoRenderer(obj.videoRenderer), false);
    if (obj.compactVideoRenderer) {
      add(fromVideoRenderer(obj.compactVideoRenderer), false);
    }
    if (obj.lockupViewModel) add(fromLockup(obj.lockupViewModel), false);
    if (obj.reelItemRenderer) add(fromReelItem(obj.reelItemRenderer), true);
    if (obj.shortsLockupViewModel) {
      add(fromShortsLockup(obj.shortsLockupViewModel), true);
    }

    for (const key of Object.keys(obj)) walk(obj[key]);
  };

  walk(data);
  return posts;
}

/** Same page slicing the provider always used (20 per page). */
export function paginate<T>(items: T[], page: number, pageSize = 20): T[] {
  const start = (page - 1) * pageSize;
  if (start >= items.length) return items.slice(0, pageSize);
  return items.slice(start, start + pageSize);
}
