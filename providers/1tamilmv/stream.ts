import { ProviderContext, Stream } from "../types";
import { throwProviderError } from "../providerErrors";
import {
  cleanText,
  getQuality,
  isShortLink,
  isTopicUrl,
  isWatchHost,
  playerSourceFrom,
  streamCashSource,
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

const isDirectMedia = (url: string) =>
  /\.(mkv|mp4|webm|avi|m3u8)(\?|$)/i.test(url) || /\/files\/.+\?token=/i.test(url);

/**
 * "DIRECT LINK" entries are cyberloom.best shortlinks that hop through an
 * interstitial ("Continue to Destination"), then messycloud.ink, before
 * 302-ing to a signed cdn.juicybits.site file. Each stage is either a 3xx
 * (follow Location) or an HTML page whose next hop is an anchor.
 */
async function resolveDirectChain(
  axios: any,
  cheerio: any,
  startUrl: string,
  headers: any,
  signal: AbortSignal | undefined,
): Promise<{ link: string; quality?: string } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  const onOuterAbort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener("abort", onOuterAbort);

  try {
    let url = startUrl;
    let referer = "";
    for (let hop = 0; hop < 6 && !isDirectMedia(url); hop++) {
      const res: any = await axios.get(url, {
        headers: referer ? { ...headers, Referer: referer } : headers,
        signal: controller.signal,
        timeout: REQUEST_TIMEOUT_MS,
        maxRedirects: 0,
        validateStatus: null,
      });
      const location = res.headers?.location;
      if (location && res.status >= 300 && res.status < 400) {
        referer = url;
        url = new URL(location, url).href;
        continue;
      }
      url = res.request?.responseURL || res.request?.res?.responseUrl || url;
      if (res.status >= 200 && res.status < 300 &&
          /^video\//i.test(res.headers?.["content-type"] || "")) {
        return { link: url, quality: getQuality(url) };
      }
      if (res.status !== 200 || typeof res.data !== "string") return null;

      const $ = cheerio.load(res.data);
      let next = "";
      $("a[href]").each((_i: number, el: any) => {
        if (next) return;
        const href = $(el).attr("href") || "";
        const text = cleanText($(el).text());
        const abs = /^https?:\/\//i.test(href)
          ? href
          : new URL(href, url).href;
        if (isDirectMedia(abs)) {
          next = abs;
          return;
        }
        if (
          /continue|destination|direct|download/i.test(text) &&
          /\/out\/?\?|\/go\/?\?/.test(abs)
        ) {
          next = abs;
        }
      });
      if (!next) return null;
      referer = url;
      url = next.replace(/&amp;/g, "&");
    }
    return isDirectMedia(url)
      ? { link: url, quality: getQuality(url) }
      : null;
  } catch {
    return null;
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
    try {
      link = new URL(link.replace(/\\\//g, "/").replace(/\\u0026/g, "&").replace(/&amp;/g, "&"), pageUrl).href;
    } catch {
      return;
    }
    if (!/^https?:\/\//i.test(link) || streams.some((s) => s.link === link)) return;
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

  const streamCash = streamCashSource(html);
  if (streamCash) add(streamCash, "m3u8", getQuality(title));

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
    // Topic URL: collect every [W] watch embed and DIRECT LINK, then resolve.
    if (isTopicUrl(link)) {
      const topic = await fetchHtml(axios, link, headers, signal);
      const $ = cheerio.load(topic.html, { xml: { xmlMode: false } });
      const watchUrls: string[] = [];
      const directUrls: string[] = [];
      $("div[data-role=commentContent] a[href]").each((_i, el) => {
        const href = $(el).attr("href") || "";
        const text = cleanText($(el).text());
        if ((text === "[W]" || isWatchHost(href)) && !watchUrls.includes(href)) {
          watchUrls.push(href);
        }
        if (
          (/direct\s*link/i.test(text) || /cyberloom\./i.test(href)) &&
          /^https?:\/\//i.test(href) &&
          !directUrls.includes(href)
        ) {
          directUrls.push(href);
        }
      });
      for (const watchUrl of watchUrls.slice(0, 5)) {
        const page = await fetchHtml(axios, watchUrl, { ...headers, Referer: topic.url }, signal).catch(
          () => null,
        );
        if (page) streams.push(...resolveWatchPage(page.html, page.url, headers));
        if (streams.length >= 2) break;
      }
      for (const directUrl of directUrls.slice(0, 2)) {
        if (streams.length >= 3) break;
        const resolved = await resolveDirectChain(
          axios,
          cheerio,
          directUrl,
          headers,
          signal,
        );
        if (resolved) {
          streams.push({
            server: `1TamilMV Direct ${streams.length + 1}`,
            link: resolved.link,
            type: /\.m3u8/i.test(resolved.link)
              ? "m3u8"
              : /\.mkv/i.test(resolved.link)
                ? "mkv"
                : "mp4",
            quality: resolved.quality,
            headers,
          });
        }
      }
      return streams;
    }

    // Cyberloom / shortlink DIRECT LINK outside a topic: run the full chain.
    if (/cyberloom\./i.test(link)) {
      const resolved = await resolveDirectChain(
        axios,
        cheerio,
        link,
        headers,
        signal,
      );
      if (resolved) {
        streams.push({
          server: "1TamilMV Direct",
          link: resolved.link,
          type: /\.m3u8/i.test(resolved.link)
            ? "m3u8"
            : /\.mkv/i.test(resolved.link)
              ? "mkv"
              : "mp4",
          quality: resolved.quality,
          headers,
        });
        return streams;
      }
      return streams;
    }

    // Shortlink (spoo.me etc.): resolve the redirect before deciding.
    if (isShortLink(link)) {
      try {
        const page = await fetchHtml(axios, link, headers, signal);
        streams.push(...resolveWatchPage(page.html, page.url, headers));
        return streams;
      } catch {
        // Dead shortlink (spoo.me entries expire) — nothing to play.
        return streams;
      }
    }

    // Direct watch-embed URL.
    try {
      const page = await fetchHtml(axios, link, headers, signal);
      streams = resolveWatchPage(page.html, page.url, headers);
    } catch {
      // Watch hosts disappear frequently; surface an empty result, not a
      // provider-wide failure, so other rows remain usable.
      return streams;
    }

    return streams;
  } catch (err) {
    if (streams.length === 0) throwProviderError("1TamilMV", "stream", err);
  }
  return streams;
}
