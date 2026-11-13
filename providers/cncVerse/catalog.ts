import { CatalogList, ProviderContext } from "../types";
import { getEnabledStudios, getStudio } from "./studio";

export const catalog: CatalogList = async ({
  providerContext,
}: { signal?: AbortSignal; providerContext?: ProviderContext } = {}) => {
  const enabled = await getEnabledStudios(providerContext);
  return enabled.map((key) => {
    const studio = getStudio(key);
    return { title: studio.label, filter: studio.key };
  });
};

export const genres = [];
