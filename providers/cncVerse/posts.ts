import { Post, ProviderContext } from "../types";
import { netMirrorGetPosts, netMirrorSearch } from "../netMirrorCommon";
import {
  getEnabledStudios,
  getStudio,
  getStudioOptions,
  toAppLink,
} from "./studio";

export const getPosts = async function ({
  filter,
  page,
  providerValue,
  signal,
  providerContext,
}: {
  filter: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const studio = getStudio(filter);
  const options = await getStudioOptions(providerContext, studio);
  const posts = await netMirrorGetPosts({
    filter: "",
    page,
    prefix: studio.prefix,
    providerValue,
    signal,
    providerContext,
    studio: options,
  });
  return posts.map((post) => ({
    ...post,
    link: toAppLink(post.link, studio, 1),
  }));
};

export const getSearchPosts = async function ({
  searchQuery,
  page,
  providerValue,
  signal,
  providerContext,
}: {
  searchQuery: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const enabled = await getEnabledStudios(providerContext);
  const studios = enabled.map((key) => getStudio(key));

  const results = await Promise.all(
    studios.map(async (studio) => {
      const options = await getStudioOptions(providerContext, studio);
      const posts = await netMirrorSearch({
        searchQuery,
        page,
        prefix: studio.prefix,
        providerValue,
        signal,
        providerContext,
        studio: options,
      });
      return posts.map((post) => ({
        ...post,
        link: toAppLink(post.link, studio, 1),
      }));
    })
  );

  const seen = new Set<string>();
  const merged: Post[] = [];
  for (const post of results.flat()) {
    const key = post.title.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(post);
  }
  return merged;
};
