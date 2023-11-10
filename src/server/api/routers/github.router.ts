import { z } from "zod";

import type { SearchUsersResponse } from "~/lib/schemas/graphQL.schema";
import { publicProcedure, router } from "~/server/api/trpc";
import { searchUsersQuery } from "~/server/graphql/SearchUsers";
import { Octokit } from "~/server/octokit";

const octokit = new Octokit();

let cache: SearchUsersResponse["search"];
const devMode = true;
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
  searchUsersInfinite: publicProcedure
    .input(
      z.object({
        query: z.string(),
        extended: z.boolean().nullish(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ input }) => {
      console.log("q", input.query);

      if (devMode && cache) return cache;

      const response = await octokit.graphql<SearchUsersResponse>(searchUsersQuery, {
        q: input.query + " type:user",
        perPage: input.limit || 10,
        after: input.cursor,
        extended: input.extended,
      });
      const result = { ...response.search };
      console.log("response", result);

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
