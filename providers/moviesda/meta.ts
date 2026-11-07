import { Info, Link, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  try {
    const { axios, cheerio } = providerContext;
    const baseUrl = await getBaseUrl("moviesda");
    const url = new URL(link, baseUrl).href;
    const res = await axios.get(url);
    const data = res.data;
    const $ = cheerio.load(data);

    const title = $("h1").first().text().trim() || $("title").text().trim();
    const image = $("img").first().attr("src") || "";
    const synopsis =
      $("p").first().text().trim() || "No description available.";

    const links: Link[] = [];
    $("a").each((i, el) => {
      const href = $(el).attr("href");
      const text = $(el).text().trim().toLowerCase();
      if (
        href &&
        (text.includes("download") ||
          text.includes("watch") ||
          text.includes("play"))
      ) {
        links.push({
          title: $(el).text().trim(),
          episodesLink: href.startsWith("http") ? href : baseUrl + href,
        });
      }
    });

    return {
      title,
      synopsis,
      image,
      imdbId: "tt0000000",
      tags: [],
      type: "movie",
      linkList: links,
      webUrl: url,
    };
  } catch (err) {
    throwProviderError("Moviesda", "metadata", err);
  }
};
