import { z } from "zod";

import { type SearchUsersParamsInput, searchUsersParamsSchema } from "~/lib/schemas/github.schema";
import { publicProcedure, router } from "~/server/api/trpc";
import { searchUsersQuery } from "~/server/graphql/SearchUsers";
import type { GitHubSearchUsersResponse, GitHubUser } from "~/server/graphql/github.types";
import { Octokit } from "~/server/octokit";

const octokit = new Octokit();

const GITHUB_ORG_REGEX = /@(\w+)/g;
const HIREABLE_KEYWORDS = /\b(hir\|job|free-lanc|freelanc|project)\w*\b/gi;

type SearchUserInfiniteHelperReturnType = ReturnType<
  typeof searchUserInfiniteHelper
> extends Promise<infer T>
  ? T
  : never;
let cache: SearchUserInfiniteHelperReturnType;
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

    const result = await searchUserInfiniteHelper(input);

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
        const response = await octokit.graphql<GitHubSearchUsersResponse>(searchUsersQuery, {
          q: input.query,
          perPage: 10,
          after: null,
        });
        const result = {
          ...response.search,
          items: response.search.items,
        };
        console.log("response", result);
        return result;
      } catch (error) {
        console.log("e", error);
        throw error;
      }
    }),
});

async function searchUserInfiniteHelper(input: SearchUsersParamsInput) {
  let cursor = input.cursor;
  let response: GitHubSearchUsersResponse;
  let filteredItems: ReturnType<typeof mapGitHubUser>[] = [];
  let retrievedCount = 0;
  let filteredCount = 0;

  do {
    response = await octokit.graphql<GitHubSearchUsersResponse>(searchUsersQuery, {
      q: input.query + " type:user",
      perPage: input.limit,
      after: cursor,
      extended: input.extended,
    });

    retrievedCount += response.search.items.length;
    const mappedItems = response.search.items.map(mapGitHubUser);
    filteredItems = mappedItems.filter(getSearchUsersFilter(input)); //response.search.items.filter((user) => Object.keys(user).length > 0);
    filteredCount += filteredItems.length;

    cursor = response.search.pageInfo.endCursor;
  } while (cursor && filteredCount < 1);

  const result = {
    totalCount: response.search.totalCount,
    pageInfo: response.search.pageInfo,
    items: filteredItems,
    retrievedCount,
    filteredCount,
  };
  return result;
}

function mapGitHubUser(user: GitHubUser) {
  const updatedAtDate = new Date(user.updatedAt);
  const timeDiff = Math.abs(new Date().getTime() - updatedAtDate.getTime());
  const monthsAgo = Math.floor(timeDiff / (1000 * 3600 * 24) / 30);
  const activityIndex = monthsAgo >= 0 && monthsAgo <= 9 ? monthsAgo : 10;

  // Replace @org with a link to the org's GitHub page
  const companyHtml = user.company?.replace(
    GITHUB_ORG_REGEX,
    '<a href="https://github.com/$1" target="_blank">@$1</a>'
  );

  //is user contactable by selected means of communication
  const isContactable = !!user.email || user.socialAccounts.totalCount > 0 || !!user.websiteUrl;

  // Highlight hireable keywords in the bio using <strong> tags
  const bioHtml = user.bio?.replace(HIREABLE_KEYWORDS, "<strong>$1</strong>");

  // Check if the bio contains any hireable keywords
  const hireableKeywords = bioHtml !== user.bio;
  const isHireable = user.isHireable || user.hasSponsorsListing || hireableKeywords;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bio, company, updatedAt, ...userInfo } = user;

  return {
    ...userInfo,
    extendedAttributes: {
      activityIndex,
      companyHtml,
      isContactable,
      bioHtml,
      isHireable,
    },
  };
}

const getSearchUsersFilter = (filters: SearchUsersParamsInput) => {
  return (user: ReturnType<typeof mapGitHubUser>) => {
    if (Object.keys(user).length == 0) return false;
    if (filters.hasWebsiteUrl && !user.websiteUrl) return false;
    return true;
  };
};
