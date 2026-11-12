import { Info, Link, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import {
  cleanText,
  formValues,
  getQuality,
  isPackUrl,
  qualityRank,
  seasonLabel,
} from "./utils";

const REQUEST_TIMEOUT_MS = 15_000;

type DownloadEntry = {
  url: string;
  label: string;
  quality?: string;
  size: string;
  tier: string;
  season: string;
};

async function fetchHtml(axios: any, url: string, headers: any): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await axios.get(url, {
      headers,
      signal: controller.signal,
      timeout: REQUEST_TIMEOUT_MS,
    });
    return typeof res.data === "string" ? res.data : String(res.data ?? "");
  } finally {
    clearTimeout(timer);
  }
}

/** Keep one entry per URL, preferring the highest quality tier. */
const dedupeByUrl = (entries: DownloadEntry[]) => {
  const map = new Map<string, DownloadEntry>();
  for (const entry of entries) {
    const seen = map.get(entry.url);
    if (
      !seen ||
      qualityRank(entry.quality) > qualityRank(seen.quality)
    ) {
      map.set(entry.url, entry);
    }
  }
  return [...map.values()];
};

const entryTitle = (entry: DownloadEntry) =>
  [entry.quality, entry.label, entry.size].filter(Boolean).join(" ");

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const { axios, cheerio, commonHeaders } = providerContext;
  const baseUrl = (await getBaseUrl("hdmovieslife")) || "https://hdmovies.life";
  const url = new URL(link, `${baseUrl}/`).href;

  try {
    const html = await fetchHtml(axios, url, commonHeaders);
    const $ = cheerio.load(html);

    const title =
      cleanText($("h1.movie-details-title").first().text()) ||
      cleanText($("h1").first().text()) ||
      cleanText($("meta[property='og:title']").attr("content"));

    const image = cleanText(
      $("meta[property='og:image']").attr("content") ||
        $(".movie-details-poster").attr("src") ||
        "",
    );

    const synopsis =
      cleanText($(".movie-storyline p").first().text()) ||
      cleanText($("meta[name='description']").attr("content"));

    const tags: string[] = [];
    $(".movie-meta-tags .meta-pill").each((_i: number, el: any) => {
      const text = cleanText($(el).text());
      if (text && !/views|dls|⬇|👁/i.test(text) && tags.length < 8) {
        tags.push(text);
      }
    });

    const entries: DownloadEntry[] = [];
    $("form.dl-post-form").each((_i: number, el: any) => {
      const values = formValues($, el);
      const downloadUrl = values.url || "";
      // "[Quick Download]" points at an ad gateway; only the Fast Drive
      // (hdlinks) entries lead to a downloadable file.
      if (!/hdlinks\.online/i.test(downloadUrl)) return;
      entries.push({
        url: downloadUrl,
        label: cleanText(values.label) || "Download",
        quality: getQuality(values.quality || values.tier_title || ""),
        size: cleanText(values.size),
        tier: cleanText(values.tier_title),
        season: seasonLabel(values.tier_title),
      });
    });

    const isSeries =
      /\/(?:series|tv)\//i.test(url) ||
      entries.some((entry) => /season\s*\d/i.test(entry.tier));

    const linkList: Link[] = [];

    if (!isSeries) {
      const files = dedupeByUrl(entries);
      if (files.length > 0) {
        linkList.push({
          title: "Download",
          directLinks: files.map((entry) => ({
            title: entryTitle(entry),
            link: entry.url,
            type: "movie",
          })),
        });
      }
    } else {
      const groups = new Map<string, DownloadEntry[]>();
      for (const entry of entries) {
        const key = entry.season;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(entry);
      }

      const seasons = [...groups.keys()].sort((a, b) => {
        const na = Number(a.match(/\d+/)?.[0] || 0);
        const nb = Number(b.match(/\d+/)?.[0] || 0);
        return na - nb;
      });

      for (const season of seasons) {
        const group = groups.get(season) || [];
        const packs = dedupeByUrl(group.filter((entry) => isPackUrl(entry.url)));
        if (packs.length > 0) {
          const best = packs.reduce((a, b) =>
            qualityRank(b.quality) > qualityRank(a.quality) ? b : a,
          );
          linkList.push({
            title: `${season} (${best.quality || "HD"})`,
            quality: best.quality,
            // The pack page lists one file per episode; episodes.ts reads it.
            episodesLink: best.url,
          });
          continue;
        }

        const files = dedupeByUrl(group.filter((entry) => !isPackUrl(entry.url)));
        if (files.length > 0) {
          linkList.push({
            title: season,
            directLinks: files.map((entry) => ({
              title: entryTitle(entry),
              link: entry.url,
              type: "series",
            })),
          });
        }
      }
    }

    return {
      title,
      synopsis,
      image,
      imdbId: "",
      tags,
      type: isSeries ? "series" : "movie",
      linkList,
      webUrl: url,
    };
  } catch (err) {
    throwProviderError("HDMoviesLife", "metadata", err);
  }
};
