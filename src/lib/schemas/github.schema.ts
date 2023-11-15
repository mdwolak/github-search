import z from "zod";

import { booleanOrString } from "~/lib/schemas/common.schema";

export const searchUsersFilterParamsSchema = z.object({
  hasWebsiteUrl: booleanOrString.optional(),
  isContactable: booleanOrString.optional(),
  isHireable: booleanOrString.optional(),
  noCompany: booleanOrString.optional(),
  recentlyActive: booleanOrString.optional(), //last 2 months
});
export type SearchUsersFilterParamsInput = z.infer<typeof searchUsersFilterParamsSchema>;

export const searchUsersParamsSchema = z
  .object({
    query: z.string().optional(),
    extended: booleanOrString.optional(),

    limit: z.coerce.number().min(1).max(100).default(10),
    cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
  })
  .merge(searchUsersFilterParamsSchema);
export type SearchUsersParamsInput = z.infer<typeof searchUsersParamsSchema>;
