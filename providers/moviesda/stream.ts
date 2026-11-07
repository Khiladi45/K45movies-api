import { ProviderContext, Stream } from "../types";
import { throwProviderError } from "../providerErrors";

export async function getStream({
  link,
  signal,
  providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}) {
  const { axios, cheerio, commonHeaders: headers } = providerContext;
  const Streams: Stream[] = [];

  try {
    const res = await axios.get(link, { headers, signal });
    const html = res.data;
    const $ = cheerio.load(html);

    $("a").each((i, el) => {
      const href = $(el).attr("href");
      const text = $(el).text().toLowerCase();

      if (href && (text.includes("download") || text.includes("watch"))) {
        if (
          href.toLowerCase().includes(".mp4") ||
          href.toLowerCase().includes(".mkv") ||
          href.toLowerCase().includes(".m3u8")
        ) {
          let quality = "720";
          if (href.includes("1080") || text.includes("1080")) quality = "1080";
          else if (href.includes("480") || text.includes("480"))
            quality = "480";
          else if (href.includes("360") || text.includes("360"))
            quality = "360";

          Streams.push({
            server: "Moviesda Direct",
            link: href,
            type: href.toLowerCase().includes(".m3u8") ? "m3u8" : "mp4",
            quality: quality,
            headers: headers,
          });
        }
      }
    });

    if (Streams.length === 0) {
      console.log("No direct streams found for:", link);
    }
  } catch (error) {
    throwProviderError("Moviesda", "stream", error);
  }

  return Streams;
}
