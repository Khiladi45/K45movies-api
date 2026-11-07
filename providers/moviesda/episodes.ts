import { EpisodeLink, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import {
  absoluteUrl,
  cleanText,
  collectFolderLinks,
  fetchWithDeadline,
} from "./utils";

/**
 * Used for series: meta passes a quality page (e.g. `/...-season-01-720p-hd-web-series/`),
 * which lists one `.folder` block per episode.
 */
export const getEpisodes = async function ({
  url,
  providerContext,
}: {
  url: string;
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> {
  const { axios, cheerio, commonHeaders } = providerContext;
  const baseUrl = await getBaseUrl("moviesda");
  const pageUrl = absoluteUrl(baseUrl, url);

  try {
    const data = await fetchWithDeadline(
      axios,
      pageUrl,
      commonHeaders,
      undefined,
      12_000,
    );
    const $ = cheerio.load(data);

    const episodes: EpisodeLink[] = [];
    const seen = new Set<string>();

    $(".folder").each((_i, el) => {
      const anchor = $(el).find(".left ul li a[href]").first();
      const href = anchor.attr("href");
      if (!href) return;

      const link = absoluteUrl(baseUrl, href);
      if (!link || seen.has(link)) return;
      seen.add(link);

      const fileName =
        cleanText(anchor.text()) ||
        cleanText($(el).find(".tblimg img").attr("alt"));
      const image = absoluteUrl(
        baseUrl,
        $(el).find(".tblimg img[src]").first().attr("src"),
      );
      const size = cleanText($(el).find(".left ul li").eq(1).text()).replace(
        /^file size\s*:\s*/i,
        "",
      );

      const episodeNumber = fileName.match(/\bEpi(?:sode)?\s*[-_ ]?(\d+)/i);
      const title = episodeNumber
        ? `Episode ${episodeNumber[1].padStart(2, "0")}`
        : fileName.replace(/^moviesda\.mobi\s*-\s*/i, "").replace(/\.mp4$/i, "") ||
          `Episode ${episodes.length + 1}`;

      episodes.push({
        title,
        link,
        image,
        description: size || undefined,
      });
    });

    if (episodes.length > 0) {
      return episodes.sort((a, b) => episodeIndex(a.title) - episodeIndex(b.title));
    }

    // Fallback: a season/version page that links to multiple qualities.
    return collectFolderLinks($, baseUrl).map((item) => ({
      title: item.title,
      link: item.url,
    }));
  } catch (err) {
    throwProviderError("Moviesda", "episodes", err);
  }
};

function episodeIndex(title: string) {
  const match = title.match(/(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}
