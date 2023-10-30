import { Octokit } from "@octokit/rest";
import { z } from "zod";

import { env } from "~/env/server.mjs";
import { publicProcedure, router } from "~/server/api/trpc";
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
      // return testUsers;
      const q = `${input.query}+location:${input.location}+language:${input.language}+followers:>=2000`;
      const response = await octokit.rest.search.users({
        q,
      });

      return response.data;
    }),
});
