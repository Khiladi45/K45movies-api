import type { Post, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";
import { throwProviderError } from "../providerErrors";
import { httpUrl, responseUrl } from "../extractors/httpMedia";

export async function movieswoodBaseUrl() {
  return (await getBaseUrl("movieswood").catch(() => "")) || "https://movieswood.cloud";
}

const challenge = (html: string) =>
  /cf-browser-verification|checking your browser|\/cdn-cgi\/challenge-platform\/|<title>just a moment/i.test(html);

// Catalog sections can load in parallel while the app has only one verification dialog.
let verification: { origin: string; request: ReturnType<ProviderContext["openWebView"]> } | undefined;

export type CookieJar = { value: string };

/** download-start.php validates the PHPSESSID cookie set by the movie pages. */
export function absorbCookies(jar: CookieJar, response: any) {
  const header = response?.headers?.["set-cookie"];
  if (!header) return;
  for (const line of Array.isArray(header) ? header : [header]) {
    const pair = String(line).split(";")[0];
    if (!pair || !pair.includes("=")) continue;
    if (jar.value.split("; ").includes(pair)) continue;
    jar.value = jar.value ? `${jar.value}; ${pair}` : pair;
  }
}

export async function loadMovieswoodPage(
  url: string,
  context: ProviderContext,
  signal?: AbortSignal,
  jar?: CookieJar,
) {
  const headers = {
    ...context.commonHeaders,
    ...(jar?.value ? { Cookie: jar.value } : {}),
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
  };
  const options = { headers, signal, timeout: 12_000, validateStatus: () => true };
  const response = await context.axios.get(url, options);
  if (jar) absorbCookies(jar, response);
  const html = typeof response.data === "string" ? response.data : "";
  const landing = responseUrl(response, url);
  const blocked = response.status === 403 || response.headers["cf-mitigated"] === "challenge" || challenge(html);
  if (!blocked) {
    if (response.status >= 400) throw new Error(`HTTP ${response.status}`);
    return { html, url: landing, cookies: jar?.value || "" };
  }

  if (!context.openWebView || signal?.aborted) throw new Error("MoviesWood requires browser verification.");
  const origin = new URL(url).origin;
  if (new URL(landing).origin !== origin) throw new Error("Verification redirected to another site.");
  if (!verification || verification.origin !== origin) {
    const request = context.openWebView(url, {
      title: "MoviesWood verification",
      description: "Complete the browser check, then tap Done.",
      headers,
      timeoutMs: 60_000,
    }).finally(() => {
      if (verification?.request === request) verification = undefined;
    });
    verification = { origin, request };
  }
  const verified = await verification.request;
  if (signal?.aborted) throw new Error("Request cancelled");
  if (jar && verified.cookies) {
    const pair = String(verified.cookies).split(";")[0].trim();
    if (pair && !jar.value.includes(pair)) jar.value = jar.value ? `${jar.value}; ${pair}` : pair;
  }
  const verifiedUrl = httpUrl(verified.url, url);
  if (!verifiedUrl || new URL(verifiedUrl).origin !== origin) throw new Error("Verification left MoviesWood.");
  if (verifiedUrl === url && verified.data && !challenge(verified.data)) {
    return { html: verified.data, url: verifiedUrl, cookies: jar?.value || "" };
  }
  if (!verified.cookies) throw new Error("MoviesWood verification did not complete.");
  const retry = await context.axios.get(url, {
    ...options,
    headers: {
      ...headers,
      ...(jar?.value ? { Cookie: jar.value } : {}),
      "User-Agent": verified.userAgent || context.commonHeaders["User-Agent"],
    },
  });
  if (jar) absorbCookies(jar, retry);
  const result = typeof retry.data === "string" ? retry.data : "";
  if (retry.status >= 300 || challenge(result) || retry.headers["cf-mitigated"] === "challenge") {
    throw new Error(`MoviesWood verification did not unlock this page (HTTP ${retry.status}).`);
  }
  const retryUrl = responseUrl(retry, url);
  if (new URL(retryUrl).origin !== origin) throw new Error("Verification left MoviesWood.");
  return { html: result, url: retryUrl, cookies: jar?.value || "" };
}

export async function getPosts({
  filter, page, signal, providerContext,
}: {
  filter: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  try {
    const url = new URL(filter, await movieswoodBaseUrl());
    if (page > 1) {
      url.searchParams.set("page", String(page));
      url.search = url.searchParams.toString();
    }
    const document = await loadMovieswoodPage(url.href, providerContext, signal);
    const $ = providerContext.cheerio.load(document.html);
    const posts = new Map<string, Post>();
    $("a[href]").each((_i, el) => {
      const anchor = $(el);
      const title = anchor.text().replace(/\s+/g, " ").trim();
      if (!/\(\d{4}\)/.test(title)) return;
      const link = httpUrl(anchor.attr("href"), document.url);
      if (!link || new URL(link).origin !== new URL(document.url).origin) return;
      const image = httpUrl(anchor.find("img").attr("src"), document.url) || "";
      posts.set(link, { title, link, image });
      if (posts.size === 50) return false;
    });
    if (!posts.size && !$("body").clone().find("script,style").remove().end().text().trim()) {
      throw new Error("MoviesWood returned an empty catalog page.");
    }
    return [...posts.values()];
  } catch (error) {
    throwProviderError("MoviesWood", "posts", error);
  }
}

export async function getSearchPosts(): Promise<Post[]> {
  throwProviderError("MoviesWood", "search", new Error("Search is unavailable. Browse the categories."));
}
