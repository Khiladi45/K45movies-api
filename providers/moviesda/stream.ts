import { ProviderContext, Stream } from "../types";
import { throwProviderError } from "../providerErrors";
import {
  absoluteUrl,
  cleanText,
  collectFolderLinks,
  fetchWithDeadline,
  getQuality,
  isDirectMedia,
  streamStageKey,
} from "./utils";

// Per-request ceiling. The download hosts (play.onestream.today et al.)
// sometimes accept a request and stall the body indefinitely; without a hard
// deadline the walk hangs and the app surfaces a stream timeout.
const REQUEST_DEADLINE_MS = 12_000;
// Whole-operation ceiling. When it expires we return whatever was found
// instead of failing the entire stream lookup.
const TOTAL_DEADLINE_MS = 30_000;
// Exploring more hosts after the first playable stream is pure latency —
// the mirrors serve the same file id.
const STREAMS_EARLY_EXIT = 2;
const MAX_DEPTH = 6;
const HREFS_PER_PAGE = 4;

/**
 * moviesda download chain:
 *   quality page → /download/<slug>/ → download.moviespage.xyz
 *   → movies.downloadpage.xyz → download.fastbytes.xyz/download.php?dl=<base64>
 * The last URL 302-redirects to a signed CDN mp4.
 * play.onestream.today embeds the same file as
 *   fastly.fastbytes.xyz/open.php?dl=<base64>&stream=1 (direct mp4).
 */
export async function getStream({
  link,
  signal,
  providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}) {
  const { axios, cheerio, commonHeaders } = providerContext;
  const headers = commonHeaders || {};
  const streams: Stream[] = [];
  const visited = new Set<string>();
  const visitedStages = new Set<string>();
  const queue: { url: string; depth: number; quality?: string }[] = [
    { url: link, depth: 0, quality: getQuality(link) },
  ];
  const startedAt = Date.now();

  const addStream = (streamLink: string, quality?: string) => {
    if (!streamLink || streams.length >= STREAMS_EARLY_EXIT) return;
    if (streams.some((stream) => stream.link === streamLink)) return;

    const extension = streamLink.match(/\.(mp4|mkv|webm)(?:\?|#|$)/i);
    streams.push({
      server: `Moviesda ${streams.length + 1}`,
      link: streamLink,
      type: extension ? extension[1].toLowerCase() : "mp4",
      quality,
      headers,
    });
  };

  try {
    while (queue.length > 0 && streams.length < STREAMS_EARLY_EXIT) {
      if (Date.now() - startedAt > TOTAL_DEADLINE_MS) break;

      const current = queue.shift()!;
      if (!current.url || visited.has(current.url)) continue;
      visited.add(current.url);

      if (isDirectMedia(current.url)) {
        addStream(current.url, current.quality || getQuality(current.url));
        continue;
      }

      // Skip mirror hosts that share a chain stage we already explored.
      const stageKey = streamStageKey(current.url);
      if (stageKey && visitedStages.has(stageKey)) continue;
      if (stageKey) visitedStages.add(stageKey);

      if (current.depth > MAX_DEPTH) continue;

      let html = "";
      try {
        html = await fetchWithDeadline(
          axios,
          current.url,
          headers,
          signal,
          REQUEST_DEADLINE_MS,
        );
      } catch (err) {
        if (current.depth === 0) throw err;
        continue;
      }

      const $ = cheerio.load(html);
      const pageQuality =
        getQuality(
          $("title").text(),
          $(".line").eq(1).text(),
          $(".details").text(),
          current.url,
        ) || current.quality;

      const mediaSource = absoluteUrl(
        current.url,
        $("video source[src]").first().attr("src") ||
          $("source[src]").first().attr("src") ||
          $("video[src]").first().attr("src"),
      );
      if (mediaSource) {
        addStream(mediaSource, pageQuality);
        continue;
      }

      const hrefs: string[] = [];
      const addHref = (href?: string | null) => {
        const absolute = absoluteUrl(current.url, href);
        if (absolute) hrefs.push(absolute);
      };

      $(".download .dlink a[href], .dlink a[href]").each((_i, el) =>
        addHref($(el).attr("href")),
      );

      if (hrefs.length === 0) {
        $(".folder .left ul li a[href]").each((_i, el) =>
          addHref($(el).attr("href")),
        );
      }

      if (hrefs.length === 0) {
        collectFolderLinks($, current.url).forEach((item) =>
          addHref(item.url),
        );
      }

      if (hrefs.length === 0) {
        // Last resort: any direct media / download-server URL embedded in the page.
        const embedded = html.match(
          /https?:\/\/[^"'\s<>]+(?:\.mp4|\.mkv|\.m3u8|(?:download|open)\.php\?dl=[^"'\s<>]*)/gi,
        );
        (embedded || []).forEach((href) => addHref(href));
      }

      for (const href of Array.from(new Set(hrefs)).slice(0, HREFS_PER_PAGE)) {
        // Direct media hrefs skip the file-id mirror check — they ARE the result.
        if (isDirectMedia(href)) {
          addStream(href, getQuality(href) || pageQuality);
          continue;
        }
        queue.push({
          url: href,
          depth: current.depth + 1,
          quality: getQuality(href) || pageQuality,
        });
      }
    }
  } catch (err) {
    // Partial results beat a hard failure when some hosts stalled.
    if (streams.length === 0) throwProviderError("Moviesda", "stream", err);
  }

  return streams;
}
