import z from "zod";

type PageInfoForward = {
  hasNextPage: boolean;
  endCursor: string;
};
export interface User {
  avatarUrl: string;
  bio?: string;
  company?: string | null;
  createdAt: string;
  email?: string | null; // The user's public email address
  //estimatedNextSponsorsPayoutInCents: number;
  followers?: { totalCount: number };
  hasSponsorsListing: boolean;
  id: string;
  isHireable: boolean;
  location?: string | null;
  login: string;
  name: string;
  //resourcePath: string; // The path to the user's GitHub profile relative to https://github.com/
  socialAccounts: {
    totalCount: number;
    nodes: {
      displayName: string;
      provider: string;
      url: string;
    }[];
  };
  status?: { message: string } | null; // The user's description of what they're currently doing.
  twitterUsername?: string | null;
  updatedAt: string;
  url: string; // The URL for the user's GitHub profile
  websiteUrl: string; // The user's public website URL
}

export type SearchUsersResponse = {
  search: {
    totalCount: number;
    pageInfo: PageInfoForward;
    items: User[];
    retrievedCount: number;
    filteredCount: number;
  };
};

export const searchUsersParamsSchema = z.object({
  query: z.string().optional(),
  hasWebsiteUrl: z.union([z.boolean(), z.string().transform((val) => val === "true")]).optional(),
  extended: z.union([z.boolean(), z.string().transform((val) => val === "true")]).optional(),

  limit: z.coerce.number().min(1).max(100).default(10),
  cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
});
export type SearchUsersParamsInput = z.infer<typeof searchUsersParamsSchema>;
