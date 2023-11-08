type PageInfoForward = {
  hasNextPage: boolean;
  endCursor: string;
};
export interface User {
  id: number;
  login: string;
  followers?: { totalCount: number };
  name: string;
  bio?: string;
  websiteUrl: string;
  avatarUrl: string;
  updatedAt: string;
  url: string;
}
export type SearchUsersResponse = {
  search: {
    totalCount: number;
    pageInfo: PageInfoForward;
    items: User[];
  };
};
