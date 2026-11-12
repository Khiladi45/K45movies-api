import type { EpisodeLink, ProviderContext } from "../types";
import { httpUrl } from "../extractors/httpMedia";
import { movieswoodBaseUrl } from "./posts";

export async function getEpisodes({ url }: { url: string; providerContext: ProviderContext }): Promise<EpisodeLink[]> {
  const link = httpUrl(url, await movieswoodBaseUrl());
  return link ? [{ title: "Play Movie", link }] : [];
}
