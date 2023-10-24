import bcrypt from "bcryptjs";

import { createUserSchema } from "~/lib/schemas/user.schema";
import { protectedProcedure, publicProcedure, router } from "~/server/api/trpc";
import {
  type ErrorHandlerOptions,
  getErrorFromUnknown,
  handleRequest,
  httpConflictWithZod,
} from "~/server/api/trpcHelper";
import { getZodErrorWithCustomIssue } from "~/server/api/zodHelper";
import * as userService from "~/server/services/user.service";

const errorHandler = (error: unknown) => {
  const errorHandlerOptions: ErrorHandlerOptions = {
    entityName: "User",
  };

  throw getErrorFromUnknown(error, errorHandlerOptions);
};

export const userRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  create: publicProcedure.input(createUserSchema).mutation(({ input }) =>
    handleRequest(async () => {
      const existingUser = await userService.findUnique({ email: input.email.toLowerCase() });
      if (existingUser) {
        throw httpConflictWithZod(getZodErrorWithCustomIssue("Email already taken", ["email"]));
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);
      const user = await userService.create({
        email: input.email.toLocaleLowerCase(),
        name: input.name.toLocaleLowerCase(),
        password: hashedPassword,
      });

      return { user };
    }, errorHandler)
  ),
});
