import z, { type ZodString } from "zod";

export const cleanString = (value: unknown): string =>
  typeof value !== "string" ? String(value) : value.replace(/\s\s+/g, " ").trim();

//cleans string before validation
export const preprocessCleanString = (schema: ZodString) => z.preprocess(cleanString, schema);
// usage:   postcode: preprocessCleanString(nonEmptyString.regex(ukPostcodeRegex, "Invalid UK postcode").toUpperCase())

export const requiredString = z.string().trim().min(1, "This field cannot be empty"); //required
export const requiredStringCleaned = requiredString.transform(cleanString);

export const optionalStringCleaned = z.string().transform(cleanString);

export const filterQuery = z.object({
  limit: z.number().default(10),
  page: z.number().default(1),
});

export const filterQueryWithOrg = z.object({
  orgId: z.number(),
  limit: z.number().default(10),
  page: z.number().default(1),
});

export const numericId = z.number();
export const orgId = z.number();
export const duration = z.coerce.number().int().min(1, "Specify number between 1 and 600").max(600);

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const hoursWithMinutes = z
  .date()
  .or(z.string())
  .transform((val, ctx) => {
    if (val instanceof Date) return val; //string is transformed to Date on the client

    const iso8601Date = `2020-01-01T${val}:00Z`;

    const milliseconds = Date.parse(iso8601Date);
    if (!milliseconds) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid time" });

    const result = new Date();
    result.setTime(milliseconds);
    return result;
  });
