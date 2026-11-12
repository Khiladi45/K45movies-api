import { EpisodeLink, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import { isWatchHost, parseDownloadLinks, parsePlayers } from "./utils";

const REQUEST_TIMEOUT_MS = 15_000;

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
  const baseUrl =
    (await getBaseUrl("1tamilblasters")) || "https://www.1tamilblasters.blog";
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
      const content = $(".entry-content").first().length
        ? $(".entry-content").first()
        : $("article").first();

      const players = parsePlayers($, content);
      if (players.length > 0) {
        return players.map((entry, index) => ({
          title: entry.title
            ? entry.title.replace(/^Player/i, "Episode")
            : `Episode ${index + 1}`,
          link: entry.url,
        }));
      }

      // Posts without labeled players still expose download files.
      return parseDownloadLinks($, content).map((entry, index) => ({
        title: entry.title || `Download ${index + 1}`,
        link: entry.url,
      }));
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    throwProviderError("1TamilBlasters", "episodes", err);
  }
};
