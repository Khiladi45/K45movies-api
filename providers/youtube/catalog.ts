import { Catalog } from "../types";

export const catalog: Catalog[] = [
  { title: "Trending", filter: "trending" },
  { title: "Music", filter: "trending music" },
  { title: "Live", filter: "live now" },
  { title: "Gaming", filter: "trending gaming" },
  // "#shorts" switches posts.ts into Shorts mode (portrait 9:16 results only).
  { title: "Shorts", filter: "#shorts trending" },
  { title: "Movies & Trailers", filter: "official movie trailers" },
  { title: "News", filter: "world news" },
  { title: "Documentaries", filter: "documentary full" },
  { title: "Tech & Science", filter: "technology science" },
];

export const genres: Catalog[] = [
  { title: "Podcasts", filter: "popular podcasts" },
  { title: "Animation", filter: "animation short film" },
  { title: "Comedy", filter: "comedy standup" },
  { title: "Education", filter: "educational documentary" },
  { title: "Sports", filter: "sports highlights" },
  { title: "Nature", filter: "4k nature wildlife" },
];
