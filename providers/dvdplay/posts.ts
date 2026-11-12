import type { Post, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import { httpUrl, responseUrl } from "../extractors/httpMedia";

export async function dvdplayBaseUrl() {
  const url = await getBaseUrl("dvdplay").catch(() => "");
  return (url || "https://dvdplay.singles").replace(/^http:\/\/dvdplay\.singles(?=\/|$)/i, "https://dvdplay.singles");
}

export async function getPosts({
  filter, page, signal, providerContext,
}: {
  filter: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  try {
    const url = new URL(filter, await dvdplayBaseUrl());
    if (page > 1) {
      url.searchParams.set("page", String(page));
      url.search = url.searchParams.toString();
    }
    const { axios, cheerio, commonHeaders } = providerContext;
    const response = await axios.get(url.href, { headers: commonHeaders, signal, timeout: 12_000 });
    const landing = responseUrl(response, url.href);
    const $ = cheerio.load(response.data);
    const rows = new Map<string, Post>();
    $("a[href]").each((_i, el) => {
      const anchor = $(el);
      const link = httpUrl(anchor.attr("href"), landing);
      const title = anchor.text().trim();
      if (link && title && new URL(link).origin === new URL(landing).origin &&
          /^\/page-\d+-/.test(new URL(link).pathname)) {
        rows.set(link, { title, link, image: "" });
      }
    });
    return [...rows.values()];
  } catch (error) {
    throwProviderError("DVDPlay", "posts", error);
  }
}

export async function getSearchPosts(): Promise<Post[]> {
  throwProviderError("DVDPlay", "search", new Error("Search is unavailable. Browse the categories."));
}
