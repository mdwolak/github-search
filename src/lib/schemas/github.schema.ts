import z from "zod";

export const searchUsersParamsSchema = z.object({
  query: z.string().optional(),
  hasWebsiteUrl: z.union([z.boolean(), z.string().transform((val) => val === "true")]).optional(),
  extended: z.union([z.boolean(), z.string().transform((val) => val === "true")]).optional(),

  limit: z.coerce.number().min(1).max(100).default(10),
  cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
});
export type SearchUsersParamsInput = z.infer<typeof searchUsersParamsSchema>;
