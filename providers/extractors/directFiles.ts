import type { ProviderContext } from "../types";

/** Map any PixelDrain page/API URL to its direct download endpoint. */
export function pixelDrainDirect(url: string): string | undefined {
  const match = url.match(
    /pixeldrain\.(?:com|dev)\/(?:u\/|api\/file\/|file\/)([A-Za-z0-9]+)/i,
  );
  return match ? `https://pixeldrain.dev/api/file/${match[1]}?download` : undefined;
}

/**
 * HubCloud `/video/<id>` pages don't carry the file. A "Generate Direct
 * Download Link" hop yields the mirror list, where PixelDrain is the only
 * mirror that streams without a browser session.
 */
export async function hubCloudCandidates(
  axios: ProviderContext["axios"],
  cheerio: any,
  link: string,
  headers: Record<string, string>,
  signal: AbortSignal | undefined,
): Promise<string[]> {
  const candidates: string[] = [];
  try {
    const page = await axios.get(link, {
      headers,
      signal,
      timeout: 8_000,
      validateStatus: () => true,
    });
    if (typeof page.data !== "string") return candidates;

    let $ = cheerio.load(page.data);
    collectCandidates($, page.data, link, candidates);

    let generate = "";
    $("a[href]").each((_i: number, el: any) => {
      const href = $(el).attr("href") || "";
      if (!generate && /hubcloud\.php/i.test(href)) generate = href;
    });
    if (!generate) return candidates;

    await new Promise((resolve) => setTimeout(resolve, 1_200));
    const generated = await axios.get(new URL(generate, link).href, {
      headers: { ...headers, Referer: link },
      signal,
      timeout: 10_000,
      validateStatus: () => true,
    });
    if (typeof generated.data !== "string") return candidates;
    $ = cheerio.load(generated.data);
    collectCandidates($, generated.data, new URL(generate, link).href, candidates);
    return candidates;
  } catch {
    return candidates;
  }
}

/**
 * Mirror lists move between PixelDrain, a hubcloud CDN worker and gpdl
 * gateways; only the first two answer media probes without a browser.
 */
function collectCandidates(
  $: any,
  html: string,
  base: string,
  out: string[],
) {
  const add = (value: string) => {
    try {
      const url = new URL(value, base).href;
      if (!out.includes(url)) out.push(url);
    } catch {
      // ignore malformed hrefs
    }
  };
  $("a[href]").each((_i: number, el: any) => {
    const href = $(el).attr("href") || "";
    if (/pixeldrain\./i.test(href)) {
      const direct = pixelDrainDirect(href);
      if (direct) add(direct);
      return;
    }
    if (/\.(?:mkv|mp4|webm)(?:\?|$)/i.test(href) || /\.workers\.dev\//i.test(href)) {
      add(href);
    }
  });
  if (out.length === 0) {
    const inline = html.match(/https?:\/\/pixeldrain\.[^"'\s<>]+/i);
    if (inline) {
      const direct = pixelDrainDirect(inline[0]);
      if (direct) add(direct);
    }
  }
}
