import { EpisodeLink, ProviderContext } from "../types";

export const getEpisodes = async function ({
  url,
}: {
  url: string;
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> {
  return [
    {
      title: "Play Movie",
      link: url,
    },
  ];
};
