import { Post, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import { absolutize, cleanText } from "./utils";

const REQUEST_TIMEOUT_MS = 15_000;
const HTML_TTL_MS = 3 * 60_000;
const htmlCache = new Map<string, { at: number; html: string }>();

async function fetchText(
  axios: any,
  url: string,
  signal: AbortSignal | undefined,
  headers: Record<string, string>,
) {
  const cached = htmlCache.get(url);
  if (cached && Date.now() - cached.at < HTML_TTL_MS) return cached.html;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onOuterAbort = () => controller.abort();
  signal?.addEventListener("abort", onOuterAbort);
  try {
    const res = await axios.get(url, {
      signal: controller.signal,
      headers,
      timeout: REQUEST_TIMEOUT_MS,
      maxRedirects: 5,
    });
    const html =
      typeof res.data === "string" ? res.data : String(res.data ?? "");
    if (html) {
      if (htmlCache.size >= 6) htmlCache.delete(htmlCache.keys().next().value!);
      htmlCache.set(url, { at: Date.now(), html });
    }
    return html;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onOuterAbort);
  }
}

const withPage = (url: string, page: number) => {
  if (page <= 1) return url;
  return url.includes("?")
    ? `${url}&page=${page}`
    : `${url.replace(/\/+$/, "")}/page/${page}`;
};

/** List pages render one <article class="movie-card"> per title. */
function parseCards($: any, baseUrl: string): Post[] {
  const out: Post[] = [];
  const seen = new Set<string>();
  $(".movie-card").each((_i: number, el: any) => {
    const node = $(el);
    const anchor = node.find(".movie-title a").first();
    const href =
      anchor.attr("href") || node.find("a.movie-poster-box").attr("href") || "";
    if (!href) return;
    const link = absolutize(href, baseUrl);
    if (seen.has(link)) return;
    seen.add(link);

    const img = node.find(".movie-poster-img, img").first();
    const image = absolutize(img.attr("src") || img.attr("data-src") || "", baseUrl);
    const title = cleanText(anchor.text()) || cleanText(img.attr("alt"));
    if (!title) return;

    out.push({ title, link, image });
  });
  return out;
}

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
  const { axios, cheerio, commonHeaders } = providerContext;
  const baseUrl = (await getBaseUrl("hdmovieslife")) || "https://hdmovies.life";
  const headers = commonHeaders || {};
  const path = filter && filter !== "/" ? filter : "/movies";
  const url = withPage(
    `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`,
    page,
  );

  try {
    const html = await fetchText(axios, url, signal, headers);
    return parseCards(cheerio.load(html), baseUrl);
  } catch (err) {
    throwProviderError("HDMoviesLife", "posts", err);
  }
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
  const { axios, cheerio, commonHeaders } = providerContext;
  const baseUrl = (await getBaseUrl("hdmovieslife")) || "https://hdmovies.life";
  const headers = commonHeaders || {};
  const query = cleanText(searchQuery);
  if (!query) return [];

  try {
    const url = withPage(
      `${baseUrl}/search?q=${encodeURIComponent(query)}`,
      page,
    );
    const html = await fetchText(axios, url, signal, headers);
    return parseCards(cheerio.load(html), baseUrl);
  } catch (err) {
    throwProviderError("HDMoviesLife", "search posts", err);
  }
};
