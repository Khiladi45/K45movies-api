import type { ProviderContext, Stream } from "../types";
import { throwProviderError } from "../providerErrors";
import { httpUrl, mediaExtension, probeMedia, responseUrl, qualityFrom } from "../extractors/httpMedia";
import { hubCloudCandidates } from "../extractors/directFiles";
import { getMeta } from "./meta";
import { dvdplayBaseUrl } from "./posts";

export async function getStream({
  link, signal, providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Stream[]> {
  const { axios, cheerio, commonHeaders } = providerContext;
  try {
    let url = httpUrl(link, await dvdplayBaseUrl());
    if (!url) throw new Error("Invalid download page URL");
    let quality: string | undefined;
    if (/^\/page-\d+-/.test(new URL(url).pathname)) {
      const meta = await getMeta({ link: url, signal, providerContext });
      const group = meta.linkList.find((entry) => entry.quality === "720") || meta.linkList[0];
      url = group?.directLinks?.[0]?.link;
      quality = group?.quality;
      if (!url) return [];
    }
    const response = await axios.get(url, { headers: commonHeaders, signal, timeout: 12_000 });
    const landing = responseUrl(response, url);
    const pageTitle = cheerio.load(String(response.data || ""))("title").text();
    const $ = cheerio.load(response.data);
    const candidates = new Map<string, { server: string; quality?: string }>();
    $("a[href]").each((_i, el) => {
      const anchor = $(el);
      const label = anchor.text().replace(/\s+/g, " ").trim();
      const match = label.match(/\bserver\s*([1-3])\b|google drive/i);
      const target = httpUrl(anchor.attr("href"), landing);
      if (target && match && !candidates.has(target)) {
        const server = /google drive/i.test(label) ? "DVDPlay Google Drive" : `DVDPlay Server ${match[1]}`;
        candidates.set(target, { server, quality: qualityFrom(label) });
      }
    });

    const streams: Stream[] = [];
    for (const [target, info] of [...candidates].slice(0, 4)) {
      if (signal?.aborted) break;
      const headers = { ...commonHeaders, Referer: landing };
      const resolvedQuality = info.quality || quality || qualityFrom(pageTitle);
      try {
        if (/hubcloud\./i.test(target)) {
          // Server 1 wraps a HubCloud page whose PixelDrain mirror streams.
          const links = await hubCloudCandidates(axios, cheerio, target, headers, signal);
          let verified = false;
          for (const candidate of links) {
            const fileHeaders = { ...commonHeaders, Referer: `${new URL(candidate).origin}/` };
            const type = await probeMedia(axios, candidate, fileHeaders, signal, true);
            if (!type) continue;
            streams.push({ server: `${info.server} Direct`, link: candidate, type, quality: resolvedQuality, headers: fileHeaders });
            verified = true;
            break;
          }
          if (verified) continue;
        }
        const type = mediaExtension(target)
          ? await probeMedia(axios, target, headers, signal)
          : undefined;
        streams.push(type
          ? { server: info.server, link: target, type, quality: resolvedQuality, headers }
          : { server: info.server, link: target, type: "embed", quality: resolvedQuality, downloadOnly: true });
      } catch {
        streams.push({ server: info.server, link: target, type: "embed", quality: resolvedQuality, downloadOnly: true });
      }
    }
    return streams;
  } catch (error) {
    throwProviderError("DVDPlay", "stream", error);
  }
}
