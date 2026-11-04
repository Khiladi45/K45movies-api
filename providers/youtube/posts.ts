import { Post, ProviderContext } from "../types";
import {
  YT_HEADERS,
  collectVideos,
  isShortsQuery,
  paginate,
  parseInitialData,
} from "./parse";

async function fetchPosts(
  axios: ProviderContext["axios"],
  query: string,
  page: number,
): Promise<Post[]> {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query,
  )}`;

  const res = await axios.get(searchUrl, { headers: YT_HEADERS });
  const data = parseInitialData(res.data);
  if (!data) return [];

  // A "#shorts" query returns only Shorts (portrait, 9:16). Everything else
  // behaves as before: regular 16:9 videos, with the new structured fields.
  const mode = isShortsQuery(query) ? "shorts" : "videos";
  return paginate(collectVideos(data, mode), page);
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
    return await fetchPosts(providerContext.axios, filter || "trending", page);
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
    return await fetchPosts(providerContext.axios, searchQuery, page);
  } catch (err) {
    console.error("YouTube getSearchPosts error:", err);
    return [];
  }
};
