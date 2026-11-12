import { Post, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import {
  canonicalTopicUrl,
  cleanText,
  displayTitle,
  WATCH_FILTER,
} from "./utils";

const REQUEST_TIMEOUT_MS = 15_000;
const HTML_TTL_MS = 3 * 60_000;
const htmlCache = new Map<string, { at: number; html: string }>();
// Home and search share the same watch widget. Reuse its rows rather than
// parsing the full forum homepage on the app's JS thread for every search.
let watchCache: { url: string; at: number; posts: Post[] } | undefined;

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
  const baseUrl = (await getBaseUrl("1tamilmv")) || "https://www.1tamilmv.io";
  const headers = commonHeaders || {};
  if (filter === WATCH_FILTER) {
    return page > 1 ? [] : watchWidgetPosts(baseUrl, signal, axios, cheerio, headers);
  }
  const url = `${baseUrl}${filter}${page > 1 ? `page/${page}/` : ""}`;
  return posts({ url, signal, axios, cheerio, headers, operation: "posts" });
};

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
  const { axios, cheerio, commonHeaders } = providerContext;
  const baseUrl = (await getBaseUrl("1tamilmv")) || "https://www.1tamilmv.io";
  const headers = commonHeaders || {};
  const query = cleanText(searchQuery);
  if (!query) return [];

  try {
    const searchUrl = `${baseUrl}/index.php?/search/&q=${encodeURIComponent(query)}&type=forums_topic`;
    const [forum, watchPosts] = await Promise.all([
      posts({
        url: searchUrl,
        signal,
        axios,
        cheerio,
        headers,
        operation: "search posts",
      }).then((rows) => ({ rows }), (error: unknown) => ({ error })),
      watchWidgetPosts(baseUrl, signal, axios, cheerio, headers).catch(() => []),
    ]);
    if (signal?.aborted) return [];
    const lower = query.toLowerCase();
    const tokens = lower.split(/\s+/).filter(Boolean);
    const matches = (title: string) => {
      const t = title.toLowerCase();
      return tokens.every((token) =>
        /^\d+$/.test(token) ? new RegExp(`\\b${token}\\b`).test(t) : t.includes(token),
      );
    };
    const watchHits = watchPosts.filter((p) => matches(p.title));
    if ("error" in forum && watchHits.length === 0) throw forum.error;
    const topicResults = ("rows" in forum ? forum.rows : []).filter(
      (p) => !watchHits.some((w) => w.title === p.title),
    );

    return [...watchHits, ...topicResults];
  } catch (err) {
    throwProviderError("1TamilMV", "search posts", err);
  }
};

async function fetchText(
  axios: any,
  url: string,
  signal: AbortSignal | undefined,
  headers: Record<string, string>,
) {
  if (signal?.aborted) return "";
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

/** The homepage groups multiple releases in a paragraph, separated by <br>. */
async function watchWidgetPosts(
  baseUrl: string,
  signal: AbortSignal | undefined,
  axios: any,
  cheerio: ProviderContext["cheerio"],
  headers: Record<string, string>,
): Promise<Post[]> {
  const url = `${baseUrl}/`;
  if (signal?.aborted) return [];
  if (watchCache?.url === url && Date.now() - watchCache.at < HTML_TTL_MS) {
    return watchCache.posts;
  }
  const html = await fetchText(axios, url, signal, headers);
  if (!html || signal?.aborted) return [];
  const $ = cheerio.load(html, { xml: { xmlMode: false } });

  const posts: Post[] = [];
  const seen = new Set<string>();
  const topics = new Map<unknown, string>();
  $("a[href]").each((_i, el) => {
      const anchor = $(el);
      const href = anchor.attr("href") || "";
      if (href.includes("/forums/topic/")) {
        topics.set(anchor.closest("p, div").get(0), canonicalTopicUrl(href, baseUrl));
        return;
      }
      if (!/^https?:\/\//i.test(href) || cleanText(anchor.text()) !== "[W]") return;

      const block = anchor.closest("p, div").get(0);
      const topic = topics.get(block);
      if (!topic) return;
      topics.delete(block);
      if (seen.has(href)) return;
      const release = topic.match(/\/topic\/\d+-(.+?)-((?:19|20)\d{2})(?:-|\/|$)/i);
      if (!release) return;
      const name = release[1].split("-").map((word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
      ).join(" ");
      seen.add(href);
      posts.push({
        title: `${name} (${release[2]})`,
        link: href,
        image: "",
      });
  });
  if (posts.length) watchCache = { url, at: Date.now(), posts };
  return posts;
}

async function posts({
  url,
  signal,
  axios,
  cheerio,
  headers,
  operation,
}: {
  url: string;
  signal: AbortSignal;
  axios: any;
  cheerio: ProviderContext["cheerio"];
  headers: Record<string, string>;
  operation: string;
}): Promise<Post[]> {
  try {
    const data = await fetchText(axios, url, signal, headers);
    if (!data || signal?.aborted) return [];
    const $ = cheerio.load(data, { xml: { xmlMode: false } });
    const baseUrl = new URL(url).origin;

    const catalog: Post[] = [];
    const seen = new Set<string>();
    $('a[href*="/topic/"]').each((_i, el) => {
      const href = $(el).attr("href") || "";
      const title = cleanText($(el).text());
      if (!href || title.length < 15) return;
      // Search results link to a specific comment (&do=findComment&comment=N);
      // canonicalTopicUrl strips that so the row points at the topic itself.
      const link = canonicalTopicUrl(href, baseUrl);
      if (seen.has(link)) return;
      seen.add(link);
      catalog.push({ title: displayTitle(title), link, image: "" });
    });
    return catalog;
  } catch (err) {
    throwProviderError("1TamilMV", operation, err);
  }
}
