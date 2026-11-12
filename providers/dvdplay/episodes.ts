import type { EpisodeLink, ProviderContext } from "../types";
import { httpUrl } from "../extractors/httpMedia";
import { dvdplayBaseUrl } from "./posts";

export async function getEpisodes({ url }: { url: string; providerContext: ProviderContext }): Promise<EpisodeLink[]> {
  const link = httpUrl(url, await dvdplayBaseUrl());
  return link ? [{ title: "Play Movie", link }] : [];
}
