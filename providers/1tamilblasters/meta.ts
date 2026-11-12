import { Info, Link, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import {
  cleanText,
  displayTitle,
  getQuality,
  isSeriesTitle,
  parseDownloadLinks,
  parsePlayers,
} from "./utils";

const REQUEST_TIMEOUT_MS = 15_000;

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

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const { axios, cheerio, commonHeaders } = providerContext;
  const baseUrl =
    (await getBaseUrl("1tamilblasters")) || "https://www.1tamilblasters.blog";
  const url = new URL(link, `${baseUrl}/`).href;

  try {
    const html = await fetchHtml(axios, url, commonHeaders);
    const $ = cheerio.load(html);

    const heading =
      cleanText($("h1.entry-title").first().text()) ||
      cleanText($("h1").first().text()) ||
      cleanText($("meta[property='og:title']").attr("content")) ||
      cleanText($("title").text());
    const title = displayTitle(heading) || heading;

    const image = cleanText($("meta[property='og:image']").attr("content"));

    const content = $(".entry-content").first().length
      ? $(".entry-content").first()
      : $("article").first();

    // The template's first paragraph / meta description is a "Movie Name:
    // ... Directed by: ... Starring by: ..." fact sheet, not a synopsis.
    const isMetaBlurb = (text: string) =>
      /^(?:movie|film)\s*name\s*:|directed (?:and written )?by\s*:|starring by\s*:|^genres?\s*:/i.test(
        text,
      );

    const paragraphs: string[] = [];
    content.find("p").each((_i: number, el: any) => {
      const text = cleanText($(el).text());
      if (
        text &&
        !isMetaBlurb(text) &&
        !/^(?:player|episode|ep)\s*[:\-–]?\s*\d+/i.test(text) &&
        !/^(?:quality|format)/i.test(text)
      ) {
        paragraphs.push(text);
      }
    });
    const metaDescription =
      cleanText($("meta[property='og:description']").attr("content")) ||
      cleanText($("meta[name='description']").attr("content")) ||
      "";
    const synopsis =
      (metaDescription && !isMetaBlurb(metaDescription)
        ? metaDescription
        : "") ||
      paragraphs.sort((a, b) => b.length - a.length)[0] ||
      "";

    const players = parsePlayers($, content);
    const downloads = parseDownloadLinks($, content);
    const pageText = `${heading} ${paragraphs.join(" ")}`;
    const isSeries = isSeriesTitle(pageText) || isSeriesTitle(url);

    const linkList: Link[] = [];
    if (players.length > 0) {
      linkList.push({
        title: isSeries ? "Watch Episodes" : "Watch Online",
        quality: players[0]?.quality || getQuality(heading),
        directLinks: players.map((entry, index) => ({
          title: isSeries
            ? entry.title.replace(/^Player/i, "Episode")
            : entry.title || `Player ${index + 1}`,
          link: entry.url,
          type: isSeries ? "series" : "movie",
        })),
      });
    }
    if (downloads.length > 0) {
      linkList.push({
        title: "Download",
        directLinks: downloads.map((entry) => ({
          title: entry.title,
          link: entry.url,
          type: isSeries ? "series" : "movie",
        })),
      });
    }

    return {
      title,
      synopsis,
      image,
      imdbId: "",
      tags: [],
      type: isSeries ? "series" : "movie",
      linkList,
      webUrl: url,
    };
  } catch (err) {
    throwProviderError("1TamilBlasters", "metadata", err);
  }
};
