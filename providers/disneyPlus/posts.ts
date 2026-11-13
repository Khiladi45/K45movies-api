import { makeGetPosts, makeGetSearchPosts } from "../cncStudios";

export const getPosts = makeGetPosts("disneyPlus");
export const getSearchPosts = makeGetSearchPosts("disneyPlus");
