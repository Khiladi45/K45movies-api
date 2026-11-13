import {
  Catalog,
  CatalogList,
  EpisodeLink,
  Info,
  Post,
  ProviderContext,
  SettingsField,
  Stream,
} from "./types";
import {
  NetMirrorOtt,
  StudioOptions,
  getCachedHomeTrays,
  netMirrorGetEpisodes,
  netMirrorGetMeta,
  netMirrorGetPosts,
  netMirrorGetStream,
  netMirrorSearch,
} from "./netMirrorCommon";

/**
 * Per-studio providers over the NetMirror/CNC backend. Each studio is exposed
 * as its own provider so the app shows separate catalogs and content.
 *
 * The backend scopes a playlist session by the `ott` cookie used during the ad
 * unlock (nf/pv/hs/dp). Brand studios (Disney, Pixar, Star Wars, Marvel) all
 * ride the Hotstar path with ott=dp plus a server-side `studio` cookie.
 */
export type StudioKey =
  | "netflix"
  | "primeVideo"
  | "hotstar"
  | "disneyPlus"
  | "pixar"
  | "starWars"
  | "marvel";

interface StudioDef {
  key: StudioKey;
  label: string;
  prefix: NetMirrorOtt;
  ott: string;
  studioCookie?: "disney" | "marvel" | "starwars" | "pixar";
  cornerTag: string;
}

const STUDIOS: Record<StudioKey, StudioDef> = {
  netflix: { key: "netflix", label: "Netflix", prefix: "", ott: "nf", cornerTag: "NF" },
  primeVideo: { key: "primeVideo", label: "Prime Video", prefix: "pv", ott: "pv", cornerTag: "PV" },
  hotstar: { key: "hotstar", label: "Hotstar", prefix: "hs", ott: "hs", cornerTag: "HS" },
  disneyPlus: { key: "disneyPlus", label: "Disney+", prefix: "hs", ott: "dp", studioCookie: "disney", cornerTag: "D+" },
  pixar: { key: "pixar", label: "Pixar", prefix: "hs", ott: "dp", studioCookie: "pixar", cornerTag: "PX" },
  starWars: { key: "starWars", label: "Star Wars", prefix: "hs", ott: "dp", studioCookie: "starwars", cornerTag: "SW" },
  marvel: { key: "marvel", label: "Marvel", prefix: "hs", ott: "dp", studioCookie: "marvel", cornerTag: "MV" },
};

const studioOf = (key: StudioKey): StudioDef => STUDIOS[key];

const studioOptions = (studio: StudioDef): StudioOptions => ({
  ottCookie: studio.ott,
  studioCookie: studio.studioCookie,
});

/** The clearCache toggle is global; whichever provider sees it first clears all sessions. */
const clearSessionsIfRequested = async (providerContext: ProviderContext) => {
  try {
    const { kvStore } = providerContext;
    if (!(await kvStore.get<boolean>("clearCache"))) return;
    for (const key of await kvStore.keys()) {
      if (key.startsWith("t_hash_t_")) await kvStore.delete(key);
    }
    await kvStore.set("clearCache", false);
  } catch {}
};

/**
 * Catalog = the studio's current home trays. Filter is the tray title, which
 * netMirrorGetPosts matches against the same home page, so every row on a
 * provider's home screen is genuinely that studio's content.
 */
export const makeCatalog =
  (key: StudioKey): CatalogList =>
  async ({
    providerContext,
    signal,
  }: { signal?: AbortSignal; providerContext?: ProviderContext } = {}): Promise<Catalog[]> => {
    if (!providerContext) return [];
    await clearSessionsIfRequested(providerContext);
    const studio = studioOf(key);
    const trays = await getCachedHomeTrays(
      providerContext,
      studio.prefix,
      studioOptions(studio),
      signal
    );
    const seen = new Set<string>();
    const catalog: Catalog[] = [];
    for (const tray of trays) {
      const title = tray.title.trim();
      const dedupeKey = title.toLowerCase();
      if (!title || seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      catalog.push({ title, filter: title });
    }
    return catalog;
  };

export const makeGetPosts = (key: StudioKey) =>
  async function ({
    filter,
    page,
    signal,
    providerContext,
  }: {
    filter: string;
    page: number;
    providerValue: string;
    signal: AbortSignal;
    providerContext: ProviderContext;
  }): Promise<Post[]> {
    const studio = studioOf(key);
    return netMirrorGetPosts({
      filter: (filter || "").trim(),
      page,
      prefix: studio.prefix,
      signal,
      providerContext,
      studio: studioOptions(studio),
    });
  };

export const makeGetSearchPosts = (key: StudioKey) =>
  async function ({
    searchQuery,
    page,
    signal,
    providerContext,
  }: {
    searchQuery: string;
    page: number;
    providerValue: string;
    signal: AbortSignal;
    providerContext: ProviderContext;
  }): Promise<Post[]> {
    const studio = studioOf(key);
    return netMirrorSearch({
      searchQuery,
      page,
      prefix: studio.prefix,
      signal,
      providerContext,
      studio: studioOptions(studio),
    });
  };

export const makeGetMeta = (key: StudioKey) =>
  async function ({
    link,
    providerContext,
  }: {
    link: string;
    provider: string;
    providerContext: ProviderContext;
  }): Promise<Info> {
    const studio = studioOf(key);
    return netMirrorGetMeta({
      link,
      prefix: studio.prefix,
      providerContext,
      studio: studioOptions(studio),
    });
  };

export const makeGetEpisodes = (key: StudioKey) =>
  async function ({
    url,
    providerContext,
  }: {
    url: string;
    providerContext: ProviderContext;
  }): Promise<EpisodeLink[]> {
    const studio = studioOf(key);
    return netMirrorGetEpisodes({
      seasonId: url,
      prefix: studio.prefix,
      providerContext,
      studio: studioOptions(studio),
    });
  };

export const makeGetStream = (key: StudioKey) =>
  async ({
    link,
    type,
    signal,
    providerContext,
    isDownload,
  }: {
    link: string;
    type?: string;
    signal?: AbortSignal;
    providerContext: ProviderContext;
    isDownload?: boolean;
  }): Promise<Stream[]> => {
    const studio = studioOf(key);
    await clearSessionsIfRequested(providerContext);
    const streams = await netMirrorGetStream({
      id: link,
      type,
      prefix: studio.prefix,
      signal,
      providerContext,
      isDownload,
      studio: studioOptions(studio),
    });
    return streams.map((stream) => ({
      ...stream,
      server: stream.server.replace(/^(Netflix|Prime Video|Disney\+\/Hotstar)\s*/, `${studio.label} `),
      tag: studio.cornerTag,
    }));
  };

export const makeSettingsSchema = (key: StudioKey) =>
  async function ({
    providerContext,
  }: {
    providerContext: ProviderContext;
  }): Promise<SettingsField[]> {
    void providerContext;
    const studio = studioOf(key);
    return [
      {
        key: "baseUrlOverride",
        type: "text",
        label: "Custom Domain / Mirror URL",
        description: "Leave empty to use https://net52.cc with automatic failover",
        placeholder: "https://net52.cc",
        defaultValue: "",
      },
      {
        key: "t_hash_t",
        type: "text",
        label: "Session Token (advanced)",
        description: `Paste a valid ${studio.label} t_hash_t cookie to skip ad verification. A fresh automatic unlock is usually better.`,
        placeholder: "t_hash_t value",
        defaultValue: "",
      },
      {
        key: "clearCache",
        type: "toggle",
        label: "Clear cached sessions",
        description: "Turn on to discard cached studio tokens, then it turns itself back off",
        defaultValue: false,
      },
    ];
  };
