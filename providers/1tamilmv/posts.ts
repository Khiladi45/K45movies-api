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
    return watchWidgetPosts(baseUrl, signal, axios, cheerio, headers);
  }  const url = `${baseUrl}${filter}${page > 1 ? `page/${page}/` : ""}`;
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
    const results = await posts({
      url: searchUrl,
      signal,
      axios,
      cheerio,
      headers,
      operation: "search posts",
    });

    // Search prefers playable entries: prepend watch-widget hits, then topics.
    const watchPosts = await watchWidgetPosts(baseUrl, signal, axios, cheerio, headers);
    const lower = query.toLowerCase();
    const tokens = lower.split(/\s+/).filter(Boolean);
    const matches = (title: string) => {
      const t = title.toLowerCase();
      return tokens.every((token) =>
        /^\d+$/.test(token) ? new RegExp(`\\b${token}\\b`).test(t) : t.includes(token),
      );
    };
    const watchHits = watchPosts.filter((p) => matches(p.title));
    const topicResults = results.filter(
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
    return typeof res.data === "string" ? res.data : String(res.data ?? "");
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onOuterAbort);
  }
}

/**
 * The homepage widgets ("TOP RELEASES THIS WEEK" / "RECENTLY ADDED") emit one
 * movie per row:
 *   <p><strong>Name (2026) Tamil HD + ESub -</strong>
 *      <strong><a href=topic>[1080p …]</a> - <a href=luluvido>[W]</a></strong></p>
 * Every [W] anchor carries a third-party watch embed for that release.
 */
async function watchWidgetPosts(
  baseUrl: string,
  signal: AbortSignal | undefined,
  axios: any,
  cheerio: ProviderContext["cheerio"],
  headers: Record<string, string>,
): Promise<Post[]> {
  const html = await fetchText(axios, `${baseUrl}/`, signal, headers).catch(() => "");
  if (!html) return [];
  const $ = cheerio.load(html);

  const posts: Post[] = [];
  const seen = new Set<string>();
  $("a[href]")
    .filter((_i, el) => cleanText($(el).text()) === "[W]")
    .each((_i, el) => {
      const watchUrl = $(el).attr("href") || "";
      if (!watchUrl) return;

      const ownStrong = $(el).closest("strong");
      const topicHref =
        ownStrong.find('a[href*="/topic/"]').first().attr("href") ||
        $(el)
          .closest("p, div")
          .find('a[href*="/topic/"]')
          .first()
          .attr("href") ||
        "";
      if (!topicHref) return;

      // Row name: the preceding link-less <strong>, else the row text minus anchors.
      let nameSource = "";
      const prev = ownStrong.prev("strong");
      if (prev.length > 0 && prev.find("a").length === 0) {
        nameSource = cleanText(prev.text());
      } else {
        const rowClone = $(el).closest("p, div").clone();
        rowClone.find("a").remove();
        nameSource = cleanText(rowClone.text()).replace(/[-–|]\s*$/, "").trim();
      }

      const key = canonicalTopicUrl(topicHref, baseUrl);
      if (seen.has(key)) return;
      seen.add(key);
      posts.push({
        title: displayTitle(nameSource) || `Watch Online ${posts.length + 1}`,
        link: watchUrl,
        image: "",
      });
    });
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
    const $ = cheerio.load(data);
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
