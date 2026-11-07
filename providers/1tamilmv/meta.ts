import { Info, Link, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import {
  cleanText,
  displayTitle,
  getQuality,
  isShortLink,
  isTopicUrl,
  isWatchHost,
} from "./utils";

const REQUEST_TIMEOUT_MS = 15_000;

async function fetchHtml(
  axios: any,
  url: string,
  headers: any,
): Promise<string> {
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

/** [W] watch embeds + "watch online" shortlinks found across a topic's posts. */
function watchLinksFromTopic($: any, baseUrl: string) {
  const links: { label: string; url: string }[] = [];
  const seen = new Set<string>();
  $("div[data-role=commentContent] a[href]").each((_i: number, el: any) => {
    const href = $(el).attr("href") || "";
    const text = cleanText($(el).text());
    if (!href) return;
    const url = href.startsWith("http") ? href : new URL(href, `${baseUrl}/`).href;
    if (text === "[W]" || isWatchHost(url)) {
      if (!seen.has(url)) {
        seen.add(url);
        links.push({ label: text === "[W]" ? "Watch Online" : text || "Watch Online", url });
      }
    } else if (isShortLink(url) && /1080|720|watch|watch online/i.test(text)) {
      if (!seen.has(url)) {
        seen.add(url);
        links.push({ label: text, url });
      }
    }
  });
  return links;
}

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const { axios, cheerio, commonHeaders } = providerContext;
  const baseUrl = (await getBaseUrl("1tamilmv")) || "https://www.1tamilmv.io";
  const url = new URL(link, `${baseUrl}/`).href;

  try {
    // Direct watch-embed link (from the watch-online catalog or search):
    // resolve the player config so the detail page gets a real stream.
    if (!isTopicUrl(url) && (isWatchHost(url) || isShortLink(url))) {
      const html = await fetchHtml(axios, url, commonHeaders);
      const $ = cheerio.load(html);
      const pageTitle =
        cleanText($("title").text())
          .replace(/^www\.[^ ]*\s*-\s*/i, "")
          .replace(/\s*-\s*(LuluStream|.*Stream)$/i, "") || "Watch Online";
      const quality = getQuality(pageTitle);

      return {
        title: displayTitle(pageTitle) || pageTitle,
        synopsis: "",
        image: cleanText($("meta[property='og:image']").attr("content")),
        imdbId: "",
        tags: [],
        type: "movie",
        linkList: [
          {
            title: "Watch Online",
            quality,
            directLinks: [{ title: "Watch Online", link: url, type: "movie" }],
          },
        ],
        webUrl: url,
      };
    }

    // Forum topic page.
    const html = await fetchHtml(axios, url, commonHeaders);
    const $ = cheerio.load(html);

    const releaseTitle =
      cleanText($("h1.ipsType_pageTitle").first().text()) ||
      cleanText($("title").text());
    const title = displayTitle(releaseTitle) || releaseTitle;

    const synopsis =
      cleanText($("meta[property='og:description']").attr("content")) ||
      cleanText($("div[data-role=commentContent]").first().find("p").first().text());

    const image = cleanText($("meta[property='og:image']").attr("content"));

    const isSeries = /\bS\d{2}\b|season\s*\d|web[\s-]?series|episode|E\d{2}\b/i.test(
      releaseTitle,
    );

    const watchLinks = watchLinksFromTopic($, baseUrl);
    const linkList: Link[] = watchLinks.map((entry) => {
      const quality = getQuality(entry.label) || getQuality(releaseTitle);
      return isSeries
        ? { title: entry.label, quality, episodesLink: entry.url }
        : {
            title: entry.label,
            quality,
            directLinks: [{ title: entry.label, link: entry.url, type: "movie" }],
          };
    });

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
    throwProviderError("1TamilMV", "metadata", err);
  }
};
