import { Post, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import { cleanText, collectFolderLinks, posterFor } from "./utils";

const MAX_SEARCH_LETTER_PAGES = 8;

const withPage = (url: string, page: number) => {
  if (!page || page <= 1) return url;
  const target = new URL(url);
  target.searchParams.set("page", String(page));
  return target.href;
};

export const getPosts = async function ({
  filter,
  page,
  signal,
  providerContext,
}: {
  filter: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const { cheerio } = providerContext;
  const baseUrl = await getBaseUrl("moviesda");
  const url = withPage(`${baseUrl}${filter || "/"}`, page);
  return posts({ url, signal, cheerio, operation: "posts" });
};

/**
 * The site's own search box redirects to brave.com. Its A-Z index
 * (/tamil-movies/<letter>/) is an on-site, paginated title index instead, so
 * search scans the index for the query's first letter and filters by title.
 */
export const getSearchPosts = async function ({
  searchQuery,
  signal,
  providerContext,
}: {
  searchQuery: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const { cheerio } = providerContext;
  const query = cleanText(searchQuery);
  const first = query.charAt(0).toLowerCase();
  if (!/[a-z]/.test(first)) return [];

  try {
    const baseUrl = await getBaseUrl("moviesda");
    const letterUrl = `${baseUrl}/tamil-movies/${first}/`;
    const firstHtml = await fetchText(withPage(letterUrl, 1), signal);

    const $first = cheerio.load(firstHtml);
    const totalPages = Number(cleanText($first("#totalPages").text())) || 1;
    const pageNumbers: number[] = [];
    for (let p = 2; p <= Math.min(totalPages, MAX_SEARCH_LETTER_PAGES); p++) {
      pageNumbers.push(p);
    }

    const extraHtml = await Promise.all(
      pageNumbers.map((p) =>
        fetchText(withPage(letterUrl, p), signal).catch(() => ""),
      ),
    );

    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const results: Post[] = [];
    const seen = new Set<string>();
    const matches = (title: string) => {
      const lower = title.toLowerCase();
      return tokens.every((token) =>
        /^\d+$/.test(token)
          ? new RegExp(`\\b${token}\\b`).test(lower)
          : lower.includes(token),
      );
    };

    for (const html of [firstHtml, ...extraHtml]) {
      if (!html) continue;
      const $ = cheerio.load(html);
      for (const item of collectFolderLinks($, baseUrl)) {
        const title = cleanText(item.title);
        if (!matches(title)) continue;
        if (seen.has(item.url)) continue;
        seen.add(item.url);
        results.push({
          title,
          link: item.url,
          image: posterFor(item.url),
        });
      }
    }

    return results;
  } catch (err) {
    throwProviderError("Moviesda", "search posts", err);
  }
};

async function fetchText(url: string, signal?: AbortSignal) {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} | URL ${url}`);
  }
  return res.text();
}

async function posts({
  url,
  signal,
  cheerio,
  operation,
}: {
  url: string;
  signal: AbortSignal;
  cheerio: ProviderContext["cheerio"];
  operation: string;
}): Promise<Post[]> {
  try {
    const data = await fetchText(url, signal);
    const $ = cheerio.load(data);
    const baseUrl = new URL(url).origin;

    return collectFolderLinks($, baseUrl).map((item) => ({
      title: item.title,
      link: item.url,
      image: posterFor(item.url),
    }));
  } catch (err) {
    throwProviderError("Moviesda", operation, err);
  }
}
