import { ProviderContext, Stream } from "../types";
import { throwProviderError } from "../providerErrors";
import { formValues, getQuality, isHdlinks, qualityRank } from "./utils";
import { followHeadRedirects, httpUrl, mediaExtension, probeMedia, responseUrl } from "../extractors/httpMedia";
import { pixelDrainDirect } from "../extractors/directFiles";

const isFxFilePage = (url: string) =>
  /^https:\/\/[^./]+\.fxcloud-as\.site\/dl\//i.test(url);

const accumulateCookies = (jar: { value: string }, response: any) => {
  const header = response?.headers?.["set-cookie"];
  if (!header) return;
  for (const line of Array.isArray(header) ? header : [header]) {
    const pair = String(line).split(";")[0];
    if (!pair || jar.value.split("; ").includes(pair)) continue;
    jar.value = jar.value ? `${jar.value}; ${pair}` : pair;
  }
};

/**
 * HDmovieshub's file pages render their mirror buttons through an
 * `?action=get_buttons` request. The PixelDrain button itself is another
 * redirect chain that finally leaves for pixeldrain.com/u/<id>.
 */
async function resolvePixeldrainMirror(
  link: string,
  quality: string | undefined,
  { axios, cheerio, commonHeaders }: ProviderContext,
  signal: AbortSignal,
): Promise<Stream | undefined> {
  const jar = { value: "" };
  const headers = (extra: Record<string, string> = {}) => ({
    ...commonHeaders,
    ...(jar.value ? { Cookie: jar.value } : {}),
    ...extra,
  });
  try {
    const entry = await axios.get(link, {
      headers: headers(),
      signal,
      timeout: 8_000,
      validateStatus: () => true,
    });
    accumulateCookies(jar, entry);
    const entryUrl = responseUrl(entry, link);
    if (!isHdlinks(entryUrl)) return;

    let buttonsHtml =
      typeof entry.data === "string" && /data-mirror/.test(entry.data) ? entry.data : "";
    if (!buttonsHtml) {
      const buttons = await axios.get(
        `${entryUrl.split("?")[0]}?action=get_buttons`,
        {
          headers: headers({ Referer: entryUrl, "X-Requested-With": "XMLHttpRequest" }),
          signal,
          timeout: 8_000,
          validateStatus: () => true,
        },
      );
      accumulateCookies(jar, buttons);
      buttonsHtml = typeof buttons.data === "string" ? buttons.data : "";
    }
    if (!buttonsHtml) return;

    let $ = cheerio.load(buttonsHtml);
    let href = $('a[data-mirror="pixeldrain"]').first().attr("href") || "";
    if (!href) {
      $("a[href]").each((_i: number, el: any) => {
        const candidate = $(el).attr("href") || "";
        if (!href && /pixeldrain\./i.test(candidate)) href = candidate;
      });
    }
    if (!href) return;

    let url = new URL(href, entryUrl).href;
    let referer = entryUrl;
    let resolved = "";
    for (let hop = 0; hop < 6 && !resolved; hop++) {
      if (signal?.aborted) return;
      const final = await followHeadRedirects(
        axios,
        url,
        headers({ Referer: referer }),
        signal,
        (response) => accumulateCookies(jar, response),
      );
      if (!final) return;
      resolved = pixelDrainDirect(final) || "";
      if (!resolved && mediaExtension(final)) {
        const fileHeaders = { ...commonHeaders, Referer: referer };
        const type = await probeMedia(axios, final, fileHeaders, signal, true);
        if (type) {
          return { server: "HDMoviesLife PixelDrain", link: final, quality: getQuality(final) || quality, type, headers: fileHeaders };
        }
      }
      if (resolved) break;

      // The chain may end on another mirror page that only exposes its
      // PixelDrain button in the HTML, so fetch the (small) page and look.
      const pageResponse = await axios.get(final, {
        headers: headers({ Referer: url }),
        signal,
        timeout: 8_000,
        validateStatus: () => true,
      });
      accumulateCookies(jar, pageResponse);
      if (pageResponse.status !== 200 || typeof pageResponse.data !== "string") return;
      const html = pageResponse.data;
      const page = cheerio.load(html);
      const mirrorHref =
        page('a[data-mirror="pixeldrain"]').first().attr("href") ||
        html.match(/href="([^"]*pixeldrain\.[^"]*)"/i)?.[1] ||
        "";
      if (!mirrorHref) {
        const inline = html.match(/https?:\/\/pixeldrain\.[^"'\s<>]+/i)?.[0];
        if (inline) resolved = pixelDrainDirect(inline) || "";
        break;
      }
      referer = final;
      url = new URL(String(mirrorHref).replace(/&amp;/g, "&"), final).href;
    }
    if (!resolved) return;

    const fileHeaders = { ...commonHeaders, Referer: "https://pixeldrain.dev/" };
    const type = await probeMedia(axios, resolved, fileHeaders, signal, true);
    if (type) {
      return {
        server: "HDMoviesLife PixelDrain",
        link: resolved,
        type,
        quality: quality || getQuality(link),
        headers: fileHeaders,
      };
    }
  } catch {
    // Falls through to the legacy payload chain.
  }
  return;
}

async function resolveFastDownload(
  link: string,
  quality: string | undefined,
  { axios, cheerio, commonHeaders }: ProviderContext,
  signal: AbortSignal,
): Promise<Stream | undefined> {
  try {
    const options = { signal, timeout: 5_000, maxContentLength: 256 * 1024 };
    const response = await axios.get(link, { ...options, headers: commonHeaders });
    const landing = responseUrl(response, link);
    if (!isHdlinks(landing) || typeof response.data !== "string") return;
    const $ = cheerio.load(response.data);
    const payload = $('a[href^="?payload="]').first().attr("href");
    const next = httpUrl(payload, landing);
    if (!next) return;

    const filePage = await axios.get(next, {
      ...options,
      headers: { ...commonHeaders, Referer: landing },
    });
    const filePageUrl = responseUrl(filePage, next);
    if (!isFxFilePage(filePageUrl) || typeof filePage.data !== "string") return;
    const file = cheerio.load(filePage.data);
    const signed = httpUrl(file('a[href*="start=1"][href*="hash="]').first().attr("href"), filePageUrl);
    if (!signed || signed.split("?")[0] !== filePageUrl.split("?")[0]) return;

    const headers = { ...commonHeaders, Referer: filePageUrl };
    const type = await probeMedia(axios, signed, headers, signal, true);
    if (type) return { server: "HDMoviesLife Fast Drive", link: signed, quality: getQuality(filePageUrl) || quality, type, headers };
  } catch {
    // Some mirrors require an interactive browser session.
    return;
  }
}

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

    const ordered = [...targets].sort((a, b) => qualityRank(b[1]) - qualityRank(a[1]));
    const controller = new AbortController();
    const cancel = () => controller.abort();
    signal?.addEventListener("abort", cancel);
    if (signal?.aborted) cancel();
    const deadline = setTimeout(cancel, 22_000);
    try {
      return await Promise.all(ordered.map(async ([url, quality], index) => {
        const verified = index < 3 && (
          await resolvePixeldrainMirror(url, quality, providerContext, controller.signal) ||
          await resolveFastDownload(url, quality, providerContext, controller.signal)
        );
        return verified || {
          server: "HDMoviesLife (Download Only)",
          link: url,
          type: "embed",
          quality,
          downloadOnly: true,
        };
      }));
    } finally {
      clearTimeout(deadline);
      signal?.removeEventListener("abort", cancel);
    }
  } catch (err) {
    throwProviderError("HDMoviesLife", "stream", err);
  }
}
