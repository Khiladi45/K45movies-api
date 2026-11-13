import { makeGetPosts, makeGetSearchPosts } from "../cncStudios";

export const getPosts = makeGetPosts("marvel");
export const getSearchPosts = makeGetSearchPosts("marvel");
