type PageInfoForward = {
  hasNextPage: boolean;
  endCursor: string;
};
export interface GitHubUser {
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

export type GitHubSearchUsersResponse = {
  search: {
    totalCount: number;
    pageInfo: PageInfoForward;
    items: GitHubUser[];
    retrievedCount: number;
    filteredCount: number;
  };
};
