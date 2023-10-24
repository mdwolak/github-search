import { UserRole } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { httpForbidden, httpUnauthorized } from "~/server/api/trpcHelper";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;

/**
 * Reusable middlewares
 * @see https://trpc.io/docs/server/middlewares
 */
const loggerMiddleware = t.middleware(async (opts) => {
  const start = Date.now();

  const result = await opts.next();

  const durationMs = Date.now() - start;
  const meta = { path: opts.path, type: opts.type, durationMs };

  result.ok
    ? console.log("OK request timing:", meta)
    : console.error("Non-OK request timing", meta);

  return result;
});

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw httpUnauthorized();
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const isAdmin = isAuthed.unstable_pipe(async ({ ctx, next }) => {
  if (ctx.session.user.role !== UserRole.Admin) {
    throw httpForbidden();
  }
  return next({ ctx });
});

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure.use(loggerMiddleware);

/**
 * Protected procedures
 **/
export const protectedProcedure = publicProcedure.use(isAuthed);

export const adminProcedure = publicProcedure.use(isAdmin);
