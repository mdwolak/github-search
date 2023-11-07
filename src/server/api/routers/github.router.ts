import { z } from "zod";

import type { SearchUsersResponse } from "~/lib/schemas/graphQL.schema";
import { publicProcedure, router } from "~/server/api/trpc";
import { Octokit, RequestError } from "~/server/octokit";

//
// READ

const octokit = new Octokit();

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
  infinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ input }) => {
      const cursor = input.cursor || 0;
      const limit = input.limit || 10;

      const data = Array(limit)
        .fill(0)
        .map((_, i) => {
          return {
            name: "Project " + (i + cursor) + ` (server time: ${Date.now()})`,
            id: i + cursor,
          };
        });

      const nextId = cursor < 10 ? data[data.length - 1].id + 1 : null;
      const previousId = cursor > -10 ? data[0].id - limit : null;
      //res.json({ data, nextId, previousId })

      console.log("data", data);

      return {
        data,
        nextId,
        previousId,
      };
    }),

  searchUsers: publicProcedure
    .input(
      z.object({
        query: z.string(),
        location: z.string(),
        language: z.string(),
      })
    )
    .query(async ({ input }) => {
      console.log("input", input);
      //return testUsers;
      const q = `${input.query && input.query} ${input.location && "location:" + input.location} ${
        input.language && "language:" + input.language
      }`;
      console.log("q", q);
      try {
        const response = await octokit.graphql<SearchUsersResponse>(
          `
            query SearchUsers($q: String!, $perPage: Int, $after: String) {
              search(type: USER, query: $q, first: $perPage, after: $after) {
                totalCount : userCount
                pageInfo {
                  hasNextPage
                  endCursor
                }
                items: nodes {
                  ... on User {
                    avatarUrl
                    bio
          
                    followers {
                      totalCount
                    }
              
                    login
                    name
                    updatedAt
                    url
                    websiteUrl
                  }
                }
              }
            }
        `,
          {
            q,
            perPage: 10,
            after: null,
          }
        );
        const result = {
          ...response.search,
          items: response.search.items.filter((user) => Object.keys(user).length > 0),
        };
        console.log("response", result);
        return result;
      } catch (error) {
        if (error instanceof RequestError) {
          // handle Octokit error
          // error.message; // Oops
          // error.status; // 500
          // error.request; // { method, url, headers, body }
          // error.response; // { url, status, headers, data }
          console.log("e", error);
        } else {
          // handle all other errors
          throw error;
        }
      }
    }),
});
