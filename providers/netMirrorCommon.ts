import {
  EpisodeLink,
  Info,
  Link,
  Post,
  ProviderContext,
  Stream,
  TextTracks,
} from "./types";

/**
 * NetMirror / CNCVerse engine (site flow).
 *
 * Live-verified endpoints (2026-11-13):
 *   GET  {base}/mobile/home?app=1                     -> HTML trays / ad-verification form
 *   POST {base}/mobile/verify2.php  verify=<addhash>  -> sets t_hash_t after ~25s
 *   GET  {base}/mobile/[pv|hs/]search.php?s=          -> { searchResult: [{id,t}] }
 *   GET  {base}/mobile/[pv|hs/]post.php?id=           -> title/desc/season/episodes
 *   GET  {base}/mobile/[pv|hs/]episodes.php?s=&series=&page=
 *   GET  {base}/mobile/[pv|hs/]playlist.php?id=&t=&tm= -> [{ sources:[{file,label}], tracks:[] }]
 *   POST {base}/mobile/hs/setting.php  studio=<id>    -> sets `studio` cookie (disney/marvel/pixar/starwars)
 *
 * Sessions are scoped by the `ott` cookie: a token unlocked with ott=nf plays
 * Netflix, ott=pv plays Prime, ott=hs plays Hotstar and ott=dp plays Disney+
 * (brand studios add the `studio` cookie on top of ott=dp).
 */

export type NetMirrorOtt = "" | "pv" | "hs";

export interface StudioOptions {
  /** Session scope: nf | pv | hs | dp. Defaults from the prefix. */
  ottCookie?: string;
  /** Server-side studio cookie used by the hs path (disney|marvel|pixar|starwars). */
  studioCookie?: string;
}

const MOBILE_UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 5 Build/TQ3A.230901.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/144.0.7559.132 Safari/537.36 /OS.Gatu v3.0";

const FALLBACK_BASES = ["https://net52.cc", "https://net22.cc"];

const TIMEOUT = 8000;
const TOKEN_TTL = 12 * 60 * 60 * 1000;
const TRAY_TTL = 15 * 60 * 1000;

export const getNetMirrorBaseUrl = async (
  providerContext?: ProviderContext
): Promise<string> => {
  try {
    const override = await providerContext?.kvStore?.get<string>("baseUrlOverride");
    if (override && override.trim().startsWith("http")) {
      return override.trim().replace(/\/+$/, "");
    }
  } catch {}
  return FALLBACK_BASES[0];
};

export const getNetMirrorMobileHeaders = (baseUrl: string, cookieStr?: string) => {
  const headers: Record<string, string> = {
    "User-Agent": MOBILE_UA,
    Referer: `${baseUrl}/mobile/home?app=1`,
    Origin: baseUrl,
    Accept: "application/json, text/plain, */*",
    "X-Requested-With": "com.netmirror.app",
  };
  if (cookieStr) headers["Cookie"] = cookieStr;
  return headers;
};

const prefixToOtt = (prefix: NetMirrorOtt | string): string =>
  prefix === "pv" ? "pv" : prefix === "hs" ? "hs" : "nf";

const ottToPrefix = (ott: string): NetMirrorOtt =>
  ott === "pv" ? "pv" : ott === "hs" || ott === "dp" ? "hs" : "";

const resolveUrl = (value: string, base: string): string => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  try {
    if (value.startsWith("/")) {
      const origin = base.match(/^https?:\/\/[^/]+/)?.[0] || base;
      return origin + value;
    }
    const dir = base.replace(/[?#].*$/, "").replace(/\/[^/]*$/, "/");
    return dir + value.replace(/^\.\//, "");
  } catch {
    return value;
  }
};

const usableSessionToken = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !value.trim()) return undefined;
  let token = value.trim();
  try {
    token = decodeURIComponent(token);
  } catch {}
  if (token.includes("::99")) return undefined;
  const timestamp = token.split("::")[2];
  if (timestamp && /^\d{10}$/.test(timestamp) &&
      Date.now() / 1000 - Number(timestamp) >= 43200) return undefined;
  return token;
};

interface CachedToken { token: string; ts: number; }

const unlockLocks = new Map<string, Promise<string | undefined>>();

const readSetCookies = (res: any): string[] => {
  const raw = res?.headers?.["set-cookie"] || res?.headers?.["x-set-cookie"] || [];
  return (Array.isArray(raw) ? raw : [raw]).filter(Boolean).map((c: any) => String(c));
};

const extractToken = (setCookies: string[]): string | undefined => {
  for (const cookie of setCookies) {
    const match = cookie.match(/t_hash_t=([^;]+)/);
    const token = match ? usableSessionToken(match[1]) : undefined;
    if (token) return token;
  }
  return undefined;
};

/**
 * Runs the ad-verification unlock for a single ott scope. The `ott` cookie is
 * sent from the very first request so the resulting session is bound to that
 * studio (this is why one shared token played the 220884 teaser for others).
 */
export const unlockNetMirrorMobileSession = async (
  providerContext: ProviderContext,
  baseUrl: string,
  ottCookie: string = "nf"
): Promise<string | undefined> => {
  const { axios, kvStore } = providerContext;
  const scopeCookie = `hd=on; ott=${ottCookie}`;
  try {
    const homeRes = await axios.get(`${baseUrl}/mobile/home?app=1`, {
      withCredentials: false,
      headers: {
        "User-Agent": MOBILE_UA,
        "X-Requested-With": "com.netmirror.app",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Cookie: scopeCookie,
      },
      timeout: TIMEOUT,
    });

    const cookiesArr = readSetCookies(homeRes);
    const initialCookie = cookiesArr
      .map((c) => c.split(";")[0])
      .filter(Boolean)
      .join("; ");

    const alreadyValid = extractToken(cookiesArr);
    if (alreadyValid) {
      try {
        await kvStore?.set(`t_hash_t_${ottCookie}`, { token: alreadyValid, ts: Date.now() });
      } catch {}
      return alreadyValid;
    }

    const html = typeof homeRes.data === "string" ? homeRes.data : "";
    const addhash = html.match(/data-addhash=["']([^"']+)["']/)?.[1];
    if (!addhash) return undefined;

    const hostDomain = baseUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    await axios
      .get(`https://userver.${hostDomain}/?hee5=${encodeURIComponent(addhash)}&a=y&t=${Math.random()}`, {
        headers: {
          "User-Agent": MOBILE_UA,
          Referer: `${baseUrl}/mobile/home?app=1`,
          Cookie: [initialCookie, scopeCookie].filter(Boolean).join("; "),
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        maxRedirects: 0,
        withCredentials: false,
        validateStatus: () => true,
        timeout: 8000,
      })
      .catch(() => {});

    const pollCookie = [
      "ext_name=ojplmecpdpgccookcobabopnaifgidhf",
      `addhash=${encodeURIComponent(addhash)}`,
      scopeCookie,
      initialCookie,
    ]
      .filter(Boolean)
      .join("; ");

    const start = Date.now();
    while (Date.now() - start < 48000) {
      await new Promise((r) => setTimeout(r, 2500));
      try {
        const vRes = await axios.post(
          `${baseUrl}/mobile/verify2.php`,
          `verify=${encodeURIComponent(addhash)}`,
          {
            headers: {
              "User-Agent": MOBILE_UA,
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              Referer: `${baseUrl}/mobile/home`,
              Origin: baseUrl,
              Cookie: pollCookie,
            },
            validateStatus: () => true,
            withCredentials: false,
            timeout: 8000,
          }
        );

        const token = extractToken(readSetCookies(vRes));
        if (token) {
          if (kvStore) {
            await kvStore.set(`t_hash_t_${ottCookie}`, { token, ts: Date.now() } as CachedToken);
          }
          return token;
        }

        if (vRes.data?.statusup === "All Done") {
          const reloadRes = await axios
            .get(`${baseUrl}/mobile/home?app=1`, {
              headers: {
                "User-Agent": MOBILE_UA,
                "X-Requested-With": "com.netmirror.app",
                Cookie: pollCookie,
              },
              timeout: TIMEOUT,
              withCredentials: false,
            })
            .catch(() => null);
          const reloadToken = reloadRes ? extractToken(readSetCookies(reloadRes)) : undefined;
          if (reloadToken && kvStore) {
            await kvStore.set(`t_hash_t_${ottCookie}`, { token: reloadToken, ts: Date.now() } as CachedToken);
          }
          return reloadToken;
        }
      } catch {}
    }
  } catch (err: any) {
    console.log("Mobile ad verification notice:", err?.message || err);
  }
  return undefined;
};

const unlockSharedSession = (
  providerContext: ProviderContext,
  baseUrl: string,
  ottCookie: string
): Promise<string | undefined> => {
  const key = `${baseUrl}:${ottCookie}`;
  let promise = unlockLocks.get(key);
  if (!promise) {
    promise = unlockNetMirrorMobileSession(providerContext, baseUrl, ottCookie).finally(() => {
      unlockLocks.delete(key);
    });
    unlockLocks.set(key, promise);
  }
  return promise;
};

export const getNetMirrorCookie = async (
  providerContext: ProviderContext,
  ott: NetMirrorOtt,
  unlockIfMissing = true,
  options?: StudioOptions
): Promise<string> => {
  const { kvStore } = providerContext;
  const baseUrl = await getNetMirrorBaseUrl(providerContext);
  const ottCookie = options?.ottCookie || prefixToOtt(ott);

  let token: string | undefined;
  try {
    const manual = usableSessionToken(await kvStore?.get<string>("t_hash_t"));
    const cached = await kvStore?.get<CachedToken>(`t_hash_t_${ottCookie}`);
    if (manual) {
      token = manual;
    } else if (cached && Date.now() - cached.ts < TOKEN_TTL) {
      token = usableSessionToken(cached.token);
    }
  } catch {}

  if (!token && unlockIfMissing) {
    token = await unlockSharedSession(providerContext, baseUrl, ottCookie);
  }

  const parts = [
    token ? `t_hash_t=${token}` : "",
    "hd=on",
    `ott=${ottCookie}`,
    options?.studioCookie ? `studio=${options.studioCookie}` : "",
  ].filter(Boolean);
  return parts.join("; ");
};

export const invalidateNetMirrorSession = async (
  providerContext: ProviderContext,
  ottCookie: string
) => {
  try {
    await providerContext.kvStore.delete(`t_hash_t_${ottCookie}`);
  } catch {}
};

export const resolveNewTvApiBase = async (
  providerContext: ProviderContext
): Promise<string> => {
  const { axios, kvStore } = providerContext;
  try {
    const cached = await kvStore?.get<{ apiBase: string; ts: number }>("newtv_api_base");
    if (cached && cached.apiBase && Date.now() - cached.ts < 86400000) return cached.apiBase;
  } catch {}

  const domains = [
    "https://mobiledetects.com", "https://mobiledetect.app", "https://mobidetect.art",
    "https://mobidetect.cc", "https://mobidetect.shop", "https://mobidetects.top",
  ];
  for (const domain of domains) {
    try {
      const res = await axios.get(`${domain}/checknewtv.php`, {
        headers: {
          "X-Requested-With": "NetmirrorNewTV v1.0",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0 /OS.GatuNewTV v1.0",
          Accept: "application/json, text/plain, */*",
        },
        timeout: 4000,
      });
      const tokenHash = res.data?.token_hash;
      if (tokenHash) {
        const decoded =
          typeof atob === "function"
            ? atob(tokenHash)
            : Buffer.from(tokenHash, "base64").toString("utf-8");
        const apiBase = decoded.trim().replace(/\/+$/, "");
        if (apiBase.startsWith("http")) {
          try {
            await kvStore?.set("newtv_api_base", { apiBase, ts: Date.now() });
          } catch {}
          return apiBase;
        }
      }
    } catch {}
  }
  return "https://tv.imgcdn.kim";
};

export const getPosterUrl = (id: string, prefix: NetMirrorOtt): string => {
  if (prefix === "pv") {
    return id.length > 10
      ? `https://imgcdn.kim/pv/v/350/${id}.jpg`
      : `https://imgcdn.kim/pv/v/${id}.jpg`;
  }
  if (prefix === "hs") return `https://imgcdn.kim/hs/v/166/${id}.jpg`;
  return `https://imgcdn.kim/poster/v/${id}.jpg`;
};

export const getEpisodePosterUrl = (id: string, prefix: NetMirrorOtt): string => {
  if (prefix === "pv") return `https://imgcdn.kim/pvepimg/${id}.jpg`;
  if (prefix === "hs") return `https://imgcdn.kim/hsepimg/${id}.jpg`;
  return `https://imgcdn.kim/epimg/150/${id}.jpg`;
};

interface EngineArgs {
  providerContext: ProviderContext;
  signal?: AbortSignal;
  prefix: NetMirrorOtt;
  providerValue?: string;
  studio?: StudioOptions;
}

const engineCookies = (args: EngineArgs, unlockIfMissing = true) =>
  getNetMirrorCookie(args.providerContext, args.prefix, unlockIfMissing, args.studio);

const pathFor = (prefix: NetMirrorOtt) => (prefix ? `${prefix}/` : "");

export const netMirrorSearch = async ({
  searchQuery,
  page,
  prefix,
  signal,
  providerContext,
  studio,
}: {
  searchQuery: string;
  page: number;
  prefix: NetMirrorOtt;
  providerValue?: string;
  signal?: AbortSignal;
  providerContext: ProviderContext;
  studio?: StudioOptions;
}): Promise<Post[]> => {
  try {
    if (page > 1) return [];
    const { axios } = providerContext;
    const baseUrl = await getNetMirrorBaseUrl(providerContext);
    const query = searchQuery?.trim();
    if (!query) return [];

    const cookies = await engineCookies({ providerContext, prefix, studio });
    const t = Math.round(Date.now() / 1000);
    const url = `${baseUrl}/mobile/${pathFor(prefix)}search.php?s=${encodeURIComponent(query)}&t=${t}`;

    const res = await axios.get(url, {
      signal,
      headers: getNetMirrorMobileHeaders(baseUrl, cookies),
      timeout: TIMEOUT,
    });

    const results = res.data?.searchResult || [];
    return results
      .filter((item: any) => item?.id)
      .map((item: any) => {
        const id = String(item.id);
        const title = item?.t || `ID: ${id}`;
        return {
          title,
          link: `${id}|${prefix}|${encodeURIComponent(title)}`,
          image: getPosterUrl(id, prefix),
          tag: item?.y || (item?.r && item.r !== "Series" ? item.r : undefined),
          aspectRatio: prefix === "pv" ? 16 / 9 : undefined,
        };
      });
  } catch (err) {
    console.error(`netMirrorSearch error [${prefix}]:`, err);
    return [];
  }
};

interface HomeTrayItem { id: string; image: string; alt?: string; }
interface HomeTray { title: string; items: HomeTrayItem[]; }

const homeTrayCache = new Map<string, { trays: HomeTray[]; timestamp: number }>();
const titleCache = new Map<string, string>();
const homeScopeKey = (baseUrl: string, prefix: NetMirrorOtt, studio?: StudioOptions) =>
  `${baseUrl}:${studio?.ottCookie || prefixToOtt(prefix)}:${studio?.studioCookie || ""}`;

const studioSpotlights: Record<string, string> = {
  disney: "pv",
  pixar: "pixar",
  starwars: "starwars",
  marvel: "marvel",
};

const parseHtmlTrays = (html: string, cheerio: any): HomeTray[] => {
  const trays: HomeTray[] = [];
  if (!html || typeof html !== "string") return trays;

  if (cheerio && typeof cheerio.load === "function") {
    try {
      const $ = cheerio.load(html);
      $(".tray-container").each((_i: number, el: any) => {
        const title = $(el).find("h2").first().text().trim();
        const items: HomeTrayItem[] = [];
        $(el).find("article").each((_j: number, art: any) => {
          const a = $(art).find("a[data-post]").first();
          const id = a.attr("data-post") || $(art).attr("data-post");
          const img = $(art).find("img").attr("data-src") || $(art).find("img").attr("src");
          const alt = $(art).find("img").attr("alt") || "";
          if (id) items.push({ id, image: img || "", alt });
        });
        if (title && items.length > 0) trays.push({ title, items });
      });
      $("#top10, .top10").each((_i: number, el: any) => {
        const title = $(el).find("span").first().text().trim() || "Top 10 Today";
        const items: HomeTrayItem[] = [];
        $(el).find(".top10-post, article").each((_j: number, art: any) => {
          const a = $(art).find("a[data-post]").first();
          const id = a.attr("data-post") || $(art).attr("data-post");
          const poster = $(art).find("img").last();
          const img = poster.attr("data-src") || poster.attr("src");
          if (id) items.push({ id, image: img || "", alt: "" });
        });
        if (title && items.length > 0 &&
            !trays.some((t) => t.title.toLowerCase() === title.toLowerCase())) {
          trays.push({ title, items });
        }
      });
      if (trays.length > 0) return trays;
    } catch {}
  }

  const sections = html.split(/class="[^"]*tray-container[^"]*"/);
  for (let i = 1; i < sections.length; i++) {
    const sec = sections[i];
    const title = sec.match(/<h2[^>]*>([^<]+)<\/h2>/)?.[1]?.trim() || "";
    const items: HomeTrayItem[] = [];
    for (const art of sec.match(/<article[\s\S]*?<\/article>/g) || []) {
      const id = art.match(/data-post="([^"]+)"/)?.[1];
      const img = art.match(/data-src="([^"]+)"/)?.[1] || art.match(/src="([^"]+)"/)?.[1] || "";
      const alt = art.match(/alt="([^"]*)"/)?.[1] || "";
      if (id) items.push({ id, image: img, alt });
    }
    if (title && items.length > 0 &&
        !trays.some((t) => t.title.toLowerCase() === title.toLowerCase())) {
      trays.push({ title, items });
    }
  }
  return trays;
};

export const getCachedHomeTrays = async (
  providerContext: ProviderContext,
  prefix: NetMirrorOtt,
  studio?: StudioOptions,
  signal?: AbortSignal
): Promise<HomeTray[]> => {
  const ottCookie = studio?.ottCookie || prefixToOtt(prefix);
  const baseUrl = await getNetMirrorBaseUrl(providerContext);
  const cacheKey = homeScopeKey(baseUrl, prefix, studio);
  const cached = homeTrayCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < TRAY_TTL) return cached.trays;

  const { axios, cheerio } = providerContext;
  const url = `${baseUrl}/mobile/home?app=1`;
  const fetchHome = async () => {
    const cookies = await getNetMirrorCookie(providerContext, prefix, true, studio);
    if (signal?.aborted) throw new Error("Catalog request canceled");
    if (!/(?:^|; )t_hash_t=[^;]+/.test(cookies)) {
      throw new Error("Could not start a catalog session. Try again.");
    }
    const res = await axios.get(url, {
      signal,
      withCredentials: false,
      headers: {
        ...getNetMirrorMobileHeaders(baseUrl, cookies),
        "Cache-Control": "no-cache",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-IN,en-US;q=0.9,en;q=0.8",
        "X-Requested-With": "XMLHttpRequest",
        Referer: `${baseUrl}/mobile/home?app=1`,
      },
      timeout: 10000,
    });
    return typeof res.data === "string" ? res.data : "";
  };

  try {
    let html = await fetchHome();
    if (html.includes("data-addhash") && !parseHtmlTrays(html, cheerio).length) {
      await invalidateNetMirrorSession(providerContext, ottCookie);
      html = await fetchHome();
    }
    // The home endpoint can return Netflix even with a session cookie. The
    // poster paths identify the OTT, and the spotlight identifies each studio.
    const spotlight = html.match(/\/mobile\/img\/(pv|pixar|starwars|marvel)-bg\.jpg\b/i)?.[1];
    const expectedSpotlight = studio?.studioCookie && studioSpotlights[studio.studioCookie];
    if ((expectedSpotlight && spotlight !== expectedSpotlight) ||
        (ottCookie === "hs" && spotlight)) {
      throw new Error("The catalog response did not match this studio. Try again.");
    }
    const posterScope = prefix || "nf";
    const trays = parseHtmlTrays(html, cheerio).flatMap(({ title, items }) => {
      const scopedItems = items.filter(({ image }) =>
        image.startsWith(`https://imgcdn.kim/${posterScope}/`) ||
        image.startsWith(`//imgcdn.kim/${posterScope}/`)
      );
      return scopedItems.length ? [{ title, items: scopedItems }] : [];
    });
    if (!trays.length) {
      throw new Error("The catalog response did not match this provider. Try again.");
    }
    homeTrayCache.set(cacheKey, { trays, timestamp: Date.now() });
    return trays;
  } catch (err) {
    if (cached && !signal?.aborted) return cached.trays;
    throw err;
  }
};

export const netMirrorGetPosts = async ({
  filter,
  page,
  prefix,
  signal,
  providerContext,
  studio,
}: {
  filter: string;
  page: number;
  prefix: NetMirrorOtt;
  providerValue?: string;
  signal?: AbortSignal;
  providerContext: ProviderContext;
  studio?: StudioOptions;
}): Promise<Post[]> => {
  try {
    if (page > 1) return [];
    const { axios } = providerContext;
    const baseUrl = await getNetMirrorBaseUrl(providerContext);
    const prefixPath = pathFor(prefix);
    const t = Math.round(Date.now() / 1000);
    const cleanFilter = (filter || "").trim().toLowerCase();
    const trays = await getCachedHomeTrays(providerContext, prefix, studio, signal);
    const matchedTray = trays.find((tray) => tray.title.toLowerCase() === cleanFilter);
    if (!matchedTray) return [];

    const cookies = await engineCookies({ providerContext, prefix, studio }, false);
    const posts = await Promise.all(matchedTray.items.map(async ({ id, alt, image }) => {
      const titleKey = `${homeScopeKey(baseUrl, prefix, studio)}:${id}`;
      let title = titleCache.get(titleKey) || alt?.trim();
      if (!title) {
        try {
          const { data } = await axios.get(
            `${baseUrl}/mobile/${prefixPath}post.php?id=${encodeURIComponent(id)}&t=${t}`,
            { signal, withCredentials: false, headers: getNetMirrorMobileHeaders(baseUrl, cookies), timeout: 6000 }
          );
          title = typeof data?.title === "string" ? data.title.trim() : "";
          if (title) titleCache.set(titleKey, title);
        } catch {}
      }
      if (!title) return null;
      return {
        title,
        link: `${id}|${prefix}|${encodeURIComponent(title)}`,
        image: resolveUrl(image, baseUrl),
        aspectRatio: prefix === "pv" ? 16 / 9 : undefined,
      };
    }));
    return posts.filter((post) => post !== null);
  } catch (err) {
    console.error(`netMirrorGetPosts error [${prefix}]:`, err);
    return [];
  }
};

export const netMirrorGetMeta = async ({
  link,
  prefix: defaultPrefix,
  providerContext,
  studio,
}: {
  link: string;
  prefix: NetMirrorOtt;
  providerContext: ProviderContext;
  studio?: StudioOptions;
}): Promise<Info> => {
  const { axios } = providerContext;
  const baseUrl = await getNetMirrorBaseUrl(providerContext);

  let id = "";
  let prefix: NetMirrorOtt = defaultPrefix;
  let titleFromLink = "";

  if (link.includes("|")) {
    const parts = link.split("|");
    id = parts[0];
    prefix = (parts[1] as NetMirrorOtt) || defaultPrefix;
    if (parts[2]) {
      try {
        titleFromLink = decodeURIComponent(parts[2]);
      } catch {
        titleFromLink = parts[2];
      }
    }
  } else if (link.includes("id=")) {
    id = link.split("id=")[1].split("&")[0];
    if (link.includes("title=")) {
      titleFromLink = decodeURIComponent(link.split("title=")[1].split("&")[0]);
    }
  } else {
    id = link;
  }

  const cookies = await engineCookies({ providerContext, prefix, studio });
  const prefixPath = pathFor(prefix);
  const t = Math.round(Date.now() / 1000);

  let title = titleFromLink;
  let synopsis = "";
  const image = getPosterUrl(id, prefix);
  const poster = prefix === "pv" ? `https://imgcdn.kim/pv/v/350/${id}.jpg` : undefined;
  let cast: string[] = [];
  const tags: string[] = [];
  let imdbId = "";
  let type = "movie";
  const linkList: Link[] = [];

  try {
    const res = await axios.get(
      `${baseUrl}/mobile/${prefixPath}post.php?id=${id}&t=${t}`,
      { headers: getNetMirrorMobileHeaders(baseUrl, cookies), timeout: TIMEOUT }
    );
    const data = res.data;

    if (data) {
      title = data.title || title;
      synopsis = data.desc || "";
      if (data.year) tags.push(String(data.year));
      if (typeof data.genre === "string") {
        data.genre.split(",").forEach((g: string) => {
          const trimmed = g.trim();
          if (trimmed) tags.push(trimmed);
        });
      }
      if (typeof data.match === "string" && data.match.includes("IMDb")) tags.push(data.match);
      if (typeof data.cast === "string") {
        cast = data.cast.split(",").map((c: string) => c.trim()).filter(Boolean);
      }

      const hasActualEpisodes =
        Array.isArray(data.episodes) && data.episodes.some((ep: any) => ep?.id);

      if (Array.isArray(data.season) && data.season.length > 0) {
        type = "series";
        data.season.forEach((s: any) => {
          const sNum = String(s.s || s.name || "1").replace(/[^0-9]/g, "") || "1";
          linkList.push({
            title: `Season ${s.s || s.name || "1"}`,
            episodesLink: `${s.id}|${id}|${prefix}|${encodeURIComponent(title)}|${sNum}`,
          });
        });
      } else if (hasActualEpisodes) {
        type = "series";
        linkList.push({
          title: "Season 1",
          episodesLink: `${id}|${id}|${prefix}|${encodeURIComponent(title)}|1`,
        });
      }
    }
  } catch (err) {
    console.error(`netMirrorGetMeta post.php error [${prefix}]:`, err);
  }

  if (linkList.length === 0) {
    linkList.push({
      title: title || "Movie",
      directLinks: [
        {
          title: title || "Movie",
          link: `${id}|${prefix}|${encodeURIComponent(title)}`,
          type: "movie",
        },
      ],
    });
  }

  return {
    title: title || "Unknown Title",
    synopsis: synopsis || "",
    image,
    poster,
    imdbId,
    type,
    cast: cast.length > 0 ? cast : undefined,
    tags: tags.length > 0 ? tags : undefined,
    linkList,
  };
};

export const netMirrorGetEpisodes = async ({
  seasonId,
  prefix: defaultPrefix,
  signal,
  providerContext,
  studio,
}: {
  seasonId: string;
  prefix: NetMirrorOtt;
  signal?: AbortSignal;
  providerContext: ProviderContext;
  studio?: StudioOptions;
}): Promise<EpisodeLink[]> => {
  const { axios } = providerContext;
  const baseUrl = await getNetMirrorBaseUrl(providerContext);
  const t = Math.round(Date.now() / 1000);

  let sid = seasonId;
  let seriesId = seasonId;
  let prefix = defaultPrefix;
  let seriesTitle = "";
  let seasonNumber = 1;

  if (seasonId.includes("|")) {
    const parts = seasonId.split("|");
    sid = parts[0];
    seriesId = parts[1] || sid;
    prefix = (parts[2] as NetMirrorOtt) || defaultPrefix;
    if (parts[3]) {
      try {
        seriesTitle = decodeURIComponent(parts[3]);
      } catch {
        seriesTitle = parts[3];
      }
    }
    if (parts[4]) seasonNumber = parseInt(parts[4], 10) || 1;
  }

  const cookies = await engineCookies({ providerContext, prefix, studio });
  const prefixPath = pathFor(prefix);
  const episodeList: EpisodeLink[] = [];

  let page = 1;
  let hasMorePages = true;
  while (hasMorePages && page <= 20) {
    try {
      const res = await axios.get(
        `${baseUrl}/mobile/${prefixPath}episodes.php?s=${sid}&series=${seriesId}&t=${t}&page=${page}`,
        { signal, headers: getNetMirrorMobileHeaders(baseUrl, cookies), timeout: TIMEOUT }
      );
      const data = res.data;
      const episodes = Array.isArray(data?.episodes) ? data.episodes : [];
      if (episodes.length === 0) break;

      episodes.forEach((episode: any) => {
        if (!episode?.id) return;
        const epNum =
          String(episode?.ep || "").replace(/[^0-9]/g, "").trim() ||
          `${episodeList.length + 1}`;
        const sNum =
          String(episode?.s || "").replace(/[^0-9]/g, "").trim() || `${seasonNumber}`;
        const epTitle = episode?.t ? `Episode ${epNum}: ${episode.t}` : `Episode ${epNum}`;
        episodeList.push({
          title: epTitle,
          link: `${episode.id}|${prefix}|${encodeURIComponent(seriesTitle)}|${sNum}|${epNum}`,
          description: episode?.ep_desc || undefined,
          image: getEpisodePosterUrl(episode.id, prefix),
        });
      });

      if (data?.nextPageShow && data.nextPageShow > 0) page++;
      else hasMorePages = false;
    } catch (err) {
      console.error(`netMirrorGetEpisodes error [${prefix}]:`, err);
      break;
    }
  }

  if (episodeList.length === 0 && sid) {
    episodeList.push({
      title: "Episode 1",
      link: `${sid}|${prefix}|${encodeURIComponent(seriesTitle)}|${seasonNumber}|1`,
      image: getEpisodePosterUrl(sid, prefix),
    });
  }

  return episodeList;
};

const qualityFromResolution = (line: string): Stream["quality"] | undefined => {
  const res = line.match(/RESOLUTION=(\d+)x(\d+)/);
  if (!res) return undefined;
  const height = parseInt(res[2], 10);
  if (height >= 2000) return "2160";
  if (height >= 1000) return "1080";
  if (height >= 700) return "720";
  if (height >= 450) return "480";
  return "360";
};

const qualityFromUrl = (url: string): Stream["quality"] => {
  if (/2160p|4k/i.test(url)) return "2160";
  if (/720p/.test(url)) return "720";
  if (/480p/.test(url)) return "480";
  if (/360p/.test(url)) return "360";
  return "1080";
};

const subtitlesFromTracks = (tracks: any[]): TextTracks => {
  const subtitles: TextTracks = [];
  for (const track of tracks || []) {
    let uri = track?.file || "";
    if (!uri) continue;
    if (uri.startsWith("//")) uri = `https:${uri}`;
    const isVtt = /\.vtt$/i.test(uri);
    subtitles.push({
      title: track?.label || "Subtitle",
      language: track?.label || "Unknown",
      type: isVtt ? "text/vtt" : "application/x-subrip",
      uri,
    });
  }
  return subtitles;
};

const looksAbusive = (text: string) =>
  text.includes("220884") || text.includes("Only Valid Users Allowed");

const fetchPlaylist = async (
  axios: any,
  baseUrl: string,
  prefix: NetMirrorOtt,
  id: string,
  title: string,
  cookies: string,
  signal?: AbortSignal
): Promise<any> => {
  const tm = Math.round(Date.now() / 1000);
  const urls = [
    `${baseUrl}/mobile/${pathFor(prefix)}playlist.php?id=${id}&t=${encodeURIComponent(title || "Title")}&tm=${tm}`,
    `${baseUrl}/mobile/playlist.php?id=${id}&t=${encodeURIComponent(title || "Title")}&tm=${tm}`,
  ];
  for (const url of urls) {
    try {
      const res = await axios.get(url, {
        signal,
        headers: getNetMirrorMobileHeaders(baseUrl, cookies),
        timeout: TIMEOUT,
      });
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      if (data && Array.isArray(data.sources) && data.sources.length > 0) return data;
    } catch {}
  }
  return null;
};

const fetchMaster = async (
  axios: any,
  url: string,
  headers: Record<string, string>,
  signal?: AbortSignal
): Promise<string> => {
  try {
    const res = await axios.get(url, { signal, headers, timeout: TIMEOUT });
    return typeof res.data === "string" ? res.data : "";
  } catch {
    return "";
  }
};

export const netMirrorGetStream = async ({
  id: rawId,
  type,
  prefix: defaultPrefix,
  signal,
  providerContext,
  studio,
}: {
  id: string;
  type?: string;
  prefix: NetMirrorOtt;
  signal?: AbortSignal;
  providerContext: ProviderContext;
  isDownload?: boolean;
  studio?: StudioOptions;
}): Promise<Stream[]> => {
  const { axios } = providerContext;
  const baseUrl = await getNetMirrorBaseUrl(providerContext);

  let id = rawId;
  let prefix = defaultPrefix;
  let title = "";

  if (rawId.includes("|")) {
    const parts = rawId.split("|");
    id = parts[0];
    prefix = (parts[1] as NetMirrorOtt) || defaultPrefix;
    if (parts[2]) {
      try {
        title = decodeURIComponent(parts[2]);
      } catch {
        title = parts[2];
      }
    }
  }

  const ottCookie = studio?.ottCookie || prefixToOtt(prefix);
  const serverName = prefix === "pv" ? "Prime Video" : prefix === "hs" ? "Disney+/Hotstar" : "Netflix";
  const streamLinks: Stream[] = [];

  if (!title) {
    const cachedTitle = titleCache.get(`${homeScopeKey(baseUrl, prefix, studio)}:${id}`);
    if (cachedTitle) title = cachedTitle;
  }

  const buildStreams = async (cookies: string): Promise<Stream[]> => {
    const playlist = await fetchPlaylist(axios, baseUrl, prefix, id, title, cookies, signal);
    if (!playlist) return [];

    const subtitles = subtitlesFromTracks(playlist.tracks);
    const headers = {
      "User-Agent": MOBILE_UA,
      Referer: `${baseUrl}/`,
      Origin: baseUrl,
      Cookie: cookies,
    };

    const streams: Stream[] = [];
    const seen = new Set<string>();
    const push = (link: string, quality: Stream["quality"], server: string) => {
      if (!link || looksAbusive(link) || seen.has(link)) return;
      seen.add(link);
      streams.push({
        server,
        link,
        type: "m3u8",
        quality,
        subtitles: subtitles.length > 0 ? subtitles : undefined,
        headers,
      });
    };

    for (const source of playlist.sources) {
      const rawFile = source?.file;
      if (!rawFile) continue;
      const sourceUrl = resolveUrl(rawFile, baseUrl);
      if (looksAbusive(sourceUrl)) continue;

      const masterText = await fetchMaster(axios, sourceUrl, headers, signal);
      if (!masterText || looksAbusive(masterText)) continue;

      const autoQuality: Stream["quality"] =
        /q=(\d{3,4})p/.test(rawFile) ? (rawFile.match(/q=(\d{3,4})p/)?.[1] as Stream["quality"]) : "1080";
      push(sourceUrl, autoQuality, `${serverName} Auto`);

      const lines = masterText.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        if (!lines[i].startsWith("#EXT-X-STREAM-INF")) continue;
        const next = lines[i + 1]?.trim();
        if (!next || next.startsWith("#")) continue;
        const variantUrl = resolveUrl(next, sourceUrl);
        push(
          variantUrl,
          qualityFromResolution(lines[i]) || qualityFromUrl(variantUrl),
          `${serverName} HLS`
        );
      }
    }
    return streams;
  };

  try {
    let cookies = await getNetMirrorCookie(providerContext, prefix, true, studio);
    let streams = await buildStreams(cookies);

    // A stale/unscoped token makes the CDN serve the 220884 abuse asset.
    if (streams.length === 0) {
      await invalidateNetMirrorSession(providerContext, ottCookie);
      cookies = await getNetMirrorCookie(providerContext, prefix, true, studio);
      streams = await buildStreams(cookies);
    }

    streamLinks.push(...streams);
  } catch (err) {
    console.log(`NetMirror playlist flow failed for ${id}:`, err);
  }

  streamLinks.sort((a, b) => {
    const qA = parseInt(a.quality || "0", 10);
    const qB = parseInt(b.quality || "0", 10);
    return qB - qA;
  });

  return streamLinks;
};
