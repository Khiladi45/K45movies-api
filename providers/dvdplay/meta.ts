import type { Info, Link, ProviderContext } from "../types";
import { throwProviderError } from "../providerErrors";
import { httpUrl, qualityFrom, responseUrl } from "../extractors/httpMedia";
import { dvdplayBaseUrl } from "./posts";

export async function getMeta({
  link, signal, providerContext,
}: {
  link: string;
  signal?: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Info> {
  try {
    const url = httpUrl(link, await dvdplayBaseUrl());
    if (!url) throw new Error("Invalid movie URL");
    const { axios, cheerio, commonHeaders } = providerContext;
    const response = await axios.get(url, { headers: commonHeaders, signal, timeout: 12_000 });
    const landing = responseUrl(response, url);
    const $ = cheerio.load(response.data);
    const title = $("title").text().trim() || $("h1").first().text().trim();
    if (!title) throw new Error("Movie title is missing");
    const linkList: Link[] = [];
    const seen = new Set<string>();
    $("a[href]").each((_i, el) => {
      const anchor = $(el);
      const target = httpUrl(anchor.attr("href"), landing);
      if (!target || seen.has(target)) return;
      const parsed = new URL(target);
      if (parsed.origin !== new URL(landing).origin || !/^\/download\/file\//.test(parsed.pathname)) return;
      seen.add(target);
      const label = anchor.text().replace(/[⇩↓]/g, "").replace(/\s+/g, " ").trim();
      const quality = qualityFrom(label);
      const name = label || "Download";
      linkList.push({ title: name, quality, directLinks: [{ title: name, link: target, type: "movie" }] });
    });
    return {
      title,
      synopsis: $("meta[name='description']").attr("content")?.trim() || "",
      image: httpUrl($("meta[property='og:image']").attr("content") || $("main img").first().attr("src"), landing) || "",
      imdbId: "",
      tags: [],
      type: "movie",
      linkList,
      webUrl: landing,
    };
  } catch (error) {
    throwProviderError("DVDPlay", "metadata", error);
  }
}
