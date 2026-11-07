var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// providers/youtube/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  catalog: () => catalog,
  genres: () => genres
});
var catalog, genres;
var init_catalog = __esm({
  "providers/youtube/catalog.ts"() {
    "use strict";
    catalog = [
      { title: "Trending", filter: "trending" },
      { title: "Music", filter: "trending music" },
      { title: "Live", filter: "live now" },
      { title: "Gaming", filter: "trending gaming" },
      // "#shorts" switches posts.ts into Shorts mode (portrait 9:16 results only).
      { title: "Shorts", filter: "#shorts trending" },
      { title: "Movies & Trailers", filter: "official movie trailers" },
      { title: "News", filter: "world news" },
      { title: "Documentaries", filter: "documentary full" },
      { title: "Tech & Science", filter: "technology science" }
    ];
    genres = [
      { title: "Podcasts", filter: "popular podcasts" },
      { title: "Animation", filter: "animation short film" },
      { title: "Comedy", filter: "comedy standup" },
      { title: "Education", filter: "educational documentary" },
      { title: "Sports", filter: "sports highlights" },
      { title: "Nature", filter: "4k nature wildlife" }
    ];
  }
});

// providers/youtube/parse.ts
function extractVideoId(link) {
  const match = link.match(
    /(?:v=|\/watch\?v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/i
  ) || link.match(/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : link;
}
function parseInitialData(html) {
  if (typeof html !== "string") return null;
  const match = html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/) || html.match(/ytInitialData\s*=\s*({.+?});/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch (e) {
    return null;
  }
}
function textOf(node) {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node.simpleText === "string") return node.simpleText;
  if (typeof node.content === "string") return node.content;
  if (Array.isArray(node.runs)) {
    return node.runs.map((r) => r && r.text || "").join("");
  }
  return "";
}
function pickImage(node) {
  const list = Array.isArray(node) ? node : Array.isArray(node == null ? void 0 : node.thumbnails) ? node.thumbnails : Array.isArray(node == null ? void 0 : node.sources) ? node.sources : [];
  let best = "";
  let bestWidth = -1;
  for (const item of list) {
    const width = Number(item == null ? void 0 : item.width) || 0;
    if ((item == null ? void 0 : item.url) && width >= bestWidth) {
      best = item.url;
      bestWidth = width;
    }
  }
  return best.startsWith("//") ? `https:${best}` : best;
}
function findFirst(obj, key) {
  if (!obj || typeof obj !== "object") return void 0;
  if (obj[key] !== void 0) return obj[key];
  for (const k of Object.keys(obj)) {
    const found = findFirst(obj[k], key);
    if (found !== void 0) return found;
  }
  return void 0;
}
function formatViews(rawCount) {
  const num = typeof rawCount === "number" ? rawCount : parseInt(rawCount, 10);
  if (isNaN(num) || num <= 0) return "";
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B views";
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M views";
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K views";
  }
  return num === 1 ? "1 view" : `${num} views`;
}
function normalizeViews(raw) {
  const text = (raw || "").trim();
  if (!text) return "";
  const exact = text.match(/^([\d,\s]+)\s*views?$/i);
  if (exact) {
    const n = parseInt(exact[1].replace(/[^\d]/g, ""), 10);
    if (!isNaN(n)) return formatViews(n) || "0 views";
  }
  return text;
}
function formatDuration(totalSeconds) {
  const sec = typeof totalSeconds === "number" ? totalSeconds : parseInt(totalSeconds, 10);
  if (isNaN(sec) || sec <= 0) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const h = Math.floor(m / 60);
  const remM = m % 60;
  if (h > 0) {
    return `${h}:${remM.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function relativeTime(iso, now = Date.now()) {
  const then = Date.parse(iso);
  if (isNaN(then)) return "";
  const seconds = Math.max(0, Math.floor((now - then) / 1e3));
  const units = [
    ["year", 31536e3],
    ["month", 2592e3],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60]
  ];
  for (const [name, size] of units) {
    const count = Math.floor(seconds / size);
    if (count >= 1) return `${count} ${name}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}
function buildPost(p) {
  var _a, _b;
  const isShort = !!p.isShort;
  const channelName = ((_a = p.channelName) == null ? void 0 : _a.trim()) || void 0;
  const views = normalizeViews(p.views || "") || void 0;
  const duration = p.duration && DURATION.test(p.duration) ? p.duration : "";
  return {
    title: p.title.trim(),
    link: isShort ? shortsUrl(p.id) : watchUrl(p.id),
    // Regular videos always use the 16:9 poster; Shorts use the portrait image
    // YouTube supplied (falling back to the 16:9 one, which `cover` can crop).
    image: isShort ? p.image || landscapeThumb(p.id) : landscapeThumb(p.id),
    aspectRatio: isShort ? 9 / 16 : 16 / 9,
    borderRadius: 8,
    // Legacy combined fields, kept so existing layouts render as before.
    tag: channelName ? `${channelName}${views ? ` \u2022 ${views}` : ""}` : views || void 0,
    cornerTag: duration || void 0,
    // Structured fields for the YouTube layout.
    videoId: p.id,
    channelName,
    channelAvatar: p.channelAvatar || void 0,
    views,
    publishedTime: ((_b = p.publishedTime) == null ? void 0 : _b.trim()) || void 0,
    duration: duration || void 0,
    isShort,
    isLive: !!p.isLive
  };
}
function fromVideoRenderer(vr) {
  var _a, _b, _c;
  const id = vr == null ? void 0 : vr.videoId;
  if (!id || typeof id !== "string") return null;
  const overlays = Array.isArray(vr.thumbnailOverlays) ? vr.thumbnailOverlays : [];
  const timeOverlay = overlays.map((o) => o == null ? void 0 : o.thumbnailOverlayTimeStatusRenderer).find(Boolean);
  const overlayStyle = String((timeOverlay == null ? void 0 : timeOverlay.style) || "");
  const badges = Array.isArray(vr.badges) ? vr.badges : [];
  const isLive = overlayStyle === "LIVE" || badges.some(
    (b) => {
      var _a2;
      return String(((_a2 = b == null ? void 0 : b.metadataBadgeRenderer) == null ? void 0 : _a2.style) || "").includes("LIVE");
    }
  );
  const isShort = overlayStyle === "SHORTS" || !!((_a = vr.navigationEndpoint) == null ? void 0 : _a.reelWatchEndpoint);
  return buildPost({
    id,
    title: textOf(vr.title),
    channelName: textOf(vr.ownerText) || textOf(vr.shortBylineText) || textOf(vr.longBylineText),
    channelAvatar: pickImage(
      (_c = (_b = vr.channelThumbnailSupportedRenderers) == null ? void 0 : _b.channelThumbnailWithLinkRenderer) == null ? void 0 : _c.thumbnail
    ) || pickImage(vr.channelThumbnail),
    views: textOf(vr.shortViewCountText) || textOf(vr.viewCountText),
    publishedTime: textOf(vr.publishedTimeText),
    duration: isLive ? "" : textOf(vr.lengthText) || textOf(timeOverlay == null ? void 0 : timeOverlay.text),
    image: pickImage(vr.thumbnail),
    isShort,
    isLive
  });
}
function fromReelItem(rr) {
  var _a;
  const id = rr == null ? void 0 : rr.videoId;
  if (!id || typeof id !== "string") return null;
  return buildPost({
    id,
    title: textOf(rr.headline) || textOf((_a = rr.accessibility) == null ? void 0 : _a.accessibilityData),
    views: textOf(rr.viewCountText),
    image: pickImage(rr.thumbnail),
    isShort: true
  });
}
function fromShortsLockup(sl) {
  var _a, _b, _c, _d, _e, _f;
  const id = ((_c = (_b = (_a = sl == null ? void 0 : sl.onTap) == null ? void 0 : _a.innertubeCommand) == null ? void 0 : _b.reelWatchEndpoint) == null ? void 0 : _c.videoId) || (typeof (sl == null ? void 0 : sl.entityId) === "string" ? sl.entityId.replace(/^shorts-shelf-item-/, "") : "");
  if (!id || typeof id !== "string") return null;
  return buildPost({
    id,
    title: textOf((_d = sl.overlayMetadata) == null ? void 0 : _d.primaryText),
    views: textOf((_e = sl.overlayMetadata) == null ? void 0 : _e.secondaryText),
    image: pickImage(sl.thumbnail) || pickImage((_f = sl.thumbnailViewModel) == null ? void 0 : _f.image),
    isShort: true
  });
}
function collectBadgeTexts(node, out) {
  if (!node || typeof node !== "object") return;
  const badge = node.thumbnailBadgeViewModel;
  if (badge && typeof badge.text === "string") out.push(badge.text);
  for (const key of Object.keys(node)) collectBadgeTexts(node[key], out);
}
function fromLockup(lv) {
  var _a, _b, _c, _d, _e, _f, _g;
  if ((lv == null ? void 0 : lv.contentType) !== "LOCKUP_CONTENT_TYPE_VIDEO") return null;
  const id = lv.contentId;
  if (!id || typeof id !== "string") return null;
  const meta = (_a = lv.metadata) == null ? void 0 : _a.lockupMetadataViewModel;
  const rows = Array.isArray(
    (_c = (_b = meta == null ? void 0 : meta.metadata) == null ? void 0 : _b.contentMetadataViewModel) == null ? void 0 : _c.metadataRows
  ) ? meta.metadata.contentMetadataViewModel.metadataRows : [];
  let channelName = "";
  let views = "";
  let publishedTime = "";
  for (const row of rows) {
    const parts = Array.isArray(row == null ? void 0 : row.metadataParts) ? row.metadataParts : [];
    for (const part of parts) {
      const text = textOf(part == null ? void 0 : part.text).trim();
      if (!text) continue;
      if (/\b(views?|watching)\b/i.test(text)) views = views || text;
      else if (/\bago$/i.test(text)) publishedTime = publishedTime || text;
      else channelName = channelName || text;
    }
  }
  const badgeTexts = [];
  collectBadgeTexts(lv.contentImage, badgeTexts);
  const isLive = badgeTexts.some((t) => /^live$/i.test(t.trim()));
  const duration = badgeTexts.map((t) => t.trim()).find((t) => DURATION.test(t));
  return buildPost({
    id,
    title: textOf(meta == null ? void 0 : meta.title),
    channelName,
    channelAvatar: pickImage(
      (_g = (_f = (_e = (_d = meta == null ? void 0 : meta.image) == null ? void 0 : _d.decoratedAvatarViewModel) == null ? void 0 : _e.avatar) == null ? void 0 : _f.avatarViewModel) == null ? void 0 : _g.image
    ),
    views,
    publishedTime,
    duration: duration || "",
    isLive
  });
}
function collectVideos(data, mode) {
  const posts = [];
  const seen = /* @__PURE__ */ new Set();
  const add = (post, fromShelf) => {
    if (!post || !post.videoId || seen.has(post.videoId)) return;
    if (mode === "videos" && fromShelf) return;
    if (mode === "shorts" && !post.isShort) return;
    seen.add(post.videoId);
    posts.push(post);
  };
  const walk = (obj) => {
    if (!obj || typeof obj !== "object") return;
    if (obj.videoRenderer) add(fromVideoRenderer(obj.videoRenderer), false);
    if (obj.compactVideoRenderer) {
      add(fromVideoRenderer(obj.compactVideoRenderer), false);
    }
    if (obj.lockupViewModel) add(fromLockup(obj.lockupViewModel), false);
    if (obj.reelItemRenderer) add(fromReelItem(obj.reelItemRenderer), true);
    if (obj.shortsLockupViewModel) {
      add(fromShortsLockup(obj.shortsLockupViewModel), true);
    }
    for (const key of Object.keys(obj)) walk(obj[key]);
  };
  walk(data);
  return posts;
}
function extractInnertubeConfig(html) {
  var _a, _b;
  const text = typeof html === "string" ? html : "";
  return {
    apiKey: (_a = text.match(/"INNERTUBE_API_KEY"\s*:\s*"([^"]+)"/)) == null ? void 0 : _a[1],
    clientVersion: ((_b = text.match(/"INNERTUBE_CLIENT_VERSION"\s*:\s*"([^"]+)"/)) == null ? void 0 : _b[1]) || FALLBACK_CLIENT_VERSION
  };
}
function tokenOf(renderer) {
  var _a, _b, _c, _d, _e, _f;
  const token = ((_b = (_a = renderer == null ? void 0 : renderer.continuationEndpoint) == null ? void 0 : _a.continuationCommand) == null ? void 0 : _b.token) || ((_f = (_e = (_d = (_c = renderer == null ? void 0 : renderer.button) == null ? void 0 : _c.buttonRenderer) == null ? void 0 : _d.command) == null ? void 0 : _e.continuationCommand) == null ? void 0 : _f.token);
  return typeof token === "string" && token ? token : void 0;
}
function extractContinuationToken(data) {
  let last;
  const walk = (obj) => {
    if (!obj || typeof obj !== "object") return;
    if (obj.continuationItemRenderer) {
      const token = tokenOf(obj.continuationItemRenderer);
      if (token) last = token;
    }
    for (const key of Object.keys(obj)) walk(obj[key]);
  };
  walk(data);
  return last;
}
function parseContinuationResponse(data, mode) {
  return {
    posts: collectVideos(data, mode),
    continuation: extractContinuationToken(data)
  };
}
function parseSuggestions(raw, max = 10) {
  let data = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }
  const list = Array.isArray(data) && Array.isArray(data[1]) ? data[1] : [];
  const out = [];
  for (const item of list) {
    const text = Array.isArray(item) ? item[0] : item;
    if (typeof text !== "string") continue;
    const clean = text.trim();
    if (clean && !out.includes(clean)) out.push(clean);
    if (out.length >= max) break;
  }
  return out;
}
function extractCommentsToken(data) {
  let found;
  const fromSection = (section) => {
    const contents = Array.isArray(section == null ? void 0 : section.contents) ? section.contents : [];
    for (const item of contents) {
      const token = tokenOf(item == null ? void 0 : item.continuationItemRenderer);
      if (token) return token;
    }
    return void 0;
  };
  const walk = (obj) => {
    if (found || !obj || typeof obj !== "object") return;
    const section = obj.itemSectionRenderer;
    if ((section == null ? void 0 : section.sectionIdentifier) === "comment-item-section") {
      found = fromSection(section);
      if (found) return;
    }
    for (const key of Object.keys(obj)) walk(obj[key]);
  };
  walk(data);
  if (found) return found;
  const panels = Array.isArray(data == null ? void 0 : data.engagementPanels) ? data.engagementPanels : [];
  for (const panel of panels) {
    const body = panel == null ? void 0 : panel.engagementPanelSectionListRenderer;
    if ((body == null ? void 0 : body.panelIdentifier) === "engagement-panel-comments-section") {
      const token = extractContinuationToken(body);
      if (token) return token;
    }
  }
  return void 0;
}
function commentFromEntity(payload, fallbackId) {
  var _a, _b;
  const props = payload == null ? void 0 : payload.properties;
  const text = textOf(props == null ? void 0 : props.content);
  if (!text) return null;
  const toolbar = payload == null ? void 0 : payload.toolbar;
  return {
    id: String((props == null ? void 0 : props.commentId) || fallbackId),
    author: String(((_a = payload == null ? void 0 : payload.author) == null ? void 0 : _a.displayName) || "").trim(),
    authorAvatar: ((_b = payload == null ? void 0 : payload.author) == null ? void 0 : _b.avatarThumbnailUrl) || void 0,
    text,
    publishedTime: String((props == null ? void 0 : props.publishedTime) || "").trim(),
    likes: String((toolbar == null ? void 0 : toolbar.likeCountNotliked) || (toolbar == null ? void 0 : toolbar.likeCountLiked) || "").trim(),
    replyCount: String((toolbar == null ? void 0 : toolbar.replyCount) || "").trim()
  };
}
function commentFromRenderer(cr) {
  const text = textOf(cr == null ? void 0 : cr.contentText);
  if (!text) return null;
  const replies = cr == null ? void 0 : cr.replyCount;
  return {
    id: String((cr == null ? void 0 : cr.commentId) || ""),
    author: textOf(cr == null ? void 0 : cr.authorText).trim(),
    authorAvatar: pickImage(cr == null ? void 0 : cr.authorThumbnail) || void 0,
    text,
    publishedTime: textOf(cr == null ? void 0 : cr.publishedTimeText).trim(),
    likes: String(textOf(cr == null ? void 0 : cr.voteCount) || (cr == null ? void 0 : cr.likeCount) || "").trim(),
    replyCount: replies ? String(replies) : ""
  };
}
function parseComments(data) {
  var _a, _b, _c, _d;
  const entities = /* @__PURE__ */ new Map();
  const mutations = Array.isArray(
    (_b = (_a = data == null ? void 0 : data.frameworkUpdates) == null ? void 0 : _a.entityBatchUpdate) == null ? void 0 : _b.mutations
  ) ? data.frameworkUpdates.entityBatchUpdate.mutations : [];
  for (const mutation of mutations) {
    const payload = (_c = mutation == null ? void 0 : mutation.payload) == null ? void 0 : _c.commentEntityPayload;
    const id = (_d = payload == null ? void 0 : payload.properties) == null ? void 0 : _d.commentId;
    if (payload && id) entities.set(String(id), payload);
  }
  const comments = [];
  const seen = /* @__PURE__ */ new Set();
  let continuation;
  const walk = (obj) => {
    var _a2, _b2, _c2, _d2, _e;
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      const hasThread = obj.some(
        (item) => (item == null ? void 0 : item.commentThreadRenderer) || (item == null ? void 0 : item.commentViewModel)
      );
      if (hasThread) {
        const tail = (_a2 = obj[obj.length - 1]) == null ? void 0 : _a2.continuationItemRenderer;
        const token = tokenOf(tail);
        if (token) continuation = token;
      }
    }
    const thread = obj.commentThreadRenderer;
    if (thread) {
      const vm = (_b2 = thread.commentViewModel) == null ? void 0 : _b2.commentViewModel;
      let comment = null;
      if (vm) {
        const id = String(vm.commentId || "");
        comment = commentFromEntity(entities.get(id), id);
      } else if ((_c2 = thread.comment) == null ? void 0 : _c2.commentRenderer) {
        comment = commentFromRenderer(thread.comment.commentRenderer);
      }
      if (comment && !seen.has(comment.id || comment.text)) {
        seen.add(comment.id || comment.text);
        const replyItems = Array.isArray(
          (_e = (_d2 = thread.replies) == null ? void 0 : _d2.commentRepliesRenderer) == null ? void 0 : _e.contents
        ) ? thread.replies.commentRepliesRenderer.contents : [];
        for (const item of replyItems) {
          const replyToken = tokenOf(item == null ? void 0 : item.continuationItemRenderer);
          if (replyToken) {
            comment.replyToken = replyToken;
            break;
          }
        }
        comments.push(comment);
      }
      return;
    }
    const bare = obj.commentViewModel;
    if (bare && typeof bare === "object") {
      const vm = bare.commentViewModel || bare;
      const id = String((vm == null ? void 0 : vm.commentId) || "");
      const comment = id ? commentFromEntity(entities.get(id), id) : null;
      if (comment && !seen.has(comment.id)) {
        seen.add(comment.id);
        comments.push(comment);
      }
      return;
    }
    for (const key of Object.keys(obj)) walk(obj[key]);
  };
  walk(data);
  let count = "";
  const header = findFirst(data, "commentsHeaderRenderer");
  if (header) {
    count = textOf(header.countText).replace(/\s*comments?\s*$/i, "").trim();
  }
  if (!count) {
    const entry = findFirst(data, "commentsEntryPointHeaderRenderer");
    count = textOf(entry == null ? void 0 : entry.commentCount).trim();
  }
  return { comments, count, continuation };
}
function resolveUrl(base, relative) {
  if (/^https?:\/\//i.test(relative)) return relative;
  try {
    return new URL(relative, base).toString();
  } catch (e) {
    return relative;
  }
}
function attr(line, name) {
  const quoted = line.match(new RegExp(`(?:^|[,:])${name}="([^"]*)"`));
  if (quoted) return quoted[1];
  const plain = line.match(new RegExp(`(?:^|[,:])${name}=([^,"]+)`));
  return plain ? plain[1] : "";
}
function parseHlsVariants(text, baseUrl) {
  const lines = (text || "").split(/\r?\n/).map((l) => l.trim());
  const audioGroupsWithUri = /* @__PURE__ */ new Set();
  for (const line of lines) {
    if (!line.startsWith("#EXT-X-MEDIA")) continue;
    if (attr(line, "TYPE") === "AUDIO" && attr(line, "URI")) {
      audioGroupsWithUri.add(attr(line, "GROUP-ID"));
    }
  }
  const byHeight = /* @__PURE__ */ new Map();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("#EXT-X-STREAM-INF")) continue;
    const res = attr(line, "RESOLUTION").match(/^(\d+)x(\d+)$/);
    if (!res) continue;
    const height = Math.min(Number(res[1]), Number(res[2]));
    if (!height) continue;
    let uri = "";
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j] && !lines[j].startsWith("#")) {
        uri = lines[j];
        break;
      }
    }
    if (!uri) continue;
    const bandwidth = parseInt(attr(line, "BANDWIDTH") || "0", 10) || 0;
    const audioGroup = attr(line, "AUDIO");
    const variant = {
      height,
      bandwidth,
      url: resolveUrl(baseUrl, uri),
      separateAudio: !!audioGroup && audioGroupsWithUri.has(audioGroup)
    };
    const existing = byHeight.get(height);
    if (!existing || bandwidth > existing.bandwidth) byHeight.set(height, variant);
  }
  return [...byHeight.values()].sort((a, b) => b.height - a.height);
}
var YT_HEADERS, SHORTS_QUERY, isShortsQuery, DURATION, watchUrl, shortsUrl, landscapeThumb, FALLBACK_CLIENT_VERSION;
var init_parse = __esm({
  "providers/youtube/parse.ts"() {
    "use strict";
    YT_HEADERS = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9"
    };
    SHORTS_QUERY = /(^|\s)#shorts\b/i;
    isShortsQuery = (query) => SHORTS_QUERY.test(query || "");
    DURATION = /^\d{1,2}(:\d{2}){1,2}$/;
    watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
    shortsUrl = (id) => `https://www.youtube.com/shorts/${id}`;
    landscapeThumb = (id) => `https://i.ytimg.com/vi/${id}/hq720.jpg`;
    FALLBACK_CLIENT_VERSION = "2.20260101.00.00";
  }
});

// providers/youtube/posts.ts
var posts_exports = {};
__export(posts_exports, {
  getPosts: () => getPosts,
  getSearchPosts: () => getSearchPosts,
  getSuggestions: () => getSuggestions
});
function readToken(ctx, query, page) {
  return __async(this, null, function* () {
    var _a;
    const key = tokenKey(query, page);
    const now = Date.now();
    const inMemory = memoryTokens.get(key);
    if (inMemory && now - inMemory.at < TOKEN_TTL_MS) return inMemory.token;
    try {
      const stored = yield (_a = ctx.kvStore) == null ? void 0 : _a.get(key);
      if (stored && typeof stored.token === "string" && now - stored.at < TOKEN_TTL_MS) {
        memoryTokens.set(key, stored);
        return stored.token;
      }
    } catch (e) {
    }
    return void 0;
  });
}
function writeToken(ctx, query, page, token) {
  return __async(this, null, function* () {
    var _a;
    const key = tokenKey(query, page);
    const entry = { token: token != null ? token : "", at: Date.now() };
    memoryTokens.set(key, entry);
    try {
      yield (_a = ctx.kvStore) == null ? void 0 : _a.set(key, entry);
    } catch (e) {
    }
  });
}
function fetchFirstPage(ctx, query, mode) {
  return __async(this, null, function* () {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      query
    )}`;
    const res = yield ctx.axios.get(url, { headers: YT_HEADERS });
    innertubeConfig = extractInnertubeConfig(res.data);
    const data = parseInitialData(res.data);
    if (!data) return [];
    yield writeToken(ctx, query, 2, extractContinuationToken(data));
    return collectVideos(data, mode);
  });
}
function fetchContinuationPage(ctx, query, page, token, mode) {
  return __async(this, null, function* () {
    const apiKey = innertubeConfig.apiKey ? `&key=${encodeURIComponent(innertubeConfig.apiKey)}` : "";
    const res = yield ctx.axios.post(
      `https://www.youtube.com/youtubei/v1/search?prettyPrint=false${apiKey}`,
      {
        context: {
          client: {
            clientName: "WEB",
            clientVersion: innertubeConfig.clientVersion,
            hl: "en",
            gl: "US"
          }
        },
        continuation: token
      },
      {
        headers: __spreadProps(__spreadValues({}, YT_HEADERS), {
          "Content-Type": "application/json",
          "X-YouTube-Client-Name": "1",
          "X-YouTube-Client-Version": innertubeConfig.clientVersion,
          Origin: "https://www.youtube.com"
        }),
        timeout: 8e3
      }
    );
    const { posts, continuation } = parseContinuationResponse(res.data, mode);
    yield writeToken(ctx, query, page + 1, continuation);
    return posts;
  });
}
function fetchPage(ctx, query, page) {
  return __async(this, null, function* () {
    const mode = isShortsQuery(query) ? "shorts" : "videos";
    if (page <= 1) return fetchFirstPage(ctx, query, mode);
    let token = yield readToken(ctx, query, page);
    for (let p = 1; token === void 0 && p < page; p++) {
      if ((yield readToken(ctx, query, p + 1)) !== void 0) continue;
      if (p === 1) {
        yield fetchFirstPage(ctx, query, mode);
      } else {
        const previous = yield readToken(ctx, query, p);
        if (!previous) return [];
        yield fetchContinuationPage(ctx, query, p, previous, mode);
      }
    }
    token = yield readToken(ctx, query, page);
    if (!token) return [];
    try {
      return yield fetchContinuationPage(ctx, query, page, token, mode);
    } catch (err) {
      yield writeToken(ctx, query, page, void 0);
      throw err;
    }
  });
}
var TOKEN_TTL_MS, memoryTokens, innertubeConfig, tokenKey, getPosts, getSearchPosts, getSuggestions;
var init_posts = __esm({
  "providers/youtube/posts.ts"() {
    "use strict";
    init_parse();
    TOKEN_TTL_MS = 20 * 60 * 1e3;
    memoryTokens = /* @__PURE__ */ new Map();
    innertubeConfig = { clientVersion: FALLBACK_CLIENT_VERSION };
    tokenKey = (query, page) => `yt:cont:${query}:${page}`;
    getPosts = function(_0) {
      return __async(this, arguments, function* ({
        filter,
        page,
        providerContext
      }) {
        try {
          return yield fetchPage(providerContext, filter || "trending", page || 1);
        } catch (err) {
          console.error("YouTube getPosts error:", err);
          return [];
        }
      });
    };
    getSearchPosts = function(_0) {
      return __async(this, arguments, function* ({
        searchQuery,
        page,
        providerContext
      }) {
        try {
          return yield fetchPage(providerContext, searchQuery, page || 1);
        } catch (err) {
          console.error("YouTube getSearchPosts error:", err);
          return [];
        }
      });
    };
    getSuggestions = function(_0) {
      return __async(this, arguments, function* ({
        query,
        signal,
        providerContext
      }) {
        const text = (query || "").trim();
        if (!text) return [];
        try {
          const res = yield providerContext.axios.get(
            `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=en&q=${encodeURIComponent(
              text
            )}`,
            { headers: YT_HEADERS, timeout: 4e3, signal }
          );
          return parseSuggestions(res.data, 10);
        } catch (err) {
          console.error("YouTube getSuggestions error:", err);
          return [];
        }
      });
    };
  }
});

// providers/youtube/meta.ts
var meta_exports = {};
__export(meta_exports, {
  getComments: () => getComments,
  getMeta: () => getMeta
});
var getMeta, getComments;
var init_meta = __esm({
  "providers/youtube/meta.ts"() {
    "use strict";
    init_parse();
    getMeta = function(_0) {
      return __async(this, arguments, function* ({
        link,
        providerContext
      }) {
        var _a;
        const { axios, cheerio } = providerContext;
        const videoId = extractVideoId(link);
        const watchUrl2 = watchUrl(videoId);
        const isShort = /\/shorts\//i.test(link);
        try {
          const res = yield axios.get(watchUrl2, { headers: YT_HEADERS });
          const $ = cheerio.load(res.data);
          let title = $('meta[name="title"]').attr("content") || $('meta[property="og:title"]').attr("content") || $("title").text().replace(/ - YouTube$/, "").trim();
          let synopsis = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "";
          let channel = $('link[itemprop="name"]').attr("content") || $('span[itemprop="author"] link[itemprop="name"]').attr("content") || "";
          let formattedViewCount = "";
          let durationStr = "";
          let publishDateStr = "";
          let category = "";
          let likes = "";
          let publishedTime = "";
          let channelAvatar = "";
          const prMatch = res.data.match(/var ytInitialPlayerResponse\s*=\s*({.+?});(?:var|<\/script>)/) || res.data.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
          if (prMatch) {
            try {
              const pr = JSON.parse(prMatch[1]);
              const details = pr.videoDetails;
              if (details) {
                title = details.title || title;
                synopsis = details.shortDescription || synopsis;
                channel = details.author || channel;
                if (details.viewCount) {
                  formattedViewCount = formatViews(details.viewCount);
                }
                if (details.lengthSeconds) {
                  durationStr = formatDuration(details.lengthSeconds);
                }
              }
              const micro = (_a = pr.microformat) == null ? void 0 : _a.playerMicroformatRenderer;
              if (micro) {
                if (micro.category) {
                  category = micro.category;
                }
                const pubDate = micro.publishDate || micro.uploadDate;
                if (pubDate) {
                  const dateObj = new Date(pubDate);
                  if (!isNaN(dateObj.getTime())) {
                    publishDateStr = dateObj.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    });
                    publishedTime = relativeTime(dateObj.toISOString());
                  }
                }
              }
            } catch (e) {
            }
          }
          const dMatch = res.data.match(/var ytInitialData\s*=\s*({.+?});<\/script>/) || res.data.match(/ytInitialData\s*=\s*({.+?});/);
          if (dMatch) {
            try {
              let findLikes2 = function(obj) {
                if (!obj || typeof obj !== "object" || likes) return;
                if (obj.iconName === "LIKE" && typeof obj.title === "string") {
                  likes = obj.title.trim();
                  return;
                }
                if (obj.defaultText && typeof obj.defaultText.simpleText === "string" && /^[0-9.]+[KMB]?$/i.test(obj.defaultText.simpleText)) {
                  likes = obj.defaultText.simpleText.trim();
                  return;
                }
                for (const k of Object.keys(obj)) {
                  if (!likes) findLikes2(obj[k]);
                }
              };
              var findLikes = findLikes2;
              const data = JSON.parse(dMatch[1]);
              findLikes2(data);
            } catch (e) {
            }
          }
          let related = [];
          const initialData = parseInitialData(res.data);
          if (initialData) {
            const owner = findFirst(initialData, "videoOwnerRenderer");
            channelAvatar = pickImage(owner == null ? void 0 : owner.thumbnail);
            related = collectVideos(initialData, "videos").filter((v) => v.videoId !== videoId).slice(0, 20);
          }
          if (!likes) {
            const regexMatch = res.data.match(/"iconName":"LIKE"[^}]*?"title":"([^"]+)"/);
            if (regexMatch) likes = regexMatch[1].trim();
          }
          const tags = [];
          if (formattedViewCount) tags.push(formattedViewCount);
          if (likes) tags.push(likes.toLowerCase().includes("like") ? likes : `${likes} likes`);
          if (durationStr) tags.push(`\u23F1 ${durationStr}`);
          if (publishDateStr) tags.push(publishDateStr);
          if (category) tags.push(category);
          const landscapeImage = landscapeThumb(videoId);
          const fallbackImage = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          return {
            title: title || "YouTube Video",
            synopsis,
            image: landscapeImage || fallbackImage,
            poster: landscapeImage || fallbackImage,
            imdbId: "",
            type: "movie",
            cast: channel ? [channel] : void 0,
            tags: tags.length > 0 ? tags : void 0,
            rating: void 0,
            // Do not set rating to avoid "views/10" in the app UI
            linkList: [
              {
                title: "Watch Video",
                quality: "HD",
                directLinks: [
                  {
                    title: "Play Video",
                    link: `https://www.youtube.com/watch?v=${videoId}`,
                    type: "movie",
                    image: landscapeImage
                  }
                ]
              }
            ],
            webUrl: watchUrl2,
            // Structured fields for the YouTube layout.
            videoId,
            channelName: channel || void 0,
            channelAvatar: channelAvatar || void 0,
            views: formattedViewCount || void 0,
            publishedTime: publishedTime || void 0,
            duration: durationStr || void 0,
            likes: likes || void 0,
            aspectRatio: isShort ? 9 / 16 : 16 / 9,
            isShort,
            related
          };
        } catch (err) {
          console.error("YouTube getMeta error:", err);
          const landscapeImage = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`;
          return {
            title: "YouTube Video",
            synopsis: "",
            image: landscapeImage,
            poster: landscapeImage,
            imdbId: "",
            type: "movie",
            linkList: [
              {
                title: "Watch Video",
                quality: "HD",
                directLinks: [
                  {
                    title: "Play Video",
                    link: `https://www.youtube.com/watch?v=${videoId}`,
                    type: "movie"
                  }
                ]
              }
            ],
            webUrl: watchUrl2,
            videoId,
            aspectRatio: isShort ? 9 / 16 : 16 / 9,
            isShort,
            related: []
          };
        }
      });
    };
    getComments = function(_0) {
      return __async(this, arguments, function* ({
        link,
        continuation,
        signal,
        providerContext
      }) {
        const empty = { comments: [], count: "", continuation: void 0 };
        const { axios } = providerContext;
        try {
          let token = continuation;
          let config = extractInnertubeConfig("");
          if (!token) {
            const videoId = extractVideoId(link);
            const page = yield axios.get(watchUrl(videoId), {
              headers: YT_HEADERS,
              signal
            });
            config = extractInnertubeConfig(page.data);
            const initialData = parseInitialData(page.data);
            token = initialData ? extractCommentsToken(initialData) : void 0;
          }
          if (!token) return empty;
          const apiKey = config.apiKey ? `&key=${encodeURIComponent(config.apiKey)}` : "";
          const res = yield axios.post(
            `https://www.youtube.com/youtubei/v1/next?prettyPrint=false${apiKey}`,
            {
              context: {
                client: {
                  clientName: "WEB",
                  clientVersion: config.clientVersion,
                  hl: "en",
                  gl: "US"
                }
              },
              continuation: token
            },
            {
              headers: __spreadProps(__spreadValues({}, YT_HEADERS), {
                "Content-Type": "application/json",
                "X-YouTube-Client-Name": "1",
                "X-YouTube-Client-Version": config.clientVersion,
                Origin: "https://www.youtube.com"
              }),
              timeout: 8e3,
              signal
            }
          );
          const parsed = parseComments(res.data);
          return {
            comments: parsed.comments,
            count: parsed.count,
            continuation: parsed.continuation
          };
        } catch (err) {
          console.error("YouTube getComments error:", err);
          return empty;
        }
      });
    };
  }
});

// providers/youtube/stream.ts
var stream_exports = {};
__export(stream_exports, {
  getStream: () => getStream
});
function extractVideoId2(link) {
  const match = link.match(/(?:v=|\/watch\?v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/i) || link.match(/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : link;
}
function getVisitorData(axios, kvStore) {
  return __async(this, null, function* () {
    const fallback = "CgtSdHczNXdoNzhqQSiYoJ7WBjIKCgJJThIEGgAgZGLfAgrcAjIyLllUPUpQRHNlLWd6ZzYwc3FRN2JRSGNlMzdJWHFlelQxLUZMd00yR3M5X1gxZUd4RWtRdUxyakphLS1iaU1LMk9fcU83MHl4cExXcFRKd3p2ckcxcGMyU0RBS3FmYXVPOGpnd1dpWUtUdU5rQ1pZZzFZeHh3UkFnRXYtNE9YR1gtaWhvd2RvblQ3dENIV0NmdDgtZU9Ibi04M2QtUlBoZlhoZGpyNjE4YlFGY0VWVU5UanJBZ2g0cVFCRXJWbktnQm4tV1Eydm1CNE5qTl9FajBQVV9TaFlsYkxEOGY3WFJaUGVNRnIzTzhoejEyMDJQQlJpRUwyX1gtV2N0WG1YRmFvLVYyZXRpTWJDSUZLaU9jNEZUTU1lSktrWVBKV1A0WlV5eFZYeTNPZUlFMS1XeXpaa1Y3T1dVVDE5SllHcTNSN0NFcE5HNTNFZElmcW9UVDdMYjV2N09mdw==";
    try {
      const cached = yield kvStore == null ? void 0 : kvStore.get("youtube_visitor_data");
      if (cached) return cached;
      const res = yield axios.get("https://www.youtube.com", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout: 3e3
      });
      const match = typeof (res == null ? void 0 : res.data) === "string" ? res.data.match(/"visitorData"\s*:\s*"([^"]+)"/) : null;
      if (match && match[1]) {
        yield kvStore == null ? void 0 : kvStore.set("youtube_visitor_data", match[1]);
        return match[1];
      }
    } catch (e) {
    }
    return fallback;
  });
}
function extractCaptions(data) {
  var _a, _b, _c, _d, _e, _f;
  const subtitles = [];
  const captionTracks = (_b = (_a = data == null ? void 0 : data.captions) == null ? void 0 : _a.playerCaptionsTracklistRenderer) == null ? void 0 : _b.captionTracks;
  if (Array.isArray(captionTracks)) {
    for (const c of captionTracks) {
      if (c.baseUrl) {
        const name = ((_e = (_d = (_c = c.name) == null ? void 0 : _c.runs) == null ? void 0 : _d[0]) == null ? void 0 : _e.text) || ((_f = c.name) == null ? void 0 : _f.simpleText) || c.languageCode;
        subtitles.push({
          title: name,
          language: c.languageCode || name,
          type: "text/vtt",
          uri: c.baseUrl.includes("fmt=") ? c.baseUrl : `${c.baseUrl}&fmt=vtt`
        });
      }
    }
  }
  return subtitles;
}
function fetchFromInnerTube(axios, kvStore, videoId, signal, fast = false) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const streams = [];
    let subtitles = [];
    const visitorData = yield getVisitorData(axios, kvStore);
    try {
      const [visionRes, vrRes] = yield Promise.allSettled([
        axios.post(
          "https://www.youtube.com/youtubei/v1/player?prettyPrint=false&alt=json",
          {
            videoId,
            racyCheckOk: true,
            contentCheckOk: true,
            playbackContext: {
              contentPlaybackContext: {
                signatureTimestamp: 20731
              }
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
                deviceModel: "RealityDevice17,1"
              }
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-YouTube-Client-Name": "101",
              "X-YouTube-Client-Version": "1.02",
              "X-Goog-Visitor-Id": visitorData,
              "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
              Origin: "https://www.youtube.com",
              Referer: `https://www.youtube.com/watch?v=${videoId}`
            },
            timeout: 5e3,
            signal
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
                signatureTimestamp: 20731
              }
            },
            context: {
              client: {
                clientName: "ANDROID_VR",
                clientVersion: "1.60.19",
                deviceMake: "Oculus",
                deviceModel: "Quest 3",
                platform: "MOBILE",
                hl: "en",
                gl: "US"
              }
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0 (Linux; Android 12; Quest 3) AppleWebKit/537.36"
            },
            timeout: 5e3,
            signal
          }
        )
      ]);
      const vData = visionRes.status === "fulfilled" ? (_a = visionRes.value) == null ? void 0 : _a.data : null;
      const vrData = vrRes.status === "fulfilled" ? (_b = vrRes.value) == null ? void 0 : _b.data : null;
      const masterUrl = (_c = vData == null ? void 0 : vData.streamingData) == null ? void 0 : _c.hlsManifestUrl;
      if (masterUrl) {
        streams.push({
          server: "YouTube HLS (Auto)",
          link: masterUrl,
          type: "m3u8",
          quality: "auto",
          tag: "Audio + Video"
        });
        if (!fast) try {
          const playlist = yield axios.get(masterUrl, {
            responseType: "text",
            timeout: 5e3,
            signal
          });
          const text = typeof (playlist == null ? void 0 : playlist.data) === "string" ? playlist.data : "";
          for (const v of parseHlsVariants(text, masterUrl)) {
            streams.push({
              server: `YouTube HLS ${v.height}p`,
              link: v.url,
              type: "m3u8",
              quality: String(v.height),
              tag: v.separateAudio ? "HLS variant \u2022 Video only" : "HLS variant \u2022 Audio + Video"
            });
          }
        } catch (e) {
        }
      }
      const formats = ((_d = vrData == null ? void 0 : vrData.streamingData) == null ? void 0 : _d.formats) || [];
      for (const f of formats) {
        if (f.url) {
          const qualityLabel = f.qualityLabel || "360p";
          streams.push({
            server: `YouTube (${qualityLabel} MP4)`,
            link: f.url,
            type: "mp4",
            quality: qualityLabel.replace("p", ""),
            tag: "Audio + Video"
          });
        }
      }
      const vrUa = "com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip";
      const adaptive = [
        ...((_e = vrData == null ? void 0 : vrData.streamingData) == null ? void 0 : _e.adaptiveFormats) || [],
        ...((_f = vData == null ? void 0 : vData.streamingData) == null ? void 0 : _f.adaptiveFormats) || []
      ];
      const seenItag = /* @__PURE__ */ new Set();
      for (const f of adaptive) {
        const mime = String((f == null ? void 0 : f.mimeType) || "");
        if (!(f == null ? void 0 : f.url) || !/^(video|audio)\/mp4/.test(mime) || seenItag.has(f.itag)) continue;
        seenItag.add(f.itag);
        const codec = (((_g = mime.match(/codecs="([^"]+)"/)) == null ? void 0 : _g[1]) || "").split(".")[0];
        const size = Number(f.contentLength) || void 0;
        const bitrate = Math.round((Number(f.averageBitrate || f.bitrate) || 0) / 1e3);
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
            headers: { "User-Agent": vrUa }
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
            headers: { "User-Agent": vrUa }
          });
        }
      }
      subtitles = extractCaptions(vData) || extractCaptions(vrData) || [];
    } catch (e) {
    }
    return { streams, subtitles };
  });
}
function rankForStreaming(s) {
  if (isMaster(s)) return 0;
  if (isVariant(s)) return 1;
  return s.kind ? 3 : 2;
}
function rankForDownload(s) {
  if (isMaster(s)) return 3;
  if (s.kind) return 2;
  if (isVideoOnly(s)) return 2;
  return s.type === "mp4" ? 0 : 1;
}
function sortStreams(streams, preferredQuality, isDownload) {
  const cleanPref = preferredQuality && preferredQuality !== "auto" ? preferredQuality.replace("p", "") : "";
  streams.sort((a, b) => {
    const rank = isDownload ? rankForDownload : rankForStreaming;
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    if (cleanPref) {
      const aMatches = a.quality === cleanPref;
      const bMatches = b.quality === cleanPref;
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
    }
    return heightOf(b) - heightOf(a);
  });
}
var isMaster, isVariant, isVideoOnly, heightOf, getStream;
var init_stream = __esm({
  "providers/youtube/stream.ts"() {
    "use strict";
    init_parse();
    isMaster = (s) => s.quality === "auto";
    isVariant = (s) => {
      var _a;
      return s.type === "m3u8" && !isMaster(s) && !!((_a = s.tag) == null ? void 0 : _a.startsWith("HLS variant"));
    };
    isVideoOnly = (s) => {
      var _a;
      return !!((_a = s.tag) == null ? void 0 : _a.includes("Video only"));
    };
    heightOf = (s) => parseInt(s.quality || "", 10) || 0;
    getStream = function(_0) {
      return __async(this, arguments, function* ({
        link,
        signal,
        providerContext,
        isDownload,
        fast
      }) {
        const { axios, kvStore } = providerContext;
        const videoId = extractVideoId2(link);
        if (!videoId) return [];
        const preferredQuality = yield kvStore == null ? void 0 : kvStore.get("preferredQuality");
        const { streams, subtitles } = yield fetchFromInnerTube(
          axios,
          kvStore,
          videoId,
          signal,
          !!fast && !isDownload
        );
        if (streams.length === 0) {
          return [];
        }
        const seenUrls = /* @__PURE__ */ new Set();
        const uniqueStreams = [];
        for (const s of streams) {
          if (!seenUrls.has(s.link)) {
            seenUrls.add(s.link);
            uniqueStreams.push(s);
          }
        }
        if (subtitles.length > 0) {
          for (const s of uniqueStreams) {
            if (!s.subtitles) {
              s.subtitles = subtitles;
            }
          }
        }
        sortStreams(uniqueStreams, preferredQuality, isDownload);
        return uniqueStreams;
      });
    };
  }
});

// providers/youtube/youtube.entry.js
Object.assign(exports, (init_catalog(), __toCommonJS(catalog_exports)));
Object.assign(exports, (init_posts(), __toCommonJS(posts_exports)));
Object.assign(exports, (init_meta(), __toCommonJS(meta_exports)));
Object.assign(exports, (init_stream(), __toCommonJS(stream_exports)));
