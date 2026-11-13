import { Info, Link, ProviderContext } from "../types";
import { getPosterUrl, netMirrorGetMeta } from "../netMirrorCommon";
import { getStudioOptions, toAppLink, toCoreLink } from "./studio";

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  provider: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const { link: coreLink, studio } = toCoreLink(link);
  const options = await getStudioOptions(providerContext, studio);

  const info = await netMirrorGetMeta({
    link: coreLink,
    prefix: studio.prefix,
    providerContext,
    studio: options,
  });

  const linkList: Link[] = info.linkList.map((entry) => ({
    ...entry,
    episodesLink: entry.episodesLink
      ? toAppLink(entry.episodesLink, studio, 2)
      : undefined,
    directLinks: entry.directLinks?.map((direct) => ({
      ...direct,
      link: toAppLink(direct.link, studio, 1),
      image: direct.image || info.image,
    })),
  }));

  const id = link.split("|")[0];
  return {
    ...info,
    image: info.image || getPosterUrl(id, studio.prefix),
    linkList,
  };
};
