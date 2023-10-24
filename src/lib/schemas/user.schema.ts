import z, { type TypeOf } from "zod";

export const createUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().min(1, "Email address is required").email("Email Address is invalid"),
    password: z
      .string()
      .trim()
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export type CreateUserInput = TypeOf<typeof createUserSchema>;
