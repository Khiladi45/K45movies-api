import { Post, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import { cleanText, displayTitle } from "./utils";

const REQUEST_TIMEOUT_MS = 15_000;
// Category pages are re-read on every tab page; keep a few around so paging
// back and forth does not re-hit the site.
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

const pageUrl = (url: string, page: number) => {
  if (page <= 1) return url;
  const clean = url.replace(/\/+$/, "");
  return `${clean}/page/${page}/`;
};

/** WordPress archive markup: every entry is an <article> with header + thumb. */
function parseArticles($: any, baseUrl: string): Post[] {
  const out: Post[] = [];
  const seen = new Set<string>();
  $("article").each((_i: number, el: any) => {
    const node = $(el);
    const anchor = node.find(".entry-title a, h2 a, h3 a").first();
    const href = anchor.attr("href") || "";
    if (!href) return;
    const link = /^https?:\/\//i.test(href) ? href : new URL(href, baseUrl).href;
    if (seen.has(link)) return;
    seen.add(link);

    const img = node.find(".nv-post-thumbnail-wrap img, .wp-post-image, img").first();
    const image =
      img.attr("src") ||
      img.attr("data-src") ||
      img.attr("data-lazy-src") ||
      "";

    out.push({
      title: displayTitle(cleanText(anchor.text())) || cleanText(anchor.text()),
      link,
      image: image ? new URL(image, baseUrl).href : "",
    });
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
  const baseUrl =
    (await getBaseUrl("1tamilblasters")) || "https://www.1tamilblasters.blog";
  const headers = commonHeaders || {};
  const path = !filter || filter === "/" ? "/" : filter;
  const url = pageUrl(
    `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`,
    page,
  );

  try {
    const html = await fetchText(axios, url, signal, headers);
    return parseArticles(cheerio.load(html), baseUrl);
  } catch (err) {
    throwProviderError("1TamilBlasters", "posts", err);
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
  const baseUrl =
    (await getBaseUrl("1tamilblasters")) || "https://www.1tamilblasters.blog";
  const headers = commonHeaders || {};
  const query = cleanText(searchQuery);
  if (!query) return [];

  try {
    // The ?s= form is behind Cloudflare, the pretty search route is not.
    const url = pageUrl(
      `${baseUrl}/search/${encodeURIComponent(query)}/`,
      page,
    );
    const html = await fetchText(axios, url, signal, headers);
    return parseArticles(cheerio.load(html), baseUrl);
  } catch (err) {
    throwProviderError("1TamilBlasters", "search posts", err);
  }
};
