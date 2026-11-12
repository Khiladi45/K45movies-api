import { ProviderContext, Stream } from "../types";
import { throwProviderError } from "../providerErrors";
import { formValues, getQuality, isHdlinks, qualityRank } from "./utils";

export async function getStream({
  link,
  signal,
  providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Stream[]> {
  const { axios, cheerio, commonHeaders } = providerContext;
  const targets = new Map<string, string | undefined>();
  if (signal?.aborted) return [];

  try {
    if (isHdlinks(link)) {
      targets.set(link, undefined);
    } else {
      const { data } = await axios.get(link, {
        headers: commonHeaders,
        signal,
        timeout: 15_000,
      });
      const $ = cheerio.load(typeof data === "string" ? data : "");
      $("form.dl-post-form").each((_i, el) => {
        const { url, quality, tier_title } = formValues($, el);
        if (!url || !isHdlinks(url)) return;
        const resolution = getQuality(quality || "") || getQuality(tier_title || "");
        if (!targets.has(url) || qualityRank(resolution) > qualityRank(targets.get(url))) {
          targets.set(url, resolution);
        }
      });
    }

    // FXShare's file-looking paths can return HTML or 403. Keep the original
    // browser entry point so it can start its own session and follow the UI.
    return [...targets]
      .sort((a, b) => qualityRank(b[1]) - qualityRank(a[1]))
      .map(([url, quality]) => ({
        server: "HDMoviesLife",
        link: url,
        type: "embed",
        quality,
        downloadOnly: true,
      }));
  } catch (err) {
    throwProviderError("HDMoviesLife", "stream", err);
  }
}
