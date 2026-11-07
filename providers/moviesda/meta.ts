import { Info, Link, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import {
  absoluteUrl,
  cleanText,
  collectFolderLinks,
  fetchWithDeadline,
  FolderLink,
  getQuality,
  posterFor,
} from "./utils";

// A movie page only links to its version pages (Original / PreDVD / Season 01),
// and those link to the actual quality pages. One expansion level is enough.
const MAX_PAGE_FETCHES = 8;

type ContentNode = FolderLink & { parent?: string; depth?: number };

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const { axios, cheerio, commonHeaders } = providerContext;
  const baseUrl = await getBaseUrl("moviesda");
  const url = absoluteUrl(baseUrl, link);

  try {
    const html = await fetchWithDeadline(
      axios,
      url,
      commonHeaders,
      undefined,
      12_000,
    );
    const $ = cheerio.load(html);

    const infoRows: Record<string, string> = {};
    $("ul.movie-info li").each((_i, el) => {
      const key = cleanText($(el).find("strong").first().text())
        .replace(/:\s*$/, "")
        .toLowerCase();
      const value = cleanText($(el).find("span").first().text());
      if (key && value) infoRows[key] = value;
    });

    // Series pages have no <h1>/movie-info block, so the fallback is the raw
    // document title ("<Name> (2026) Tamil Web Series Download Moviesda").
    const title = (
      cleanText(infoRows.movie) ||
      cleanText($("h1").first().text()) ||
      cleanText($("title").text())
    )
      .replace(
        /\s*(?:Tamil\s+)?(?:Web Series|Movie[s]?)\s+Download\s+Moviesda.*$/i,
        "",
      )
      .replace(/\s*[-|]\s*Moviesda.*$/i, "")
      .trim();

    const image =
      absoluteUrl(
        baseUrl,
        $("picture img[src]").first().attr("src") ||
          $(".movie-info-container img[src]").first().attr("src") ||
          $("img.screenshot-img[src]").first().attr("src") ||
          "",
      ) || posterFor(url);

    const synopsis =
      cleanText($(".movie-synopsis").text()).replace(
        /^synopsis\s*:?\s*/i,
        "",
      ) || cleanText($("p.pageDescr").text());

    const tags = cleanText(infoRows.genres)
      .split(",")
      .map((tag) => cleanText(tag))
      .filter(Boolean);

    const cast = cleanText(infoRows.starring)
      .split(",")
      .map((name) => cleanText(name))
      .filter(Boolean);

    const rating = cleanText(infoRows["movie rating"]).replace(/\s*\/\s*10$/, "");

    const children = collectFolderLinks($, baseUrl);
    const type =
      /web-series/i.test(url) ||
      /season\s*\d+/i.test(children.map((child) => child.title).join(" "))
        ? "series"
        : "movie";

    const hasDirectFolders = $(
      ".folder .left ul li a[href], .folder .dlink a[href]",
    ).length;

    let linkList: Link[] = [];

    if (children.length > 0) {
      const leaves = await resolveQualityNodes(
        children,
        axios,
        cheerio,
        baseUrl,
        commonHeaders,
      );
      linkList = buildLinks(leaves, type);
    }

    if (linkList.length === 0 && hasDirectFolders) {
      const quality = getQuality(title, url);
      linkList = [
        type === "series"
          ? { title: title || "Episodes", quality, episodesLink: url }
          : {
              title: title || "Download",
              quality,
              directLinks: [
                { title: title || "Download", link: url, type: "movie" },
              ],
            },
      ];
    }

    if (linkList.length === 0 && type === "series") {
      linkList = [{ title: title || "Episodes", episodesLink: url }];
    }

    return {
      title,
      synopsis,
      image,
      imdbId: "",
      tags,
      cast,
      rating,
      type,
      linkList,
      webUrl: url,
    };
  } catch (err) {
    throwProviderError("Moviesda", "metadata", err);
  }
};

async function resolveQualityNodes(
  start: FolderLink[],
  axios: ProviderContext["axios"],
  cheerio: ProviderContext["cheerio"],
  baseUrl: string,
  headers: ProviderContext["commonHeaders"],
): Promise<ContentNode[]> {
  let frontier: ContentNode[] = start.map((item) => ({
    ...item,
    depth: 0,
  }));
  const leaves: ContentNode[] = [];
  let fetches = 0;

  while (frontier.length > 0) {
    const next: ContentNode[] = [];

    for (const node of frontier) {
      const depth = node.depth ?? 0;
      if (getQuality(node.title) || depth >= 2 || fetches >= MAX_PAGE_FETCHES) {
        leaves.push(node);
        continue;
      }

      fetches++;
      let sub: FolderLink[] = [];
      try {
        const html = await fetchWithDeadline(
          axios,
          node.url,
          headers,
          undefined,
          10_000,
        );
        sub = collectFolderLinks(cheerio.load(html), baseUrl);
      } catch {
        // Keep the node as a leaf; getStream can still walk further.
      }

      if (sub.length === 0) {
        leaves.push(node);
        continue;
      }

      for (const child of sub) {
        next.push({ ...child, parent: node.title, depth: depth + 1 });
      }
    }

    frontier = next;
  }

  return leaves;
}

function buildLinks(nodes: ContentNode[], type: string): Link[] {
  const titleCounts = new Map<string, number>();
  for (const node of nodes) {
    titleCounts.set(node.title, (titleCounts.get(node.title) || 0) + 1);
  }

  const links: Link[] = [];
  const seen = new Set<string>();

  for (const node of nodes) {
    if (!node.url || seen.has(node.url)) continue;
    seen.add(node.url);

    const duplicateTitle = (titleCounts.get(node.title) || 0) > 1;
    const label =
      duplicateTitle && node.parent
        ? `${node.parent} · ${node.title}`
        : node.title;
    const quality = getQuality(node.title, node.url);

    if (type === "series") {
      links.push({ title: label, quality, episodesLink: node.url });
    } else {
      links.push({
        title: label,
        quality,
        directLinks: [{ title: label, link: node.url, type: "movie" }],
      });
    }
  }

  return links.sort(
    (a, b) => Number(b.quality || 0) - Number(a.quality || 0),
  );
}
