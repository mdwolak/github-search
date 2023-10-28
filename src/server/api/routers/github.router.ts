import { Octokit } from "@octokit/rest";
import { z } from "zod";

import { env } from "~/env/server.mjs";
import { publicProcedure, router } from "~/server/api/trpc";

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
        location: z.string(),
        language: z.string(),
      })
    )
    .query(async ({ input }) => {
      console.log("input", input);

      const response = await octokit.rest.search.users({
        q: `location:${input.location}+language:${input.language}`,
      });

      return response.data;
    }),
});
