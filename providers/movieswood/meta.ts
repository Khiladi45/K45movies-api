import type { Info, Link, ProviderContext } from "../types";
import { throwProviderError } from "../providerErrors";
import { httpUrl, qualityFrom } from "../extractors/httpMedia";
import { loadMovieswoodPage, movieswoodBaseUrl } from "./posts";

export async function getMeta({
  link, signal, providerContext,
}: {
  link: string;
  signal?: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Info> {
  try {
    const url = httpUrl(link, await movieswoodBaseUrl());
    if (!url) throw new Error("Invalid movie URL");
    const page = await loadMovieswoodPage(url, providerContext, signal);
    const $ = providerContext.cheerio.load(page.html);
    const title = ($("h1").first().text() || $("h2").first().text() || $("title").text())
      .replace(/\s*[-|]\s*MoviesWood\s*$/i, "").trim();
    if (!title) throw new Error("MoviesWood returned no movie details.");

    const linkList: Link[] = [];
    const seen = new Set<string>();
    $("a[href]").each((_i, el) => {
      const anchor = $(el);
      const label = anchor.text().replace(/\s+/g, " ").trim();
      if (!/\b(?:download|\d+(?:\.\d+)?\s*[mg]b|\d{3,4}p|4k)\b/i.test(label)) return;
      const target = httpUrl(anchor.attr("href"), page.url);
      if (!target || target === page.url || seen.has(target)) return;
      seen.add(target);
      linkList.push({
        title: label,
        quality: qualityFrom(label),
        directLinks: [{ title: label, link: target, type: "movie" }],
      });
    });
    return {
      title,
      synopsis: $("meta[name='description']").attr("content")?.trim() || "",
      image: httpUrl($("meta[property='og:image']").attr("content") || $("main img").first().attr("src"), page.url) || "",
      imdbId: "",
      tags: [],
      type: "movie",
      linkList,
      webUrl: page.url,
    };
  } catch (error) {
    throwProviderError("MoviesWood", "metadata", error);
  }
}
