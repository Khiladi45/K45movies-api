import { Post, ProviderContext } from "../types";
import {
  YT_HEADERS,
  collectVideos,
  extractContinuationToken,
  extractInnertubeConfig,
  isShortsQuery,
  parseContinuationResponse,
  parseInitialData,
  parseSuggestions,
  InnertubeConfig,
  FALLBACK_CLIENT_VERSION,
} from "./parse";

// ---------------------------------------------------------------------------
// Continuation paging
//
// YouTube's results page only contains the first ~20 videos. Every further page
// is fetched with the continuation token the previous page returned, so the
// token for page N+1 is remembered when page N is read. Tokens are kept in
// memory and (briefly) in the provider kvStore; if one is missing, the pages
// before it are walked sequentially. A page past the end returns [] — it never
// repeats an earlier page.
// ---------------------------------------------------------------------------

const TOKEN_TTL_MS = 20 * 60 * 1000;

type StoredToken = { token: string; at: number };

const memoryTokens = new Map<string, StoredToken>();
let innertubeConfig: InnertubeConfig = { clientVersion: FALLBACK_CLIENT_VERSION };

const tokenKey = (query: string, page: number) => `yt:cont:${query}:${page}`;

async function readToken(
  ctx: ProviderContext,
  query: string,
  page: number,
): Promise<string | undefined> {
  const key = tokenKey(query, page);
  const now = Date.now();

  const inMemory = memoryTokens.get(key);
  if (inMemory && now - inMemory.at < TOKEN_TTL_MS) return inMemory.token;
  // An empty token ("") is the end marker: there is no page after the last one.

  try {
    const stored = await ctx.kvStore?.get<StoredToken>(key);
    if (stored && typeof stored.token === "string" && now - stored.at < TOKEN_TTL_MS) {
      memoryTokens.set(key, stored);
      return stored.token;
    }
  } catch {
    // kvStore is optional.
  }
  return undefined;
}

async function writeToken(
  ctx: ProviderContext,
  query: string,
  page: number,
  token: string | undefined,
): Promise<void> {
  const key = tokenKey(query, page);
  const entry: StoredToken = { token: token ?? "", at: Date.now() };
  memoryTokens.set(key, entry);
  try {
    await ctx.kvStore?.set(key, entry);
  } catch {
    // kvStore is optional.
  }
}

async function fetchFirstPage(
  ctx: ProviderContext,
  query: string,
  mode: "videos" | "shorts",
): Promise<Post[]> {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query,
  )}`;
  const res = await ctx.axios.get(url, { headers: YT_HEADERS });
  innertubeConfig = extractInnertubeConfig(res.data);

  const data = parseInitialData(res.data);
  if (!data) return [];

  await writeToken(ctx, query, 2, extractContinuationToken(data));
  return collectVideos(data, mode);
}

async function fetchContinuationPage(
  ctx: ProviderContext,
  query: string,
  page: number,
  token: string,
  mode: "videos" | "shorts",
): Promise<Post[]> {
  const apiKey = innertubeConfig.apiKey
    ? `&key=${encodeURIComponent(innertubeConfig.apiKey)}`
    : "";
  const res = await ctx.axios.post(
    `https://www.youtube.com/youtubei/v1/search?prettyPrint=false${apiKey}`,
    {
      context: {
        client: {
          clientName: "WEB",
          clientVersion: innertubeConfig.clientVersion,
          hl: "en",
          gl: "US",
        },
      },
      continuation: token,
    },
    {
      headers: {
        ...YT_HEADERS,
        "Content-Type": "application/json",
        "X-YouTube-Client-Name": "1",
        "X-YouTube-Client-Version": innertubeConfig.clientVersion,
        Origin: "https://www.youtube.com",
      },
      timeout: 8000,
    },
  );

  const { posts, continuation } = parseContinuationResponse(res.data, mode);
  await writeToken(ctx, query, page + 1, continuation);
  return posts;
}

async function fetchPage(
  ctx: ProviderContext,
  query: string,
  page: number,
): Promise<Post[]> {
  const mode = isShortsQuery(query) ? "shorts" : "videos";
  if (page <= 1) return fetchFirstPage(ctx, query, mode);

  // Make sure a token for this page exists, walking the earlier pages if not.
  let token = await readToken(ctx, query, page);
  for (let p = 1; token === undefined && p < page; p++) {
    if ((await readToken(ctx, query, p + 1)) !== undefined) continue;
    if (p === 1) {
      await fetchFirstPage(ctx, query, mode);
    } else {
      const previous = await readToken(ctx, query, p);
      if (!previous) return []; // chain ended before this page
      await fetchContinuationPage(ctx, query, p, previous, mode);
    }
  }
  token = await readToken(ctx, query, page);
  if (!token) return []; // undefined or "" end marker: past the last page

  try {
    return await fetchContinuationPage(ctx, query, page, token, mode);
  } catch (err) {
    // An expired token must not be retried forever: mark this page as the end.
    await writeToken(ctx, query, page, undefined);
    throw err;
  }
}

export const getPosts = async function ({
  filter,
  page,
  providerContext,
}: {
  filter: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  try {
    return await fetchPage(providerContext, filter || "trending", page || 1);
  } catch (err) {
    console.error("YouTube getPosts error:", err);
    return [];
  }
};

export const getSearchPosts = async function ({
  searchQuery,
  page,
  providerContext,
}: {
  searchQuery: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  try {
    return await fetchPage(providerContext, searchQuery, page || 1);
  } catch (err) {
    console.error("YouTube getSearchPosts error:", err);
    return [];
  }
};

/** Live search suggestions for the search box. */
export const getSuggestions = async function ({
  query,
  signal,
  providerContext,
}: {
  query: string;
  signal?: AbortSignal;
  providerContext: ProviderContext;
}): Promise<string[]> {
  const text = (query || "").trim();
  if (!text) return [];
  try {
    const res = await providerContext.axios.get(
      `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=en&q=${encodeURIComponent(
        text,
      )}`,
      { headers: YT_HEADERS, timeout: 4000, signal },
    );
    return parseSuggestions(res.data, 10);
  } catch (err) {
    console.error("YouTube getSuggestions error:", err);
    return [];
  }
};
