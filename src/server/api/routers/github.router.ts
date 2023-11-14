import { z } from "zod";

import type { SearchUsersParamsInput, User } from "~/lib/schemas/ghUser.schema";
import { type SearchUsersResponse, searchUsersParamsSchema } from "~/lib/schemas/ghUser.schema";
import { publicProcedure, router } from "~/server/api/trpc";
import { searchUsersQuery } from "~/server/graphql/SearchUsers";
import { Octokit } from "~/server/octokit";

const octokit = new Octokit();

let cache: SearchUsersResponse["search"];
const devMode = false;
/**
 * @see https://github.com/octokit/octokit.js#graphql-api-queries
 * @see https://docs.github.com/en/graphql/reference/objects#user
 * @see https://github.com/octokit/plugin-paginate-graphql.js
 *
 * To get all results use pagination. Example:
 * const { allItems } = await octokit.graphql.paginate(query, variables);
 */
export const githubRouter = router({
  /**
   * READ
   */
  searchUsersInfinite: publicProcedure.input(searchUsersParamsSchema).query(async ({ input }) => {
    console.log("input", input);

    if (devMode && cache) return cache;

    let cursor = input.cursor;
    let response: SearchUsersResponse;
    let filteredItems: SearchUsersResponse["search"]["items"] = [];
    let retrievedCount = 0;
    let filteredCount = 0;

    do {
      response = await octokit.graphql<SearchUsersResponse>(searchUsersQuery, {
        q: input.query + " type:user",
        perPage: input.limit,
        after: cursor,
        extended: input.extended,
      });

      retrievedCount += response.search.items.length;

      filteredItems = filterItems(response.search.items, input); //response.search.items.filter((user) => Object.keys(user).length > 0);
      filteredCount += filteredItems.length;

      cursor = response.search.pageInfo.endCursor;
    } while (cursor && filteredCount < 1);

    const result = { ...response.search, items: filteredItems, retrievedCount, filteredCount };

    console.log("result", result);

    if (devMode) cache = result;

    return result;
  }),

  searchUsers: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input }) => {
      console.log("input", input);
      //return testUsers;

      console.log("q", input.query);
      try {
        const response = await octokit.graphql<SearchUsersResponse>(searchUsersQuery, {
          q: input.query,
          perPage: 10,
          after: null,
        });
        const result = {
          ...response.search,
          items: response.search.items.filter((user) => Object.keys(user).length > 0),
        };
        console.log("response", result);
        return result;
      } catch (error) {
        console.log("e", error);
        throw error;
      }
    }),
});

const filterItems = (items: User[], filters: SearchUsersParamsInput): User[] => {
  return items.filter((user) => {
    if (Object.keys(user).length == 0) return false;
    if (filters.hasWebsiteUrl && !user.websiteUrl) return false;
    return true;
  });
};
