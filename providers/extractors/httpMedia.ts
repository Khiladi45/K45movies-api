import type { ProviderContext } from "../types";

export function httpUrl(href: string | undefined, base: string): string | undefined {
  const value = href?.trim();
  if (!value || value.startsWith("#")) return;
  try {
    const parent = new URL(base);
    // React Native's URL implementation does not resolve query-only references.
    const directory = parent.pathname.endsWith("/")
      ? parent.pathname
      : parent.pathname.replace(/[^/]*$/, "");
    const candidate = value.startsWith("?") ? `${parent.origin}${parent.pathname}${value}` :
      value.startsWith("//") ? `${parent.protocol}${value}` :
      /^[a-z][a-z\d+.-]*:/i.test(value) ? value :
      value.startsWith("/") ? `${parent.origin}${value}` :
      `${parent.origin}${directory}${value}`;
    const url = new URL(candidate);
    if (/^https?:\/\/[^/?#@]+(?=[/?#]|$)/i.test(url.href) && !url.username && !url.password) {
      return url.href;
    }
  } catch {
    return;
  }
}

export const responseUrl = (response: any, requested: string) =>
  response.request?.responseURL || response.request?.res?.responseUrl || requested;

/**
 * Follows a redirect chain with HEAD requests. React Native's axios ignores
 * `maxRedirects` and follows transparently, so on-device the final URL only
 * shows up in `responseURL`; Node instead stops at each 3xx. HEAD keeps the
 * chain cheap — a GET would stream the whole video file into the JS thread.
 */
export async function followHeadRedirects(
  axios: ProviderContext["axios"],
  url: string,
  headers: Record<string, string>,
  signal?: AbortSignal,
  onResponse?: (response: any) => void,
  maxHops = 6,
): Promise<string | undefined> {
  let current = url;
  let referer = "";
  for (let hop = 0; hop < maxHops; hop++) {
    const response = await axios.head(current, {
      headers: { ...headers, ...(referer ? { Referer: referer } : {}) },
      signal,
      timeout: 6_000,
      maxRedirects: 0,
      validateStatus: () => true,
    }).catch(() => undefined);
    if (!response) return;
    onResponse?.(response);
    const location = response.headers?.location;
    if (location && response.status >= 300 && response.status < 400) {
      referer = current;
      current = new URL(location, current).href;
      continue;
    }
    if (response.status >= 400) return;
    return responseUrl(response, current);
  }
  return current;
}

export const qualityFrom = (text: string) =>
  text.match(/\b(2160|1080|720|480|360)p\b/i)?.[1] ||
  (/\b4k\b/i.test(text) ? "2160" : undefined);

export function mediaExtension(url: string) {
  return url.match(/\.(m3u8|mpd|mp4|mkv|webm)(?=[?#]|$)/i)?.[1].toLowerCase();
}

/** A file-looking path can still serve an HTML gate. Check the actual response. */
export async function probeMedia(
  axios: ProviderContext["axios"],
  link: string,
  headers: Record<string, string>,
  signal?: AbortSignal,
  requireRange = false,
): Promise<string | undefined> {
  try {
    const options = { headers, signal, timeout: 4_000 };
    const head = await axios.head(link, options);
    const mime = String(head.headers["content-type"] || "").split(";")[0].toLowerCase();
    if (/^(?:application|audio)\/(?:vnd\.apple\.mpegurl|x-mpegurl|mpegurl)$/.test(mime)) return "m3u8";
    if (mime === "application/dash+xml") return "mpd";
    const type = mime === "video/x-matroska" || mime === "video/matroska" ? "mkv" :
      mime === "video/mp4" ? "mp4" : mime === "video/webm" ? "webm" : undefined;
    if (type && !requireRange) return type;
    if (!type && mime !== "application/octet-stream") return;
    try {
      const range = await axios.get(link, {
        ...options,
        headers: { ...headers, Range: "bytes=0-63" },
        responseType: "arraybuffer",
        maxContentLength: 1024,
      });
      if (range.status === 206 && /^bytes 0-/i.test(String(range.headers["content-range"]))) {
        const bytes = new Uint8Array(range.data);
        if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
          return type === "webm" || mediaExtension(link) === "webm" ? "webm" : "mkv";
        }
        if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) return "mp4";
      }
    } catch {
      // Range may be blocked even though the MediaInfo MIME is genuine.
    }
    return type;
  } catch {
    return;
  }
}
