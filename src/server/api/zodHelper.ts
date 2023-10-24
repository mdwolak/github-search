import { z } from "zod";

export function getZodErrorWithCustomIssue(message: string, path: (string | number)[]) {
  return new z.ZodError([
    {
      code: z.ZodIssueCode.custom,
      message,
      path,
    },
  ]);
}
