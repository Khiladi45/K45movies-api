import { makeGetPosts, makeGetSearchPosts } from "../cncStudios";

export const getPosts = makeGetPosts("starWars");
export const getSearchPosts = makeGetSearchPosts("starWars");
