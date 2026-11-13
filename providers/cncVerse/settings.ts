import { ProviderContext, SettingsField } from "../types";
import { ALL_STUDIOS, STUDIOS } from "./studio";

export const getSettingsSchema = async function ({
  providerContext,
}: {
  providerContext: ProviderContext;
}): Promise<SettingsField[]> {
  return [
    {
      key: "enabledStudios",
      type: "multiselect",
      label: "Enabled Studios",
      description: "Studios shown in the catalog and included in search",
      options: ALL_STUDIOS.map((key) => ({
        label: STUDIOS[key].label,
        value: key,
      })),
      defaultValue: [...ALL_STUDIOS],
    },
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
      description:
        "Paste a valid t_hash_t cookie to skip ad verification. Sessions are per studio, so an automatic unlock is usually better.",
      placeholder: "t_hash_t value",
      defaultValue: "",
    },
    {
      key: "hotstarCookie",
      type: "text",
      label: "Hotstar ott cookie",
      description: "Session scope used for Hotstar (default: hs)",
      placeholder: "hs",
      defaultValue: "",
    },
    {
      key: "disneyCookie",
      type: "text",
      label: "Disney+ / brand ott cookie",
      description: "Session scope used for Disney+, Pixar, Star Wars and Marvel (default: dp)",
      placeholder: "dp",
      defaultValue: "",
    },
    {
      key: "clearCache",
      type: "toggle",
      label: "Clear cached sessions",
      description: "Turn on to discard cached per-studio tokens, then turn it back off automatically",
      defaultValue: false,
    },
  ];
};
