import { ProviderContext } from "../types";
import { NetMirrorOtt, StudioOptions } from "../netMirrorCommon";

export type StudioKey =
  | "netflix"
  | "prime"
  | "hotstar"
  | "disney"
  | "pixar"
  | "starwars"
  | "marvel";

export interface StudioDef {
  key: StudioKey;
  label: string;
  /** Path prefix used by /mobile/{pv|hs}/ endpoints. */
  prefix: NetMirrorOtt;
  /** Session scope cookie (nf/pv/hs/dp). */
  ott: string;
  /** Server-side studio cookie (brand studios only). */
  studio?: "disney" | "marvel" | "starwars" | "pixar";
  /** Short label used as stream tag. */
  cornerTag: string;
}

export const STUDIOS: Record<StudioKey, StudioDef> = {
  netflix: { key: "netflix", label: "Netflix", prefix: "", ott: "nf", cornerTag: "NF" },
  prime: { key: "prime", label: "Prime Video", prefix: "pv", ott: "pv", cornerTag: "PV" },
  hotstar: { key: "hotstar", label: "Hotstar", prefix: "hs", ott: "hs", cornerTag: "HS" },
  disney: { key: "disney", label: "Disney+", prefix: "hs", ott: "dp", studio: "disney", cornerTag: "D+" },
  pixar: { key: "pixar", label: "Pixar", prefix: "hs", ott: "dp", studio: "pixar", cornerTag: "PX" },
  starwars: { key: "starwars", label: "Star Wars", prefix: "hs", ott: "dp", studio: "starwars", cornerTag: "SW" },
  marvel: { key: "marvel", label: "Marvel", prefix: "hs", ott: "dp", studio: "marvel", cornerTag: "MV" },
};

export const ALL_STUDIOS = Object.keys(STUDIOS) as StudioKey[];

export const isStudioKey = (value: string): value is StudioKey =>
  Object.prototype.hasOwnProperty.call(STUDIOS, value);

export const getStudio = (key: string | undefined): StudioDef =>
  key && isStudioKey(key) ? STUDIOS[key] : STUDIOS.netflix;

export const getEnabledStudios = async (
  providerContext?: ProviderContext
): Promise<StudioKey[]> => {
  if (!providerContext?.kvStore) return ALL_STUDIOS;
  const { kvStore } = providerContext;
  try {
    if (await kvStore.get<boolean>("clearCache")) {
      for (const key of await kvStore.keys()) {
        if (key.startsWith("t_hash_t_")) await kvStore.delete(key);
      }
      await kvStore.set("clearCache", false);
    }
    const stored = await kvStore.get<string[]>("enabledStudios");
    const keys = Array.isArray(stored)
      ? ALL_STUDIOS.filter((k) => stored.includes(k))
      : ALL_STUDIOS;
    return keys.length > 0 ? keys : ALL_STUDIOS;
  } catch {
    return ALL_STUDIOS;
  }
};

/** Per-studio session options; hotstarCookie/disneyCookie are user overrides. */
export const getStudioOptions = async (
  providerContext: ProviderContext,
  studio: StudioDef
): Promise<StudioOptions> => {
  let ottCookie = studio.ott;
  try {
    if (studio.key === "hotstar") {
      const override = await providerContext.kvStore.get<string>("hotstarCookie");
      if (override && override.trim()) ottCookie = override.trim();
    } else if (studio.ott === "dp") {
      const override = await providerContext.kvStore.get<string>("disneyCookie");
      if (override && override.trim()) ottCookie = override.trim();
    }
  } catch {}
  return { ottCookie, studioCookie: studio.studio };
};

/** Finds the studio key and its index inside a link produced by this provider. */
export const parseStudioLink = (
  link: string
): { studio: StudioDef; tagIndex: number; parts: string[] } => {
  const parts = (link || "").split("|");
  for (const index of [1, 2]) {
    if (parts[index] && isStudioKey(parts[index])) {
      return { studio: STUDIOS[parts[index] as StudioKey], tagIndex: index, parts };
    }
  }
  return { studio: STUDIOS.netflix, tagIndex: 1, parts };
};

/** App link (studio key in the tag slot) -> engine link (pv/hs/"" prefix). */
export const toCoreLink = (link: string): { link: string; studio: StudioDef } => {
  const { studio, tagIndex, parts } = parseStudioLink(link);
  const copy = parts.slice();
  copy[tagIndex] = studio.prefix;
  return { link: copy.join("|"), studio };
};

/** Engine link -> app link with the studio key in the tag slot. */
export const toAppLink = (
  link: string,
  studio: StudioDef,
  tagIndex: number
): string => {
  const parts = link.split("|");
  parts[tagIndex] = studio.key;
  return parts.join("|");
};
