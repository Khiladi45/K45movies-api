import { EpisodeLink, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import { cleanText, isWatchHost } from "./utils";

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Series topics list one [W] embed per episode/quality. A watch-embed URL
 * passed straight through is a single playable entry.
 */
export const getEpisodes = async function ({
  url,
  signal,
  providerContext,
}: {
  url: string;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> {
  const { axios, cheerio, commonHeaders } = providerContext;
  const baseUrl = (await getBaseUrl("1tamilmv")) || "https://www.1tamilmv.io";
  const pageUrl = new URL(url, `${baseUrl}/`).href;

  if (isWatchHost(pageUrl)) {
    return [{ title: "Watch Episode", link: pageUrl }];
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await axios.get(pageUrl, {
        headers: commonHeaders,
        signal: controller.signal,
        timeout: REQUEST_TIMEOUT_MS,
      });
      const $ = cheerio.load(
        typeof res.data === "string" ? res.data : String(res.data ?? ""),
      );

      const episodes: EpisodeLink[] = [];
      const seen = new Set<string>();
      $("div[data-role=commentContent] a[href]").each((_i, el) => {
        const href = $(el).attr("href") || "";
        const text = cleanText($(el).text());
        if (!href || (text !== "[W]" && !isWatchHost(href))) return;
        if (seen.has(href)) return;
        seen.add(href);
        episodes.push({
          title: /1080|720|480|360/.test(text)
            ? `Episode ${episodes.length + 1} (${text})`
            : `Episode ${episodes.length + 1}`,
          link: href,
        });
      });
      return episodes;
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    throwProviderError("1TamilMV", "episodes", err);
  }
};
