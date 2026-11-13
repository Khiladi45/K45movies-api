import { ProviderContext, Stream } from "../types";
import { netMirrorGetStream } from "../netMirrorCommon";
import { getStudioOptions, toCoreLink } from "./studio";

export const getStream = async ({
  link,
  type,
  signal,
  providerContext,
  isDownload,
}: {
  link: string;
  type?: string;
  signal?: AbortSignal;
  providerContext: ProviderContext;
  isDownload?: boolean;
}): Promise<Stream[]> => {
  const { link: coreLink, studio } = toCoreLink(link);
  const options = await getStudioOptions(providerContext, studio);

  const streams = await netMirrorGetStream({
    id: coreLink,
    type,
    prefix: studio.prefix,
    signal,
    providerContext,
    isDownload,
    studio: options,
  });

  return streams.map((stream) => ({
    ...stream,
    server: stream.server.startsWith(studio.label)
      ? stream.server
      : `${studio.label} · ${stream.server}`,
    tag: studio.cornerTag,
  }));
};
