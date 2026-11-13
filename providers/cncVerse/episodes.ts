import { EpisodeLink, ProviderContext } from "../types";
import { getEpisodePosterUrl, netMirrorGetEpisodes } from "../netMirrorCommon";
import { getStudioOptions, toAppLink, toCoreLink } from "./studio";

export const getEpisodes = async function ({
  url,
  providerContext,
}: {
  url: string;
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> {
  const { link: coreLink, studio } = toCoreLink(url);
  const options = await getStudioOptions(providerContext, studio);

  const episodes = await netMirrorGetEpisodes({
    seasonId: coreLink,
    prefix: studio.prefix,
    providerContext,
    studio: options,
  });

  return episodes.map((episode) => {
    const id = episode.link.split("|")[0];
    return {
      ...episode,
      link: toAppLink(episode.link, studio, 1),
      image: episode.image || getEpisodePosterUrl(id, studio.prefix),
    };
  });
};
