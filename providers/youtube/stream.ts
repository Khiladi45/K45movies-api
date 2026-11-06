import { Stream, ProviderContext, TextTracks } from "../types";
import { parseHlsVariants } from "./parse";

function extractVideoId(link: string): string {
  const match =
    link.match(/(?:v=|\/watch\?v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/i) ||
    link.match(/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : link;
}

async function getVisitorData(axios: any, kvStore: any): Promise<string> {
  const fallback =
    "CgtSdHczNXdoNzhqQSiYoJ7WBjIKCgJJThIEGgAgZGLfAgrcAjIyLllUPUpQRHNlLWd6ZzYwc3FRN2JRSGNlMzdJWHFlelQxLUZMd00yR3M5X1gxZUd4RWtRdUxyakphLS1iaU1LMk9fcU83MHl4cExXcFRKd3p2ckcxcGMyU0RBS3FmYXVPOGpnd1dpWUtUdU5rQ1pZZzFZeHh3UkFnRXYtNE9YR1gtaWhvd2RvblQ3dENIV0NmdDgtZU9Ibi04M2QtUlBoZlhoZGpyNjE4YlFGY0VWVU5UanJBZ2g0cVFCRXJWbktnQm4tV1Eydm1CNE5qTl9FajBQVV9TaFlsYkxEOGY3WFJaUGVNRnIzTzhoejEyMDJQQlJpRUwyX1gtV2N0WG1YRmFvLVYyZXRpTWJDSUZLaU9jNEZUTU1lSktrWVBKV1A0WlV5eFZYeTNPZUlFMS1XeXpaa1Y3T1dVVDE5SllHcTNSN0NFcE5HNTNFZElmcW9UVDdMYjV2N09mdw==";
  try {
    const cached = await kvStore?.get("youtube_visitor_data");
    if (cached) return cached;

    const res = await axios.get("https://www.youtube.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 3000,
    });
    const match =
      typeof res?.data === "string"
        ? res.data.match(/"visitorData"\s*:\s*"([^"]+)"/)
        : null;
    if (match && match[1]) {
      await kvStore?.set("youtube_visitor_data", match[1]);
      return match[1];
    }
  } catch {
    // Return fallback on network error
  }
  return fallback;
}

function extractCaptions(data: any): TextTracks {
  const subtitles: TextTracks = [];
  const captionTracks =
    data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  if (Array.isArray(captionTracks)) {
    for (const c of captionTracks) {
      if (c.baseUrl) {
        const name =
          c.name?.runs?.[0]?.text || c.name?.simpleText || c.languageCode;
        subtitles.push({
          title: name,
          language: c.languageCode || name,
          type: "text/vtt",
          uri: c.baseUrl.includes("fmt=") ? c.baseUrl : `${c.baseUrl}&fmt=vtt`,
        });
      }
    }
  }
  return subtitles;
}

async function fetchFromInnerTube(
  axios: any,
  kvStore: any,
  videoId: string,
  signal?: AbortSignal,
  fast = false
): Promise<{ streams: Stream[]; subtitles: TextTracks }> {
  const streams: Stream[] = [];
  let subtitles: TextTracks = [];

  const visitorData = await getVisitorData(axios, kvStore);

  try {
    const [visionRes, vrRes] = await Promise.allSettled([
      axios.post(
        "https://www.youtube.com/youtubei/v1/player?prettyPrint=false&alt=json",
        {
          videoId,
          racyCheckOk: true,
          contentCheckOk: true,
          playbackContext: {
            contentPlaybackContext: {
              signatureTimestamp: 20731,
            },
          },
          context: {
            client: {
              hl: "en",
              gl: "US",
              visitorData,
              clientName: "VISIONOS",
              clientVersion: "1.02",
              osName: "visionOS",
              osVersion: "26.5.23O471",
              platform: "MOBILE",
              deviceMake: "Apple",
              deviceModel: "RealityDevice17,1",
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-YouTube-Client-Name": "101",
            "X-YouTube-Client-Version": "1.02",
            "X-Goog-Visitor-Id": visitorData,
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
            Origin: "https://www.youtube.com",
            Referer: `https://www.youtube.com/watch?v=${videoId}`,
          },
          timeout: 5000,
          signal,
        }
      ),
      axios.post(
        "https://www.youtube.com/youtubei/v1/player?prettyPrint=false&alt=json",
        {
          videoId,
          racyCheckOk: true,
          contentCheckOk: true,
          playbackContext: {
            contentPlaybackContext: {
              signatureTimestamp: 20731,
            },
          },
          context: {
            client: {
              clientName: "ANDROID_VR",
              clientVersion: "1.60.19",
              deviceMake: "Oculus",
              deviceModel: "Quest 3",
              platform: "MOBILE",
              hl: "en",
              gl: "US",
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 12; Quest 3) AppleWebKit/537.36",
          },
          timeout: 5000,
          signal,
        }
      ),
    ]);

    const vData = visionRes.status === "fulfilled" ? visionRes.value?.data : null;
    const vrData = vrRes.status === "fulfilled" ? vrRes.value?.data : null;

    // 1. Master HLS (adaptive, with audio). Played as-is by the app, which can
    //    pin a resolution on it; the per-height variants below are for the
    //    quality picker and for downloads.
    const masterUrl = vData?.streamingData?.hlsManifestUrl;
    if (masterUrl) {
      streams.push({
        server: "YouTube HLS (Auto)",
        link: masterUrl,
        type: "m3u8",
        quality: "auto",
        tag: "Audio + Video",
      });

      // `fast` (playback start-up) skips the per-height list: the master plays
      // as-is and the list is only needed for the quality menu and downloads.
      if (!fast) try {
        const playlist = await axios.get(masterUrl, {
          responseType: "text",
          timeout: 5000,
          signal,
        });
        const text = typeof playlist?.data === "string" ? playlist.data : "";
        for (const v of parseHlsVariants(text, masterUrl)) {
          streams.push({
            server: `YouTube HLS ${v.height}p`,
            link: v.url,
            type: "m3u8",
            quality: String(v.height),
            tag: v.separateAudio
              ? "HLS variant \u2022 Video only"
              : "HLS variant \u2022 Audio + Video",
          });
        }
      } catch {
        // The master alone still plays; only the per-height list is lost.
      }
    }

    // 2. Progressive MP4 (Audio + Video muxed)
    const formats = vrData?.streamingData?.formats || [];
    for (const f of formats) {
      if (f.url) {
        const qualityLabel = f.qualityLabel || "360p";
        streams.push({
          server: `YouTube (${qualityLabel} MP4)`,
          link: f.url,
          type: "mp4",
          quality: qualityLabel.replace("p", ""),
          tag: "Audio + Video",
        });
      }
    }

    // 2b. Adaptive MP4: separate video-only and audio-only files (1080p-4K).
    //     They are not playable alone; the app downloads one of each and joins
    //     them (see the app's mp4Mux). ANDROID_VR URLs come first so they win
    //     when both clients return the same itag.
    const vrUa =
      "com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip";
    const adaptive: any[] = [
      ...(vrData?.streamingData?.adaptiveFormats || []),
      ...(vData?.streamingData?.adaptiveFormats || []),
    ];
    const seenItag = new Set<number>();
    for (const f of adaptive) {
      const mime = String(f?.mimeType || "");
      if (!f?.url || !/^(video|audio)\/mp4/.test(mime) || seenItag.has(f.itag)) continue;
      seenItag.add(f.itag);
      const codec = (mime.match(/codecs="([^"]+)"/)?.[1] || "").split(".")[0];
      const size = Number(f.contentLength) || undefined;
      const bitrate = Math.round((Number(f.averageBitrate || f.bitrate) || 0) / 1000);
      if (mime.startsWith("video/") && f.height) {
        streams.push({
          server: `YouTube ${f.height}p ${codec} (video)`,
          link: f.url,
          type: "mp4",
          quality: String(f.height),
          tag: `Video only \u2022 ${codec}`,
          kind: "video",
          size,
          codec,
          bitrate,
          headers: { "User-Agent": vrUa },
        });
      } else if (mime.startsWith("audio/")) {
        streams.push({
          server: `YouTube audio ${bitrate}k (${codec})`,
          link: f.url,
          type: "mp4",
          quality: "audio",
          tag: `Audio only \u2022 ${codec}`,
          kind: "audio",
          size,
          codec,
          bitrate,
          headers: { "User-Agent": vrUa },
        });
      }
    }

    // 3. Subtitles
    subtitles = extractCaptions(vData) || extractCaptions(vrData) || [];
  } catch {
    // Return empty on failure
  }

  return { streams, subtitles };
}

const isMaster = (s: Stream) => s.quality === "auto";
const isVariant = (s: Stream) =>
  s.type === "m3u8" && !isMaster(s) && !!s.tag?.startsWith("HLS variant");
const isVideoOnly = (s: Stream) => !!s.tag?.includes("Video only");
const heightOf = (s: Stream) => parseInt(s.quality || "", 10) || 0;

/** Streaming: master first, then variants tallest first, then muxed MP4s. */
function rankForStreaming(s: Stream): number {
  if (isMaster(s)) return 0;
  if (isVariant(s)) return 1;
  // Single-track files are for downloads; keep them after anything playable.
  return s.kind ? 3 : 2;
}

/** Downloads: muxed MP4 and audio+video variants first, video-only last. */
function rankForDownload(s: Stream): number {
  if (isMaster(s)) return 3;
  if (s.kind) return 2;
  if (isVideoOnly(s)) return 2;
  return s.type === "mp4" ? 0 : 1;
}

function sortStreams(
  streams: Stream[],
  preferredQuality?: string,
  isDownload?: boolean
) {
  const cleanPref =
    preferredQuality && preferredQuality !== "auto"
      ? preferredQuality.replace("p", "")
      : "";

  streams.sort((a, b) => {
    const rank = isDownload ? rankForDownload : rankForStreaming;
    if (rank(a) !== rank(b)) return rank(a) - rank(b);

    // A preferred height wins within the same rank.
    if (cleanPref) {
      const aMatches = a.quality === cleanPref;
      const bMatches = b.quality === cleanPref;
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
    }

    // Tallest first; "auto" (height 0) never outranks a real height.
    return heightOf(b) - heightOf(a);
  });
}

export const getStream = async function ({
  link,
  signal,
  providerContext,
  isDownload,
  fast,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
  isDownload?: boolean;
  fast?: boolean;
}): Promise<Stream[]> {
  const { axios, kvStore } = providerContext;

  const videoId = extractVideoId(link);
  if (!videoId) return [];

  const preferredQuality = await kvStore?.get<string>("preferredQuality");
  const { streams, subtitles } = await fetchFromInnerTube(
    axios,
    kvStore,
    videoId,
    signal,
    !!fast && !isDownload
  );

  if (streams.length === 0) {
    return [];
  }

  // Deduplicate streams
  const seenUrls = new Set<string>();
  const uniqueStreams: Stream[] = [];
  for (const s of streams) {
    if (!seenUrls.has(s.link)) {
      seenUrls.add(s.link);
      uniqueStreams.push(s);
    }
  }

  // Attach subtitles
  if (subtitles.length > 0) {
    for (const s of uniqueStreams) {
      if (!s.subtitles) {
        s.subtitles = subtitles;
      }
    }
  }

  sortStreams(uniqueStreams, preferredQuality, isDownload);
  return uniqueStreams;
};
