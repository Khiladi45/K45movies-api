import { Post, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";

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
  const url = `${baseUrl}${filter}`;
  return posts({ url, signal, cheerio, operation: "posts" });
};

export const getSearchPosts = async function ({
  searchQuery,
  page,
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
  const baseUrl = await getBaseUrl("moviesda");
  const url = `${baseUrl}/?s=${encodeURIComponent(searchQuery)}`;
  return posts({ url, signal, cheerio, operation: "search posts" });
};

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
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} | URL ${url}`);
    }
    const data = await res.text();
    const $ = cheerio.load(data);
    const catalog: Post[] = [];

    $('h2 a, .post-title a, a[href*="/movie/"]').each((i, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr("href");
      if (title && link) {
        catalog.push({ title, link, image: "" });
      }
    });
    return catalog;
  } catch (err) {
    throwProviderError("Moviesda", operation, err);
  }
}
