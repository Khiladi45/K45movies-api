import type { ProviderContext, Stream } from "../types";
import { throwProviderError } from "../providerErrors";
import { followHeadRedirects, httpUrl, mediaExtension, probeMedia, qualityFrom } from "../extractors/httpMedia";
import { absorbCookies as absorbStartCookies, CookieJar, loadMovieswoodPage, movieswoodBaseUrl } from "./posts";

const isStartLink = (url: string) => /download-start\.php/i.test(url);
const isDownloadGate = (url: string, label: string) =>
  isStartLink(url) || /rating\.php/i.test(url) || /\bdownload\b/i.test(label);

/**
 * `download-start.php?t=…` only accepts a session that has seen the movie and
 * rating pages (PHPSESSID). A valid request answers with a 302 to the signed
 * CDN file.
 */
async function resolveStart(
  {
    axios, cheerio, commonHeaders,
  }: ProviderContext,
  target: string,
  referer: string,
  signal: AbortSignal,
  jar: CookieJar,
): Promise<string | undefined> {
  const headers = {
    ...commonHeaders,
    ...(jar.value ? { Cookie: jar.value } : {}),
    Referer: referer,
  };
  const redirected = await followHeadRedirects(axios, target, headers, signal, (response) => {
    absorbStartCookies(jar, response);
  });
  if (redirected && redirected !== target) return redirected;

  // Some hosts reject HEAD: fall back to reading the landing page. The Range
  // header keeps a surprise redirect to the video file from downloading it all.
  const response = await axios.get(target, {
    headers: { ...headers, Range: "bytes=0-65535" },
    signal,
    timeout: 10_000,
    maxRedirects: 0,
    validateStatus: () => true,
  });
  absorbStartCookies(jar, response);
  const location = response.headers?.location;
  if (location && response.status >= 300 && response.status < 400) {
    return new URL(location, target).href;
  }
  if (response.status !== 200 || typeof response.data !== "string") return;
  const $ = cheerio.load(response.data);
  let next = "";
  $("a[href],source[src]").each((_i: number, el: any) => {
    if (next) return;
    const href = $(el).attr("href") || $(el).attr("src") || "";
    if (mediaExtension(href)) next = href;
    else if (/lustmaya|\.mkv|\.mp4/i.test(href)) next = href;
  });
  if (!next) {
    const refresh = response.data.match(/url=([^"']*\.(?:mkv|mp4)[^"']*)/i)?.[1];
    if (refresh) next = refresh;
  }
  return next ? new URL(next.replace(/&amp;/g, "&"), target).href : undefined;
}

export async function getStream({
  link, signal, providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Stream[]> {
  try {
    const base = await movieswoodBaseUrl();
    const url = httpUrl(link, base);
    if (!url) throw new Error("Invalid source URL");
    const { axios, commonHeaders, cheerio } = providerContext;
    const jar: CookieJar = { value: "" };
    const headersFor = (referer: string) => ({ ...commonHeaders, Referer: referer });
    const verify = async (target: string, referer: string, quality?: string, label = "MoviesWood"): Promise<Stream | undefined> => {
      const headers = headersFor(referer);
      const type = await probeMedia(axios, target, headers, signal, true);
      return type ? { server: label, link: target, type, quality, headers } : undefined;
    };
    const classify = async (target: string, referer: string, label: string): Promise<Stream> => {
      const headers = headersFor(referer);
      const type = mediaExtension(target) && await probeMedia(axios, target, headers, signal);
      const quality = qualityFrom(label);
      return type
        ? { server: "MoviesWood", link: target, type, quality, headers }
        : { server: "MoviesWood", link: target, type: "embed", quality, downloadOnly: true };
    };
    if (mediaExtension(url) || new URL(url).origin !== new URL(base).origin) {
      return [await classify(url, base, url)];
    }

    const page = await loadMovieswoodPage(url, providerContext, signal, jar);
    const $ = cheerio.load(page.html);
    const starts: Array<{ target: string; label: string }> = [];
    const gates: Array<{ target: string; label: string }> = [];
    const direct: Array<{ target: string; label: string }> = [];
    const seen = new Set<string>();
    $("a[href]").each((_i, el) => {
      const anchor = $(el);
      const label = anchor.text().replace(/\s+/g, " ").trim();
      const target = httpUrl(anchor.attr("href"), page.url);
      if (!target || target === page.url || seen.has(target)) return;
      if (/^https?:\/\/(?:t\.me|telegram\.me|telegram\.org)\//i.test(target)) return;
      if (isStartLink(target)) {
        seen.add(target);
        starts.push({ target, label });
      } else if (mediaExtension(target)) {
        seen.add(target);
        direct.push({ target, label });
      } else if (isDownloadGate(target, label)) {
        seen.add(target);
        gates.push({ target, label });
      }
    });

    const streams: Stream[] = [];
    for (const row of starts.slice(0, 2)) {
      if (signal?.aborted) break;
      const signed = await resolveStart(providerContext, row.target, page.url, signal, jar).catch(() => undefined);
      if (!signed) continue;
      const quality = qualityFrom(row.label) || qualityFrom(signed) || qualityFrom(page.url);
      const stream = await verify(signed, page.url, quality);
      if (stream) streams.push({ ...stream, server: "MoviesWood Direct" });
    }

    if (streams.length === 0) {
      for (const gate of gates.slice(0, 3)) {
        if (signal?.aborted) break;
        const detail = await loadMovieswoodPage(gate.target, providerContext, signal, jar).catch(() => null);
        if (!detail) continue;
        const title = cheerio.load(detail.html)("title").text() || detail.html.match(/<title[^>]*>([^<]*)/i)?.[1] || "";
        const detail$ = cheerio.load(detail.html);
        let start = "";
        detail$("a[href]").each((_i: number, el: any) => {
          const label = detail$(el).text().replace(/\s+/g, " ").trim();
          const href = detail$(el).attr("href") || "";
          if (start || /^https?:\/\/(?:t\.me|telegram\.me|telegram\.org)\//i.test(href) || !isStartLink(href)) return;
          start = httpUrl(href, detail.url) || "";
        });
        if (!start) continue;
        const signed = await resolveStart(providerContext, start, detail.url, signal, jar).catch(() => undefined);
        if (!signed) continue;
        const quality = qualityFrom(gate.label) || qualityFrom(title) || qualityFrom(detail.url);
        const stream = await verify(signed, detail.url, quality);
        if (stream) streams.push({ ...stream, server: "MoviesWood Direct" });
      }
    }

    if (streams.length === 0) {
      for (const row of direct.slice(0, 3)) {
        const stream = await verify(row.target, page.url, qualityFrom(row.label));
        if (stream) streams.push(stream);
      }
    }

    if (streams.length > 0) return streams;

    // Nothing streamable: keep the entries visible for browser/download.
    const fallback = [...starts, ...gates].slice(0, 4);
    return await Promise.all(fallback.map((row) => classify(row.target, page.url, row.label)));
  } catch (error) {
    throwProviderError("MoviesWood", "stream", error);
  }
}
