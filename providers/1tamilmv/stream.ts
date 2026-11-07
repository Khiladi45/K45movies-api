import { ProviderContext, Stream } from "../types";
import { throwProviderError } from "../providerErrors";
import {
  cleanText,
  getQuality,
  isShortLink,
  isTopicUrl,
  isWatchHost,
  playerSourceFrom,
  unpackPacked,
} from "./utils";

const REQUEST_TIMEOUT_MS = 15_000;

async function fetchHtml(
  axios: any,
  url: string,
  headers: any,
  signal: AbortSignal | undefined,
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onOuterAbort = () => controller.abort();
  signal?.addEventListener("abort", onOuterAbort);
  try {
    const res = await axios.get(url, {
      headers,
      signal: controller.signal,
      timeout: REQUEST_TIMEOUT_MS,
      maxRedirects: 5,
    });
    return typeof res.data === "string" ? res.data : String(res.data ?? "");
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onOuterAbort);
  }
}

/**
 * LuluStream-family embeds (`/e/<id>`) hide a jwplayer config inside a packed
 * `eval(function(p,a,c,k,e,d){…})` script. Unpacked, it yields a signed HLS
 * master.m3u8 that only plays with a Referer header of the embed page.
 */
function resolveWatchPage(
  html: string,
  pageUrl: string,
  headers: any,
): Stream[] {
  const streams: Stream[] = [];
  const add = (link: string, type: string, quality?: string) => {
    if (!link || streams.some((s) => s.link === link)) return;
    streams.push({
      server: `1TamilMV ${streams.length + 1}`,
      link,
      type,
      quality,
      headers: { ...headers, Referer: pageUrl },
    });
  };

  // LuluStream titles embed the quality, e.g. "Scene (2026) … - 720p - x264".
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "";

  const unpacked = unpackPacked(html);
  if (unpacked) {
    const source = playerSourceFrom(unpacked);
    if (source) {
      const type = /\.m3u8/i.test(source) ? "m3u8" : "mp4";
      add(source, type, getQuality(unpacked) || getQuality(title));
    }
  }

  // Fallbacks for non-packed hosts: a <video> tag or a bare media URL.
  const video = html.match(/<(?:source|video)[^>]+src=["']([^"']*\.(?:m3u8|mp4|mkv)[^"']*)["']/i);
  if (video) {
    add(video[1], /\.m3u8/i.test(video[1]) ? "m3u8" : "mp4");
  }
  return streams;
}

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
  let streams: Stream[] = [];

  try {
    // Topic URL: collect every [W] watch embed in the topic, then resolve each.
    if (isTopicUrl(link)) {
      const html = await fetchHtml(axios, link, headers, signal);
      const $ = cheerio.load(html);
      const watchUrls: string[] = [];
      $("div[data-role=commentContent] a[href]").each((_i, el) => {
        const href = $(el).attr("href") || "";
        const text = cleanText($(el).text());
        if ((text === "[W]" || isWatchHost(href)) && !watchUrls.includes(href)) {
          watchUrls.push(href);
        }
      });
      for (const watchUrl of watchUrls.slice(0, 3)) {
        const page = await fetchHtml(axios, watchUrl, headers, signal).catch(
          () => "",
        );
        streams.push(...resolveWatchPage(page, watchUrl, headers));
        if (streams.length >= 2) break;
      }
      return streams;
    }

    // Shortlink (spoo.me etc.): resolve the redirect before deciding.
    if (isShortLink(link)) {
      try {
        const html = await fetchHtml(axios, link, headers, signal);
        streams.push(...resolveWatchPage(html, link, headers));
        if (streams.length === 0) {
          streams.push({
            server: "1TamilMV Embed",
            link,
            type: "embed",
            quality: getQuality(link),
            headers,
          });
        }
        return streams;
      } catch {
        // Dead shortlink (spoo.me entries expire) — nothing to play.
        return streams;
      }
    }

    // Direct watch-embed URL.
    const html = await fetchHtml(axios, link, headers, signal);
    streams = resolveWatchPage(html, link, headers);

    if (streams.length === 0 && isWatchHost(link)) {
      // Couldn't unpack the player — hand the raw embed to the frontend.
      streams.push({
        server: "1TamilMV Embed",
        link,
        type: "embed",
        quality: getQuality(link),
        headers,
      });
    }
    return streams;
  } catch (err) {
    if (streams.length === 0) throwProviderError("1TamilMV", "stream", err);
  }
  return streams;
}
