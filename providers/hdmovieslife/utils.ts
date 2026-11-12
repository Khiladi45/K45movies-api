export const cleanText = (value: string | undefined | null) =>
  (value || "").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();

export const getQuality = (text: string) => {
  const m = text.match(/(?:^|[^\d])(2160|1080|720|480|360)p?(?:[^\d]|$)/i);
  if (m) return m[1];
  if (/\b4k\b|\buhd\b/i.test(text)) return "2160";
  return undefined;
};

export const qualityRank = (quality?: string) => {
  const n = Number(quality || 0);
  return Number.isFinite(n) ? n : 0;
};

export const absolutize = (href: string, baseUrl: string) => {
  const value = (href || "").trim();
  if (!value) return "";
  try {
    return new URL(value, `${baseUrl}/`).href;
  } catch {
    return value;
  }
};

export const isHdlinks = (url: string) =>
  /^https:\/\/(?:[\w-]+\.)?(?:hdlinks\.online|fxshare\.org|fxdl\.site|gdfiles-xyz\.workers\.dev)\/file\/[^/?#]+(?:[/?#]|$)/i.test(url);

export const isPackUrl = (url: string) => /\/pack\//i.test(url);

/** "Stranger Things: Season 2 [Hindi + English] 720p …" -> "Season 2". */
export const seasonLabel = (text: string) => {
  const match = (text || "").match(/season\s*(\d+)/i);
  if (match) return `Season ${match[1]}`;
  const tag = (text || "").match(/s(\d{1,2})\s*complete/i);
  if (tag) return `Season ${Number(tag[1])}`;
  return "Download";
};

/** Read the hidden inputs of a download form into a plain object. */
export const formValues = ($: any, el: any) => {
  const values: Record<string, string> = {};
  $(el)
    .find("input[type='hidden'], input[name]")
    .each((_i: number, input: any) => {
      const name = $(input).attr("name");
      if (name) values[name] = $(input).attr("value") || "";
    });
  return values;
};
