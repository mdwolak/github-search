import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "~/env/server.mjs";
import { createContext } from "~/server/api/context";
import { appRouter } from "~/server/api/routers/_app";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  //Here you can handle or change errors
  // @see https://trpc.io/docs/server/error-handling#handling-errors
  onError:
    env.NODE_ENV === "development"
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ error, path, input, ctx, type, req }) => {
          console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
        }
      : undefined,
});
