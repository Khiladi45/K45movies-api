import { EpisodeLink, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import { absolutize, cleanText, isPackUrl } from "./utils";

const REQUEST_TIMEOUT_MS = 15_000;

const episodeTitle = (text: string) => {
  const label = cleanText(text);
  const tag = label.match(/\bS\d{1,2}\s*E\d{1,3}\b/i);
  if (tag) return tag[0].toUpperCase();
  return label
    .replace(/^.*?\.onl?\s*[-–]\s*/i, "")
    .replace(/\.(?:mkv|mp4|zip|rar)$/i, "")
    .slice(0, 80);
};

/**
 * A /pack/ page lists every episode file of one season/quality as
 * `alpha.fxdl.site/file/<hash>` anchors; a /file/ page is one download.
 */
export const getEpisodes = async function ({
  url,
  providerContext,
}: {
  url: string;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> {
  const { axios, cheerio, commonHeaders } = providerContext;
  const baseUrl = (await getBaseUrl("hdmovieslife")) || "https://hdmovies.life";
  const pageUrl = absolutize(url, baseUrl);

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

      if (!isPackUrl(pageUrl)) {
        const title =
          cleanText($("title").text()).replace(/^.*?—\s*/, "") ||
          "Download";
        return [{ title: episodeTitle(title), link: pageUrl }];
      }

      const episodes: EpisodeLink[] = [];
      const seen = new Set<string>();
      $("a[href*='/file/']").each((_i: number, el: any) => {
        const href = absolutize($(el).attr("href") || "", pageUrl);
        if (!href || seen.has(href)) return;
        seen.add(href);
        episodes.push({
          title: episodeTitle($(el).text()) || `Episode ${episodes.length + 1}`,
          link: href,
        });
      });

      // Pack pages don't list episodes in order; sort by SxxExx when known.
      const tagOrder = (title: string) => {
        const match = title.match(/^S(\d{1,2})E(\d{1,3})$/i);
        return match ? Number(match[1]) * 1000 + Number(match[2]) : Infinity;
      };
      return episodes.sort((a, b) => tagOrder(a.title) - tagOrder(b.title));
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    throwProviderError("HDMoviesLife", "episodes", err);
  }
};
