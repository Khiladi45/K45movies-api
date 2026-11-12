import {
  EpisodeLink,
  Info,
  Link,
  Post,
  ProviderContext,
  Stream,
  TextTracks,
} from "./types";

export type NetMirrorOtt = "" | "pv" | "hs";

// ============ NEWTV API DOMAIN POOL (from CloudStream plugin) ============
const NEWTV_DOMAINS = [
  "aHR0cHM6Ly9tb2JpbGVkZXRlY3RzLmNvbQ==", // https://mobiledetects.com
  "aHR0cHM6Ly9tb2JpbGVkZXRlY3QuYXBw",     // https://mobiledetect.app
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LmFydA==",     // https://mobidetect.art
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LmNj",          // https://mobidetect.cc
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LmNsaWNr",      // https://mobidetect.click
  "aHR0cHM6Ly9tb2JpZGV0ZWN0Lmluaw==",     // https://mobidetect.ink
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LmxpdmU=",     // https://mobidetect.live
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnBybw==",     // https://mobidetect.pro
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNob3A=",     // https://mobidetect.shop
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNpdGU=",     // https://mobidetect.site
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNwYWNl",     // https://mobidetect.space
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnN0b3Jl",     // https://mobidetect.store
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnZpcA==",     // https://mobidetect.vip
  "aHR0cHM6Ly9tb2JpZGV0ZWN0Lndpa2k=",     // https://mobidetect.wiki
  "aHR0cHM6Ly9tb2JpZGV0ZWN0Lnh5eg==",     // https://mobidetect.xyz
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5hcnQ=",     // https://mobidetects.art
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5jYw==",     // https://mobidetects.cc
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5pbmZv",     // https://mobidetects.info
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5pbms=",     // https://mobidetects.ink
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5saXZl",     // https://mobidetects.live
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5wcm8=",     // https://mobidetects.pro
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5zdG9yZQ==", // https://mobidetects.store
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy50b3A=",     // https://mobidetects.top
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy54eXo=",     // https://mobidetects.xyz
];

const NEWTV_BASE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "X-Requested-With": "NetmirrorNewTV v1.0",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0 /OS.GatuNewTV v1.0",
  Accept: "application/json, text/plain, */*",
};

// ============ NEWTV API RESOLUTION (from CloudStream plugin) ============
let cachedApiBase: string | null = null;

export const resolveNewTvApiBase = async (providerContext: ProviderContext): Promise<string> => {
  if (cachedApiBase) return cachedApiBase;

  const { axios } = providerContext;

  for (const encoded of NEWTV_DOMAINS) {
    try {
      const base = Buffer.from(encoded, "base64").toString("utf-8").trim();
      const res = await axios.get(`${base}/checknewtv.php`, {
        headers: NEWTV_BASE_HEADERS,
        timeout: 4000,
      });

      if (res.data?.token_hash) {
        const decoded = Buffer.from(res.data.token_hash, "base64").toString("utf-8").trim();
        if (decoded.startsWith("http")) {
          cachedApiBase = decoded.replace(/\/+$/, "");
          return cachedApiBase;
        }
      }
    } catch {
      continue;
    }
  }

  throw new Error("Failed to resolve NewTV API base URL");
};

const buildNewTvHeaders = (ott: string, extra: Record<string, string> = {}): Record<string, string> => ({
  ...NEWTV_BASE_HEADERS,
  Ott: ott,
  ...extra,
});

// ============ POSTER URLS ============
export const getPosterUrl = (id: string, prefix: NetMirrorOtt): string => {
  if (prefix === "pv") {
    return id.length > 10
      ? `https://imgcdn.kim/pv/v/350/${id}.jpg`
      : `https://imgcdn.kim/pv/341/${id}.jpg`;
  }
  if (prefix === "hs") {
    return `https://imgcdn.kim/hs/v/166/${id}.jpg`;
  }
  return `https://imgcdn.kim/poster/v/${id}.jpg`;
};

export const getEpisodePosterUrl = (id: string, prefix: NetMirrorOtt): string => {
  if (prefix === "pv") {
    return `https://img.nfmirrorcdn.top/pvepimg/${id}.jpg`;
  }
  if (prefix === "hs") {
    return `https://imgcdn.kim/hsepimg/${id}.jpg`;
  }
  return `https://imgcdn.kim/poster/v/150/${id}.jpg`;
};

// ============ SEARCH (NewTV API) ============
export const netMirrorSearch = async ({
  searchQuery,
  page,
  prefix,
  signal,
  providerContext,
}: {
  searchQuery: string;
  page: number;
  prefix: NetMirrorOtt;
  providerValue?: string;
  signal?: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> => {
  try {
    if (page > 1) return [];
    const { axios } = providerContext;
    const apiBase = await resolveNewTvApiBase(providerContext);
    const query = searchQuery?.trim();
    if (!query) return [];

    const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
    const url = `${apiBase}/newtv/search.php?s=${encodeURIComponent(query)}`;

    const res = await axios.get(url, {
      signal,
      headers: buildNewTvHeaders(ottHeader),
      timeout: 8000,
    });

    const results = res.data?.searchResult || [];
    const catalog: Post[] = [];
    const template = res.data?.imgcdn || res.data?.detailsimgcdn;

    for (const item of results) {
      const id = item?.id;
      const title = item?.t || "";
      if (!id) continue;

      const image = template ? `${template.replace(/\/+$/, "")}/${id}.jpg` : getPosterUrl(id, prefix);
      const link = `${id}|${prefix}|${encodeURIComponent(title)}`;

      catalog.push({
        title,
        link,
        image,
        tag: item?.y || (item?.r && item.r !== "Series" ? item.r : undefined),
        aspectRatio: prefix === "pv" ? 16 / 9 : undefined,
      });
    }

    return catalog;
  } catch (err) {
    console.error(`netMirrorSearch error [${prefix}]:`, err);
    return [];
  }
};

// ============ GET POSTS / CATALOG (NewTV API) ============
export const netMirrorGetPosts = async ({
  filter,
  page,
  prefix,
  signal,
  providerContext,
}: {
  filter: string;
  page: number;
  prefix: NetMirrorOtt;
  providerValue?: string;
  signal?: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> => {
  // For now, use search as fallback since NewTV main.php structure is complex
  return netMirrorSearch({
    searchQuery: filter,
    page,
    prefix,
    signal,
    providerContext,
  });
};

// ============ GET META (NewTV API) ============
export const netMirrorGetMeta = async ({
  link,
  prefix: defaultPrefix,
  providerContext,
}: {
  link: string;
  prefix: NetMirrorOtt;
  providerContext: ProviderContext;
}): Promise<Info> => {
  const { axios } = providerContext;
  const apiBase = await resolveNewTvApiBase(providerContext);

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
  } else {
    id = link;
  }

  const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
  const url = `${apiBase}/newtv/post.php?id=${id}`;

  let title = titleFromLink;
  let synopsis = "";
  let image = getPosterUrl(id, prefix);
  let poster = prefix === "pv" ? `https://imgcdn.kim/pv/v/${id}.jpg` : undefined;
  let cast: string[] = [];
  const tags: string[] = [];
  let imdbId = "";
  let type = "movie";
  const linkList: Link[] = [];

  try {
    const res = await axios.get(url, {
      headers: buildNewTvHeaders(ottHeader, { Lastep: "", Usertoken: "" }),
      timeout: 8000,
    });
    const data = res.data;

    if (data) {
      title = data.title || data.title_name || title;
      synopsis = data.desc || "";
      if (data.year) tags.push(String(data.year));
      if (typeof data.genre === "string") {
        data.genre.split(",").forEach((g: string) => {
          const trimmed = g.trim();
          if (trimmed) tags.push(trimmed);
        });
      }
      if (typeof data.match === "string" && data.match.includes("IMDb")) {
        tags.push(data.match);
      }
      if (typeof data.cast === "string") {
        cast = data.cast.split(",").map((c: string) => c.trim()).filter(Boolean);
      }

      const hasActualEpisodes = Array.isArray(data.episodes) && data.episodes.some((ep: any) => ep?.id);

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
      } else {
        type = "movie";
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
    }
  } catch (err) {
    console.error(`netMirrorGetMeta error [${prefix}]:`, err);
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
    image: image || "",
    poster,
    imdbId,
    type,
    cast: cast.length > 0 ? cast : undefined,
    tags: tags.length > 0 ? tags : undefined,
    linkList,
  };
};

// ============ GET EPISODES (NewTV API) ============
export const netMirrorGetEpisodes = async ({
  seasonId,
  prefix: defaultPrefix,
  signal,
  providerContext,
}: {
  seasonId: string;
  prefix: NetMirrorOtt;
  signal?: AbortSignal;
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> => {
  const { axios } = providerContext;
  const apiBase = await resolveNewTvApiBase(providerContext);

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
    if (parts[4]) {
      seasonNumber = parseInt(parts[4], 10) || 1;
    }
  }

  const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
  const episodeList: EpisodeLink[] = [];

  let page = 1;
  let hasMorePages = true;

  while (hasMorePages && page <= 6) {
    try {
      const url = `${apiBase}/newtv/episodes.php?id=${sid}&page=${page}`;
      const res = await axios.get(url, {
        signal,
        headers: buildNewTvHeaders(ottHeader),
        timeout: 8000,
      });
      const data = res.data;

      if (Array.isArray(data?.episodes) && data.episodes.length > 0) {
        data.episodes.forEach((episode: any) => {
          const epNum = String(episode?.ep || "").replace(/[^0-9]/g, "").trim() || `${episodeList.length + 1}`;
          const sNum = String(episode?.s || "").replace(/[^0-9]/g, "").trim() || `${seasonNumber}`;
          const epTitle = episode?.t ? `Episode ${epNum}: ${episode.t}` : `Episode ${epNum}`;
          episodeList.push({
            title: epTitle,
            link: `${episode?.id}|${prefix}|${encodeURIComponent(seriesTitle)}|${sNum}|${epNum}`,
            description: episode?.ep_desc || undefined,
          });
        });

        if (data?.nextPageShow && data.nextPageShow > 0) {
          page++;
        } else {
          hasMorePages = false;
        }
      } else {
        hasMorePages = false;
      }
    } catch (err) {
      console.error(`netMirrorGetEpisodes error [${prefix}]:`, err);
      break;
    }
  }

  if (episodeList.length === 0 && sid) {
    episodeList.push({
      title: "Episode 1",
      link: `${sid}|${prefix}|${encodeURIComponent(seriesTitle)}|${seasonNumber}|1`,
    });
  }

  return episodeList;
};

// ============ GET STREAM (NewTV API) ============
export const netMirrorGetStream = async ({
  id: rawId,
  type,
  prefix: defaultPrefix,
  signal,
  providerContext,
  isDownload,
}: {
  id: string;
  type?: string;
  prefix: NetMirrorOtt;
  signal?: AbortSignal;
  providerContext: ProviderContext;
  isDownload?: boolean;
}): Promise<Stream[]> => {
  const { axios } = providerContext;
  const apiBase = await resolveNewTvApiBase(providerContext);

  let id = rawId;
  let prefix = defaultPrefix;

  if (rawId.includes("|")) {
    const parts = rawId.split("|");
    id = parts[0];
    prefix = (parts[1] as NetMirrorOtt) || defaultPrefix;
  }

  const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
  const serverName = prefix === "hs" ? "Disney+" : prefix === "pv" ? "Prime Video" : "Netflix";
  const streamLinks: Stream[] = [];

  try {
    const url = `${apiBase}/newtv/player.php?id=${id}`;
    const res = await axios.get(url, {
      signal,
      headers: buildNewTvHeaders(ottHeader, { Usertoken: "" }),
      timeout: 8000,
    });

    const data = res.data;

    if (data && data.status === "ok" && data.video_link) {
      // Check if it's a master m3u8 with variants
      try {
        const m3u8Res = await axios.get(data.video_link, {
          signal,
          headers: { Referer: data.referer || apiBase },
          timeout: 5000,
        });

        const m3u8Text = typeof m3u8Res.data === "string" ? m3u8Res.data : "";

        if (m3u8Text.includes("#EXT-X-STREAM-INF")) {
          // Master playlist - extract variants
          const lines = m3u8Text.split("\n");
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("#EXT-X-STREAM-INF")) {
              const nextLine = lines[i + 1]?.trim();
              if (nextLine && nextLine.startsWith("http")) {
                let quality: Stream["quality"] = "1080";
                if (line.includes("1280x720") || nextLine.includes("720p")) quality = "720";
                else if (line.includes("854x480") || nextLine.includes("480p")) quality = "480";
                else if (line.includes("640x360") || nextLine.includes("360p")) quality = "360";

                streamLinks.push({
                  server: `${serverName} HLS (${quality}p)`,
                  link: nextLine,
                  type: "m3u8",
                  quality,
                  headers: {
                    Referer: data.referer || apiBase,
                    Origin: apiBase,
                  },
                });
              }
            }
          }
        } else {
          // Single stream
          streamLinks.push({
            server: `${serverName} HLS`,
            link: data.video_link,
            type: "m3u8",
            quality: "1080",
            headers: {
              Referer: data.referer || apiBase,
              Origin: apiBase,
            },
          });
        }
      } catch {
        // Fallback: just use the video link directly
        streamLinks.push({
          server: `${serverName} HLS`,
          link: data.video_link,
          type: "m3u8",
          quality: "1080",
          headers: {
            Referer: data.referer || apiBase,
            Origin: apiBase,
          },
        });
      }
    }
  } catch (err) {
    console.error(`netMirrorGetStream error [${prefix}]:`, err);
  }

  // Sort by quality
  streamLinks.sort((a, b) => {
    const qA = parseInt(a.quality || "0", 10);
    const qB = parseInt(b.quality || "0", 10);
    return qB - qA;
  });

  return streamLinks;
};