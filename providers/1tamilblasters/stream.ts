import { ProviderContext, Stream } from "../types";
import { throwProviderError } from "../providerErrors";
import {
  getQuality,
  isFilePage,
  isUltrashow,
  isWatchHost,
  parseDownloadLinks,
  parsePlayers,
  playerSourceFrom,
  unpackPacked,
} from "./utils";

const REQUEST_TIMEOUT_MS = 15_000;

async function fetchHtml(
  axios: any,
  url: string,
  headers: any,
  signal: AbortSignal | undefined,
): Promise<{ html: string; url: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onOuterAbort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener("abort", onOuterAbort);
  try {
    const res = await axios.get(url, {
      headers,
      signal: controller.signal,
      timeout: REQUEST_TIMEOUT_MS,
      maxRedirects: 5,
    });
    return {
      html: typeof res.data === "string" ? res.data : "",
      url: res.request?.responseURL || res.request?.res?.responseUrl || url,
    };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onOuterAbort);
  }
}

const mediaType = (url: string) =>
  /\.m3u8/i.test(url) ? "m3u8" : /\.mkv/i.test(url) ? "mkv" : "mp4";

/**
 * LuluStream-family embeds hide the jwplayer config in a packed eval script.
 * Ultrashow serves the HLS URL directly (with JSON-escaped `\u0026`).
 */
function resolveWatchPage(html: string, pageUrl: string, headers: any): Stream[] {
  const streams: Stream[] = [];
  const seen = new Set<string>();
  const add = (link: string, type: string, quality?: string) => {
    const source = link.replace(/\\\//g, "/").replace(/\\u0026/g, "&").replace(/&amp;/g, "&").replace(/\\$/, "");
    let clean: string;
    try {
      clean = new URL(source, pageUrl).href;
    } catch {
      return;
    }
    if (!/^https?:\/\//i.test(clean)) return;
    if (!clean || seen.has(clean)) return;
    seen.add(clean);
    streams.push({
      server: `1TamilBlasters ${streams.length + 1}`,
      link: clean,
      type,
      quality,
      headers: { ...headers, Referer: pageUrl },
    });
  };

  const unpacked = unpackPacked(html);
  if (unpacked) {
    const source = playerSourceFrom(unpacked);
    if (source) add(source, mediaType(source), getQuality(unpacked));
  }

  const direct = html.match(
    /["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i,
  )?.[1];
  if (direct) add(direct, "m3u8", getQuality(direct));

  const video = html.match(
    /<(?:source|video)[^>]+src=["']([^"']*\.(?:m3u8|mp4|mkv)[^"']*)["']/i,
  );
  if (video) add(video[1], mediaType(video[1]), getQuality(video[1]));

  return streams;
}

/**
 * Swissupload chain:
 *   /files/name.mkv -> "Continue to download" (/download/files/name.mkv)
 *   -> "Download file" anchor carrying response-content-disposition / signature
 */
async function resolveDownloadChain(
  axios: any,
  cheerio: any,
  pageUrl: string,
  headers: any,
  signal: AbortSignal | undefined,
): Promise<{ link: string; quality?: string } | null> {
  const pickFile = (html: string, at: string): string | null => {
    const $ = cheerio.load(html);
    let found = "";
    $("a[href]").each((_i: number, el: any) => {
      if (found) return;
      const href = $(el).attr("href") || "";
      if (
        /response-content-disposition|amazonaws\.com|X-Amz-Signature/i.test(href)
      ) {
        found = /^https?:\/\//i.test(href) ? href : new URL(href, at).href;
      }
    });
    return found || null;
  };

  const pickNextPage = (html: string, at: string): string | null => {
    const $ = cheerio.load(html);
    let found = "";
    $("a[href]").each((_i: number, el: any) => {
      if (found) return;
      const href = $(el).attr("href") || "";
      if (/\/download\/files\//i.test(href)) {
        found = /^https?:\/\//i.test(href) ? href : new URL(href, at).href;
      }
    });
    return found || null;
  };

  try {
    const first = await fetchHtml(axios, pageUrl, headers, signal);
    const quality = getQuality(pageUrl);
    const finalFile = pickFile(first.html, first.url);
    if (finalFile) return { link: finalFile, quality };

    const next = pickNextPage(first.html, first.url);
    if (!next) return null;

    const second = await fetchHtml(
      axios,
      next,
      { ...headers, Referer: first.url },
      signal,
    );
    const file = pickFile(second.html, second.url);
    return file ? { link: file, quality } : null;
  } catch {
    return null;
  }
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
  const streams: Stream[] = [];
  const seen = new Set<string>();
  const add = (server: string, streamLink: string, type: string, quality?: string, requestHeaders = headers) => {
    if (!streamLink || seen.has(streamLink)) return;
    seen.add(streamLink);
    streams.push({ server, link: streamLink, type, quality, headers: requestHeaders });
  };

  try {
    if (isFilePage(link)) {
      const resolved = await resolveDownloadChain(
        axios,
        cheerio,
        link,
        headers,
        signal,
      );
      if (resolved) {
        add("1TamilBlasters Download", resolved.link, mediaType(resolved.link), resolved.quality);
      }
      return streams;
    }

    const isBlogPost = /1tamilblasters\./i.test(link);

    if (isBlogPost) {
      const post = await fetchHtml(axios, link, headers, signal);
      const $ = cheerio.load(post.html);
      const content = $(".entry-content").first().length
        ? $(".entry-content").first()
        : $("article").first();

      const players = parsePlayers($, content).slice(0, 2);
      for (const player of players) {
        const page = await fetchHtml(
          axios,
          player.url,
          { ...headers, Referer: post.url },
          signal,
        ).catch(() => null);
        if (!page) continue;
        for (const stream of resolveWatchPage(page.html, page.url, headers)) {
          add(stream.server, stream.link, stream.type, stream.quality, stream.headers);
        }
        if (streams.length >= 2) break;
      }

      const files = parseDownloadLinks($, content).slice(0, 2);
      for (const file of files) {
        const resolved = await resolveDownloadChain(
          axios,
          cheerio,
          file.url,
          headers,
          signal,
        );
        if (resolved) {
          add(
            `1TamilBlasters ${file.title}`,
            resolved.link,
            mediaType(resolved.link),
            resolved.quality,
          );
        }
      }
      return streams;
    }

    const page = await fetchHtml(
      axios,
      link,
      { ...headers, Referer: "https://www.1tamilblasters.blog/" },
      signal,
    );
    for (const stream of resolveWatchPage(page.html, page.url, headers)) {
      add(stream.server, stream.link, stream.type, stream.quality, stream.headers);
    }

    if (streams.length === 0 && (isWatchHost(link) || isUltrashow(link))) {
      add("1TamilBlasters Embed", link, "embed", getQuality(link));
    }
    return streams;
  } catch (err) {
    if (streams.length === 0) throwProviderError("1TamilBlasters", "stream", err);
  }
  return streams;
}
