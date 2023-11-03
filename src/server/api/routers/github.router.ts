import { z } from "zod";

import { env } from "~/env/server.mjs";
import { publicProcedure, router } from "~/server/api/trpc";
import { Octokit } from "~/server/octokit";
import testUsers from "~/testUsers.exclude.json";

//
// READ

const octokit = new Octokit({
  //sends request with HTTP header: `Authorization: token <GITHUB_AUTH_TOKEN>`
  auth: env.GITHUB_AUTH_TOKEN,
});

export const githubRouter = router({
  /**
   * READ
   */
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
      const response = await octokit.request("POST /graphql", {
        query: `
        query SearchUsers($query: String = "${q}", $perPage: Int = 1, $after: String) {
          search(type: USER, query: $query, first: $perPage, after: $after) {
            userCount
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
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
        queryVariables: {
          query: q,
          perPage: 10,
          after: null,
        },
      });
      console.log("response", response.data.data.search);
      return response.data.data.search;
    }),
});
