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

// Exact 24 domains from CloudStream NetMirror plugin
const NEWTV_DOMAINS = [
  "aHR0cHM6Ly9tb2JpbGVkZXRlY3RzLmNvbQ==", "aHR0cHM6Ly9tb2JpbGVkZXRlY3QuYXBw",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LmFydA==", "aHR0cHM6Ly9tb2JpZGV0ZWN0LmNj",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LmNsaWNr", "aHR0cHM6Ly9tb2JpZGV0ZWN0Lmluaw==",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LmxpdmU=", "aHR0cHM6Ly9tb2JpZGV0ZWN0LnBybw==",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNob3A=", "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNpdGU=",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNwYWNl", "aHR0cHM6Ly9tb2JpZGV0ZWN0LnN0b3Jl",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnZpcA==", "aHR0cHM6Ly9tb2JpZGV0ZWN0Lndpa2k=",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0Lnh5eg==", "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5hcnQ=",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5jYw==", "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5pbmZv",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5pbms=", "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5saXZl",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5wcm8=", "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5zdG9yZQ==",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy50b3A=", "aHR0cHM6Ly9tb2JpZGV0ZWN0cy54eXo="
];

const NEWTV_BASE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "X-Requested-With": "NetmirrorNewTV v1.0",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0 /OS.GatuNewTV v1.0",
  Accept: "application/json, text/plain, */*",
};

let cachedApiBase: string | null = null;

export const resolveNewTvApiBase = async (providerContext: ProviderContext): Promise<string> => {
  if (cachedApiBase) return cachedApiBase;
  const { axios } = providerContext;

  for (const encoded of NEWTV_DOMAINS) {
    try {
      const base = Buffer.from(encoded, "base64").toString("utf-8").trim();
      const res = await axios.get(`${base}/checknewtv.php`, {
        headers: NEWTV_BASE_HEADERS,
        timeout: 4000, // Sandbox-safe timeout
      });

      if (res.data?.token_hash) {
        const decoded = Buffer.from(res.data.token_hash, "base64").toString("utf-8").trim();
        if (decoded.startsWith("http")) {
          cachedApiBase = decoded.replace(/\/+$/, "");
          console.log(`[NetMirror] ✅ Resolved API Base: ${cachedApiBase}`);
          return cachedApiBase;
        }
      }
    } catch {
      // Continue to next domain
    }
  }
  throw new Error("Failed to resolve NewTV API base URL. All domains failed.");
};

const buildNewTvHeaders = (ott: string, extra: Record<string, string> = {}): Record<string, string> => ({
  ...NEWTV_BASE_HEADERS,
  Ott: ott,
  ...extra,
});

export const getPosterUrl = (id: string, prefix: NetMirrorOtt): string => {
  if (prefix === "pv") return id.length > 10 ? `https://imgcdn.kim/pv/v/350/${id}.jpg` : `https://imgcdn.kim/pv/341/${id}.jpg`;
  if (prefix === "hs") return `https://imgcdn.kim/hs/v/166/${id}.jpg`;
  return `https://imgcdn.kim/poster/v/${id}.jpg`;
};

// ==================== SEARCH ====================
export const netMirrorSearch = async ({
  searchQuery, page, prefix, signal, providerContext,
}: {
  searchQuery: string; page: number; prefix: NetMirrorOtt;
  providerValue?: string; signal?: AbortSignal; providerContext: ProviderContext;
}): Promise<Post[]> => {
  try {
    if (page > 1) return [];
    const { axios } = providerContext;
    const apiBase = await resolveNewTvApiBase(providerContext);
    const query = searchQuery?.trim();
    if (!query) return [];

    const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
    const res = await axios.get(`${apiBase}/newtv/search.php?s=${encodeURIComponent(query)}`, {
      signal, headers: buildNewTvHeaders(ottHeader), timeout: 8000,
    });

    const results = res.data?.searchResult || [];
    const template = res.data?.imgcdn || res.data?.detailsimgcdn;

    return results.map((item: any) => {
      const id = item?.id;
      const title = item?.t || `ID: ${id}`;
      const image = template ? `${template.replace(/\/+$/, "")}/${id}.jpg` : getPosterUrl(id, prefix);
      return {
        title, link: `${id}|${prefix}|${encodeURIComponent(title)}`, image,
        tag: item?.y || (item?.r && item.r !== "Series" ? item.r : undefined),
        aspectRatio: prefix === "pv" ? 16 / 9 : undefined,
      };
    });
  } catch (err) {
    console.error(`[NetMirror] ❌ Search error [${prefix}]:`, err);
    return [];
  }
};

// ==================== CATALOG / HOME PAGE ====================
export const netMirrorGetPosts = async ({
  filter, page, prefix, signal, providerContext,
}: {
  filter: string; page: number; prefix: NetMirrorOtt;
  providerValue?: string; signal?: AbortSignal; providerContext: ProviderContext;
}): Promise<Post[]> => {
  try {
    if (page > 1) return [];
    const { axios } = providerContext;
    const apiBase = await resolveNewTvApiBase(providerContext);
    const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
    const cleanFilter = filter.trim().toLowerCase();

    // 1. Fetch main page categories (Exactly like CloudStream getMainPage)
    const res = await axios.get(`${apiBase}/newtv/main.php`, {
      signal,
      headers: buildNewTvHeaders(ottHeader, { Page: "all", Recentplay: "", Watchlist: "", Usertoken: "" }),
      timeout: 8000,
    });

    const categories = res.data?.post || [];
    
    // 2. Find matching category (Exact match first, then partial)
    let matchedCategory = categories.find((cat: any) => cat.cate && cat.cate.toLowerCase() === cleanFilter);
    if (!matchedCategory) {
      matchedCategory = categories.find((cat: any) => cat.cate && cat.cate.toLowerCase().includes(cleanFilter));
    }

    // 3. Process IDs if category found
    if (matchedCategory && matchedCategory.ids) {
      const ids = matchedCategory.ids.split(",").map((id: string) => id.trim()).filter(Boolean);
      const template = matchedCategory.row === "h" ? (res.data.imgcdn_h || res.data.imgcdn_v) : (res.data.imgcdn_v || res.data.imgcdn_h);
      const referer = res.data.img_referer || apiBase;

      // Sandbox-safe parallel title fetch (limit to 20 to prevent timeout)
      const fetchLimit = Math.min(ids.length, 20);
      const titlePromises = ids.slice(0, fetchLimit).map(async (id: string) => {
        try {
          const postRes = await axios.get(`${apiBase}/newtv/post.php?id=${id}`, {
            headers: buildNewTvHeaders(ottHeader, { Lastep: "", Usertoken: "" }),
            timeout: 3000,
          });
          return { id, title: postRes.data?.title || postRes.data?.title_name || `ID: ${id}` };
        } catch {
          return { id, title: `ID: ${id}` };
        }
      });

      const titles = await Promise.all(titlePromises);
      const titleMap = new Map(titles.map((t: any) => [t.id, t.title]));

      return ids.map((id: string) => {
        const title = titleMap.get(id) || `ID: ${id}`;
        const posterUrl = template 
          ? (template.includes("------------------") ? template.replace("------------------", id) : `${template.replace(/\/+$/, "")}/${id}.jpg`)
          : getPosterUrl(id, prefix);

        return {
          title, link: `${id}|${prefix}|${encodeURIComponent(title)}`, image: posterUrl,
          headers: { Referer: referer }, aspectRatio: prefix === "pv" ? 16 / 9 : undefined,
        };
      });
    }

    // 4. Fallback to search if no category matches
    console.log(`[NetMirror] ⚠️ Category '${filter}' not found, falling back to search.`);
    return netMirrorSearch({ searchQuery: filter, page, prefix, signal, providerContext });
  } catch (err) {
    console.error(`[NetMirror] ❌ GetPosts error [${prefix}]:`, err);
    return [];
  }
};

// ==================== META / DETAILS ====================
export const netMirrorGetMeta = async ({
  link, prefix: defaultPrefix, providerContext,
}: {
  link: string; prefix: NetMirrorOtt; providerContext: ProviderContext;
}): Promise<Info> => {
  const { axios } = providerContext;
  const apiBase = await resolveNewTvApiBase(providerContext);

  let id = "", prefix: NetMirrorOtt = defaultPrefix, titleFromLink = "";
  if (link.includes("|")) {
    const parts = link.split("|");
    id = parts[0];
    prefix = (parts[1] as NetMirrorOtt) || defaultPrefix;
    if (parts[2]) { try { titleFromLink = decodeURIComponent(parts[2]); } catch { titleFromLink = parts[2]; } }
  } else { id = link; }

  const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
  let title = titleFromLink || `ID: ${id}`, synopsis = "", image = getPosterUrl(id, prefix);
  let poster = prefix === "pv" ? `https://imgcdn.kim/pv/v/${id}.jpg` : undefined;
  let cast: string[] = []; const tags: string[] = []; let type = "movie";
  const linkList: Link[] = [];

  try {
    const res = await axios.get(`${apiBase}/newtv/post.php?id=${id}`, {
      headers: buildNewTvHeaders(ottHeader, { Lastep: "", Usertoken: "" }), timeout: 8000,
    });
    const data = res.data;
    if (data) {
      title = data.title || data.title_name || title;
      synopsis = data.desc || "";
      if (data.year) tags.push(String(data.year));
      if (typeof data.genre === "string") data.genre.split(",").forEach((g: string) => { if (g.trim()) tags.push(g.trim()); });
      if (typeof data.match === "string" && data.match.includes("IMDb")) tags.push(data.match);
      if (typeof data.cast === "string") cast = data.cast.split(",").map((c: string) => c.trim()).filter(Boolean);

      const hasActualEpisodes = Array.isArray(data.episodes) && data.episodes.some((ep: any) => ep?.id);
      if (Array.isArray(data.season) && data.season.length > 0) {
        type = "series";
        data.season.forEach((s: any) => {
          const sNum = String(s.s || s.name || "1").replace(/[^0-9]/g, "") || "1";
          linkList.push({ title: `Season ${s.s || s.name || "1"}`, episodesLink: `${s.id}|${id}|${prefix}|${encodeURIComponent(title)}|${sNum}` });
        });
      } else if (hasActualEpisodes) {
        type = "series";
        linkList.push({ title: "Season 1", episodesLink: `${id}|${id}|${prefix}|${encodeURIComponent(title)}|1` });
      } else {
        type = "movie";
        linkList.push({ title: title || "Movie", directLinks: [{ title: title || "Movie", link: `${id}|${prefix}|${encodeURIComponent(title)}`, type: "movie" }] });
      }
    }
  } catch (err) { console.error(`[NetMirror] ❌ GetMeta error [${prefix}]:`, err); }

  if (linkList.length === 0) {
    linkList.push({ title: title || "Movie", directLinks: [{ title: title || "Movie", link: `${id}|${prefix}|${encodeURIComponent(title)}`, type: "movie" }] });
  }

  return { title: title || "Unknown", synopsis, image, poster, imdbId: "", type, cast: cast.length > 0 ? cast : undefined, tags: tags.length > 0 ? tags : undefined, linkList };
};

// ==================== EPISODES ====================
export const netMirrorGetEpisodes = async ({
  seasonId, prefix: defaultPrefix, signal, providerContext,
}: {
  seasonId: string; prefix: NetMirrorOtt; signal?: AbortSignal; providerContext: ProviderContext;
}): Promise<EpisodeLink[]> => {
  const { axios } = providerContext;
  const apiBase = await resolveNewTvApiBase(providerContext);

  let sid = seasonId, seriesId = seasonId, prefix = defaultPrefix, seriesTitle = "", seasonNumber = 1;
  if (seasonId.includes("|")) {
    const parts = seasonId.split("|");
    sid = parts[0]; seriesId = parts[1] || sid;
    prefix = (parts[2] as NetMirrorOtt) || defaultPrefix;
    if (parts[3]) { try { seriesTitle = decodeURIComponent(parts[3]); } catch { seriesTitle = parts[3]; } }
    if (parts[4]) seasonNumber = parseInt(parts[4], 10) || 1;
  }

  const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
  const episodeList: EpisodeLink[] = [];
  let page = 1, hasMorePages = true;

  while (hasMorePages && page <= 6) {
    try {
      const res = await axios.get(`${apiBase}/newtv/episodes.php?id=${sid}&page=${page}`, {
        signal, headers: buildNewTvHeaders(ottHeader), timeout: 8000,
      });
      const data = res.data;
      if (Array.isArray(data?.episodes) && data.episodes.length > 0) {
        data.episodes.forEach((episode: any) => {
          const epNum = String(episode?.ep || "").replace(/[^0-9]/g, "").trim() || `${episodeList.length + 1}`;
          const sNum = String(episode?.s || "").replace(/[^0-9]/g, "").trim() || `${seasonNumber}`;
          episodeList.push({
            title: episode?.t ? `Episode ${epNum}: ${episode.t}` : `Episode ${epNum}`,
            link: `${episode?.id}|${prefix}|${encodeURIComponent(seriesTitle)}|${sNum}|${epNum}`,
            description: episode?.ep_desc || undefined,
          });
        });
        if (data?.nextPageShow && data.nextPageShow > 0) page++;
        else hasMorePages = false;
      } else { hasMorePages = false; }
    } catch (err) { console.error(`[NetMirror] ❌ GetEpisodes error [${prefix}]:`, err); break; }
  }

  if (episodeList.length === 0 && sid) {
    episodeList.push({ title: "Episode 1", link: `${sid}|${prefix}|${encodeURIComponent(seriesTitle)}|${seasonNumber}|1` });
  }
  return episodeList;
};

// ==================== STREAM / VIDEO LINKS ====================
export const netMirrorGetStream = async ({
  id: rawId, type, prefix: defaultPrefix, signal, providerContext, isDownload,
}: {
  id: string; type?: string; prefix: NetMirrorOtt; signal?: AbortSignal; providerContext: ProviderContext; isDownload?: boolean;
}): Promise<Stream[]> => {
  const { axios } = providerContext;
  const apiBase = await resolveNewTvApiBase(providerContext);

  let id = rawId, prefix = defaultPrefix;
  if (rawId.includes("|")) {
    const parts = rawId.split("|");
    id = parts[0];
    prefix = (parts[1] as NetMirrorOtt) || defaultPrefix;
  }

  const ottHeader = prefix === "hs" ? "hs" : prefix === "pv" ? "pv" : "nf";
  const serverName = prefix === "hs" ? "Disney+" : prefix === "pv" ? "Prime Video" : "Netflix";
  const streamLinks: Stream[] = [];

  try {
    const res = await axios.get(`${apiBase}/newtv/player.php?id=${id}`, {
      signal, headers: buildNewTvHeaders(ottHeader, { Usertoken: "" }), timeout: 8000,
    });
    const data = res.data;

    if (data && data.status === "ok" && data.video_link) {
      try {
        const m3u8Res = await axios.get(data.video_link, {
          signal, headers: { Referer: data.referer || apiBase }, timeout: 5000,
        });
        const m3u8Text = typeof m3u8Res.data === "string" ? m3u8Res.data : "";

        if (m3u8Text.includes("#EXT-X-STREAM-INF")) {
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
                  server: `${serverName} HLS (${quality}p)`, link: nextLine, type: "m3u8", quality,
                  headers: { Referer: data.referer || apiBase, Origin: apiBase },
                });
              }
            }
          }
        }
        if (streamLinks.length === 0) {
          streamLinks.push({ server: `${serverName} HLS`, link: data.video_link, type: "m3u8", quality: "1080", headers: { Referer: data.referer || apiBase, Origin: apiBase } });
        }
      } catch {
        streamLinks.push({ server: `${serverName} HLS`, link: data.video_link, type: "m3u8", quality: "1080", headers: { Referer: data.referer || apiBase, Origin: apiBase } });
      }
    }
  } catch (err) { console.error(`[NetMirror] ❌ GetStream error [${prefix}]:`, err); }

  streamLinks.sort((a, b) => (parseInt(b.quality || "0", 10) - parseInt(a.quality || "0", 10)));
  return streamLinks;
};