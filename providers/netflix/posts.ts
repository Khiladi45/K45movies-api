import { makeGetPosts, makeGetSearchPosts } from "../cncStudios";

export const getPosts = makeGetPosts("netflix");
export const getSearchPosts = makeGetSearchPosts("netflix");
